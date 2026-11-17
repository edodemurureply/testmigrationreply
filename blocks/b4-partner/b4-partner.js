/**
 * b4-partner — 4brands partnership statement on the ice band: one centred title (t-title),
 * <em> = brand-coloured run, <strong> keeps the bold face. Template-slotted (nodes move into
 * one centred cell, cols 1-4 / 1-8 / 3-10).
 *
 * Authoring: one cell with the heading (h2) or paragraph.
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

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-partner-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const text = document.createElement('div');
  text.className = 'b4-partner-text';
  text.append(...nodes);
  const cell = document.createElement('div');
  cell.className = 'b4-partner-cell r-cell';
  cell.append(text);
  const grid = document.createElement('div');
  grid.className = 'b4-partner-grid r-grid';
  grid.append(cell);
  block.replaceChildren(grid);
}
