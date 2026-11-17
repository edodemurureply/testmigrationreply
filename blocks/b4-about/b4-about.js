/**
 * b4-about — 4brands "About" band: section title over two rich-text columns on the 4 / 8 / 12-col
 * grid (title 1-4 / 1-5 / 2-7, columns stacked < 768, 1-4 | 5-8 at 768, 2-6 | 7-11 from 1024).
 * Template-slotted.
 *
 * Authoring rows (one cell each, classified by content): the heading row = title; every following
 * text row = one column (first row -> column 1, the rest -> column 2).
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

function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...children);
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-about-grid')) return;
  ensureParagraphs(block);
  const title = div('b4-about-title r-cell');
  const col1 = div('b4-about-col1 r-cell rich');
  const col2 = div('b4-about-col2 r-cell rich');
  let texts = 0;
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    if (!nodes.length) return;
    const heading = nodes.every((n) => /^H[1-6]$/.test(n.tagName));
    if (heading && !texts) {
      title.append(...nodes);
      return;
    }
    (texts ? col2 : col1).append(...nodes);
    texts += 1;
  });
  block.replaceChildren(div('b4-about-grid r-grid', title, col1, col2));
}
