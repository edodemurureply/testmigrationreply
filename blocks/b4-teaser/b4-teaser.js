/**
 * b4-teaser — the closing 4brands brand panel: rounded ice card with a link (brand name), the brand
 * logo (cols 2-3 from 768) and an abstract. Template-slotted.
 *
 * Authoring (cells classified by content): a paragraph with a link = title link; a picture = logo;
 * other paragraphs = abstract.
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
  if (block.querySelector(':scope > .b4-teaser-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const pic = block.querySelector('picture') || block.querySelector('img');
  const links = nodes.filter((n) => n.tagName !== 'PICTURE' && n.querySelector('a') && !n.contains(pic));
  const texts = nodes.filter((n) => !links.includes(n) && n !== pic && !n.contains(pic));

  const link = div('b4-teaser-link', ...links, div('b4-spacer b4-teaser-s1'));
  const media = div('b4-teaser-media');
  if (pic) media.append(pic);
  const body = div('b4-teaser-body', div('b4-spacer b4-teaser-s2'), div('b4-teaser-text', ...texts));
  const card = div('b4-teaser-card', div(
    'b4-teaser-inner',
    div('b4-teaser-top', div('b4-spacer b4-teaser-s0')),
    link,
    media,
    body,
  ));
  block.replaceChildren(div('b4-teaser-grid r-grid', div('b4-teaser-cell r-cell', card)));
}
