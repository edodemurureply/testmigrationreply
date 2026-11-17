/**
 * b4-roadmap — roadmap head: title (h2/h3, t-section) above a narrow rich-text lead
 * (text cols 2-5 @768, 3-6 @1024).
 *
 * @variants ice — #f4f8fc band background (the block paints its own band)
 * Template-slotted.
 *
 * Authoring: cell 1 = heading (h2 / h3), cell 2 = paragraphs / lists (rich text). Order-tolerant:
 * the first heading is the title, every other node goes to the text column.
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
  if (block.querySelector(':scope > .b4-roadmap-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const title = document.createElement('div');
  title.className = 'b4-roadmap-title r-cell';
  if (heading) title.append(heading);
  const text = document.createElement('div');
  text.className = 'b4-roadmap-text r-cell rich';
  text.append(...nodes.filter((n) => n !== heading));
  const grid = document.createElement('div');
  grid.className = 'b4-roadmap-grid r-grid';
  grid.append(title, text);
  block.replaceChildren(grid);
}
