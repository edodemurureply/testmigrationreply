/**
 * quicklinks — quick-link card row (canon .card-reply-quicklink-slider / .quicklink-card):
 * optional section title over a row of white cards, each an icon above a label with a chevron.
 * Used by the plain template (/en/contacts, "General enquiries").
 *
 * Decode: reconstructive (repeat group). Rows are classified by content: a row whose only
 * content is a heading is the section title; every other row is one card (icon image + label).
 * A label that is a link makes the whole card a link (EW6: href read, inner anchor unwrapped,
 * its nodes moved). A label without a link (form-trigger cards) renders as a static card.
 *
 * Authoring rows: [Heading] | [image | label paragraph (linked or not)] ...
 * @variants white — white band instead of the ice band.
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children);
  return e;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .quicklinks-grid')) return; // EW9 re-entrant

  const head = [];
  const cards = [];
  [...block.children].forEach((row) => {
    const nodes = [];
    [...row.children].forEach((col) => {
      [...col.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) nodes.push(n);
        else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
          nodes.push(el('p', '', n));
        }
      });
    });
    const isHead = nodes.length && nodes.every((n) => /^H[1-6]$/.test(n.tagName));
    if (isHead && !cards.length) head.push(...nodes);
    else if (nodes.length) cards.push(nodes);
  });

  const list = el('ul', 'quicklinks-list');
  cards.forEach((nodes) => {
    const media = nodes.filter((n) => n.matches('picture, img') || (n.querySelector('img') && !n.textContent.trim()));
    const label = nodes.filter((n) => !media.includes(n));
    const a = label.map((n) => (n.matches('a') ? n : n.querySelector('a[href]'))).find(Boolean);
    let card;
    if (a) {
      card = el('a', 'quicklinks-card');
      card.href = a.href;
      if (a.title) card.title = a.title;
      a.replaceWith(...a.childNodes); // EW6: unwrap the inner anchor, keep its nodes
    } else {
      card = el('div', 'quicklinks-card');
    }
    card.append(
      el('div', 'quicklinks-icon', ...media),
      el('div', 'quicklinks-label', ...label),
    );
    list.append(el('li', 'quicklinks-item', card));
  });

  const grid = el('div', 'quicklinks-grid r-grid');
  if (head.length) grid.append(el('div', 'quicklinks-head r-cell', ...head));
  grid.append(el('div', 'quicklinks-cards r-cell', list));
  block.replaceChildren(grid);
}
