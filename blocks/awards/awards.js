/**
 * awards — acknowledgments head on the ice band (en-insights .ins-awards-head):
 * optional eyebrow ("ACKNOWLEDGMENTS") above the title (h3, t-section, ink). The info-card slider
 * that follows is a labs block (ice) in the same section; the section is painted ice (#f4f8fc).
 * Template-slotted: paragraphs before the heading move to the eyebrow slot, the heading (and
 * anything after it) to the title slot.
 *
 * Authoring: one cell — [eyebrow paragraph] + heading.
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
  if (block.querySelector(':scope > .awards-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const hIdx = nodes.findIndex((n) => /^H[1-6]$/.test(n.tagName));
  const eyebrow = hIdx > 0 ? nodes.slice(0, hIdx) : [];
  const rest = nodes.filter((n) => !eyebrow.includes(n));
  const cell = el('div', 'awards-cell r-cell');
  if (eyebrow.length) {
    cell.classList.add('has-eyebrow');
    cell.append(el('div', 'awards-eyebrow', ...eyebrow), el('div', 'awards-gap'));
  }
  cell.append(el('div', 'awards-title', ...rest));
  block.replaceChildren(el('div', 'awards-grid r-grid', cell));
}
