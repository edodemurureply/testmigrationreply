/**
 * prepare — closing band on a background image: a title over a row of figures (icon, title,
 * text) (reply.com editorial template, section .ed-prepare + .figure-row).
 *
 * Decode: title template-slotted; figures reconstructive (one figure per row holding an image
 * and text). Authored nodes are MOVED by role; each paragraph keeps its tag.
 *
 * Authoring rows:
 *   - image-only row before the title: background image of the band
 *   - title row: heading ("Getting prepared for 2021")
 *   - figure rows: icon image, title paragraph, text paragraph
 */

function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...children);
  return d;
}

function spacer(className) {
  const s = div(`sp ${className}`);
  s.setAttribute('aria-hidden', 'true');
  return s;
}

// the source paints heading text through an inner colour span (span.c-white); mirror it by MOVING
// the heading's child nodes into one span (the heading element itself stays the authored node)
function inkSpan(heading) {
  if (!heading || heading.querySelector(':scope > span.ink')) return;
  const s = document.createElement('span');
  s.className = 'ink';
  s.append(...heading.childNodes);
  heading.append(s);
}

function units(cell) {
  const els = [...cell.children];
  return els.length ? els : [cell];
}

const isMediaOnly = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
const isMediaEl = (n) => ['PICTURE', 'IMG'].includes(n.tagName);
const mediaOf = (n) => (isMediaEl(n) ? n : (n.querySelector('picture') || n.querySelector('img')));

function buildFigure(row) {
  const item = div('item');
  const texts = [];
  [...row.children].flatMap(units).forEach((n) => {
    if (isMediaEl(n) || isMediaOnly(n)) item.append(div('pic', mediaOf(n)));
    else if (n.textContent.trim()) texts.push(n);
  });
  texts.forEach((n, i) => {
    item.append(spacer(i ? 'sp-text' : 'sp-title'));
    item.append(div(i ? 'item-text' : 'item-title', n));
  });
  return item;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .grid')) return;
  const rows = [...block.children];
  const titleIdx = rows.findIndex((r) => r.querySelector('h1, h2, h3, h4, h5, h6'));

  let bg = null;
  const titleBox = div('title r-cell');
  const items = [];
  rows.forEach((row, i) => {
    if (i === titleIdx) {
      row.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(inkSpan);
      titleBox.append(div('title-text', ...[...row.children].flatMap(units)
        .filter((n) => n.textContent.trim())));
    } else if (isMediaOnly(row) && (titleIdx < 0 || i < titleIdx) && !bg) {
      bg = mediaOf(row);
    } else if (row.textContent.trim() || row.querySelector('picture, img')) {
      items.push(buildFigure(row));
    }
  });

  const figureGrid = div('figure-grid', ...items);
  figureGrid.dataset.count = String(items.length);
  const grid = div(
    'grid r-grid',
    titleBox,
    div('gap r-cell', spacer('sp-gap')),
    div('figures r-cell', div('figure-row', figureGrid)),
    div('end r-cell', spacer('sp-end')),
  );
  block.replaceChildren(...(bg ? [div('bg', bg)] : []), grid);
}
