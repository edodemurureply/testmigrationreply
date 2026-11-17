/**
 * b4-band — 4brands band heading: one centred title (t-title) on the ink band (sections 5 / 9 /
 * 13 of
 * the brand home). Template-slotted: every authored node of the cell moves into one centred cell.
 *
 * Authoring: one cell with the heading (h2), optionally followed by paragraphs.
 * @variants wide — no band padding, margin-top 56 / 90 / 120 + margin-bottom 28 / 56, cols 2-11
 * @1024
 *   (heading right before a carousel); ice — #f4f8fc band with ink text
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
  if (block.querySelector(':scope > .b4-band-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const text = document.createElement('div');
  text.className = 'b4-band-text';
  text.append(...nodes);
  const cell = document.createElement('div');
  cell.className = 'b4-band-cell r-cell';
  cell.append(text);
  const grid = document.createElement('div');
  grid.className = 'b4-band-grid r-grid';
  grid.append(cell);
  block.replaceChildren(grid);
}
