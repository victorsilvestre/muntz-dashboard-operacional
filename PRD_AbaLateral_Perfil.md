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

### 2.3. Bloco 3: Visão Específica (Análise Individual)
Este bloco ganhará destaque quando um ou mais perfis forem selecionados nos Filtros (ou através de um clique/drill-down vindo do Bloco Geral). Ele focará no desempenho detalhado e produtivo do perfil, mantendo as análises vitais e agregando novos eixos estratégicos.

**1️⃣ Indicadores já existentes (Manter sem alteração):**
- **Eficiência de Prazos:** % de tarefas entregues com Atraso vs. No Prazo (Gráfico de Rosca/Doughnut).
- **Time-Tracking por Cliente:** Evolução e consumo de horas distribuídos por contas/clientes.

**2️⃣ Produtividade e Eficiência (Tempos Médios)**
Visa avaliar a velocidade de entrega comparativa. Serão visões separadas demonstrando o tempo médio gasto por:
- **Tipo de Tarefa** (Ex: Demandas - 48 itens | 24 horas | 0:30 média)
- **Tag** (Ex: cria - peça digital | 60 itens | 120 horas | 2:00 média)
- **Complexidade** (Ex: Baixa Complexidade | 6 itens | 2 horas | 0:20 média)
*Requisitos em todos os gráficos:*
- Exibir a **comparação com a média da equipe** (benchmark) para visualizarmos claramente se os tempos do perfil são maiores ou menores que a média de seus pares.
- **Data Labels obrigatórios:** Os valores numéricos (tempo médio em horas) devem ser exibidos diretamente nas barras dos gráficos, seguindo os mesmos padrões de formatação e espaçamento já aplicados em outros gráficos do dashboard para evitar sobreposição ou corte de informação.

**3️⃣ Especialização do Perfil**
Responde à pergunta: "Esse perfil é especialista ou generalista?".
- **Visual Sugerido:** Distribuição de composição em percentuais.
- **Métricas:** Composição de atuação por **Tags (Top 10)** e **Tipos de Tarefa (Top 3)**.
- Exemplo de leitura: 45% do esforço em 'Demanda', e Tags concentradas em 40% 'E-mail', 25% 'CRM'.

**4️⃣ Evolução no Tempo (Análise Diária e Mensal)**
Mostra a dinâmica temporal (crescimento, picos, sobrecarga e mudança de perfil de atuação), essencial para coordenação.
- **Transição Automática:**
  - Sem seleção de mês no filtro: exibe gráfico consolidado por **mês**.
  - Com seleção de mês no filtro: exibe gráfico consolidado por **dia**.
- **Métricas plotadas em conjunto:**
  - Horas trabalhadas
  - Nº de tarefas
  - Nº de itens

**5️⃣ Carga vs Capacidade**
Contextualiza o esforço realizado visando um norte de entrega esperado.
- **Meta base dinâmica:** 120 horas de capacidade produtiva ideal **por mês**.
  - **Regra de Cálculo:** Se os dados exibidos corresponderem a apenas 1 mês, a meta será de 120h. Se os dados corresponderem a múltiplos meses (ex: 2 meses), a meta será proporcional (ex: 240h para 2 meses).
- **Métricas Adicionadas:**
  - Horas realizadas no período selecionado
  - % de ocupação estimada (Horas realizadas frente à meta dinâmica)
  - Diferença estrutural (Saldo para a meta)
- *Requisito:* Adicionar paralelamente a **comparação da métrica deste perfil com a média da sua equipe.**

## 3. Dinâmica de Interação e Navegação
- **Adição na Sidebar:** A barra lateral (sidebar) ganhará o novo botão "Perfil", posicionado abaixo do botão "Visão Geral". A navegação alternará o conteúdo central (SPA - Single Page Application) sem recarregar a página, mantendo os dados cacheados na memória.
- **Cross-filtering Direto:** O Bloco Específico (Visão Específica) deve se comportar de maneira reativa. Quando a aba abrir sem perfil selecionado, o bloco permanecerá oculto automaticamente, sem necessidade de exibir mensagens de estado vazio. Ao selecionar um perfil específico no filtro (ex: Perfil = Designer X), os dados do Bloco Específico se preenchem e aparecem automaticamente.

## 4. Requisitos de UX/UI (Design System)
- **Consistência:** A tela seguirá à risca o Tema Claro Premium (Muntz.OPS) já documentado, com tipografia, contrastes, bordas sutis e fundo claro.
- **Modo Escuro (Dark Theme):** Garantir contraste adequado em todos os textos, ícones e elementos visuais quando o modo escuro estiver ativo, especialmente em:
  - Títulos e subtítulos de gráficos
  - Cards de KPI e seus ícones
  - Labels e legendas
  - Textos secundários e descritivos
- **Transições:** A troca entre a aba "Visão Geral" e "Perfil" deve ser suave, com *fade-in* nos gráficos para trazer uma percepção de agilidade do sistema.
- **Layout dos Blocos:**
  - Os *Filtros* ficarão no topo fixos no fluxo da página.
  - O bloco *Geral* pode ocupar a porção superior das análises com cartões e gráficos mais largos.
  - O bloco *Específico* concentrará análises mais agrupadas, possivelmente dividindo a tela em grid (ex: dois gráficos lado a lado) para visualização consolidada do colaborador.

## 5. Histórico de Ajustes e Melhorias

### Versão 1.1 - Refinamentos UX/UI (03/03/2026)
**Ajustes implementados:**
1. **Carga vs Capacidade - Meta Dinâmica:** A meta de referência agora é proporcional ao período analisado (120h por mês). Se 2 meses estiverem selecionados, a meta será 240h.
2. **Contraste de Texto em Modo Escuro/Claro:** Correção de problemas de legibilidade em textos/ícones do card "Média da Equipe" no modo escuro e subtítulo do gráfico "Evolução no Tempo" no modo claro.
3. **Data Labels em Produtividade e Eficiência:** Adição de valores numéricos visíveis nos gráficos "Por Tipo de Tarefa", "Por Especialidade (Tag)" e "Por Complexidade", com tratamento adequado de margens para evitar sobreposição.
4. **Remoção do Estado Vazio:** Eliminação do card "Selecione um único Perfil nos filtros..." da Visão Específica. O bloco agora simplesmente fica oculto quando nenhum perfil está selecionado.

## 6. Próximos Passos
Validação desta documentação (PRD) para atestar que os dados sugeridos nos blocos Geral e Específico atendem à dor da gestão. Na sequência, avança-se para a Especificação Técnica (SPEC) que desenhará a engenharia de código necessária para incluir essa funcionalidade e estender a base local sem quebras de performance.
