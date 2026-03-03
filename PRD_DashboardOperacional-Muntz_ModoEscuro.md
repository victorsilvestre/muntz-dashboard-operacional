# PRD - Dashboard Operacional Muntz: Modo Escuro (Dark Mode)

## 1. Visão Geral
**Projeto:** Evolução de Interface - Tema Escuro (Dark Mode) do Dashboard Operacional Muntz.
**Objetivo:** Introduzir uma versão visual noturna refinada para a aplicação, garantindo conforto visual extremo durante uso prolongado, ressaltando o caráter premium ("A Muntz à noite") da marca.
**Obrigatório:** O design system original (fonte, raio de bordas, grids e espaçamentos) e identidade visual principal NÃO devem ser alterados. A mudança reflete o comportamento cromático para leitura no escuro preservando a legibilidade.

---

## 2. A. Estratégia de Tema

**Decisão:** Soft Dark (Dark Mode Suave, com base num roxo muito profundo).
**Justificativa:** Dashboards premium repletos de dados e gráficos exigem muita leitura. Um modo "True Dark" absoluto (`#000000`) cria um efeito de fadiga visual elevado ao exibir textos muito claros, gerando "rastros" sob o movimento dos olhos (efeitos de astigmatismo / halation limitando a performance analítica). O tom "Soft Dark" ancorado na cor base "Ametista" entrega controle de contraste ideal e comunica a essência da "Muntz", ao invés de usar modismos genéricos pretos ou cinzas.

**Princípios Fundamentais:**
*   **Foco e Luminosidade Direcionada:** Os olhos devedem ser sempre levados aos indicadores (cores primárias e de estado vibrantes), deixando o fundo atuar como palco passivo.
*   **Contraste Positivo Controlado:** Não usaremos branco chapado nem preto chapado, suavizando pontos de alta densidade luminosa.
*   **Hierarquia de Profundidade:** Ausência da luz, e não excesso de cor. A hierarquia se dá de planos "mais escuros" ao fundo, para pranchas ligeiramente "menos escuras" nas áreas sobrepostas (Elevation).
*   **Redução de Ruído Visual:** Substituição de contornos gráficos fortes por sutileza (bordas translúcidas de baixíssima opacidade).

---

## 3. B. Tokens de Cor (Dark Mode Mapping)

O mapeamento abaixo deriva matematicamente das "Cores Principais" (Violeta/Ametista) e "Cores Secundárias" sem injetar novas matizes.

**Fundos de Superfícies / Elevações:**
*   `background/default` (Body background): `#12091A` (Tom ultra-profundo derivado do Ametista Dark, criando um vazio acolhedor e limpo).
*   `background/surface` (Cards base, blocos de gráficos): `#1A0D26` (Tom base de elevação do Ametista, separando o container do background).
*   `background/elevated` (Dropdowns, tooltips, modais sobrepostos): `#241334` (O plano mais claro da hierarquia dark base).

**Tipografia (A cor `Montanha Light` usada como base do branco off-white):**
*   `text/primary`: `#F7F5FA` (Roxo/Branco ultra-light para garantir legibilidade dos KPIs primários e títulos).
*   `text/secondary`: `rgba(247, 245, 250, 0.70)` — Equivalente visual a um tom ametista super claro e pastel para eixos de gráficos, subtítulos e labels discretos.
*   `text/disabled`: `rgba(247, 245, 250, 0.38)` — Leitura inativa ou passiva da interface.

**Bordas e Divisões:**
*   `border/subtle`: `rgba(255, 255, 255, 0.08)` — Linhas de grade muito finas e sutis.
*   `border/strong`: `rgba(189, 95, 255, 0.25)` — Linhas de demarcação ativa (Violeta Muntz diluído, unindo a marca mesmo nas bordas).

**Acentos (Sem alteraçăo do Brand Book)**
*   `accent/primary`: `#BD5FFF` (Luminosidade natural de neon).
*   `accent/hover`: `#D092FB`
*   `accent/pressed`: `#8936C3`

**Estados semânticos (Adaptados para legibilidade noturna)**
*   `state/success`: `#E6FC53` (O "Vivaz" verde amarelado da marca possui contraste impecável no fundo escuro).
*   `state/warning`: `#FFDFD3` (Tom solar mais claro para maior legibilidade na leitura).
*   `state/error`: `#FF561B` (O "Laranja Solar" brilha forte sobre painéis dark).
*   `state/info`: `#0A45E2` / variações em `#E0E9FF` para badges com base.

---

## 4. C. Regras de Contraste e Acessibilidade

*   **Padrão Mínimo de Contraste (WCAG AA):**
    *   Textos Principais + Background > Relação de **7.0:1** garantida pelo texto base e fundo.
    *   Textos Secundários + Background > Relação de **4.5:1** mínima usando os alfas propostos.
*   **Tratamento de Contraste para Gráficos:**
    *   Gráficos e tooltips usarão cores da marca em sua versão pura (alta luminosidade), destacando o traçado (`opacity: 1`) acima dos eixos escuros (`opacity: 0.1`).
*   **Controle de Branco e Preto:** Nenhuma cor no site é `#000000` (zero light) e `#FFFFFF` (peak light). Tudo é filtrado pela lente Ametista para evitar stress de retina na tela toda.

---

## 5. D. Comportamento Funcional dos Componentes (Regras Base Dark)

*   **Cards (Métricas e KPIs):**
    *   Fundo adotará `background/surface`.
    *   Bordas não serão coloridas; usaremos `border/subtle` apenas para desenhar o perímetro levemente quando encostar em outro componente.
    *   Sombras projetadas deixarão de aplicar cinza. O `box-shadow` mudará para `0 8px 32px rgba(0, 0, 0, 0.4)` criando "peso" puro da luz cortada em profundidade. Formatos textuais de KPI sobem para o branquíssimo off-white.
*   **Tabelas de Dados Operacionais:**
    *   **Header:** Fundos misturados das cores `background/surface`.
    *   **Zebra:** Fundo mesclado transparente puro por linha.
    *   **Hover da Linha:** Um clareamento tênue na surface indicando que linha estamos (ex: `background-color: rgba(255,255,255, 0.05)`).
    *   **Grid:** Evitar grids escuras pesadas; usar borders `.8` alfa.
*   **Gráficos e Visualizações:**
    *   Linhas de base/eixo (X/Y) assumem `border/subtle`. Destaques/Labels assumirão `text/secondary`.
    *   Tooltips sobre gráficos precisam ser altamente legíveis; assim, fundo rígido (`background/elevated`) com shadow preta para garantir destaque em áreas abarrotadas.
*   **Inputs, Filtros e Componentes Ativos:**
    *   Chips/Tags, Filtros e botões drop down: Fundo transparente escuro ou "surface", outline de `border/strong`.
    *   Em foco (`:focus`), realçar o input com anel brilhante no `accent/primary` com blur suave/caixa de luz delimitada, substituindo contraste chapado.
*   **Sidebar e Navegação:**
    *   A lateral assume `background/default` (junto do body), diferenciada da área de trabalho "main" apenas por uma sutil borda 1px de contorno invisível, sem elevação ou com separação mínima. No escuro, grandes blocos unidos passam mais tranquilidade. Modais de fechar acompanham comportamento de surface.

---

## 6. E. Regras de Alternância UX (Toggle de Tema)

*   **Posicionamento (Desktop & Mobile):**
    *   Alocado na base inferior permanente da Sidebar Esquerda (Sidebar Menu).
*   **Microcópia e Ícone:**
    *   Ícone dual clássico: Sol (Clear) / Lua (Dark).
    *   Texto (visível na sidebar expandida): "Modo Escuro" com toggle switch clássico à direita (formato pill).
*   **Estados de Toggle:**
    *   **Default:** Modo desativado no estado normal.
    *   **Hover:** Mudança ligeira de contraste do label.
    *   **Active:** Deslizamento do handle. Transição de cores generalista suavizada (`transition: background 0.3s ease, color 0.3s ease`) em todos os painéis globais (fuzziness visual impedida; sem picos rápidos demais).
*   **Configuração Lógica de Persistência:**
    *   **1. Sistema Precede Tudo:** Ao visitar o Dashboard pela 1ª vez via navegador, ler requisição de SO `(prefers-color-scheme: dark)`. Assumir modo base do sistema operacional do gestor.
    *   **2. Override do Usuário:** Se a pessoa manipular o switch manualmente, salvar esta flag via `localStorage` e/ou preferência de ID do Banco de Dados (API/User settings local persistente). O salvamento no `localStorage` tem precedência sobre o SO em sessões de refresh.

---

## 7. F. Detalhes de Interface Premium (SaaS Elegante)

*   **Permitido sutilmente (Técnicas Dark):**
    *   **Gradiente Discreto:** Em cards muito altos (como os principais KPIs na parte de cima), aplicar na parte inferior ou quinas superiores de fundo um delicadíssimo gradil linear, indo do Surface para um `rgba(189, 95, 255, 0.03)` no lado oposto inferior daquele grid. Causa efeito suave que o modo escuro abriga luz que escapa vagamente do painel, entregando sofisticação sem poluir as planilhas.
    *   **Hairline Borders (Inner Glow):** Os "cards" poderão utilizar técnicas baseadas num leve `.border-top: 1px solid rgba(255,255,255,0.06)` no lado superior de superfícies altas simulando luz zenital do topo atingindo as planilhas.
*   **NÃO Fazer de Forma Alguma (Red Lines):**
    *   Sem "Modo Neon": As métricas coloridas devem emitir a pura cor da marca sem "Text/Drop-Shadow" borrado ou cor-de-rosa simulando led ou retro/vaporwave. A Muntz é moderna, não neon cyberpunk.
    *   Contraste Inversivo Bruto: Trocar os ícones por fundos brancos pesados (tudo deve ser invertido pra outline base/light text).
    *   Nada que "gaste" o globo ocular. A essência principal de um dark theme B2B analítico é a suavidade. Nada brilha até que seja "clicado" ou notificado (Estado de Erro/Hover).
