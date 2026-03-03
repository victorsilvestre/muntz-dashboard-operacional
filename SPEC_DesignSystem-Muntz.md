# Technical Specification (SPEC) - Muntz Design System

## 1. Arquitetura e Tech Stack
Para maximizar a performance e flexibilidade, utilizaremos tecnologias Vanilla com arquitetura de tokens.
- **HTML5:** Estrutura semântica.
- **CSS3 (Vanilla CSS):** Sem frameworks de terceiros (como Tailwind ou Bootstrap). Foco em CSS Variables nativas.
- **Estruturação de Arquivos CSS (`web_app/css/`):**
  - `tokens.css`: Declaração de todas as variáveis globais (`:root`).
  - `base.css`: Reset de CSS e definições tipográficas base no `body`.
  - `components.css`: Estilos isolados para botões, inputs, cards e demais elementos do UI.
  - `layout.css`: Estruturação da grid e seções principais (sidebar, main content).

## 2. Design Tokens Customizados (CSS Variables)

O arquivo `tokens.css` deverá ser implementado contendo as seguintes definições fundamentais (conforme PRD):

```css
:root {
  /* =========================================
     Typography
     ========================================= */
  /* Assumindo font-face já importado no base.css */
  --font-family-base: 'Gorga Grotesk', system-ui, sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* =========================================
     Colors - Principais
     ========================================= */
  --color-violeta-muntz: #BD5FFF;
  --color-violeta-light: #D092FB;
  --color-violeta-dark: #8936C3;

  --color-ametista: #1F004A;
  --color-ametista-dark: #1C0B27;

  --color-montanha: #ECE7FA;
  --color-montanha-light: #E9E0FF;

  /* =========================================
     Colors - Secundárias
     ========================================= */
  --color-orquidea-azul: #0A45E2;
  --color-vivaz: #E6FC53;
  --color-laranja-solar: #FF561B;
  
  /* Cores de Fundo e Texto (Base do SO) */
  --color-bg-body: #F7F5FA; /* Exemplo de fundo geral off-white/roxo bem claro */
  --color-bg-card: #FFFFFF;
  --color-text-main: var(--color-ametista-dark);
  --color-text-muted: #6B7280;

  /* =========================================
     Bordas & Sombras
     ========================================= */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  --shadow-sm: 0 1px 3px rgba(31, 0, 74, 0.1);
  --shadow-md: 0 4px 6px rgba(31, 0, 74, 0.08);
  --shadow-lg: 0 10px 15px rgba(31, 0, 74, 0.05);
  
  /* =========================================
     Espaçamentos (Spaces)
     ========================================= */
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
}
```

## 3. Implementações de Componentes Base (`components.css`)

### 3.1 Buttons
- **`.btn`:** Formatação base com `padding`, `border-radius: var(--radius-pill)` (se design demandar pílula) ou `var(--radius-md)`, fontes e transições suaves.
- **`.btn-primary`:** `background-color: var(--color-violeta-muntz)`, cor de texto clara. Hover: shift de brilho ou leve sombra.
- **`.btn-secondary`:** `background-color: var(--color-orquidea-azul)`.
- **`.btn-accent`:** `background-color: var(--color-vivaz)`, para ações de forte destaque e CTA rápido.

### 3.2 Containers e Cards
- **`.card`:** Wrapper padrão dos widgets de dashboard. `background-color: var(--color-bg-card)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-sm)`.

### 3.3 Formulários e Inputs
- **`.input-base` / `.select-base`:** Bordas de `1px solid var(--color-montanha)`, com `padding` confortável e focus ring usando outline de `--color-violeta-muntz`.
- **Toggles:** Utilizar checkbox oculto associado a uma `<label>` customizada num formato de pílula (`width: 40px, height: 24px`) transitando o `background` para a cor acento (Violeta ou Orquídea).

## 4. Próximos Passos (Workflow)
1.  **Fundação:** Atualização do CSS na pasta `web_app/css/` (Tokens e Base).
2.  **Mock de Componentes:** Criar um arquivo `design_system.html` contendo todos os estados dos botões, inputs, textos, para validar o CSS puramente antes de jogar no Dashboard.
3.  **Refatoração do Dashboard:** Aplicar classes do Design System no arquivo HTML existente e substituir CSS inline ou antigo por essas novas utilidades.
