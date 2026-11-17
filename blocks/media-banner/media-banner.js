/**
 * media-banner — image banner with an overlaid copy column (source gridcontainer-runtime
 * .grid-container.parallax-fullw: 2:3 below 768 / 2:1 from 768, 8px radius, background image
 * with the scroll parallax, white copy anchored bottom-left below 768 and centre-left above).
 * Template-slotted: the picture(s) move to the background slot (second picture = the <= 767
 * crop), every other authored node moves, in order, to the copy column.
 *
 * Authoring rows (classified by content): picture row | copy row (eyebrow paragraph(s) before the
 * heading, heading, then paragraphs in order = meta line, body, note; a paragraph holding only
 * <em> text = an unlinked source button (pill); a link alone in a paragraph = a CTA).
 * Motion: background parallax (translateY(--ty * -.85)), as the source grid-bg.
 * @variants rose — the en-christmas ROSE Room event card (copy padding 50 / 80 bottom, 300 right
 *   from 768, 100 / 115 / 630 at 1440; section margin 56 / 56, 0 / 50 at 1440).
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

function bindParallax(box) {
  const update = () => {
    const vh = window.innerHeight;
    const r = box.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    box.style.setProperty('--ty', `${(p * 7.5).toFixed(4)}%`);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .media-banner-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const isPic = (n) => n.tagName === 'PICTURE'
    || (n.querySelector('picture, img') && !n.textContent.trim());
  const only = (n, tag) => n.tagName === 'P' && n.children.length === 1
    && n.children[0].tagName === tag && n.textContent.trim() === n.children[0].textContent.trim();
  const pics = nodes.filter(isPic);
  const copy = nodes.filter((n) => !isPic(n));
  const bg = el('div', 'media-banner-bg');
  pics.forEach((n, i) => bg.append(el('div', i ? 'media-banner-art m' : 'media-banner-art', n)));
  if (pics.length > 1) bg.classList.add('has-m');

  const hIdx = copy.findIndex((n) => /^H[1-6]$/.test(n.tagName));
  const text = el('div', 'media-banner-text');
  const eyebrow = hIdx > 0 ? copy.slice(0, hIdx) : [];
  if (eyebrow.length) text.append(el('div', 'media-banner-eyebrow', ...eyebrow));
  const after = copy.slice(eyebrow.length);
  const roles = ['media-banner-meta', 'media-banner-body', 'media-banner-note'];
  let k = 0;
  const actions = el('div', 'media-banner-actions');
  after.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) text.append(el('div', 'media-banner-title', n));
    else if (only(n, 'EM')) actions.append(el('div', 'media-banner-pill', n));
    else if (only(n, 'A') || only(n, 'STRONG')) actions.append(el('div', 'media-banner-cta', n));
    else {
      text.append(el('div', roles[Math.min(k, roles.length - 1)], n));
      k += 1;
    }
  });
  if (actions.children.length) text.append(actions);
  const box = el('div', 'media-banner-box', bg, el('div', 'media-banner-copy', text));
  block.replaceChildren(el('div', 'media-banner-grid r-grid', el('div', 'media-banner-cell r-cell', box)));
  bindParallax(box);
}
