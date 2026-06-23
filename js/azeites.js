// Azeites & olivais page: renders producer cards, the news/recognition cards
// and the Leaflet map pins from a single source (data/azeites.json).
// Re-runs on language change so notes, labels and popups stay in sync.
(function () {
  let _data = null;
  let _map = null;

  function pickLang() {
    return (window.ALEGRETE && window.ALEGRETE.lang) || 'pt';
  }
  function pick(o, lang) {
    return o == null ? '' : (typeof o === 'string' ? o : (o[lang] || o.pt || ''));
  }

  function produtorCard(p, i, lang) {
    const chip = p.home
      ? `<span class="chip terra"><i data-lucide="map-pin"></i>${window.t('az_chip_home', 'Alegrete')}</span>`
      : `<span class="chip">${p.local}</span>`;
    return `
    <div class="card reveal" data-delay="${(i % 3) * 60}">
      <div class="card-body">
        ${chip}
        <h3>${p.nome}</h3>
        <p class="row" style="color:#7a6f5e;font-size:.9rem;margin:2px 0 6px"><i data-lucide="user-round" style="width:15px;height:15px"></i> <span>${p.produtor}</span></p>
        <p>${pick(p.nota, lang)}</p>
      </div>
    </div>`;
  }

  function materiaCard(m, i, lang) {
    const premio = m.premio
      ? `<span class="chip gold"><i data-lucide="award"></i>${m.premio}</span>`
      : `<span class="chip">${m.fonte}</span>`;
    return `
    <a class="card card-link reveal" href="${m.url}" target="_blank" rel="noopener" data-delay="${(i % 3) * 60}">
      <div class="card-body">
        ${premio}
        <h3>${m.titulo}</h3>
        <p>${pick(m.resumo, lang)}</p>
        <span class="row" style="color:var(--terra)"><i data-lucide="newspaper"></i> <span>${window.t('az_read', 'Ler matéria')} · ${m.fonte}</span></span>
      </div>
    </a>`;
  }

  function renderCards(lang) {
    const prodList = document.getElementById('azProdList');
    if (prodList && _data && Array.isArray(_data.produtores)) {
      prodList.innerHTML = _data.produtores.map((p, i) => produtorCard(p, i, lang)).join('');
      if (window.__reobserveReveal) window.__reobserveReveal(prodList);
    }
    const matList = document.getElementById('azMateriasList');
    if (matList && _data && Array.isArray(_data.materias)) {
      matList.innerHTML = _data.materias.map((m, i) => materiaCard(m, i, lang)).join('');
      if (window.__reobserveReveal) window.__reobserveReveal(matList);
    }
    if (window.lucide) lucide.createIcons();
  }

  function popupHtml(p, lang) {
    const route = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(p.nome + ' ' + p.local + ' RS');
    return '<b>' + p.nome + '</b><br>' + p.local + '<br>' +
      '<a href="' + route + '" target="_blank" rel="noopener">' + window.t('see_route', 'Ver rota') + '</a>';
  }

  function renderMap(lang) {
    if (!window.L || !_data || !Array.isArray(_data.produtores)) return;
    const el = document.getElementById('azMap');
    if (!el) return;
    if (_map) { _map.remove(); _map = null; }

    _map = L.map('azMap', { scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
    }).addTo(_map);

    const bounds = [];
    _data.produtores.forEach(p => {
      const color = p.home ? '#6b7d2f' : '#9a7b1f';
      const icon = L.divIcon({
        className: '',
        html: '<div class="pin" style="background:' + color + '"><span><i data-lucide="leaf" style="width:13px;height:13px"></i></span></div>',
        iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -24]
      });
      L.marker([p.lat, p.lng], { icon }).addTo(_map).bindPopup(popupHtml(p, lang));
      bounds.push([p.lat, p.lng]);
    });
    if (bounds.length) _map.fitBounds(bounds, { padding: [40, 40] });

    setTimeout(() => { if (window.lucide) lucide.createIcons(); _map.invalidateSize(); }, 150);
  }

  function renderAll() {
    const lang = pickLang();
    if (!_data) {
      fetch('data/azeites.json').then(r => r.json()).then(d => {
        _data = d || {};
        renderCards(lang);
        renderMap(lang);
      }).catch(err => console.error('Falha ao carregar azeites', err));
    } else {
      renderCards(lang);
      renderMap(lang);
    }
  }

  document.addEventListener('core-ready', renderAll);
  document.addEventListener('langchange', renderAll);
})();
