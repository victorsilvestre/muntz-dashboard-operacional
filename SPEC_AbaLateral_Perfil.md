# Especificação Técnica (SPEC) - Dashboard Operacional Muntz: Aba "Perfil"

## 1. Arquitetura e Engenharia de Navegação (SPA - Single Page Application)
A nova funcionalidade será incorporada ao ecossistema existente, mantendo a arquitetura puramente Client-Side baseada em HTML5, CSS3 e JS (Vanilla, PapaParse e Chart.js).
Para evitar o tráfego repetido do arquivo `.csv` e o tempo de carregamento decorrente de múltiplas páginas HTML independentes, a aba "Perfil" funcionará em um modelo SPA.
- **Estruturação Funcional (DOM):** Será criada uma nova seção principal `<main id="page-perfil" class="dashboard-page hidden">` enquanto a atual passará a ser `<main id="page-visao-geral" class="dashboard-page active">`.
- **Alternância Nativa (Routing):** Na barra lateral (`.sidebar`), o clique no botão "Perfil" adicionará a classe `hidden` na tela de Visão Geral e removerá da tela de Perfil (manipulação do `classList` no Vanilla JS associada a uma transição CSS suave com opacity/transform).
- **Escopo e Estado Global:** O objeto `rawData` gerado pelo PapaParse continuará global e acessível a todas as abas, resolvendo a questão de ingestão centralizada.

## 2. Visuais e Manipulação de Componentes (Blocos 1, 2 e 3)
A nova tela "Perfil" introduz três blocos que dependerão ativamente de manipulações de DOM e lógicas do motor (Cross-Filtering):

### 2.1. Bloco 1: Filtros (Componentização ou Reuso)
A diretriz determina que os filtros sejam **iguais à tela Visão Geral".**
- *Opção Recomendada (Reuso Visual):* Se o painel de filtros ficar posicionado no Header comum às duas páginas (acima das tags `<main>`, isolado do conteúdo rolável), ele continuará atuando globalmente. Bastará um tratamento para atualizar apenas os gráficos da tela *ativa*.
- *Alternativa (Duplicação Domínio):*  Caso o design exija que fiquem no corpo documentado, os Elementos `<select>` deverão ser clonados e sincronizados via event listeners `.addEventListener('change', runSync)` para manterem o estado em pareamento.

### 2.2. Bloco 2: Visão Geral (Performance de Perfis Múltiplos)
Esta seção processará um grande volume de dados aglomerados ("Agência") e exigirá funções de `.reduce()` mais complexas para gerar as métricas de cada perfil iterado na base.

- **Cartões de KPI (DOM Manipulation):**
  - `<div id="kpi-total-perfis">`, `<div id="kpi-total-tarefas">`, `<div id="kpi-total-horas">`, `<div id="kpi-media-horas">`, `<div id="kpi-media-tarefas">`, `<div id="kpi-media-atraso">`.
  - Serão preenchidos através do cruzamento matemático das colunas `ID`, `Perfil`, `Horas trabalhadas (h)` e `Atraso`.

- **Gráficos (Chart.js Instâncias Gerais):**
  - **Ranking de Perfis (Multi-Bar Vertical/Horizontal):** `type: 'bar', indexAxis: 'y'`. O `datasets` do Chart.js deverá possuir 4 objetos distintos mapeados para a mesma chave de `labels` (Perfis), permitindo a correlação direta (Lado a Lado):
    - `data1`: Total Horas.
    - `data2`: Total Tarefas.
    - `data3`: % Atraso.
    - `data4`: Média Horas/Tarefa.
    - *Nota Técnica:* Será necessário normalizar os eixos configurando escalas (Axes) primárias e secundárias no Chart.js (`yAxisID: 'y1'`, `'y2'`), pois estamos plotando grandezas diferentes num mesmo frame (% versus volume isolado).
  
  - **Distribuição de Carga da Agência (Scatter Chart):** `type: 'scatter'`.
    - Os dados (`data`) deverão ser mapeados iterando o objeto unificado agrupado sob cada `Perfil`. Cada item empurrado para o dataset será um `{x: TotalTarefas, y: TotalHoras}`.
    - *UX Extra:* O Tooltip padrão precisa ser configurado no Chart.js (`options.plugins.tooltip.callbacks.label`) para injetar o Nome do Perfil ao usuário realizar o hover sobre a bolha.
    - Para auxiliar na análise de "Quadrantes", será desenhada uma linha de tendência/média (via plugin `chartjs-plugin-annotation` ou calculando as medianas nos Options do Chart.js) dividindo o grid.
  
  - **Distribuição por Complexidade (Doughnut ou Stacked Bar):**
    - Criar o algoritmo classificador em JavaScript:
      - Exemplo lógico de triagem: Uma tarefa (ID) com X>Horas + Tipo=Y = "Alta Complexidade".
    - Representação consolidando os somatórios desses três perfis (`% Alta`, `% Média`, `% Baixa`).

### 2.3. Bloco 3: Visão Específica (Análise Individual)
A dinâmica principal introduzida: O conteúdo reagirá diretamente se for identificado o(s) Perfil(is) selecionado(s) no array `activeFilters.perfil`.

- **Comportamentos (State Handling):**
  - **Estado Vazio (Empty State):** Se o filtro "Perfis" estiver vazio/Todos, exibir aviso/overlay orientando a seleção de um Perfil.
  - **Estado Ativado (Populated State):** Ao detectar seleção direta, disparar a renderização do bloco com as análises a seguir:

- **1. Gráficos Mantidos (Sem Alteração de Lógica):**
  - *Eficiência de Prazos:* `type: 'doughnut'` para o campo `Atraso`.
  - *Time-Tracking de Clientes:* `type: 'bar'` ou similar, exibindo horas e consumo em contas.

- **2. Produtividade e Eficiência (Tempos Médios):**
  - Instanciar 3 gráficos de barras horizontais (`type: 'bar', indexAxis: 'y'`) exibindo barras agrupadas: Média do Perfil vs Média da Equipe.
  - **Motor de Cálculo Diário:** 
    - *Média Perfil:* Filtrar dataset pelo Perfil em questão agrupando por 'Tipo', 'Tag' e 'Complexidade'. Calcular `Total Horas / Total Itens` para chegar ao "Tempo Médio".
    - *Média Equipe:* Filtrar dataset extraindo todos os colaboradores da mesma `Equipe` do Perfil foco. Calcular `Total Horas / Total Itens` agrupado pelos mesmos eixos, formando a baseline comparativa.
  - Formatar Tooltips expondo: Nº de Itens, Total Horas, Tempo Médio Formatado.

- **3. Especialização do Perfil:**
  - Gráfico de Composição, sugerindo-se *Doughnut* ou *Bar (escala percentual)*.
  - Manipulação de Array: Calcular frequencia das 'Tags' e realizar sort descendente (limitado ao Top 10). Mapear valor sobre Total Geral daquele perfil para obter %.
  - Repetir lógica e instanciar um segundo gráfico lado-a-lado ou empilhado para 'Tipo de Tarefa' (limitado ao Top 3).

- **4. Evolução no Tempo:**
  - Instanciar gráfico Misto no Chart.js (`type: 'bar'` principal com 1 ou 2 `type: 'line'` datasets sobrepostos).
  - **Regra de Agrupamento Dinâmico (Reduce):**
    - Checar `activeFilters.mes`. Se o filtro de Mês estiver vazio/Todos, o `.reduce()` agrupa pelo mês de conclusão (ex: 'Janeiro/2026').
    - Se houver `activeFilters.mes` específico, o `.reduce()` agrupa por Dia do mês.
  - Plotar eixos separados/secundários (`yAxisID: 'y1', yAxisID: 'y2'`) visto que 'Horas', 'Itens' e 'Tarefas' operam em ordens de grandeza distintas no grid.

- **5. Carga vs Capacidade:**
  - **HTML Components / Cards:** Montar painel estático renderizando 3 KPIs principais e um comparativo de equipe com base numa meta de 120h/mês:
    - *Horas Realizadas no Mês:* Total já calculado para esse perfil.
    - *% Ocupação Estimada:* `(Horas Realizadas / 120) * 100`.
    - *Diferença para Meta:* `120 - Horas Realizadas`.
    - *Comparação de Equipe:* Média das horas realizadas pela equipe convertidas em % (Horas Medias Equipe / 120 * 100), exibido textualmente ou como linha de corte no UI.

## 3. Lógica de Atualização Condicional
A função primária global de reatividade `updateDashboard()` deverá ser subdividida por causa da performance. Evitar que todas as dezenas de gráficos (Visão Geral + Perfil) sejam repintados a todo momento consumirá menos CPU do browser.
- **Verificador de Contexto:** Adicionar flag `let currentPage = "visao-geral";` a ser manipulada nos clicks da sidebar.
- O bloco final de `updateDashboard()` verificará a flag `currentPage` e disparará `renderChartsVisaoGeral(filteredData)` **OU** `renderChartsPerfil(filteredData)`, poupando instâncias inativas de Canvas. As instâncias nativas da Chart.js desativadas devem seguir com o `.update()` paralisado até a rota da tab voltar.

## 4. Estilos e Padrões (CSS System Integration)
- Criação e agrupamento de novas classes de layout isoladas em `#page-perfil`, consumindo nativamente as variáveis do topo do `styles.css` (Muntz Premium Light System) sem requerer folha de estilo nova, mantendo o minimalismo.
- Inclusão dos breakpoints Responsivos (@media max-width: 1024px) já previstos, apenas adaptando que a div específica de Perfil pule abaixo da Div Geral em mobile.

## 5. Passos para Implementação
1. Refatorar o `index.html` para comportar seções `.dashboard-page` (Sistema SPA).
2. Adicionar os novos canvas de gráficos para a seção #page-perfil.
3. Modificar/Criar os event listeners da Sidebar para alternância.
4. Definir as novas instâncias do Chart.js dentro de um escopo modularizado (`renderChartsPerfil`).
5. Ligar a validação inteligente para o Bloco 3 "Visão Específica" em relação aos Filtros globais.
