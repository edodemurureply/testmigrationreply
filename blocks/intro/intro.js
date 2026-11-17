/**
 * intro — statement intro band: display title, 48px rule, lead paragraph(s), spacer.
 * Template-slotted (canon .statement-intro / .ins-intro). Used by the plain template
 * (/en/accessibility) and the listing template (/en/insights).
 *
 * Authoring (one cell is enough; extra rows/cells are read in order):
 *   - the leading heading(s) (h1 on the page's first intro) -> title slot
 *   - everything after the first non-heading element (paragraphs, lists, CTAs) -> lead slot
 *   A cell that holds bare text (single-paragraph cell) moves its nodes to the lead slot.
 *
 * Paragraphs authored BEFORE the first heading (when a heading follows) are the eyebrow label
 * (canon .text-pfihz, e.g. "Reply Limited") and move above the title in the title slot.
 *
 * @variants plain-lead — the lead renders as rich-text body copy instead of the
 *   statement lead face (listing intros).
 * @variants ice — #f4f8fc band background (plain siblings on an ice page, e.g. /en/contacts).
 * @variants simple — legacy content-body intro (/en/impressum, placeholder pages): plain h1 in
 *   the text face and the lead as body copy on a 1140px container, no rule.
 * @variants dark — ink band, white light-weight title (event placeholder hero).
 * @variants newsroom — h1-only title band (no rule / lead), 56 / 72 padding (4brands newsroom).
 * Default content that follows the block in the same section is the statement body
 * (rich text on the 3/11 column) — styled by intro.css under `.intro-container`.
 */

function wrapNodes(nodes, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

function cell(className, inner) {
  const c = document.createElement('div');
  c.className = `${className} r-cell`;
  if (inner) c.append(inner);
  return c;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .intro-grid')) return; // EW9 re-entrant

  // collect authored nodes in document order (cells of every row)
  const nodes = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      [...col.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) nodes.push(n);
        else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) nodes.push(n);
      });
    });
  });

  const isHeading = (n) => n.nodeType === Node.ELEMENT_NODE && /^H[1-6]$/.test(n.tagName);
  const firstHeading = nodes.findIndex(isHeading);
  const eyebrow = firstHeading > 0 ? nodes.slice(0, firstHeading) : [];
  const title = [];
  const lead = [];
  nodes.slice(eyebrow.length).forEach((n) => {
    if (isHeading(n) && !lead.length) title.push(n);
    else lead.push(n);
  });

  const grid = document.createElement('div');
  grid.className = 'intro-grid r-grid';

  const dash = document.createElement('div');
  dash.className = 'intro-dash';

  const titleCell = cell('intro-title', title.length ? wrapNodes(title, 'rich') : null);
  if (eyebrow.length) titleCell.prepend(wrapNodes(eyebrow, 'intro-eyebrow'));

  grid.append(
    titleCell,
    cell('intro-rule', dash),
    cell('intro-lead', lead.length ? wrapNodes(lead, 'rich') : null),
    cell('intro-spacer'),
  );
  if (!title.length) block.classList.add('no-title');
  if (!lead.length) block.classList.add('no-lead');

  block.replaceChildren(grid);
}
