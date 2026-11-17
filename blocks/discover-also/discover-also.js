/**
 * discover-also — "Discover also" keyword rail (reply.com hub, .discover-also + card-carousel
 * --keywords): an ice panel with a kicker and a one-line rail of underline links; prev / next
 * scroll the rail one link at a time and stop once the last link is fully in view.
 *
 * Decode: template-slotted. The kicker paragraph moves into the kicker slot; the authored list of
 * links moves whole into the rail (each list item = one keyword link).
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
  b.className = `discover-also-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev card' : 'Next card');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

function bindRail(block) {
  const track = block.querySelector('.discover-also-track');
  const viewport = block.querySelector('.discover-also-viewport');
  const items = [...track.querySelectorAll('li')];
  const prev = block.querySelector('.discover-also-prev');
  const next = block.querySelector('.discover-also-next');
  let index = 0;
  const maxIndex = () => {
    const vw = viewport.getBoundingClientRect().width;
    const first = items[0].offsetLeft;
    const last = items[items.length - 1];
    for (let i = 0; i < items.length; i += 1) {
      if (last.offsetLeft + last.offsetWidth - items[i].offsetLeft + first <= vw) return i;
    }
    return items.length - 1;
  };
  // (fix-hub-f) when every link fits the rail the source hides prev / next and centres the list
  const rail = viewport.parentElement;
  const fit = () => {
    if (!items.length) return;
    const last = items[items.length - 1];
    const need = last.offsetLeft + last.offsetWidth - items[0].offsetLeft;
    block.classList.toggle('fits', window.innerWidth >= 768 && need <= rail.clientWidth);
  };
  const render = (animate = true) => {
    fit();
    if (!items.length) return;
    const max = maxIndex();
    index = Math.max(0, Math.min(index, max));
    const offset = items[index].offsetLeft - items[0].offsetLeft;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = index ? `translateX(${-offset}px)` : '';
    items.forEach((it, i) => it.classList.toggle('active', i === index));
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
  window.addEventListener('resize', () => render(false));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
  // fix-hub-h: the section is display:none while it loads (every width reads 0, so the list
  // passed as `fits`, centred and arrowless) — measure again once the rail has a size
  if (window.ResizeObserver) new ResizeObserver(() => render(false)).observe(rail);
  render(false);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .discover-also-panel')) return;
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const lists = nodes.filter((n) => n.tagName === 'UL' || n.tagName === 'OL');
  const loose = [...block.querySelectorAll(':scope > div > div')]
    .filter((c) => !c.children.length && c.textContent.trim());
  const kicker = el('div', 'discover-also-kicker');
  nodes.filter((n) => !lists.includes(n)).forEach((n) => kicker.append(n));
  loose.forEach((c) => {
    const p = document.createElement('p');
    p.append(...c.childNodes);
    kicker.append(p);
  });
  const spacer = el('div', 'discover-also-spacer');
  spacer.setAttribute('aria-hidden', 'true');
  const track = el('div', 'discover-also-track', ...lists);
  const controls = el('div', 'discover-also-controls', arrowButton('prev'), arrowButton('next'));
  const rail = el('div', 'discover-also-rail', el('div', 'discover-also-viewport', track), controls);
  const cell = el('div', 'discover-also-cell r-cell', kicker, spacer, rail);
  block.replaceChildren(el('div', 'discover-also-panel', el('div', 'discover-also-grid r-grid', cell)));
  bindRail(block);
}
