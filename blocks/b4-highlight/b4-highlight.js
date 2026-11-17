/**
 * b4-highlight — 4brands sticky teaser (theme sticky-highlight-runtime.dark): fixed bottom sheet
 * below 768, right-edge tab from 768 whose +/- toggle reveals the abstract. Template-slotted.
 *
 * Authoring rows (classified by content):
 *   - picture(s): the first is the desktop crop (1:1), an optional second the mobile crop (16:9)
 *   - paragraph(s) before the first linked paragraph and without a picture: title
 *   - the last text row: abstract paragraph(s) + the CTA link paragraph
 * The toggle button carries no authored text (glyphs come from the icon font, aria-label only).
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

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-highlight-card')) return;
  ensureParagraphs(block);
  const pics = [...block.querySelectorAll('picture')];
  const imgs = pics.length ? pics : [...block.querySelectorAll('img')];
  const rows = [...block.children].filter((r) => !r.querySelector('picture, img'));
  const absRow = rows.find((r) => r.querySelector('a[href]')) || rows[rows.length - 1];
  const titleRows = rows.filter((r) => r !== absRow);

  const media = div('b4-highlight-pic');
  if (imgs[0]) media.append(div(imgs[1] ? 'b4-highlight-img desktop' : 'b4-highlight-img', imgs[0]));
  if (imgs[1]) media.append(div('b4-highlight-img mobile', imgs[1]));
  const title = div('b4-highlight-title', ...titleRows.flatMap((r) => [...r.querySelectorAll('p, h2, h3, h4')]));

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'b4-highlight-toggle';
  toggle.setAttribute('aria-label', 'Toggle teaser');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<i class="icon-chevron" aria-hidden="true"></i><i class="icon-close" aria-hidden="true"></i>';
  const abstract = div('b4-highlight-abstract');
  if (absRow) {
    [...absRow.querySelectorAll('p')].forEach((p) => {
      const a = p.querySelector('a[href]');
      if (a) {
        p.classList.add('b4-highlight-cta');
        a.classList.add('b4-highlight-btn');
      }
      abstract.append(p);
    });
  }
  toggle.setAttribute('aria-controls', `b4-highlight-abstract-${Math.random().toString(36).slice(2, 8)}`);
  abstract.id = toggle.getAttribute('aria-controls');

  // below 768 the live runtime renders the sheet expanded (close glyph); the abstract stays hidden
  if (window.matchMedia('(max-width: 767.98px)').matches) toggle.setAttribute('aria-expanded', 'true');
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
  });

  const card = document.createElement('aside');
  card.className = 'b4-highlight-card';
  card.append(media, title, toggle, abstract);
  block.replaceChildren(card);
  // live: body.sticky-highlight-visible is set on load; the card slides in after 1 s
  requestAnimationFrame(() => document.body.classList.add('sticky-highlight-visible'));
}
