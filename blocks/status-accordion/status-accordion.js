/**
 * status-accordion — reply.com hub "Our status" accordion (accordion-runtime .reply-accordion,
 * dark items, en/google-cloud): stacked ink tiles with the source's award icon, an optional
 * kicker over the title, a plus / minus toggle; items open independently, all start closed.
 *
 * Authoring: one row per item — cell 1 = the title (an optional short paragraph before the
 * heading is its kicker, e.g. "2024"), cell 2 = the body. Nodes are MOVED; the toggle is an
 * empty <button> named after the title (no button hosts authored text).
 */
let uid = 0;

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children);
  return e;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .status-accordion-grid')) return;
  const list = el('div', 'status-accordion-items');
  [...block.children].forEach((row) => {
    const [head, body] = row.children;
    if (!head) return;
    uid += 1;
    const id = `status-accordion-${uid}`;
    const nodes = [...head.children];
    const title = nodes.find((n) => /^H[1-6]$/.test(n.tagName)) || nodes[nodes.length - 1];
    nodes.filter((n) => n !== title).forEach((n) => n.classList.add('status-accordion-kicker'));
    if (title) title.classList.add('status-accordion-title');
    const labels = el('div', 'status-accordion-labels', ...nodes);
    const toggle = el('button', 'status-accordion-toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', id);
    toggle.setAttribute('aria-label', title ? title.textContent.trim() : 'Toggle');
    const header = el('div', 'status-accordion-header', el('span', 'status-accordion-icon'), labels, toggle);
    const panel = el('div', 'status-accordion-body', ...(body ? [...body.childNodes] : []));
    panel.id = id;
    panel.hidden = true;
    const item = el('div', 'status-accordion-item', header, panel);
    header.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      item.classList.toggle('open', open);
    });
    list.append(item);
  });
  block.replaceChildren(el('div', 'status-accordion-grid r-grid', list));
}
