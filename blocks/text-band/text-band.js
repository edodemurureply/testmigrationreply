/**
 * text-band — centred text band: a title over one or more body groups, an optional background
 * image and an optional figure (reply.com editorial template, sections .ed-text).
 *
 * Decode: template-slotted. Cells are classified by content and MOVED whole (a single-paragraph
 * cell is delivered as bare text).
 *
 * Authoring rows:
 *   - image-only rows BEFORE the title row: background image of the band
 *   - title row: Heading 2 (or a paragraph for highlight titles)
 *   - text rows: one body group each (a spacer separates consecutive groups)
 *   - image-only rows AFTER the title row: figure under the body
 *
 * @variants ice | pendulum | framework | highlight — band look;
 *   orange | green | blue | magenta | white — title colour; large — larger highlight title.
 *
 * Sibling variants (cluster-editorial, additive — the archetype rows render as before):
 *   untitled — no title row, every text row is a body group;
 *   left | wide | split | cols | media | media-right | statement — layout on the 12-col grid;
 *   cards | cards-left | accordion | agenda | teasers — body groups as cards / collapsible items /
 *   time rows / image teasers; grey | dark | navy | black — band colour;
 *   has-bg — untitled band whose first image row is the background.
 *   A title cell holding several nodes: nodes before its last heading move to a kicker slot,
 *   nodes after it to a lead slot. With media / media-right the figures sit in their own column.
 */

function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...children);
  return d;
}

function spacer(className) {
  const s = div(className);
  s.setAttribute('aria-hidden', 'true');
  return s;
}

// the source paints heading text through an inner colour span (span.c-white); mirror it by MOVING
// the heading's child nodes into one span (the heading element itself stays the authored node)
function inkSpan(heading) {
  if (!heading || heading.querySelector(':scope > span.ink')) return;
  const s = document.createElement('span');
  s.className = 'ink';
  s.append(...heading.childNodes);
  heading.append(s);
}

const isMediaOnly = (row) => !!row.querySelector('picture, img') && !row.textContent.trim();
const media = (row) => row.querySelector('picture') || row.querySelector('img');

// split a multi-node title cell into kicker | heading | lead slots (nodes are MOVED)
function slotTitle(cell) {
  const nodes = [...cell.children];
  const heads = nodes.filter((n) => /^H[1-6]$/.test(n.tagName));
  if (nodes.length < 2 || !heads.length) return;
  // the main heading is the last one at most one rank below the highest (h2 kicker + h3 title);
  // a heading two or more ranks smaller after it is a lead (h2 title + h4 lead)
  const top = Math.min(...heads.map((h) => +h.tagName[1]));
  const last = heads.filter((h) => +h.tagName[1] <= top + 1).pop();
  const idx = nodes.indexOf(last);
  const before = nodes.slice(0, idx);
  const after = nodes.slice(idx + 1);
  if (before.length) cell.prepend(div('kicker', ...before));
  if (after.length) cell.append(div('lead', ...after));
}

// accordion: the group's first node is the header, the rest the panel (EW7: no button host)
// agenda: the group's first node is the time slot, the rest the entry
function agendaItem(cell) {
  const [time, ...rest] = [...cell.children];
  if (!time) return;
  cell.classList.add('ag-item');
  cell.append(div('ag-time', time), div('ag-what', ...rest));
}

function accordionItem(cell) {
  const [head, ...rest] = [...cell.children];
  if (!head) return;
  const icon = document.createElement('span');
  icon.className = 'acc-icon';
  icon.setAttribute('aria-hidden', 'true');
  const h = div('acc-head', head, icon);
  const panel = div('acc-panel', ...rest);
  h.setAttribute('role', 'button');
  h.setAttribute('tabindex', '0');
  h.setAttribute('aria-expanded', 'false');
  const toggle = () => {
    const open = cell.classList.toggle('open');
    h.setAttribute('aria-expanded', String(open));
  };
  h.addEventListener('click', toggle);
  h.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
  cell.classList.add('acc-item');
  cell.append(h, panel);
}

// the delivered markup is pretty-printed: a paragraph holding a picture / link / emphasis carries
// newline + indent text nodes, which `white-space: break-spaces` paints as empty lines. Drop
// those formatting-only nodes (authored text is never touched).
function dropFormattingWhitespace(block) {
  block.querySelectorAll('p, li, h2, h3, h4, h5, h6').forEach((el) => {
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && /\n/.test(n.data) && !n.data.trim()) n.remove();
    });
  });
}

// video: the authored YouTube link becomes a 16:9 player (the link stays, visually hidden)
function videoEmbed(block) {
  const a = block.querySelector('a[href*="youtube.com/"], a[href*="youtu.be/"]');
  if (!a) return;
  const url = new URL(a.href);
  const id = url.hostname.includes('youtu.be') ? url.pathname.slice(1)
    : url.searchParams.get('v') || url.pathname.split('/').pop();
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube.com/embed/${id}?autoplay=0&controls=0&loop=0`;
  frame.title = a.title || a.textContent;
  frame.loading = 'lazy';
  frame.allowFullscreen = true;
  frame.setAttribute('frameborder', '0');
  const holder = a.closest('p') || a;
  holder.classList.add('video-link');
  holder.after(div('video-frame', frame));
}

// form trigger: a paragraph that is only bold + italic text (no link) is a source <button>
// (hubspot form trigger); the emphasis' text nodes are MOVED into the button
function formButtons(block) {
  block.querySelectorAll('p').forEach((p) => {
    const only = p.children.length === 1 ? p.firstElementChild : null;
    const inner = only && /^(STRONG|B|EM|I)$/.test(only.tagName) && only.children.length === 1
      ? only.firstElementChild : null;
    // the emphasis must wrap ALL the text (a bold line with an italic tail is copy, not a button)
    if (!inner || only.textContent.trim() !== p.textContent.trim()
      || inner.textContent.trim() !== only.textContent.trim()) return;
    const tags = [only.tagName, inner.tagName].sort().join();
    if (!['EM,STRONG', 'B,I', 'B,EM', 'I,STRONG'].includes(tags) || inner.querySelector('a')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button';
    btn.append(...inner.childNodes);
    p.replaceChildren(btn);
    p.classList.add('button-wrapper');
  });
}

// partner / nlp: prev / next buttons over the body groups
function slideNav(body) {
  const slides = [...body.querySelectorAll(':scope > .body-text')];
  if (slides.length < 2) return;
  let i = 0;
  const nav = div('slide-nav');
  const mk = (cls, label, step) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', () => {
      i = Math.min(slides.length - 1, Math.max(0, i + step));
      // eslint-disable-next-line no-use-before-define
      show();
    });
    return b;
  };
  const prev = mk('prev', 'prev card', -1);
  const next = mk('next', 'next card', 1);
  // nlp: the row scrolls by one slot (--slide); partner: one slide shown at a time
  const row = body.closest('.text-band').classList.contains('nlp');
  function show() {
    if (row) body.style.setProperty('--slide', i);
    else slides.forEach((s, k) => s.classList.toggle('current', k === i));
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  }
  nav.append(prev, next);
  if (row) body.before(nav);
  else body.append(nav);
  show();
}

// a body group made only of media-player links (dam-media openPlayer widget) is the source video
// row: each link becomes the player iframe; the link stays in the DOM, visually hidden, as the
// authored value
function damVideos(block) {
  block.querySelectorAll('.body-text').forEach((group) => {
    const links = [...group.querySelectorAll('a[href*="/widgets/openPlayer/"]')];
    const paras = [...group.querySelectorAll('p')];
    if (!links.length || paras.some((p) => !p.querySelector('a[href*="/widgets/openPlayer/"]'))) return;
    group.classList.add('dam-videos');
    links.forEach((a) => {
      const frame = document.createElement('iframe');
      frame.src = a.href;
      frame.title = 'Video player';
      frame.allow = 'autoplay; fullscreen; picture-in-picture';
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('frameborder', '0');
      frame.loading = 'lazy';
      const holder = a.closest('p') || a;
      holder.classList.add('video-src');
      holder.before(div('dam-video', frame));
    });
  });
}

// m-nav / m-nav-r: below 1024 the source slider shows prev / next under the row (centred /
// right-aligned); the row moves by one group (--shift, the group's offset)
function mobileNav(body) {
  const slides = [...body.querySelectorAll(':scope > .body-text')];
  if (slides.length < 2) return;
  let i = 0;
  const nav = div('slide-nav m-nav-bar');
  const prev = document.createElement('button');
  const next = document.createElement('button');
  function show() {
    const x = slides[i].offsetLeft - slides[0].offsetLeft;
    body.style.setProperty('--shift', `${-x}px`);
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  }
  [[prev, 'prev', -1], [next, 'next', 1]].forEach(([b, cls, step]) => {
    b.type = 'button';
    b.className = cls;
    b.setAttribute('aria-label', `${cls} item`);
    b.addEventListener('click', () => {
      i = Math.min(slides.length - 1, Math.max(0, i + step));
      show();
    });
  });
  nav.append(prev, next);
  body.after(nav);
  show();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .grid')) return;
  dropFormattingWhitespace(block);
  formButtons(block);
  const rows = [...block.children];
  const titleIdx = block.classList.contains('untitled') ? -1
    : rows.findIndex((r) => !isMediaOnly(r) && r.textContent.trim());

  const bgs = [];
  const figures = [];
  const groups = [];
  rows.forEach((row, i) => {
    if (isMediaOnly(row)) {
      const isBg = titleIdx < 0 ? i === 0 && block.classList.contains('has-bg') : i < titleIdx;
      (isBg ? bgs : figures).push(media(row));
    } else if (i !== titleIdx && row.textContent.trim()) {
      groups.push(...[...row.children].filter((c) => c.textContent.trim()));
    }
  });
  const titleCells = titleIdx >= 0
    ? [...rows[titleIdx].children].filter((c) => c.textContent.trim())
    : [];

  const title = div('title r-cell', spacer('sp-top'));
  if (block.matches('.framework, .white')) {
    titleCells.forEach((c) => c.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(inkSpan));
  }
  titleCells.forEach(slotTitle);
  if (titleCells.length) title.append(div('title-text', ...titleCells));

  const accordion = block.classList.contains('accordion');
  const agenda = block.classList.contains('agenda');
  const body = div('body r-cell');
  groups.forEach((cell, i) => {
    if (i) body.append(spacer('sp-group'));
    if (accordion) accordionItem(cell);
    if (agenda) agendaItem(cell);
    body.append(div('body-text', cell));
  });
  const side = block.matches('.media, .media-right');
  const figure = div('figure r-cell');
  figures.forEach((pic) => (side ? figure : body).append(div('pic', pic)));

  const children = [];
  if (bgs.length) children.push(div('bg', bgs[0]));
  const grid = div('grid r-grid');
  if (titleCells.length) grid.append(title);
  grid.append(body);
  if (side && figures.length) grid.append(figure);
  children.push(grid);
  block.replaceChildren(...children);
  if (block.classList.contains('video')) videoEmbed(block);
  damVideos(block);
  if (block.matches('.partner, .nlp')) slideNav(body);
  else if (block.matches('.m-nav, .m-nav-r')) mobileNav(body);
}
