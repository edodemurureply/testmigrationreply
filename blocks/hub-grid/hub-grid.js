/**
 * hub-grid — reply.com hub page-builder section (gridcontainer rows of text, image, icon, button
 * and card columns) recreated on the 4 / 12-col grid with the source section's measured geometry.
 *
 * Authoring: one row per grid cell (a column of the source section, in reading order); the cell
 * holds its nodes in order (headings, paragraphs, lists, pictures, link buttons:
 * bold link = filled button, italic link = text button).
 *
 * @variants measured tokens, written by the migration encoder (n = cell, k = node in the cell,
 *   desktop >= 1024 / mobile < 1024, lengths in px, `n` prefix = negative, ‰ of the cell box):
 *   b-<px> / bm-<px> — space below the last row; bg-<hex> / bgm-<hex> — band colour;
 *   gd-<hex>-<pct> / gdm-<hex>-<pct> — band colour over the upper part (the lower pct% clear);
 *   c<n>-<row>-<col>-<span>-<mt>-<pb>-<rowM>-<colM>-<spanM>-<mtM>-<pbM> — cell placement
 *     (row 0 = hidden at that width);
 *   k<n>-<bg>-<bw>-<bc>-<radius>-<shadow>-<x‰>-<w‰>-<x‰M>-<w‰M> — card face behind the cell;
 *   x<n>-<k>-t-<fs>-<lh*10>-<fw>-<font>-<color>-<align>-<case>-<x‰>-<w‰>-<mt>-<fsM>-<lhM*10>-
 *     <alignM>-<x‰M>-<w‰M>-<mtM> — text node (mt `h` = hidden at that width);
 *   x<n>-<k>-i-<fit>-<posX>-<posY>-<ar‰>-<x‰>-<w‰>-<mt>-<imgW‰>-<imgX‰>-<imgY‰> (+ the same 7
 *     for mobile, + tint rgba hex) — picture box (fit c cover / f fill / t contain / n none /
 *     p placed image);
 *   x<n>-<k>-b-<x‰>-<mt>-<x‰M>-<mtM> — link button.
 */

const FONTS = ['khanqyjjei', 'sekprcvhoj', 'aawdfdgnxz', 'tuqgwxsjgq', 'txtislskto', 'ehjkbitsdn',
  'lrhxqnxayj', 'ubqbmoffzb', 'alaska'];
// tracking that brings the Archivo stand-ins to the source faces' advance width (28 px sample,
// live vs delivered: +3.0 % light, +2.8 % medium, +2.4 % label, +1.9 % bold; foundation request)
const TRACK = ['.015em', '.0145em', '.015em', '.012em', '.012em', '.0095em', 'normal', '.0145em',
  'normal'];
const ALIGN = {
  l: 'left', c: 'center', r: 'right', j: 'justify',
};
const FIT = {
  c: 'cover', f: 'fill', t: 'contain', n: 'none',
};

const n = (v) => (v && v[0] === 'n' ? -Number(v.slice(1)) : Number(v));

function parseTokens(block) {
  const spec = {
    cells: {}, cards: {}, atoms: {}, vars: {}, extra: {}, inv: {},
  };
  [...block.classList].forEach((c) => {
    let m = c.match(/^(b|bm)-(n?\d+)$/);
    if (m) { spec.vars[`--hg-${m[1]}`] = `${n(m[2])}px`; return; }
    m = c.match(/^(bg|bgm)-([0-9a-f]{6})$/);
    if (m) { spec.vars[`--hg-${m[1]}`] = `#${m[2]}`; return; }
    m = c.match(/^(gd|gdm)-([0-9a-f]{6})-(\d+)$/);
    if (m) {
      spec.vars[`--hg-${m[1]}`] = `linear-gradient(0deg, transparent ${m[3]}%, #${m[2]} ${m[3]}%)`;
      return;
    }
    // (fix-hub-f) l<n>-<k>-<lines> = line clamp of a text node; r<n>-<k>-<px> = picture radius
    // sm<n>-<k>-<‰em> = the text node's letter-spacing below 1024 (0 = normal: the source face
    // at 16 px needs no stand-in tracking; fix-hub-h: `n` prefix = negative, a stand-in wider
    // than the source face, e.g. the 10 px uppercase label)
    m = c.match(/^sm(\d+)-(\d+)-(n?\d+)$/);
    if (m) {
      const key = `${m[1]}-${m[2]}`;
      spec.extra[key] = { ...spec.extra[key], s: n(m[3]) };
      return;
    }
    // (fix-hub-j) lm<n>-<k>-<lines>: a text node's line clamp below 768; fm<n>-<k>: a placed
    // picture fills its box below 1024 (cover: the source mobile card image, 280 x 420)
    m = c.match(/^lm(\d+)-(\d+)-(\d+)$/);
    if (m) {
      const key = `${m[1]}-${m[2]}`;
      spec.extra[key] = { ...spec.extra[key], lm: Number(m[3]) };
      return;
    }
    m = c.match(/^fm(\d+)-(\d+)$/);
    if (m) {
      const key = `${m[1]}-${m[2]}`;
      spec.extra[key] = { ...spec.extra[key], fm: true };
      return;
    }
    // (fix-hub-j) nw<n>-<k>: a text node holds one line below 768 (ellipsis; live file-box name)
    m = c.match(/^nw(\d+)-(\d+)$/);
    if (m) {
      const key = `${m[1]}-${m[2]}`;
      spec.extra[key] = { ...spec.extra[key], nw: true };
      return;
    }
    // (fix-hub-h) sd<n>-<k>-<‰em>: the text node's letter-spacing from 1024 (measured line fit)
    m = c.match(/^sd(\d+)-(\d+)-(\d+)$/);
    if (m) {
      const key = `${m[1]}-${m[2]}`;
      spec.extra[key] = { ...spec.extra[key], d: Number(m[3]) };
      return;
    }
    m = c.match(/^([lr])(\d+)-(\d+)-(\d+)$/);
    if (m) {
      const key = `${m[2]}-${m[3]}`;
      spec.extra[key] = { ...spec.extra[key], [m[1]]: Number(m[4]) };
      return;
    }
    // (fix-hub-f) inv<n> = cell n sits on a dark picture: its text buttons are white
    m = c.match(/^inv(\d+)$/);
    if (m) {
      spec.inv[m[1]] = true;
      return;
    }
    m = c.match(/^acc-([0-9a-f]{6})$/);
    if (m) { spec.vars['--hg-acc'] = `#${m[1]}`; return; }
    m = c.match(/^c(\d+)-(.+)$/);
    if (m) { spec.cells[m[1]] = m[2].split('-'); return; }
    m = c.match(/^k(\d+)-(.+)$/);
    if (m) { spec.cards[m[1]] = m[2].split('-'); return; }
    m = c.match(/^x(\d+)-(\d+)-([tib])-(.+)$/);
    if (m) spec.atoms[`${m[1]}-${m[2]}`] = [m[3], ...m[4].split('-')];
  });
  return spec;
}

function setVars(el, vars) {
  Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v));
}

function placeCell(cell, t) {
  if (!t) return;
  const [dr, ds, dw, dmt, dpb, mr, ms, mw, mmt, mpb] = t;
  setVars(cell, {
    '--d-row': dr === '0' ? 'auto' : dr,
    '--d-col': `${ds} / span ${dw}`,
    '--d-mt': `${n(dmt)}px`,
    '--d-pb': `${n(dpb)}px`,
    '--d-show': dr === '0' ? 'none' : 'block',
    '--m-row': mr === '0' ? 'auto' : mr,
    '--m-col': `${ms} / span ${mw}`,
    '--m-mt': `${n(mmt)}px`,
    '--m-pb': `${n(mpb)}px`,
    '--m-show': mr === '0' ? 'none' : 'block',
  });
}

function addCard(cell, k) {
  if (!k) return;
  const [bg, bw, bc, br, sh, dx, dw, mx, mw] = k;
  const face = document.createElement('div');
  face.className = 'hub-grid-card';
  setVars(face, {
    '--k-bg': bg === '0' ? 'transparent' : `#${bg}`,
    '--k-border': bw === '0' ? 'none' : `${bw}px solid #${bc === '0' ? 'd6e0ea' : bc}`,
    '--k-radius': `${br}px`,
    '--k-shadow': sh === '1' ? '0 4px 24px rgb(21 31 39 / 12%)' : 'none',
    '--d-kx': `${n(dx) / 10}%`,
    '--d-kw': `${n(dw) / 10}%`,
    '--m-kx': `${n(mx) / 10}%`,
    '--m-kw': `${n(mw) / 10}%`,
  });
  cell.prepend(face);
}

function show(mt) { return mt === 'h' ? 'none' : 'block'; }

function styleText(el, a) {
  const [, fs, lh, fw, ff, col, al, tt, dx, w, mt, fsm, lhm, alm, dxm, wm, mtm] = a;
  const font = FONTS[Number(ff)] || FONTS[0];
  setVars(el, {
    '--a-ff': `${font}, khanqyjjei-fallback, sans-serif`,
    '--a-ls': TRACK[Number(ff)] || 'normal',
    '--a-fw': fw,
    '--a-color': col === '0' ? 'inherit' : `#${col}`,
    '--a-tt': tt === 'u' ? 'uppercase' : 'none',
    '--d-fs': `${n(fs)}px`,
    '--d-lh': `${n(lh) / 10}px`,
    '--d-al': ALIGN[al] || 'left',
    '--d-x': `${n(dx) / 10}%`,
    '--d-w': `${n(w) / 10}%`,
    '--d-mt': mt === 'h' ? '0' : `${n(mt)}px`,
    '--d-show': show(mt),
    '--m-fs': `${n(fsm) || n(fs)}px`,
    '--m-lh': `${(n(lhm) || n(lh)) / 10}px`,
    '--m-al': ALIGN[alm] || 'left',
    '--m-x': `${n(dxm) / 10}%`,
    '--m-w': `${n(wm) / 10}%`,
    '--m-mt': mtm === 'h' ? '0' : `${n(mtm)}px`,
    '--m-show': show(mtm),
  });
}

function styleImage(el, a) {
  const [, fit, px, py, ...rest] = a;
  const box = (vals, p) => {
    const [ar, dx, w, mt, sw, ox, oy] = vals;
    return {
      [`--${p}-ar`]: `1000 / ${Math.max(1, n(ar))}`,
      [`--${p}-x`]: `${n(dx) / 10}%`,
      [`--${p}-w`]: `${n(w) / 10}%`,
      [`--${p}-mt`]: mt === 'h' ? '0' : `${n(mt)}px`,
      [`--${p}-show`]: show(mt),
      [`--${p}-iw`]: `${n(sw) / 10}%`,
      [`--${p}-ix`]: `${n(ox) / 10}%`,
      [`--${p}-iy`]: `${n(oy) / 10}%`,
    };
  };
  setVars(el, {
    ...box(rest.slice(0, 7), 'd'),
    ...box(rest.slice(7, 14), 'm'),
    '--a-tint': rest[14] && rest[14] !== '0' ? `#${rest[14]}` : 'transparent',
    '--a-fit': FIT[fit] || 'cover',
    '--a-pos': `${n(px)}% ${n(py)}%`,
  });
  el.classList.add('hub-grid-pic');
  if (fit === 'p') el.classList.add('placed');
  // a second picture in the node is the source's < 768 crop (<source media="(max-width: 767px)">)
  const pics = el.querySelectorAll('picture');
  if (pics.length > 1) {
    pics[0].classList.add('hub-grid-pic-d');
    pics[1].classList.add('hub-grid-pic-m');
  }
}

// form trigger: a paragraph that is only bold + italic text (no link) is a source <button>
// (hubspot form trigger); its text nodes are MOVED into the button
function formButton(p) {
  const only = p.children.length === 1 ? p.firstElementChild : null;
  const inner = only && only.children.length === 1 ? only.firstElementChild : null;
  if (!inner || only.textContent.trim() !== p.textContent.trim() || inner.querySelector('a')) return;
  const tags = [only.tagName, inner.tagName].sort().join();
  if (!['EM,STRONG', 'B,I', 'B,EM', 'I,STRONG'].includes(tags)) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'button primary';
  btn.append(...inner.childNodes);
  only.replaceWith(btn);
  p.classList.add('button-wrapper');
}

function styleButton(el, a) {
  formButton(el);
  const [, dx, mt, dxm, mtm] = a;
  setVars(el, {
    '--d-x': `${n(dx) / 10}%`,
    '--d-mt': mt === 'h' ? '0' : `${n(mt)}px`,
    '--d-show': show(mt),
    '--m-x': `${n(dxm) / 10}%`,
    '--m-mt': mtm === 'h' ? '0' : `${n(mtm)}px`,
    '--m-show': show(mtm),
  });
  el.classList.add('hub-grid-btn');
}

// calendar box (fix-hub-f): an authored "Download <title> calendar" link inside a text node is
// the source calendarbox square button — an icon-only control (the link text becomes its
// aria-label) that downloads an .ics for <title> on the date of the node above (dd/mm/yy)
function calendarLink(a, node) {
  const m = a.textContent.trim().match(/^Download (.+) calendar$/);
  if (!m) return;
  const title = m[1];
  const prev = node.previousElementSibling;
  const d = prev ? prev.textContent.match(/(\d{1,2})(?:-\d{1,2})?\/(\d{1,2})\/(\d{2})/) : null;
  if (d) {
    const day = `20${d[3]}${d[2].padStart(2, '0')}${d[1].padStart(2, '0')}`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Reply//Calendar//EN', 'BEGIN:VEVENT',
      `UID:${day}-${title.replace(/\W+/g, '-')}@reply.com`, `DTSTART;VALUE=DATE:${day}`,
      `SUMMARY:${title}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  }
  a.download = title;
  a.setAttribute('aria-label', a.textContent.trim());
  a.textContent = '';
  a.className = 'hub-grid-ics';
  node.classList.add('hub-grid-has-ics');
}

// boxlink variant (fix-hub-f): a card cell (k token) holding one link is the source's whole-box
// anchor (file-box) — the cell's nodes move into that anchor, the authored link is unwrapped
function boxLink(cell) {
  const links = [...cell.querySelectorAll('a[href]')].filter((a) => a.textContent.trim());
  if (links.length !== 1) return;
  const [link] = links;
  const box = document.createElement('a');
  box.className = 'hub-grid-boxlink';
  box.href = link.href;
  if (/\.pdf$/i.test(link.pathname)) box.target = '_blank';
  link.replaceWith(...link.childNodes);
  box.append(...[...cell.children].filter((c) => !c.classList.contains('hub-grid-card')));
  cell.append(box);
}

// file box (fix-hub-f): a "Download" label node followed by a node that is one link is the
// source file-box anchor around both — the two nodes move into that anchor
function downloadPairs(cell) {
  [...cell.children].forEach((label) => {
    const node = label.nextElementSibling;
    if (label.textContent.trim() !== 'Download' || !node) return;
    const link = node.querySelector('a[href]');
    if (!link || link.textContent.trim() !== node.textContent.trim()) return;
    const box = document.createElement('a');
    box.className = 'hub-grid-boxlink';
    box.href = link.href;
    box.target = '_blank';
    link.replaceWith(...link.childNodes);
    label.before(box);
    box.append(label, node);
  });
}

// site variant (fix-hub-f, card-website): in a cell whose last node holds the site link, the
// picture node and the run of text nodes after it (infoline, title, abstract) are each wrapped
// in that link (the source card's image anchor + body anchor)
function siteCard(cell) {
  const nodes = [...cell.children].filter((c) => !c.classList.contains('hub-grid-card'));
  const last = nodes[nodes.length - 1];
  const link = last && last.querySelector('a[href]');
  const pic = nodes.find((c) => c.querySelector('picture'));
  if (!link || !pic) return;
  const heading = nodes.find((c) => /^H[1-6]$/.test(c.tagName));
  const wrap = (els) => {
    const a = document.createElement('a');
    a.className = 'hub-grid-boxlink';
    a.href = link.href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    if (heading) a.title = heading.textContent.trim();
    els[0].before(a);
    a.append(...els);
  };
  wrap([pic]);
  const body = nodes.slice(nodes.indexOf(pic) + 1, -1);
  if (body.length) wrap(body);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hub-grid-grid')) return;
  const spec = parseTokens(block);
  setVars(block, spec.vars);
  const grid = document.createElement('div');
  grid.className = 'hub-grid-grid r-grid';
  [...block.children].forEach((row, i) => {
    const id = String(i + 1);
    const cell = document.createElement('div');
    cell.className = 'hub-grid-cell';
    [...row.children].forEach((col) => cell.append(...col.childNodes));
    // a wrapper paragraph around several authored nodes (picture-first cell) -> its nodes
    const only = cell.children.length === 1 ? cell.firstElementChild : null;
    if (only && only.tagName === 'P'
      && [...only.children].some((c) => /^(PICTURE|H[1-6]|P|UL|OL|DIV)$/.test(c.tagName))) {
      only.replaceWith(...only.childNodes);
    }
    // loose text or inline nodes -> paragraph
    [...cell.childNodes].forEach((c) => {
      if (c.nodeType === Node.TEXT_NODE && !c.textContent.trim()) c.remove();
      else if (c.nodeType === Node.TEXT_NODE || (c.nodeType === Node.ELEMENT_NODE && /^(A|SPAN|STRONG|EM)$/.test(c.tagName))) {
        const p = document.createElement('p');
        c.replaceWith(p);
        p.append(c);
      }
    });
    [...cell.children].forEach((el, j) => {
      const a = spec.atoms[`${id}-${j + 1}`];
      el.classList.add('hub-grid-node');
      const ex = spec.extra[`${id}-${j + 1}`];
      if (ex && ex.l) {
        el.classList.add('hub-grid-clamp');
        el.style.setProperty('--hg-clamp', ex.l);
      }
      if (ex && ex.r) el.style.borderRadius = `${ex.r}px`;
      if (ex && ex.lm) {
        el.classList.add('hub-grid-clampm');
        el.style.setProperty('--hg-clampm', ex.lm);
      }
      if (ex && ex.fm) el.classList.add('hub-grid-fitm');
      if (ex && ex.nw) el.classList.add('hub-grid-nowrapm');
      if (ex && ex.s !== undefined) el.style.setProperty('--m-ls', ex.s ? `${ex.s / 1000}em` : 'normal');
      if (ex && ex.d !== undefined) el.style.setProperty('--d-ls', ex.d ? `${ex.d / 1000}em` : 'normal');
      if (!a) return;
      if (a[0] === 't') {
        styleText(el, a);
        el.querySelectorAll('a[href]').forEach((l) => calendarLink(l, el));
        if (el.classList.contains('hub-grid-has-ics')) {
          setVars(el, {
            '--d-ik': (1000 - n(a[8])) / Math.max(1, n(a[9])),
            '--m-ik': (1000 - n(a[14])) / Math.max(1, n(a[15])),
          });
        }
      } else if (a[0] === 'i') styleImage(el, a);
      else styleButton(el, a);
    });
    downloadPairs(cell);
    placeCell(cell, spec.cells[id]);
    if (spec.inv[id]) cell.classList.add('hub-grid-inv');
    addCard(cell, spec.cards[id]);
    if (block.classList.contains('boxlink') && spec.cards[id]) boxLink(cell);
    if (block.classList.contains('site')) siteCard(cell);
    grid.append(cell);
  });
  block.replaceChildren(grid);
}
