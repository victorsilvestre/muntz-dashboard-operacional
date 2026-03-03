# Product Requirements Document (PRD) - Dashboard Operacional Muntz

## 1. Visão Geral
**Projeto:** Dashboard Operacional Muntz
**Objetivo:** Desenvolver um dashboard analítico e interativo para visualizar os dados de produtividade, gargalos, volumetria de demandas e performance da agência Muntz. O dashboard consumirá informações de relatórios de tarefas (ex: Janeiro e Fevereiro de 2026), oferecendo extrema flexibilidade de filtros e cruzamento de dados na interface para suportar a tomada de decisões diretas, operacionais e estratégicas.

## 2. Base de Dados (Inputs)
A aplicação utilizará como fonte de dados principal o arquivo `relatorio_tarefas_jan_fev_2026.csv` (já atualizado, limpo e contendo a massa de informações estritamente relevante). Todas as colunas presentes atuarão de forma onipresente como variáveis, dimensões ou métricas interdependentes ao longo das visualizações:
- **Identificação:** ID, Titulo, Cliente, Projeto
- **Classificação:** Urgente (Sim/Não), Tipo (Demandas, Ajustes, etc), Quadro, Tags
- **Fluxo e Status:** Etapa, Atraso (Sim/Não)
- **Responsáveis:** Perfil, Equipe
- **Métricas de Tempo e Esforço:** Horas trabalhadas (h), Criada em (data), Data Assignment (data)

## 3. Dinâmica de Funcionalidades e Interações de Campos (Cross-filtering)
O coração da aplicação consiste em entender que **não haverá visualizações engessadas**. Como todos os campos do relatório são importantes, eles poderão e deverão interagir simultaneamente entre si, permitindo total mutabilidade nos gráficos através de filtros. Em virtude disso, devem ser previstos recortes e perguntas do usuário, tais como:
- **Cenário A:** "Quantas horas a equipe de *Criação* gastou especificamente em entregáveis do *Cliente X* no período?"
- **Cenário B:** "Qual o volume de horas gastas apenas pelo *Perfil* (designer Z) da *Equipe* de *Criação* na *Tag* 'crm - disparos', restrito a tarefas como *Ajustes* no fluxo?"
- **Cenário C:** "Existe forte incidência de refação (campo *Tipo*) com a flag *Atraso* vinculada em determinados *Projetos* de um *Cliente*?"

## 4. Análises e Visões de Dados (Outputs)
Por padrão (definição inicial ao carregar a página), o dashboard exibirá uma **visão global, panorâmica e não-filtrada** englobando 100% dos dados para exibir diversas informações estratégicas e operacionais de uma só vez por meio dos gráficos listados abaixo. O usuário, a partir disso, utilizará os filtros para recortes pontuais. 

A estrutura visual do dashboard deve estar preparada para responder e se adaptar em tempo real com base nos agrupamentos abaixo:

### 4.1. Visão Geral de Desempenho (Painel de KPIs Rápidos)
- Extratificação dinâmica interativa do **Total de Horas Trabalhadas** atrelada a qualquer filtro ativo.
- Indicador global dinâmico da **Volumetria de Atividades Únicas** (contagem de IDs).
- **Taxas e Balanceamento Operacional (%):** Composição variável para taxa de `Atraso`, taxa de `Urgente` e proporção macro visual cruzando **Demandas x Ajustes** (campo `Tipo`).

### 4.2. Correlações: Marcas e Capacidade
- **Dimensão Cliente e Projeto:** Representação do ranking de clientes e hierarquia de projetos versus fatias de carga horária da equipe, mostrando onde os maiores tempos de operação estão concentrados.
- **Dimensão Equipe e Perfil:** Matriz de visualização que expõe o volume de IDs completados somados à carga em horas submetidas por `Equipe`, com habilidade de fazer um "drill-down" interativo diretamente para ver produtividade fragmentada em cada `Perfil`.

### 4.3. Monitoramento de Gargalo e Distribuição de Esforços
- Distribuição de Status lendo os funis da operação (coluna `Etapa` cruzada com `Quadro`), mapeando o represamento da produção (ex: "Atraso=Sim" x "Cliente 🤝").
- Consumo gráfico da coluna categórica de densidade através de `Tags`, exibindo de maneira rápida o que efetivamente drena as horas do time. 

## 5. Requisitos de Filtros na Interface (User Interface Filters)
Para conceder flexibilidade de interação entre os módulos do dashboard, os seguintes filtros serão disponibilizados **no corpo da página**, apresentados de forma elegante e fluida acima dos dados (não ficarão na barra lateral). A responsividade deve garantir a preservação da UI/UX em dispositivos menores:
- **Filtro de Mês:** Permite visualizar a consolidação geral ou selecionar dados detalhados por mês (ex: Janeiro ou Fevereiro) a partir do campo de data.
- **Selects (Caixas de Escolha):** Filtros dinâmicos para refinar `Equipes`, `Perfis`, `Cliente` e `Tipo` (ou `Tag`). *(Nota: Projetos e Etapas não serão usados como filtros de visualização).*
- **Ordenação dos Dropdowns:** Todos os filtros select devem ser ordenados alfabeticamente. Registros nulos ("Sem perfil", "Sem equipe", vazios, etc) deverão ser agrupados visualmente e rotulados como **"(Vazios)"**, ficando posicionados em último lugar nas listagens.
- **Toggles rápidos:** Chaves booleanas para isolar tarefas com `Atraso` e escopo `Urgente`.

## 6. Requisitos de UX/UI e Visualização (Design System)
- **Tema Claro (Premium):** O dashboard e seus cartões de dados terão uma base visual clara limpa (light). O uso das cores fortes da paleta será reservado intencionalmente para criar contrastes premium em áreas de destaque, bordas, contornos, ícones e preenchimentos de barras/gráficos, remetendo diretamente às referências adotadas.
- **Identidade:** A ferramenta adotará o nome **"Muntz.OPS"** e utilizará a logomarca oficial da Muntz (arquivos `.svg` em `assets`).
- **Navegação (Sidebar):** A barra lateral será mantida exclusivamente para a navegação de rotas do sistema, sendo **retrátil (colapsável)** e sem funções de filtro do dashboard.
- **Rótulos de Dados (Data Labels):** É obrigatório que todo gráfico de barras traga o número (valor alcançado) renderizado de forma legível atrelado à barra representativa. Deve-se aplicar uma solução técnica ou layout flexível para evitar corte ou sobreposição no texto quando houver barras muito curtas e valores próximos de zero.

## 7. Próximos Passos
Após esta especificação primária validada, a fase seguinte corresponde à **Especificação Técnica (SPEC)** e em seguida, o início dos trabalhos codificando visualizações que sigam fidedignamente os novos direcionamentos de estilo e funcionalidade de interface estipulados no Ciclo 1.
