/**
 * b4-events — 4brands events wall (reply-card card-wall-event-default) on the ice band: white
 * bordered
 * cards in the masonry wall (2 cols >= 768, 3 >= 1024, 4 >= 1112), each a whole-card link with a
 * 9:4
 * head (red placeholder, or the event photo under a 20 % multiply veil) carrying the date, then the
 * title, category, abstract and location. Reconstructive: one row per event.
 *
 * Authoring rows (classified by content):
 *   - cell 1: optional picture (event photo), then the day paragraph and the month paragraph
 *   - cell 2: h3 with the event link, then paragraphs: category, abstract(s), location (the last
 *   one
 *     when there are three or more); an optional hours paragraph ("11:00–18:00 Uhr MESZ") before it
 *   - a cross-month range authors four date paragraphs: day, month, day, month (two lines)
 *   - news / press row (newsroom, card-wall-abstract-default): ONE cell = h3 with the link, then
 *     paragraphs: category, date (dd.mm.yyyy), abstract(s); no date head, category dot + time line
 * EW6: the authored link is read, then unwrapped; the card moves into a new anchor with that href.
 * @variants newsroom — white band, wall on the filter bar (no top margin), 4brands newsroom.
 * @variants track-normal — 360 abstracts at normal tracking (DE brand home).
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

// decorative glyph host (source i.icon): empty, aria-hidden; the glyph is CSS ::before
function glyph() {
  const i = el('i', 'b4-event-icon');
  i.setAttribute('aria-hidden', 'true');
  return i;
}

const text = (node) => (node ? node.textContent.trim() : '');

const px = (v) => parseFloat(v) || 0;

// wrap the card parts in one anchor carrying the authored link (EW6: read, then unwrap)
function linked(link, parts) {
  if (!link) return parts;
  const a = el('a', 'b4-event-link', ...parts);
  a.href = link.getAttribute('href');
  link.replaceWith(...link.childNodes);
  return [a];
}

const TIME_RE = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
// event hours line (newsroom), e.g. "11:00–18:00 Uhr MESZ"
const HOURS_RE = /^\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}/;

// news / press row (card-wall-abstract-default, newsroom): one cell, no date head
function buildNewsCard(cell, heading, link) {
  const paras = [...cell.querySelectorAll(':scope > p')].filter((p) => text(p));
  const category = paras[0];
  const time = paras.find((p) => p !== category && TIME_RE.test(text(p)));
  const abstracts = paras.filter((p) => p !== category && p !== time);
  const body = el('div', 'b4-event-body');
  // the source links the title only (a > h3), not the whole card
  if (heading) body.append(el('div', 'b4-event-title', ...linked(link, [heading])));
  const meta = el('div', 'b4-event-meta');
  if (category) {
    const dot = el('span', 'b4-event-dot');
    dot.setAttribute('aria-hidden', 'true');
    meta.append(el('div', 'b4-event-category', dot, category));
  }
  if (time) meta.append(el('div', 'b4-event-time', time));
  if (meta.children.length) body.append(meta);
  if (abstracts.length) body.append(el('div', 'b4-event-abstract', ...abstracts));
  return el('div', 'b4-events-item', el('div', 'b4-event b4-event-news', body));
}

function buildCard(row) {
  const cells = [...row.children];
  const pic = row.querySelector('picture') || row.querySelector('img');
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = row.querySelector('a[href]');
  const dateCell = cells.find((c) => !c.contains(heading)) || null;
  if (!dateCell && !pic && cells.length === 1) return buildNewsCard(cells[0], heading, link);
  // move the photo out first, so a paragraph that wrapped it keeps its date text (EW)
  const media = el('div', pic ? 'b4-event-media photo' : 'b4-event-media red');
  if (pic) media.append(el('div', 'b4-event-pic', pic));
  const dates = dateCell ? [...dateCell.querySelectorAll(':scope > p')]
    .filter((p) => text(p)) : [];
  const bodyCell = cells.find((c) => c.contains(heading)) || cells[cells.length - 1];
  const paras = [...bodyCell.querySelectorAll(':scope > p')].filter((p) => text(p));
  const category = paras[0];
  const location = paras.length >= 3 ? paras[paras.length - 1] : null;
  const hours = paras.find((p) => p !== category && p !== location && HOURS_RE.test(text(p)));
  const abstracts = paras.filter((p) => p !== category && p !== location && p !== hours);

  const date = el('div', 'b4-event-date');
  if (dates.length === 4) {
    // cross-month range (newsroom): two lines, each day + month inline
    date.classList.add('range');
    date.append(
      el('div', 'b4-event-line', el('div', 'b4-event-day', dates[0]), el('div', 'b4-event-month', dates[1])),
      el('div', 'b4-event-line', el('div', 'b4-event-day', dates[2]), el('div', 'b4-event-month', dates[3])),
    );
  } else {
    if (dates[0]) date.append(el('div', 'b4-event-day', dates[0]));
    dates.slice(1).forEach((d) => date.append(el('div', 'b4-event-month', d)));
  }
  media.append(date);
  const head = el('div', 'b4-event-head', media);
  const body = el('div', 'b4-event-body');
  if (heading) body.append(el('div', 'b4-event-title', heading));
  if (category) body.append(el('div', 'b4-event-category', category));
  if (abstracts.length) body.append(el('div', 'b4-event-abstract', ...abstracts));
  if (hours) body.append(el('div', 'b4-event-hours', glyph(), hours));
  if (location) body.append(el('div', 'b4-event-loc', glyph(), location));
  return el('div', 'b4-events-item', el('div', 'b4-event', ...linked(link, [head, body])));
}

function bindWall(grid) {
  const layout = () => {
    const w = window.innerWidth;
    grid.querySelectorAll('.b4-events-item').forEach((item) => {
      if (w < 768) {
        item.style.gridRowEnd = '';
        return;
      }
      const card = item.firstElementChild;
      const mb = px(getComputedStyle(item).marginBottom);
      item.style.gridRowEnd = `span ${Math.ceil((card.getBoundingClientRect().height + mb) / 5) + 1}`;
    });
  };
  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  if (window.ResizeObserver) {
    // the spans fix the wall height, so a card growing on the late webfont swap does not resize the
    // wall: watch every card too, or the masonry keeps the fallback-font spans (fix-4brands-3)
    const ro = new ResizeObserver(layout);
    ro.observe(grid);
    grid.querySelectorAll('.b4-event').forEach((card) => ro.observe(card));
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-events-grid')) return;
  ensureParagraphs(block);
  const wall = el('div', 'b4-events-wall');
  [...block.children].forEach((row) => {
    if (text(row) || row.querySelector('picture, img')) wall.append(buildCard(row));
  });
  block.replaceChildren(el('div', 'b4-events-grid r-grid', el('div', 'b4-events-cell r-cell', wall)));
  bindWall(wall);
}
