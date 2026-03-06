# PRD - Aba Lateral "Tempo Ideal Coord."

## 1. Visão Geral
A nova aba tem como objetivo fornecer à coordenação da operação um acompanhamento dos "Tempos Ideais" de esforço baseado na listagem de Tags predefinida pela agência.

## 2. Objetivos
- Exibir uma tabela simplificada com a matriz de tempos ideais de referência (tags por especialidade e áreas de atuação).
- Utilizar a mesma mecânica de navegação visual global do painel.

## 3. Arquivo de Base
O painel consome o dataset contido em arquivo estático separado:
- `web_app/data/Coordenação _ Tempo Ideal por Tag.csv`

## 4. Estrutura Visual
- **Painel Lateral (Overview de Navegação)**: Adicionado a opção em `<nav>` listando o ícone respectivo do Tempo Ideal.
- **Header**: Título "Tabela de Tempos Ideais - Coordenação".
- **Tabela Responsiva**: Colunas automáticas preenchidas com as keys extraídas dinamicamente via parser da primeira linha do arquivo `.csv`. Linhas extraídas a partir do conteúdo do arquivo, respeitando os vazios (substituídos ou normalizados).
- **Integração de Estilos**: Comporta o mesmo padrão CSS `.mike-table` e cards `.glass-card` para suporte a dar e light themes consistentes com o design system do Dashboard Operacional.
