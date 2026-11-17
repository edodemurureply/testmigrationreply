/**
 * logo-wall — hub customer / partner logo wall (reply.com logo-wall-runtime): a title on the grid
 * (cols 1-4 / 1-6 / 2-7) above the logos — >= 768 a wrapping wall of 5 per row (16:9 boxes,
 * 20 px inset); < 768 a slider of pages of 8 logos (2 per row) with dot indicators and swipe.
 *
 * Decode: the title is template-slotted (the first row holding a heading); the logos are
 * reconstructive, one row per logo (picture, alt = the partner name).
 * @variants ice — the ice band (#f4f8fc); spacing tokens t-<px> / tm-<px> / b-<px> / bm-<px>
 *   (the source section's measured padding above / below, >= 768 / < 768)
 */

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

function applySpacing(block) {
  [...block.classList].forEach((c) => {
    const m = c.match(/^(t|tm|b|bm)-(\d+)$/);
    if (m) block.style.setProperty(`--sp-${m[1]}`, `${m[2]}px`);
  });
}

const PAGE = 8;

function bindPages(block, pages, dots) {
  let index = 0;
  const show = (i) => {
    index = Math.max(0, Math.min(i, pages.children.length - 1));
    pages.style.transform = index ? `translateX(${-index * 100}%)` : '';
    [...dots.children].forEach((d, n) => d.classList.toggle('active', n === index));
  };
  [...dots.children].forEach((d, n) => d.addEventListener('click', () => show(n)));
  let startX = null;
  pages.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
  });
  pages.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
  });
  show(0);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .logo-wall-wall')) return;
  applySpacing(block);
  const rows = [...block.children];
  const head = rows.find((r) => r.querySelector('h1, h2, h3, h4, h5, h6'));
  const logos = rows.filter((r) => r !== head).map((r) => r.querySelector('picture') || r.querySelector('img'))
    .filter(Boolean);
  const children = [];
  if (head) {
    const cell = el('div', 'logo-wall-title r-cell', ...head.querySelectorAll(':scope > div > *'));
    children.push(el('div', 'logo-wall-text r-grid', cell));
  }
  // >= 768: the wall (the authored pictures); < 768: pages of 8 (presentational clones, EW4)
  const wall = el('div', 'logo-wall-wall');
  logos.forEach((p) => wall.append(el('div', 'logo-wall-item', el('div', 'logo-wall-box', p))));
  children.push(wall);
  const pages = el('div', 'logo-wall-pages');
  const dots = el('div', 'logo-wall-dots');
  for (let i = 0; i < logos.length; i += PAGE) {
    const page = el('div', 'logo-wall-page');
    logos.slice(i, i + PAGE).forEach((p) => {
      const clone = p.cloneNode(true);
      clone.querySelectorAll('[data-prose-index], [data-richtext-prop]').forEach((n) => {
        n.removeAttribute('data-prose-index');
        n.removeAttribute('data-richtext-prop');
      });
      page.append(el('div', 'logo-wall-logo', clone));
    });
    page.setAttribute('aria-hidden', 'true');
    pages.append(page);
    const dot = el('button', 'logo-wall-dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Page ${i / PAGE + 1}`);
    dots.append(dot);
  }
  const slider = el('div', 'logo-wall-slider', el('div', 'logo-wall-viewport', pages), dots);
  if (pages.children.length < 2) block.classList.add('all-displayed');
  children.push(slider);
  block.replaceChildren(...children);
  bindPages(block, pages, dots);
}
