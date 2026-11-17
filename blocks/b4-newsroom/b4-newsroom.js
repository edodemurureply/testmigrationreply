/**
 * b4-newsroom — 4brands newsroom call-to-action band on ink: a centred statement (t-title, light)
 * + spacer + a white pill button with the arrow glyph. Template-slotted.
 *
 * Authoring rows (classified by content): paragraph(s) / heading without a link = statement;
 * the paragraph holding the link = CTA (EDS buttonizes <strong><a>).
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
  if (block.querySelector(':scope > .b4-newsroom-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const ctas = nodes.filter((n) => n.querySelector('a[href]'));
  const texts = nodes.filter((n) => !ctas.includes(n));
  ctas.forEach((p) => {
    const a = p.querySelector('a[href]');
    p.classList.add('button-wrapper');
    a.classList.add('button');
  });
  const cell = div('b4-newsroom-cell r-cell', div('b4-newsroom-text', ...texts));
  if (ctas.length) cell.append(div('b4-newsroom-spacer'), div('b4-newsroom-cta', ...ctas));
  block.replaceChildren(div('b4-newsroom-grid r-grid', cell));
}
