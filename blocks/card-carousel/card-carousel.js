/**
 * card-carousel — infinite card slider on the shared card-carousel skeleton
 * (cardcarousel-runtime / collection-slider-runtime data-infinite).
 * Reconstructive: one row per card.
 *
 * Authoring rows (one per card): cell 1 picture | cell 2 title heading (h3) with the card link
 * inside, then the category paragraph (e.g. "White Paper"). Cells are classified by content.
 *
 * @variants simple — left-aligned rail (content-box padding-left 40 / 64; items 100%-80 /
 *   3 cols @768 / 4 cols @1024 / 3 cols @1440), arrows on the 12-col grid >= 1024;
 *   scale — centred active card scaled up; autoplay — advance one card every 5 s (pause on hover,
 *   hidden tab or reduced motion), as the live data-carousel-autoplay does;
 *   horizontal — editorial slider (card-horizontal-editorial, non-looping data-carousel):
 *   one row per card = picture (optional second picture = the <= 768 crop) | category paragraph |
 *   h3 with the link | abstract paragraph(s); slide counter + stacked outline arrows;
 *   ice — the 4brands ice band (#f4f8fc) with the brand margin-bottom 56 / 120;
 *   split — ink upper half over the ice band (with white: over white);
 *   featured — hub band margin-bottom 64 / 84 / 100 / 120 (with horizontal); awards — hub
 *   acknowledgments slider (with horizontal, no band margin); latest — listing band margin
 *   96 / 104 / 96 / 120 (with horizontal); flush — no band margin (with simple).
 *
 * Paragraphs before the heading in a card row = the date line (reply-card-time, index news cards).
 * Optional second picture in a card row (simple / scale) = the partner logo over the card body.
 * highlights — home highlights band (padding-top 56 / 88 / 88 / 120, bottom 60); ink — home
 *   latest-insights rail on the ink band (padding-bottom 56 / 120); start-<n> — the loop rail
 *   opens on card n (0-based, the live data-start); interval-<ms> — autoplay step (live
 *   data-carousel-autoplay-interval, default 5000); noloop — live non-infinite rail, no clones.
 *
 * Hub spacing tokens t-<px> / tm-<px> / b-<px> / bm-<px>: measured space above / below the rail.
 * Loop clones are presentational (aria-hidden, inert, editor indices stripped — EW4).
 */

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|PICTURE|IMG|DIV|PRE|BLOCKQUOTE|TABLE)$/;
function ensureParagraphs(block) {
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const loose = [...cell.childNodes].some((n) => (
      n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      || (n.nodeType === Node.ELEMENT_NODE && !BLOCK_TAGS.test(n.tagName)));
    if (!loose) return;
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    cell.append(p);
  });
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

const text = (node) => (node ? node.textContent.trim() : '');

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

// category dot colours (theme category palette, as rendered on the source cards)
const CATEGORY_COLORS = {
  research: '#00e0ce',
  'white paper': '#00e0ce',
  'product & accelerator': '#02d34a',
  article: '#5b8e7d',
  labs: '#d314c0',
  'case study': '#eb0037',
  acknowledgment: '#ff8c00',
  news: '#ff8c00',
  'best practice': '#ffd138',
};

const ARROW = {
  prev: 'M7.20537 6.37206L3.87204 9.70539L3.57741 10L3.87204 10.2946L7.20537 13.628L7.79462 13.0387'
    + 'L5.17259 10.4167H17.0833V9.58335H5.17259L7.79462 6.96131L7.20537 6.37206Z',
  next: 'M13.4554 6.37206L16.7887 9.70539L17.0833 10L16.7887 10.2946L13.4554 13.628L12.8661 13.0387'
    + 'L15.4881 10.4167H3.57739V9.58335H15.4881L12.8661 6.96131L13.4554 6.37206Z',
};

function arrowButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `card-carousel-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev card' : 'Next card');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

function buildCard(row) {
  const cells = [...row.children];
  const pic = row.querySelector('picture') || row.querySelector('img');
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = row.querySelector('a[href]');
  const flat = cells.flatMap((c) => [...c.children]);
  const hPos = flat.indexOf(heading);
  const texts = flat.filter((n) => n !== heading && !n.contains(pic) && n !== pic && text(n));
  // paragraphs before the heading = the date line (reply-card-time), after it = category labels
  const times = heading ? texts.filter((n) => flat.indexOf(n) < hPos) : [];
  const others = texts.filter((n) => !times.includes(n));

  const pictures = [...row.querySelectorAll('picture')];
  const logo = pictures.length > 1 ? pictures[pictures.length - 1] : null;

  const card = el('div', 'reply-card reply-card-slider');
  const imageBox = el('div', 'reply-card-image-container');
  if (pic) imageBox.append(el('div', 'reply-card-image', pic));
  const body = el('div', 'reply-card-body');
  // optional partner logo (a second picture) sits top-left of the body, as reply-card--slider
  if (logo) body.append(el('div', 'reply-card-logo', logo));
  times.forEach((n) => body.append(el('div', 'reply-card-time', n)));
  if (heading) body.append(el('div', 'reply-card-title', heading));
  others.forEach((n) => {
    const label = el('div', 'category-label');
    const color = CATEGORY_COLORS[text(n).toLowerCase()];
    if (color) {
      const dot = el('span', 'category-dot');
      dot.style.backgroundColor = color;
      label.append(dot);
    }
    label.append(el('div', 'category-name', n));
    body.append(label);
  });
  imageBox.append(body);

  if (link) {
    // EW6 card-as-link: read the href, then unwrap the authored anchor so the title stays editable
    const cover = el('a', 'reply-card-cover', imageBox);
    cover.href = link.getAttribute('href');
    cover.title = link.title || text(heading);
    // the source's whole-card anchor is named by everything on the card (title + category)
    const name = [heading, ...others].map(text).filter(Boolean).join(' ');
    if (name) cover.setAttribute('aria-label', name);
    if (/^https?:/.test(cover.getAttribute('href')) && new URL(cover.href).host !== window.location.host) {
      cover.target = '_blank';
      cover.rel = 'noreferrer';
    }
    link.replaceWith(...link.childNodes);
    card.append(cover);
  } else {
    card.append(imageBox);
  }
  return el('li', 'card-carousel-item', card);
}

const px = (v) => parseFloat(v) || 0;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

function bindLoop(root, kind) {
  const track = root.querySelector('.card-carousel-track');
  const viewport = root.querySelector('.card-carousel-viewport');
  const real = [...track.children];
  const n = real.length;
  if (!n) return;
  // optional start-<n> variant: the card the rail opens on (live data-start)
  const start = [...root.classList].find((c) => /^start-\d+$/.test(c));
  let index = start ? Math.min(n - 1, parseInt(start.slice(6), 10)) : 0;
  let front = 0;
  let built = '';
  let busy = false;
  // every real card fits the viewport (live allItemsDisplayed): the rail does not autoplay
  let allFit = false;
  // noloop: the live non-infinite rail (no data-infinite) — no clones, the index stops at the ends
  const noloop = root.classList.contains('noloop');

  const gap = () => px(getComputedStyle(track).columnGap);
  const build = () => {
    const w = real[0].getBoundingClientRect().width;
    if (!w) return;
    const step = w + gap();
    const cs = getComputedStyle(viewport);
    const avail = viewport.clientWidth - px(cs.paddingLeft) - px(cs.paddingRight);
    allFit = kind !== 'scale' && n * step - gap() <= avail + 1;
    root.classList.toggle('all-displayed', allFit);
    let back;
    if (kind === 'scale') {
      const perView = Math.max(1, Math.round((avail + gap()) / step));
      front = Math.ceil(perView / 2);
      back = front + 1;
    } else {
      front = 1;
      back = Math.max(1, Math.ceil(avail / step));
    }
    if (noloop) {
      front = 0;
      back = 0;
    }
    const key = `${front}/${back}`;
    if (key === built) return;
    built = key;
    track.querySelectorAll('.is-clone').forEach((c) => c.remove());
    const mk = (src) => {
      const c = stripInstrumentation(src.cloneNode(true));
      c.classList.add('is-clone');
      c.setAttribute('aria-hidden', 'true');
      c.inert = true;
      c.querySelectorAll('a, button').forEach((a) => a.setAttribute('tabindex', '-1'));
      return c;
    };
    for (let i = 1; i <= front; i += 1) {
      track.insertBefore(mk(real[(((n - i) % n) + n) % n]), track.firstChild);
    }
    for (let i = 0; i < back; i += 1) track.append(mk(real[i % n]));
  };
  const render = (animate) => {
    root.classList.toggle('is-jumping', !animate);
    const items = [...track.children];
    const pos = (built ? front : 0) + index;
    const target = items[pos];
    if (!target) return;
    let offset = allFit ? 0 : -(target.offsetLeft - items[0].offsetLeft);
    if (kind === 'scale') offset += (track.clientWidth - target.offsetWidth) / 2;
    track.style.setProperty('--offset', `${offset}px`);
    root.style.setProperty('--slide', String(pos + (kind === 'scale' ? 1 : 0)));
    items.forEach((it, i) => it.classList.toggle('is-active', i === pos));
    if (!animate) {
      track.getBoundingClientRect();
      requestAnimationFrame(() => root.classList.remove('is-jumping'));
    }
  };
  const go = (delta) => {
    if (busy) return;
    index = noloop ? Math.max(0, Math.min(n - 1, index + delta)) : index + delta;
    busy = true;
    render(true);
    const settle = () => {
      busy = false;
      if (index < 0 || index >= n) {
        index = ((index % n) + n) % n;
        render(false);
      }
    };
    const done = (ev) => {
      if (ev.target !== track || ev.propertyName !== 'transform') return;
      track.removeEventListener('transitionend', done);
      settle();
    };
    track.addEventListener('transitionend', done);
    setTimeout(() => {
      track.removeEventListener('transitionend', done);
      if (busy) settle();
    }, 1100);
  };
  root.querySelector('.card-carousel-prev')?.addEventListener('click', () => go(-1));
  root.querySelector('.card-carousel-next')?.addEventListener('click', () => go(1));

  if (root.classList.contains('autoplay')) {
    // live pause-on-hover (cardcarousel-runtime): mouseover clears the 5 s interval, mouseout
    // starts a fresh one — a pointer crossing the rail restarts the count, not only skips a tick
    let timer;
    // optional interval-<ms> variant: the live data-carousel-autoplay-interval (default 5000)
    const iv = [...root.classList].find((c) => /^interval-\d+$/.test(c));
    const every = iv ? Math.max(1000, parseInt(iv.slice(9), 10)) : 5000;
    const stop = () => clearInterval(timer);
    const play = () => {
      stop();
      timer = setInterval(() => {
        if (!reduce.matches && !document.hidden && !allFit) go(1);
      }, every);
    };
    root.addEventListener('mouseover', stop);
    root.addEventListener('mouseout', play);
    play();
  }
  const layout = () => {
    build();
    render(false);
  };
  window.addEventListener('resize', layout);
  if (window.ResizeObserver) new ResizeObserver(layout).observe(viewport);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
}

// --- horizontal (card-horizontal-editorial): non-looping slider, as modules.js [data-carousel] ---
// variant cta (fix-hub-e, en-3d-and-mixed-reality labs rail): a paragraph after the heading that
// holds only a link is the card's button (live reply-card-cta > a.button), not abstract copy
const isCtaPara = (n) => n.tagName === 'P' && n.children.length === 1
  && n.firstElementChild.tagName === 'A' && n.textContent.trim() === n.firstElementChild.textContent.trim();

function buildHorizontalCard(row, withCta = false) {
  const pics = [...row.querySelectorAll('picture')];
  const imgs = pics.length ? pics : [...row.querySelectorAll('img')];
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = row.querySelector('a[href]');
  const all = [...row.querySelectorAll(':scope > div > *')];
  const hIdx = heading ? all.indexOf(heading) : -1;
  const texts = all.filter((n) => n !== heading && n.tagName !== 'PICTURE'
    && !n.querySelector('picture, img') && text(n));
  const cats = texts.filter((n) => hIdx < 0 || all.indexOf(n) < hIdx);
  const ctas = withCta ? texts.filter((n) => !cats.includes(n) && isCtaPara(n)) : [];
  const abstracts = texts.filter((n) => !cats.includes(n) && !ctas.includes(n));

  const image = el('div', 'reply-card-image');
  imgs.forEach((p, i) => {
    let cls = 'reply-card-pic';
    if (imgs.length > 1) cls += i ? ' mobile' : ' desktop';
    image.append(el('div', cls, p));
  });
  const body = el('div', 'reply-card-body');
  cats.forEach((n) => {
    const label = el('div', 'category-label');
    const color = CATEGORY_COLORS[text(n).toLowerCase()];
    if (color) {
      const dot = el('span', 'category-dot');
      dot.style.backgroundColor = color;
      label.append(dot);
    }
    label.append(el('div', 'category-name', n));
    body.append(label);
  });
  if (heading) {
    const title = el('div', 'reply-card-title', heading);
    if (link && heading.contains(link)) {
      // EW6: read the href, unwrap the authored anchor, wrap the title slot in a new one
      const a = el('a', 'reply-card-link', title);
      a.href = link.getAttribute('href');
      link.replaceWith(...link.childNodes);
      body.append(a);
    } else {
      body.append(title);
    }
  }
  if (abstracts.length) body.append(el('div', 'reply-card-abstract', ...abstracts));
  if (ctas.length) {
    body.append(el('div', 'reply-card-cta', ...ctas.map((p) => {
      const a = p.firstElementChild;
      a.className = 'button';
      return a;
    })));
  }
  const card = el('div', 'reply-card reply-card-horizontal', el('div', 'reply-card-image-container', image, body));
  return el('li', 'card-carousel-item', card);
}

function bindSlide(root) {
  const track = root.querySelector('.card-carousel-track');
  const items = [...track.children];
  const prev = root.querySelector('.card-carousel-prev');
  const next = root.querySelector('.card-carousel-next');
  let index = 0;
  root.dataset.itemsCount = String(items.length);
  const render = (animate = true) => {
    index = Math.max(0, Math.min(index, items.length - 1));
    const step = items.length > 1
      ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
    track.style.transition = animate ? '' : 'none';
    track.style.setProperty('--offset', `${-index * step}px`);
    root.style.setProperty('--slide', String(index + 1));
    items.forEach((it, i) => it.classList.toggle('active', i === index));
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index >= items.length - 1;
  };
  prev?.addEventListener('click', () => {
    index -= 1;
    render();
  });
  next?.addEventListener('click', () => {
    index += 1;
    render();
  });
  window.addEventListener('resize', () => render(false));
  render(false);
}

// hub spacing tokens (additive): t-<px> / tm-<px> / b-<px> / bm-<px>
function applySpacing(block) {
  let on = false;
  [...block.classList].forEach((c) => {
    const m = c.match(/^(t|tm|b|bm)-(\d+)$/);
    if (!m) return;
    on = true;
    block.style.setProperty(`--sp-${m[1]}`, `${m[2]}px`);
  });
  if (on) block.classList.add('spaced');
}

export default function decorate(block) {
  if (block.querySelector(':scope > .card-carousel-inner')) return;
  applySpacing(block);
  ensureParagraphs(block);
  const horizontal = block.classList.contains('horizontal');
  const track = el('ul', 'card-carousel-track');
  [...block.children].forEach((row) => track.append(
    horizontal ? buildHorizontalCard(row, block.classList.contains('cta')) : buildCard(row),
  ));
  const controls = el('div', 'card-carousel-controls', arrowButton('prev'), arrowButton('next'));
  const inner = el('div', 'card-carousel-inner', el('div', 'card-carousel-viewport', track), controls);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(inner);
  if (horizontal) {
    bindSlide(block);
    return;
  }
  const kind = block.classList.contains('scale') ? 'scale' : 'simple';
  bindLoop(block, kind);
}
