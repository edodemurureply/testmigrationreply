/**
 * slider-with-title — hub content slider with an optional title (reply.com
 * slider-with-title-runtime): a title cell on the 4 / 8 / 12-col grid (cols 1-4 / 1-6 / 2-7)
 * above a rail of free-form items (icon or image, title, text, link button); prev / next round
 * buttons beside the title (>= 768) or centred below the rail (< 768). Items 100% - 80px wide
 * below 768, 2 per view >= 768, 3 per view >= 1024 (`four`: 4 per view >= 1440). When every item
 * fits the rail is centred and static (.all-displayed), as the source runtime does.
 *
 * Decode: the title is template-slotted (the first row when it holds no picture and is followed
 * by item rows: its nodes move into the title cell); the items are reconstructive, one row per
 * item, cells classified by content: picture = item media; the first heading or paragraph after
 * it = item title; every other node = item body (a link-only paragraph is the item button).
 *
 * @variants four — 4 items per view >= 1440 (data-variation "4 items"); autoplay — advance one
 *   item every 5 s, pause on hover / hidden tab / reduced motion (data-autoplay); infinite — the
 *   rail wraps around at its ends (data-infinite); icons — 100 px icon media, centred items;
 *   cards — bordered card items; center — centred item text; dark — ink band, white copy.
 * @variants spacing tokens t-<px> / tm-<px> (top padding >= 768 / < 768), b-<px> / bm-<px>
 *   (bottom), set as custom properties — the source page-builder spacing of the section;
 *   item spacers (source page-builder spacer blocks, all widths): hs-<px> below the title,
 *   ms-<px> media -> item title, ts-<px> item title -> body, ps-<px> between body paragraphs;
 *   hsm-<px> / msm-<px> (fix-hub-g): hs / ms below 768 only.
 * @variants light — #f4f8fc band; prose — untyped item copy (title in the body face, body
 *   paragraphs 16 px body face, an all-italic paragraph = the 14 px lead-face keyword list);
 *   untitled — items without a title: a lone paragraph is item body copy.
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

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

const text = (node) => (node ? node.textContent.trim() : '');

const ARROW = {
  prev: 'M7.20537 6.37206L3.87204 9.70539L3.57741 10L3.87204 10.2946L7.20537 13.628L7.79462 13.0387'
    + 'L5.17259 10.4167H17.0833V9.58335H5.17259L7.79462 6.96131L7.20537 6.37206Z',
  next: 'M13.4554 6.37206L16.7887 9.70539L17.0833 10L16.7887 10.2946L13.4554 13.628L12.8661 13.0387'
    + 'L15.4881 10.4167H3.57739V9.58335H15.4881L12.8661 6.96131L13.4554 6.37206Z',
};

function arrowButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `slider-with-title-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

function applySpacing(block) {
  [...block.classList].forEach((c) => {
    const m = c.match(/^(t|tm|b|bm|hs|hsm|ms|msm|ts|ps)-(\d+)$/);
    if (m) block.style.setProperty(`--sp-${m[1]}`, `${m[2]}px`);
  });
}

const isCta = (n) => n.tagName === 'P' && n.querySelector('a[href]')
  && text(n) === text(n.querySelector('a[href]')) && !n.closest('h1, h2, h3, h4, h5, h6');

// DAM player media (fix-hub-e, en/digital-experience agencies rail: live card-website with a
// video-dam-container): a node holding only the player link becomes the muted autoplay player in
// the 16:9 media box with the live pause / play disc; the link stays as a hidden caption
const PLAYER = /dam-media\.reply\.com\/.+widget\.html/;
const isPlayer = (n) => {
  const links = n.tagName === 'A' ? [n] : [...n.querySelectorAll('a[href]')];
  return links.length === 1 && PLAYER.test(links[0].href) && text(n) === text(links[0]);
};

function buildPlayer(node) {
  const a = node.tagName === 'A' ? node : node.querySelector('a[href]');
  const iframe = document.createElement('iframe');
  iframe.src = a.href;
  iframe.title = text(a);
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; fullscreen';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  node.classList.add('slider-with-title-player-link');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'slider-with-title-toggle';
  toggle.setAttribute('aria-label', 'Pause video');
  toggle.innerHTML = '<svg width="8" height="13" viewBox="0 0 8 13" aria-hidden="true">'
    + '<path fill="#fff" d="M2 .8v12H.4V.8zm5.6 0v12H6V.8z"/></svg>';
  toggle.addEventListener('click', () => {
    const paused = toggle.dataset.state === 'paused';
    toggle.dataset.state = paused ? 'playing' : 'paused';
    toggle.setAttribute('aria-label', paused ? 'Pause video' : 'Play video');
  });
  return el('div', 'slider-with-title-media video', el('div', 'slider-with-title-video', iframe, node), toggle);
}

function buildItem(row, untitled) {
  // fix-hub-h (en/digital-experience agencies): a paragraph that wraps block nodes (the player
  // widget, the item paragraphs and heading, as delivered) is unwrapped back into its nodes
  row.querySelectorAll(':scope > div > p').forEach((p) => {
    if (p.querySelector(':scope > :is(div, p, h1, h2, h3, h4, h5, h6, ul, ol)')) {
      p.replaceWith(...p.childNodes);
    }
  });
  const all = [...row.querySelectorAll(':scope > div > *')];
  const player = all.find(isPlayer);
  const nodes = all.filter((n) => n !== player);
  const media = nodes.filter((n) => n.tagName === 'PICTURE' || (n.tagName === 'P'
    && n.querySelector('picture, img') && !text(n)));
  const rest = nodes.filter((n) => !media.includes(n));
  const item = el('li', 'slider-with-title-item');
  if (player) item.append(buildPlayer(player));
  else if (media.length) item.append(el('div', 'slider-with-title-media', ...media));
  // untitled: only a heading is an item title (a lone paragraph is body copy)
  const titleNode = rest.find((n) => !isCta(n) && (!untitled || /^H[1-6]$/.test(n.tagName)));
  if (titleNode) {
    const kind = /^H[1-6]$/.test(titleNode.tagName) ? 'heading' : 'text';
    item.append(el('div', `slider-with-title-item-title ${kind}`, titleNode));
  }
  const body = rest.filter((n) => n !== titleNode && !isCta(n));
  if (body.length) item.append(el('div', 'slider-with-title-item-body', ...body));
  const ctas = rest.filter(isCta);
  if (ctas.length) item.append(el('div', 'slider-with-title-item-cta', ...ctas));
  return item;
}

const px = (v) => parseFloat(v) || 0;

function bind(block) {
  const track = block.querySelector('.slider-with-title-items');
  const items = [...track.children];
  const prev = block.querySelector('.slider-with-title-prev');
  const next = block.querySelector('.slider-with-title-next');
  const infinite = block.classList.contains('infinite');
  let index = 0;
  const perView = () => {
    const w = track.parentElement.getBoundingClientRect().width;
    const iw = items[0] ? items[0].getBoundingClientRect().width : w;
    const gap = px(getComputedStyle(track).columnGap);
    const pad = px(getComputedStyle(track).paddingLeft);
    return Math.max(1, Math.floor((w - pad + gap) / (iw + gap)));
  };
  const fits = () => {
    const gap = px(getComputedStyle(track).columnGap);
    const total = items.reduce((s, it) => s + it.getBoundingClientRect().width, 0)
      + gap * (items.length - 1) + px(getComputedStyle(track).paddingLeft) * 2;
    return total <= track.parentElement.getBoundingClientRect().width + 0.5;
  };
  const maxIndex = () => Math.max(0, items.length - perView());
  const render = (animate = true) => {
    block.classList.toggle('all-displayed', fits());
    if (block.classList.contains('all-displayed')) index = 0;
    index = Math.max(0, Math.min(index, maxIndex()));
    const step = items.length > 1
      ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = index ? `translateX(${-index * step}px)` : '';
    items.forEach((it, i) => it.classList.toggle('active', i === index));
    prev.disabled = !infinite && index === 0;
    next.disabled = !infinite && index >= maxIndex();
  };
  const go = (d) => {
    if (block.classList.contains('all-displayed')) return;
    const max = maxIndex();
    index += d;
    if (infinite && index > max) index = 0;
    if (infinite && index < 0) index = max;
    render();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  let startX = null;
  track.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
  });
  track.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });
  if (block.classList.contains('autoplay')
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let hover = false;
    block.addEventListener('mouseenter', () => {
      hover = true;
    });
    block.addEventListener('mouseleave', () => {
      hover = false;
    });
    const start = () => setInterval(() => {
      if (hover || document.hidden) return;
      if (!infinite && index >= maxIndex()) {
        index = -1;
      }
      go(1);
    }, 5000);
    // inview: the 5 s clock starts once the rail is on screen (live captures at 1440 and 360 hold
    // the first item while the rail scrolls into view; a load-time clock had run 1-3 steps ahead)
    if (block.classList.contains('inview') && window.IntersectionObserver) {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        start();
      });
      io.observe(block);
    } else start();
  }
  window.addEventListener('resize', () => render(false));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
  // fix-hub-h: the section is display:none while it loads — measure again once the rail has a
  // size (en/adobe sites rail: 3 items fit at 1440, yet captures kept the arrows row)
  if (window.ResizeObserver) new ResizeObserver(() => render(false)).observe(track.parentElement);
  render(false);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .slider-with-title-rail')) return;
  ensureParagraphs(block);
  applySpacing(block);
  const rows = [...block.children];
  const head = rows.length > 1 && !rows[0].querySelector('picture, img')
    && !rows[0].querySelector('a[href]') ? rows[0] : null;
  // the title container always exists (the source keeps it, spacers only, when untitled)
  const cell = el('div', 'slider-with-title-title r-cell');
  if (head) cell.append(...head.querySelectorAll(':scope > div > *'));
  const children = [el('div', 'slider-with-title-text r-grid', cell)];
  const track = el('ul', 'slider-with-title-items');
  rows.filter((r) => r !== head)
    .forEach((row) => track.append(buildItem(row, block.classList.contains('untitled'))));
  children.push(el('div', 'slider-with-title-rail', el('div', 'slider-with-title-viewport', track)));
  const nav = el('div', 'slider-with-title-nav', arrowButton('prev'), arrowButton('next'));
  // variant itemlabels (fix-hub-k, en/digital-experience agencies): the live card-website rail
  // names its arrows "Prev item" / "Next item"
  if (block.classList.contains('itemlabels')) {
    nav.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-label', i ? 'Next item' : 'Prev item'));
  }
  children.push(el('div', 'slider-with-title-controls r-grid', nav));
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(...children);
  bind(block);
  // peek (live data-infinite rail): the last item shows left of the first, as the source's loop
  // clone does (presentational, inert; the track's negative margin in the css)
  if (block.classList.contains('peek') && track.children.length > 1) {
    const c = track.lastElementChild.cloneNode(true);
    c.classList.add('clone');
    c.classList.remove('active');
    c.setAttribute('aria-hidden', 'true');
    c.inert = true;
    c.querySelectorAll('[id]').forEach((x) => x.removeAttribute('id'));
    track.prepend(c);
  }
}
