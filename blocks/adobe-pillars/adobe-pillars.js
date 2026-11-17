/**
 * adobe-pillars — en/adobe "Three pillars of DX success" card row (live reply-card-slider-simple
 * of card-info-slider-1-1-icon cards on the ink band): square white cards with a plus glyph, an
 * icon-font glyph and the pillar title centred vertically; the abstract is revealed on hover /
 * focus (live article.reply-card-abstract, collapsed at rest). Centred row >= 1024, a clipped
 * left-aligned rail below.
 *
 * Authoring: one row per card, cells classified by content: a cell holding only an icon token
 * (live icon class without the `icon-` prefix, e.g. yy7k-c, bn-gu7) | the title heading |
 * abstract paragraph(s).
 * @ew-exempt icon token — selects the icon-font glyph, never displayed as text
 */

const GLYPHS = { 'yy7k-c': '\ueb01', 'bn-gu7': '\uf120' };

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

function buildCard(row) {
  const cells = [...row.children];
  let glyph = '';
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const abstract = [];
  cells.forEach((cell) => {
    const t = cell.textContent.trim();
    if (!cell.querySelector('h1, h2, h3, h4, h5, h6') && GLYPHS[t.replace(/^icon-/, '')]) {
      glyph = GLYPHS[t.replace(/^icon-/, '')];
      return;
    }
    [...cell.children].forEach((n) => {
      if (n !== heading && n.textContent.trim()) abstract.push(n);
    });
    if (!cell.children.length && t && !heading) abstract.push(el('p', '', t));
  });
  const icon = el('i', 'adobe-pillars-icon', glyph);
  icon.setAttribute('aria-hidden', 'true');
  const title = el('div', 'adobe-pillars-title', icon);
  if (heading) title.append(heading);
  const body = el('div', 'adobe-pillars-body', title);
  if (abstract.length) body.append(el('div', 'adobe-pillars-abstract', ...abstract));
  const plus = el('div', 'adobe-pillars-plus');
  plus.setAttribute('aria-hidden', 'true');
  const card = el('div', 'adobe-pillars-card', plus, body);
  card.tabIndex = 0;
  return el('li', 'adobe-pillars-item', card);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .adobe-pillars-rail')) return;
  const track = el('ul', 'adobe-pillars-track');
  [...block.children].forEach((row) => {
    if (row.textContent.trim()) track.append(buildCard(row));
  });
  block.replaceChildren(el('div', 'adobe-pillars-rail', track));
}
