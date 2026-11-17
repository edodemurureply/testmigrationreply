/**
 * b4-tabber — 4brands "cards tabber" (cards-tabber-runtime): a row of icon cards acting as tabs
 * over a text panel, on a dark band. Reconstructive: one row per tab.
 *
 * Authoring rows (one per tab): cell 1 icon picture | cell 2 tab label | cell 3 panel content.
 * Panel content is classified, not positional: the first paragraph is the panel title, a list is
 * the benefit list, the paragraph right before the list is its label, every other node is text.
 *
 * Behaviour: tab click / Enter / Space / arrow keys select a panel (accent bar enters from the
 * side it came from); prev/next step the active tab and slide the row one card when it overflows;
 * when every card fits, the row is centred and the arrows hide (.all-displayed).
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

function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
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
  b.className = `b4-tabber-${dir} round-bt`;
  b.setAttribute('aria-label', dir === 'prev' ? 'Prev card' : 'Next card');
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${ARROW[dir]}"/></svg>`;
  return b;
}

const px = (v) => parseFloat(v) || 0;
let instances = 0;

function buildPanel(cell) {
  const nodes = cell ? [...cell.children] : [];
  const body = div('b4-tabber-body');
  const listIdx = nodes.findIndex((n) => n.tagName === 'UL' || n.tagName === 'OL');
  const label = listIdx > 0 && nodes[listIdx - 1].tagName === 'P' ? nodes[listIdx - 1] : null;
  const title = nodes.find((n) => n !== label && /^(P|H[2-6])$/.test(n.tagName));
  const titleIsLead = title && nodes.length > 1;
  let textBox = null;
  nodes.forEach((n) => {
    if (n === title && titleIsLead) {
      body.append(div('b4-tabber-title', n));
    } else if (n === label) {
      body.append(div('b4-tabber-label', n));
    } else if (n.tagName === 'UL' || n.tagName === 'OL') {
      body.append(div('b4-tabber-list', n));
      textBox = null;
    } else {
      if (!textBox) {
        textBox = div('b4-tabber-text');
        body.append(textBox);
      }
      textBox.append(n);
    }
  });
  return body;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-tabber-grid')) return;
  ensureParagraphs(block);
  instances += 1;
  const uid = `b4-tabber-${instances}`;
  const rows = [...block.children];

  const nav = document.createElement('ul');
  nav.className = 'b4-tabber-nav';
  nav.setAttribute('role', 'tablist');
  const panels = [];
  const tabs = rows.map((row, i) => {
    const cells = [...row.children];
    const media = cells.find((c) => c.querySelector('picture, img'));
    const rest = cells.filter((c) => c !== media);
    const labelCell = rest[0];
    const panelCell = rest[1];
    const li = document.createElement('li');
    li.className = 'b4-tabber-tab';
    li.id = `${uid}-tab-${i + 1}`;
    li.setAttribute('role', 'tab');
    li.setAttribute('aria-controls', `${uid}-panel-${i + 1}`);
    const card = div('b4-tabber-card');
    const pic = media && media.querySelector('picture, img');
    if (pic) card.append(div('b4-tabber-iconbox', pic), div('b4-tabber-gap'));
    if (labelCell) card.append(div('b4-tabber-name', ...labelCell.children));
    li.append(card);
    nav.append(li);

    const panel = div('b4-tabber-panel', buildPanel(panelCell));
    panel.id = `${uid}-panel-${i + 1}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', li.id);
    panels.push(panel);
    return li;
  });

  const prev = arrowButton('prev');
  const next = arrowButton('next');
  const wrap = div('b4-tabber-nav-wrap', nav);
  const grid = div('b4-tabber-grid', div('b4-tabber-controls', prev, next), wrap, ...panels);
  grid.style.setProperty('--tabs-count', String(tabs.length));
  block.replaceChildren(grid);

  let index = 0;
  const fits = () => {
    if (!wrap.getBoundingClientRect().width) return grid.classList.contains('all-displayed');
    grid.classList.remove('all-displayed');
    const gap = px(getComputedStyle(nav).columnGap);
    const total = tabs.reduce((s, t) => s + t.getBoundingClientRect().width, 0)
      + gap * (tabs.length - 1);
    return total <= wrap.getBoundingClientRect().width + 0.5;
  };
  const render = (animate = true) => {
    const all = fits();
    grid.classList.toggle('all-displayed', all);
    tabs.forEach((t, i) => {
      const on = i === index;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[i].classList.toggle('is-active', on);
    });
    const step = tabs.length > 1
      ? tabs[1].getBoundingClientRect().left - tabs[0].getBoundingClientRect().left : 0;
    nav.style.transition = animate ? '' : 'none';
    nav.style.transform = !all && index ? `translateX(${-index * step}px)` : '';
    prev.disabled = index === 0;
    next.disabled = index >= tabs.length - 1;
  };
  const select = (i) => {
    if (i === index) return;
    tabs.forEach((t) => t.classList.remove('enter-left', 'enter-right'));
    // live: the accent bar enters from the side it came from
    tabs[i].classList.add(i > index ? 'enter-left' : 'enter-right');
    index = i;
    render();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(i);
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const d = e.key === 'ArrowRight' ? 1 : -1;
        select(Math.max(0, Math.min(tabs.length - 1, index + d)));
        tabs[index].focus();
      }
    });
  });
  prev.addEventListener('click', () => select(Math.max(0, index - 1)));
  next.addEventListener('click', () => select(Math.min(tabs.length - 1, index + 1)));
  window.addEventListener('resize', () => render(false));
  // the section is laid out after decorate(): measure again once the row has a width
  if (window.ResizeObserver) new ResizeObserver(() => render(false)).observe(wrap);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
  render(false);
}
