# Especificação Técnica (SPEC) - Dashboard Operacional Muntz: Aba "Mike"

## 1. Arquitetura e Estrutura Visual do DOM
- Criaremos um novo container no fluxo da SPA: `<div id="page-mike" class="dashboard-page hidden">`.
- Novo botão de navegação na aside (`#nav-mike`).
- Serão gerados 5 canvas para o Bloco 1 (ex: `#chart-mike-clientes`, `#chart-mike-equipes`, `#chart-mike-cargos`, `#chart-mike-perfis`, `#chart-mike-tags`).
- Adicionaremos uma construção `<table>` baseada nas classes `.glass-card` com um `<tbody>` dinâmico manipulado via Vanilla JS.

## 2. Ingestão de Dados
O CSV fornecido já possui os campos base necessários, porém necessitamos garantir a ingestão da coluna de **Cargo**. Modificar a rotina `processData` no `dashboard.js`:
```js
cargo: (row['Cargo'] || '').trim(),
```

## 3. Comportamento e Navegação
- Expandiremos `navigateToPage('mike')` desativando as outras classes `active` e cuidando da apresentação via `updateDashboard()`.
- Criaremos a função seletora `renderChartsMike(filteredData)` em `updateDashboard` chamada caso `currentPage === 'mike'`.

## 4. Motor de Renderização de Gráficos (Bloco 1)
Como existem cruzamentos do tipo Y x Series (Cargos x Clientes), os dados processados precisarão ser agrupados não em chaves simples, mas em matrizes bidimensionais para o Chart.js suportar `stacked: true`.

**Lógica de Agrupamento Dinâmico (Pivot):**
1. Agrupar os totais de forma integral, sem limitação de quantidade, reunindo todas as categorias válidas presentes na base (ex: Todos os Cargos, Todas as Equipes).
2. Para cada categoria do eixo Y, acumular as horas agrupadas pelas sub-séries (ex: Clientes).
3. Montar a propriedade `datasets` iterando as sub-séries (cada sub-série é um dataset) e inserindo o valor correspondente no index de cada categoria principal.

## 5. Algoritmos da Tabela Responsiva (Bloco 2)
1. **Redutor Base (Reducer):**
   - Agrupa as tags únicas. Para tags separadas por vírgula em linhas individuais, precisaremos tratar o split do array `item.tags`.
   - Adiciona `horas` e `quantidade` no acumulador iterativo.
2. **Formatação (hh:mm):**
   - Função auxiliar:
     ```js
     function decimalToTime(decimalHoras) {
         if(!decimalHoras) return '00:00';
         const h = Math.floor(decimalHoras);
         const m = Math.round((decimalHoras - h) * 60);
         return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
     }
     ```
3. **Mecânica de Sort:**
   - Criaremos a hierarquia de objetos e os renderizaremos na DOM usando Template Literals.
   - Headers da Tabela receberão `data-sort="nomeColuna"` e um event listener que reordena o Array final de Tags com base numa direção atual do state (`sortDirection = asc|desc`) e re-invoca `renderTableMike()`.
4. **CSS: Barras de Progresso Embutidas:**
   - Na coluna de porcentagem, injetar uma background-image estilo: `background: linear-gradient(to right, rgba(189,95,255,0.3) ${percent}%, transparent ${percent}%);`. Fica perfeito, aderente ao Glassmorphism, sem causar poluição de novas `.progress-bar` independentes.

## 6. CSS System
Adicionaremos poucas regras extras caso necessário diretamente para o layout de tabelas visando garantir que as células `.mike-table td` correspondam aos visuais definidos em variáveis `var(--color-text-main)` e o overflow de scrolling nos painéis largos.
