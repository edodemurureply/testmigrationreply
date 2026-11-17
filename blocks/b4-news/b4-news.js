/**
 * b4-news — 4brands news & events hero slider (card-carousel--horizontal --hero carrying
 * card-hero-default items): 2:3 -> 2:1 banners with an image parallax, copy on a 4 / 8 / 12-col
 * overlay grid; non-looping slider with counter and outline arrows. Reconstructive: one row per
 * card.
 *
 * Authoring rows (classified by content): picture (optional second picture = the <= 767 crop) |
 * category paragraph (before the heading) | h3 with the card link | abstract paragraph(s).
 * The image anchor is a presentational duplicate of the title link (aria-hidden, tabindex -1).
 * Motion: card parallax (--ty grows 7.5 % per half viewport once the card passes mid-viewport).
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
  const pics = [...row.querySelectorAll('picture')];
  const imgs = pics.length ? pics : [...row.querySelectorAll('img')];
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = row.querySelector('a[href]');
  const all = [...row.querySelectorAll(':scope > div > *')];
  const hIdx = heading ? all.indexOf(heading) : -1;
  const texts = all.filter((n) => n !== heading && n.tagName !== 'PICTURE'
    && !n.querySelector('picture, img') && text(n));
  const cats = texts.filter((n) => hIdx < 0 || all.indexOf(n) < hIdx);
  const abstracts = texts.filter((n) => !cats.includes(n));

  const parallax = el('div', 'reply-card-parallax');
  imgs.forEach((p, i) => {
    let cls = 'reply-card-pic';
    if (imgs.length > 1) cls += i ? ' mobile' : ' desktop';
    parallax.append(el('div', cls, p));
  });
  const box = el('div', 'reply-card-image', parallax);
  const media = link ? el('a', 'reply-card-hero-link', box) : el('div', 'reply-card-hero-link', box);
  if (link) {
    media.href = link.getAttribute('href');
    media.tabIndex = -1;
    media.setAttribute('aria-hidden', 'true');
    if (heading) media.title = text(heading);
  }
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
  if (heading) body.append(el('div', 'reply-card-title', heading));
  if (abstracts.length) body.append(el('div', 'reply-card-abstract', ...abstracts));
  const container = el('div', 'reply-card-image-container', media, el('div', 'reply-card-grid', body));
  return el('li', 'card-carousel-item', el('div', 'reply-card', container));
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

function bindParallax(block) {
  const boxes = [...block.querySelectorAll('.reply-card-image')];
  const update = () => {
    const half = window.innerHeight / 2;
    boxes.forEach((c) => {
      const { top } = c.getBoundingClientRect();
      c.style.setProperty('--ty', `${Math.max(0, 7.5 * (1 - top / half)).toFixed(4)}%`);
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .card-carousel-inner')) return;
  ensureParagraphs(block);
  const track = el('ul', 'card-carousel-track');
  [...block.children].forEach((row) => {
    if (text(row) || row.querySelector('picture, img')) track.append(buildCard(row));
  });
  const controls = el('div', 'card-carousel-controls', arrowButton('prev'), arrowButton('next'));
  const inner = el('div', 'card-carousel-inner', el('div', 'card-carousel-viewport', track), controls);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(inner);
  bindSlide(block);
  bindParallax(block);
}
