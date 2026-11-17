/**
 * dw-tiles — /en/data-world "AI for Data / Data for AI Lifecycle" pair (live section .rqapfesbrt,
 * reply-card.card-horizontal.card-horizontal-editorial): two image tiles side by side at every
 * width (4fr 4fr, insets 10 / 5 px, 20 / 10 px >= 768), 2:3 below 768 and 16:9 from 768, a
 * radial veil, and the white linked title + abstract (revealed on hover >= 1440) + frosted
 * "Discover more" button at the tile's foot.
 *
 * Authoring: one row per tile, cells classified by content: picture | heading (with the tile
 * link) | abstract paragraph(s) | link-only paragraph = the button.
 */
function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

const isLinkOnly = (n) => n.tagName === 'P' && n.querySelector('a[href]')
  && n.textContent.trim() === n.querySelector('a[href]').textContent.trim();

export default function decorate(block) {
  if (block.querySelector(':scope > .dw-tiles-tile')) return;
  const tiles = [...block.children].map((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const pic = nodes.find((n) => n.tagName === 'PICTURE'
      || (n.querySelector('picture, img') && !n.textContent.trim()));
    const image = el('div', 'dw-tiles-image');
    if (pic) image.append(pic);
    const body = el('div', 'dw-tiles-body');
    const abstract = el('div', 'dw-tiles-abstract');
    nodes.filter((n) => n !== pic).forEach((n) => {
      if (/^H[1-6]$/.test(n.tagName)) {
        n.classList.add('dw-tiles-title');
        body.append(n);
      } else if (isLinkOnly(n)) {
        n.classList.add('dw-tiles-cta');
        body.append(n);
      } else if (n.textContent.trim()) abstract.append(n);
    });
    const cta = body.querySelector('.dw-tiles-cta');
    if (abstract.children.length) body.insertBefore(abstract, cta);
    return el('div', 'dw-tiles-tile', el('div', 'dw-tiles-card', image, body));
  });
  block.replaceChildren(...tiles);
}
