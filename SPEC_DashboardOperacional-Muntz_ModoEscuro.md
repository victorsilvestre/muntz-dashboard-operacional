# Technical Specification (SPEC) - Dashboard Operacional Muntz: Modo Escuro

## 1. Visão Geral
**Projeto:** Implementação do Tema Escuro (Dark Mode) no Dashboard Operacional Muntz.
**Objetivo:** Especificar a arquitetura técnica, as alterações de código e as configurações necessárias para implementar o Modo Escuro definido no PRD, assegurando a manutenibilidade e a performance sem alterar o layout estrutural existente.

---

## 2. Arquitetura CSS e Tokens de Tema

A estratégia adotada será o uso de **CSS Custom Properties (Variáveis CSS)** já existentes (ou a serem adaptadas) para suportar a alternância de temas através do atributo `data-theme="dark"` aplicado na tag `<html>` ou `<body>`.

### 2.1. Estrutura de Arquivos
*   Recomenda-se manter a lógica de temas no arquivo principal de tokens (ex: `web_app/css/tokens.css`) ou criar um arquivo dedicado `web_app/css/dark-theme.css`.

### 2.2. Mapeamento de Variáveis (Root vs Dark)

As variáveis base (Light Mode) devem ser estruturadas de forma semântica. Quando o atributo `data-theme="dark"` estiver presente, as variáveis serão sobrescritas com os valores do Modo Escuro:

```css
/* =========================================
   Tokens de Tema: Dark Mode
   ========================================= */
[data-theme="dark"] {
  /* Cores de Fundo e Superfície */
  --color-bg-body: #12091A;        /* Ultra-profundo derivado do Ametista */
  --color-bg-card: #1A0D26;        /* Surface elevation 1 */
  --color-bg-elevated: #241334;    /* Surface elevation 2 (Modais, Tooltips) */

  /* Cores de Texto */
  --color-text-main: #F7F5FA;      /* Off-white com toque roxo */
  --color-text-muted: rgba(247, 245, 250, 0.70);
  --color-text-disabled: rgba(247, 245, 250, 0.38);

  /* Bordas e Divisões */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(189, 95, 255, 0.25);

  /* Sombras Premium adaptadas para o Dark Mode */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.5);
  
  /* Gradiente sutil e Hairline Border (Glassmorphism leve) */
  --card-inner-glow: 1px solid rgba(255, 255, 255, 0.06);
}
```

### 2.3. Ajustes Específicos de Componentes
*   **Cards:** Aplicar `border-top: var(--card-inner-glow)` para o efeito premium de luz zenital.
*   **Tabelas:** O hover das linhas da tabela deve usar cor baseada em opacidade do branco: `background-color: rgba(255, 255, 255, 0.05)`. O texto e linhas das marcações precisam usar `--border-subtle`.
*   **Gráficos:** Ajustar estilos de preenchimento e cor de linha e eixo dinamicamente no JS (ver sessão 4).

---

## 3. Lógica JavaScript (Toggle e Persistência)

A gestão do estado do tema será feita via JavaScript (ex: `web_app/js/theme.js` ou integrado ao `dashboard.js`), executando as seguintes responsabilidades:

1.  **Leitura Inicial:** Identificar a preferência do usuário salva no `localStorage`.
2.  **Fallback de Sistema:** Se não houver preferência salva, checar o tema do sistema operacional usando `window.matchMedia('(prefers-color-scheme: dark)')`.
3.  **Aplicação do Tema:** Adicionar/remover o atributo `data-theme="dark"` no elemento `document.documentElement` (`<html>`).
4.  **Listener do Toggle:** Monitorar cliques no botão de alternância de tema na interface.
5.  **Notificação para Gráficos:** Disparar um evento customizado (ex: `themeChanged`) para que os componentes de gráfico saibam que precisam se auto-atualizar.

**Snippet Base:**
```javascript
const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// 1. Inicialização
function initTheme() {
    const savedTheme = localStorage.getItem('muntz-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
}

// 2. Aplicação e Persistência
function setTheme(theme) {
    if (theme === 'dark') {
        rootElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.classList.add('active'); // Para estilizar o switch
    } else {
        rootElement.removeAttribute('data-theme');
        themeToggleBtn.classList.remove('active');
    }
    localStorage.setItem('muntz-theme', theme);
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// 3. Event Listener
themeToggleBtn.addEventListener('click', () => {
    const isDark = rootElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
});

initTheme();
```

---

## 4. Configuração de Gráficos (Integração)

Os gráficos implementados (ex: Chart.js) utilizam estilos e cores configurados na inicialização em JS, que não respondem automaticamente a variáveis CSS sem tratativas adicionais.

### 4.1. Atualização Dinâmica
Escutar o evento `themeChanged` disparado pela lógica de tema para re-renderizar ou atualizar as cores principais dos gráficos:

*   **Eixos (Grids & Ticks):** Trocar a cor da linha de grade (`grid.color`) para a cor de `--border-subtle` no contexto do dark mode. Trocar a cor do texto numérico (`ticks.color`) para `--color-text-muted`.
*   **Linhas/Barras:** As cores sólidas da marca (Violeta Muntz, Ametista, Vivaz) funcionam em ambos os temas, logo a *dataset color* principal não precisa alterar. Apenas a espessura e *hover* podem ser redimensionados conforme estética.
*   **Tooltips (Fundo e Texto):** Alterar o `backgroundColor` do Tooltip para a cor correspondente a `--color-bg-elevated` e cor do título para `--color-text-main`.

---

## 5. Alterações no HTML

Adição do componente de Switch/Toggle na Sidebar (dentro do nav, preferencialmente isolado na parte inferior):

```html
<!-- Exemplo de Estrutura do Toggle na Sidebar -->
<div class="theme-switch-wrapper">
    <button id="theme-toggle" class="theme-switch-btn" aria-label="Alternar Modo Escuro">
        <span class="theme-icon light-icon" aria-hidden="true">☀️</span> <!-- Trocar por SVG/Icon Font -->
        <span class="theme-label">Modo Escuro</span>
        <div class="switch-track">
            <div class="switch-thumb"></div>
        </div>
    </button>
</div>
```

**Estilização do Toggle:** O estado visual do switch (`.switch-thumb` posicionado à direita) será alterado via CSS quando identificar `data-theme="dark"` no topo da árvore do DOM.

---

## 6. Plano de Execução (Restrições e Testes)

1.  **Passo 1:** Validar mapeamento completo de Variáveis CSS presentes no `dashboard.css` garantindo que cores soltas (`#fff`, `#000`) sejam transformadas em chamadas `var()`.
2.  **Passo 2:** Incluir bloco de sobrescrita de variáveis `[data-theme="dark"]` no CSS.
3.  **Passo 3:** Implementar as adições do HTML para o Toggle.
4.  **Passo 4:** Injetar script de persistência (LocalStorage / System Preference).
5.  **Passo 5:** Implementar o listener e re-renderização dentro da mecânica dos gráficos.
6.  **Validações:**
    *   Testar transição entre light/dark - observar se há piscar da tela sem estilização (FOUC).
    *   Validar contrates das linhas e eixos dos gráficos.
    *   Verificar se não houve alteração do Design System na versão clara e constatar a não-utilização de "True Black" e "True White" no tema escuro.
