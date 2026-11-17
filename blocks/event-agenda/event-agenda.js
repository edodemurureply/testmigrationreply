/**
 * event-agenda — event page agenda (reply.com event template): eyebrow label, title, intro
 * copy and a link-style CTA, then a tab bar of days and, per tab, a list of sessions
 * (time range | title + category tag | description).
 *
 * Authoring (rows are classified by their cell count, never by index):
 *   - 1 cell: the intro — a short first paragraph before the heading is the eyebrow label;
 *     the heading; body paragraphs; a last paragraph that is entirely bold is the CTA label
 *     (a link inside it is kept as the CTA link).
 *   - 2 cells: a tab — tab name | date. Sessions that follow belong to this tab.
 *   - 3+ cells: a session — time (lines separated by line breaks) | title | category | description.
 * Sessions before any tab row open an untitled first tab.
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children);
  return e;
}

// a single-paragraph cell is delivered as bare inline content (text, <br>, <strong>…):
// wrap it in one <p>; a cell of block elements is returned as is
function cellNodes(cell) {
  if (!cell) return [];
  const bare = [...cell.childNodes]
    .some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  const inline = [...cell.children].every((n) => !/^(P|H[1-6]|UL|OL|DIV|PICTURE|TABLE)$/.test(n.tagName));
  if (bare || (cell.children.length && inline)) {
    const p = el('p', '');
    p.append(...cell.childNodes);
    return [p];
  }
  return [...cell.children];
}

function buildIntro(cell) {
  const nodes = cellNodes(cell);
  const intro = el('div', 'event-agenda-intro');
  const head = nodes.findIndex((n) => /^H[1-6]$/.test(n.tagName));
  const label = el('div', 'event-agenda-label');
  const title = el('div', 'event-agenda-title');
  const text = el('div', 'event-agenda-text');
  const cta = el('div', 'event-agenda-cta');
  nodes.forEach((n, i) => {
    if (head > 0 && i < head) { label.append(n); return; }
    if (i === head) { title.append(n); return; }
    const only = n.tagName === 'P' && n.children.length === 1
      && n.firstElementChild.matches('strong, b')
      && n.textContent.trim() === n.firstElementChild.textContent.trim();
    if (only && i === nodes.length - 1) {
      const link = n.querySelector('a[href]');
      const btn = link || el('button', '', n.textContent.trim());
      if (!link) btn.type = 'button';
      btn.className = 'button secondary';
      cta.append(btn);
      return;
    }
    text.append(n);
  });
  [label, title, text, cta].forEach((part) => { if (part.childNodes.length) intro.append(part); });
  return intro;
}

function buildSession(cells) {
  const [time, title, category, ...rest] = cells;
  const row = el('div', 'event-agenda-session');
  const t = el('div', 'event-agenda-time');
  t.append(...cellNodes(time));
  const h = el('div', 'event-agenda-session-title');
  h.append(...cellNodes(title));
  const c = el('div', 'event-agenda-category');
  const tag = category && category.textContent.trim();
  if (tag) c.append(el('span', 'event-agenda-tag', tag));
  const d = el('div', 'event-agenda-desc');
  rest.forEach((cell) => d.append(...cellNodes(cell)));
  row.append(t, h, c, d);
  return row;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .event-agenda-grid')) return;
  const idBase = `event-agenda-${Math.random().toString(36).slice(2, 7)}`;

  let intro = null;
  const tabs = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      if (!intro) intro = buildIntro(cells[0]);
    } else if (cells.length === 2) {
      tabs.push({ name: cellNodes(cells[0]), date: cellNodes(cells[1]), sessions: [] });
    } else if (cells.length >= 3) {
      if (!tabs.length) tabs.push({ name: [], date: [], sessions: [] });
      tabs[tabs.length - 1].sessions.push(buildSession(cells));
    }
  });

  const grid = el('div', 'event-agenda-grid r-grid');
  if (intro) grid.append(intro);

  if (tabs.length) {
    const tabber = el('div', 'event-agenda-tabber');
    const list = el('div', 'event-agenda-tabs');
    list.setAttribute('role', 'tablist');
    const panels = el('div', 'event-agenda-panels');
    const buttons = [];
    tabs.forEach((tab, i) => {
      const btn = el('button', 'event-agenda-tab');
      btn.type = 'button';
      btn.id = `${idBase}-tab-${i}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', `${idBase}-panel-${i}`);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.tabIndex = i === 0 ? 0 : -1;
      btn.append(el('span', 'event-agenda-tab-name', ...tab.name.map((n) => n.textContent.trim()).filter(Boolean)));
      btn.append(el('span', 'event-agenda-tab-date', ...tab.date.map((n) => n.textContent.trim()).filter(Boolean)));
      buttons.push(btn);
      list.append(btn);

      const panel = el('div', 'event-agenda-panel', ...tab.sessions);
      panel.id = `${idBase}-panel-${i}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', btn.id);
      panel.hidden = i !== 0;
      panels.append(panel);
    });

    const select = (i) => {
      buttons.forEach((b, j) => {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
        b.tabIndex = j === i ? 0 : -1;
        panels.children[j].hidden = j !== i;
      });
    };
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => select(i));
      b.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
        select(n);
        buttons[n].focus();
      });
    });

    tabber.append(list, panels);
    grid.append(tabber);
  }

  block.replaceChildren(grid);
}
