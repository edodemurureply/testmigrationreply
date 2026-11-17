/**
 * cloud-info-rail — en/cloud-computing "Journey to Cloud" rail: the live slider-with-title
 * (data-variation "3 items", not infinite) of reply-card card-info-slider-2-3 cards — a photo card
 * (2:3) under a 32 % black veil with the white category label and plus glyph on
 * top and the bold title at the foot; the abstract replaces the title on hover (fine pointer) or
 * tap (coarse pointer, checkbox toggle). Items 100% - 80px < 768, 2 per view >= 768, 3 per view
 * >= 1024; when every card fits the rail is centred and static (.all-displayed), otherwise round
 * prev / next buttons (beside the empty title area >= 768, centred below the rail < 768).
 *
 * Decode: reconstructive, one row per card, cells classified by content: picture (optional second
 * picture = the <= 576 crop) | category paragraph(s) before the heading | heading with the card
 * link | abstract paragraph(s) after it. EW6: the card link is read, the authored anchor
 * unwrapped, one new anchor wraps the title and abstract slots (as the source anchor does).
 * @variants spacing tokens t-<px> / tm-<px> / b-<px> / bm-<px> (section padding >= 768 / < 768)
 */

const el = (tag, className, ...children) => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');

const ARROW = {
  prev: 'M7.20537 6.37206L3.87204 9.70539L3.57741 10L3.87204 10.2946L7.20537 13.628L7.79462 13.0387'
    + 'L5.17259 10.4167H17.0833V9.58335H5.17259L7.79462 6.96131L7.20537 6.37206Z',
  next: 'M13.4554 6.37206L16.7887 9.70539L17.0833 10L16.7887 10.2946L13.4554 13.628L12.8661 13.0387'
    + 'L15.4881 10.4167H3.57739V9.58335H15.4881L12.8661 6.96131L13.4554 6.37206Z',
};

function arrowButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `cloud-info-rail-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev item' : 'Next item');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

function applySpacing(block) {
  [...block.classList].forEach((c) => {
    const m = c.match(/^(t|tm|b|bm)-(\d+)$/);
    if (m) block.style.setProperty(`--sp-${m[1]}`, `${m[2]}px`);
  });
}

function buildCard(row) {
  const pics = [...row.querySelectorAll('picture')];
  const imgs = pics.length ? pics : [...row.querySelectorAll('img')];
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = row.querySelector('a[href]');
  const all = [...row.querySelectorAll(':scope > div > *')];
  const hIdx = heading ? all.indexOf(heading) : -1;
  const texts = all.filter((n) => n !== heading && n.tagName !== 'PICTURE'
    && !n.querySelector('picture, img') && text(n));
  const cats = texts.filter((n) => hIdx >= 0 && all.indexOf(n) < hIdx);
  const abstracts = texts.filter((n) => !cats.includes(n));

  const image = el('div', 'cloud-info-rail-image');
  imgs.forEach((p, i) => {
    let cls = 'cloud-info-rail-pic';
    if (imgs.length > 1) cls += i ? ' mobile' : ' desktop';
    image.append(el('div', cls, p));
  });
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'cloud-info-rail-toggle';
  toggle.setAttribute('aria-label', `Show details: ${text(heading)}`);
  const body = el('div', 'cloud-info-rail-body');
  body.append(el('div', 'cloud-info-rail-label', ...cats));
  const plus = el('div', 'cloud-info-rail-plus', el('span'), el('span'));
  plus.setAttribute('aria-hidden', 'true');
  body.append(plus);
  const slots = [];
  if (heading) slots.push(el('div', 'cloud-info-rail-title', heading));
  if (abstracts.length) slots.push(el('div', 'cloud-info-rail-abstract', ...abstracts));
  let content;
  if (link) {
    const a = el('a', 'cloud-info-rail-link', ...slots);
    a.href = link.getAttribute('href');
    a.title = text(heading);
    link.replaceWith(...link.childNodes);
    content = el('div', 'cloud-info-rail-content', a);
  } else {
    content = el('div', 'cloud-info-rail-content', ...slots);
  }
  body.append(content);
  const card = el('div', 'cloud-info-rail-card', toggle, image, body);
  return el('li', 'cloud-info-rail-item', card);
}

const px = (v) => parseFloat(v) || 0;

function bind(block) {
  const track = block.querySelector('.cloud-info-rail-items');
  const items = [...track.children];
  const prev = block.querySelector('.cloud-info-rail-prev');
  const next = block.querySelector('.cloud-info-rail-next');
  let index = 0;
  const cs = () => getComputedStyle(track);
  const fits = () => {
    const total = items.reduce((s, it) => s + it.getBoundingClientRect().width, 0)
      + px(cs().columnGap) * (items.length - 1) + px(cs().paddingLeft) * 2;
    // fix-hub-m: 1 px slack — three 410.67 px cards + gaps + insets sum to 1440-1441 px at 1440
    // depending on rounding, so the state flipped between captures (live: all displayed)
    return total <= track.parentElement.getBoundingClientRect().width + 1.5;
  };
  const perView = () => {
    const w = track.parentElement.getBoundingClientRect().width;
    const iw = items[0] ? items[0].getBoundingClientRect().width : w;
    return Math.max(1, Math.floor((w - px(cs().paddingLeft) + px(cs().columnGap))
      / (iw + px(cs().columnGap))));
  };
  const render = (animate = true) => {
    block.classList.toggle('all-displayed', fits());
    if (block.classList.contains('all-displayed')) index = 0;
    index = Math.max(0, Math.min(index, Math.max(0, items.length - perView())));
    const step = items.length > 1
      ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = index ? `translateX(${-index * step}px)` : '';
    prev.disabled = index === 0;
    next.disabled = index >= items.length - perView();
  };
  const go = (d) => {
    if (block.classList.contains('all-displayed')) return;
    index += d;
    render();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  let startX = null;
  track.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
  });
  track.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });
  window.addEventListener('resize', () => render(false));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
  render(false);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .cloud-info-rail-rail')) return;
  applySpacing(block);
  const track = el('ul', 'cloud-info-rail-items');
  [...block.children].forEach((row) => {
    if (row.querySelector('picture, img, h1, h2, h3, h4, h5, h6')) track.append(buildCard(row));
  });
  const nav = el('div', 'cloud-info-rail-nav', arrowButton('prev'), arrowButton('next'));
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(
    el('div', 'cloud-info-rail-text'),
    el('div', 'cloud-info-rail-rail', el('div', 'cloud-info-rail-viewport', track)),
    el('div', 'cloud-info-rail-controls r-grid', nav),
  );
  bind(block);
}
