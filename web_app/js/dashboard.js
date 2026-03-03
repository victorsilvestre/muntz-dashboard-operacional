// ==========================================
// MUNTZ OPS DASHBOARD - CORE LOGIC
// ==========================================

// Global State
const STATE = {
    rawData: [],
    filteredData: [],
    charts: {},
    currentPage: 'visao-geral',
    filters: {
        urgente: false,
        atraso: false,
        mes: 'all',
        cliente: 'all',
        equipe: 'all',
        perfil: 'all',
        tipo: 'all'
    }
};

// UI Elements Map
const UI = {
    loader: document.getElementById('loader'),
    recordCount: document.getElementById('record-count'),
    kpi: {
        horas: document.getElementById('kpi-horas'),
        tarefas: document.getElementById('kpi-tarefas'),
        atraso: document.getElementById('kpi-atraso'),
        urgente: document.getElementById('kpi-urgente')
    },
    inputs: {
        urgente: document.getElementById('filter-urgente'),
        atraso: document.getElementById('filter-atraso'),
        mes: document.getElementById('filter-mes'),
        cliente: document.getElementById('filter-cliente'),
        equipe: document.getElementById('filter-equipe'),
        perfil: document.getElementById('filter-perfil'),
        tipo: document.getElementById('filter-tipo')
    },
    btnReset: document.getElementById('btn-reset-filters'),
    sidebarToggle: document.getElementById('btn-toggle-sidebar'),
    sidebar: document.getElementById('sidebar'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    // SPA Navbar & Pages
    navVisaoGeral: document.getElementById('nav-visao-geral'),
    navPerfil: document.getElementById('nav-perfil'),
    pageVisaoGeral: document.getElementById('page-visao-geral'),
    pagePerfil: document.getElementById('page-perfil'),
    // Page Perfil KPIs & Blocks
    kpiPerfil: {
        totalPerfis: document.getElementById('kpi-total-perfis'),
        totalTarefas: document.getElementById('kpi-total-tarefas-perfil'),
        totalHoras: document.getElementById('kpi-total-horas-perfil'),
        quantidadeItens: document.getElementById('kpi-quantidade-itens-perfil'),
        mediaTarefas: document.getElementById('kpi-media-tarefas'),
        mediaItens: document.getElementById('kpi-media-itens'),
        mediaHoras: document.getElementById('kpi-media-horas'),
        mediaAtraso: document.getElementById('kpi-media-atraso')
    },
    blocoEspecifico: document.getElementById('bloco-especifico'),
    blocoEspecificoVazio: document.getElementById('bloco-especifico-vazio'),
    perfilNameDestaque: document.getElementById('perfil-name-destaque')
};

// Chart Setup defaults
Chart.defaults.font.family = "'Outfit', 'Inter', sans-serif";
Chart.register(ChartDataLabels);

// Brand Colors
const COLORS = {
    violetPrimary: '#BD5FFF',
    violetDark: '#8936C3',
    ametista: '#1F004A',
    vivaz: '#E6FC53',
    laranjaSolar: '#FF561B',
    montanha: '#ECE7FA',
    palettes: {
        mixed: ['#BD5FFF', '#0A45E2', '#E6FC53', '#8936C3', '#FF561B', '#D092FB', '#001F6F', '#ECE7FA', '#92A60C']
    }
};

const glowPlugin = {
    id: 'glowPlugin',
    beforeDatasetsDraw: (chart) => {
        chart.ctx.save();
    },
    beforeDatasetDraw: (chart) => {
        chart.ctx.shadowColor = 'rgba(31, 0, 74, 0.08)';
        chart.ctx.shadowBlur = 12;
        chart.ctx.shadowOffsetX = 0;
        chart.ctx.shadowOffsetY = 6;
    },
    afterDatasetDraw: (chart) => {
        chart.ctx.shadowColor = 'transparent';
        chart.ctx.shadowBlur = 0;
        chart.ctx.shadowOffsetX = 0;
        chart.ctx.shadowOffsetY = 0;
    },
    afterDatasetsDraw: (chart) => {
        chart.ctx.restore();
    }
};

// Gradient utility
function createGradient(ctx, colorStart, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
}

// ==========================================
// THEME LOGIC
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('muntz-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    if (UI.themeToggle) {
        UI.themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            setTheme(isDark ? 'light' : 'dark');
        });
    }
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (UI.themeIcon) {
            UI.themeIcon.classList.remove('ri-moon-line');
            UI.themeIcon.classList.add('ri-sun-line');
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (UI.themeIcon) {
            UI.themeIcon.classList.remove('ri-sun-line');
            UI.themeIcon.classList.add('ri-moon-line');
        }
    }
    localStorage.setItem('muntz-theme', theme);

    const t = getChartTheme();
    Chart.defaults.color = t.text;
    Chart.defaults.scale.grid.color = t.grid;

    if (STATE.rawData.length > 0) {
        updateDashboard();
    }
}

function getChartTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text: isDark ? 'rgba(247, 245, 250, 0.70)' : '#6B7280',
        grid: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,0.05)',
        tooltipBg: isDark ? '#241334' : '#1A1A1A',
        datalabels: isDark ? '#F7F5FA' : '#1C0B27'
    };
}


// ==========================================
// 1. DATA INGESTION (PapaParse)
// ==========================================
async function initDashboard() {
    try {
        initTheme(); // Executa rotina de visual logo no início

        // We assume index.html is in web_app/ and csv is one level up
        const targetCsvUrl = '../relatorio_completo_jan_fev_2026_030326.csv';

        Papa.parse(targetCsvUrl, {
            download: true,
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
            complete: function (results) {
                processData(results.data);
            },
            error: function (err) {
                console.error("Erro ao carregar CSV:", err);
                UI.loader.innerHTML = `<p style="color:red">Erro ao carregar dataset csv. Verifique as rotas e o formato.</p>`;
            }
        });
    } catch (e) {
        console.error("Initiation Exception:", e);
    }
}

function processData(rows) {
    STATE.rawData = rows.map(row => {
        // Cleaning Data
        let strHoras = row['Horas trabalhadas (h)'] || "0";
        strHoras = strHoras.replace(',', '.');

        // Clean "Sim" values mapping
        const isUrgente = String(row['Urgente']).trim().toLowerCase() === 'sim';
        const isAtraso = String(row['Atraso']).trim().toLowerCase() === 'sim';

        // Parse Month for Time Filter
        // Assumes format DD/MM/YYYY or similar parsing
        let mes = '';
        if (row['Criada em']) {
            const parts = row['Criada em'].split('/'); // Split by typical Brazilian format
            if (parts.length >= 2) {
                const mesNum = parseInt(parts[1], 10);
                const yearStr = parts[2].substring(0, 4); // handle potential time appending
                const mesesMap = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                if (mesNum >= 1 && mesNum <= 12) {
                    mes = `${mesesMap[mesNum - 1]} ${yearStr}`;
                }
            }
        }

        return {
            id: row['ID'] || '',
            titulo: row['Titulo'] || row['Título'] || '', // Fallback para acentuação se existir
            mes: mes,
            cliente: (row['Cliente'] || '').trim(),
            tipo: (row['Tipo'] || '').trim(),
            tags: row['Tags'] ? row['Tags'].split(',').map(tag => tag.trim()) : [],
            perfil: (row['Perfil'] || '').trim(),
            equipe: (row['Equipe'] || '').trim(),
            horas: parseFloat(strHoras) || 0,
            urgente: isUrgente ? 'Sim' : 'Não', // Normalizing
            atraso: isAtraso ? 'Sim' : 'Não',   // Normalizing
            quantidade: parseInt(row['Quantidade']) || 0,
            dataCriacao: row['Criada em'] || '',
            dataAssignment: row['Data Assignment'] || ''
        };
    });

    // Populate Filters
    populateUIFilters();
    bindEvents();

    // Initial State Default (Unfiltered)
    applyFilters();

    // Hide Loader
    setTimeout(() => {
        UI.loader.classList.add('hidden');
    }, 500);
}

// ==========================================
// 2. STATE AND FILTERS LOGIC
// ==========================================
function populateUIFilters() {
    const sets = {
        mes: new Set(),
        cliente: new Set(),
        equipe: new Set(),
        perfil: new Set(),
        tipo: new Set()
    };

    STATE.rawData.forEach(item => {
        if (item.mes) sets.mes.add(item.mes);
        if (item.cliente) sets.cliente.add(item.cliente);
        if (item.equipe) sets.equipe.add(item.equipe);
        if (item.perfil) sets.perfil.add(item.perfil);
        if (item.tipo) sets.tipo.add(item.tipo);
    });

    const addOptions = (elem, set) => {
        // Smart Sort: Alphabetical but '(Vazios)' at the end
        let listArr = Array.from(set).map(v => v === '' ? '(Vazios)' : v);
        listArr.sort((a, b) => {
            if (a === '(Vazios)') return 1;
            if (b === '(Vazios)') return -1;
            return a.localeCompare(b);
        });

        listArr.forEach(val => {
            const opt = document.createElement('option');
            opt.value = val === '(Vazios)' ? '' : val;
            opt.innerText = val;
            elem.appendChild(opt);
        });
    };

    addOptions(UI.inputs.mes, sets.mes);
    addOptions(UI.inputs.cliente, sets.cliente);
    addOptions(UI.inputs.equipe, sets.equipe);
    addOptions(UI.inputs.perfil, sets.perfil);
    addOptions(UI.inputs.tipo, sets.tipo);
}

function bindEvents() {
    // Optional UI triggers (sidebar collapse)
    if (UI.sidebarToggle && UI.sidebar) {
        UI.sidebarToggle.addEventListener('click', () => {
            UI.sidebar.classList.toggle('collapsed');
        });
    }

    Object.keys(UI.inputs).forEach(key => {
        if (!UI.inputs[key]) return;
        UI.inputs[key].addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                STATE.filters[key] = e.target.checked;
            } else {
                STATE.filters[key] = e.target.value;
            }
            applyFilters();
        });
    });

    UI.btnReset.addEventListener('click', () => {
        STATE.filters = { urgente: false, atraso: false, mes: 'all', cliente: 'all', equipe: 'all', perfil: 'all', tipo: 'all' };
        Object.keys(UI.inputs).forEach(key => {
            if (!UI.inputs[key]) return;
            if (UI.inputs[key].type === 'checkbox') {
                UI.inputs[key].checked = false;
            } else {
                UI.inputs[key].value = 'all';
            }
        });
        applyFilters();
    });

    // SPA Navigation Events
    if (UI.navVisaoGeral && UI.navPerfil) {
        UI.navVisaoGeral.addEventListener('click', (e) => {
            e.preventDefault();
            if (STATE.currentPage === 'visao-geral') return;
            STATE.currentPage = 'visao-geral';
            UI.navVisaoGeral.classList.add('active');
            UI.navPerfil.classList.remove('active');
            UI.pageVisaoGeral.classList.remove('hidden');
            UI.pagePerfil.classList.add('hidden');
            updateDashboard(); // Re-render for active tab
        });

        UI.navPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            if (STATE.currentPage === 'perfil') return;
            STATE.currentPage = 'perfil';
            UI.navPerfil.classList.add('active');
            UI.navVisaoGeral.classList.remove('active');
            UI.pagePerfil.classList.remove('hidden');
            UI.pageVisaoGeral.classList.add('hidden');
            updateDashboard(); // Re-render for active tab
        });
    }
}

function applyFilters() {
    // Cross-Filtering Engine
    STATE.filteredData = STATE.rawData.filter(item => {
        // Booleanos
        if (STATE.filters.urgente && item.urgente !== 'Sim') return false;
        if (STATE.filters.atraso && item.atraso !== 'Sim') return false;

        // Categorias
        if (STATE.filters.mes !== 'all' && item.mes !== STATE.filters.mes) return false;
        if (STATE.filters.cliente !== 'all' && item.cliente !== STATE.filters.cliente) return false;
        if (STATE.filters.equipe !== 'all' && item.equipe !== STATE.filters.equipe) return false;
        if (STATE.filters.perfil !== 'all' && item.perfil !== STATE.filters.perfil) return false;
        if (STATE.filters.tipo !== 'all' && item.tipo !== STATE.filters.tipo) return false;

        return true;
    });

    updateDashboard();
}

// ==========================================
// 3. RENDER WORKERS (KPIs & Charts)
// ==========================================
function updateDashboard() {
    const df = STATE.filteredData;
    UI.recordCount.innerText = `Analisando ${df.length} registros`;

    if (STATE.currentPage === 'perfil') {
        renderChartsParaPerfil(df);
    } else {
        renderChartsVisaoGeral(df);
    }
}

function renderChartsVisaoGeral(df) {
    let kpiData = {
        totalHoras: 0,
        tarefasUnicas: new Set(),
        horasAtraso: 0,
        horasUrgente: 0
    };

    df.forEach(item => {
        kpiData.totalHoras += item.horas;
        kpiData.tarefasUnicas.add(item.id);

        if (item.atraso === 'Sim') kpiData.horasAtraso += item.horas;
        if (item.urgente === 'Sim') kpiData.horasUrgente += item.horas;
    });

    let countTarefas = kpiData.tarefasUnicas.size;
    let rankAtraso = kpiData.totalHoras > 0 ? ((kpiData.horasAtraso / kpiData.totalHoras) * 100).toFixed(1) : 0;
    let rankUrgente = kpiData.totalHoras > 0 ? ((kpiData.horasUrgente / kpiData.totalHoras) * 100).toFixed(1) : 0;

    UI.kpi.horas.innerText = parseFloat(kpiData.totalHoras.toFixed(1)).toLocaleString('pt-BR') + 'h';
    UI.kpi.tarefas.innerText = countTarefas.toLocaleString('pt-BR');
    UI.kpi.atraso.innerText = rankAtraso + '%';
    UI.kpi.urgente.innerText = rankUrgente + '%';

    renderChartClientes(df);
    renderChartTipos(df);
    renderChartEquipes(df);
    renderChartTags(df);
    renderChartPerfis(df);
}

// ==========================================
// 4. RENDER PAGE: PERFIL 
// ==========================================
function renderChartsParaPerfil(df) {
    const perfisAcc = {};
    let totalTarefasGlobais = new Set();
    let totalAtrasadasGlobais = new Set();
    let totalHorasGlobais = 0;
    let totalQuantidadeGlobais = 0;

    df.forEach(item => {
        let pName = item.perfil || '(Vazios)';

        totalHorasGlobais += item.horas;
        totalQuantidadeGlobais += item.quantidade || 0;
        totalTarefasGlobais.add(item.id);
        if (item.atraso === 'Sim') totalAtrasadasGlobais.add(item.id);

        if (!perfisAcc[pName]) {
            perfisAcc[pName] = { horas: 0, quantidade: 0, tarefas: new Set(), atrasadas: new Set() };
        }
        perfisAcc[pName].horas += item.horas;
        perfisAcc[pName].quantidade += item.quantidade || 0;
        perfisAcc[pName].tarefas.add(item.id);
        if (item.atraso === 'Sim') perfisAcc[pName].atrasadas.add(item.id);
    });

    const perfisArr = Object.keys(perfisAcc).map(pName => {
        const p = perfisAcc[pName];
        const tNum = p.tarefas.size;
        return {
            nome: pName,
            horas: p.horas,
            quantidade: p.quantidade,
            tarefasNum: tNum,
            percAtraso: tNum > 0 ? (p.atrasadas.size / tNum) * 100 : 0,
            mediaHrTar: tNum > 0 ? p.horas / tNum : 0
        };
    });

    const tPerfis = perfisArr.length;
    const tTar = totalTarefasGlobais.size;

    // Atualiza KPIs Globais Perfil
    UI.kpiPerfil.totalPerfis.innerText = tPerfis;
    UI.kpiPerfil.totalTarefas.innerText = tTar.toLocaleString('pt-BR');
    UI.kpiPerfil.totalHoras.innerText = totalHorasGlobais.toFixed(1) + 'h';
    if (UI.kpiPerfil.quantidadeItens) UI.kpiPerfil.quantidadeItens.innerText = totalQuantidadeGlobais.toLocaleString('pt-BR');
    UI.kpiPerfil.mediaTarefas.innerText = tPerfis > 0 ? (tTar / tPerfis).toFixed(1) : 0;
    if (UI.kpiPerfil.mediaItens) UI.kpiPerfil.mediaItens.innerText = tPerfis > 0 ? (totalQuantidadeGlobais / tPerfis).toFixed(1) : 0;
    UI.kpiPerfil.mediaHoras.innerText = tPerfis > 0 ? (totalHorasGlobais / tPerfis).toFixed(1) + 'h' : '0h';
    UI.kpiPerfil.mediaAtraso.innerText = tTar > 0 ? ((totalAtrasadasGlobais.size / tTar) * 100).toFixed(1) + '%' : '0%';

    renderChartRankingPerfis(perfisArr);
    renderChartDispersaoCarga(perfisArr);
    renderChartComplexidade(df);

    // Deep Dive (Específico) logic
    if (STATE.filters.perfil !== 'all' && STATE.filters.perfil !== '') {
        UI.blocoEspecificoVazio.classList.add('hidden');
        UI.blocoEspecifico.classList.remove('hidden');
        UI.perfilNameDestaque.innerText = STATE.filters.perfil;
        renderPerfilDrillDown(df);
    } else {
        UI.blocoEspecifico.classList.add('hidden');
        UI.blocoEspecificoVazio.classList.remove('hidden');
    }
}

// Helpers
function generateChart(ctxId, type, data, options) {
    if (STATE.charts[ctxId]) {
        STATE.charts[ctxId].destroy();
    }
    const canvas = document.getElementById(ctxId);
    if (canvas) {
        STATE.charts[ctxId] = new Chart(canvas, {
            type,
            data,
            options,
            plugins: [glowPlugin]
        });
    }
}

function truncateString(str, num) {
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
}

function dataAggregator(df, keyExtractFn, sortLimit = 10) {
    const acc = {};
    df.forEach(item => {
        const keys = [].concat(keyExtractFn(item));
        keys.forEach(k => {
            if (!k) return;
            if (!acc[k]) acc[k] = 0;
            acc[k] += item.horas;
        });
    });
    return Object.entries(acc)
        .filter(entry => entry[1] > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, sortLimit);
}

// ======= CHART IMPLEMENTATIONS =======

function renderChartClientes(df) {
    const sorted = dataAggregator(df, item => item.cliente || '(Vazios)', 15);
    const theme = getChartTheme();

    generateChart('chart-clientes', 'bar', {
        labels: sorted.map(d => truncateString(d[0], 25)),
        datasets: [{
            label: 'Horas Gastas',
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: (context) => {
                return context.chart ? createGradient(context.chart.ctx, COLORS.violetPrimary, 'rgba(189, 95, 255, 0.2)') : COLORS.violetPrimary;
            },
            hoverBackgroundColor: COLORS.violetPrimary,
            borderRadius: 6,
            borderWidth: 0
        }]
    }, {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 50 } },
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: theme.tooltipBg, padding: 12 },
            datalabels: {
                color: theme.datalabels,
                font: { weight: 'bold', size: 11 },
                anchor: 'end', // Float precisely connected to element tip
                align: 'end', // Avoid overlay with small columns
                formatter: val => val > 0 ? val + 'h' : ''
            }
        },
        scales: {
            x: { display: false },
            y: { ticks: { color: theme.text } }
        }
    });
}

function renderChartTipos(df) {
    const sorted = dataAggregator(df, item => item.tipo || '(Vazios)', 6);
    const theme = getChartTheme();

    generateChart('chart-tipo', 'doughnut', {
        labels: sorted.map(d => d[0]),
        datasets: [{
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: COLORS.palettes.mixed,
            borderWidth: 2,
            borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1A0D26' : '#FFFFFF',
            hoverOffset: 6
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: { position: 'bottom', labels: { color: theme.text } },
            datalabels: {
                color: theme.datalabels,
                font: { weight: 'bold', size: 12 },
                formatter: (value, ctx) => {
                    let sum = 0;
                    ctx.chart.data.datasets[0].data.forEach(v => sum += Number(v));
                    return ((value * 100) / sum).toFixed(0) + "%";
                }
            }
        }
    });
}

function renderChartEquipes(df) {
    const sorted = dataAggregator(df, item => item.equipe || '(Vazios)', 8);
    const theme = getChartTheme();

    generateChart('chart-equipes', 'bar', {
        labels: sorted.map(d => truncateString(d[0], 20)),
        datasets: [{
            label: 'Carga Horária',
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: (context) => {
                return context.chart ? createGradient(context.chart.ctx, COLORS.vivaz, 'rgba(230, 252, 83, 0.2)') : COLORS.vivaz;
            },
            hoverBackgroundColor: COLORS.vivaz,
            borderRadius: 8
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 30 } },
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: theme.tooltipBg, padding: 12 },
            datalabels: {
                color: theme.datalabels,
                anchor: 'end',
                align: 'top', // Make sure it sits ON TOP of columns, even if close to zero
                font: { weight: 'bold' },
                offset: 4 // Space between bar tip and the number
            }
        },
        scales: {
            y: { display: false },
            x: { ticks: { color: theme.text } }
        }
    });
}

function renderChartTags(df) {
    const acc = {};
    df.forEach(item => {
        if (item.tags && item.tags.length > 0) {
            item.tags.forEach(tag => {
                if (tag.trim() === '') return;
                if (!acc[tag]) acc[tag] = 0;
                acc[tag] += item.horas;
            });
        }
    });

    // Add logic handling for objects with zero tags mapped
    const sorted = Object.entries(acc)
        .filter(entry => entry[1] > 0)
        .sort((a, b) => b[1] - a[1]).slice(0, 10);

    const theme = getChartTheme();

    generateChart('chart-tags', 'bar', {
        labels: sorted.map(d => truncateString(d[0], 20)),
        datasets: [{
            label: 'Horas em Especialidade',
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: (context) => {
                return context.chart ? createGradient(context.chart.ctx, COLORS.laranjaSolar, 'rgba(255, 86, 27, 0.2)') : COLORS.laranjaSolar;
            },
            hoverBackgroundColor: COLORS.laranjaSolar,
            borderRadius: 6
        }]
    }, {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 50 } },
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: theme.tooltipBg, padding: 12 },
            datalabels: {
                color: theme.datalabels,
                anchor: 'end',
                align: 'end', // Place slightly outside column tip
                font: { size: 11, weight: 'bold' }
            }
        },
        scales: {
            x: { display: false },
            y: { ticks: { color: theme.text } }
        }
    });
}

function renderChartPerfis(df) {
    const sorted = dataAggregator(df, item => item.perfil || '(Vazios)', 20);
    const theme = getChartTheme();

    generateChart('chart-perfis', 'bar', {
        labels: sorted.map(d => truncateString(d[0], 20)),
        datasets: [{
            label: 'Horas Lançadas',
            data: sorted.map(d => d[1].toFixed(1)),
            backgroundColor: (context) => {
                return context.chart ? createGradient(context.chart.ctx, COLORS.violetDark, 'rgba(137, 54, 195, 0.2)') : COLORS.violetDark;
            },
            hoverBackgroundColor: COLORS.violetDark,
            borderRadius: 4
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 30 } },
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: theme.tooltipBg, padding: 12 },
            datalabels: {
                color: theme.datalabels, // Adjust based on background visual
                anchor: 'end',
                align: 'top', // Don't clip internal texts on low value columns
                font: { size: 10, weight: 'bold' }
            }
        },
        scales: {
            y: { display: false },
            x: { ticks: { color: theme.text, maxRotation: 45, minRotation: 45 } }
        }
    });
}

function renderChartRankingPerfis(perfisArr) {
    const sorted = [...perfisArr].filter(p => p.horas > 0).sort((a, b) => b.horas - a.horas).slice(0, 15);
    const theme = getChartTheme();

    generateChart('chart-ranking-perfis', 'bar', {
        labels: sorted.map(d => truncateString(d.nome, 20)),
        datasets: [
            {
                label: 'Total Horas',
                data: sorted.map(d => d.horas.toFixed(1)),
                backgroundColor: COLORS.violetPrimary,
                yAxisID: 'y1',
                borderRadius: 4
            },
            {
                label: 'Volume de Tarefas',
                data: sorted.map(d => d.tarefasNum),
                backgroundColor: COLORS.vivaz,
                yAxisID: 'y1',
                borderRadius: 4
            },
            {
                label: 'Quantidade de Itens',
                data: sorted.map(d => d.quantidade),
                backgroundColor: '#0A45E2', // Azul escuro
                yAxisID: 'y1',
                borderRadius: 4
            },
            {
                label: '% de Atraso',
                data: sorted.map(d => d.percAtraso.toFixed(1)),
                backgroundColor: COLORS.laranjaSolar,
                yAxisID: 'y2',
                borderRadius: 4
            },
            {
                label: 'Média de Hr/Tarefa',
                data: sorted.map(d => d.mediaHrTar.toFixed(1)),
                backgroundColor: COLORS.violetDark,
                yAxisID: 'y1',
                borderRadius: 4
            }
        ]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 0, right: 20 } },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { color: theme.text, padding: 25 }
            },
            tooltip: { backgroundColor: theme.tooltipBg, padding: 12 },
            datalabels: {
                display: true,
                color: theme.text,
                anchor: 'end',
                align: 'end',
                font: { size: 10, weight: 'bold' },
                formatter: (val, ctx) => {
                    if (val <= 0) return '';
                    if (ctx.datasetIndex === 0 || ctx.datasetIndex === 4) return val + 'h';
                    if (ctx.datasetIndex === 3) return val + '%';
                    return val;
                }
            }
        },
        scales: {
            x: {
                ticks: { color: theme.text, maxRotation: 45, minRotation: 45 },
                grid: { color: theme.grid }
            },
            y1: {
                display: false,
                grace: '25%'
            },
            y2: {
                display: false,
                grace: '25%'
            }
        }
    });
}

function renderChartDispersaoCarga(perfisArr) {
    const theme = getChartTheme();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Dataset {x, y}
    const scatterData = perfisArr.filter(p => p.horas > 0 && p.tarefasNum > 0).map(p => ({
        x: p.tarefasNum,
        y: Number(p.horas.toFixed(1)),
        _nome: p.nome
    }));

    generateChart('chart-dispersao-carga', 'scatter', {
        datasets: [{
            label: 'Perfis da Agência',
            data: scatterData,
            backgroundColor: COLORS.violetPrimary,
            pointBackgroundColor: COLORS.vivaz,
            pointBorderColor: isDark ? '#FFFFFF' : COLORS.ametista,
            pointBorderWidth: 1,
            pointRadius: 10,
            pointHoverRadius: 12
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: theme.tooltipBg,
                callbacks: {
                    label: function (ctx) {
                        const point = ctx.raw;
                        return `${point._nome}: ${point.x} Tarefas | ${point.y} Horas`;
                    }
                }
            },
            datalabels: { display: false }
        },
        scales: {
            x: {
                title: { display: true, text: 'Nº de Tarefas (Entregas Únicas)', color: theme.text, font: { weight: 'bold' } },
                ticks: { color: theme.text },
                grid: { color: theme.grid }
            },
            y: {
                title: { display: true, text: 'Horas Trabalhadas (Esforço)', color: theme.text, font: { weight: 'bold' } },
                ticks: { color: theme.text },
                grid: { color: theme.grid }
            }
        }
    });
}

function renderChartComplexidade(df) {
    // Agregar horas pelas tasks puras
    const idAcc = {};
    df.forEach(row => {
        if (!idAcc[row.id]) idAcc[row.id] = 0;
        idAcc[row.id] += row.horas;
    });

    let counts = { Baixa: 0, Media: 0, Alta: 0 };
    Object.values(idAcc).forEach(totalHr => {
        if (totalHr <= 3) counts.Baixa++;
        else if (totalHr <= 8) counts.Media++;
        else counts.Alta++;
    });

    const theme = getChartTheme();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    generateChart('chart-complexidade', 'doughnut', {
        labels: ['Baixa (<=3h)', 'Média (3h - 8h)', 'Alta (>8h)'],
        datasets: [{
            data: [counts.Baixa, counts.Media, counts.Alta],
            backgroundColor: [isDark ? '#0A45E2' : '#0A45E2', COLORS.violetDark, COLORS.laranjaSolar],
            borderWidth: 2,
            borderColor: isDark ? '#1A0D26' : '#FFFFFF',
            hoverOffset: 6
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: { position: 'bottom', labels: { color: theme.text } },
            datalabels: {
                color: '#FFFFFF',
                font: { weight: 'bold', size: 12 },
                formatter: (value) => {
                    let sum = counts.Baixa + counts.Media + counts.Alta;
                    return sum > 0 ? ((value * 100) / sum).toFixed(0) + "%" : '0%';
                }
            }
        }
    });
}

function renderPerfilDrillDown(df) {
    const theme = getChartTheme();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 1. Prazos
    let tarefasSet = new Map();
    df.forEach(item => {
        if (!tarefasSet.has(item.id)) {
            tarefasSet.set(item.id, item.atraso);
        }
    });
    let noPrazo = 0, atrasadas = 0;
    tarefasSet.forEach(val => {
        if (val === 'Sim') atrasadas++;
        else noPrazo++;
    });

    generateChart('chart-perfil-prazos', 'doughnut', {
        labels: ['No Prazo', 'Atrasadas'],
        datasets: [{
            data: [noPrazo, atrasadas],
            backgroundColor: [COLORS.vivaz, COLORS.laranjaSolar],
            borderWidth: 2,
            borderColor: isDark ? '#1A0D26' : '#FFFFFF',
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: { position: 'bottom', labels: { color: theme.text } },
            datalabels: {
                color: '#1A0D26', // colors inside are lightish (vivaz/orange)
                font: { weight: 'bold', size: 12 },
                formatter: (value) => {
                    let sum = noPrazo + atrasadas;
                    return sum > 0 ? ((value * 100) / sum).toFixed(0) + "%" : '0%';
                }
            }
        }
    });

    // 2. Clientes (Radar)
    const clientesAcc = {};
    df.forEach(item => {
        let cName = item.cliente || '(Vazios)';
        if (!clientesAcc[cName]) clientesAcc[cName] = 0;
        clientesAcc[cName] += item.horas;
    });
    const sortedClientes = Object.entries(clientesAcc)
        .filter(c => c[1] > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    generateChart('chart-perfil-clientes', 'radar', {
        labels: sortedClientes.map(d => truncateString(d[0], 12)),
        datasets: [{
            label: 'Horas Gastas',
            data: sortedClientes.map(d => d[1].toFixed(1)),
            backgroundColor: 'rgba(189, 95, 255, 0.25)',
            borderColor: COLORS.violetPrimary,
            pointBackgroundColor: COLORS.vivaz,
            borderWidth: 2,
            pointRadius: 4
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
            legend: { display: false },
            datalabels: { display: false },
            tooltip: { backgroundColor: theme.tooltipBg }
        },
        scales: {
            r: {
                pointLabels: { color: theme.text, font: { size: 11, weight: '600' } },
                grid: { color: theme.grid },
                angleLines: { color: theme.grid },
                ticks: { display: false }
            }
        }
    });
}

// Start Application
document.addEventListener('DOMContentLoaded', initDashboard);
