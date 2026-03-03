// Global Dashboard State
let dashboardData = [];
let chartInstances = {};
let currentFilters = {
    cliente: 'all',
    equipe: 'all',
    tipo: 'all'
};

// DOM Elements
const excelUpload = document.getElementById('excel-upload');
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// KPIs Elements
const kpiHoras = document.getElementById('kpi-horas');
const kpiTarefas = document.getElementById('kpi-tarefas');
const kpiUrgentes = document.getElementById('kpi-urgentes');

// Filter Elements
const filterCliente = document.getElementById('filter-cliente');
const filterEquipe = document.getElementById('filter-equipe');
const filterTipo = document.getElementById('filter-tipo');

// Initialize Dashboard
function init() {
    setupTabs();
    setupFilters();
    setupFileUpload();
    
    // Register Datalabels Plugin
    Chart.register(ChartDataLabels);
    
    // Default Chart Options
    Chart.defaults.font.family = "'Outfit', 'Gorga Grotesk', sans-serif";
    Chart.defaults.color = '#1A1A1A';
    Chart.defaults.plugins.tooltip.backgroundColor = '#1F004A';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
}

// ==========================================
// File Upload & Data Parsing (SheetJS)
// ==========================================
function setupFileUpload() {
    excelUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            
            // Assume data is in the first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            processData(rawJson);
        };
        reader.readAsBinaryString(file);
    });
}

function processData(rawData) {
    dashboardData = rawData.map(row => {
        return {
            id: row['ID'] || '',
            titulo: row['Título'] || '',
            cliente: row['Cliente'] || 'Sem Cliente',
            equite: row['Equipes'] || 'Sem Equipe',
            tipo: row['Tipo'] || 'Sem Tipo',
            etapa: row['Etapa'] || 'Sem Etapa',
            quadro: row['Quadro'] || 'Sem Quadro',
            tags: row['Tags'] ? row['Tags'].split(',').map(t => t.trim()) : [],
            horasTrabalhadas: parseFloat(row['Horas trabalhadas (h)']) || 0,
            urgente: row['Urgente'] === 'verdadeiro' || row['Urgente'] === true || row['Urgente'] === 'SIM' ? 'Sim' : 'Não'
        };
    });

    populateFilters(dashboardData);
    updateDashboard();
}

// ==========================================
// Filtering Logic
// ==========================================
function setupFilters() {
    [filterCliente, filterEquipe, filterTipo].forEach(select => {
        select.addEventListener('change', (e) => {
            currentFilters[e.target.id.replace('filter-', '')] = e.target.value;
            updateDashboard();
        });
    });
}

function populateFilters(data) {
    const clientes = new Set();
    const equipes = new Set();
    const tipos = new Set();

    data.forEach(item => {
        if(item.cliente) clientes.add(item.cliente);
        
        // Handle multiple teams if separated by comma
        if(item.equite) {
            item.equite.split(',').forEach(e => equipes.add(e.trim()));
        }

        if(item.tipo) tipos.add(item.tipo);
    });

    const addOptions = (selectElem, itemsSet) => {
        // Keep only the "All" option
        selectElem.innerHTML = `<option value="all">Todas as opções</option>`;
        Array.from(itemsSet).sort().forEach(item => {
            selectElem.innerHTML += `<option value="${item}">${item}</option>`;
        });
    };

    addOptions(filterCliente, clientes);
    addOptions(filterEquipe, equipes);
    addOptions(filterTipo, tipos);
}

function getFilteredData() {
    return dashboardData.filter(item => {
        const matchCliente = currentFilters.cliente === 'all' || item.cliente === currentFilters.cliente;
        const matchTipo = currentFilters.tipo === 'all' || item.tipo === currentFilters.tipo;
        
        // Check if the current filter team is included in the item's teams (which can be a comma-separated list)
        const matchEquipe = currentFilters.equipe === 'all' || (item.equite && item.equite.includes(currentFilters.equipe));

        return matchCliente && matchEquipe && matchTipo;
    });
}

function updateDashboard() {
    const data = getFilteredData();
    updateKPIs(data);
    
    // Update Charts (Tab 1)
    renderChartClientes(data);
    renderChartTipo(data);
    
    // Update Charts (Tab 2)
    renderChartEtapas(data);
    renderChartEquipes(data);
    renderChartHeatmap(data);
    
    // Update Charts (Tab 3)
    renderChartTags(data);
}

// ==========================================
// KPIs and Visuals
// ==========================================
function updateKPIs(data) {
    let totalHoras = 0;
    let totalTarefas = data.length;
    let horasUrgentes = 0;

    data.forEach(item => {
        totalHoras += item.horasTrabalhadas;
        if (item.urgente === 'Sim') {
            horasUrgentes += item.horasTrabalhadas;
        }
    });

    const percentUrgentes = totalHoras > 0 ? ((horasUrgentes / totalHoras) * 100).toFixed(1) : 0;

    kpiHoras.textContent = `${totalHoras.toFixed(1)}h`;
    kpiTarefas.textContent = totalTarefas;
    kpiUrgentes.textContent = `${percentUrgentes}%`;
}

// ==========================================
// Helper for Chart Registration
// ==========================================
function createChart(canvasId, type, data, options) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
    
    chartInstances[canvasId] = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });
}

// ==========================================
// Chart Aggregations & Rendering
// ==========================================
function renderChartClientes(data) {
    const agg = {};
    data.forEach(item => {
        if (!agg[item.cliente]) agg[item.cliente] = 0;
        agg[item.cliente] += item.horasTrabalhadas;
    });

    const sorted = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    createChart('chart-clientes', 'bar', {
        labels: sorted.map(d => d[0]),
        datasets: [{
            label: 'Horas Trabalhadas',
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: '#8936C3',
            borderRadius: 6
        }]
    }, {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                color: '#fff',
                font: { weight: 'bold' }
            }
        }
    });
}

function renderChartTipo(data) {
    const agg = {};
    data.forEach(item => {
        if (!agg[item.tipo]) agg[item.tipo] = 0;
        agg[item.tipo] += item.horasTrabalhadas;
    });

    const sorted = Object.entries(agg).sort((a, b) => b[1] - a[1]);

    createChart('chart-tipo', 'doughnut', {
        labels: sorted.map(d => d[0]),
        datasets: [{
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: ['#1F004A', '#8936C3', '#BD5FFF', '#D092FB', '#FFD166', '#ece7fa'],
            borderWidth: 0
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' },
            datalabels: {
                color: '#fff',
                font: { weight: 'bold', size: 10 },
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => { sum += Number(data); });
                    let percentage = (value*100 / sum).toFixed(0)+"%";
                    return percentage === "0%" ? "" : percentage;
                }
            }
        }
    });
}

function renderChartEtapas(data) {
    // Assuming we want Etapas grouped by Quadro logically, or just top Etapas
    const agg = {};
    data.forEach(item => {
        if (!agg[item.etapa]) agg[item.etapa] = 0;
        agg[item.etapa] += item.horasTrabalhadas;
    });

    const sorted = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 12);

    createChart('chart-etapas', 'bar', {
        labels: sorted.map(d => d[0]),
        datasets: [{
            label: 'Horas na Etapa',
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: '#FFD166',
            borderRadius: 6
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'top',
                color: '#1A1A1A',
                font: { weight: 'bold' }
            }
        }
    });
}

function renderChartEquipes(data) {
    const agg = {};
    data.forEach(item => {
        let equipes = item.equite ? item.equite.split(',') : ['Sem Equipe'];
        equipes.forEach(eq => {
            const trimmed = eq.trim();
            if (!agg[trimmed]) agg[trimmed] = 0;
            agg[trimmed] += item.horasTrabalhadas;
        });
    });

    const sorted = Object.entries(agg).sort((a, b) => b[1] - a[1]);

    createChart('chart-equipes', 'bar', {
        labels: sorted.map(d => d[0]),
        datasets: [{
            label: 'Horas Trabalhadas',
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: '#1F004A',
            borderRadius: 6
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
             datalabels: {
                anchor: 'end',
                align: 'top',
                color: '#1A1A1A',
                font: { weight: 'bold' }
            }
        }
    });
}

function renderChartHeatmap(data) {
    // Using a grouped/stacked bar chart as a proxy for heatmap to show Client vs Urgent hours
    // (A real heatmap requires more complex Chart.js specialized plugins not included by default, 
    // a stacked bar is great for "Urgência por Cliente")
    
    const agg = {}; // cliente -> { urgente: 0, nao_urgente: 0 }
    data.forEach(item => {
        if (!agg[item.cliente]) agg[item.cliente] = { urgente: 0, nao_urgente: 0 };
        
        if (item.urgente === 'Sim') {
            agg[item.cliente].urgente += item.horasTrabalhadas;
        } else {
            agg[item.cliente].nao_urgente += item.horasTrabalhadas;
        }
    });

    // Sort by total urgent hours desc
    const sorted = Object.entries(agg).sort((a, b) => b[1].urgente - a[1].urgente).slice(0, 8);

    createChart('chart-heatmap-equipes', 'bar', {
        labels: sorted.map(d => d[0]),
        datasets: [
            {
                label: 'Horas Urgentes',
                data: sorted.map(d => d[1].urgente.toFixed(1)),
                backgroundColor: '#BD5FFF'
            },
            {
                label: 'Horas Normais',
                data: sorted.map(d => d[1].nao_urgente.toFixed(1)),
                backgroundColor: '#ece7fa'
            }
        ]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { stacked: true },
            y: { stacked: true }
        },
        plugins: {
            datalabels: {
                color: (ctx) => ctx.datasetIndex === 0 ? '#fff' : '#1A1A1A',
                formatter: (value) => value > 0 ? value : ''
            }
        }
    });
}

function renderChartTags(data) {
    const agg = {};
    data.forEach(item => {
        item.tags.forEach(tag => {
            if (!tag) return;
            if (!agg[tag]) agg[tag] = 0;
            agg[tag] += item.horasTrabalhadas;
        });
    });

    const sorted = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 15);

    createChart('chart-tags', 'bar', {
        labels: sorted.map(d => d[0]),
        datasets: [{
            label: 'Horas por Tag',
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: '#8936C3',
            borderRadius: 4
        }]
    }, {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
             datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#fff',
                font: { weight: 'bold' }
            }
        }
    });
}


// ==========================================
// Tabs Navigation
// ==========================================
function setupTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            tabContents.forEach(tc => tc.style.display = 'none');
            const target = document.getElementById(tab.dataset.target);
            target.style.display = 'grid'; // because we use display grid usually, but wait, tab-content is generic.
            
            // If it's a grid, make it a grid.
            if(target.classList.contains('dashboard-grid')) {
                target.style.display = 'grid';
            } else {
                target.style.display = 'block';
            }
        });
    });
}

// Start App
document.addEventListener('DOMContentLoaded', init);
