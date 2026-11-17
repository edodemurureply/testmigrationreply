/**
 * b4-split — 4brands services rail: 2:3 info tiles (card-info-slider-2-3-default) on the split
 * ink / ice band, on the non-looping b4 rail (prev/next, .all-displayed when every tile fits).
 * Reconstructive: one row per tile.
 *
 * Authoring rows (classified by content): picture | category paragraph (before the heading) |
 * h3 with the tile link | abstract paragraph(s) after the heading.
 * The tile reveals its abstract on hover (pointer: fine) or via the + toggle (checkbox, coarse
 * pointers). EW6: the authored link is read, then unwrapped; the title and abstract move into a
 * new anchor with that href.
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
  b.className = `b4-rail-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev card' : 'Next card');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

const px = (v) => parseFloat(v) || 0;

function bindRail(root) {
  const track = root.querySelector('.b4-rail-track');
  const items = [...track.children];
  const prev = root.querySelector('.b4-rail-prev');
  const next = root.querySelector('.b4-rail-next');
  let index = 0;
  const fits = () => {
    const gap = px(getComputedStyle(track).columnGap);
    const total = items.reduce((s, it) => s + it.getBoundingClientRect().width, 0)
      + gap * (items.length - 1);
    return total <= root.getBoundingClientRect().width + 0.5;
  };
  const render = (animate = true) => {
    const all = fits();
    root.classList.toggle('all-displayed', all);
    if (all) index = 0;
    index = Math.max(0, Math.min(index, items.length - 1));
    const step = items.length > 1
      ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = index ? `translateX(${-index * step}px)` : '';
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
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
  if (window.ResizeObserver) new ResizeObserver(() => render(false)).observe(root);
  render(false);
}

function buildCard(row) {
  const pic = row.querySelector('picture') || row.querySelector('img');
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = row.querySelector('a[href]');
  const all = [...row.querySelectorAll(':scope > div > *')];
  const hIdx = heading ? all.indexOf(heading) : -1;
  const texts = all.filter((n) => n !== heading && !n.querySelector('picture, img')
    && n.tagName !== 'PICTURE' && n.textContent.trim());
  const cats = texts.filter((n) => hIdx < 0 || all.indexOf(n) < hIdx);
  const abstracts = texts.filter((n) => !cats.includes(n));

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'reply-card-toggle';
  toggle.setAttribute('aria-label', 'Show abstract');
  const box = el('div', 'reply-card-image-container', toggle);
  if (pic) box.append(el('div', 'reply-card-image', pic));
  const body = el('div', 'reply-card-body');
  body.append(el('div', 'category-label', ...cats.map((c) => el('div', 'category-name', c))));
  const plus = el('div', 'reply-card-plus', el('span'), el('span'));
  plus.setAttribute('aria-hidden', 'true');
  body.append(plus);
  const content = el('div', 'reply-card-content');
  const inner = [];
  if (heading) inner.push(el('div', 'reply-card-title', heading));
  if (abstracts.length) inner.push(el('div', 'reply-card-abstract', ...abstracts));
  if (link) {
    const a = el('a', 'reply-card-link', ...inner);
    a.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
    content.append(a);
  } else {
    content.append(...inner);
  }
  body.append(content);
  box.append(body);
  return el('li', 'b4-rail-item', el('div', 'reply-card', box));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-rail-inner')) return;
  ensureParagraphs(block);
  const track = el('ul', 'b4-rail-track');
  [...block.children].forEach((row) => {
    if (row.textContent.trim() || row.querySelector('picture, img')) track.append(buildCard(row));
  });
  const controls = el('div', 'b4-rail-controls', arrowButton('prev'), arrowButton('next'));
  const inner = el('div', 'b4-rail-inner', el('div', 'b4-rail-viewport', track), controls);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(inner);
  bindRail(block);
}
