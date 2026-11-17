/**
 * tension — research "tension" row: an intro (kicker heading, lead, text, data source) over three
 * chart columns (title, chart image, note) (reply.com editorial template, sections .ed-tension).
 *
 * Decode: intro template-slotted; charts reconstructive (one chart per row after the intro row).
 * Authored nodes are MOVED by role; each paragraph keeps its tag.
 *
 * Authoring rows:
 *   1. intro: Heading 2 kicker ("Tension 1"), lead paragraph, text paragraphs, source paragraph
 *      (the paragraph holding the data-source link)
 *   2..n. chart: title paragraph, chart image, note paragraph
 *
 * @variants orange | green | blue | magenta — chart title and note colour.
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

// a cell's content units: elements, or the cell itself when it holds bare text only
function units(cell) {
  const els = [...cell.children];
  return els.length ? els : [cell];
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
const isMediaEl = (n) => ['PICTURE', 'IMG'].includes(n.tagName);

function buildIntro(row) {
  const intro = div('intro');
  const nodes = [...row.children].flatMap(units).filter((n) => n.textContent.trim());
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const rest = nodes.filter((n) => n !== heading);
  if (heading) {
    intro.append(div('kicker', heading));
    intro.append(spacer('sp-intro'));
  }
  const source = rest.length > 1 ? rest.findLast((n) => n.querySelector('a')) : null;
  const text = div('intro-text');
  rest.forEach((n, i) => {
    let role = 'text';
    if (i === 0) role = 'lead';
    else if (n === source) role = 'source';
    text.append(div(role, n));
  });
  intro.append(text);
  return intro;
}

function buildChart(row, index) {
  const chart = div(`chart chart-${index}`, spacer('sp-chart'));
  const nodes = [...row.children].flatMap(units);
  let seenMedia = false;
  nodes.forEach((n) => {
    if (isMediaEl(n) || isMedia(n)) {
      const pic = isMediaEl(n) ? n : (n.querySelector('picture') || n.querySelector('img'));
      chart.append(div('pic', pic), spacer('sp-chart'));
      seenMedia = true;
    } else if (n.textContent.trim()) {
      chart.append(div(seenMedia ? 'chart-note' : 'chart-title', n));
    }
  });
  return chart;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .grid')) return;
  const rows = [...block.children];
  if (!rows.length) return;
  const introIdx = rows.findIndex((r) => r.querySelector('h1, h2, h3, h4, h5, h6'));
  const grid = div('grid');
  let n = 0;
  rows.forEach((row, i) => {
    if (i === introIdx) grid.append(buildIntro(row));
    else if (row.textContent.trim() || row.querySelector('picture, img')) {
      n += 1;
      grid.append(buildChart(row, n));
    }
  });
  block.replaceChildren(grid);
}
