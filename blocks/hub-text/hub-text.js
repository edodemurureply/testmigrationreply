/**
 * hub-text — hub rich-text band (reply.com page-builder content-body sections that carry no
 * module of their own: title + body copy, image + text, figures, document links) on the
 * 4 / 8 / 12-col grid, text cell cols 1-4 / 1-8 / 2-11 (w-<n>: span n from col 2 >= 1024).
 * Template-slotted: every authored node moves, in order, into one text cell; headings keep the
 * source scale (h1-h3 t-section 28 / 36, h4-h6 24 / 28), paragraphs the content-body face
 * (16 px / 300, 170 %), pictures sit in the flow at their natural width.
 *
 * Authoring: one cell holding the section's content in reading order.
 * @variants center — centred text cell (cols 3-10 >= 1024); mixed — the flattened content of a
 *   one-off source module (pictures in the flow, links as text links); hero-after — the hero's
 *   offering copy below the hero band; dark — ink band, white copy;
 *   t-<px> / tm-<px> / b-<px> / bm-<px> — the source section's measured padding above / below
 *   the content (>= 768 / < 768); w-<n> — text width in grid columns.
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

function applySpacing(block) {
  [...block.classList].forEach((c) => {
    const m = c.match(/^(t|tm|b|bm|w)-(\d+)$/);
    if (!m) return;
    block.style.setProperty(`--sp-${m[1]}`, m[1] === 'w' ? m[2] : `${m[2]}px`);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hub-text-grid')) return;
  ensureParagraphs(block);
  applySpacing(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const text = document.createElement('div');
  text.className = 'hub-text-text';
  text.append(...nodes);
  const cell = document.createElement('div');
  cell.className = 'hub-text-cell r-cell';
  cell.append(text);
  const grid = document.createElement('div');
  grid.className = 'hub-text-grid r-grid';
  grid.append(cell);
  block.replaceChildren(grid);
}
