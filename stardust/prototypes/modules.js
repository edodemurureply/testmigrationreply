
/* === module: hub-widgets (owner: en-iot) ===
   Behaviour for the hub modules, as observed on the live page (motion/en-iot.json):
   - card carousels: prev/next slide the track (transform 1s ease-in-out), --slide counter, disabled ends,
     .active on the current item, .all-displayed when every item fits (arrows hidden);
   - ROSE card slider: same, cards scrolled out of view get .out (opacity 0, .5s);
   - cards wall: masonry row spans (grid-row-end: span N, 5px row gap) measured per width — the captured
     1440 spans (data-span) are kept at >=1440; "Load more content" reveals [hidden] cards in batches of 12
     (the static snapshot carries none — index-backed listing is decision D-02);
   - media hero parallax: --ty = scroll progress x k (k fitted to live: 13.23 % >=768, 15.39 % <768),
     applied as translateY(calc(var(--ty) * -.85)).
   Width thresholds follow the source breakpoints (768 / 1112 / 1440). */
(() => {
  const px = (v) => parseFloat(v) || 0;

  /* ---------- card carousels ---------- */
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.card-carousel__track');
    const viewport = root.querySelector('.card-carousel__viewport');
    const items = [...track.children];
    const prev = root.querySelector('.card-carousel__prev');
    const next = root.querySelector('.card-carousel__next');
    const keywords = root.classList.contains('card-carousel--keywords');
    let index = 0;

    const step = () => {
      if (items.length < 2) return 0;
      return items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
    };
    const maxIndex = () => {
      if (!keywords) return items.length - 1;
      // keyword rail: stop once the last link is fully in view
      const vw = viewport.getBoundingClientRect().width;
      const first = items[0].offsetLeft;
      for (let i = 0; i < items.length; i += 1) {
        const last = items[items.length - 1];
        if (last.offsetLeft + last.offsetWidth - items[i].offsetLeft + first <= vw) return i;
      }
      return items.length - 1;
    };
    const fits = () => {
      const gap = px(getComputedStyle(track).columnGap);
      const total = items.reduce((s, it) => s + it.getBoundingClientRect().width, 0) + gap * (items.length - 1);
      return total <= track.parentElement.getBoundingClientRect().width + 0.5;
    };
    const render = (animate = true) => {
      if (root.classList.contains('card-carousel--info')) root.classList.toggle('all-displayed', fits());
      const max = maxIndex();
      index = Math.max(0, Math.min(index, max));
      let offset = 0;
      if (keywords) offset = items[index].offsetLeft - items[0].offsetLeft;
      else offset = index * step();
      track.style.transition = animate ? '' : 'none';
      track.style.transform = index ? `translateX(${-offset}px)` : '';
      root.style.setProperty('--slide', String(index + 1));
      items.forEach((it, i) => it.classList.toggle('active', i === index));
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= max;
    };
    prev?.addEventListener('click', () => { index -= 1; render(); });
    next?.addEventListener('click', () => { index += 1; render(); });
    window.addEventListener('resize', () => render(false));
    render(false);
  });

  /* ---------- ROSE banner card slider ---------- */
  document.querySelectorAll('[data-rose-banner]').forEach((root) => {
    const track = root.querySelector('.rose-banner__track');
    const items = [...track.children];
    const prev = root.querySelector('.rose-banner__prev');
    const next = root.querySelector('.rose-banner__next');
    const slider = root.querySelector('.rose-banner__slider');
    let index = 0;
    const perView = () => {
      const w = items[0].getBoundingClientRect().width;
      return Math.max(1, Math.round((slider.getBoundingClientRect().width + px(getComputedStyle(track).columnGap)) / (w + px(getComputedStyle(track).columnGap))));
    };
    const render = (animate = true) => {
      const pv = perView();
      const max = Math.max(0, items.length - pv);
      index = Math.max(0, Math.min(index, max));
      const stepW = items.length > 1 ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
      track.style.transition = animate ? '' : 'none';
      track.style.transform = index ? `translateX(${-index * stepW}px)` : '';
      items.forEach((it, i) => {
        it.classList.toggle('active', i === index);
        it.classList.toggle('out', index > 0 && (i < index || i >= index + pv));
      });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= max;
    };
    prev?.addEventListener('click', () => { index -= 1; render(); });
    next?.addEventListener('click', () => { index += 1; render(); });
    window.addEventListener('resize', () => render(false));
    render(false);
  });

  /* ---------- cards wall: masonry spans + load more ---------- */
  document.querySelectorAll('[data-cards-wall]').forEach((wall) => {
    const grid = wall.querySelector('.cards-wall__grid');
    const more = wall.querySelector('.cards-wall__more');
    const layout = () => {
      const w = window.innerWidth;
      grid.querySelectorAll('.cards-wall__item').forEach((item) => {
        if (w < 768) { item.style.gridRowEnd = ''; return; }
        if (w >= 1440 && item.dataset.span) { item.style.gridRowEnd = `span ${item.dataset.span}`; return; }
        const card = item.firstElementChild;
        const mb = px(getComputedStyle(item).marginBottom);
        item.style.gridRowEnd = `span ${Math.ceil((card.getBoundingClientRect().height + mb) / 5) + 1}`;
      });
    };
    more?.addEventListener('click', () => {
      const hidden = [...grid.querySelectorAll('.cards-wall__item[hidden]')].slice(0, 12);
      hidden.forEach((it) => { it.hidden = false; });
      if (!grid.querySelector('.cards-wall__item[hidden]') && hidden.length) more.parentElement.hidden = true;
      layout();
    });
    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);
    layout();
  });

  /* ---------- media hero parallax ---------- */
  const heroes = [...document.querySelectorAll('[data-parallax-hero]')];
  if (heroes.length) {
    const update = () => {
      const vh = window.innerHeight;
      heroes.forEach((h) => {
        const r = h.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        // factor fitted to the live transform at scroll 0 (measure.mjs: -45.42px @1440, -46.14px @360, vh 900)
        const k = window.innerWidth < 768 ? 15.39 : 13.23;
        h.style.setProperty('--ty', `${(p * k).toFixed(4)}%`);
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
/* === /module: hub-widgets === */

/* === module: index-widgets (owner: index) ===
   Behaviour for the home modules, as observed on the live page (motion/index.json + captured runtime
   attributes): infinite card carousels (cardcarousel-runtime / collection-slider-runtime data-infinite):
   prev/next slide one card (transform 1s ease-in-out), the scale type re-centres and scales the active
   card (.3s, .5s delay); loop clones are generated here (aria-hidden + inert, never in the HTML) — front
   ceil(perView/2) / back +1 for --scale, 1 / ceil(viewport/step) for --simple, as the live DOM carries
   them. Autoplay (live data-carousel-autoplay, 5000 ms, pause on hover) runs when the root carries
   data-autoplay="<ms>" and the user has no reduced-motion preference; the prototype carries
   data-autoplay-live instead (capture-state freeze, restoreAtDelivery: autoplay 5 s). DAM video play/pause discs toggle their state; wall play buttons open the DAM
   player in a modal dialog. Width thresholds: 768 / 1024 / 1440. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const px = (v) => parseFloat(v) || 0;

  document.querySelectorAll('[data-loop-carousel]').forEach((root) => {
    const kind = root.dataset.loopCarousel;
    const track = root.querySelector('.card-carousel__track');
    const viewport = root.querySelector('.card-carousel__viewport');
    const real = [...track.children];
    const n = real.length;
    const loop = kind !== 'statements';
    let index = Math.min(n - 1, Math.max(0, parseInt(root.dataset.start, 10) || 0));
    let front = 0;
    let built = '';
    let busy = false;

    const gap = () => px(getComputedStyle(track).columnGap);
    const build = () => {
      if (!loop) return;
      const w = real[0].getBoundingClientRect().width;
      const step = w + gap();
      const avail = viewport.clientWidth - px(getComputedStyle(viewport).paddingLeft) - px(getComputedStyle(viewport).paddingRight);
      let back;
      if (kind === 'scale') {
        const perView = Math.max(1, Math.round((avail + gap()) / step));
        front = Math.ceil(perView / 2);
        back = front + 1;
      } else {
        front = 1;
        back = Math.max(1, Math.ceil(avail / step));
      }
      const key = `${front}/${back}`;
      if (key === built) return;
      built = key;
      track.querySelectorAll('.is-clone').forEach((c) => c.remove());
      const mk = (src) => {
        const c = src.cloneNode(true);
        c.classList.add('is-clone');
        c.setAttribute('aria-hidden', 'true');
        c.inert = true;
        c.querySelectorAll('a,button').forEach((a) => a.setAttribute('tabindex', '-1'));
        return c;
      };
      for (let i = 1; i <= front; i += 1) track.insertBefore(mk(real[((n - i) % n + n) % n]), track.firstChild);
      for (let i = 0; i < back; i += 1) track.appendChild(mk(real[i % n]));
    };
    const all = () => [...track.children];
    const render = (animate) => {
      root.classList.toggle('is-jumping', !animate);
      const items = all();
      const pos = (loop ? front : 0) + index;
      const target = items[pos];
      const first = items[0];
      let offset = -(target.offsetLeft - first.offsetLeft);
      if (kind === 'scale') offset += (track.clientWidth - target.offsetWidth) / 2;
      track.style.setProperty('--offset', `${offset}px`);
      root.style.setProperty('--slide', String(pos + (kind === 'scale' ? 1 : 0)));
      items.forEach((it, i) => it.classList.toggle('is-active', i === pos));
      if (!animate) { void track.offsetWidth; requestAnimationFrame(() => root.classList.remove('is-jumping')); }
    };
    const go = (delta) => {
      if (busy && loop) return;
      index += delta;
      if (!loop) { index = (index + n) % n; render(true); return; }
      busy = true;
      render(true);
      const settle = () => {
        busy = false;
        if (index < 0 || index >= n) { index = (index + n) % n; render(false); }
      };
      const done = (ev) => { if (ev.target !== track || ev.propertyName !== 'transform') return; track.removeEventListener('transitionend', done); settle(); };
      track.addEventListener('transitionend', done);
      setTimeout(() => { track.removeEventListener('transitionend', done); if (busy) settle(); }, 1100);
    };
    root.querySelector('.card-carousel__prev')?.addEventListener('click', () => go(-1));
    root.querySelector('.card-carousel__next')?.addEventListener('click', () => go(1));

    const ms = parseInt(root.dataset.autoplay, 10);
    if (ms > 0) {
      let hover = false;
      root.addEventListener('mouseenter', () => { hover = true; });
      root.addEventListener('mouseleave', () => { hover = false; });
      setInterval(() => { if (!reduce.matches && !hover && !document.hidden) go(1); }, ms);
    }
    const layout = () => { build(); render(false); };
    window.addEventListener('resize', layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    layout();
  });

  /* card-hero image parallax (parallax-media-runtime .card-parallax): --ty stays 0 % until the card's top
     passes the middle of the viewport, then grows 7.5 % per half-viewport of travel
     (translateY(calc(var(--ty) * -.85))) — fitted to the live capture at 1440x900 (two banners, ±0.1 %). */
  const cards = [...document.querySelectorAll('[data-parallax-card]')];
  if (cards.length) {
    const update = () => {
      const half = window.innerHeight / 2;
      cards.forEach((c) => {
        const top = c.getBoundingClientRect().top;
        c.style.setProperty('--ty', `${Math.max(0, 7.5 * (1 - top / half)).toFixed(4)}%`);
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* DAM player play/pause disc (visual state; the cross-origin player is driven by its own widget) */
  document.querySelectorAll('[data-media-toggle]').forEach((b) => {
    b.addEventListener('click', (ev) => {
      ev.preventDefault();
      const paused = b.dataset.state === 'paused';
      b.dataset.state = paused ? 'playing' : 'paused';
      b.setAttribute('aria-label', paused ? 'Pause video' : 'Play video');
    });
  });

  /* wall play buttons -> modal DAM player */
  const plays = document.querySelectorAll('.reply-card-play[data-video-src]');
  if (plays.length) {
    const dlg = document.createElement('dialog');
    dlg.className = 'video-modal';
    dlg.innerHTML = '<div class="video-modal__frame"></div><button type="button" class="round-bt round-bt--filled-on-dark video-modal__close" aria-label="Close"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 11.1781L4.22539 16.9528L3.04688 15.7743L8.82161 9.99958L3.04705 4.22502L4.22556 3.04651L10.0001 8.82106L15.7748 3.04639L16.9533 4.2249L11.1786 9.99958L16.9535 15.7744L15.775 16.9529L10.0001 11.1781Z"/></svg></button>';
    document.body.appendChild(dlg);
    const frame = dlg.querySelector('.video-modal__frame');
    const close = () => { dlg.close(); frame.textContent = ''; };
    dlg.querySelector('.video-modal__close').addEventListener('click', close);
    dlg.addEventListener('cancel', () => { frame.textContent = ''; });
    plays.forEach((b) => b.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = b.dataset.videoSrc;
      f.title = b.dataset.videoTitle || '';
      f.allow = 'autoplay; fullscreen';
      f.allowFullscreen = true;
      f.referrerPolicy = 'no-referrer-when-downgrade';
      frame.appendChild(f);
      dlg.showModal();
      b.setAttribute('aria-expanded', 'true');
      dlg.addEventListener('close', () => b.setAttribute('aria-expanded', 'false'), { once: true });
    }));
  }
})();
/* === /module: index-widgets === */
