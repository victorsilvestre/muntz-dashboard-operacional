# Product Requirements Document (PRD) - Dashboard Operacional Muntz: Aba "Mike"

## 1. Visão Geral
**Projeto:** Dashboard Operacional Muntz - Evolução: Aba Mike
**Objetivo:** Desenvolver uma nova aba de navegação lateral rotulada "Mike", atuando em complementaridade com as visões atuais. O foco desta aba reside na análise do cruzamento de horas entre clientes e outras dimensões corporativas (equipes, perfis, cargos, tags), bem como o acompanhamento detalhado de volumetria das tags através de uma tabela dinâmica.

## 2. Estrutura da Página e Blocos Visuais
A nova tela "Mike" deve herdar todo o ecossistema gráfico atual, dividindo-se entre os seguintes componentes visuais:

### 2.1. Bloco Padrão: Filtros (Header)
A nova aba compartilhará do **mesmo seletor de filtros** global, permitindo recortes por Mês, Cliente, Equipes, Perfil, Tipo e Toggles de Atraso/Urgente.

### 2.2. Bloco 1: Gráficos Analíticos de Cruzamento (5 Visões)
O bloco inicial apresentará visualmente a distribuição de horas baseando-se no cruzamento de eixos "Vertical x Horizontal" especificados via layout:
1. **Horas por Cliente:** Eixo Y (Clientes) x Eixo X (Horas Totais).
2. **Esforço por Equipe e Cliente:** Eixo Y (Clientes) x Eixo X/Séries (Equipes).
3. **Esforço por Cargo e Cliente:** Eixo Y (Cargos) x Eixo X/Séries (Clientes).
4. **Esforço por Perfil e Cliente:** Eixo Y (Perfis) x Eixo X/Séries (Clientes).
5. **Esforço por Tag e Cliente:** Eixo Y (Tags) x Eixo X/Séries (Clientes).

*Requisitos:* 
- Para os gráficos cruzados (ex: Cargos x Clientes), sugere-se uma visualização de barras empilhadas ou agrupadas no padrão horizontal do Chart.js.
- Os gráficos e tabelas NÃO devem possuir limitador de quantidade (sem "Top N"), exibindo todos os dados disponíveis correspondentes aos filtros aplicados para uma visão completa.

### 2.3. Bloco 2: Tabela de Detalhamento de Tags
Na porção inferior ou em um bloco dedicado de largura total, construíremos um Data Grid (Tabela Dinâmica).
A tabela analisa as especialidades e responde pelo sumário analítico:
- Total de horas lançadas por cada tag.
- Média de horas por cada item da tag (Total de Horas / Soma das Quantidades Lançadas).

**Colunas e Formatos:**
- `Tag`: Nome da tag (ordenado decrescente por % de horas por padrão)
- `Total de Horas`: Formato (hh:mm)
- `Qtd. Itens`: Volume acumulado de soma dos itens (inteiro)
- `Média de Horas`: Formato (hh:mm)
- `% do Total de Horas`: Percentual acompanhado de uma **barra de progresso horizontal** estilizada em CSS preenchendo o fundo (ou lateral) da célula.

**Regras de Negócio e Interação:**
- O grid deve permitir **Ordenação** (Sort) no clique do usuário em qualquer cabeçalho de coluna (Crescente/Decrescente).
- A formatação (hh:mm) aplica-se somente nesta tabela, sendo uma exigência textual para melhorar a visualização de faturamento/alocação de times estritas a horas reais de relógio.

## 3. Dinâmica de Navegação
- Adição de novo item menu com ícone representativo na Sidebar.
- Alternância Single Page Application mantendo a reatividade dos filtros atuais.

## 4. Design System
- Garantir alinhamento com Muntz Light Premium.
- Estilizar cor das barras de progresso na tabela utilizando tons vibrantes base (ex: Violeta ou Ametista do Token CSS) e assegurar ótima leitura em modo Dark.
