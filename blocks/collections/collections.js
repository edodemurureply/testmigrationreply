/**
 * collections — head of one insights collection on the ink band (en-insights .ins-coll-head):
 * optional eyebrow ("OUR COLLECTIONS") above the collection title (h2, t-section, white). The rail
 * that follows is a card-carousel (simple flush) in the same section; the section is painted ink.
 * Template-slotted: paragraphs before the heading move to the eyebrow slot, the heading (and
 * anything after it) to the title slot.
 *
 * Authoring: one cell — [eyebrow paragraph] + heading.
 * @variants first — first collection of the band (top margin 80 / 88 / 88 / 96)
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

export default function decorate(block) {
  if (block.querySelector(':scope > .collections-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const hIdx = nodes.findIndex((n) => /^H[1-6]$/.test(n.tagName));
  const eyebrow = hIdx > 0 ? nodes.slice(0, hIdx) : [];
  const rest = nodes.filter((n) => !eyebrow.includes(n));
  const cell = el('div', 'collections-cell r-cell');
  if (eyebrow.length) {
    cell.classList.add('has-eyebrow');
    cell.append(el('div', 'collections-eyebrow', ...eyebrow), el('div', 'collections-gap'));
  }
  // the heading's child nodes move into one span, as the source title span (span.t-white)
  rest.filter((n) => /^H[1-6]$/.test(n.tagName) && !n.querySelector(':scope > span.collections-ink'))
    .forEach((h) => h.append(el('span', 'collections-ink', ...h.childNodes)));
  cell.append(el('div', 'collections-title', ...rest));
  block.replaceChildren(el('div', 'collections-grid r-grid', cell));
}
