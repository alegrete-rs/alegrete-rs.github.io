// Shared rendering for the Divulgações pages.
// Used by divulgacoes.html (upcoming events) and
// divulgacoes-realizados.html (past events). Single source of truth so the
// two pages never drift apart.
(function () {
  function makePick(lang) {
    return (o) => (o == null ? '' : (typeof o === 'string' ? o : (o[lang] || o.pt || '')));
  }

  function isPast(d, today) {
    return d.dataISO && new Date(d.dataISO) < today;
  }

  function cardHtml(d, i, pick) {
    const past = isPast(d, startOfToday());
    const status = past
      ? `<span class="divulg-status past"><i data-lucide="check-circle-2"></i>${window.t('divulg_past', 'Realizado')}</span>`
      : `<span class="divulg-status soon"><i data-lucide="megaphone"></i>${window.t('divulg_soon', 'Em breve')}</span>`;
    const tags = pick(d.tags);
    const tagsHtml = Array.isArray(tags) && tags.length
      ? `<div class="divulg-tags">${tags.map(t => `<span class="chip green">${t}</span>`).join('')}</div>`
      : '';
    const body = pick(d.corpo);
    const bodyHtml = Array.isArray(body)
      ? body.map(p => `<p>${p}</p>`).join('')
      : (body ? `<p>${body}</p>` : '');

    const meta = [];
    if (d.quando) meta.push(['calendar-days', pick(d.quando)]);
    if (d.horario) meta.push(['clock', pick(d.horario)]);
    if (d.local) meta.push(['map-pin', pick(d.local)]);
    if (d.palestrante) meta.push(['user-round', pick(d.palestrante)]);
    const metaHtml = meta.map(([icon, val]) =>
      `<li><i data-lucide="${icon}"></i><span>${val}</span></li>`).join('');

    const subtitle = pick(d.subtitulo);
    const theme = pick(d.tema);
    const program = pick(d.programa);

    const ctaLabel = (d.link && pick(d.link.label)) || window.t('divulg_signup', 'Inscreva-se');
    const ctaHtml = (!past && d.link && d.link.url)
      ? `<a class="btn btn-primary divulg-cta" href="${d.link.url}" target="_blank" rel="noopener"><i data-lucide="clipboard-pen-line"></i>${ctaLabel}</a>`
      : '';

    return `
    <article class="divulg-card reveal" id="${d.slug || ''}" data-delay="${(i % 3) * 80}">
      <a class="divulg-poster" href="${d.imagem}" target="_blank" rel="noopener" aria-label="${pick(d.imagemAlt)}">
        <img src="${d.imagem}" alt="${pick(d.imagemAlt)}" loading="lazy" />
        <span class="divulg-zoom"><i data-lucide="maximize-2"></i></span>
      </a>
      <div class="divulg-body">
        <div class="divulg-toprow">
          <span class="eyebrow">${pick(d.tipo)}</span>
          ${status}
        </div>
        ${program ? `<p class="divulg-program">${program}</p>` : ''}
        <h2 class="divulg-title">${d.titulo}</h2>
        ${subtitle ? `<p class="divulg-sub">${subtitle}</p>` : ''}
        ${theme ? `<p class="divulg-theme"><i data-lucide="sprout"></i>${theme}</p>` : ''}
        ${metaHtml ? `<ul class="divulg-meta">${metaHtml}</ul>` : ''}
        <div class="divulg-text">${bodyHtml}</div>
        ${tagsHtml}
        ${ctaHtml}
      </div>
    </article>`;
  }

  function startOfToday() {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }

  // opts: { filter: 'upcoming' | 'past', listId, emptyId, onCounts(counts) }
  window.renderDivulgacoes = function (opts) {
    opts = opts || {};
    const filter = opts.filter || 'upcoming';
    const list = document.getElementById(opts.listId || 'divulgList');
    const empty = document.getElementById(opts.emptyId || 'divulgEmpty');
    if (!list) return;

    const lang = (window.ALEGRETE && window.ALEGRETE.lang) || 'pt';
    const pick = makePick(lang);

    fetch('data/divulgacoes.json').then(r => r.json()).then(items => {
      if (!Array.isArray(items)) items = [];
      const today = startOfToday();

      const upcoming = items.filter(d => !isPast(d, today));
      const past = items.filter(d => isPast(d, today));
      if (typeof opts.onCounts === 'function') {
        opts.onCounts({ upcoming: upcoming.length, past: past.length });
      }

      let selected;
      if (filter === 'past') {
        // Most recently realized first.
        selected = past.sort((a, b) => new Date(b.dataISO || 0) - new Date(a.dataISO || 0));
      } else {
        // Soonest upcoming first.
        selected = upcoming.sort((a, b) => new Date(a.dataISO || 0) - new Date(b.dataISO || 0));
      }

      if (selected.length === 0) {
        list.innerHTML = '';
        if (empty) empty.style.display = '';
      } else {
        if (empty) empty.style.display = 'none';
        list.innerHTML = selected.map((d, i) => cardHtml(d, i, pick)).join('');
      }

      if (window.lucide) lucide.createIcons();
      if (window.__reobserveReveal) window.__reobserveReveal(list);
    }).catch(err => {
      console.error('Falha ao carregar divulgações', err);
      if (empty) empty.style.display = '';
    });
  };
})();
