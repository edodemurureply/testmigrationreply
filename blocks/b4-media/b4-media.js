/**
 * b4-media — 4brands media band: one or more pictures (full grid width, centred) or a DAM video
 * player. Template-slotted.
 *
 * Authoring: one cell per picture; a paragraph holding only a link to a player URL
 * (dam-media.reply.com widget / YouTube / Vimeo) becomes a 16:9 iframe — the link stays in the
 * DOM as the iframe's fallback caption for editors.
 *
 * @variants video — 16:9 player box; dark — #151f27 band; ice — #f4f8fc band
 */
function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...children);
  return d;
}

const PLAYER = /dam-media\.reply\.com|youtube\.com|youtu\.be|vimeo\.com/;

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-media-grid')) return;
  const cell = div('b4-media-cell r-cell');
  [...block.querySelectorAll(':scope > div > div')].forEach((c) => {
    const a = c.querySelector('a[href]');
    if (a && PLAYER.test(a.href) && !c.querySelector('picture, img')) {
      const frame = document.createElement('iframe');
      frame.src = a.href;
      frame.title = 'Video';
      frame.loading = 'lazy';
      frame.allow = 'autoplay; fullscreen; picture-in-picture';
      frame.setAttribute('allowfullscreen', '');
      const caption = div('b4-media-caption', ...c.childNodes);
      cell.append(div('b4-media-video', frame, caption));
    } else {
      cell.append(div('b4-media-item', ...c.childNodes));
    }
  });
  block.replaceChildren(div('b4-media-grid r-grid', cell));
}
