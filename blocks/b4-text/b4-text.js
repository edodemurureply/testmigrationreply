/**
 * b4-text — case-study text band: section title (h2, t-section) beside or above a rich-text column.
 * Template-slotted.
 *
 * Authoring (order-tolerant): the first heading = title, every other node = text (rich).
 *
 * @variants dark — ink band (#151f27), title and text centred in white, stacked (cols 3-10 @1024);
 *   default — white band, title cols 2-5 | text 6-11 @1024 (2-6 | 7-11 @1440), no bottom margin
 *   (cluster-brand-case-study, additive) ice — ice band; center / stack — stacked cols 3-10,
 *   centred / left; wide — stacked cols 2-11 left; single — stacked cols 2-9 left;
 *   eyebrow — the first node is a small uppercase label (title cell);
 *   top0 / bot0 / bot / first — band spacing
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

// the source wraps the dark band title in a colour span; mirror it (child nodes MOVED, EW-safe)
function spanWrap(heading) {
  if (!heading || (heading.children.length === 1 && heading.firstElementChild.tagName === 'SPAN'
    && heading.textContent.trim() === heading.firstElementChild.textContent.trim())) return;
  const span = document.createElement('span');
  span.append(...heading.childNodes);
  heading.append(span);
}

function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...children);
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-text-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const isH = (n) => /^H[1-6]$/.test(n.tagName);
  const title = div('b4-text-title r-cell');
  let titleNodes = [];
  if (block.classList.contains('eyebrow') && nodes.length > 1) {
    // small label first (p or heading), then the title heading
    nodes[0].classList.add('b4-text-eyebrow');
    const heading = nodes.slice(1).find(isH);
    titleNodes = heading ? [nodes[0], heading] : [nodes[0]];
  } else {
    const heading = nodes.find(isH);
    titleNodes = heading ? [heading] : [];
  }
  title.append(...titleNodes);
  const main = titleNodes.find((n) => isH(n) && !n.classList.contains('b4-text-eyebrow'));
  if (block.classList.contains('dark') && main) spanWrap(main);
  const text = div('b4-text-body r-cell rich', ...nodes.filter((n) => !titleNodes.includes(n)));
  block.replaceChildren(div('b4-text-grid r-grid', title, text));
}
