// ==========================================
// MUNTZ OPS DASHBOARD - CORE LOGIC
// ==========================================

// Global State
const STATE = {
    rawData: [],
    filteredData: [],
    charts: {},
    currentPage: 'visao-geral',
    tempoExecucao: {
        expandedTags: false
    },
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
    navTempoExecucao: document.getElementById('nav-tempo-execucao'),
    pageVisaoGeral: document.getElementById('page-visao-geral'),
    pagePerfil: document.getElementById('page-perfil'),
    pageTempoExecucao: document.getElementById('page-tempo-execucao'),
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
    perfilNameDestaque: document.getElementById('perfil-name-destaque'),
    // Page Tempo de Execução
    btnExpandTags: document.getElementById('btn-expand-tags'),
    kpiTempoExecucao: {
        totalTarefas: document.getElementById('kpi-total-tarefas-tempo'),
        totalHoras: document.getElementById('kpi-total-horas-tempo'),
        tempoMedio: document.getElementById('kpi-tempo-medio-geral'),
        mediana: document.getElementById('kpi-mediana-tempo'),
        tempoMin: document.getElementById('kpi-tempo-minimo'),
        tempoMax: document.getElementById('kpi-tempo-maximo')
    }
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
            complexidade: (row['Complexidade'] || '').trim(),
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
            navigateToPage('visao-geral');
        });

        UI.navPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            if (STATE.currentPage === 'perfil') return;
            navigateToPage('perfil');
        });

        if (UI.navTempoExecucao) {
            UI.navTempoExecucao.addEventListener('click', (e) => {
                e.preventDefault();
                if (STATE.currentPage === 'tempo-execucao') return;
                navigateToPage('tempo-execucao');
            });
        }
    }

    // Event Listener para botão de expansão de tags
    if (UI.btnExpandTags) {
        UI.btnExpandTags.addEventListener('click', () => {
            STATE.tempoExecucao.expandedTags = !STATE.tempoExecucao.expandedTags;
            renderTempoPorTags(calcularTemposPorTarefa(STATE.filteredData));
        });
    }
}

function navigateToPage(pageName) {
    // Remover active de todos os nav-items
    [UI.navVisaoGeral, UI.navPerfil, UI.navTempoExecucao].forEach(nav => {
        if (nav) nav.classList.remove('active');
    });

    // Ocultar todas as páginas
    [UI.pageVisaoGeral, UI.pagePerfil, UI.pageTempoExecucao].forEach(page => {
        if (page) page.classList.add('hidden');
    });

    // Ativar página e nav-item corretos
    STATE.currentPage = pageName;

    const pageTitle = document.querySelector('.page-title h1');

    if (pageName === 'visao-geral') {
        UI.pageVisaoGeral.classList.remove('hidden');
        UI.navVisaoGeral.classList.add('active');
        if (pageTitle) pageTitle.textContent = 'Visão Geral da Operação';
    } else if (pageName === 'perfil') {
        UI.pagePerfil.classList.remove('hidden');
        UI.navPerfil.classList.add('active');
        if (pageTitle) pageTitle.textContent = 'Análise de Perfis';
    } else if (pageName === 'tempo-execucao') {
        UI.pageTempoExecucao.classList.remove('hidden');
        UI.navTempoExecucao.classList.add('active');
        if (pageTitle) pageTitle.textContent = 'Tempo de Execução';
    }

    // Re-renderizar apenas a página ativa
    updateDashboard();
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
    } else if (STATE.currentPage === 'tempo-execucao') {
        renderChartsTempoExecucao(df);
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
        UI.blocoEspecifico.classList.remove('hidden');
        UI.perfilNameDestaque.innerText = STATE.filters.perfil;
        renderPerfilDrillDown(df);
    } else {
        // Ocultar bloco e destruir gráficos específicos para evitar dados antigos
        UI.blocoEspecifico.classList.add('hidden');
        destroySpecificCharts();
    }
}

// Função para destruir gráficos do bloco específico e limpar KPIs
function destroySpecificCharts() {
    // Destruir gráficos
    const specificChartIds = [
        'chart-perfil-prazos',
        'chart-perfil-clientes',
        'chart-tempomedio-tipo',
        'chart-tempomedio-tag',
        'chart-tempomedio-complexidade',
        'chart-especializacao-tags',
        'chart-especializacao-tipos',
        'chart-evolucao-tempo'
    ];

    specificChartIds.forEach(chartId => {
        if (STATE.charts[chartId]) {
            STATE.charts[chartId].destroy();
            delete STATE.charts[chartId];
        }
    });

    // Limpar título do bloco
    if (UI.perfilNameDestaque) {
        UI.perfilNameDestaque.innerText = '';
    }

    // Limpar KPIs de Carga vs Capacidade
    const elCargaHoras = document.getElementById('kpi-carga-horas');
    const elCargaOcup = document.getElementById('kpi-carga-ocupacao');
    const elCargaDif = document.getElementById('kpi-carga-diferenca');
    const elCargaEq = document.getElementById('kpi-carga-equipe');

    if (elCargaHoras) elCargaHoras.innerText = '0h';
    if (elCargaOcup) elCargaOcup.innerText = '0%';
    if (elCargaDif) elCargaDif.innerText = 'Falta 0h';
    if (elCargaEq) elCargaEq.innerText = '0%';
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

    // ----------------------------------------------------
    // NOVOS GRÁFICOS E ANÁLISES INSERIDOS (SPEC)
    // ----------------------------------------------------

    const targetEquipe = df.length > 0 ? df[0].equipe : '';
    let dfEquipe = STATE.rawData.filter(item => {
        if (STATE.filters.urgente && item.urgente !== 'Sim') return false;
        if (STATE.filters.atraso && item.atraso !== 'Sim') return false;
        if (STATE.filters.mes !== 'all' && item.mes !== STATE.filters.mes) return false;
        if (STATE.filters.cliente !== 'all' && item.cliente !== STATE.filters.cliente) return false;
        if (STATE.filters.tipo !== 'all' && item.tipo !== STATE.filters.tipo) return false;
        if (item.equipe !== targetEquipe) return false;
        return true;
    });

    // 5. Carga vs Capacidade
    // Calcular meta dinâmica baseada no número de meses únicos
    let mesesUnicos = new Set();
    df.forEach(i => {
        if (i.mes) mesesUnicos.add(i.mes);
    });
    let numeroMeses = mesesUnicos.size > 0 ? mesesUnicos.size : 1;
    let metaDinamica = numeroMeses * 120;

    let horasPerfil = 0;
    df.forEach(i => horasPerfil += i.horas);
    let ocupacaoPerfil = (horasPerfil / metaDinamica) * 100;
    let difMeta = metaDinamica - horasPerfil;

    let equipePerfisSet = new Set();
    let horasEquipe = 0;
    dfEquipe.forEach(i => {
        equipePerfisSet.add(i.perfil);
        horasEquipe += i.horas;
    });
    let numPerfisEquipe = equipePerfisSet.size > 0 ? equipePerfisSet.size : 1;
    let mediaHorasEquipe = horasEquipe / numPerfisEquipe;
    let ocupacaoEquipe = (mediaHorasEquipe / metaDinamica) * 100;

    let elCargaHoras = document.getElementById('kpi-carga-horas');
    let elCargaOcup = document.getElementById('kpi-carga-ocupacao');
    let elCargaDif = document.getElementById('kpi-carga-diferenca');
    let elCargaEq = document.getElementById('kpi-carga-equipe');
    if (elCargaHoras) elCargaHoras.innerText = horasPerfil.toFixed(1) + 'h';
    if (elCargaOcup) elCargaOcup.innerText = ocupacaoPerfil.toFixed(0) + '%';
    if (elCargaDif) elCargaDif.innerText = (difMeta >= 0 ? 'Falta ' : '+') + Math.abs(difMeta).toFixed(1) + 'h';
    if (elCargaEq) elCargaEq.innerText = ocupacaoEquipe.toFixed(0) + '%';

    // 2. Produtividade e Eficiência (Tempos Médios)
    function getTempoMedioPorEixo(baseDf) {
        let eixoTipo = {}, eixoTag = {}, eixoCx = {};
        let idAcc = {};
        baseDf.forEach(r => {
            if (!idAcc[r.id]) idAcc[r.id] = 0;
            idAcc[r.id] += r.horas;
        });
        baseDf.forEach(r => {
            let qtd = r.quantidade > 0 ? r.quantidade : 1;
            let kTipo = r.tipo || '(Vazios)';
            if (!eixoTipo[kTipo]) eixoTipo[kTipo] = { h: 0, i: 0 };
            eixoTipo[kTipo].h += r.horas;
            eixoTipo[kTipo].i += qtd;

            if (r.tags && r.tags.length > 0) {
                r.tags.forEach(t => {
                    let kTag = t.trim() || '(Vazias)';
                    if (!eixoTag[kTag]) eixoTag[kTag] = { h: 0, i: 0 };
                    eixoTag[kTag].h += r.horas;
                    eixoTag[kTag].i += qtd;
                });
            } else {
                if (!eixoTag['(Vazias)']) eixoTag['(Vazias)'] = { h: 0, i: 0 };
                eixoTag['(Vazias)'].h += r.horas;
                eixoTag['(Vazias)'].i += qtd;
            }

            let hTask = idAcc[r.id];
            let kCx = hTask <= 3 ? 'Baixa' : (hTask <= 8 ? 'Média' : 'Alta');
            if (!eixoCx[kCx]) eixoCx[kCx] = { h: 0, i: 0 };
            eixoCx[kCx].h += r.horas;
            eixoCx[kCx].i += qtd;
        });
        return { eixoTipo, eixoTag, eixoCx };
    }

    let perfData = getTempoMedioPorEixo(df);
    let equipeData = getTempoMedioPorEixo(dfEquipe);

    function buildTempoMedioChart(ctxId, keys, perfMap, eqMap) {
        let labels = keys.slice(0, 6);
        let dPerf = labels.map(k => perfMap[k] ? perfMap[k].h / perfMap[k].i : 0);
        let dEq = labels.map(k => eqMap[k] ? eqMap[k].h / eqMap[k].i : 0);

        generateChart(ctxId, 'bar', {
            labels: labels.map(l => truncateString(l, 12)),
            datasets: [
                { label: 'Perfil', data: dPerf.map(v => v.toFixed(2)), backgroundColor: COLORS.violetPrimary, borderRadius: 3, borderWidth: 0 },
                { label: 'Média Equipe', data: dEq.map(v => v.toFixed(2)), backgroundColor: 'rgba(230, 252, 83, 0.4)', borderColor: COLORS.vivaz, borderWidth: 1, borderRadius: 3 }
            ]
        }, {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            layout: { padding: { right: 60 } },
            plugins: {
                legend: { position: 'bottom', labels: { color: theme.text, padding: 10, font: { size: 10 }, usePointStyle: true, pointStyle: 'rectRounded' } },
                tooltip: { backgroundColor: theme.tooltipBg, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} h/item` } },
                datalabels: {
                    display: true,
                    color: theme.text,
                    anchor: 'end',
                    align: 'end',
                    font: { size: 10, weight: 'bold' },
                    formatter: (val) => val > 0 ? val + 'h' : ''
                }
            },
            scales: { x: { display: false }, y: { ticks: { color: theme.text, font: { size: 10 } } } }
        });
    }

    let sortedTipos = Object.keys(perfData.eixoTipo).sort((a, b) => perfData.eixoTipo[b].i - perfData.eixoTipo[a].i);
    buildTempoMedioChart('chart-tempomedio-tipo', sortedTipos, perfData.eixoTipo, equipeData.eixoTipo);

    let sortedTags = Object.keys(perfData.eixoTag).sort((a, b) => perfData.eixoTag[b].i - perfData.eixoTag[a].i);
    buildTempoMedioChart('chart-tempomedio-tag', sortedTags, perfData.eixoTag, equipeData.eixoTag);

    let cxKeys = ['Baixa', 'Média', 'Alta'];
    buildTempoMedioChart('chart-tempomedio-complexidade', cxKeys, perfData.eixoCx, equipeData.eixoCx);

    // 3. Especialização do Perfil
    function buildEspecializacaoChart(ctxId, sortedKeys, perfMap, limit) {
        let keys = sortedKeys.slice(0, limit);
        let total = Object.values(perfMap).reduce((sum, val) => sum + val.i, 0);
        let dataVals = keys.map(k => total > 0 ? ((perfMap[k].i / total) * 100) : 0);

        generateChart(ctxId, 'bar', {
            labels: keys.map(k => truncateString(k, 15)),
            datasets: [{
                data: dataVals.map(v => v.toFixed(1)),
                backgroundColor: COLORS.palettes.mixed,
                borderRadius: 4
            }]
        }, {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: theme.tooltipBg, callbacks: { label: (ctx) => `${ctx.raw}% do trabalho do perfil` } },
                datalabels: {
                    display: true, color: theme.text,
                    anchor: 'end', align: 'end',
                    font: { size: 10, weight: 'bold' },
                    formatter: v => v > 0 ? v + '%' : ''
                }
            },
            scales: { x: { display: false, max: 100 }, y: { ticks: { color: theme.text, font: { size: 10 } } } }
        });
    }

    buildEspecializacaoChart('chart-especializacao-tags', sortedTags, perfData.eixoTag, 10);
    buildEspecializacaoChart('chart-especializacao-tipos', sortedTipos, perfData.eixoTipo, 3);

    // 4. Evolução no Tempo
    let evolucaoMap = {};
    df.forEach(r => {
        let dataStr = typeof r.dataCriacao === 'string' ? r.dataCriacao.trim() : '';
        let groupKey = '';
        if (STATE.filters.mes === 'all' || STATE.filters.mes === '') {
            groupKey = r.mes || 'Desconhecido';
        } else {
            let parts = dataStr.split('/');
            groupKey = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : dataStr || 'Desconhecido';
        }

        if (!evolucaoMap[groupKey]) evolucaoMap[groupKey] = { h: 0, tar: new Set(), i: 0 };
        evolucaoMap[groupKey].h += r.horas;
        evolucaoMap[groupKey].i += r.quantidade > 0 ? r.quantidade : 1;
        evolucaoMap[groupKey].tar.add(r.id);
    });

    let evolucaoKeys = Object.keys(evolucaoMap);
    if (STATE.filters.mes !== 'all' && STATE.filters.mes !== '') {
        evolucaoKeys.sort((a, b) => parseInt(a.split('/')[0]) - parseInt(b.split('/')[0]));
    }

    let evoH = evolucaoKeys.map(k => evolucaoMap[k].h.toFixed(1));
    let evoI = evolucaoKeys.map(k => evolucaoMap[k].i);
    let evoT = evolucaoKeys.map(k => evolucaoMap[k].tar.size);

    generateChart('chart-evolucao-tempo', 'bar', {
        labels: evolucaoKeys.map(k => truncateString(k, 12)),
        datasets: [
            { type: 'bar', label: 'Horas (Esforço)', data: evoH, backgroundColor: 'rgba(189, 95, 255, 0.25)', borderColor: COLORS.violetPrimary, borderWidth: 1, yAxisID: 'y1', borderRadius: 4 },
            { type: 'line', label: 'Nº Itens', data: evoI, borderColor: COLORS.vivaz, backgroundColor: COLORS.vivaz, borderWidth: 2, pointRadius: 4, yAxisID: 'y2', tension: 0.3 },
            { type: 'line', label: 'Tarefas Ún.', data: evoT, borderColor: COLORS.laranjaSolar, backgroundColor: COLORS.laranjaSolar, borderWidth: 2, pointRadius: 4, yAxisID: 'y2', tension: 0.3 }
        ]
    }, {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: theme.text, usePointStyle: true, font: { size: 11 } } },
            tooltip: { backgroundColor: theme.tooltipBg, mode: 'index', intersect: false },
            datalabels: { display: false }
        },
        scales: {
            x: { ticks: { color: theme.text }, grid: { color: theme.grid } },
            y1: { type: 'linear', display: true, position: 'left', ticks: { color: theme.text }, grid: { color: theme.grid }, title: { display: true, text: 'Horas', color: theme.text } },
            y2: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: theme.text }, title: { display: true, text: 'Volume', color: theme.text } }
        }
    });

}

// ==========================================
// 5. RENDER PAGE: TEMPO DE EXECUÇÃO
// ==========================================

/**
 * Agrupa dados por tarefa (ID único) e calcula tempo total de cada tarefa
 * @param {Array} data - Array de registros filtrados
 * @returns {Array} Array de objetos {id, tempo, cliente, tipo, tags, complexidade}
 */
function calcularTemposPorTarefa(data) {
    const tarefasMap = new Map();

    data.forEach(row => {
        const id = row.id;
        const horas = row.horas || 0;

        if (!tarefasMap.has(id)) {
            tarefasMap.set(id, {
                id: id,
                tempo: 0,
                cliente: row.cliente,
                tipo: row.tipo,
                tags: row.tags,
                complexidade: row.complexidade || ''
            });
        }

        tarefasMap.get(id).tempo += horas;
    });

    return Array.from(tarefasMap.values()).filter(t => t.tempo > 0);
}

/**
 * Calcula a mediana de um array de números
 * @param {Array} valores - Array de números
 * @returns {number} Mediana
 */
function calcularMediana(valores) {
    if (valores.length === 0) return 0;

    const sorted = [...valores].sort((a, b) => a - b);
    const meio = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[meio - 1] + sorted[meio]) / 2;
    } else {
        return sorted[meio];
    }
}

/**
 * Formata tempo em horas para exibição (formato hh:mm)
 * @param {number} horas - Valor em horas
 * @returns {string} String formatada (ex: "2:30h")
 */
function formatarTempo(horas) {
    if (horas === 0) return '0:00h';
    if (horas < 0.01) return '<0:01h';

    const horasInteiras = Math.floor(horas);
    const minutos = Math.round((horas - horasInteiras) * 60);

    // Ajuste para quando minutos = 60
    if (minutos === 60) {
        return `${horasInteiras + 1}:00h`;
    }

    return `${horasInteiras}:${minutos.toString().padStart(2, '0')}h`;
}

/**
 * Destrói instância de chart existente para evitar sobreposição
 * @param {string} chartId - ID do chart a ser destruído
 */
function destroyChart(chartId) {
    if (STATE.charts[chartId]) {
        STATE.charts[chartId].destroy();
        delete STATE.charts[chartId];
    }
}

/**
 * Renderiza todos os gráficos e KPIs da página Tempo de Execução
 * @param {Array} data - Dados filtrados
 */
function renderChartsTempoExecucao(data) {
    if (!data || data.length === 0) {
        renderEmptyStateTempoExecucao();
        return;
    }

    // Calcular tempos por tarefa
    const tarefas = calcularTemposPorTarefa(data);
    const tempos = tarefas.map(t => t.tempo);

    // Renderizar KPIs
    renderKPIsTempoExecucao(tarefas, tempos);

    // Renderizar Gráficos
    renderDistribuicaoTempo(tarefas);
    renderTempoPorComplexidade(tarefas);
    renderTempoPorTags(tarefas);
    renderTempoPorTipo(tarefas);
    renderTempoPorCliente(tarefas);
}

function renderKPIsTempoExecucao(tarefas, tempos) {
    const totalTarefas = tarefas.length;
    const totalHoras = tarefas.reduce((sum, t) => sum + t.tempo, 0);
    const tempoMedio = totalTarefas > 0 ? totalHoras / totalTarefas : 0;
    const mediana = calcularMediana(tempos);
    const tempoMin = tempos.length > 0 ? Math.min(...tempos) : 0;
    const tempoMax = tempos.length > 0 ? Math.max(...tempos) : 0;

    if (UI.kpiTempoExecucao.totalTarefas) UI.kpiTempoExecucao.totalTarefas.textContent = totalTarefas.toLocaleString('pt-BR');
    if (UI.kpiTempoExecucao.totalHoras) UI.kpiTempoExecucao.totalHoras.textContent = formatarTempo(totalHoras);
    if (UI.kpiTempoExecucao.tempoMedio) UI.kpiTempoExecucao.tempoMedio.textContent = formatarTempo(tempoMedio);
    if (UI.kpiTempoExecucao.mediana) UI.kpiTempoExecucao.mediana.textContent = formatarTempo(mediana);
    if (UI.kpiTempoExecucao.tempoMin) UI.kpiTempoExecucao.tempoMin.textContent = formatarTempo(tempoMin);
    if (UI.kpiTempoExecucao.tempoMax) UI.kpiTempoExecucao.tempoMax.textContent = formatarTempo(tempoMax);
}

function renderDistribuicaoTempo(tarefas) {
    const faixas = [
        { label: '0-1h', min: 0, max: 1 },
        { label: '1-2h', min: 1, max: 2 },
        { label: '2-4h', min: 2, max: 4 },
        { label: '4-8h', min: 4, max: 8 },
        { label: '8h+', min: 8, max: Infinity }
    ];

    const distribuicao = faixas.map(faixa => {
        const count = tarefas.filter(t => t.tempo >= faixa.min && t.tempo < faixa.max).length;
        const percent = tarefas.length > 0 ? (count / tarefas.length * 100).toFixed(1) : 0;
        return { label: faixa.label, count, percent };
    });

    const ctx = document.getElementById('chart-distribuicao-tempo');
    if (!ctx) return;

    destroyChart('chart-distribuicao-tempo');
    const theme = getChartTheme();

    STATE.charts['chart-distribuicao-tempo'] = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: distribuicao.map(d => d.label),
            datasets: [{
                label: 'Nº de Tarefas',
                data: distribuicao.map(d => d.count),
                backgroundColor: COLORS.violetPrimary,
                borderColor: COLORS.violetDark,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: theme.tooltipBg,
                    callbacks: {
                        afterLabel: function(context) {
                            return distribuicao[context.dataIndex].percent + '% do total';
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    color: theme.datalabels,
                    font: {
                        size: 11,
                        weight: 'bold'
                    },
                    formatter: (val, ctx) => {
                        return val + ' (' + distribuicao[ctx.dataIndex].percent + '%)';
                    }
                }
            },
            layout: {
                padding: {
                    top: 30
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Quantidade de Tarefas', color: theme.text },
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                },
                x: {
                    title: { display: true, text: 'Faixa de Tempo', color: theme.text },
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                }
            }
        }
    });
}

function renderTempoPorComplexidade(tarefas) {
    const complexidades = ['Baixa', 'Média', 'Alta'];

    const dados = complexidades.map(comp => {
        const tarefasComp = tarefas.filter(t => t.complexidade === comp);
        const tempos = tarefasComp.map(t => t.tempo);
        const totalHoras = tarefasComp.reduce((sum, t) => sum + t.tempo, 0);
        const tempoMedio = tarefasComp.length > 0 ? totalHoras / tarefasComp.length : 0;
        const mediana = calcularMediana(tempos);

        return {
            complexidade: comp,
            numTarefas: tarefasComp.length,
            totalHoras,
            tempoMedio,
            mediana
        };
    });

    const ctx = document.getElementById('chart-tempo-complexidade');
    if (!ctx) return;

    destroyChart('chart-tempo-complexidade');
    const theme = getChartTheme();

    STATE.charts['chart-tempo-complexidade'] = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dados.map(d => d.complexidade),
            datasets: [
                {
                    label: 'Tempo Médio (h)',
                    data: dados.map(d => d.tempoMedio),
                    backgroundColor: COLORS.violetPrimary,
                    yAxisID: 'y'
                },
                {
                    label: 'Mediana (h)',
                    data: dados.map(d => d.mediana),
                    backgroundColor: COLORS.vivaz,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    backgroundColor: theme.tooltipBg,
                    callbacks: {
                        afterBody: function(items) {
                            const idx = items[0].dataIndex;
                            return [
                                'Nº Tarefas: ' + dados[idx].numTarefas,
                                'Total Horas: ' + formatarTempo(dados[idx].totalHoras)
                            ];
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    color: theme.datalabels,
                    formatter: (val) => val > 0 ? formatarTempo(val) : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Horas', color: theme.text },
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                },
                x: {
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                }
            }
        }
    });
}

function renderTempoPorTags(tarefas) {
    const tagsMap = new Map();

    tarefas.forEach(t => {
        const tags = Array.isArray(t.tags) ? t.tags : (t.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag);
        tags.forEach(tag => {
            if (!tagsMap.has(tag)) {
                tagsMap.set(tag, { tag, tarefas: [], totalHoras: 0 });
            }
            tagsMap.get(tag).tarefas.push(t.tempo);
            tagsMap.get(tag).totalHoras += t.tempo;
        });
    });

    let dados = Array.from(tagsMap.values())
        .filter(d => d.totalHoras > 0)
        .map(d => ({
            tag: d.tag,
            numTarefas: d.tarefas.length,
            totalHoras: d.totalHoras,
            tempoMedio: d.totalHoras / d.tarefas.length,
            mediana: calcularMediana(d.tarefas)
        }))
        .sort((a, b) => b.numTarefas - a.numTarefas); // Ordenar por quantidade de tarefas

    // Limitar a 10 tags se não expandido
    const limit = STATE.tempoExecucao.expandedTags ? dados.length : 10;
    dados = dados.slice(0, limit);

    const ctx = document.getElementById('chart-tempo-tags');
    if (!ctx) return;

    // Ajustar altura do canvas dinamicamente baseado no número de tags
    const minHeight = 300;
    const barHeight = 35; // Altura por barra incluindo espaçamento
    const dynamicHeight = Math.max(minHeight, dados.length * barHeight + 80);
    ctx.parentElement.style.height = dynamicHeight + 'px';

    destroyChart('chart-tempo-tags');
    const theme = getChartTheme();

    STATE.charts['chart-tempo-tags'] = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dados.map(d => d.tag),
            datasets: [{
                label: 'Tempo Médio (h)',
                data: dados.map(d => d.tempoMedio),
                backgroundColor: COLORS.violetPrimary,
                barThickness: 25
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    backgroundColor: theme.tooltipBg,
                    callbacks: {
                        afterBody: function(items) {
                            const idx = items[0].dataIndex;
                            return [
                                'Nº Tarefas: ' + dados[idx].numTarefas,
                                'Total Horas: ' + formatarTempo(dados[idx].totalHoras),
                                'Mediana: ' + formatarTempo(dados[idx].mediana)
                            ];
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'end',
                    color: theme.datalabels,
                    font: {
                        size: 11,
                        weight: 'bold'
                    },
                    formatter: (val) => val > 0 ? formatarTempo(val) : ''
                }
            },
            layout: {
                padding: { right: 80 }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Tempo Médio', color: theme.text },
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                },
                y: {
                    ticks: {
                        color: theme.text,
                        autoSkip: false,
                        font: {
                            size: 11
                        }
                    },
                    grid: { color: theme.grid }
                }
            }
        }
    });

    // Atualizar botão de expansão
    if (UI.btnExpandTags) {
        UI.btnExpandTags.textContent = STATE.tempoExecucao.expandedTags ? 'Mostrar Menos' : 'Mostrar Todas';
    }
}

function renderTempoPorTipo(tarefas) {
    const tiposMap = new Map();

    tarefas.forEach(t => {
        const tipo = t.tipo || 'Sem tipo';
        if (!tiposMap.has(tipo)) {
            tiposMap.set(tipo, { tipo, tarefas: [], totalHoras: 0 });
        }
        tiposMap.get(tipo).tarefas.push(t.tempo);
        tiposMap.get(tipo).totalHoras += t.tempo;
    });

    const dados = Array.from(tiposMap.values())
        .map(d => ({
            tipo: d.tipo,
            numTarefas: d.tarefas.length,
            totalHoras: d.totalHoras,
            tempoMedio: d.totalHoras / d.tarefas.length,
            mediana: calcularMediana(d.tarefas)
        }))
        .sort((a, b) => b.tempoMedio - a.tempoMedio);

    const ctx = document.getElementById('chart-tempo-tipos');
    if (!ctx) return;

    destroyChart('chart-tempo-tipos');
    const theme = getChartTheme();

    STATE.charts['chart-tempo-tipos'] = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dados.map(d => d.tipo),
            datasets: [{
                label: 'Tempo Médio (h)',
                data: dados.map(d => d.tempoMedio),
                backgroundColor: COLORS.violetPrimary
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    backgroundColor: theme.tooltipBg,
                    callbacks: {
                        afterBody: function(items) {
                            const idx = items[0].dataIndex;
                            return [
                                'Nº Tarefas: ' + dados[idx].numTarefas,
                                'Total Horas: ' + formatarTempo(dados[idx].totalHoras),
                                'Mediana: ' + formatarTempo(dados[idx].mediana)
                            ];
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'end',
                    color: theme.datalabels,
                    formatter: (val) => val > 0 ? formatarTempo(val) : ''
                }
            },
            layout: {
                padding: { right: 60 }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Tempo Médio (horas)', color: theme.text },
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                },
                y: {
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                }
            }
        }
    });
}

function renderTempoPorCliente(tarefas) {
    const clientesMap = new Map();

    tarefas.forEach(t => {
        const cliente = t.cliente || 'Sem cliente';
        if (!clientesMap.has(cliente)) {
            clientesMap.set(cliente, { cliente, tarefas: [], totalHoras: 0 });
        }
        clientesMap.get(cliente).tarefas.push(t.tempo);
        clientesMap.get(cliente).totalHoras += t.tempo;
    });

    const dados = Array.from(clientesMap.values())
        .map(d => ({
            cliente: d.cliente,
            numTarefas: d.tarefas.length,
            totalHoras: d.totalHoras,
            tempoMedio: d.totalHoras / d.tarefas.length,
            mediana: calcularMediana(d.tarefas)
        }))
        .sort((a, b) => b.tempoMedio - a.tempoMedio);

    const ctx = document.getElementById('chart-tempo-clientes');
    if (!ctx) return;

    destroyChart('chart-tempo-clientes');
    const theme = getChartTheme();

    STATE.charts['chart-tempo-clientes'] = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dados.map(d => d.cliente),
            datasets: [{
                label: 'Tempo Médio (h)',
                data: dados.map(d => d.tempoMedio),
                backgroundColor: COLORS.violetPrimary
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    backgroundColor: theme.tooltipBg,
                    callbacks: {
                        afterBody: function(items) {
                            const idx = items[0].dataIndex;
                            return [
                                'Nº Tarefas: ' + dados[idx].numTarefas,
                                'Total Horas: ' + formatarTempo(dados[idx].totalHoras),
                                'Mediana: ' + formatarTempo(dados[idx].mediana)
                            ];
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'end',
                    color: theme.datalabels,
                    formatter: (val) => val > 0 ? formatarTempo(val) : ''
                }
            },
            layout: {
                padding: { right: 60 }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Tempo Médio (horas)', color: theme.text },
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                },
                y: {
                    ticks: { color: theme.text },
                    grid: { color: theme.grid }
                }
            }
        }
    });
}

function renderEmptyStateTempoExecucao() {
    // Limpar KPIs
    if (UI.kpiTempoExecucao) {
        Object.values(UI.kpiTempoExecucao).forEach(el => {
            if (el) el.textContent = '0';
        });
    }

    // Destruir charts existentes
    ['chart-distribuicao-tempo', 'chart-tempo-complexidade', 'chart-tempo-tags',
     'chart-tempo-tipos', 'chart-tempo-clientes'].forEach(chartId => {
        destroyChart(chartId);
    });
}

// Start Application
document.addEventListener('DOMContentLoaded', initDashboard);
