/**
 * b4-accordion — 4brands accordion (accordion-runtime .reply-accordion, dark tiles): icon +
 * title header, plus/minus toggle, items open independently. Reconstructive: one row per item.
 *
 * Authoring rows: cell 1 icon name (cart | cloud | image — optional) | cell 2 heading (h3) |
 * cell 3 body (paragraphs / lists). Cells are classified: the cell holding a heading is the title,
 * a one-word cell before it is the icon, everything else is body.
 *
 * @variants cell 1: cart | cloud | image | edit | screen — icon-font glyph of the item
 * @variants light — white tiles with ink copy (accordion-item light)
 * @variants ice — #f4f8fc band background
 * @variants pair — FAQ pair (fix-brand-solution SAC trainings): an optional first row with only an
 *   h2 is the heading above; the items split into two accordions side by side from 768 (the first
 *   takes the larger half). Icon names also: person | people | list | bulb
 * @ew-exempt metadata — the icon-name cell selects a glyph and is never displayed
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

const text = (node) => (node ? node.textContent.trim() : '');

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

let instances = 0;

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-accordion-grid')) return;
  ensureParagraphs(block);
  instances += 1;
  const list = el('div', 'b4-accordion-list');
  let intro = null;
  const rows = [...block.children];
  const pair = block.classList.contains('pair');
  if ((block.classList.contains('split') || pair) && rows.length > 1 && rows[0].querySelector('h2')
    && !rows[0].querySelector('h3')) {
    intro = el('div', 'b4-accordion-intro r-cell');
    [...rows.shift().children].forEach((c) => intro.append(...c.children));
  }

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const titleCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6'));
    const titleIdx = cells.indexOf(titleCell);
    const iconCell = titleIdx > 0 && /^[a-z0-9-]+$/i.test(text(cells[0])) ? cells[0] : null;
    const bodyCells = cells.filter((c) => c !== titleCell && c !== iconCell);
    const id = `b4-accordion-${instances}-${i + 1}`;

    const icon = el('span', 'b4-accordion-icon');
    icon.setAttribute('aria-hidden', 'true');
    if (iconCell) icon.dataset.icon = text(iconCell).toLowerCase();
    const labels = el('span', 'b4-accordion-labels');
    if (titleCell) labels.append(...titleCell.children);
    const lead = el('span', 'b4-accordion-lead', el('span', 'b4-accordion-iconcol', icon), labels);
    const plus = el('span', 'b4-accordion-plus');
    plus.setAttribute('aria-hidden', 'true');
    const header = el('div', 'b4-accordion-header', lead, plus);
    header.id = `${id}-header`;
    header.setAttribute('role', 'button');
    header.tabIndex = 0;
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', `${id}-body`);

    const inner = el('div', 'b4-accordion-inner');
    bodyCells.forEach((c) => inner.append(...c.children));
    const body = el('div', 'b4-accordion-body', inner);
    body.id = `${id}-body`;
    body.setAttribute('role', 'region');
    body.setAttribute('aria-labelledby', header.id);

    const item = el('div', 'b4-accordion-item', header, body);
    const toggle = () => {
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      header.setAttribute('aria-expanded', String(open));
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
    list.append(item);
  });

  const cells = [el('div', 'b4-accordion-cell r-cell', list)];
  if (pair) {
    const items = [...list.children];
    const second = el('div', 'b4-accordion-list');
    second.append(...items.slice(Math.ceil(items.length / 2)));
    cells.push(el('div', 'b4-accordion-cell b4-accordion-cell-2 r-cell', second));
  }
  block.replaceChildren(el('div', 'b4-accordion-grid r-grid', ...(intro ? [intro] : []), ...cells));
}
