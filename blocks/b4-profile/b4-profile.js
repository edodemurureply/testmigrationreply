/**
 * b4-profile — the 4brands brand boilerplate card closing a case study (brand-case-study
 * .b4-profile): rounded ice card with a link (brand name), the brand logo (cols 2-3 from 768)
 * and an abstract. Template-slotted. Same composition as the solution pages' b4-teaser; kept as
 * its own block so the case-study template can diverge without touching the live solution pages.
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
  if (block.querySelector(':scope > .b4-profile-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const pic = block.querySelector('picture') || block.querySelector('img');
  const links = nodes.filter((n) => n.tagName !== 'PICTURE' && n.querySelector('a') && !n.contains(pic));
  const texts = nodes.filter((n) => !links.includes(n) && n !== pic && !n.contains(pic));

  const link = div('b4-profile-link', ...links, div('b4-spacer b4-profile-s1'));
  const media = div('b4-profile-media');
  if (pic) media.append(pic);
  const body = div('b4-profile-body', div('b4-spacer b4-profile-s2'), div('b4-profile-text', ...texts));
  const card = div('b4-profile-card', div(
    'b4-profile-inner',
    div('b4-profile-top', div('b4-spacer b4-profile-s0')),
    link,
    media,
    body,
  ));
  block.replaceChildren(div('b4-profile-grid r-grid', div('b4-profile-cell r-cell', card)));
}
