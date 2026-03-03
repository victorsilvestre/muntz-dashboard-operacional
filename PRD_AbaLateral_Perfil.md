# Product Requirements Document (PRD) - Dashboard Operacional Muntz: Aba "Perfil"

## 1. Visão Geral
**Projeto:** Dashboard Operacional Muntz - Evolução: Aba Perfil
**Objetivo:** Desenvolver uma nova aba de navegação lateral rotulada "Perfil", dedicada exclusivamente à análise profunda da performance, alocação e eficiência dos colaboradores (perfis/equipes) da agência Muntz. Esta nova visualização dividirá a análise em macro e micro (Geral e Específico), permitindo aos gestores identificar gargalos individuais, volume de entrega e qualidade de trabalho.

## 2. Estrutura da Página e Blocos Visuais
A nova tela "Perfil" será dividida sistematicamente em 3 grandes blocos organizacionais, seguindo uma hierarquia de informação em cascata:

### 2.1. Bloco 1: Filtros (Padrão Visão Geral)
Para garantir fluidez e curva de aprendizado nula para o usuário, este bloco manterá a **exata mesma estrutura de filtros** encontrados na aba "Visão Geral".
- **Filtros Disponíveis:** Mês, Equipes, Perfis, Cliente, Tipo, Tags e os Toggles de Atraso e Urgência.
- **Comportamento:** Os filtros interagem ativamente com a base, retroalimentando os blocos "Geral" e "Específico" da aba de Perfil.

### 2.2. Bloco 2: Visão Geral (Panorama e Desempenho Coletivo)
Este bloco atuará como um painel de monitoramento "bird's-eye view" da agência completa, exibindo a produtividade consolidada das equipes e seus perfis com base nos filtros ativos. A estrutura deste bloco baseia-se em 4 eixos analíticos:

**1️⃣ KPIs Globais (Panorama Geral da Agência):**
Cartões numéricos (KPI Cards) posicionados no topo do bloco, apresentando:
- **Total de Perfis Ativos:** Contagem única de perfis retornados no filtro atual.
- **Total de Tarefas:** Volume absoluto deIDs únicos ou tarefas.
- **Total de Horas Trabalhadas:** Somatória do esforço em horas.
- **Média de Horas por Perfil:** (Total de Horas Trabalhadas) / (Total de Perfis).
- **Média de Tarefas por Perfil:** (Total de Tarefas) / (Total de Perfis).
- **% Médio de Atraso:** Proporção de tarefas atrasadas no montante analisado.

**2️⃣ Ranking de Perfis:**
- **Visualização:** Gráfico de barras horizontais exibindo o status dos perfis de forma comparativa.
- **Métricas Renderizadas:** Cada perfil exibido no eixo Y possuirá uma composição agrupada de **4 barras lado a lado**, representando:
  1. Total de horas acumuladas;
  2. Total de tarefas concluídas;
  3. Precentual (%) de atraso;
  4. Média de horas gastas por tarefa do perfil.

**3️⃣ Distribuição de Carga da Agência (Scatter Plot):**
- **Visualização:** Gráfico de Dispersão (Scatter) onde cada "bolha" corresponde a 1 Perfil.
- **Eixos:** 
  - **Eixo X:** Nº de tarefas.
  - **Eixo Y:** Horas trabalhadas.
- **Objetivo da Análise de Quadrantes:**
  - *Alta tarefa + Alta hora:* Perfil sobrecarregado.
  - *Alta tarefa + Baixa hora:* Perfil rápido/operacional.
  - *Baixa tarefa + Alta hora:* Perfil alocado em demandas de alta complexidade.
  - *Baixa tarefa + Baixa hora:* Perfil subutilizado ou com ociosidade.

**4️⃣ Distribuição por Complexidade (Agência):**
Classificação baseada em regras de negócio (a serem detalhadas) para mensurar o volume ou o percentual das entregas sob 3 prismas:
- **% Baixa Complexidade**
- **% Média Complexidade**
- **% Alta Complexidade**

### 2.3. Bloco 3: Visão Específica (Deep-dive do Colaborador)
Este bloco ganhará destaque quando um ou mais perfis forem selecionados nos Filtros (ou através de um clique/drill-down vindo do Bloco Geral). Ele focará no desempenho cirúrgico e isolado.
- **Painel do Perfil:** Nome/Cargo do Perfil em destaque.
- **Indicadores Individuais de Eficiência:** 
  - Total de horas do perfil, Quantidade de tarefas únicas (IDs).
  - % de tarefas entregues com Atraso vs. No Prazo (Gráfico de Rosca/Doughnut).
  - Proporção de 'Demandas' vs. 'Ajustes' realizados pelo colaborador.
- **Alocação de Tempo:** Gráfico de barras ou teia evidenciando em quais *Clientes*, *Projetos* ou *Etapas* o colaborador consome mais tempo de vida útil da agência.

## 3. Dinâmica de Interação e Navegação
- **Adição na Sidebar:** A barra lateral (sidebar) ganhará o novo botão "Perfil", posicionado abaixo do botão "Visão Geral". A navegação alternará o conteúdo central (SPA - Single Page Application) sem recarregar a página, mantendo os dados cacheados na memória.
- **Cross-filtering Direto:** O Bloco Específico deve se comportar de maneira reativa. Quando a aba abrir sem perfil selecionado, ele pode apresentar um estado vazio amigável ("Selecione um perfil para ver seus dados específicos") ou agregar as métricas de todos (embora menos legível, é uma opção técnica). Ao cruzar a seleção de filtro (ex: Perfil = Designer X), os dados do Bloco Específico se preenchem automaticamente.

## 4. Requisitos de UX/UI (Design System)
- **Consistência:** A tela seguirá à risca o Tema Claro Premium (Muntz.OPS) já documentado, com tipografia, contrastes, bordas sutis e fundo claro.
- **Transições:** A troca entre a aba "Visão Geral" e "Perfil" deve ser suave, com *fade-in* nos gráficos para trazer uma percepção de agilidade do sistema.
- **Layout dos Blocos:** 
  - Os *Filtros* ficarão no topo fixos no fluxo da página.
  - O bloco *Geral* pode ocupar a porção superior das análises com cartões e gráficos mais largos.
  - O bloco *Específico* concentrará análises mais agrupadas, possivelmente dividindo a tela em grid (ex: dois gráficos lado a lado) para visualização consolidada do colaborador.

## 5. Próximos Passos
Validação desta documentação (PRD) para atestar que os dados sugeridos nos blocos Geral e Específico atendem à dor da gestão. Na sequência, avança-se para a Especificação Técnica (SPEC) que desenhará a engenharia de código necessária para incluir essa funcionalidade e estender a base local sem quebras de performance.
