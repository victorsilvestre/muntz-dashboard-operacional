# Análise de Dados e Cruzamentos - Dashboard Operacional Muntz

Este documento consolida as estratégias de cruzamento de dados para a construção de um dashboard operacional completo e focado em produtividade, esforço (horas trabalhadas) e rentabilidade, respeitando as seguintes premissas para as colunas analisadas:

*   **Tag:** Define o *entregável* ou *produto* (ex: peça digital, e-mail, plano de mídia, disparo).
*   **Tipo:** Define a *natureza* da tarefa (ex: nova demanda, ajuste, desdobre).
*   **Horas:** O principal KPI de esforço, custo e capacidade produtiva.

---

## 1. Visão de Rentabilidade e Esforço por Cliente (O Core do Dashboard)
O objetivo aqui é medir o real impacto de cada cliente na operação da agência.

*   **Horas Totais vs. Cliente:**
    *   *Insight:* Qual cliente consome a maior fatia de horas da agência? Cruzando isso com o *fee* (valor do contrato), você descobre a rentabilidade real de cada conta.
*   **Horas vs. Cliente vs. Tipo (Nova Demanda vs. Ajuste vs. Desdobre):**
    *   *Insight:* Do tempo investido no cliente, quanto é gasto criando coisas novas versus refazendo/ajustando? Clientes com alta taxa de "Ajustes" podem estar com problemas de briefing ou aprovação, o que corrói a margem de lucro.
*   **Horas vs. Cliente vs. Tag (Entregável):**
    *   *Insight:* O que o cliente mais leva de vocês? Ele consome mais horas em "Peças Digitais" ou em "Planos de Mídia"? Isso ajuda a entender o perfil de serviço do cliente e se está alinhado com o contrato.
*   **Horas vs. Cliente vs. Urgente (Sim/Não):**
    *   *Insight:* Quais clientes sequestram o tempo da equipe com "incêndios"? Muitas horas urgentes encarecem a operação e indicam falha de planejamento por parte do cliente ou do atendimento.

## 2. Visão de Produção e Carga de Trabalho (Foco no Entregável e Natureza)
Esses cruzamentos mapeiam exatamente onde o tempo da empresa é investido, ajudando na precificação e previsibilidade.

*   **Horas Totais (e Horas Médias) vs. Tag (Entregável):**
    *   *Insight:* Quais são os entregáveis mais custosos da agência? Saber que, em média, um "E-mail" leva 3 horas enquanto uma "Peça Digital" leva 1,5 hora é fundamental para estimar prazos para novos projetos.
*   **Horas Totais vs. Tipo (Nova Demanda, Ajuste, Desdobre):**
    *   *Insight:* Visão macro da saúde do processo produtivo. Se 40% das horas da agência no mês foram para "Ajustes", algo no fluxo primário (aprovação interna ou briefing) não está funcionando.
*   **Tags (Entregáveis) vs. Tipo:**
    *   *Insight:* Quais entregáveis geram mais repetição? As "Peças Digitais" geram proporcionalmente mais "Ajustes" do que os "E-mails"? Isso ajuda a focar na melhoria da qualidade do que dá mais trabalho.

## 3. Visão de Equipes e Produtividade
Acompanha se o time está equilibrado, sobrecarregado ou subutilizado, sempre sob a ótica da saúde da operação.

*   **Horas vs. Equipes:**
    *   *Insight:* Como a carga real de trabalho está distribuída? Quem está fazendo mais horas do que a capacidade permite?
*   **Horas vs. Equipes vs. Tipo:**
    *   *Insight:* A equipe de Criação está gastando seu tempo desenvolvendo "Novas Demandas" ou resolvendo "Ajustes" e "Desdobres"? A moral da equipe cai quando só se faz correções.
*   **Horas vs. Equipes vs. Urgente (Sim/Não):**
    *   *Insight:* Qual equipe está sempre trabalhando sob pressão e apagando incêndios? Alerta vermelho para fadiga e necessidade de contratação ou freelancers.

## 4. Visão de Fluxo e Gargalos (Tracking do Processo)
Para o dia a dia, monitorando onde as coisas estão paradas.

*   **Etapa vs. Número de Tarefas (e Horas):**
    *   *Insight:* O funil de produção. Muitas tarefas (com muitas horas acumuladas) em "Aguardando Aprovação" indicam o gargalo atual da agência.
*   **Horas vs. Quadro (Projetos/Departamentos):**
    *   *Insight:* Permite checar a saúde geral do projeto. Se o projeto da "Campanha X" orçou 100 horas e o painel já soma 110 horas na fase de "Execução", o escopo estourou.

---

## 📊 Cards (KPIs) Sugeridos para o Topo do Dashboard
Esses são os indicadores de batida de olho (Executive Summary) para o nível de gestão e diretoria:

1.  **Total de Horas Trabalhadas** (No período selecionado).
2.  **Taxa de Ajustes / Refação:** % de Horas (ou Tarefas) que são do Tipo "Ajuste". *Meta: Manter o mais baixo possível.*
3.  **Taxa de Urgência:** % de Horas gastas em tarefas marcadas como "Urgente" (Sim).
4.  **Ticket Médio de Tempo (Por Tag Principal):** Ex: Peça Digital (X horas média), E-mail (Y horas média).
5.  **Top 3 Clientes Consumidores (por Horas Totais):** Com o gráfico de barras ao lado mostrando o quanto dessas horas foi *Nova Demanda* x *Ajuste*.
