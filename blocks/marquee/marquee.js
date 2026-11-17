/**
 * marquee — hub continuous slider (reply.com continuous-slider-runtime --awards / --keywords): a
 * one-line rail of items that scrolls continuously to the left (linear, the source's
 * --continuous-slider-animation-time), paused on hover and under reduced motion.
 *
 * Decode: reconstructive, one row per item, cells classified by content: picture = the item's
 * logo / badge; paragraphs = the item's labels (<em> = the brand-coloured label); a link-only
 * paragraph = the item's button. The second copy of the rail that makes the loop seamless is a
 * presentational clone (aria-hidden, inert, editor indices stripped — EW4).
 * @variants keywords — text-link items (gap 2rem); spacing tokens t-<px> / tm-<px> / b-<px> /
 *   bm-<px> (the source section's measured padding above / below, >= 768 / < 768)
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

const text = (n) => (n ? n.textContent.trim() : '');
const isCta = (n) => n.tagName === 'P' && n.querySelector('a[href]')
  && text(n) === text(n.querySelector('a[href]'));

function buildItem(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const item = el('li', 'marquee-item');
  const media = nodes.filter((n) => n.tagName === 'PICTURE' || (n.querySelector('picture, img') && !text(n)));
  const ctas = nodes.filter((n) => !media.includes(n) && isCta(n));
  const labels = nodes.filter((n) => !media.includes(n) && !ctas.includes(n));
  if (media.length) item.append(el('div', 'marquee-media', ...media));
  if (labels.length) item.append(el('div', 'marquee-labels', ...labels));
  if (ctas.length) item.append(el('div', 'marquee-cta', ...ctas));
  return item;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .marquee-viewport')) return;
  applySpacing(block);
  const set = el('ul', 'marquee-set');
  [...block.children].forEach((row) => set.append(buildItem(row)));
  const clone = set.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('inert', '');
  clone.querySelectorAll('[data-prose-index], [data-richtext-prop]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-richtext-prop');
  });
  const track = el('div', 'marquee-track', set, clone);
  // the source sets the loop time per rail (about 4.75 s per item)
  track.style.setProperty('--marquee-time', `${Math.max(10, set.children.length * 4.75)}s`);
  block.replaceChildren(el('div', 'marquee-viewport', track));
}
