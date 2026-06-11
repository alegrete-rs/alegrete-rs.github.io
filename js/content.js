/* ============================================================
   Portal Alegrete — data-driven content: cards + Leaflet maps
   Reads data/locais.json and renders cards/markers per page.
   ============================================================ */
(function () {
  const ALEGRETE_CENTER = [-29.7831, -55.7919];

  // Category metadata: lucide icon + pin color + i18n label key
  const CATS = {
    restaurante: { icon: 'utensils-crossed', color: '#b5482b', label: 'cat_restaurante' },
    bar:         { icon: 'beer',             color: '#c98a2a', label: 'cat_bar' },
    cafe:        { icon: 'coffee',           color: '#8a5a2b', label: 'cat_cafe' },
    hotel:       { icon: 'bed-double',       color: '#2f5a42', label: 'cat_hotel' },
    pousada:     { icon: 'home',             color: '#3f7355', label: 'cat_pousada' },
    camping:     { icon: 'tent',             color: '#3f7355', label: 'cat_camping' },
    quadra:      { icon: 'volleyball',       color: '#b5482b', label: 'cat_quadra' },
    esporte:     { icon: 'medal',            color: '#c98a2a', label: 'cat_esporte' },
    rio:         { icon: 'waves',            color: '#2f6f8a', label: 'cat_rio' },
    reserva:     { icon: 'trees',            color: '#2f5a42', label: 'cat_reserva' },
    trilha:      { icon: 'footprints',       color: '#3f7355', label: 'cat_trilha' },
    freeshop:    { icon: 'shopping-bag',     color: '#b5482b', label: 'cat_freeshop' },
    vinicola:    { icon: 'grape',            color: '#7a2e4a', label: 'cat_vinicola' },
    atracao:     { icon: 'camera',           color: '#c98a2a', label: 'cat_atracao' },
    cultura:     { icon: 'landmark',         color: '#2f5a42', label: 'cat_cultura' },
    // Saúde
    hospital:    { icon: 'hospital',         color: '#b5482b', label: 'cat_hospital' },
    upa:         { icon: 'ambulance',        color: '#c0392b', label: 'cat_upa' },
    posto:       { icon: 'stethoscope',      color: '#2f7dc4', label: 'cat_posto' },
    ambulatorio: { icon: 'heart-pulse',      color: '#7a2e4a', label: 'cat_ambulatorio' },
    // Vida universitária
    universidade:{ icon: 'graduation-cap',   color: '#2f5a42', label: 'cat_universidade' },
    pesquisa:    { icon: 'flask-conical',    color: '#3f7355', label: 'cat_pesquisa' },
    estudante:   { icon: 'book-open',        color: '#c98a2a', label: 'cat_estudante' },
    // Locais de eventos
    evento_local:{ icon: 'party-popper',     color: '#7a2e4a', label: 'cat_evento_local' },
  };

  // A place's primary category plus any extra tags it should also appear under.
  // `categorias` (array) is optional and backwards-compatible with single `categoria`.
  function placeCats(p) {
    const extra = Array.isArray(p.categorias) ? p.categorias : [];
    return p.categoria ? [p.categoria].concat(extra) : extra;
  }
  function inCats(p, cats) {
    return placeCats(p).some((c) => cats.includes(c));
  }

  let _places = null;
  async function getPlaces() {
    if (_places) return _places;
    const res = await fetch('data/locais.json');
    _places = await res.json();
    return _places;
  }

  function lang() { return (window.ALEGRETE && window.ALEGRETE.lang) || 'pt'; }
  function loc(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang()] || obj.pt || '';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function mapsLink(p) {
    if (p.lat && p.lng) return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
    const q = encodeURIComponent(`${p.nome}, Alegrete RS`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  function cardHTML(p) {
    const cat = CATS[p.categoria] || CATS.atracao;
    const catLabel = window.t(cat.label, p.categoria);
    const media = p.foto
      ? `<img src="${esc(p.foto)}" alt="${esc(p.nome)}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="ph"><i data-lucide="${cat.icon}"></i></div>`;

    const meta = [];
    if (p.endereco) meta.push(`<span class="row"><i data-lucide="map-pin"></i>${esc(p.endereco)}</span>`);
    if (p.telefone) meta.push(`<a class="row" href="tel:${esc(p.telefone.replace(/[^+\d]/g, ''))}"><i data-lucide="phone"></i>${esc(p.telefone)}</a>`);
    if (p.instagram) {
      const handle = p.instagram.replace('@', '');
      meta.push(`<a class="row" href="https://instagram.com/${esc(handle)}" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>${esc(p.instagram)}</a>`);
    }
    if (p.website) meta.push(`<a class="row" href="${esc(p.website)}" target="_blank" rel="noopener"><i data-lucide="globe"></i>${window.t('site_visit', 'Site oficial')}</a>`);
    meta.push(`<a class="row" href="${mapsLink(p)}" target="_blank" rel="noopener"><i data-lucide="navigation"></i>${window.t('see_route', 'Ver rota')}</a>`);

    const unconfirmed = p.confirmado === false
      ? `<span class="badge-unconfirmed"><i data-lucide="alert-circle" style="width:12px;height:12px"></i>${window.t('to_confirm', 'A confirmar')}</span>`
      : '';

    return `
      <article class="card reveal" data-place="${esc(p.id)}">
        <div class="card-media">${media}</div>
        <div class="card-body">
          <span class="chip ${p.categoria === 'restaurante' || p.categoria === 'quadra' || p.categoria === 'freeshop' ? 'terra' : (p.categoria === 'bar' || p.categoria === 'atracao' || p.categoria === 'esporte' ? 'gold' : '')}">${esc(catLabel)}</span>
          <h3>${esc(p.nome)}</h3>
          <p>${esc(loc(p.descricao))}</p>
          ${unconfirmed ? `<div>${unconfirmed}</div>` : ''}
          <div class="meta">${meta.join('')}</div>
        </div>
      </article>`;
  }

  function renderCards(container, items) {
    container.innerHTML = items.map(cardHTML).join('');
    if (window.lucide) lucide.createIcons();
    // re-run reveal for freshly added cards
    container.querySelectorAll('.reveal').forEach((el, i) => {
      el.dataset.delay = String((i % 4) * 60);
    });
    if (typeof window.__reobserveReveal === 'function') window.__reobserveReveal(container);
  }

  /* ---- Leaflet map ---- */
  function buildMap(mapId, items) {
    if (!window.L || !document.getElementById(mapId)) return null;
    const map = L.map(mapId, { scrollWheelZoom: false }).setView(ALEGRETE_CENTER, 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    const markers = {};
    const pts = [];
    items.filter((p) => p.lat && p.lng).forEach((p) => {
      const cat = CATS[p.categoria] || CATS.atracao;
      const icon = L.divIcon({
        className: '',
        html: `<div class="pin" style="background:${cat.color}"><span><i data-lucide="${cat.icon}" style="width:13px;height:13px"></i></span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -24],
      });
      const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
      const links = [];
      if (p.telefone) links.push(`📞 ${esc(p.telefone)}`);
      if (p.instagram) links.push(`<a href="https://instagram.com/${esc(p.instagram.replace('@',''))}" target="_blank" rel="noopener">${esc(p.instagram)}</a>`);
      links.push(`<a href="${mapsLink(p)}" target="_blank" rel="noopener">${window.t('see_route','Ver rota')}</a>`);
      m.bindPopup(`<b>${esc(p.nome)}</b><br>${p.endereco ? esc(p.endereco) + '<br>' : ''}${links.join(' · ')}`);
      markers[p.id] = m;
      pts.push([p.lat, p.lng]);
    });

    if (pts.length > 1) map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
    else if (pts.length === 1) map.setView(pts[0], 14);

    // re-render lucide icons inside markers + fix sizing inside reveal containers
    setTimeout(() => {
      if (window.lucide) lucide.createIcons();
      map.invalidateSize();
    }, 120);
    return { map, markers };
  }

  /* ---- Press clippings (matérias) ---- */
  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    const map = { pt: 'pt-BR', es: 'es-ES', en: 'en-US' };
    try { return d.toLocaleDateString(map[lang()] || 'pt-BR', { month: 'short', year: 'numeric' }); }
    catch (e) { return String(d.getFullYear()); }
  }

  function materiaCardHTML(m) {
    const media = m.foto
      ? `<img src="${esc(m.foto)}" alt="${esc(m.titulo)}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="ph"><i data-lucide="newspaper"></i></div>`;
    const dateLine = [esc(m.veiculo)].concat(m.data ? [esc(fmtDate(m.data))] : []).join(' · ');
    return `
      <a class="card card-link reveal" href="${esc(m.url)}" target="_blank" rel="noopener">
        <div class="card-media">${media}</div>
        <div class="card-body">
          <span class="chip gold">${esc(loc(m.tag))}</span>
          <h3>${esc(m.titulo)}</h3>
          <div class="meta">
            <span class="row"><i data-lucide="newspaper"></i>${dateLine}</span>
            <span class="row"><i data-lucide="external-link"></i>${window.t('press_read', 'Ler matéria')}</span>
          </div>
        </div>
      </a>`;
  }

  /* ---- Public API ---- */
  window.AlegreteContent = {
    CATS,
    async renderMaterias(opts) {
      const list = opts && opts.listId ? document.getElementById(opts.listId) : null;
      if (!list) return null;
      let data;
      try {
        const res = await fetch((opts && opts.source) || 'data/materias.json');
        data = await res.json();
      } catch (e) { console.error('Falha ao carregar matérias', e); return null; }

      const draw = () => {
        list.innerHTML = data.map(materiaCardHTML).join('');
        if (window.lucide) lucide.createIcons();
        list.querySelectorAll('.reveal').forEach((el, i) => { el.dataset.delay = String((i % 3) * 80); });
        if (typeof window.__reobserveReveal === 'function') window.__reobserveReveal(list);
      };
      draw();
      document.addEventListener('langchange', draw);
      return data;
    },
    async render(opts) {
      // opts: { listId, mapId, categories:[], filter:bool }
      const all = await getPlaces();
      const cats = opts.categories || null;
      let items = cats ? all.filter((p) => inCats(p, cats)) : all.slice();

      const list = opts.listId ? document.getElementById(opts.listId) : null;
      let mapRef = null;

      const draw = () => {
        if (list) renderCards(list, items);
      };
      draw();
      if (opts.mapId) mapRef = buildMap(opts.mapId, items);

      // optional filter bar
      if (opts.filterId && cats && cats.length > 1) {
        const bar = document.getElementById(opts.filterId);
        if (bar) {
          const mkBtn = (cat, active) => {
            const lbl = cat === '*' ? window.t('filter_all', 'Todos') : window.t((CATS[cat] || {}).label || cat, cat);
            return `<button data-cat="${cat}" class="${active ? 'active' : ''}">${esc(lbl)}</button>`;
          };
          bar.innerHTML = mkBtn('*', true) + cats.map((c) => mkBtn(c, false)).join('');
          bar.querySelectorAll('button').forEach((b) =>
            b.addEventListener('click', () => {
              bar.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
              b.classList.add('active');
              const c = b.dataset.cat;
              items = c === '*' ? (cats ? all.filter((p) => inCats(p, cats)) : all.slice())
                                : all.filter((p) => inCats(p, [c]));
              draw();
            })
          );
        }
      }

      // re-render text on language change
      document.addEventListener('langchange', () => {
        if (list) renderCards(list, items);
        if (opts.filterId) {
          const bar = document.getElementById(opts.filterId);
          if (bar) bar.querySelectorAll('button').forEach((b) => {
            const c = b.dataset.cat;
            b.textContent = c === '*' ? window.t('filter_all', 'Todos') : window.t((CATS[c] || {}).label || c, c);
          });
        }
      });

      return { items, mapRef };
    },
  };
})();
