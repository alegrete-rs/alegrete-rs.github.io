# Portal "Alegrete, o Baita Chão" — Design

Date: 2026-06-10
Status: Approved

## Goal

A complete, attractive, trilingual (PT/ES/EN) static website about the city of
Alegrete-RS (Brazil), served from GitHub Pages (`alegrete-rs.github.io`). It aims
to attract new residents/visitors, help locals find information, and centralize
useful pointers (official Instagram profiles, tourism, transport).

## Decisions (approved)

- **Structure:** multi-page site (home + 9 themed pages).
- **Data:** data-driven via JSON; extensive web research to populate real data;
  unverifiable entries flagged `confirmado: false`.
- **Images:** free sources (Wikimedia Commons / Unsplash) with credit, plus
  elegant placeholders where a specific local photo is needed.
- **Maps:** Leaflet + OpenStreetMap (no API key/cost).
- **Languages:** Portuguese, Spanish, English.
- **Tech:** vanilla HTML + Tailwind (CDN) + vanilla JS; no build step.

## Architecture

```
/
├── index.html                 home (overview + links)
├── historia.html              history, culture, museums, monuments
├── gastronomia.html           cuisine + restaurants/bars/cafes + map
├── hospedagem.html            hotels, pousadas, camping, motorhome + map
├── esportes.html              running, padel, kayaking, courts, hípica + map
├── natureza.html              rivers, fishing, SUP, jetski, reserves, trails + map
├── eventos.html               annual events/festivals calendar
├── compras.html               border free shops (Rivera, Uruguaiana, Artigas...)
├── regiao.html                Uruguay, Argentina, Campanha wineries, hot springs
├── como-chegar.html           buses, airports, highways, distances + map
├── components/                header.html, footer.html (injected via JS)
├── data/                      locais.json, eventos.json, distancias.json, links.json
├── i18n/                      ui.pt.json, ui.es.json, ui.en.json
├── js/                        i18n.js, components.js, render.js, map.js, main.js
├── css/                       styles.css
└── assets/img/                images + favicon
```

## Data model

`data/locais.json` — array of:
```json
{
  "id": "kebab-id",
  "categoria": "restaurante|bar|cafe|hotel|pousada|camping|quadra|rio|reserva|trilha|freeshop|vinicola|atracao",
  "nome": "...",
  "descricao": { "pt": "...", "es": "...", "en": "..." },
  "endereco": "...", "telefone": "...", "instagram": "@...", "website": "https://...",
  "lat": -29.78, "lng": -55.79,
  "tags": ["..."],
  "confirmado": true
}
```

`data/eventos.json` — events with `{ id, nome, mes, descricao{pt,es,en}, categoria, recorrencia }`.
`data/distancias.json` — `{ destino, km, pais }`.
`data/links.json` — `{ titulo{...}, url, instagram, categoria }`.

## i18n

- Language switcher in header; choice stored in `localStorage`.
- UI strings in `i18n/ui.{lang}.json`, applied to `[data-i18n]` elements.
- Content strings come from `{pt,es,en}` fields in data JSON.
- PT is default and fallback.

## Maps

Per-page Leaflet map centered on Alegrete (~ -29.783, -55.791), markers colored by
category, popups with name/address/phone/Instagram + "route" link to Google Maps.
Cards and markers share the same data and cross-highlight on hover.

## Page content summary

- **Home:** hero "Baita Chão", stats, condensed history/innovation, section grid,
  featured events, useful-links band (official Instagrams).
- **História & Cultura:** Farroupilha history, 3rd Capital, monuments (Ponte Borges
  de Medeiros, Igreja Matriz, Estação Ferroviária, Negrinho Triunfante), museums
  (Oswaldo Aranha, Museu do Gaúcho), military tourism, CTGs.
- **Gastronomia:** typical food (churrasco, linguiça campeira, charque, queijos,
  azeite, doces) + restaurants/bars/cafés with contact + map.
- **Hospedagem:** hotels, pousadas, camping, motorhome + map.
- **Esportes & Lazer:** running (Meia Maratona da Independência), padel, kayaking,
  cycling, hípica + sports courts on map.
- **Natureza & Rios:** Ibirapuitã & Ibicuí (fishing, kayak, SUP, jetski), APA do
  Ibirapuitã/reserves, ecological trails, Cascata no Pampa, birdwatching.
- **Eventos:** annual calendar — Festival da Linguiça, Campereada Internacional,
  Festa do Arroz, Festa do Milho, Semana Farroupilha + 20 de Setembro parade,
  EFIPAN, Temporada Hípica, Carnaval.
- **Compras na Fronteira:** free shops Rivera/Sant'Ana, Uruguaiana/Paso de los
  Libres, Artigas, Salto — distances, documents, tips.
- **Região:** Uruguay (Salto/termas, Montevideo), Argentina (Paso de los Libres,
  Corrientes, Buenos Aires), Campanha wineries (Sant'Ana — Almadén/Miolo, Dom
  Pedrito, Bagé), hot springs.
- **Como Chegar:** buses (POA, Buenos Aires, Montevideo), rodoviária, airports
  (Alegrete/Gaudêncio Machado Ramos, Uruguaiana, Salgado Filho-POA, Santa Maria,
  Santo Ângelo), highways, distance table.

## Implementation phases

1. Foundation: structure, shared header/footer, i18n, data schema, map base,
   design system, home.
2. Content pages: the 9 internal pages using phase-1 components.
3. Research & data: web searches and JSON population.

## Notes

- GitHub Pages serves over HTTPS so `fetch()` of local JSON works; local preview
  requires a static server (`python3 -m http.server`) because `file://` blocks fetch.
- Keep the green "Pampa" brand theme, Ubuntu font, Lucide icons.
