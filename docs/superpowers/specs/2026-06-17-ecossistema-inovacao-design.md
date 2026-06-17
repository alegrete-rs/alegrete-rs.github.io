# Ecossistema de Inovação de Alegrete — página `ecossistema.html`

**Data:** 2026-06-17
**Status:** aprovado (decisões confirmadas com o usuário)

## Objetivo

Transformar a página de inovação do site no relato completo do **Ecossistema de
Inovação de Alegrete / Cidade Inovadora**, mantendo o **PampaTec como destaque
principal** da página. Fonte de conteúdo: deck `inovacao/Nossa Trajetória Da
Fundação à Maturidade.pdf` (idêntico ao Canva `canva.link/8n54r7s2qv2sh3d`).

## Decisões (confirmadas)

1. **Nova página** `ecossistema.html` (= a nova página "Inovação" do menu). A
   `pampatec.html` detalhada permanece intacta e é o destino do CTA principal.
2. Incorporar **todos** os blocos do deck.
3. Parceiros exibidos com **logos reais** extraídos do deck, agrupados por
   categoria.
4. Incluir a seção **A Trilha Empreendedora**.
5. Incluir botão **"Baixe a apresentação"** (PDF do deck em `assets/docs/`).

## Princípio de design

PampaTec é o coração visual: posicionado logo após o hero, com tratamento mais
forte (faixa escura `bia-band`), estatísticas e CTA. As demais seções do
ecossistema funcionam como contexto que **eleva** o PampaTec. O PampaTec
reaparece como âncora na trajetória (fundação) e no mural de parceiros.

## Reaproveitamento (sem inventar componentes)

Componentes já existentes em `css/styles.css`: `.page-hero`, `.section`,
`.section--navy/--paper2/--green`, `.section-head`, `.eyebrow`, `.grid-2/3/4`,
`.card` + `.ico`, `.stat` / `.stat--glass`, `.chip`, `.pill`, `.bia-band` +
`.bia-tile`, `.btn-*`, `.check-list`, `.co-card`, `.timeline` + `.tl-item`,
`.split`, `.reveal`. Ícones via Lucide (já carregado). i18n via `data-i18n` +
`i18n/ui.{pt,es,en}.json`.

**Novo CSS** (mínimo, com os tokens existentes):
- `.logo-wall` — grade de tiles brancos para os logos dos parceiros, com
  grupos rotulados; logos em escala de cinza que ganham cor no hover.
- `.trilha` — fileira de 6 etapas em "chevron"/cards numerados (fallback para
  `.grid` em telas pequenas).
- `.purpose` — grade com um cartão-declaração central ("Baita Chão").

## Mapa de seções (ordem)

1. **Hero** (`page-hero`) — eyebrow "Alegrete · Cidade Inovadora";
   h1 "Ecossistema de Inovação de Alegrete"; lead "Conectando pessoas, ideias e
   soluções para transformar o futuro da cidade." Breadcrumb Início · Inovação.
2. **★ PampaTec — Destaque principal** (`section bia-band on-dark`) —
   badge "Coração do ecossistema · PampaTec"; h2 "PampaTec — o motor da inovação
   em Alegrete"; 2 parágrafos; 4 stats glass (2010 · +30 startups · +R$7mi
   tributos · 1ª design house de semicondutores do RS); CTA `btn-cyan`
   "Conhecer o PampaTec" → `pampatec.html`. Painel `bia-tile` (cpu, circuit,
   rocket, sprout).
3. **Por que inovação em Alegrete?** (`section`) — "Inovação não é apenas
   tecnologia." `grid-4`: Resolver problemas reais, Gerar oportunidades,
   Melhorar serviços, Fortalecer negócios.
4. **Território de Oportunidades** (`section--paper2`) — `grid` de 5: Força do
   Agro, Extensão Territorial, Polo Educacional, Identidade e Turismo,
   Empreendedorismo.
5. **Nossa Trajetória** (`section`) — `timeline` com 3 fases; Fase 1 cita a
   criação do PampaTec.
6. **O que é o Ecossistema?** (`section--navy`) — "rede colaborativa / quádrupla
   hélice"; `grid` de 6 atores.
7. **Nosso Propósito** (`section`) — cartão-declaração "Baita Chão" + 4 cards.
8. **Frentes de Atuação** (`section--paper2`) — `grid-4` de 8 frentes.
9. **A Trilha Empreendedora** (`section`) — `.trilha` com 6 etapas
   (Sensibilização → Escala).
10. **Uma construção a muitas mãos** (`section--paper2`) — `.logo-wall`
    agrupado: Universidades (IFFar, Unipampa) · Governo (Inova RS, Prefeitura/
    SEDETUR) · Empresas & Entidades (CAAL, Parcianello, AgroPontes, SEAC,
    Sicredi, Aura 21, JGSConsult) · Ambientes & Fomento (Fundação Maronna,
    PampaTec, Arrozeiros, Sindicato Rural, NIT, SEBRAE). Botão "Baixe a
    apresentação" → `assets/docs/ecossistema-inovacao-alegrete.pdf`.
11. **Como participar** (`section`) — `grid` de 6: Apoiar e Patrocinar, Mentorar
    Empreendedores, Propor Desafios, Integrar Grupos de Trabalho, Divulgar a
    Cultura, Conectar Oportunidades.
12. **CTA final** (`section--navy`) — "Conecte-se. Participe. Colabore. Inove.";
    CTA → `pampatec.html` e link Instagram @alegretecidadeinovadora.

## Ativos

- `assets/logos/parceiros/*.png` — 16 logos extraídos do deck (transparentes,
  aparados): agropontes, arrozeiros, aura21, caal, iffar, inovars, jgsconsult,
  maronna, nit, pampatec, parcianello, prefeitura-sedetur, seac, sebrae,
  sicredi, sindicato-rural.
- `assets/logos/unipampa-bandeira.svg` — já existente, usado para Unipampa.
- `assets/docs/ecossistema-inovacao-alegrete.pdf` — cópia do deck para download.

## Integração / navegação

- `components/header.html`: item "Inovação" passa a apontar para
  `ecossistema.html`; no menu mobile, manter "PampaTec" → `pampatec.html` e
  adicionar "Ecossistema de Inovação" → `ecossistema.html`. `data-nav` coerente.
- `pampatec.html`: breadcrumb ganha link "Ecossistema" → `ecossistema.html`.
- i18n: novas chaves `eco_*` nos três arquivos de locale; chaves de nav
  reutilizadas/adicionadas conforme necessário.

## Fora de escopo

Sem alterações de backend, sem scraping de imagens da web, sem refatoração não
relacionada. Os logos são marcas de terceiros usadas para identificar parceiros
oficiais do ecossistema (uso nominativo).
