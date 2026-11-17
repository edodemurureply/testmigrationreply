/**
 * video-stories — "Explore our stories" interview rail (source cardcarousel-runtime
 * .card-reply-video-stories + videostory-runtime): portrait 2:3 stills under a 20 % veil with a
 * frosted 72px play disc; one per view with 2px progress bars below 768, three side by side from
 * 768 (rounded outer corners >= 1024). Play opens the DAM interview player over the still; the
 * close disc returns to the still. Reconstructive: one row per story.
 *
 * Authoring rows (classified by content): picture (the still) | paragraph holding the DAM player
 * link (dam-media.reply.com …/widget.html), its text = the video title.
 * @ew-exempt player-url — the player link stays in the DOM as a visually hidden caption.
 * @ew-exempt generated-ui — play / close discs and the progress bars are block chrome.
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

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

function disc(className, label, glyph) {
  const b = el('button', `video-stories-disc ${className}`);
  b.type = 'button';
  b.setAttribute('aria-label', label);
  const i = el('i', `video-stories-icon video-stories-icon-${glyph}`);
  i.setAttribute('aria-hidden', 'true');
  b.append(i);
  return b;
}

function buildStory(row) {
  const pic = row.querySelector('picture') || row.querySelector('img');
  const link = row.querySelector('a[href]');
  const linkP = link ? link.closest('p') || link : null;
  const still = el('div', 'video-stories-still');
  if (pic) still.append(pic);
  const play = disc('play', link ? `Play ${link.textContent.trim()}` : 'Play', 'play');
  const overlay = el('div', 'video-stories-overlay', still, el('div', 'video-stories-veil'), play);
  const player = el('div', 'video-stories-player');
  const story = el('div', 'video-stories-story', overlay, player);
  if (linkP) {
    linkP.classList.add('video-stories-link');
    story.append(linkP);
  }
  const close = disc('close', 'Close video', 'close');
  play.addEventListener('click', () => {
    if (!link) return;
    const iframe = document.createElement('iframe');
    iframe.src = link.href;
    iframe.title = link.textContent.trim();
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    player.replaceChildren(iframe, close);
    story.classList.add('playing');
  });
  close.addEventListener('click', () => {
    player.replaceChildren();
    story.classList.remove('playing');
  });
  return el('li', 'video-stories-item', story);
}

function bindDots(viewport, track, dots) {
  const update = () => {
    const w = track.firstElementChild ? track.firstElementChild.offsetWidth : 1;
    const i = Math.round(viewport.scrollLeft / Math.max(1, w));
    [...dots.children].forEach((d, k) => d.classList.toggle('active', k === i));
  };
  viewport.addEventListener('scroll', update, { passive: true });
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .video-stories-inner')) return;
  ensureParagraphs(block);
  const track = el('ul', 'video-stories-track');
  [...block.children].forEach((row) => {
    if (row.querySelector('picture, img, a[href]')) track.append(buildStory(row));
  });
  const viewport = el('div', 'video-stories-viewport', track);
  const dots = el('div', 'video-stories-dots');
  dots.setAttribute('aria-hidden', 'true');
  [...track.children].forEach(() => dots.append(el('span', 'video-stories-dot')));
  block.replaceChildren(el('div', 'video-stories-inner', el('div', 'video-stories-cell', viewport, dots)));
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  bindDots(viewport, track, dots);
}
