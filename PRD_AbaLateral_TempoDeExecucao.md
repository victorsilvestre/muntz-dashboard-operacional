# Product Requirements Document (PRD) - Dashboard Operacional Muntz: Aba "Tempo de Execução"

## 1. Visão Geral
**Projeto:** Dashboard Operacional Muntz - Evolução: Aba Tempo de Execução
**Objetivo:** Desenvolver uma nova aba de navegação lateral rotulada "Tempo de Execução", dedicada exclusivamente à análise aprofundada dos tempos gastos nas tarefas, permitindo aos gestores identificar padrões de velocidade, gargalos operacionais e distribuições de esforço por diferentes dimensões (Tags, Tipos, Clientes, Complexidade). Esta visualização fornecerá insights estatísticos robustos através de métricas como tempo médio, mediana, mínimo, máximo e distribuição por faixas horárias.

## 2. Estrutura da Página e Blocos Visuais
A nova tela "Tempo de Execução" será organizada em 2 grandes blocos, seguindo uma hierarquia de informação clara e objetiva:

### 2.1. Bloco 1: Filtros (Padrão Visão Geral)
Para garantir consistência e facilidade de uso, este bloco manterá a **exata mesma estrutura de filtros** encontrados nas outras abas do dashboard.
- **Filtros Disponíveis:** Mês, Equipes, Perfis, Cliente, Tipo e os Toggles de Atraso e Urgência.
- **Comportamento:** Os filtros interagem ativamente com a base de dados, retroalimentando todas as análises e visualizações da aba de Tempo de Execução.
- **Nota Importante:** A aba de "Tempo de Execução" não possui filtro de Tags como filtro principal (Tags serão uma dimensão de análise, não um filtro pré-selecionável no toolbar).

### 2.2. Bloco 2: Dados Gerais (Análise de Tempo de Execução)
Este bloco apresenta uma visão completa dos tempos de execução das tarefas sob múltiplas perspectivas. A estrutura baseia-se em 6 eixos analíticos:

#### **2.2.1. KPIs Gerais (Panorama Estatístico Geral)**
Cartões numéricos (KPI Cards) posicionados no topo do bloco, apresentando indicadores estatísticos fundamentais:

- **Total de Tarefas Analisadas:** Contagem única de IDs de tarefas (não confundir com quantidade de registros/itens, mas sim tarefas únicas).
- **Total de Horas Trabalhadas:** Somatória absoluta do esforço em horas de todas as tarefas analisadas.
- **Tempo Médio Geral por Tarefa:** (Total de Horas Trabalhadas) / (Total de Tarefas Analisadas).
  - Exibir em formato decimal (ex: 2.5h) ou em hh:mm (ex: 2h 30m).
- **Mediana de Tempo por Tarefa:** Valor central da distribuição de tempos, oferecendo uma visão mais robusta contra outliers (tarefas extremamente longas ou curtas).
- **Tempo Mínimo:** Menor tempo registrado entre todas as tarefas analisadas.
- **Tempo Máximo:** Maior tempo registrado entre todas as tarefas analisadas.

**Objetivo:** Evitar decisões baseadas exclusivamente na média, oferecendo um panorama estatístico completo (média, mediana, mín, máx) que revela a real distribuição de tempos.

#### **2.2.2. Tempo de Execução Por Tag**
**Objetivo:** Identificar quais tags (especialidades/tipos de peças) consomem mais tempo em média e no total.

**Visualização Recomendada:** Gráfico de Barras Horizontais, ordenado por tempo médio descendente.

**Métricas Exibidas (para cada Tag):**
- **Tempo Médio:** Tempo médio gasto por tarefa naquela tag.
- **Nº de Tarefas:** Quantidade de tarefas únicas associadas à tag.
- **Total de Horas:** Somatória das horas trabalhadas na tag.
- **Mediana:** Tempo mediano das tarefas da tag, oferecendo visão complementar à média.

**Regras de Exibição:**
- **Filtro de Dados Válidos:** Exibir apenas tags com total de horas registradas **maior que zero**.
- **Exibição Inicial Limitada:** Mostrar as **10 tags com maior quantidade de tarefas**.
- **Ordenação:** Tags ordenadas por **quantidade de tarefas** (descendente).
- **Expansão sob Demanda:** Botão "Mostrar Todas" posicionado no **canto superior direito** do card (similar ao botão "Limpar Filtros"), que expande a listagem completa de tags.
- **Altura Dinâmica:** O gráfico ajusta automaticamente sua altura baseado no número de tags exibidas (mínimo 50px por tag).

**Formato dos Dados:**
- Tempo Médio e Mediana: em formato **hh:mm** (ex: 2:30h).
- Nº de Tarefas: número inteiro.
- Total de Horas: formato **hh:mm** (ex: 48:45h).

#### **2.2.3. Tempo de Execução Por Tipo**
**Objetivo:** Comparar os tempos médios e volumes de trabalho entre os diferentes tipos de tarefa.

**Exemplos de Tipos:**
- Muntz | Demandas
- Muntz | Ajustes
- Muntz | Desdobres

**Visualização Recomendada:** Gráfico de Barras Horizontais, ordenado por tempo médio descendente.

**Métricas Exibidas (para cada Tipo):**
- **Tempo Médio:** Tempo médio gasto por tarefa naquele tipo.
- **Nº de Tarefas:** Quantidade de tarefas únicas daquele tipo.
- **Total de Horas:** Somatória das horas trabalhadas no tipo.
- **Mediana:** Tempo mediano das tarefas do tipo.

**Formato dos Dados:**
- Tempo Médio e Mediana: em formato **hh:mm** (ex: 2:30h).
- Nº de Tarefas: número inteiro.
- Total de Horas: formato **hh:mm** (ex: 48:45h).

#### **2.2.4. Tempo de Execução Por Cliente**
**Objetivo:** Avaliar se determinados clientes possuem tarefas mais complexas ou demoradas em média.

**Visualização Recomendada:** Gráfico de Barras Horizontais, ordenado por tempo médio descendente.

**Métricas Exibidas (para cada Cliente):**
- **Tempo Médio por Tarefa:** Tempo médio gasto por tarefa do cliente.
- **Nº de Tarefas:** Quantidade de tarefas únicas do cliente.
- **Total de Horas:** Somatória das horas trabalhadas para o cliente.
- **Mediana:** Tempo mediano das tarefas do cliente.

**Formato dos Dados:**
- Tempo Médio e Mediana: em formato **hh:mm** (ex: 2:30h).
- Nº de Tarefas: número inteiro.
- Total de Horas: formato **hh:mm** (ex: 48:45h).

#### **2.2.5. Tempo de Execução Por Complexidade**
**Objetivo:** Validar se as classificações de complexidade (Baixa, Média, Alta) realmente refletem tempos de execução proporcionais.

**Visualização Recomendada:** Gráfico de Barras Verticais ou Horizontais.

**Métricas Exibidas (para cada nível de Complexidade: Baixa, Média, Alta):**
- **Tempo Médio:** Tempo médio gasto por tarefa naquela complexidade.
- **Nº de Tarefas:** Quantidade de tarefas únicas daquela complexidade.
- **Total de Horas:** Somatória das horas trabalhadas na complexidade.
- **Mediana:** Tempo mediano das tarefas da complexidade.

**Formato dos Dados:**
- Tempo Médio e Mediana: em formato **hh:mm** (ex: 2:30h).
- Nº de Tarefas: número inteiro.
- Total de Horas: formato **hh:mm** (ex: 48:45h).

#### **2.2.6. Distribuição do Tempo (Histograma)**
**Objetivo:** Mostrar a concentração de tarefas em diferentes faixas de tempo, revelando padrões de distribuição (ex: maioria das tarefas leva entre 1-2h, poucas tarefas ultrapassam 8h).

**Visualização Recomendada:** Histograma (Gráfico de Barras Verticais representando faixas de tempo).

**Faixas de Tempo Sugeridas:**
- **0–1h:** Tarefas rápidas/operacionais.
- **1–2h:** Tarefas de curta duração.
- **2–4h:** Tarefas de média duração.
- **4–8h:** Tarefas de longa duração.
- **8h+:** Tarefas muito longas/complexas.

**Métricas Exibidas (para cada faixa):**
- **Nº de Tarefas:** Quantidade de tarefas que se encaixam na faixa.
- **% do Total:** Percentual de tarefas naquela faixa em relação ao total analisado.

**Interpretação Visual:** Barras mais altas indicam maior concentração de tarefas naquela faixa de tempo, permitindo identificar rapidamente o padrão operacional predominante.

## 3. Dinâmica de Interação e Navegação
- **Adição na Sidebar:** A barra lateral (sidebar) ganhará o novo botão "Tempo de Execução", posicionado abaixo do botão "Perfil". A navegação alternará o conteúdo central (SPA - Single Page Application) sem recarregar a página, mantendo os dados cacheados na memória.
- **Cross-filtering Direto:** Todos os gráficos e KPIs reagem imediatamente às mudanças nos filtros do Bloco 1, proporcionando análises dinâmicas e interativas.
- **Estado Inicial:** Ao abrir a aba sem filtros específicos, exibir dados consolidados de todo o período disponível.

## 4. Requisitos de UX/UI (Design System)
- **Consistência:** A tela seguirá à risca o Tema Claro Premium (Muntz.OPS) já documentado, com tipografia, contrastes, bordas sutis e fundo claro.
- **Modo Escuro (Dark Theme):** Garantir contraste adequado em todos os textos, ícones e elementos visuais quando o modo escuro estiver ativo, especialmente em:
  - Títulos e subtítulos de gráficos
  - Cards de KPI e seus ícones
  - Labels e legendas
  - Textos secundários e descritivos
  - Data labels nos gráficos
- **Transições:** A troca entre abas deve ser suave, com *fade-in* nos gráficos para trazer uma percepção de agilidade do sistema.
- **Layout dos Blocos:**
  - Os *Filtros* ficarão no topo fixos no fluxo da página.
  - O bloco *Dados Gerais* ocupará a área principal com uma grade responsiva, organizando os KPIs no topo e os gráficos em sequência lógica abaixo.
- **Responsividade:** Garantir que a aba funcione adequadamente em diferentes resoluções, com ajustes de grid e empilhamento de gráficos em telas menores.

## 5. Requisitos Funcionais Adicionais
- **Formatação de Tempo Consistente:** Todas as métricas de tempo devem seguir o mesmo padrão de formatação em todo o dashboard (seja decimal ou hh:mm).
- **Ordenação Inteligente:** Gráficos de barras devem ser ordenados por tempo médio descendente por padrão, facilitando a identificação rápida dos maiores gargalos.
- **Tooltips Informativos:** Ao passar o mouse sobre barras/elementos, exibir tooltips detalhados com todas as métricas relevantes (tempo médio, mediana, nº tarefas, total horas).
- **Data Labels Visíveis:** Exibir valores diretamente nos gráficos onde aplicável, respeitando espaçamento adequado para evitar sobreposição.
- **Expansão de Listas:** Implementar mecânica de "Mostrar Todas" para tags, permitindo análise completa quando necessário.

## 6. Casos de Uso Principais
1. **Gestor identificando gargalos:** Através do gráfico "Tempo de Execução Por Tag", o gestor identifica que a tag "vídeo - padrão" possui tempo médio muito alto, sinalizando necessidade de revisão de processo ou alocação de recursos.
2. **Análise de complexidade:** Comparando o gráfico "Por Complexidade", valida-se se tarefas marcadas como "Alta" realmente levam mais tempo que as de "Baixa", ajustando classificações futuras se necessário.
3. **Padrão operacional:** O histograma revela que 70% das tarefas ficam na faixa 1-2h, indicando um padrão saudável de entregas fracionadas.
4. **Comparação de clientes:** O gráfico "Por Cliente" mostra que Cliente X possui tempo médio muito superior aos demais, sinalizando necessidade de renegociação de escopo ou prazos.

## 7. Requisitos de Formatação de Dados
- **Formato de Tempo:** Todos os indicadores de tempo devem utilizar o formato **hh:mm** (ex: 1:30h, 14:25h) ao invés de decimal.
- **Ícone do Card Tempo Máximo:** Utilizar ícone `ri-timer-flash-line`.
- **Subtítulos de Gráficos:** Não utilizar subtítulos nos cards de gráficos, seguindo o padrão das outras abas.
- **Espaçamento de Data Labels:** Garantir padding adequado (top: 30px no histograma) para evitar sobreposição de números.

## 8. Histórico de Ajustes e Melhorias

### Versão 1.1 - Ajustes de UX/UI (03/03/2026)
**Ajustes implementados:**
1. **Formato de Horas:** Conversão de formato decimal (2.5h) para hh:mm (2:30h) em todos os indicadores.
2. **Ordenação de Tags:** Alteração de ordenação por "total de horas" para "quantidade de tarefas" (descendente).
3. **Posicionamento do Botão:** Movido botão "Mostrar Todas" para canto superior direito do card.
4. **Altura Dinâmica:** Gráfico de tags ajusta altura automaticamente (50px por tag, mínimo 400px), garantindo respiro adequado entre as barras.
5. **Ícone Tempo Máximo:** Adicionado ícone `ri-timer-flash-line` ao card KPI.
6. **Remoção de Subtítulos:** Removidos subtítulos de todos os gráficos para manter padrão das outras abas.
7. **Espaçamento de Labels:** Adicionado padding top de 30px no histograma para evitar corte de números.

### Versão 1.0 - Documento Inicial (03/03/2026)
**Criação do documento:**
- Definição da estrutura da aba "Tempo de Execução"
- Especificação de KPIs estatísticos (média, mediana, mín, máx)
- Definição de 6 eixos analíticos (Tags, Tipos, Clientes, Complexidade, Distribuição)
- Estabelecimento de regras de exibição e filtros
- Alinhamento com Design System Muntz.OPS

## 9. Próximos Passos
Validação desta documentação (PRD) para atestar que os dados e análises propostas atendem às necessidades de gestão de tempo e performance. Na sequência, avança-se para a Especificação Técnica (SPEC) que desenhará a engenharia de código necessária para incluir essa funcionalidade e estender a base local sem quebras de performance.
