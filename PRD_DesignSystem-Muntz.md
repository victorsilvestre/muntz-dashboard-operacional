# Product Requirements Document (PRD) - Muntz Design System

## 1. Visão Geral
**Projeto:** Design System Muntz - Dashboard Operacional
**Objetivo:** Criar um conjunto consolidado, escalável e moderno de tokens de design e componentes de interface para o Dashboard Operacional da Muntz, garantindo consistência visual, agilizando o desenvolvimento e reforçando a identidade da marca.

## 2. Escopo
O Design System cobrirá:
- **Tokens de Design (Design Tokens):** Cores, Tipografia, Espaçamentos, Bordas (Border Radius) e Sombras (Shadows).
- **Componentes Base (UI Components):** Botões, Inputs de Texto, Toggles, Selects, Checkboxes, Cards e Badges.
- **Layout Patterns:** Estruturas de Dashboard (Sidebar, Topbar, Containers de Métricas).

## 3. Diretrizes Visuais (Brand Book Muntz)

### 3.1. Tipografia
A família tipográfica exclusiva que rege a identidade do sistema é:
- **Fonte Principal:** Gorga Grotesk
- **Pesos Utilizados:** Light, Regular, Bold

### 3.2. Paleta de Cores

**Cores Principais (Sofisticação & Maturidade):**
- **Violeta Muntz:** `#BD5FFF` (Cor vibrante principal para Destaques/Primary Actions)
- **Ametista:** `#1F004A` (Cor escura e profunda para fundos escuros ou contrastes fortes)
- **Variações Violeta/Ametista:** `#D092FB`, `#8936C3`, `#1C0B27`
- **Montanha (Equilíbrio/Claros):** `#ECE7FA`, `#E9E0FF` (Para fundos de cards e áreas de respiro)

**Cores Secundárias (Confiança, Performance, Inspiração e Positividade):**
- **Orquídea Azul:** `#0A45E2` (Para links, ações secundárias ou estados informativos)
  - Variações e apoios: `#001F6F`, `#E0E9FF`
- **Vivaz (Verde-amarelado vibrante):** `#E6FC53` (Para acentos, indicadores de sucesso, destaque premium)
  - Variações: `#F1FDA8`, `#92A60C`
- **Laranja Solar:** `#FF561B` (Alertas, badges, indicadores de atenção)
  - Variações: `#E44D15`, `#FFDFD3`

### 3.3. Look & Feel (Referências)
Com base nas referências estudadas (`dashboard.png`, `referencia_design-system.webp`):
- **Estética Interface:** Clean, "Moderna", leve uso de *Glassmorphism* (leve transparência / desfoque de fundo) para modais e popovers, ou `Soft UI`.
- **Formas:** Bordas bem arredondadas (friendly UI), inputs e botões "pill" ou chanfros suaves (ex: `border-radius: 8px` ou `16px`).
- **Profundidade:** Uso sutil de *drop shadows* (sombras projetadas) nos cards e elementos flutuantes sobre fundos claros contrastantes, para facilitar a leitura de dados operacionais.

## 4. Requisitos Funcionais do UI Kit
- Deve ser totalmente responsivo.
- Deve possuir tratamento de estados (Hover, Active, Disabled, Focus).
- Deve prover facilidade de leitura para Tabelas de Dados e Gráficos, já que se trata de uma ferramenta operacional.
