/**
 * accordion — reply accordion (canon accordion-runtime .reply-accordion, light tiles): optional
 * section title, then items with a title and a plus/minus toggle; items open independently.
 * Used by the plain template (/en/contacts, "Specific questions").
 *
 * Decode: reconstructive (repeat group). A row whose only content is a heading, before any
 * item, is the section title. Every other row is one item: the cell holding the first
 * paragraph/heading is the title (first cell), everything else is the body. Nodes are MOVED.
 * The toggle is an empty <button> next to the title (EW7: no button hosts authored text);
 * clicking the header row toggles the item.
 *
 * Authoring rows: [Heading] | [title | body (paragraphs, lists, links)] ...
 * @variants white — white band instead of the ice band.
 */

let uid = 0;

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children);
  return e;
}

function cellNodes(col) {
  const out = [];
  [...col.childNodes].forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) out.push(n);
    else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) out.push(el('p', '', n));
  });
  return out;
}

function toggle(item, open) {
  const btn = item.querySelector('.accordion-toggle');
  const body = item.querySelector('.accordion-body');
  item.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  body.hidden = !open;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .accordion-grid')) return; // EW9 re-entrant

  const head = [];
  const items = [];
  [...block.children].forEach((row) => {
    const cols = [...row.children].map(cellNodes).filter((c) => c.length);
    const all = cols.flat();
    if (!all.length) return;
    if (!items.length && all.every((n) => /^H[1-6]$/.test(n.tagName))) {
      head.push(...all);
      return;
    }
    const title = cols.length > 1 ? cols[0] : all.slice(0, 1);
    const body = cols.length > 1 ? cols.slice(1).flat() : all.slice(1);
    items.push({ title, body });
  });

  const list = el('div', 'accordion-items');
  items.forEach(({ title, body }) => {
    uid += 1;
    const id = `accordion-${uid}`;
    const btn = el('button', 'accordion-toggle');
    btn.type = 'button';
    btn.setAttribute('aria-controls', `${id}-body`);
    btn.setAttribute('aria-label', 'Toggle');
    const header = el('div', 'accordion-header', el('div', 'accordion-title', ...title), btn);
    const bodyEl = el('div', 'accordion-body', el('div', 'accordion-body-inner', ...body));
    bodyEl.id = `${id}-body`;
    const item = el('div', 'accordion-item', header, bodyEl);
    header.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      toggle(item, !item.classList.contains('open'));
    });
    toggle(item, false);
    list.append(item);
  });

  const grid = el('div', 'accordion-grid r-grid');
  if (head.length) grid.append(el('div', 'accordion-head r-cell', ...head));
  grid.append(el('div', 'accordion-list r-cell', list));
  block.replaceChildren(grid);
}
