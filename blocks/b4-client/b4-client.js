/**
 * b4-client — case-study client band on ice: section title, a short rule beside the text and the
 * client logo on the right (cols 9-11 from 1024). Template-slotted.
 *
 * Authoring (cells classified by content, order-tolerant): the first heading = title; a picture =
 * client logo; every other node = text (rich).
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
  if (block.querySelector(':scope > .b4-client-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const pic = block.querySelector('picture') || block.querySelector('img');
  const logoNode = pic && nodes.find((n) => n === pic || n.contains(pic));
  const texts = nodes.filter((n) => n !== heading && n !== logoNode);

  const title = div('b4-client-title r-cell');
  if (heading) title.append(heading);
  const rule = div('b4-client-rule r-cell', document.createElement('span'));
  rule.firstElementChild.className = 'b4-rule';
  const text = div('b4-client-text r-cell rich', ...texts);
  const logo = div('b4-client-logo r-cell');
  if (logoNode) logo.append(logoNode);
  block.replaceChildren(div('b4-client-grid r-grid', title, rule, text, logo));
}
