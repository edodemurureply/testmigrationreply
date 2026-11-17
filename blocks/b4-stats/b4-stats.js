/**
 * b4-stats — 4brands key-figure rail (cardcarousel-runtime "alternative" simple rail, no loop).
 * Reconstructive: one row per figure (cell 1 the figure, cell 2 its label; classified by order).
 * Motion: .all-displayed when every item fits (track centred, arrows hidden), else prev/next slide
 * one item (transform 1s ease-in-out, disabled at the ends) — as brand.js [data-b4-rail].
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

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-rail-inner')) return;
  ensureParagraphs(block);
  const track = el('ul', 'b4-rail-track');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim());
    if (!cells.length) return;
    const stat = el('div', 'b4-stat');
    stat.append(el('div', 'b4-stat-value', ...cells[0].childNodes));
    if (cells.length > 1) {
      stat.append(el('div', 'b4-spacer'));
      stat.append(el('div', 'b4-stat-label', ...cells.slice(1).flatMap((c) => [...c.childNodes])));
    }
    track.append(el('li', 'b4-rail-item', stat));
  });
  const controls = el('div', 'b4-rail-controls', arrowButton('prev'), arrowButton('next'));
  const inner = el('div', 'b4-rail-inner', el('div', 'b4-rail-viewport', track), controls);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(inner);
  bindRail(block);
}
