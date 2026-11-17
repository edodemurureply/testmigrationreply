/**
 * believe — home "WE BELIEVE" band (reply-statements-slider): eyebrow beside (>= 1024) / above a
 * statements rail that shows one statement per view, clipped to its column (the source rail has
 * no controls on the home page; the further statements sit outside the clip).
 * Template-slotted eyebrow (paragraphs before the first heading); reconstructive statements, one
 * rail item per heading (each heading moved whole, with any paragraph that follows it).
 *
 * Authoring: one cell — eyebrow paragraph, then one heading (h2) per statement.
 * @variants forward — en-christmas: one statement (the page h1) + a linked heading ("Make
 *   Forward", brand underline) under it; eyebrow 1/2 + statement 3/4 on a 1fr 2fr 7fr 2fr grid.
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
  if (block.querySelector(':scope > .believe-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
  const firstH = nodes.findIndex(isHeading);
  const eyebrow = firstH < 0 ? nodes : nodes.slice(0, firstH);
  // forward variant: a heading that holds a link is the "Make Forward" line under the statement
  const forward = block.classList.contains('forward')
    ? nodes.filter((n) => isHeading(n) && n.querySelector('a[href]')) : [];
  const track = el('ul', 'believe-track');
  let item = null;
  const body = nodes.slice(firstH < 0 ? nodes.length : firstH);
  body.filter((n) => !forward.includes(n)).forEach((n) => {
    if (isHeading(n) || !item) {
      item = el('li', 'believe-item');
      track.append(item);
    }
    item.append(n);
  });
  const rail = el('div', 'believe-rail', track);
  rail.setAttribute('role', 'region');
  rail.setAttribute('aria-roledescription', 'carousel');
  if (eyebrow.length) rail.setAttribute('aria-label', eyebrow.map((n) => n.textContent.trim()).join(' '));
  block.replaceChildren(el(
    'div',
    'believe-grid r-grid',
    el('div', 'believe-eyebrow', ...eyebrow),
    el('div', 'believe-statements', rail, ...(forward.length
      ? [el('div', 'believe-forward', ...forward)] : [])),
  ));
}
