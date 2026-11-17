/**
 * b4-offices — 4brands office finder (map-reply-offices-selector-runtime): the embedded Google map
 * (delivered live — captureState restoreAtDelivery: the prototype's static tiles become a real map)
 * and a "View office locations" button that hides the map and shows the offices list (country ->
 * city accordion -> address, phone, route link, photo). Reconstructive: one row per office.
 *
 * Authoring rows (classified by content):
 *   - map: a paragraph whose link points at Google Maps (its text = the map's attribution link)
 *   - filter label: a one-paragraph text row before the first office row (e.g. "All regions")
 *   - office: h3 country | label paragraph (e.g. "Main") | city paragraph | address / phone /
 *     route-link paragraphs | optional picture (office photo)
 *   - button label: a one-paragraph text row after the offices
 * @ew-exempt computed office count ("1 offices") next to each country heading — a number + the
 *   source's fixed unit word, derived from the rows, not authored copy.
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

const text = (node) => (node ? node.textContent.trim() : '');
const isMapLink = (a) => /(^|\.)google\.[a-z.]+$/.test(new URL(a.href).hostname)
  && /^\/maps\/?$/.test(new URL(a.href).pathname);

function roleButton(className, ...children) {
  const b = el('div', className, ...children);
  b.setAttribute('role', 'button');
  b.tabIndex = 0;
  b.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      b.click();
    }
  });
  return b;
}

function mapEmbed(link, query) {
  const src = new URL(link.href);
  const ll = src.searchParams.get('ll');
  const z = src.searchParams.get('z') || '6';
  const embed = new URL('https://maps.google.com/maps');
  embed.searchParams.set('q', query || ll || '');
  if (ll) embed.searchParams.set('ll', ll);
  embed.searchParams.set('z', z);
  embed.searchParams.set('hl', document.documentElement.lang || 'en');
  embed.searchParams.set('output', 'embed');
  const frame = document.createElement('iframe');
  frame.className = 'b4-map-frame';
  frame.src = embed.href;
  frame.loading = 'lazy';
  frame.title = 'Google Maps';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  return frame;
}

function buildOffice(row) {
  const cells = [...row.children];
  const country = row.querySelector('h1, h2, h3, h4, h5, h6');
  const pic = row.querySelector('picture') || row.querySelector('img');
  const textCells = cells.filter((c) => !c.contains(country) && !c.querySelector('picture, img')
    && text(c));
  const label = textCells.length > 2 ? textCells[0].querySelector('p') : null;
  const city = (textCells.length > 2 ? textCells[1] : textCells[0])?.querySelector('p');
  const info = textCells.slice(textCells.length > 2 ? 2 : 1)
    .flatMap((c) => [...c.querySelectorAll(':scope > p')]);
  const lines = info.filter((p) => !p.querySelector('a[href]'));
  const links = info.filter((p) => p.querySelector('a[href]'));
  const body = el('div', 'b4-office');
  const infoBox = el('div', 'b4-office-info', ...lines.map((p) => el('div', 'b4-office-line', p)));
  links.forEach((p) => {
    const a = p.querySelector('a[href]');
    a.target = '_blank';
    a.rel = 'noreferrer';
    infoBox.append(el('div', 'b4-office-route', p));
  });
  body.append(infoBox);
  if (pic) body.append(el('div', 'b4-office-img', pic));
  return {
    country, label, city, body, query: lines.slice(0, 2).map(text).join(', '),
  };
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-offices-wrap')) return;
  ensureParagraphs(block);
  const rows = [...block.children];
  let mapLink = null;
  const officeRows = [];
  let filterLabel = null;
  let buttonLabel = null;
  rows.forEach((row) => {
    const a = row.querySelector('a[href]');
    if (!officeRows.length && !mapLink && a && !row.querySelector('h1, h2, h3, h4, h5, h6')
      && isMapLink(a)) {
      mapLink = a.closest('p') || a;
    } else if (row.querySelector('h1, h2, h3, h4, h5, h6')) {
      officeRows.push(row);
    } else if (text(row)) {
      if (officeRows.length) buttonLabel = row.querySelector('p');
      else filterLabel = row.querySelector('p');
    }
  });
  const offices = officeRows.map(buildOffice);

  const cell = el('div', 'b4-offices-cell');
  const map = el('div', 'b4-map');
  if (mapLink) {
    const a = mapLink.querySelector('a') || mapLink;
    map.append(mapEmbed(a, offices[0]?.query), el('div', 'b4-map-attr', mapLink));
  }
  cell.append(map);

  const panel = el('div', 'b4-offices-panel');
  panel.hidden = true;
  if (filterLabel) {
    const li = el('li', 'is-active', filterLabel);
    panel.append(el('div', 'b4-office-filters', el('ul', 'b4-office-regions', li)));
  }
  const groups = new Map();
  offices.forEach((o) => {
    const key = text(o.country);
    if (!groups.has(key)) {
      const head = el('div', 'b4-office-country-head', o.country);
      const group = el('div', 'b4-office-country', head);
      groups.set(key, { group, head, count: 0 });
      if (o.label) group.append(el('div', 'b4-office-country-label', o.label));
      panel.append(group);
    } else if (o.country) {
      o.country.remove();
    }
    const g = groups.get(key);
    g.count += 1;
    const toggle = roleButton('b4-office-city-toggle', ...(o.city ? [o.city] : []));
    toggle.setAttribute('aria-expanded', 'false');
    const cityBody = el('div', 'b4-office-city-body', o.body);
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
    });
    g.group.append(el('div', 'b4-office-city', toggle, cityBody));
  });
  groups.forEach((g) => g.head.append(el('span', 'b4-office-count', `${g.count} offices`)));
  cell.append(panel);

  if (buttonLabel) {
    const btn = roleButton('b4-map-button', buttonLabel);
    btn.addEventListener('click', () => {
      // live: map-runtime gets .hidden, the offices list shows
      map.hidden = true;
      panel.hidden = false;
    });
    cell.append(el('div', 'b4-offices-btn', btn));
  }
  block.replaceChildren(el('div', 'b4-offices-wrap', cell));
}
