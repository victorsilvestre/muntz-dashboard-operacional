# Especificação Técnica (SPEC) - Dashboard Operacional Muntz: Aba "Tempo de Execução"

## 1. Arquitetura e Engenharia de Navegação (SPA - Single Page Application)
A nova funcionalidade será incorporada ao ecossistema existente, mantendo a arquitetura puramente Client-Side baseada em HTML5, CSS3 e JS (Vanilla, PapaParse e Chart.js).
Para manter consistência com a arquitetura SPA já implementada, a aba "Tempo de Execução" seguirá o mesmo padrão das abas "Visão Geral" e "Perfil".

- **Estruturação Funcional (DOM):** Será criada uma nova seção principal `<main id="page-tempo-execucao" class="dashboard-page hidden">`.
- **Alternância Nativa (Routing):** Na barra lateral (`.sidebar`), o clique no botão "Tempo de Execução" removerá a classe `active` da página atual e adicionará à nova página (manipulação do `classList` no Vanilla JS associada a uma transição CSS suave com opacity/transform).
- **Escopo e Estado Global:** O objeto `STATE.rawData` gerado pelo PapaParse continuará global e acessível a todas as abas, resolvendo a questão de ingestão centralizada.
- **Atualização de Estado:** Adicionar `'tempo-execucao'` como valor possível para `STATE.currentPage`.

## 2. Estrutura HTML (index.html)

### 2.1. Sidebar - Novo Item de Navegação
**Localização:** Dentro de `<nav class="sidebar-content">` → `<ul class="nav-menu">`

```html
<li class="nav-item" id="nav-tempo-execucao">
    <a href="#"><i class="ri-timer-line"></i> <span class="nav-text">Tempo de Execução</span></a>
</li>
```

**Posicionamento:** Inserir após o item "Perfil" (`#nav-perfil`), antes do item "Projetos (Em breve)".

### 2.2. Nova Página - Tempo de Execução
**Localização:** Dentro de `<main class="main-content">`, após `<div id="page-perfil">`.

**Estrutura Base:**
```html
<!-- PAGE: TEMPO DE EXECUÇÃO -->
<div id="page-tempo-execucao" class="dashboard-page hidden">

    <!-- KPIs Gerais -->
    <div class="kpi-grid">
        <div class="kpi-card glass-card">
            <div class="kpi-icon"><i class="ri-task-line"></i></div>
            <div class="kpi-data">
                <h3 id="kpi-total-tarefas-tempo">0</h3>
                <p>Tarefas Analisadas</p>
            </div>
        </div>

        <div class="kpi-card glass-card kpi-primary">
            <div class="kpi-icon"><i class="ri-time-line"></i></div>
            <div class="kpi-data">
                <h3 id="kpi-total-horas-tempo">0h</h3>
                <p>Total de Horas</p>
            </div>
        </div>

        <div class="kpi-card glass-card">
            <div class="kpi-icon"><i class="ri-bar-chart-line"></i></div>
            <div class="kpi-data">
                <h3 id="kpi-tempo-medio-geral">0h</h3>
                <p>Tempo Médio por Tarefa</p>
            </div>
        </div>

        <div class="kpi-card glass-card">
            <div class="kpi-icon"><i class="ri-equalizer-line"></i></div>
            <div class="kpi-data">
                <h3 id="kpi-mediana-tempo">0h</h3>
                <p>Mediana de Tempo</p>
            </div>
        </div>

        <div class="kpi-card glass-card kpi-accent">
            <div class="kpi-icon"><i class="ri-speed-up-line"></i></div>
            <div class="kpi-data">
                <h3 id="kpi-tempo-minimo">0h</h3>
                <p>Tempo Mínimo</p>
            </div>
        </div>

        <div class="kpi-card glass-card kpi-warning">
            <div class="kpi-icon"><i class="ri-speed-down-line"></i></div>
            <div class="kpi-data">
                <h3 id="kpi-tempo-maximo">0h</h3>
                <p>Tempo Máximo</p>
            </div>
        </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">

        <!-- Distribuição do Tempo (Histograma) -->
        <div class="chart-card glass-card span-6">
            <div class="card-header">
                <h3><i class="ri-bar-chart-box-line"></i> Distribuição do Tempo</h3>
                <p class="card-subtitle">Concentração de tarefas por faixa de duração</p>
            </div>
            <div class="chart-body">
                <canvas id="chart-distribuicao-tempo"></canvas>
            </div>
        </div>

        <!-- Tempo de Execução Por Complexidade -->
        <div class="chart-card glass-card span-6">
            <div class="card-header">
                <h3><i class="ri-stack-line"></i> Tempo de Execução Por Complexidade</h3>
                <p class="card-subtitle">Análise de tempos por nível de complexidade</p>
            </div>
            <div class="chart-body">
                <canvas id="chart-tempo-complexidade"></canvas>
            </div>
        </div>

        <!-- Tempo de Execução Por Tag -->
        <div class="chart-card glass-card span-12">
            <div class="card-header action-header">
                <h3><i class="ri-price-tag-3-line"></i> Tempo de Execução Por Tag</h3>
                <button id="btn-expand-tags" class="btn-text">Mostrar Todas</button>
            </div>
            <div class="chart-body">
                <canvas id="chart-tempo-tags"></canvas>
            </div>
        </div>

        <!-- Tempo de Execução Por Tipo -->
        <div class="chart-card glass-card span-6">
            <div class="card-header">
                <h3><i class="ri-folder-line"></i> Tempo de Execução Por Tipo</h3>
                <p class="card-subtitle">Comparação de tempos entre tipos de tarefa</p>
            </div>
            <div class="chart-body">
                <canvas id="chart-tempo-tipos"></canvas>
            </div>
        </div>

        <!-- Tempo de Execução Por Cliente -->
        <div class="chart-card glass-card span-6">
            <div class="card-header">
                <h3><i class="ri-building-line"></i> Tempo de Execução Por Cliente</h3>
                <p class="card-subtitle">Análise de tempo médio por cliente</p>
            </div>
            <div class="chart-body">
                <canvas id="chart-tempo-clientes"></canvas>
            </div>
        </div>

    </div>
</div>
```

## 3. Lógica JavaScript (dashboard.js)

### 3.1. Atualização do STATE Global
**Localização:** Início do arquivo, no objeto `STATE`.

```javascript
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
```

### 3.2. Atualização do UI Elements Map
**Localização:** Adicionar ao objeto `UI`.

```javascript
// Adicionar ao objeto UI existente:
navTempoExecucao: document.getElementById('nav-tempo-execucao'),
pageTempoExecucao: document.getElementById('page-tempo-execucao'),
btnExpandTags: document.getElementById('btn-expand-tags'),
kpiTempoExecucao: {
    totalTarefas: document.getElementById('kpi-total-tarefas-tempo'),
    totalHoras: document.getElementById('kpi-total-horas-tempo'),
    tempoMedio: document.getElementById('kpi-tempo-medio-geral'),
    mediana: document.getElementById('kpi-mediana-tempo'),
    tempoMin: document.getElementById('kpi-tempo-minimo'),
    tempoMax: document.getElementById('kpi-tempo-maximo')
}
```

### 3.3. Navegação SPA - Event Listeners
**Localização:** Adicionar na função de inicialização de navegação (próximo aos listeners de `navVisaoGeral` e `navPerfil`).

```javascript
// Event Listener para navegação
if (UI.navTempoExecucao) {
    UI.navTempoExecucao.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToPage('tempo-execucao');
    });
}

// Atualizar função navigateToPage para incluir a nova página
function navigateToPage(pageName) {
    // Remover active de todos os nav-items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Ocultar todas as páginas
    document.querySelectorAll('.dashboard-page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });

    // Ativar página e nav-item corretos
    STATE.currentPage = pageName;

    if (pageName === 'visao-geral') {
        UI.pageVisaoGeral.classList.add('active');
        UI.pageVisaoGeral.classList.remove('hidden');
        UI.navVisaoGeral.classList.add('active');
        document.querySelector('.page-title h1').textContent = 'Visão Geral da Operação';
    } else if (pageName === 'perfil') {
        UI.pagePerfil.classList.add('active');
        UI.pagePerfil.classList.remove('hidden');
        UI.navPerfil.classList.add('active');
        document.querySelector('.page-title h1').textContent = 'Análise de Perfis';
    } else if (pageName === 'tempo-execucao') {
        UI.pageTempoExecucao.classList.add('active');
        UI.pageTempoExecucao.classList.remove('hidden');
        UI.navTempoExecucao.classList.add('active');
        document.querySelector('.page-title h1').textContent = 'Tempo de Execução';
    }

    // Re-renderizar apenas a página ativa
    updateDashboard();
}
```

### 3.4. Função de Atualização Condicional
**Localização:** Atualizar a função `updateDashboard()` para incluir lógica condicional.

```javascript
function updateDashboard() {
    applyFilters();

    if (STATE.currentPage === 'visao-geral') {
        renderChartsVisaoGeral(STATE.filteredData);
    } else if (STATE.currentPage === 'perfil') {
        renderChartsPerfil(STATE.filteredData);
    } else if (STATE.currentPage === 'tempo-execucao') {
        renderChartsTempoExecucao(STATE.filteredData);
    }
}
```

### 3.5. Funções de Cálculo Estatístico

#### 3.5.1. Função para Calcular Tempos por Tarefa
```javascript
/**
 * Agrupa dados por tarefa (ID único) e calcula tempo total de cada tarefa
 * @param {Array} data - Array de registros filtrados
 * @returns {Array} Array de objetos {id, tempo, ...outrosMetadados}
 */
function calcularTemposPorTarefa(data) {
    const tarefasMap = new Map();

    data.forEach(row => {
        const id = row.ID;
        const horas = parseFloat(row['Horas trabalhadas (h)']) || 0;

        if (!tarefasMap.has(id)) {
            tarefasMap.set(id, {
                id: id,
                tempo: 0,
                cliente: row.Cliente,
                tipo: row.Tipo,
                tags: row.Tags,
                complexidade: row.Complexidade
            });
        }

        tarefasMap.get(id).tempo += horas;
    });

    return Array.from(tarefasMap.values()).filter(t => t.tempo > 0);
}
```

#### 3.5.2. Função para Calcular Mediana
```javascript
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
```

#### 3.5.3. Função para Formatar Tempo
```javascript
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
```

### 3.6. Função Principal de Renderização
```javascript
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
```

### 3.7. Renderização de KPIs
```javascript
function renderKPIsTempoExecucao(tarefas, tempos) {
    const totalTarefas = tarefas.length;
    const totalHoras = tarefas.reduce((sum, t) => sum + t.tempo, 0);
    const tempoMedio = totalTarefas > 0 ? totalHoras / totalTarefas : 0;
    const mediana = calcularMediana(tempos);
    const tempoMin = tempos.length > 0 ? Math.min(...tempos) : 0;
    const tempoMax = tempos.length > 0 ? Math.max(...tempos) : 0;

    UI.kpiTempoExecucao.totalTarefas.textContent = totalTarefas.toLocaleString('pt-BR');
    UI.kpiTempoExecucao.totalHoras.textContent = formatarTempo(totalHoras);
    UI.kpiTempoExecucao.tempoMedio.textContent = formatarTempo(tempoMedio);
    UI.kpiTempoExecucao.mediana.textContent = formatarTempo(mediana);
    UI.kpiTempoExecucao.tempoMin.textContent = formatarTempo(tempoMin);
    UI.kpiTempoExecucao.tempoMax.textContent = formatarTempo(tempoMax);
}
```

### 3.8. Renderização de Gráficos

#### 3.8.1. Distribuição do Tempo (Histograma)
```javascript
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

    const ctx = document.getElementById('chart-distribuicao-tempo').getContext('2d');
    destroyChart('chart-distribuicao-tempo');

    STATE.charts['chart-distribuicao-tempo'] = new Chart(ctx, {
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
                    formatter: (val, ctx) => {
                        return val + ' (' + distribuicao[ctx.dataIndex].percent + '%)';
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Quantidade de Tarefas' }
                },
                x: {
                    title: { display: true, text: 'Faixa de Tempo' }
                }
            }
        }
    });
}
```

#### 3.8.2. Tempo Por Complexidade
```javascript
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

    const ctx = document.getElementById('chart-tempo-complexidade').getContext('2d');
    destroyChart('chart-tempo-complexidade');

    STATE.charts['chart-tempo-complexidade'] = new Chart(ctx, {
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
                    formatter: (val) => formatarTempo(val)
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Horas' }
                }
            }
        }
    });
}
```

#### 3.8.3. Tempo Por Tags
```javascript
function renderTempoPorTags(tarefas) {
    const tagsMap = new Map();

    tarefas.forEach(t => {
        const tags = (t.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag);
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
        .sort((a, b) => b.totalHoras - a.totalHoras);

    // Limitar a 10 tags se não expandido
    const limit = STATE.tempoExecucao.expandedTags ? dados.length : 10;
    dados = dados.slice(0, limit);

    // Ordenar por tempo médio descendente
    dados.sort((a, b) => b.tempoMedio - a.tempoMedio);

    const ctx = document.getElementById('chart-tempo-tags');
    if (!ctx) return;

    // Ajustar altura do canvas dinamicamente baseado no número de tags
    const minHeight = 400; // Aumentar altura mínima
    const barHeight = 50; // Aumentar o espaçamento/altura natural por barra
    const dynamicHeight = Math.max(minHeight, dados.length * barHeight + 80);
    ctx.parentElement.style.height = dynamicHeight + 'px';

    destroyChart('chart-tempo-tags');

    STATE.charts['chart-tempo-tags'] = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dados.map(d => d.tag),
            datasets: [{
                label: 'Tempo Médio (h)',
                data: dados.map(d => d.tempoMedio),
                backgroundColor: (context) => {
                    return context.chart ? createGradient(context.chart.ctx, COLORS.violetPrimary, 'rgba(189, 95, 255, 0.2)') : COLORS.violetPrimary;
                },
                hoverBackgroundColor: COLORS.violetPrimary,
                borderWidth: 0,
                borderRadius: 4,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
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
                    formatter: (val) => formatarTempo(val)
                }
            },
            layout: {
                padding: { right: 60 }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Tempo Médio (horas)' }
                }
            }
        }
    });

    // Atualizar botão de expansão
    if (UI.btnExpandTags) {
        UI.btnExpandTags.textContent = STATE.tempoExecucao.expandedTags ? 'Mostrar Menos' : 'Mostrar Todas';
    }
}

// Event Listener para botão de expansão
if (UI.btnExpandTags) {
    UI.btnExpandTags.addEventListener('click', () => {
        STATE.tempoExecucao.expandedTags = !STATE.tempoExecucao.expandedTags;
        renderTempoPorTags(calcularTemposPorTarefa(STATE.filteredData));
    });
}
```

#### 3.8.4. Tempo Por Tipo
```javascript
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

    const ctx = document.getElementById('chart-tempo-tipos').getContext('2d');
    destroyChart('chart-tempo-tipos');

    STATE.charts['chart-tempo-tipos'] = new Chart(ctx, {
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
                    formatter: (val) => formatarTempo(val)
                }
            },
            layout: {
                padding: { right: 60 }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Tempo Médio (horas)' }
                }
            }
        }
    });
}
```

#### 3.8.5. Tempo Por Cliente
```javascript
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

    const ctx = document.getElementById('chart-tempo-clientes').getContext('2d');
    destroyChart('chart-tempo-clientes');

    STATE.charts['chart-tempo-clientes'] = new Chart(ctx, {
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
                    formatter: (val) => formatarTempo(val)
                }
            },
            layout: {
                padding: { right: 60 }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Tempo Médio (horas)' }
                }
            }
        }
    });
}
```

### 3.9. Função Auxiliar - Destruir Chart
```javascript
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
```

### 3.10. Estado Vazio
```javascript
function renderEmptyStateTempoExecucao() {
    // Limpar KPIs
    Object.values(UI.kpiTempoExecucao).forEach(el => {
        if (el) el.textContent = '0';
    });

    // Destruir charts existentes
    ['chart-distribuicao-tempo', 'chart-tempo-complexidade', 'chart-tempo-tags',
     'chart-tempo-tipos', 'chart-tempo-clientes'].forEach(chartId => {
        destroyChart(chartId);
    });
}
```

## 4. Estilos CSS

### 4.1. Classes Específicas (dashboard.css)
Não são necessárias novas classes CSS específicas, pois a aba reutilizará as classes existentes:
- `.dashboard-page` (para controle de exibição)
- `.kpi-grid` e `.kpi-card` (para KPIs)
- `.charts-grid` e `.chart-card` (para gráficos)
- `.glass-card` (efeito glassmorphism)
- `.span-6`, `.span-12` (grid layout)

### 4.2. Ajustes de Responsividade
Garantir que os breakpoints existentes (`@media max-width: 1024px`) se apliquem corretamente à nova página.

### 4.3. Modo Escuro
Todas as variáveis CSS existentes para modo escuro (`[data-theme="dark"]`) serão automaticamente aplicadas aos novos elementos, garantindo contraste adequado.

## 5. Integração com Filtros Existentes
A aba "Tempo de Execução" responderá aos mesmos filtros globais já implementados:
- Mês
- Cliente
- Equipe
- Perfil
- Tipo
- Urgente (toggle)
- Atraso (toggle)

**Importante:** A aba NÃO terá filtro de Tags como filtro selecionável, pois Tags são uma dimensão de análise (eixo dos gráficos), não um filtro pré-aplicável.

## 6. Performance e Otimizações

### 6.1. Cálculo Eficiente
- Usar `Map()` para agregações ao invés de loops aninhados
- Calcular tempos por tarefa uma única vez e reutilizar o resultado
- Destruir charts inativos para liberar memória

### 6.2. Lazy Loading de Charts
- Renderizar charts apenas quando a página está ativa
- Reutilizar instâncias de Chart.js quando possível

### 6.3. Debounce de Filtros
- Manter o debounce existente nos filtros para evitar múltiplas renderizações simultâneas

## 7. Passos para Implementação

### Fase 1: Estrutura Base
1. Adicionar item de navegação na sidebar (`index.html`)
2. Criar estrutura HTML da página `#page-tempo-execucao` (`index.html`)
3. Adicionar referências no objeto `UI` (`dashboard.js`)
4. Implementar navegação SPA para a nova aba (`dashboard.js`)

### Fase 2: Lógica de Cálculo
5. Implementar funções auxiliares: `calcularTemposPorTarefa()`, `calcularMediana()`, `formatarTempo()`
6. Implementar função `renderKPIsTempoExecucao()`
7. Testar cálculos estatísticos com dados reais

### Fase 3: Visualizações
8. Implementar `renderDistribuicaoTempo()` (histograma)
9. Implementar `renderTempoPorComplexidade()`
10. Implementar `renderTempoPorTags()` com lógica de expansão
11. Implementar `renderTempoPorTipo()`
12. Implementar `renderTempoPorCliente()`

### Fase 4: Integração e Refinamentos
13. Integrar função principal `renderChartsTempoExecucao()` no fluxo de `updateDashboard()`
14. Implementar event listener para botão "Mostrar Todas" de tags
15. Testar responsividade e modo escuro
16. Ajustar data labels e tooltips para legibilidade
17. Validar performance com dataset completo

### Fase 5: Testes e Validação
18. Testar todos os filtros (Mês, Cliente, Equipe, Perfil, Tipo, Urgente, Atraso)
19. Validar cálculos estatísticos (média vs mediana)
20. Testar navegação entre abas
21. Validar estado vazio (sem dados filtrados)
22. Testar expansão de tags (Top 10 vs Todas)

## 8. Considerações Técnicas Adicionais

### 8.1. Agrupamento de Tarefas por ID
**Importante:** A lógica deve agrupar registros por `ID` (tarefa única) antes de calcular estatísticas, pois cada tarefa pode ter múltiplos registros (um por perfil envolvido). O tempo total da tarefa é a soma de todos os registros com mesmo `ID`.

### 8.2. Tratamento de Valores Ausentes
- Tarefas com `Horas trabalhadas (h)` = 0 ou vazias devem ser filtradas após agrupamento
- Tags vazias ou inválidas devem ser ignoradas
- Clientes/Tipos sem valor devem ser exibidos como "Sem cliente"/"Sem tipo"

### 8.3. Formatação Consistente
- Usar sempre `formatarTempo()` para exibição de valores temporais
- Manter 2 casas decimais para métricas de tempo
- Usar `toLocaleString('pt-BR')` para números inteiros (contagens)

### 8.4. Acessibilidade
- Garantir que labels de gráficos sejam legíveis (contraste adequado)
- Tooltips devem fornecer contexto completo
- Ícones devem ter significado semântico (ri-timer-line para tempo, ri-bar-chart-line para média, etc)

## 9. Histórico de Ajustes Técnicos

### Versão 1.1 - Ajustes de UX/UI (03/03/2026)
**Ajustes técnicos implementados:**

#### 1. Conversão de Formato de Tempo
- **Localização:** Função `formatarTempo()` em `dashboard.js`
- **Mudança:** Alterado de formato decimal (2.5h) para hh:mm (2:30h)
- **Implementação:**
  ```javascript
  const horasInteiras = Math.floor(horas);
  const minutos = Math.round((horas - horasInteiras) * 60);
  return `${horasInteiras}:${minutos.toString().padStart(2, '0')}h`;
  ```

#### 2. Ordenação de Tags por Quantidade
- **Localização:** Função `renderTempoPorTags()` em `dashboard.js`
- **Mudança:** Alterado sort de `totalHoras` para `numTarefas`
- **Implementação:**
  ```javascript
  .sort((a, b) => b.numTarefas - a.numTarefas);
  ```

#### 3. Altura Dinâmica do Gráfico de Tags
- **Localização:** Função `renderTempoPorTags()` em `dashboard.js`
- **Implementação:**
  ```javascript
  const barHeight = 35;
  const dynamicHeight = Math.max(300, dados.length * barHeight + 80);
  ctx.parentElement.style.height = dynamicHeight + 'px';
  ```
- **Configuração adicional:**
  ```javascript
  barThickness: 25,
  ticks: { autoSkip: false, font: { size: 11 } }
  ```

#### 4. Padding no Histograma
- **Localização:** Função `renderDistribuicaoTempo()` em `dashboard.js`
- **Implementação:**
  ```javascript
  layout: {
      padding: { top: 30 }
  }
  ```

#### 5. Ícone do Card Tempo Máximo
- **Localização:** `index.html` linha ~517
- **Mudança:** Alterado de `ri-speed-down-line` para `ri-timer-flash-line`

#### 6. Remoção de Subtítulos
- **Localização:** `index.html` cards de gráficos
- **Mudança:** Removidos elementos `<p class="card-subtitle">` de todos os gráficos

#### 7. Posicionamento do Botão "Mostrar Todas"
- **Localização:** `index.html` linha ~552
- **Implementação:** Botão posicionado no canto superior direito via CSS existente `.btn-text`

### Versão 1.0 - Especificação Inicial (03/03/2026)
**Criação do documento:**
- Definição completa da arquitetura SPA
- Especificação de estrutura HTML
- Implementação de lógica JavaScript
- Funções de cálculo estatístico (média, mediana, min, max)
- Renderização de 5 tipos de gráficos
- Sistema de expansão de tags
- Integração com filtros existentes
- Otimizações de performance

## 10. Referências e Dependências
- **Chart.js:** v4.4.0 (gráficos)
- **ChartJS Plugin DataLabels:** v2.2.0 (labels nos gráficos)
- **PapaParse:** v5.4.1 (parsing CSV)
- **Remix Icon:** v3.5.0 (ícones)
- **Arquitetura:** SPA Vanilla JS (sem frameworks)
- **Padrão de código:** Seguir convenções estabelecidas em `dashboard.js` existente
