/**
 * statement — centred highlight statement on the 4 / 8 / 12-col grid (cols 1-4 / 1-8 / 3-10).
 * Template-slotted: every authored h2/h3/p moves into one centred cell.
 *
 * Authoring: one cell with the statement paragraph (or an h2 title + optional h3 subtitle).
 * <em> / <strong> inside the statement = brand-coloured run.
 * @variants b4 — brand home: t-subtitle face below 768, no tracking; hub — hub margins 48 / 50 / 24
 * @variants t-<px> / tm-<px> / b-<px> / bm-<px> — hub spacing tokens: the outer space above / below
 *   the text (>= 768 / < 768), measured on the source section (replaces margin + padding)
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
    const m = c.match(/^(t|tm|b|bm|w)-(\d+)$/);
    if (!m) return;
    on = true;
    block.style.setProperty(`--sp-${m[1]}`, m[1] === 'w' ? m[2] : `${m[2]}px`);
  });
  if (on) block.classList.add('spaced');
}

export default function decorate(block) {
  if (block.querySelector(':scope > .statement-grid')) return;
  applySpacing(block);
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const cell = document.createElement('div');
  cell.className = 'statement-cell r-cell';
  const text = document.createElement('div');
  text.className = 'statement-text';
  text.append(...nodes);
  cell.append(text);
  const grid = document.createElement('div');
  grid.className = 'statement-grid r-grid';
  grid.append(cell);
  block.replaceChildren(grid);
}
