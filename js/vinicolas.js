// Vinhos & Vinícolas page: renders the regional winery cards and the Leaflet
// map pins from a single source of truth (data/vinicolas.json). Re-runs on
// language change so card notes, button labels and map popups stay in sync.
(function () {
  let _data = null;
  let _map = null;

  function pickLang() {
    return (window.ALEGRETE && window.ALEGRETE.lang) || 'pt';
  }
  function pick(o, lang) {
    return o == null ? '' : (typeof o === 'string' ? o : (o[lang] || o.pt || ''));
  }

  function linkLabel(type) {
    return type === 'instagram'
      ? window.t('vin_link_ig', 'Seguir no Instagram')
      : window.t('vin_link_site', 'Visitar site');
  }
  function linkIcon(type) {
    return type === 'instagram' ? 'instagram' : 'globe';
  }

  function cardHtml(w, i, lang) {
    const home = !!w.home;
    const chip = home
      ? `<span class="chip terra"><i data-lucide="map-pin"></i>${window.t('vin_chip_home', 'Aqui em Alegrete')}</span>`
      : `<span class="chip">${w.cidade}</span>`;
    return `
    <a class="card card-link reveal" href="${w.link.url}" target="_blank" rel="noopener" data-delay="${(i % 3) * 60}">
      <div class="card-body">
        ${chip}
        <h3>${w.nome}</h3>
        <p>${pick(w.nota, lang)}</p>
        <span class="row" style="color:var(--terra)"><i data-lucide="${linkIcon(w.link.type)}"></i> <span>${linkLabel(w.link.type)}</span></span>
      </div>
    </a>`;
  }

  function renderCards(lang) {
    const list = document.getElementById('vinList');
    if (!list || !_data) return;
    // The home winery (Vinhas do Alegrete) has its own highlight block above,
    // so the regional grid lists everyone else.
    const regionais = _data.filter(w => !w.home);
    list.innerHTML = regionais.map((w, i) => cardHtml(w, i, lang)).join('');
    if (window.lucide) lucide.createIcons();
    if (window.__reobserveReveal) window.__reobserveReveal(list);
  }

  function popupHtml(w, lang) {
    const route = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(w.nome + ' ' + w.cidade + ' RS');
    return '<b>' + w.nome + '</b><br>' + w.cidade + '<br>' +
      '<a href="' + w.link.url + '" target="_blank" rel="noopener">' + linkLabel(w.link.type) + '</a> · ' +
      '<a href="' + route + '" target="_blank" rel="noopener">' + window.t('see_route', 'Ver rota') + '</a>';
  }

  function renderMap(lang) {
    if (!window.L || !_data) return;
    const el = document.getElementById('vinMap');
    if (!el) return;
    if (_map) { _map.remove(); _map = null; }

    _map = L.map('vinMap', { scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
    }).addTo(_map);

    const bounds = [];
    _data.forEach(w => {
      const color = w.home ? '#b5482b' : '#7a3b6b';
      const icon = L.divIcon({
        className: '',
        html: '<div class="pin" style="background:' + color + '"><span><i data-lucide="grape" style="width:13px;height:13px"></i></span></div>',
        iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -24]
      });
      L.marker([w.lat, w.lng], { icon }).addTo(_map).bindPopup(popupHtml(w, lang));
      bounds.push([w.lat, w.lng]);
    });
    if (bounds.length) _map.fitBounds(bounds, { padding: [40, 40] });

    setTimeout(() => { if (window.lucide) lucide.createIcons(); _map.invalidateSize(); }, 150);
  }

  function renderAll() {
    const lang = pickLang();
    if (!_data) {
      fetch('data/vinicolas.json').then(r => r.json()).then(items => {
        _data = Array.isArray(items) ? items : [];
        renderCards(lang);
        renderMap(lang);
      }).catch(err => console.error('Falha ao carregar vinícolas', err));
    } else {
      renderCards(lang);
      renderMap(lang);
    }
  }

  document.addEventListener('core-ready', renderAll);
  document.addEventListener('langchange', renderAll);
})();
