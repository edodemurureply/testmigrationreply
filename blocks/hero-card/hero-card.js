/**
 * hero-card — featured banner card (card-hero-default + parallax-media-runtime .card-parallax):
 * 2:3 -> 2:1 image with a scroll parallax, overlay body on the 4 / 8 / 12-col grid
 * (logo | category | title link | abstract). Template-slotted: authored nodes are moved into the
 * slots by role.
 *
 * Authoring (cells classified by content, any row order):
 *   pictures — first = desktop 16:9 rendition, optional second = the <= 767 crop; with the
 *     `logo` variant the last picture is the partner logo shown above the category;
 *   category paragraph (before the heading) | heading with the card link | abstract paragraph(s) |
 *   a link-only paragraph after the heading = the CTA button.
 * @variants band — white upper half over the ink band (#151f27), as the insights listing;
 *   feature — index featured banner margins (0 / 56; with first: 24 / 56 -> 88, top 66 @1440);
 *   logo — last picture is the partner logo; hub — with spacing tokens t-<px> / tm-<px> / b-<px> /
 *   bm-<px>
 *   (measured space above / below the card, >= 768 / < 768)
 * video — a paragraph holding only the DAM player link (dam-media.reply.com …/widget.html) is the
 *   card media instead of the pictures (iframe player; the link stays as a hidden caption).
 * EW6: the link href is read and the authored anchor stays in the title (the image cover is a
 * presentational duplicate: aria-hidden, tabindex -1).
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
const PLAYER = /dam-media\.reply\.com\/.+widget\.html/;

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

function bindParallax(box) {
  // --ty stays 0 % until the card's top passes 28 px above the middle of the viewport, then grows
  // linearly to 12.5 % over one card height (probed on the live card at 1440x900, scroll 600..1600)
  const update = () => {
    const { top, height } = box.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (window.innerHeight / 2 - 28 - top) / (height || 1)));
    box.style.setProperty('--ty', `${(12.5 * p).toFixed(4)}%`);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// hub spacing tokens (additive): t-<px> / tm-<px> / b-<px> / bm-<px> = the source section's
// measured space above / below the card (>= 768 / < 768); `n` prefix = negative (fix-hub-i:
// the gaming esports card sits 56 px over the ROSE band whose own margin is 96 @360)
function applySpacing(block) {
  let on = false;
  [...block.classList].forEach((c) => {
    const m = c.match(/^(t|tm|b|bm)-(n?\d+)$/);
    if (!m) return;
    on = true;
    block.style.setProperty(`--sp-${m[1]}`, `${m[2].replace(/^n/, '-')}px`);
  });
  if (on) block.classList.add('spaced');
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-card-band')) return;
  applySpacing(block);
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  // video: a paragraph holding only the DAM player link is the card media (the source
  // video-dam-container); the link stays as a visually hidden caption
  const player = nodes.find((n) => {
    const links = n.tagName === 'A' ? [n] : [...n.querySelectorAll('a[href]')];
    return links.length === 1 && PLAYER.test(links[0].href)
      && n.textContent.trim() === links[0].textContent.trim();
  });
  const all = nodes.filter((n) => n !== player);
  let pics = all.filter((n) => n.tagName === 'PICTURE' || n.tagName === 'IMG'
    || n.querySelector('picture, img'))
    .map((n) => n.querySelector('picture') || n);
  let logo = null;
  if (block.classList.contains('logo') && pics.length > 1) {
    logo = pics[pics.length - 1];
    pics = pics.slice(0, -1);
  }
  const heading = all.find((n) => /^H[1-6]$/.test(n.tagName));
  const link = heading ? heading.querySelector('a[href]') : block.querySelector('a[href]');
  const texts = all.filter((n) => n !== heading && !n.querySelector('picture, img')
    && n.tagName !== 'PICTURE' && n.tagName !== 'IMG' && text(n));
  const hIdx = all.indexOf(heading);
  const cats = texts.filter((n) => hIdx >= 0 && all.indexOf(n) < hIdx);
  // a link-only paragraph after the heading is the card CTA button (.reply-card-cta)
  const ctas = texts.filter((n) => hIdx >= 0 && all.indexOf(n) > hIdx && n.tagName === 'P'
    && n.querySelectorAll('a[href]').length === 1 && text(n) === text(n.querySelector('a')));
  const abstracts = texts.filter((n) => !cats.includes(n) && !ctas.includes(n));

  const parallax = el('div', 'hero-card-parallax');
  pics.forEach((p, i) => {
    let cls = 'hero-card-pic';
    if (pics.length > 1) cls += i ? ' mobile' : ' desktop';
    parallax.append(el('div', cls, p));
  });
  const image = el('div', 'hero-card-image', parallax);
  if (player) {
    const a = player.tagName === 'A' ? player : player.querySelector('a[href]');
    const iframe = document.createElement('iframe');
    iframe.src = a.href;
    iframe.title = a.textContent.trim();
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    player.classList.add('hero-card-player-link');
    image.append(el('div', 'hero-card-video', iframe), player);
  }
  const box = el('div', 'hero-card-image-container');
  if (link) {
    const cover = el('a', 'hero-card-cover', image);
    cover.href = link.getAttribute('href');
    cover.title = text(heading);
    cover.tabIndex = -1;
    cover.setAttribute('aria-hidden', 'true');
    box.append(cover);
  } else {
    box.append(image);
  }
  const body = el('div', 'hero-card-body');
  if (logo) body.append(el('div', 'hero-card-logo', logo));
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
  if (heading) body.append(el('div', 'hero-card-title', heading));
  if (abstracts.length) body.append(el('div', 'hero-card-abstract', ...abstracts));
  if (ctas.length) {
    ctas.forEach((n) => n.querySelector('a').classList.add('hero-card-btn'));
    body.append(el('div', 'hero-card-cta', ...ctas));
  }
  box.append(el('div', 'hero-card-grid', body));
  const card = el('div', 'hero-card-card', box);
  const cell = el('div', 'hero-card-cell r-cell', card);
  block.replaceChildren(el('div', 'hero-card-band', el('div', 'r-grid', cell)));
  bindParallax(image);
}
