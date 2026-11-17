/**
 * b4-slider — 4brands content slider (cardcarousel-runtime with free-form items: icon + title +
 * text steps, info cards, stat tiles, image cards). Reconstructive: one row per item.
 *
 * Authoring rows (one per item, cells classified by content): pictures = item media (icon or
 * image), headings / paragraphs / lists = item body, a link-only paragraph = item button.
 *
 * Behaviour: prev/next step one item; when every item fits the row is static and the arrows hide
 * (.all-displayed), as the source's carousel does.
 *
 * @variants grid — static wrapping grid (source all-displayed), no arrows; center — centred text;
 *   info — ice card tiles; cards — image cards (2:3 media); icon — icon tiles; dark — #151f27 band,
 *   white text; ice — #f4f8fc band; scale — white icon cards on an infinite rail (clones each
 *   side, no autoplay), the active item centred and scaled; tile — dark 1:1 info tiles
 *   (card-info-slider-1-1-icon-dark): icon glyph + title, the abstract revealed on hover / focus
 *
 * @variants tile: a row's one-token first paragraph (e.g. `bi-xwo`) names the icon-font glyph
 * @variants bg (fix-brand-solution, SAC / Datasphere / workshop info cards): the row's last picture
 *   is the card background (cover), white text; meta — the item's last two paragraphs form the
 *   duration (right) | courses (left) row; eyebrow — the second body paragraph is a small label;
 *   short — the Datasphere card height; cta — text + button cards (no icon)
 * @ew-exempt metadata — the tile icon-name paragraph selects a glyph and is never displayed
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

const ARROW = {
  prev: 'M7.20537 6.37206L3.87204 9.70539L3.57741 10L3.87204 10.2946L7.20537 13.628L7.79462 13.0387'
    + 'L5.17259 10.4167H17.0833V9.58335H5.17259L7.79462 6.96131L7.20537 6.37206Z',
  next: 'M13.4554 6.37206L16.7887 9.70539L17.0833 10L16.7887 10.2946L13.4554 13.628L12.8661 13.0387'
    + 'L15.4881 10.4167H3.57739V9.58335H15.4881L12.8661 6.96131L13.4554 6.37206Z',
};

function arrowButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `b4-slider-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev card' : 'Next card');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

const linkOnly = (p) => p.tagName === 'P' && p.querySelector('a')
  && p.textContent.trim() === p.querySelector('a').textContent.trim();

const ICON_NAME = /^[a-z0-9]+(-[a-z0-9]+)+$/;

function buildItem(row, tile, block) {
  const bgMode = block.classList.contains('bg');
  const media = el('div', 'b4-slider-media');
  let glyph = null;
  const body = el('div', 'b4-slider-body');
  const actions = el('div', 'b4-slider-actions');
  [...row.children].flatMap((c) => [...c.children]).forEach((n) => {
    if (tile && !glyph && n.tagName === 'P' && ICON_NAME.test(n.textContent.trim())) {
      glyph = el('span', 'b4-slider-icon');
      glyph.dataset.icon = n.textContent.trim();
      glyph.setAttribute('aria-hidden', 'true');
    } else if (n.tagName === 'PICTURE' || (n.tagName === 'P' && n.querySelector('picture, img')
      && !n.textContent.trim())) {
      media.append(n);
    } else if (linkOnly(n)) {
      n.querySelector('a').classList.add('button');
      actions.append(n);
    } else {
      body.append(n);
    }
  });
  const card = el('div', 'b4-slider-card');
  if (bgMode && media.children.length) {
    card.append(el('div', 'b4-slider-bg', media.lastElementChild));
  }
  if (bgMode && block.classList.contains('meta')) {
    const tail = [...body.children].slice(-2);
    if (tail.length === 2 && tail.every((n) => n.tagName === 'P')) {
      body.append(el('div', 'b4-slider-meta', ...tail));
    }
  }
  if (tile) {
    const head = body.querySelector('h1, h2, h3, h4, h5, h6');
    if (head) body.prepend(el('div', 'b4-slider-tilehead', ...(glyph ? [glyph] : []), head));
    card.tabIndex = 0;
  }
  if (media.children.length) card.append(media);
  card.append(body);
  if (actions.children.length) card.append(actions);
  return el('li', 'b4-slider-item', card);
}

function bind(block) {
  const track = block.querySelector('.b4-slider-track');
  const viewport = block.querySelector('.b4-slider-viewport');
  const items = [...track.children];
  let index = 0;
  const maxIndex = () => {
    const w = viewport.clientWidth;
    const last = items[items.length - 1];
    if (!last) return 0;
    const total = last.offsetLeft + last.offsetWidth - items[0].offsetLeft;
    if (total <= w + 1) return 0;
    let i = 0;
    while (i < items.length - 1 && total - (items[i].offsetLeft - items[0].offsetLeft) > w) i += 1;
    return i;
  };
  const render = () => {
    const max = maxIndex();
    block.classList.toggle('all-displayed', max === 0);
    index = Math.min(index, max);
    const off = items[index] ? items[index].offsetLeft - items[0].offsetLeft : 0;
    track.style.setProperty('--offset', `${-off}px`);
    items.forEach((it, i) => it.classList.toggle('is-active', i === index));
  };
  const go = (d) => {
    const max = maxIndex();
    index = (((index + d) % (max + 1)) + max + 1) % (max + 1);
    render();
  };
  block.querySelector('.b4-slider-prev').addEventListener('click', () => go(-1));
  block.querySelector('.b4-slider-next').addEventListener('click', () => go(1));
  window.addEventListener('resize', render);
  if (window.ResizeObserver) new ResizeObserver(render).observe(viewport);
  render();
}

// autoplay (fix-brand-solution-2): the live infinite autoplay rail (data-infinite, init on load,
// data-carousel-autoplay, pause on hover): a clone set on each side, one item per 5 s (1 s slide),
// mouseover clears the interval and mouseout restarts it; a rail whose items all fit stays static
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
function bindLoop(block, autoplay = true) {
  const track = block.querySelector('.b4-slider-track');
  const viewport = block.querySelector('.b4-slider-viewport');
  const real = [...track.children];
  const n = real.length;
  if (!n) return;
  const mk = (src) => {
    const c = src.cloneNode(true);
    c.classList.add('is-clone');
    c.setAttribute('aria-hidden', 'true');
    c.inert = true;
    c.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
    return c;
  };
  real.forEach((it) => track.append(mk(it)));
  [...real].reverse().forEach((it) => track.prepend(mk(it)));
  let index = n;
  const fits = () => {
    const last = real[n - 1];
    return last.offsetLeft + last.offsetWidth - real[0].offsetLeft <= viewport.clientWidth + 1;
  };
  const render = (animate) => {
    const all = fits();
    block.classList.toggle('all-displayed', all);
    if (all) index = n;
    const items = [...track.children];
    const first = all ? real[0] : items[0];
    const off = items[index].offsetLeft - first.offsetLeft;
    track.style.transition = animate ? '' : 'none';
    track.style.setProperty('--offset', `${-off}px`);
    items.forEach((it, i) => it.classList.toggle('is-active', i === index));
    if (!animate) {
      track.getBoundingClientRect();
      requestAnimationFrame(() => { track.style.transition = ''; });
    }
  };
  const go = (d) => {
    if (fits()) return;
    index += d;
    render(true);
    setTimeout(() => {
      if (index >= 2 * n || index < n) {
        index = ((((index - n) % n) + n) % n) + n;
        render(false);
      }
    }, 1050);
  };
  block.querySelector('.b4-slider-prev').addEventListener('click', () => go(-1));
  block.querySelector('.b4-slider-next').addEventListener('click', () => go(1));
  let timer;
  const stop = () => clearInterval(timer);
  const play = () => {
    stop();
    if (!autoplay) return;
    timer = setInterval(() => {
      if (!reduce.matches && !document.hidden) go(1);
    }, 5000);
  };
  // the live runtime box sits on the grid column: a pointer in the side margins (the viewport's
  // padding, x < 40 @360) is not over the rail and neither pauses nor restarts it
  // (fix-brand-solution-3 slide logs @360: live no pause, ours paused from x = 0)
  const onRail = (ev) => {
    const r = viewport.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    return ev.clientX >= r.left + pad && ev.clientX <= r.right - pad;
  };
  block.addEventListener('mouseover', (ev) => { if (onRail(ev)) stop(); });
  block.addEventListener('mouseout', (ev) => { if (onRail(ev)) play(); });
  window.addEventListener('resize', () => render(false));
  if (window.ResizeObserver) new ResizeObserver(() => render(false)).observe(viewport);
  render(false);
  if (autoplay) play();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-slider-inner')) return;
  ensureParagraphs(block);
  const track = el('ul', 'b4-slider-track');
  const tile = block.classList.contains('tile');
  [...block.children].forEach((row) => track.append(buildItem(row, tile, block)));
  const controls = el('div', 'b4-slider-controls', arrowButton('prev'), arrowButton('next'));
  const inner = el('div', 'b4-slider-inner', el('div', 'b4-slider-viewport', track), controls);
  block.style.setProperty('--items', String(track.children.length));
  block.replaceChildren(inner);
  if (block.classList.contains('grid')) {
    block.classList.add('all-displayed');
    return;
  }
  if (block.classList.contains('autoplay')) bindLoop(block);
  else if (block.classList.contains('scale')) bindLoop(block, false);
  else bind(block);
}
