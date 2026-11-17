/**
 * labs — "Discover our labs" info-card slider (reply.com hub, card-carousel--info +
 * reply-card--info): 1:1 image cards with a white category label, a plus glyph and the title;
 * the abstract replaces the title on hover (fine pointer) or on tap (coarse pointer, checkbox
 * toggle). Cards are centred and the slider is static when every card fits (.all-displayed);
 * otherwise prev / next arrows (>= 1024) or a swipe move one card (transform 1s ease-in-out).
 *
 * Decode: reconstructive, one row per card, cells classified by content:
 *   picture (optional second picture = the <= 576 crop) | category paragraph (before the heading) |
 *   heading with the card link | abstract paragraph(s) after the heading.
 * @variants ice — en-insights acknowledgments rail: no grid inset (track padding only);
 *   scale — reply-card-slider-scale: 2:3 cards on a looping rail, the first card centred and
 *   scaled 1.125 >= 1024 (the live centred active slide)
 *   autoplay (with simple) — the live infinite autoplay rail: clone sets, one card per 5 s
 *   (interval-<ms>), pause on hover; inview (simple or scale) — the autoplay clock starts when
 *   the rail is on screen
 * EW6: the card link is read, the authored anchor unwrapped, and one new anchor wraps the title
 * and abstract slots (as the source anchor does).
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

const ARROW = {
  prev: 'M7.20537 6.37206L3.87204 9.70539L3.57741 10L3.87204 10.2946L7.20537 13.628L7.79462 13.0387'
    + 'L5.17259 10.4167H17.0833V9.58335H5.17259L7.79462 6.96131L7.20537 6.37206Z',
  next: 'M13.4554 6.37206L16.7887 9.70539L17.0833 10L16.7887 10.2946L13.4554 13.628L12.8661 13.0387'
    + 'L15.4881 10.4167H3.57739V9.58335H15.4881L12.8661 6.96131L13.4554 6.37206Z',
};

function arrowButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `labs-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev card' : 'Next card');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
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

  const image = el('div', 'reply-card-image');
  imgs.forEach((p, i) => {
    let cls = 'reply-card-pic';
    if (imgs.length > 1) cls += i ? ' mobile' : ' desktop';
    image.append(el('div', cls, p));
  });
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'reply-card-toggle';
  toggle.setAttribute('aria-label', `Show details: ${text(heading)}`);

  const body = el('div', 'reply-card-body');
  cats.forEach((n) => body.append(el('div', 'category-label', el('div', 'category-name', n))));
  const plus = el('div', 'reply-card-plus', el('span'), el('span'));
  plus.setAttribute('aria-hidden', 'true');
  body.append(plus);
  const slots = [];
  if (heading) slots.push(el('div', 'reply-card-title', heading));
  if (abstracts.length) slots.push(el('div', 'reply-card-abstract', ...abstracts));
  let content;
  if (link) {
    const a = el('a', 'reply-card-link', ...slots);
    a.href = link.getAttribute('href');
    a.title = text(heading);
    link.replaceWith(...link.childNodes);
    content = el('div', 'reply-card-content', a);
  } else {
    content = el('div', 'reply-card-content', ...slots);
  }
  body.append(content);
  const card = el('div', 'reply-card reply-card-info', el('div', 'reply-card-image-container', toggle, image, body));
  return el('li', 'labs-item', card);
}

const px = (v) => parseFloat(v) || 0;

function bindSlider(block) {
  const track = block.querySelector('.labs-track');
  const items = [...track.children];
  const prev = block.querySelector('.labs-prev');
  const next = block.querySelector('.labs-next');
  let index = 0;
  const fits = () => {
    const gap = px(getComputedStyle(track).columnGap);
    const total = items.reduce((s, it) => s + it.getBoundingClientRect().width, 0)
      + gap * (items.length - 1);
    return total <= track.parentElement.getBoundingClientRect().width + 0.5;
  };
  const render = (animate = true) => {
    block.classList.toggle('all-displayed', fits());
    index = Math.max(0, Math.min(index, items.length - 1));
    const step = items.length > 1
      ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = index ? `translateX(${-index * step}px)` : '';
    items.forEach((it, i) => it.classList.toggle('active', i === index));
    prev.disabled = index === 0;
    next.disabled = index >= items.length - 1;
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

// scale (reply-card-slider-scale): looping rail, the active card centred (scaled up >= 1024);
// loop clones are presentational (aria-hidden, inert)
function bindScale(block) {
  const track = block.querySelector('.labs-track');
  const real = [...track.children];
  const n = real.length;
  const clone = (it) => {
    const c = it.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.inert = true;
    c.classList.add('clone');
    return c;
  };
  track.prepend(...real.map(clone));
  track.append(...real.map(clone));
  const items = [...track.children];
  let index = n;
  const render = (animate = true) => {
    const it = items[index];
    const vw = track.parentElement.getBoundingClientRect().width;
    const x = vw / 2 - (it.offsetLeft + it.offsetWidth / 2);
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(${x}px)`;
    items.forEach((el2, i) => el2.classList.toggle('active', i === index));
  };
  const go = (d) => {
    index += d;
    render();
    if (index < n || index >= 2 * n) {
      setTimeout(() => {
        index = ((index - n + n) % n) + n;
        render(false);
      }, 1000);
    }
  };
  block.querySelector('.labs-prev').addEventListener('click', () => go(-1));
  block.querySelector('.labs-next').addEventListener('click', () => go(1));
  // autoplay (fix-hub-e, live data-carousel-autoplay on the scale rail): one card every 5 s
  // (interval-<ms>), pause on hover / hidden tab / reduced motion
  if (block.classList.contains('autoplay')) {
    const iv = [...block.classList].find((c) => /^interval-\d+$/.test(c));
    const every = iv ? Math.max(1000, parseInt(iv.slice(9), 10)) : 5000;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    const stop = () => clearInterval(timer);
    const play = () => {
      stop();
      timer = setInterval(() => {
        if (!reduce.matches && !document.hidden) go(1);
      }, every);
    };
    block.addEventListener('mouseover', stop);
    block.addEventListener('mouseout', play);
    // inview (fix-hub-h, with scale autoplay): the clock starts once the rail is on screen (live
    // en/3d-and-mixed-reality holds 3D Platform, 3 steps in, where a load-time clock ran 5)
    if (block.classList.contains('inview') && window.IntersectionObserver) {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        play();
      });
      io.observe(block);
    } else play();
  }
  window.addEventListener('resize', () => render(false));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
  // the section is display:none while it loads: centre again once the rail has a size
  new ResizeObserver(() => render(false)).observe(track.parentElement);
  render(false);
}

// autoplay (simple, live data-carousel-autoplay + data-infinite): a looping rail — a clone set on
// each side, one card every 5 s (interval-<ms>: live data-carousel-autoplay-interval), 1 s slide,
// pause on hover / hidden tab / reduced motion; static (no clones shown) when every card fits.
// peek keeps the previous card at the left edge (the track's negative margin). Clones are inert.
function bindAutoLoop(block) {
  const track = block.querySelector('.labs-track');
  const real = [...track.children];
  const n = real.length;
  if (!n) return;
  const clone = (it) => {
    const c = it.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.inert = true;
    c.classList.add('clone');
    c.querySelectorAll('[id]').forEach((x) => x.removeAttribute('id'));
    return c;
  };
  track.prepend(...real.map(clone));
  track.append(...real.map(clone));
  const items = [...track.children];
  let index = n;
  let allFit = false;
  // peek: the track's negative margin already shifts one card left (see labs.css)
  const peek = block.classList.contains('peek') ? 1 : 0;
  const render = (animate = true) => {
    const gap = px(getComputedStyle(track).columnGap);
    const w = real[0].getBoundingClientRect().width;
    const total = n * w + gap * (n - 1);
    allFit = total <= track.parentElement.getBoundingClientRect().width + 0.5;
    block.classList.toggle('all-displayed', allFit);
    const step = w + gap;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = allFit ? '' : `translateX(${-(index - peek) * step}px)`;
    items.forEach((it, i) => it.classList.toggle('active', i === index));
  };
  let busy = false;
  const go = (d) => {
    if (allFit || busy) return;
    busy = true;
    index += d;
    render();
    setTimeout(() => {
      busy = false;
      if (index >= 2 * n || index < n) {
        index = ((((index - n) % n) + n) % n) + n;
        render(false);
      }
    }, 1000);
  };
  block.querySelector('.labs-prev').addEventListener('click', () => go(-1));
  block.querySelector('.labs-next').addEventListener('click', () => go(1));
  const iv = [...block.classList].find((c) => /^interval-\d+$/.test(c));
  const every = iv ? Math.max(1000, parseInt(iv.slice(9), 10)) : 5000;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  const stop = () => clearInterval(timer);
  const play = () => {
    stop();
    timer = setInterval(() => {
      if (!reduce.matches && !document.hidden) go(1);
    }, every);
  };
  block.addEventListener('mouseover', stop);
  block.addEventListener('mouseout', play);
  // inview: the clock starts once the rail is on screen (live captures hold the first card, or
  // one step past it, when the rail scrolls into view; a load-time clock runs several steps ahead)
  if (block.classList.contains('inview') && window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      play();
    });
    io.observe(block);
  } else play();
  window.addEventListener('resize', () => render(false));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
  new ResizeObserver(() => render(false)).observe(track.parentElement);
  render(false);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .labs-grid')) return;
  // band spacing tokens (simple dark / light): b-<px> >= 1024, bm-<px> below
  [...block.classList].forEach((c) => {
    const m = c.match(/^(b|bm)-(\d+)$/);
    if (m) block.style.setProperty(`--labs-${m[1]}`, `${m[2]}px`);
  });
  ensureParagraphs(block);
  const track = el('ul', 'labs-track');
  [...block.children].forEach((row) => track.append(buildCard(row)));
  const controls = el('div', 'labs-controls', arrowButton('prev'), arrowButton('next'));
  const inner = el('div', 'labs-inner', el('div', 'labs-viewport', track), controls);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(el('div', 'labs-grid r-grid', el('div', 'labs-cell r-cell', inner)));
  const auto = block.classList.contains('simple') && block.classList.contains('autoplay');
  if (block.classList.contains('scale')) bindScale(block);
  else if (auto) bindAutoLoop(block);
  else bindSlider(block);
  // peek: the looped rail shows the last card left of the first (presentational clone)
  if (!auto && block.classList.contains('peek') && track.children.length > 1) {
    const c = track.lastElementChild.cloneNode(true);
    c.classList.add('clone');
    c.setAttribute('aria-hidden', 'true');
    c.inert = true;
    track.prepend(c);
  }
}
