/**
 * table — data table in a plain statement body (canon .reply-table, /en/CCPA-privacy-notice).
 * Reconstructive: every authored row becomes a table row; the first row is the header row.
 * Cell content (paragraphs, emphasis, links) is MOVED into the th / td, never rebuilt.
 *
 * Authoring: one row per table row, one cell per column; row 1 holds the column labels.
 * @variants align-left — non-first columns aligned left (source data-align=left; default right)
 */
export default function decorate(block) {
  if (block.querySelector(':scope > table, :scope > .table-dropdown')) return; // EW9 re-entrant

  const rows = [...block.children];
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const cols = Math.max(...rows.map((r) => r.children.length), 1);
  block.style.setProperty('--table-cols', cols);

  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((col) => {
      const c = document.createElement(i === 0 ? 'th' : 'td');
      c.append(...col.childNodes);
      tr.append(c);
    });
    (i === 0 ? thead : tbody).append(tr);
  });

  if (thead.children.length) table.append(thead);
  table.append(tbody);

  // below 768 the source collapses the table behind its first column label + a round toggle
  // (reply-table h3.md:hidden + button[data-toggle=dropdown], .dropdown max-height 0)
  const firstLabel = thead.querySelector('th');
  const label = firstLabel ? firstLabel.textContent.trim() : '';
  const id = `table-${Math.random().toString(36).slice(2, 8)}`;
  const head = document.createElement('div');
  head.className = 'table-mobile-head';
  const h3 = document.createElement('h3');
  h3.id = `${id}-label`;
  h3.textContent = label;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'table-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', `${id}-panel`);
  toggle.setAttribute('aria-labelledby', h3.id);
  head.append(h3, toggle);
  const dropdown = document.createElement('div');
  dropdown.className = 'table-dropdown';
  dropdown.id = `${id}-panel`;
  dropdown.append(table);
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    block.classList.toggle('open', open);
  });
  if (label) block.replaceChildren(head, dropdown);
  else block.replaceChildren(dropdown);
}
