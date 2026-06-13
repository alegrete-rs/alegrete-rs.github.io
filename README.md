# Portal Alegrete — Um baita destino

Site institucional e turístico de **Alegrete-RS**, a cidade mais gaúcha do Rio
Grande do Sul. Trilíngue (🇧🇷 PT · 🇪🇸 ES · 🇬🇧 EN), 100% estático, publicado via
**GitHub Pages** em `alegrete-rs.github.io`.

## Como rodar localmente

O site usa `fetch()` para carregar componentes e dados JSON, o que **não funciona**
abrindo o arquivo direto (`file://`). Suba um servidor estático:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

```
index.html            Home
historia.html         História & cultura
gastronomia.html      Sabores · restaurantes/bares/cafés + mapa
hospedagem.html       Hotéis, pousadas, camping + mapa
esportes.html         Esportes & lazer + mapa
natureza.html         Natureza & rios + mapa
eventos.html          Calendário de eventos
compras.html          Free shops da fronteira + mapa
regiao.html           Uruguai, Argentina e vinícolas + mapa
como-chegar.html      Transporte, aeroportos e distâncias

components/            header.html e footer.html (injetados via JS em todas as páginas)
css/styles.css        Design system "Editorial Pampa"
js/app.js             Componentes, i18n, navegação, animações
js/content.js         Renderização de cards e mapas (Leaflet) a partir dos dados
i18n/ui.{pt,es,en}.json   Textos da interface (mesmas chaves nos 3 idiomas)
data/                 Conteúdo editável (veja abaixo)
assets/               Favicon e imagens
```

## Como editar o conteúdo

Quase tudo vive em arquivos JSON — não é preciso mexer no HTML.

### `data/locais.json`
Cada local (restaurante, hotel, quadra, rio, free shop, vinícola, monumento…):

```json
{
  "id": "identificador-unico",
  "categoria": "restaurante",
  "nome": "Nome do Local",
  "descricao": { "pt": "…", "es": "…", "en": "…" },
  "endereco": "Rua X, 123 - Centro",
  "telefone": "+55 55 0000-0000",
  "instagram": "@perfil",
  "website": "https://…",
  "lat": -29.78, "lng": -55.79,
  "confirmado": true
}
```

- **categoria** define em qual página o local aparece e a cor do marcador no mapa.
  Valores: `restaurante, bar, cafe, hotel, pousada, camping, quadra, esporte,
  rio, reserva, trilha, freeshop, vinicola, atracao, cultura`.
- **confirmado: false** mostra um selo "A confirmar" — use enquanto o dado não
  foi verificado.
- `lat`/`lng` posicionam o marcador. `endereco`, `telefone`, `instagram`,
  `website` são todos opcionais.

### `data/eventos.json`
Eventos do calendário (ordenados por `mes`, 1–12) com `quando`, `local`,
`descricao` (trilíngue) e `instagram`.

### `data/distancias.json`
Tabela de distâncias da página "Como Chegar": `destino`, `km`, `pais`
(`BR`/`UY`/`AR`).

### `data/links.json`
Perfis e canais úteis exibidos na home.

### Textos da interface — `i18n/ui.*.json`
Para mudar títulos de seção, menus e rótulos, edite as três versões mantendo as
**mesmas chaves**. Português é o idioma padrão e o fallback.

## Notas

- Mapas: Leaflet + OpenStreetMap (tiles CARTO Voyager), sem chave de API.
- Fontes: Fraunces (títulos) e Archivo (texto), via Google Fonts.
- Ícones: Lucide. CSS utilitário: Tailwind não é usado em runtime — o estilo está
  em `css/styles.css`.
- Dados reunidos de fontes públicas/oficiais; confirme contatos antes de divulgar.
```

## Créditos

Desenvolvido por **[AI Horizon Labs](https://ai-horizon-labs.github.io)**.
Conteúdo parcialmente cedido pela **Secretaria Municipal de Desenvolvimento e
Parceria**.

### Créditos de imagens

- Ponte férrea sobre o Rio Ibirapuitã (`assets/img/ponte-ibirapuita.jpg`):
  foto de **olimpio_marcal**, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ponte_f%C3%A9rrea_dobre_o_rio_Ibirapuit%C3%A3_-_panoramio.jpg),
  licença [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- Bandeira da Unipampa (`assets/logos/unipampa-bandeira.svg`):
  identidade visual oficial da **Universidade Federal do Pampa** (Manual de Identidade Visual, 2013),
  via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bandeira_da_Unipampa_-_Universidade_Federal_do_Pampa.svg),
  domínio público.

### Referências

- [Caiaqueiros do Alegrete](https://www.facebook.com/CaiaqueirosDoAlegreteRs/)
- [Tropeiros de Capincho](https://www.instagram.com/tropeirosdecapincho/)
- [Caiacada Ecológica da Fronteira — Rosário do Sul](https://www.rosariodosul.rs.gov.br/noticia/view/617/2-caiacada-ecologica-da-fronteira-reune-mais-de-100-participantes-em-rosario-do-sul)
