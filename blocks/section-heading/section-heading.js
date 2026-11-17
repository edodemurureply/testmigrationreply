/**
 * section-heading — a module's section title (h2, t-section) on the 4 / 8 / 12-col grid
 * (cols 1-4 / 1-8 / 2-11). Template-slotted: the authored heading (and any paragraph) moves
 * into the cell.
 *
 * Authoring: one cell with the heading.
 * @variants center — centred, cols 3-10 @1024; dark — #151f27 band, white title;
 *   b4 — 4brands spacing (margin-top 56 / 120 @1440 + a 24 / 42 spacer below, no margin-bottom);
 *   near — with b4: margin-top 80 @1440 (heading right after a module);
 *   text — heading in the content-body face (--font-text);
 *   insights — index latest-insights head on the ink band: title + a link-only paragraph as the
 *     ghost "View all" button on the right (3fr / 1fr row), margins 56 / 32 -> 64 / 36 -> 72 / 72;
 *   latest — listing heading right below the intro (no top margin, cols 1-4 / 1-5 / 2-7);
 *   lead — hub heading with body copy (paragraphs 16 px / 300 below the title, 40 px gap);
 *   t-<px> / tm-<px> / b-<px> / bm-<px> — hub spacing tokens (margin above / below the title,
 *   >= 768 / < 768, measured on the source section); w-<n> — title width in columns from col 2
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

// hub spacing tokens (additive): t-<px> / tm-<px> / b-<px> / bm-<px> = the source section's
// measured outer spacing (>= 768 / < 768); w-<n> = text width in grid columns from col 2 (>= 1024)
function applySpacing(block) {
  let on = false;
  [...block.classList].forEach((c) => {
    // n-prefixed t / tm (fix-small-4): a negative top pulls the heading over the band above
    const m = c.match(/^(t|tm|b|bm|w)-(n?\d+)$/);
    if (!m) return;
    on = true;
    const neg = m[2][0] === 'n';
    if (neg) block.classList.add('pulled');
    const v = neg ? `-${m[2].slice(1)}` : m[2];
    block.style.setProperty(`--sp-${m[1]}`, m[1] === 'w' ? v : `${v}px`);
  });
  if (on) block.classList.add('spaced');
}

export default function decorate(block) {
  if (block.querySelector(':scope > .section-heading-grid')) return;
  applySpacing(block);
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const title = document.createElement('div');
  title.className = 'section-heading-title';
  const cell = document.createElement('div');
  cell.className = 'section-heading-cell r-cell';
  cell.append(title);
  if (block.classList.contains('insights')) {
    // link-only paragraphs move to the CTA slot beside the title (EW3: the CTA moves as its <p>)
    const isCta = (n) => n.tagName === 'P' && n.querySelector('a[href]')
      && n.textContent.trim() === n.querySelector('a[href]').textContent.trim();
    const ctas = nodes.filter(isCta);
    title.append(...nodes.filter((n) => !ctas.includes(n)));
    if (ctas.length) {
      const cta = document.createElement('div');
      cta.className = 'section-heading-cta';
      // two CTAs = the source's concealable pair: the first shows below 1024, the second from 1024
      ctas.forEach((n, i) => {
        const item = document.createElement('div');
        item.className = 'section-heading-cta-item';
        if (ctas.length === 2) item.classList.add(i ? 'lg' : 'sm');
        item.append(n);
        cta.append(item);
      });
      cell.append(cta);
    }
  } else {
    title.append(...nodes);
  }
  if (block.classList.contains('b4')) {
    const spacer = document.createElement('div');
    spacer.className = 'section-heading-spacer';
    cell.append(spacer);
  }
  const grid = document.createElement('div');
  grid.className = 'section-heading-grid r-grid';
  grid.append(cell);
  block.replaceChildren(grid);
}
