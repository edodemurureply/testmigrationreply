/**
 * rose-cta — ROSE banner (reply.com hub, .rose-banner): gradient band with the ROSE logo, title,
 * abstract and "Go to ROSE" button, beside a card slider of expert sessions closed by an
 * "Ask Rose" contact card. Prev / next move one card (transform 1s ease-in-out); cards scrolled
 * out of view get .out (opacity 0, .5 s), as on the source.
 *
 * Decode: the intro is template-slotted (logo picture | title heading | abstract | CTA paragraph);
 * the cards are reconstructive, one row per card:
 *   picture | label paragraph (before the heading) | heading with the session link |
 *   meta paragraph (after the heading) | optional CTA paragraph (a link alone in a paragraph).
 * The intro row is the row holding the highest-level heading; every other row is a card.
 * The contact card's bell glyph is decorative CSS (rose-bell.svg), no authored content.
 * @variants band — index closing band (no cards): logo | display paragraph | CTA, centred column.
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
const level = (row) => {
  const h = row.querySelector('h1, h2, h3, h4, h5, h6');
  return h ? Number(h.tagName[1]) : 9;
};
// a paragraph whose only content is one link (EDS button or plain)
const isCta = (n) => n.tagName === 'P' && n.querySelector('a[href]')
  && text(n) === text(n.querySelector('a[href]'));

const ARROW = {
  prev: 'M7.20537 6.37206L3.87204 9.70539L3.57741 10L3.87204 10.2946L7.20537 13.628L7.79462 13.0387'
    + 'L5.17259 10.4167H17.0833V9.58335H5.17259L7.79462 6.96131L7.20537 6.37206Z',
  next: 'M13.4554 6.37206L16.7887 9.70539L17.0833 10L16.7887 10.2946L13.4554 13.628L12.8661 13.0387'
    + 'L15.4881 10.4167H3.57739V9.58335H15.4881L12.8661 6.96131L13.4554 6.37206Z',
};

function arrowButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `rose-cta-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev item' : 'Next item');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

function buildIntro(row) {
  const content = el('div', 'rose-cta-content');
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  nodes.forEach((n) => {
    if (n.tagName === 'PICTURE' || (n.querySelector('picture, img') && !text(n))) {
      content.append(el('div', 'rose-cta-logo', n));
    } else if (/^H[1-6]$/.test(n.tagName)) {
      content.append(el('div', 'rose-cta-title', n));
    } else if (isCta(n)) {
      content.append(el('div', 'rose-cta-action', n));
    } else if (text(n)) {
      content.append(el('div', 'rose-cta-abstract', n));
    }
  });
  return content;
}

function buildCard(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const hIdx = nodes.indexOf(heading);
  const pic = nodes.find((n) => n.tagName === 'PICTURE' || (n.querySelector('picture, img') && !text(n)));
  const textBox = el('div', 'rose-card-text');
  const card = el('li', 'rose-card');
  if (!pic) card.classList.add('rose-card-contact');
  if (!pic) textBox.append(el('div', 'rose-card-icon'));
  nodes.forEach((n, i) => {
    if (n === pic || n === heading) {
      if (n === heading) textBox.append(el('div', 'rose-card-title', n));
      return;
    }
    if (isCta(n)) textBox.append(el('div', 'rose-card-action', n));
    else if (text(n)) {
      textBox.append(el('div', `rose-card-label ${i < hIdx ? 'top' : 'bottom'}`, n));
    }
  });
  const link = heading && heading.querySelector('a[href]');
  const parts = pic ? [el('div', 'rose-card-image', pic), textBox] : [textBox];
  if (link) {
    // EW6 card-as-link: read the href, unwrap the authored anchor, one anchor wraps the card
    const a = el('a', 'rose-card-link', ...parts);
    a.href = link.getAttribute('href');
    a.title = text(heading);
    if (/^https?:/.test(a.getAttribute('href')) && a.host !== window.location.host) {
      a.target = '_blank';
      a.rel = 'noreferrer';
    }
    link.replaceWith(...link.childNodes);
    card.append(a);
  } else {
    card.append(...parts);
  }
  return card;
}

const px = (v) => parseFloat(v) || 0;

function bindSlider(block) {
  const track = block.querySelector('.rose-cta-track');
  const slider = block.querySelector('.rose-cta-slider');
  const items = [...track.children];
  const prev = block.querySelector('.rose-cta-prev');
  const next = block.querySelector('.rose-cta-next');
  let index = 0;
  const perView = () => {
    const gap = px(getComputedStyle(track).columnGap);
    const w = items[0].getBoundingClientRect().width;
    return Math.max(1, Math.round((slider.getBoundingClientRect().width + gap) / (w + gap)));
  };
  const render = (animate = true) => {
    if (!items.length) return;
    const pv = perView();
    const max = Math.max(0, items.length - pv);
    index = Math.max(0, Math.min(index, max));
    const step = items.length > 1
      ? items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left : 0;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = index ? `translateX(${-index * step}px)` : '';
    items.forEach((it, i) => {
      it.classList.toggle('active', i === index);
      it.classList.toggle('out', index > 0 && (i < index || i >= index + pv));
    });
    prev.disabled = index === 0;
    next.disabled = index >= max;
  };
  prev.addEventListener('click', () => {
    index -= 1;
    render();
  });
  next.addEventListener('click', () => {
    index += 1;
    render();
  });
  let startX = null;
  slider.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
  });
  slider.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) {
      index += dx < 0 ? 1 : -1;
      render();
    }
  });
  window.addEventListener('resize', () => render(false));
  render(false);
}

// band (index closing "Go to ROSE" band): one centred column of spacer 40 | logo | display line |
// spacer 20 | button | spacer 40 on the pink -> orange gradient; nodes classified by content
function decorateBand(block) {
  const col = el('div', 'rose-cta-col');
  const spacer = (h) => el('div', `rose-cta-spacer h${h}`);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const logo = nodes.filter((n) => n.tagName === 'PICTURE' || (n.querySelector('picture, img') && !text(n)));
  const ctas = nodes.filter((n) => !logo.includes(n) && isCta(n));
  const lines = nodes.filter((n) => !logo.includes(n) && !ctas.includes(n) && text(n));
  col.append(spacer(40));
  if (logo.length) col.append(el('div', 'rose-cta-logo', el('div', 'rose-cta-logo-box', ...logo)));
  if (lines.length) col.append(el('div', 'rose-cta-text', ...lines));
  col.append(spacer(20));
  if (ctas.length) col.append(el('div', 'rose-cta-action', ...ctas));
  col.append(spacer(40));
  block.replaceChildren(el('div', 'rose-cta-band r-grid', col));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .rose-cta-grid')) return;
  ensureParagraphs(block);
  if (block.classList.contains('band')) {
    decorateBand(block);
    return;
  }
  const rows = [...block.children];
  const top = Math.min(...rows.map(level));
  const introRow = rows.find((r) => level(r) === top);
  const content = introRow ? buildIntro(introRow) : el('div', 'rose-cta-content');
  const track = el('ul', 'rose-cta-track');
  rows.filter((r) => r !== introRow && (text(r) || r.querySelector('picture, img')))
    .forEach((r) => track.append(buildCard(r)));
  const nav = el('div', 'rose-cta-nav', arrowButton('prev'), arrowButton('next'));
  const cards = el('div', 'rose-cta-cards', nav, el('div', 'rose-cta-slider', track));
  block.replaceChildren(el('div', 'rose-cta-grid', el('div', 'rose-cta-bg'), content, cards));
  bindSlider(block);
}
