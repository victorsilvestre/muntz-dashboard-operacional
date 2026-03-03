# Especificação Técnica (SPEC) - Dashboard Operacional Muntz

## 1. Arquitetura e Stack Tecnológico
O Dashboard Operacional da Muntz será desenvolvido com foco em performance no lado do cliente (Client-Side), garantindo uma experiência fluida, reatividade rápida nos filtros e facilidade de manutenção sem a necessidade imediata de um backend complexo, dado o escopo de leitura de arquivo CSV.

- **Linguagens Base:** HTML5 (Estrutura), CSS3 (Estilização via Vanilla CSS aplicando os Tokens do Design System) e JavaScript (ES6+ para lógica de dados e interatividade).
- **Leitura de Dados (Parser):** **PapaParse** (Biblioteca leve e madura em JavaScript para conversão de arquivos `.csv` em arrays de objetos JSON no navegador).
- **Visualização de Dados (Charts):** **Chart.js** (Biblioteca consolidada, responsiva e altamente customizável via CSS/Canvas, permitindo incorporar as cores da marca Muntz nos gráficos de forma nativa).
- **Processamento de Dados (Filtros):** A reatividade de "Cross-Filtering" será construída utilizando funções nativas de Array do JavaScript (`.filter()`, `.reduce()`, `.map()`), já que o volume de dados (~1500 linhas) é baixo e o JS client-side lida com esse volume em milissegundos.

## 2. Ingestão e Estrutura de Dados
Ao carregar a aplicação, o arquivo `relatorio_tarefas_jan_fev_2026.csv` será lido automaticamente.
O PapaParse converterá cada linha em um objeto com as chaves correspondentes aos cabeçalhos:
`ID`, `Titulo`, `Urgente`, `Tipo`, `Cliente`, `Projeto`, `Etapa`, `Quadro`, `Criada em`, `Atraso`, `Tags`, `Perfil`, `Equipe`, `Horas trabalhadas (h)`, `Data Assignment`.

**Tratamentos previstos no JS (Data Cleaning):**
- **Datas:** Necessário fazer parse das strings (`DD/MM/YYYY HH:mm`) para objetos genéricos `Date` do JavaScript visando permitir filtros de range (`Date A` to `Date B`).
- **Números:** O campo `Horas trabalhadas (h)` pode vir como string com vírgula padrão PT-BR ("1,5"). Deverá sofrer `replace(',', '.')` e parse para `Float` no carregamento da string para facilitar e viabilizar os cálculos de soma.
- **Limpeza de Zeros:** Valores processados consolidados como zero não deverão ser plotados em gráficos para focar na análise de dados relevantes, limpando o excesso visual.

## 3. Lógica Global e Cross-Filtering (O Motor do Dashboard)
Para permitir que qualquer filtro atualize todos os gráficos, adotaremos o padrão de **Estado Global (State Management)** nativo.
Existirá um Objeto central chamado `activeFilters` que escutará as mudanças na interface e uma função gatilho `updateDashboard()` que rodará sobre a base de dados mãe.

### Dinâmica e Ordenação dos Filtros (Selects):
O preenchimento dos selects (ex: `Equipe`, `Perfil`, `Cliente`, `Tipo`, `Mês`) será deduzido dinamicamente da base (`rawData`).
- **Lógica de Ordenação:** Uma função de ordenação alfabética será aplicada para organizar as opções listadas nos dropdowns. Valores nulos ou sem identificação do CSV receberão tratamento `fallback` nomeado de `"(Vazios)"`.
- **Posicionamento Relativo:** A função de `.sort()` contará com uma condição extra que empurra mandatoriamente a string `"(Vazios)"` para o final do array antes da renderização das `<option>`s do HTML.

### Fluxo de Atualização:
1. O array original `rawData` é imutável contendo todas as linhas lidas do CSV.
2. Usuário altera algo na interface (ex: *Mês* = "Janeiro", ou *Equipe* = "Criação").
3. O seletor injeta: `activeFilters.mes = "Janeiro"; activeFilters.equipe = "Criação"`.
4. Dispara a função de atualização macro `updateDashboard()`.
5. Um novo array reduzido `filteredData` é gerado baseado no `activeFilters`.
6. Todas as visualizações (KPIs e Gráficos da instância global do Chart.js) são atualizadas cruzando os dados de `filteredData`.

## 4. Visualizações (Integração com Chart.js)

A equipe consumirá os dados filtrados ("state") via instâncias do Chart.js.

- **Painel de KPIs Rápidos (Cards numéricos):** Manipulação de DOM para contadores.
- **Gráficos de Barras / Stacked Bars:** A exibição de métricas numéricas flutuando atreladas às barras (mesmo com tamanho próximo ao valor zero) será resolvido através da inclusão via CDN e uso ativo do plugin oficial **`chartjs-plugin-datalabels`**. O plugin deve ser fixado com `anchor: 'end'` e `align: 'start'` ou semelhante (ex: posicionado no topo da coluna para não sumir no fundo dependendo da renderização do Chart.js) para evitar sobreposição textual.
- **Gráfico de Horas por Cliente (Bar Chart Horizontal):** Recomendado para labels textuais extensas (nomes das contas e projetos).
- **Correlações e Carga (Doughnut Chart):** Refação, Especialidades ou Agrupamentos circulares para volumetrias visuais.

## 5. Aplicação do Design System (UI/UX)
A interface adotará o layout especificado como **"Tema Claro Premium"**.

- **CSS Variado e Temática:** Background geral do `body` e painéis de fundos dos `.cards` em tons muito claros ou brancos (ex: `#FFFFFF` ou cinzas super brandos), enquanto contornos, botões acionáveis, tipografia e gráficos adotarão intensamente as cores primárias do _Muntz Design System_ (Ametista, Premium Dark e Solar Orange) como forma exclusiva de criar destaque.
- **Nova Estrutura de Layout e Toolbar:**
  - **Sidebar de Navegação:** Existirá na lateral equerda mantendo o menu vertical, contendo a logomarca no topo ("Muntz" via tag `<img src="assets/logomarca/...">`). Ela deverá ser responsiva e **colapsável** (expande/retrai) por meio de manipulações de classes CSS (`.collapsed`). Quando aberta exibe ícone e nome, quando fechada apenas o ícone centralizado e expandido.
  - **Filtros In-Page:** A área central principal conteria um componente horizontal (Flow Container flexível ou Grid CSS) posicionado **antes** do painel de dados. Ele conterá esteticamente os seletores de filtros (Mês, Selects múltiplos em estilo Tag ou Input Customizado) adaptáveis para `mobile-first` (wrap quando atingir a contenção de pixels em dispositivos menores).

## 6. Sumário de Entregáveis 
O projeto irá conter:
1. `index.html`: Toda a estrutura semântica HTML e contêineres (`<canvas>` e `<selects>`).
2. `styles.css`: Estilização vanilla consumindo diretamente os tokens do Muntz Design System.
3. `app.js`: Script orquestrando o PapaParse, lógica de filtros nativa e injeções no Chart.js.
4. O próprio `relatorio_tarefas.csv` no root de leitura para fetch dinâmico.
