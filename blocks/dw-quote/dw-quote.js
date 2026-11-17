/**
 * dw-quote — /en/data-world opening quote (live section .oymeyxjmac): the centred display-face
 * quote (28 / 36 px @1440, 120 %) with the highlighted word underlined in the brand colour (theme
 * mark), a 22 px spacer and the italic author line (display face 16 / 18 px @1440, 140 %), on
 * cols 1-4 / 1-8 / 3-10 (200 px inset each side @1440).
 *
 * Authoring: one cell — the quote heading (<strong> or <mark> around the highlighted word), then
 * the author paragraph. Template-slotted into one centred column.
 */
export default function decorate(block) {
  const col = document.createElement('div');
  col.className = 'dw-quote-col';
  block.querySelectorAll(':scope > div > div').forEach((cell) => col.append(...cell.childNodes));
  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.classList.add('dw-quote-text');
    // the highlighted word: authored bold (Experience Workspace has no mark) -> theme mark
    heading.querySelectorAll('strong, b').forEach((s) => {
      const mark = document.createElement('mark');
      mark.append(...s.childNodes);
      s.replaceWith(mark);
    });
  }
  col.querySelectorAll(':scope > p').forEach((p) => p.classList.add('dw-quote-author'));
  block.replaceChildren(col);
}
