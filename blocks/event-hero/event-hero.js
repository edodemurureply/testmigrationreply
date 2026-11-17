/**
 * event-hero — event page top (reply.com event template): ink cover band with the light event
 * title, a short white rule, and the white info box that overlaps the band's lower edge.
 *
 * Authoring (cells read in order, rows folded):
 *   - the heading (Heading 1) -> event title
 *   - the first non-heading paragraph -> info box label (e.g. "Info");
 *     further paragraphs / lists -> info box items
 * Missing cells are tolerated: no label renders an info box without a label.
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children);
  return e;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .event-hero-grid')) return;

  const nodes = [...block.children].flatMap((row) => [...row.children])
    .flatMap((cell) => {
      const els = [...cell.children];
      if (els.length) return els;
      const t = cell.textContent.trim();
      return t ? [el('p', '', t)] : [];
    });

  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const rest = nodes.filter((n) => n !== heading);
  const label = rest.shift();

  const grid = el('div', 'event-hero-grid');
  const cover = el('div', 'event-hero-cover');
  const title = el('div', 'event-hero-title');
  if (heading) title.append(heading);
  const line = el('div', 'event-hero-line');
  const box = el('div', 'event-hero-infobox');
  const boxLabel = el('div', 'event-hero-info-label');
  if (label) boxLabel.append(...label.childNodes);
  const infos = el('div', 'event-hero-infos', ...rest);
  box.append(boxLabel, infos);

  grid.append(cover, title, line, box);
  block.replaceChildren(grid);
}
