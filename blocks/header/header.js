import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Reply header (canon custom-menu-runtime) + 4brands minisite variant (body.brand-4b).
 * Decode: template-slotted chrome bar (logo, language strip, tools, burger, collapse button);
 * reconstructive mega-menu panels (top-level list -> columns -> links; highlight slides from
 * the per-panel sections headed by the item label). Authored anchors, pictures and labels are
 * MOVED into the template; only UI glyphs and the desktop language codes are synthesized.
 * Behaviour per stardust/prototypes/canon.js: click-to-open panels (one at a time >= 1024),
 * body scroll lock, outside-click close, Escape, mobile drill-down drawer, scroll collapse.
 */

const DESKTOP = window.matchMedia('(width >= 1024px)');
const COLLAPSE_AT = 160;

/* eslint-disable max-len */
const SVG = {
  chevDown: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8.07396 8.70735L4.77397 5.40735L3.8313 6.35002L8.07396 10.5927L12.3166 6.35002L11.374 5.40735L8.07396 8.70735Z" fill="white"/></svg>',
  chev: '<svg class="primary-nav-chev" viewBox="0 0 24 25" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M13.17 12.5 8.22 7.55l1.42-1.41L16 12.5l-6.36 6.36-1.42-1.41 4.95-4.95Z"/></svg>',
  chevWhite: '<svg viewBox="0 0 24 25" height="24" width="24" aria-hidden="true"><path fill="#ffffff" d="M13.17 12.5 8.22 7.55l1.42-1.41L16 12.5l-6.36 6.36-1.42-1.41 4.95-4.95Z"/></svg>',
  back: (fill) => `<svg viewBox="0 0 24 25" width="24" height="24" aria-hidden="true"><path fill="${fill}" d="M11.05 12.5 16 7.55l-1.41-1.41-6.37 6.36 6.37 6.36L16 17.45l-4.95-4.95Z"/></svg>`,
  prev: '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true"><path d="M3.05 7.00072L8 2.05072L6.586 0.636719L0.221999 7.00072L6.586 13.3647L8 11.9507L3.05 7.00072Z" fill="white"/></svg>',
  next: '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true"><path d="M5.17168 7.00072L0.22168 2.05072L1.63568 0.636719L7.99968 7.00072L1.63568 13.3647L0.22168 11.9507L5.17168 7.00072Z" fill="white"/></svg>',
  arrow: '<svg class="mega-menu-arrow" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#151F27" d="M20.6 12.15 15.65 7.2l-1.41 1.41 2.53 2.54H3.6v2h13.17l-2.530 2.540 1.410 1.410 4.950-4.950Z"/></svg>',
  globe: '<svg viewBox="0 0 20 20" height="20" width="20" aria-hidden="true"><path fill="#ffffff" d="M5.2 5.38a6.670 6.670 0 0 0 7.34 10.78c.1-.62-.11-1.22-.2-1.43-.19-.47-.82-1.270-1.870-2.370-.29-.3-.27-.52-.17-1.200l.01-.07c.07-.47.19-.74 1.740-.99.8-.12 1 .2 1.290.63l.1.14c.27.4.47.5.78.64.13.06.3.14.53.27.55.3.55.66.55 1.430v.08c0 .33-.04.62-.09.87a6.670 6.670 0 0 0-2.580-10.290c-.46.31-1.100.75-1.320 1.060-.11.15-.27.94-.79 1-.13.02-.32 0-.51 0-.52-.04-1.230-.08-1.450.53-.15.4-.17 1.450.3 2 .07.09.08.25.03.44a.85.85 0 0 1-.24.41c-.08-.05-.24-.23-.35-.36-.26-.3-.59-.68-1.010-.8l-.49-.11c-.45-.1-.97-.2-1.100-.46-.08-.2-.08-.45-.08-.72 0-.35 0-.74-.17-1.120a1.060 1.060 0 0 0-.25-.36ZM10 18.330a8.330 8.330 0 1 1 0-16.660 8.330 8.330 0 0 1 0 16.660Z"/></svg>',
  search: '<svg viewBox="0 0 18 18" aria-hidden="true"><path fill="#151F27" d="m14.03 12.85 3.56 3.57-1.17 1.17-3.57-3.56a7.5 7.5 0 1 1 1.18-1.18Zm-1.68-.62a5.83 5.830 0 1 0-.13.13l.13-.13Z"/></svg>',
  searchSubmit: '<svg viewBox="0 0 18 18" width="24" height="24" aria-hidden="true"><path fill="#151F27" d="m14.03 12.85 3.56 3.57-1.17 1.17-3.57-3.56a7.5 7.5 0 1 1 1.18-1.18Zm-1.68-.62a5.83 5.830 0 1 0-.13.13l.13-.13Z"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path fill="#151F27" fill-rule="evenodd" d="m12 13.41-6.93 6.93-1.41-1.41L10.59 12 3.66 5.07l1.41-1.41L12 10.590l6.930-6.930 1.410 1.410L13.410 12l6.930 6.930-1.410 1.410L12 13.410Z" clip-rule="evenodd"/></svg>',
  burger: '<svg width="15" height="14" viewBox="0 0 15 14" aria-hidden="true"><path class="menu-hamburger" fill="#151F27" d="M0 0H15V1.66998H0V0ZM0 5.84H15V7.5H0V5.84ZM0 11.67H15V13.34H0V11.67Z"/><path class="menu-close" fill="#151F27" d="M1.60999 11.38L12.21 0.780029L13.39 1.95001L2.78998 12.56L1.60999 11.38ZM2.78998 0.780029L13.39 11.38L12.21 12.56L1.60999 1.95001L2.78998 0.780029Z"/></svg>',
  ellipsis: '<svg width="18" height="14" viewBox="0 0 18 14"><path class="ellipsis" fill="#ffffff" d="M2 5C0.9 5 0 5.9 0 7C0 8.1 0.9 9 2 9C3.1 9 4 8.1 4 7C4 5.9 3.1 5 2 5ZM16 5C14.9 5 14 5.9 14 7C14 8.1 14.9 9 16 9C17.1 9 18 8.1 18 7C18 5.9 17.1 5 16 5ZM9 5C7.9 5 7 5.9 7 7C7 8.1 7.9 9 9 9C10.1 9 11 8.1 11 7C11 5.9 10.1 5 9 5Z"/><path class="close" fill="#ffffff" d="M9.00023 5.58611L13.9502 0.636108L15.3642 2.05011L10.4142 7.00011L15.3642 11.9501L13.9502 13.3641L9.00023 8.41411L4.05023 13.3641L2.63623 11.9501L7.58623 7.00011L2.63623 2.05011L4.05023 0.636108L9.00023 5.58611Z"/></svg>',
};
/* eslint-enable max-len */

/* layout presets lifted from the canon mega menus (inline --lg/--xl grid placement) */
const HL_1 = { lg: '8 / span 5', xl: '8 / span 4' };
const HL_1_ROWS = { ...HL_1, lgRow: 'span 2', xlRow: 'span 2' };

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  children.flat().forEach((c) => c && node.append(c));
  return node;
}

function chromePath(kind) {
  const meta = getMetadata(kind);
  if (meta) return new URL(meta, window.location).pathname;
  const m = window.location.pathname.match(/^\/4brands-reply\/(en|de)(\/|$)/);
  return m ? `/4brands-reply/${m[1]}/${kind}` : `/${kind}`;
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanLink(a) {
  a.removeAttribute('title');
  a.className = '';
  try {
    const url = new URL(a.href, window.location);
    if (url.origin !== window.location.origin && !a.getAttribute('href').startsWith('/')) {
      a.target = '_blank';
      a.rel = 'noreferrer';
    }
  } catch { /* keep as is */ }
  return a;
}

function wrapText(a, cls) {
  const span = el('span', { class: cls || undefined });
  while (a.firstChild) span.append(a.firstChild);
  a.append(span);
  return span;
}

function samePage(a) {
  try {
    const url = new URL(a.href, window.location);
    return url.origin === window.location.origin
      && url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
  } catch {
    return false;
  }
}

/* direct-child text label of an authored <li> (delivered as <li><p>Label</p><ul>, or bare text) */
function itemLabel(li) {
  const p = li.querySelector(':scope > p');
  if (p) return p;
  const text = [...li.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent).join('').trim();
  return text ? el('span', {}, text) : null;
}

function collectColumns(li) {
  const list = li.querySelector(':scope > ul');
  if (!list) return [];
  return [...list.children].map((col) => {
    const links = [...col.querySelectorAll('a[href]')];
    return links.map((a) => ({ a, second: Boolean(a.closest('strong')) || a.classList.contains('primary') }));
  });
}

function placeVars(node, p) {
  if (p.lg) node.style.setProperty('--lg-col', p.lg);
  if (p.xl) node.style.setProperty('--xl-col', p.xl);
  if (p.lgRow) node.style.setProperty('--lg-row', p.lgRow);
  if (p.xlRow) node.style.setProperty('--xl-row', p.xlRow);
}

/* the canon panel layouts, chosen from the panel's shape */
function panelLayout(cols) {
  const n = cols.length;
  if (n === 1 && cols[0].length > 12) {
    return {
      rows: false, cols: [{ lg: 'auto / span 6', xl: '2 / span 6', multi: true }], hl: HL_1, ratio: '1-1',
    };
  }
  if (n === 1) {
    return {
      rows: false,
      cols: [{ lg: 'auto / span 4', xl: '2 / span 3' }],
      hl: { lg: 'auto / span 8', xl: 'auto / span 7' },
      ratio: '16-9',
    };
  }
  if (n === 2 && cols[0].every((i) => i.second)) {
    return {
      rows: true,
      cols: [
        {
          lg: 'auto / span 3', lgRow: '2', xl: 'auto / span 3', xlRow: '2',
        },
        {
          lg: 'auto / span 3', lgRow: '2', xl: '2 / span 3', xlRow: '2',
        },
      ],
      hl: HL_1_ROWS,
      ratio: '1-1',
    };
  }
  if (n === 2) {
    return {
      rows: false,
      cols: [{ lg: 'auto / span 3', xl: '2 / span 3' }, { lg: 'auto / span 3', xl: '5 / span 3' }],
      hl: HL_1,
      ratio: '1-1',
    };
  }
  const rest = cols.slice(1).map((c, k) => ({
    lg: 'auto / span 2', lgRow: '2', xl: `${2 + 2 * k} / span 2`, xlRow: '2',
  }));
  const first = cols[0].length === 1
    ? { lg: 'auto / span 6', xl: '2 / span 5', double: true }
    : { lg: 'auto / span 2', xl: '2 / span 2' };
  return {
    rows: true, cols: [first, ...rest], hl: HL_1_ROWS, ratio: '1-1',
  };
}

function buildHighlight(slides, layout) {
  const box = el('li', {
    class: `mega-menu-highlight mega-menu-highlight-${layout.ratio}`,
    'aria-label': 'Highlighted items',
  });
  placeVars(box, layout.hl);
  const slideEls = slides.map((s, i) => {
    const info = s.a;
    cleanLink(info);
    wrapText(info, 'highlight-title');
    info.className = 'highlight-info';
    info.append(' ');
    if (s.cta) {
      const cta = el('span', { class: 'highlight-cta' });
      while (s.cta.firstChild) cta.append(s.cta.firstChild);
      info.append(cta);
    }
    const img = s.picture ? s.picture.querySelector('img') : null;
    if (img) img.loading = 'lazy';
    return el('div', { class: `highlight${i === 0 ? ' is-active' : ''}` }, s.picture, info);
  });
  const controls = el(
    'div',
    { class: 'highlight-controls' },
    el('button', { class: 'highlight-nav highlight-nav-prev', 'aria-label': 'Previous slide', html: SVG.prev }),
    el('button', { class: 'highlight-nav highlight-nav-next', 'aria-label': 'Next slide', html: SVG.next }),
  );
  const dots = el('ol', { class: 'highlight-dots' }, slideEls.map((_, i) => el('li', { class: i === 0 ? 'is-active' : '' })));
  box.append(...slideEls, controls, dots);
  let index = 0;
  const go = (n) => {
    index = (n + slideEls.length) % slideEls.length;
    slideEls.forEach((s, k) => s.classList.toggle('is-active', k === index));
    [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === index));
  };
  controls.children[0].addEventListener('click', (e) => {
    e.stopPropagation();
    go(index - 1);
  });
  controls.children[1].addEventListener('click', (e) => {
    e.stopPropagation();
    go(index + 1);
  });
  return box;
}

function buildMegaPanel(cols, slides) {
  const layout = panelLayout(cols);
  /* source grids: gap-x-10 for the one-column panels, gap-x-8 for the multi-column ones */
  const tight = cols.length > 1 ? ' mega-menu-grid-tight' : '';
  const grid = el('menu', { class: `mega-menu-grid${layout.rows ? ' mega-menu-grid-rows' : ''}${tight}` });
  cols.forEach((items, i) => {
    const p = layout.cols[i] || {};
    let cls = 'mega-menu-col';
    if (p.multi) cls += ' mega-menu-col-multi';
    if (p.double) cls += ' mega-menu-col-double';
    const col = el('li', { class: cls });
    placeVars(col, p);
    const links = el('menu', { class: 'mega-menu-links' });
    /* thirds nest under the preceding second (source: li.second-level > menu > li.third-level) */
    let sub = null;
    items.forEach(({ a, second }) => {
      cleanLink(a);
      wrapText(a, '');
      if (second) a.insertAdjacentHTML('beforeend', SVG.arrow);
      const li = el('li', { class: `mega-menu-item mega-menu-item-${second ? 'second' : 'third'}` }, a);
      if (second) {
        sub = null;
        links.append(li);
      } else if (links.lastElementChild?.classList.contains('mega-menu-item-second')) {
        if (!sub) {
          sub = el('menu', { class: 'mega-menu-sublinks' });
          links.lastElementChild.append(sub);
        }
        sub.append(li);
      } else {
        links.append(li);
      }
    });
    col.append(links);
    grid.append(col);
  });
  if (slides && slides.length) grid.append(buildHighlight(slides, layout));
  return el('div', { class: 'mega-menu-panel' }, el('div', { class: 'mega-menu-inner' }, grid));
}

function buildMiniPanel(cols) {
  const list = el('menu', { class: 'mini-menu-list' });
  cols.flat().forEach(({ a }) => {
    cleanLink(a);
    if (samePage(a)) a.classList.add('is-active');
    wrapText(a, 'paragraph-02-light');
    list.append(el('li', { class: 'mini-menu-item' }, a));
  });
  return el('div', { class: 'mega-menu-panel' }, el('div', { class: 'mini-menu-inner' }, list));
}

/* highlight slides: sections headed by an h2 that repeats the top-level label */
function collectSlides(sections) {
  const byLabel = {};
  sections.forEach((section) => {
    const h = section.querySelector('h2');
    if (!h) return;
    const slides = [];
    let current = null;
    section.querySelectorAll('p').forEach((p) => {
      const pic = p.querySelector('picture');
      const a = p.querySelector('a[href]');
      if (pic) {
        current = { picture: pic };
        slides.push(current);
      } else if (a && current && !current.a) {
        current.a = a;
      } else if (current && current.a && !current.cta) {
        current.cta = p;
      }
    });
    byLabel[h.textContent.trim()] = slides.filter((s) => s.a);
  });
  return byLabel;
}

function buildLanguages(list) {
  const links = list ? [...list.querySelectorAll('a[href]')] : [];
  const { pathname } = window.location;
  const entries = links.map((a) => {
    const href = a.getAttribute('href').replace(/\/$/, '');
    const segs = href.split('/');
    const code = segs.pop();
    return {
      a, code, prefix: segs.join('/'), name: a.textContent.trim(),
    };
  });
  const codes = entries.map((e) => e.code);
  const current = entries.find((e) => {
    const re = new RegExp(`^${e.prefix}/${e.code}(/|$)`);
    return re.test(pathname);
  }) || entries.find((e) => e.code === document.documentElement.lang) || entries[0];
  entries.forEach((e) => {
    const re = new RegExp(`^${e.prefix}/(${codes.join('|')})(/.*)?$`);
    const m = pathname.match(re);
    e.href = m ? `${e.prefix}/${e.code}${m[2] || ''}` : e.a.getAttribute('href');
  });
  return { entries, current };
}

function setOpen(btn, panel, open) {
  btn.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('show', open);
  panel.setAttribute('aria-hidden', String(!open));
}

function wireBehaviour(bar) {
  const closeAll = (except) => {
    bar.querySelectorAll('[aria-expanded="true"][aria-controls]').forEach((b) => {
      if (b === except || b.id === 'mobile-menu-toggle') return;
      const p = document.getElementById(b.getAttribute('aria-controls'));
      if (p) setOpen(b, p, false);
    });
  };
  const syncLock = () => {
    const anyMega = bar.querySelector('.mega-menu.show') && DESKTOP.matches;
    const mobileOpen = bar.querySelector('#menu-first-level')?.classList.contains('show');
    document.body.classList.toggle('overflow-hidden', Boolean(anyMega || mobileOpen));
  };

  bar.querySelectorAll('button[aria-controls]').forEach((btn) => {
    if (btn.id === 'mobile-menu-toggle') return;
    const panel = bar.querySelector(`#${btn.getAttribute('aria-controls')}`);
    if (!panel) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.classList.contains('mega-menu-back')) {
        const opener = bar.querySelector(`[aria-controls="${panel.id}"][aria-expanded]`);
        setOpen(opener || btn, panel, false);
        syncLock();
        return;
      }
      const open = btn.getAttribute('aria-expanded') !== 'true';
      if (DESKTOP.matches) closeAll(btn);
      setOpen(btn, panel, open);
      syncLock();
      if (open && btn.id === 'search-toggle') panel.querySelector('input')?.focus();
    });
  });

  const burger = bar.querySelector('#mobile-menu-toggle');
  const drawer = bar.querySelector('#menu-first-level');
  burger?.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('show', open);
    if (!open) closeAll();
    syncLock();
  });

  /* outside click: every panel >= 1024; below it only the search panel (the drawer stays) */
  const outside = () => {
    if (DESKTOP.matches) closeAll();
    else {
      const search = bar.querySelector('#search-toggle[aria-expanded="true"]');
      const panel = search && bar.querySelector('#search-dropdown');
      if (panel) setOpen(search, panel, false);
    }
    syncLock();
  };
  document.addEventListener('click', (e) => {
    if (!bar.contains(e.target)) outside();
  });
  /* a click into an embedded frame never reaches this document: the window blurs instead */
  window.addEventListener('blur', () => {
    if (document.activeElement?.tagName === 'IFRAME') outside();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = bar.querySelector('[aria-expanded="true"][aria-controls]:not(#mobile-menu-toggle)');
    closeAll();
    syncLock();
    open?.focus();
  });

  DESKTOP.addEventListener('change', () => {
    closeAll();
    burger?.setAttribute('aria-expanded', 'false');
    drawer?.classList.remove('show');
    syncLock();
  });

  const collapseBtn = bar.querySelector('.sm-collapsed');
  const onScroll = () => {
    const collapsed = DESKTOP.matches && window.scrollY > COLLAPSE_AT;
    bar.classList.toggle('collapsed', collapsed);
    if (!collapsed) bar.classList.remove('opened');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  collapseBtn?.addEventListener('click', () => bar.classList.toggle('opened'));
  onScroll();
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await loadFragment(chromePath('nav'));
  block.textContent = '';
  if (!fragment) return;
  const brand = document.body.classList.contains('brand-4b');
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSec, navSec, toolsSec, ...extra] = sections;
  const slidesByLabel = collectSlides(extra);

  /* language strip + mobile language drill-down */
  const { entries, current } = buildLanguages(toolsSec?.querySelector('ul'));
  const langMenu = el('menu', { role: 'menu' }, entries.map((e) => el(
    'li',
    { role: 'none', class: e === current ? 'footer-text-medium current' : 'footer-text-light' },
    el('a', { role: 'menuitem', href: e.href }, e.code.toUpperCase()),
  )));
  const top = el(
    'nav',
    { class: 'site-header-top', 'aria-label': 'Language selector' },
    el(
      'div',
      { class: 'lang-selector', role: 'menu' },
      el(
        'button',
        {
          class: 'lang-selector-toggle footer-text-light',
          'aria-expanded': 'false',
          'aria-haspopup': 'true',
          'aria-controls': 'language-dropdown',
        },
        el('span', { class: 'lang-selector-code' }, (current?.code || 'en').toUpperCase()),
        el('span', { class: 'lang-selector-chev', html: SVG.chevDown }),
      ),
      el('div', { class: 'lang-selector-dropdown', id: 'language-dropdown', 'aria-hidden': 'true' }, langMenu),
    ),
  );

  const mobileLangMenu = el('menu', { role: 'menu' }, entries.map((e) => {
    cleanLink(e.a);
    e.a.setAttribute('href', e.href);
    e.a.setAttribute('role', 'menuitem');
    e.a.className = `paragraph-02-light${e === current ? ' selected' : ''}`;
    return el('li', { role: 'none' }, e.a);
  }));
  const mobileToggle = el(
    'button',
    {
      class: 'mobile-lang-toggle',
      'aria-expanded': 'false',
      'aria-haspopup': 'true',
      'aria-controls': 'language-dropdown-mobile',
    },
    el(
      'span',
      { html: SVG.globe },
      el('span', { class: 'paragraph-01-light' }, current ? current.name : ''),
    ),
  );
  mobileToggle.insertAdjacentHTML('beforeend', SVG.chevWhite);
  const mobileLang = el(
    'li',
    { class: 'primary-nav-service' },
    el(
      'nav',
      { class: 'mobile-lang', 'aria-label': 'Language selector' },
      mobileToggle,
      el(
        'div',
        { class: 'mobile-lang-dropdown', id: 'language-dropdown-mobile', 'aria-hidden': 'true' },
        el(
          'button',
          {
            class: 'mega-menu-back',
            'aria-controls': 'language-dropdown-mobile',
            'aria-label': 'Close language selector',
            html: SVG.back('#151F27'),
          },
          el('span', {}, 'Languages'),
        ),
        mobileLangMenu,
      ),
    ),
  );

  /* logo */
  const logoLink = brandSec?.querySelector('a[href]') || el('a', { href: '/' });
  cleanLink(logoLink);
  logoLink.setAttribute('aria-label', 'Go to homepage');
  logoLink.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
    img.alt = brand ? 'Logo' : 'Reply Logo';
    img.removeAttribute('width');
    img.removeAttribute('height');
  });
  const logo = el('div', { class: `site-header-logo${brand ? ' site-header-logo-img' : ''}` }, logoLink);

  /* first level */
  const navList = el('menu', { id: 'nav-container', class: 'primary-nav-list', role: 'none' });
  const topItems = navSec ? [...(navSec.querySelector('ul')?.children || [])] : [];
  topItems.forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    if (!sub) {
      const a = li.querySelector('a[href]');
      if (!a) return;
      cleanLink(a);
      a.className = 'primary-nav-link';
      if (brand && samePage(a)) a.classList.add('is-active');
      wrapText(a, '');
      navList.append(el('li', { class: 'primary-nav-item' }, a));
      return;
    }
    const labelNode = itemLabel(li);
    const label = labelNode ? labelNode.textContent.trim() : '';
    const id = slug(label) || `item-${navList.children.length}`;
    const panelId = `dropdown-menu-${id}`;
    const cols = collectColumns(li);
    const trigger = el('button', {
      class: 'primary-nav-link',
      id,
      'aria-expanded': 'false',
      'aria-haspopup': 'true',
      'aria-controls': panelId,
    });
    const span = el('span');
    if (labelNode) while (labelNode.firstChild) span.append(labelNode.firstChild);
    trigger.append(span);
    trigger.insertAdjacentHTML('beforeend', SVG.chev);
    if (brand && cols.flat().some(({ a }) => samePage(a))) trigger.classList.add('is-active');
    const back = el(
      'button',
      {
        class: 'mega-menu-back',
        'aria-controls': panelId,
        'aria-label': `Close ${label}`,
        html: SVG.back('#ffffff'),
      },
      el('span', {}, label),
    );
    const panel = brand ? buildMiniPanel(cols) : buildMegaPanel(cols, slidesByLabel[label]);
    const mega = el(
      'div',
      {
        class: `mega-menu${brand ? ' mega-menu-mini' : ''}`,
        id: panelId,
        'aria-hidden': 'true',
        'aria-labelledby': id,
      },
      back,
      panel,
    );
    navList.append(el('li', { class: 'primary-nav-item primary-nav-item-parent' }, trigger, mega));
  });
  navList.append(mobileLang);

  /* search (label = link text, action = link href, placeholder = next paragraph) */
  const searchLink = toolsSec?.querySelector('p a[href]');
  const searchLabel = searchLink ? searchLink.textContent.trim() : '';
  const placeholderP = searchLink?.closest('p')?.nextElementSibling;
  const form = el(
    'form',
    { method: 'get', action: searchLink ? searchLink.getAttribute('href') : '/search' },
    el('label', { for: 'search-input' }, searchLabel),
    el(
      'div',
      { class: 'search-panel-row' },
      el('input', {
        id: 'search-input',
        class: 'h3-light',
        type: 'search',
        autocomplete: 'off',
        name: 'query',
        placeholder: placeholderP ? placeholderP.textContent.trim() : '',
      }),
      el('button', { class: 'search-panel-submit', 'aria-label': 'Search results', html: SVG.searchSubmit }),
    ),
  );
  const searchPanel = el(
    'div',
    {
      class: 'search-panel',
      role: 'search',
      id: 'search-dropdown',
      'aria-labelledby': 'search-toggle',
      'aria-hidden': 'true',
    },
    el(
      'div',
      { class: 'search-panel-inner' },
      el('div', { class: 'search-panel-col' }, form, el('div', { class: 'search-panel-suggestions' })),
    ),
  );
  const searchToggle = el('button', {
    class: 'menu-search-toggle',
    id: 'search-toggle',
    'aria-expanded': 'false',
    'aria-haspopup': 'true',
    'aria-controls': 'search-dropdown',
    'aria-label': 'Toggle search',
    html: `${SVG.search}<span class="menu-search-close"><span class="menu-search-close-sm" aria-hidden="true">${SVG.close}</span><span class="menu-search-close-lg" aria-hidden="true">${SVG.close}</span></span>`,
  });
  const tools = el(
    'menu',
    { class: 'site-header-tools', role: 'none' },
    el('li', { class: 'menu-search' }, searchToggle, searchPanel),
    el(
      'li',
      { class: 'mobile-toggle' },
      el('button', {
        id: 'mobile-menu-toggle',
        'aria-expanded': 'false',
        'aria-haspopup': 'true',
        'aria-controls': 'menu-first-level',
        'aria-label': 'Toggle menu',
        html: SVG.burger,
      }),
    ),
  );

  const main = el(
    'nav',
    { class: 'site-header-main', 'aria-label': 'Main navigation' },
    logo,
    el(
      'div',
      { class: 'site-header-menu' },
      /* source shape: the drawer sits in its own (zero-width) wrapper, apart from the tools */
      el(
        'div',
        { class: 'site-header-nav' },
        el('div', { id: 'menu-first-level', class: 'primary-nav', role: 'menubar' }, navList),
      ),
      tools,
    ),
    el('button', {
      class: 'sm-collapsed',
      'aria-hidden': 'true',
      tabindex: '-1',
      html: SVG.ellipsis,
    }),
  );

  const bar = el('div', { class: 'site-header-bar' }, top, main);
  const root = el('div', {
    id: 'header-content',
    class: `site-header${brand ? ' site-header-brand' : ''}`,
  }, bar);
  block.append(root);
  wireBehaviour(bar);
}
