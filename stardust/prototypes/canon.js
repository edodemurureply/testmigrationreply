/* reply.com replica — header/footer behaviour only (canon).
   Mirrors the live custom-menu-runtime classes observed by motion-observe:
   .show on dropdowns, .collapsed / .opened on scroll at >=1024,
   body overflow lock while a mega menu is open, footer accordions <768. */
(() => {
  const bar = document.querySelector('.site-header__bar');
  if (!bar) return;
  const desktop = window.matchMedia('(min-width: 1024px)');

  const setOpen = (btn, panel, open) => {
    btn.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('show', open);
    panel.setAttribute('aria-hidden', String(!open));
  };
  const closeAll = (except) => {
    bar.querySelectorAll('[aria-expanded="true"][aria-controls]').forEach((b) => {
      if (b === except || b.id === 'mobile-menu-toggle') return;
      const p = document.getElementById(b.getAttribute('aria-controls'));
      if (p) setOpen(b, p, false);
    });
  };
  const syncLock = () => {
    const anyMega = bar.querySelector('.mega-menu.show') && desktop.matches;
    const mobileOpen = document.getElementById('menu-first-level')?.classList.contains('show');
    document.body.classList.toggle('overflow-hidden', Boolean(anyMega || mobileOpen));
  };

  // dropdown toggles (mega menus, language selectors, search)
  bar.querySelectorAll('button[aria-controls]').forEach((btn) => {
    if (btn.id === 'mobile-menu-toggle') return;
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.classList.contains('mega-menu__back')) {
        const opener = bar.querySelector(`[aria-controls="${panel.id}"][aria-expanded]`);
        setOpen(opener || btn, panel, false);
        syncLock();
        return;
      }
      const open = btn.getAttribute('aria-expanded') !== 'true';
      if (desktop.matches) closeAll(btn);
      setOpen(btn, panel, open);
      syncLock();
    });
  });

  // mobile drawer
  const burger = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('menu-first-level');
  burger?.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('show', open);
    if (!open) closeAll();
    syncLock();
  });

  document.addEventListener('click', (e) => {
    if (!desktop.matches || bar.contains(e.target)) return;
    closeAll();
    syncLock();
  });

  // scroll morph (>=1024): language strip slides away; ellipsis button re-opens it.
  // Threshold: live toggles .collapsed between 153 and 200 px of scroll (motion JSON
  // headerTimeline: mid-transition at y=153, collapsed at y=200) — encoded as 160 px.
  const collapseBtn = bar.querySelector('.sm-collapsed');
  const onScroll = () => {
    const collapsed = desktop.matches && window.scrollY > 160;
    bar.classList.toggle('collapsed', collapsed);
    if (!collapsed) bar.classList.remove('opened');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  collapseBtn?.addEventListener('click', () => bar.classList.toggle('opened'));
  onScroll();

  // highlight sliders inside the mega menus (prev/next cycle the slides)
  bar.querySelectorAll('.mega-menu__highlight').forEach((hl) => {
    const slides = [...hl.querySelectorAll('.highlight:not(.highlight--clone)')];
    const dots = [...hl.querySelectorAll('.highlight__dots li')];
    let i = 0;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    };
    hl.querySelector('.highlight__nav--prev')?.addEventListener('click', (e) => { e.stopPropagation(); go(i - 1); });
    hl.querySelector('.highlight__nav--next')?.addEventListener('click', (e) => { e.stopPropagation(); go(i + 1); });
  });

  // footer accordions (<768; always open on wider screens via CSS)
  document.querySelectorAll('.footer-nav__toggle[aria-controls]').forEach((btn) => {
    const list = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      list.classList.toggle('show', open);
    });
  });
})();
