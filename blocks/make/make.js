/**
 * make — home "WE MAKE" heading band (index .home-make): eyebrow line above the section title.
 * Template-slotted: paragraphs before the first heading move to the eyebrow slot, the heading
 * (and anything after it) to the title slot.
 *
 * Authoring: one cell — eyebrow paragraph + heading (h2).
 * @variants xmas — en-christmas WE MAKE spacing; stories — en-christmas "GET INSPIRED" head on
 *   the 1fr 8fr 3fr grid.
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
  if (block.querySelector(':scope > .make-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const hIdx = nodes.findIndex((n) => /^H[1-6]$/.test(n.tagName));
  const eyebrow = hIdx > 0 ? nodes.slice(0, hIdx) : [];
  const rest = nodes.filter((n) => !eyebrow.includes(n));
  const text = el('div', 'make-text');
  if (eyebrow.length) text.append(el('div', 'make-eyebrow', ...eyebrow));
  text.append(el('div', 'make-title', ...rest));
  block.replaceChildren(el('div', 'make-grid r-grid', text));
}
