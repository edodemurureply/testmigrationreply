/**
 * aise-agents — /en/ai-powered-software-engineering "AI Agents" rail (live
 * slider-with-title-runtime, data-variation "3 items", data-infinite, section .hehguvzytx): each
 * item is a fixed-height intro column (100 px icon, lead-face title, centred copy) above a white
 * bordered card (16:9 image, title, full-width filled button). The band is clear over its upper
 * half and ink (#151f27) below. One item per view (100% - 80px) below 768, two >= 768, three
 * >= 1024; when every item fits the rail is centred and static (.all-displayed) and the prev /
 * next round buttons hide, as the source runtime does.
 *
 * Authoring: one row per item, two cells (classified by content, defensive):
 *   intro cell — icon picture | title paragraph | copy paragraph(s);
 *   card cell — picture | heading (optionally linked) | link paragraph (the button).
 * A row with a single cell is read as a card when it holds a heading, else as an intro.
 */

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

const ARROW = {
  prev: 'M7.20537 6.37206L3.87204 9.70539L3.57741 10L3.87204 10.2946L7.20537 13.628L7.79462 13.0387'
    + 'L5.17259 10.4167H17.0833V9.58335H5.17259L7.79462 6.96131L7.20537 6.37206Z',
  next: 'M13.4554 6.37206L16.7887 9.70539L17.0833 10L16.7887 10.2946L13.4554 13.628L12.8661 13.0387'
    + 'L15.4881 10.4167H3.57739V9.58335H15.4881L12.8661 6.96131L13.4554 6.37206Z',
};

function arrowButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `aise-agents-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev item' : 'Next item');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

const isLinkOnly = (n) => n.tagName === 'P' && n.querySelector('a[href]')
  && n.textContent.trim() === n.querySelector('a[href]').textContent.trim();

function buildIntro(cell) {
  const intro = el('div', 'aise-agents-intro');
  if (!cell) return intro;
  const nodes = [...cell.children];
  const pic = nodes.find((n) => n.tagName === 'PICTURE' || n.querySelector('picture, img'));
  if (pic) intro.append(el('div', 'aise-agents-icon', pic));
  const texts = nodes.filter((n) => n !== pic && n.textContent.trim());
  texts.forEach((n, i) => {
    n.classList.add(i ? 'aise-agents-copy' : 'aise-agents-title');
    intro.append(n);
  });
  return intro;
}

function buildCard(cell) {
  const card = el('div', 'aise-agents-card');
  if (!cell) return card;
  const nodes = [...cell.children];
  const pic = nodes.find((n) => n.tagName === 'PICTURE' || (n.querySelector('picture, img')
    && !n.textContent.trim()));
  if (pic) card.append(el('div', 'aise-agents-image', pic));
  const body = el('div', 'aise-agents-body');
  nodes.filter((n) => n !== pic).forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) n.classList.add('aise-agents-heading');
    else if (isLinkOnly(n)) n.classList.add('aise-agents-cta');
    body.append(n);
  });
  card.append(body);
  return card;
}

function bindRail(block) {
  const track = block.querySelector('.aise-agents-items');
  const items = [...track.children];
  const prev = block.querySelector('.aise-agents-prev');
  const next = block.querySelector('.aise-agents-next');
  let index = 0;
  const render = () => {
    track.style.transform = '';
    const last = items[items.length - 1];
    const view = track.parentElement.getBoundingClientRect();
    const all = !last || last.getBoundingClientRect().right <= view.right + 0.5;
    block.classList.toggle('all-displayed', all);
    if (all) index = 0;
    index = ((index % items.length) + items.length) % items.length;
    const step = items.length > 1
      ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
    track.style.transform = index ? `translateX(${-index * step}px)` : '';
  };
  const go = (d) => {
    if (block.classList.contains('all-displayed')) return;
    index += d; // the live rail is infinite: it wraps around at both ends
    render();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  let startX = null;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  track.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });
  window.addEventListener('resize', () => { index = 0; render(); });
  render();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .aise-agents-rail')) return;
  const track = el('ul', 'aise-agents-items');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    let introCell = cells[0];
    let cardCell = cells[1];
    if (cells.length === 1) {
      const isCard = !!cells[0].querySelector('h1, h2, h3, h4, h5, h6');
      introCell = isCard ? null : cells[0];
      cardCell = isCard ? cells[0] : null;
    }
    track.append(el('li', 'aise-agents-item', buildIntro(introCell), buildCard(cardCell)));
  });
  const nav = el('div', 'aise-agents-nav', arrowButton('prev'), arrowButton('next'));
  block.replaceChildren(el('div', 'aise-agents-rail', el('div', 'aise-agents-viewport', track), nav));
  bindRail(block);
}
