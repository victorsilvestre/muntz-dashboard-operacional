# SPEC - Aba Lateral "Tempo Ideal Coord."

## 1. Modificações em UI/DOM (index.html)
- **Menu de Navegação:** Adicionado element `li#nav-coord` contendo `<span class="nav-text">Tempo Ideal Coord.</span>`.
- **Containers do App:** Injetada nova section de grid `<div id="page-coord" class="dashboard-page hidden">`.
- **Estilo:** O template compartilha design com os painéis principais via classes do design system `.glass-card`.
- **Componente Interno:** Tabela responsiva com headers dinâmicos referenciados em `id="thead-coord"` e body (`id="tbody-coord"`).

## 2. Ingestão de Dados (dashboard.js)
- O fluxo de carregamento abstrato `initDashboard()` foi refatorado. A lib PapaParse consumirá inicialmente `data/Coordenação _ Tempo Ideal por Tag.csv`, salvando de forma imutável a listagem na nova chave da single store de contexto `STATE.coordData`.
- Após carregamento de Coord., dá seguimento as Promises/callbacks repassando o encadeamento aos datasets principais e liberando as camadas para o usuário final.

## 3. Navegação por SPA e Routing
- O controlador pseudo-SPA da View `navigateToPage(pageName)` gerencia navegação, incluindo o novo ID e classe isolada `page-coord`.
- Título da sub-página alterado nas views por meio das props no `pageTitle.textContent = 'Tempo Ideal Coord.'`.

## 4. Render Engine de Coordenação (`renderTableCoord`)
- Função acionada como interceptor no fallback da pipeline base do ciclo de draw da página (`updateDashboard()`).
- Um loop de iteração base mapeia as colunas extraídas (`Object.keys(STATE.coordData[0])`).
- Formatação `.mike-table` herdando propriedades do CSS Core. Coluna header em idx 0 ("Listagem de Tags") recebe destaque em peso tipográfico pra auxiliar legibilidade. Linhas completamente em vazio são puladas.
