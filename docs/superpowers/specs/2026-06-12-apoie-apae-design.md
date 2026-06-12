# Apoie a APAE — Megafone solidário (teste)

**Data:** 2026-06-12
**Status:** Aprovado para implementação (versão de teste, sem dados financeiros)

## Objetivo

Usar o alcance do portal de Alegrete para **canalizar apoio à APAE de Alegrete**
(@apaealegrete), funcionando como **megafone, nunca como intermediário do dinheiro**.
O foco é a causa — o site em si quase não tem custo (GitHub Pages gratuito).

## Decisões de design (e por quê)

- **Abordagem A — "Megafone" (link direto).** O portal divulga a APAE e manda a
  pessoa direto aos canais oficiais dela. O dinheiro **nunca passa pelo site nem por
  ninguém da equipe.** Isso elimina os riscos de captar em nome de terceiro sem
  vínculo formal (uso indevido de nome, propaganda enganosa, imposto, prestação de
  contas).
- **Rejeitado: reter/intermediar 50%.** Sem autorização formal da APAE, captar dinheiro
  "para a APAE" e reter parte é juridicamente/eticamente arriscado. Descartado.
- **Sem "apoie o site".** Como o custo do site é ~R$ 0 e o objetivo é a causa, um botão
  concorrente de doação ao site só diluiria a mensagem. Página é 100% APAE.

## Escopo desta versão (teste)

- **SEM chave PIX / dados financeiros** — ficarão para depois, após confirmação com a APAE.
- O card "Doar" aponta para o contato/Instagram da APAE e marca os dados financeiros
  como **"em breve"**.
- Pré-requisito futuro (fora deste teste): confirmar canal oficial de doação com a APAE
  + aviso de cortesia a eles.

## Componentes

### 1. Página `apoie.html`
Segue o template das demais páginas (header/footer injetados, i18n, estilos existentes).
Seções:
- **Intro:** quem é a APAE de Alegrete e o trabalho que realiza.
- **Cards "Como ajudar":**
  - **Doar** — texto "dados para doação em breve"; CTA leva ao contato/Instagram da APAE.
  - **Seguir e divulgar** — Instagram @apaealegrete.
  - **Voluntariado / contato** — canais de contato da APAE (quando disponíveis).
- **Nota de transparência (obrigatória):** "Este portal apenas divulga. Sua
  contribuição vai direto para a APAE — nenhum valor passa por nós."

### 2. Dados `data/apoie.json`
Estrutura com os canais oficiais da APAE e descrições trilíngues (pt/es/en). Campos de
PIX presentes porém vazios/pendentes nesta versão, para fácil preenchimento posterior
sem mexer no HTML.

### 3. Pontos de entrada
- **Footer:** link "💛 Apoie a APAE".
- **Index:** card/faixa discreto perto do fim da home.
- **Menu mobile:** entrada "Apoie uma causa".
- **Nav do topo:** NÃO incluir (já tem 12 itens; evitar poluição).

### 4. i18n
Chaves novas em `i18n/ui.pt.json`, `ui.es.json`, `ui.en.json`, mantendo paridade de
chaves nos três idiomas (padrão do projeto).

## Critérios de sucesso

- Página `apoie.html` carrega nos 3 idiomas, com header/footer e estilos consistentes.
- Nota de transparência visível e inequívoca.
- Nenhum dado financeiro inventado; campos de PIX ficam pendentes.
- Pontos de entrada (footer, index, mobile) levam à página.
- Nada quebra nas páginas existentes.

## Fora de escopo

- Chave PIX / dados bancários (etapa futura).
- Intermediação ou divisão de valores.
- Monetização do próprio site (ads, patrocínio, etc.).
