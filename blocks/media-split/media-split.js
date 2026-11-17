/**
 * media-split — 16:9 media beside a short text column (reply.com plain template section
 * "video-dam-container + content-body": media on columns 2-6, copy on 8-11 at 1440; stacked
 * copy-then-media below 1024).
 *
 * Authoring (one row, cells read in order; extra rows are folded in):
 *   - media cell: a picture / image, or a link to a video. Empty, or the text "video", renders
 *     the source's empty-media placeholder (translucent grey 16:9 box with a play disc).
 *   - text cell: first paragraph = lead (statement face), following paragraphs = body copy;
 *     a last paragraph that is entirely bold is the call-to-action label (rendered as a button).
 * A single-cell block is treated as the text cell with the placeholder media.
 */

const PLAY_SVG = '<svg viewBox="0 0 24 24" width="80" height="80" aria-hidden="true" focusable="false">'
  + '<path fill="#ccc" d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12s12-5.383,12-12S18.617,0,12,0z '
  + 'M9,17V7l8,5L9,17z"></path></svg>';

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function isMediaCell(cell) {
  if (cell.querySelector('picture, img, iframe, video')) return true;
  const text = cell.textContent.trim();
  return !text || /^video$/i.test(text);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .media-split-grid')) return;

  const cells = [...block.children].flatMap((row) => [...row.children]);
  let mediaCell = cells.find(isMediaCell) || null;
  const textCells = cells.filter((c) => c !== mediaCell);
  if (!textCells.length && mediaCell && mediaCell.textContent.trim()) {
    textCells.push(mediaCell);
    mediaCell = null;
  }

  const grid = el('div', 'media-split-grid r-grid');
  const media = el('div', 'media-split-media r-cell');
  const frame = el('div', 'media-split-frame');
  const pic = mediaCell && mediaCell.querySelector('picture, img, iframe, video');
  if (pic) {
    frame.append(pic);
  } else {
    const empty = el('div', 'media-split-empty');
    empty.innerHTML = PLAY_SVG;
    frame.append(empty);
  }
  media.append(frame);

  const text = el('div', 'media-split-text r-cell');
  const nodes = textCells.flatMap((c) => [...c.children]);
  const paras = nodes.filter((n) => n.tagName === 'P');
  const last = paras[paras.length - 1];
  const strong = last && last.children.length === 1 && last.firstElementChild.matches('strong, b')
    && last.textContent.trim() === last.firstElementChild.textContent.trim()
    ? last.firstElementChild : null;
  nodes.forEach((n) => {
    if (n === paras[0] && paras.length > 1) n.classList.add('media-split-lead');
    if (strong && n === last) {
      const link = strong.querySelector('a[href]');
      const btn = link || el('button', '');
      if (!link) {
        btn.type = 'button';
        btn.textContent = strong.textContent.trim();
      }
      btn.className = 'button primary';
      const wrap = el('div', 'media-split-cta');
      wrap.append(btn);
      text.append(wrap);
      return;
    }
    text.append(n);
  });

  grid.append(text, media);
  block.replaceChildren(grid);
}
