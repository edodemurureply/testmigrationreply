/* 4brands Reply minisite — brand behaviour (shared by the brand-* archetypes).
   - b4 rails (cardcarousel-runtime "alternative" simple, non-looping): .all-displayed when every item fits
     (track centred, arrows hidden — as the live runtime toggles it), else prev/next slide one item
     (transform 1s ease-in-out, disabled at the ends);
   - sticky highlight: the +/- toggle expands the abstract (aria-expanded, CSS drives the reveal);
   - offices: "View office locations" hides the map and shows the offices list (observed: map-runtime gets .hidden);
   - hero parallax (--ty on [data-b4-parallax]);
   - brand footer: "Privacy and Legal" accordion below 768 (open by default, as captured).
   Width threshold: 768 (source md). */
(() => {
  const px = (v) => parseFloat(v) || 0;

  document.querySelectorAll('[data-b4-rail]').forEach((root) => {
    const track = root.querySelector('.card-carousel__track');
    const items = [...track.children];
    const prev = root.querySelector('.card-carousel__prev');
    const next = root.querySelector('.card-carousel__next');
    let index = 0;
    const fits = () => {
      const gap = px(getComputedStyle(track).columnGap);
      const total = items.reduce((s, it) => s + it.getBoundingClientRect().width, 0) + gap * (items.length - 1);
      return total <= root.getBoundingClientRect().width + 0.5;
    };
    const render = (animate = true) => {
      const all = fits();
      root.classList.toggle('all-displayed', all);
      if (all) index = 0;
      index = Math.max(0, Math.min(index, items.length - 1));
      const step = items.length > 1 ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
      track.style.transition = animate ? '' : 'none';
      track.style.transform = index ? `translateX(${-index * step}px)` : '';
      items.forEach((it, i) => it.classList.toggle('active', i === index));
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= items.length - 1;
    };
    prev?.addEventListener('click', () => { index -= 1; render(); });
    next?.addEventListener('click', () => { index += 1; render(); });
    window.addEventListener('resize', () => render(false));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
    render(false);
  });

  document.querySelectorAll('.sticky-highlight__toggle').forEach((btn) => {
    // below 768 the live runtime renders the sheet with its close glyph (expanded state; the abstract stays hidden <768)
    if (window.matchMedia('(max-width: 767.98px)').matches) btn.setAttribute('aria-expanded', 'true');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
    });
  });

  /* hero parallax (gridcontainer-runtime .parallax-fullw): --ty = scroll progress x k, applied as
     translateY(calc(var(--ty) * -.85)); k fitted to the live transform at scroll 0 with measure.mjs on this
     tree (-46.14px @360 -> 15.39 %, -42.79px @1440 -> 12.46 %; vh 900). */
  const heroes = [...document.querySelectorAll('[data-b4-parallax]')];
  if (heroes.length) {
    const update = () => {
      const vh = window.innerHeight;
      heroes.forEach((h) => {
        const r = h.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        const k = window.innerWidth < 768 ? 15.39 : 12.46;
        h.style.setProperty('--ty', `${(p * k).toFixed(4)}%`);
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* "View office locations" (map-reply-offices-selector-runtime): hides the map (live adds .hidden to map-runtime)
     and reveals the offices list */
  document.querySelectorAll('.b4-map-button').forEach((btn) => {
    const cell = btn.closest('.b4-offices__cell');
    const map = cell && cell.querySelector('.b4-map');
    const panel = cell && cell.querySelector('.b4-offices__panel');
    if (!map || !panel) return;
    btn.addEventListener('click', () => {
      map.classList.add('hidden');
      map.hidden = true;
      panel.hidden = false;
    });
  });

  const small = window.matchMedia('(max-width: 767.98px)');
  document.querySelectorAll('.brand-footer__toggle[aria-controls]').forEach((btn) => {
    const list = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      if (!small.matches) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      list.classList.toggle('show', open);
    });
  });

  /* ADDED with brand-solution: b4-tabber (cards-tabber-runtime) — .all-displayed when every tab card fits
     (row centred, arrows hidden); a tab click / Enter / Space activates its panel; prev/next step the active
     tab and slide the row one card (transform 1s ease-out) when it overflows. */
  document.querySelectorAll('[data-b4-tabber]').forEach((root) => {
    const nav = root.querySelector('.b4-tabber__nav');
    const wrap = root.querySelector('.b4-tabber__nav-wrap');
    const tabs = [...nav.children];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const prev = root.querySelector('.b4-tabber__prev');
    const next = root.querySelector('.b4-tabber__next');
    let index = Math.max(0, tabs.findIndex((t) => t.classList.contains('is-active')));
    const fits = () => {
      root.classList.remove('all-displayed');
      const gap = px(getComputedStyle(nav).columnGap);
      const total = tabs.reduce((s, t) => s + t.getBoundingClientRect().width, 0) + gap * (tabs.length - 1);
      return total <= wrap.getBoundingClientRect().width + 0.5;
    };
    const render = (animate = true) => {
      const all = fits();
      root.classList.toggle('all-displayed', all);
      tabs.forEach((t, i) => {
        const on = i === index;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[i]?.classList.toggle('is-active', on);
      });
      const step = tabs.length > 1 ? tabs[1].getBoundingClientRect().left - tabs[0].getBoundingClientRect().left : 0;
      nav.style.transition = animate ? '' : 'none';
      nav.style.transform = !all && index ? `translateX(${-index * step}px)` : '';
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= tabs.length - 1;
    };
    const select = (i) => {
      if (i === index) return;
      tabs.forEach((t) => t.classList.remove('enter-left', 'enter-right'));
      tabs[i].classList.add(i > index ? 'enter-left' : 'enter-right'); // live: the bar enters from the side it came from
      index = i;
      render();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); }
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          select(Math.max(0, Math.min(tabs.length - 1, index + (e.key === 'ArrowRight' ? 1 : -1))));
          tabs[index].focus();
        }
      });
    });
    prev?.addEventListener('click', () => select(Math.max(0, index - 1)));
    next?.addEventListener('click', () => select(Math.min(tabs.length - 1, index + 1)));
    window.addEventListener('resize', () => render(false));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
    render(false);
  });

  /* ADDED with brand-solution: b4-accordion (accordion-runtime .reply-accordion) — header toggles its item
     (data-item-active -> .is-open: tile widens, plus turns to minus, body opens); items are independent. */
  document.querySelectorAll('[data-b4-accordion] .b4-accordion__header').forEach((btn) => {
    const item = btn.closest('.b4-accordion__item');
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
})();
