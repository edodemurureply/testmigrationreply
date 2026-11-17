/**
 * b4-intro — two-column intro: section title (h2, t-section) beside a rich-text column
 * (cols 2-5 | 6-11 @1024, 2-6 | 7-11 @1440; stacked below 1024).
 * Template-slotted.
 *
 * Authoring: cell 1 = heading (h2 / h3), cell 2 = paragraphs / lists (rich text). Order-tolerant:
 * the first heading is the title, every other node goes to the text column.
 *
 * @variants split — title over two text columns (brand-case-study intro): the first authored text
 *   row fills column 1, later rows column 2 (cols 2-6 | 7-11 @1024, stacked below 768)
 *   (cluster-brand-case-study, additive) eyebrow — the node before the title is a small uppercase
 *   label kept in the title cell; top0 / bot0 — no top / bottom band spacing
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

// split (case-study) titles carry the source colour span; mirror it (child nodes MOVED, EW-safe)
function spanWrap(heading) {
  if (!heading || (heading.children.length === 1 && heading.firstElementChild.tagName === 'SPAN'
    && heading.textContent.trim() === heading.firstElementChild.textContent.trim())) return;
  const span = document.createElement('span');
  span.append(...heading.childNodes);
  heading.append(span);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-intro-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const title = document.createElement('div');
  title.className = 'b4-intro-title r-cell';
  const label = block.classList.contains('eyebrow') && heading
    ? nodes[nodes.indexOf(heading) - 1] : null;
  if (label) {
    label.classList.add('b4-intro-eyebrow');
    title.append(label);
  }
  if (heading) title.append(heading);
  const rest = nodes.filter((n) => n !== heading && n !== label);
  const grid = document.createElement('div');
  grid.className = 'b4-intro-grid r-grid';
  grid.append(title);
  if (block.classList.contains('split')) {
    spanWrap(heading);
    // two text columns: the first authored text row fills column 1, every later row column 2
    const rowOf = new Map(rest.map((n) => [n, n.parentElement.parentElement]));
    const firstRow = rowOf.get(rest[0]);
    const col1 = document.createElement('div');
    col1.className = 'b4-intro-text b4-intro-col1 r-cell rich';
    const col2 = document.createElement('div');
    col2.className = 'b4-intro-text b4-intro-col2 r-cell rich';
    rest.forEach((n) => (rowOf.get(n) === firstRow ? col1 : col2).append(n));
    grid.append(col1, col2);
  } else {
    const text = document.createElement('div');
    text.className = 'b4-intro-text r-cell rich';
    text.append(...rest);
    grid.append(text);
  }
  block.replaceChildren(grid);
}
