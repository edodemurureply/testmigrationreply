/**
 * hero-slider — home opening band (source heroslider-runtime with one slide): parallax media
 * (150 % / 50 % of the width) holding the DAM video player (16:9, muted autoplay loop inside the
 * player widget), 24 % black veil, pause / play disc, and the caption row on the 4 / 8 / 12 grid
 * (hairline rule, linked title + abstract >= 1024).
 *
 * Decode: template-slotted, cells classified by content:
 *   media — a paragraph holding only a link to the DAM player widget (dam-media.reply.com
 *     …/widget.html) = the video, or a picture = a still;
 *   caption — the heading / paragraph whose link is the slide link (title; the home authors it
 *     as the page h1 — the source page has none) + the paragraph(s) after it
 *     (abstract). EW6: the title link's href is read, the authored anchor unwrapped, and one new
 *     anchor wraps title + abstract (as the source anchor does).
 * @ew-exempt player-url — the video link is the player source; it stays in the DOM as a visually
 *   hidden caption of the frame (editable, never displayed).
 * @variants video — en-christmas: the player alone in a 16:9 full-width box (no caption, veil,
 *   disc or parallax); the page h1 lives in the next band.
 * Motion: parallax --ty (scroll progress x 13.23 % >= 768 / 15.39 % below, fitted to live) and the
 * play / pause disc (visual state; the cross-origin player runs its own autoplay).
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

const PLAYER = /dam-media\.reply\.com\/.+widget\.html/;
const PAUSE = '<svg class="hero-slider-pause" width="8" height="13" viewBox="0 0 8 13" fill="none" '
  + 'aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.9999 0.794922V12.7949H0.'
  + '399902V0.795117L1.9999 0.794922ZM7.5999 0.794922V12.7949H5.9999V0.795117L7.5999 0.794922Z" '
  + 'fill="white"/></svg>';
const PLAY = '<svg class="hero-slider-play" width="13" height="16" viewBox="0 0 13 16" fill="none" '
  + 'aria-hidden="true"><path d="M0.98 0.87L11.94 7.53C12.02 7.58 12.09 7.65 12.13 7.73C12.18 7.81 '
  + '12.2 7.91 12.2 8C12.2 8.09 12.18 8.19 12.13 8.27C12.09 8.35 12.02 8.42 11.94 8.47L0.98 15.13C0.9 '
  + '15.17 0.81 15.2 0.72 15.2C0.63 15.2 0.54 15.18 0.46 15.13C0.38 15.08 0.32 15.01 0.27 14.93C0.22 '
  + '14.84 0.2 14.75 0.2 14.65V1.34C0.2 1.25 0.22 1.15 0.27 1.07C0.32 0.99 0.38 0.92 0.46 0.87C0.54 '
  + '0.82 0.63 0.8 0.72 0.8C0.81 0.8 0.9 0.83 0.98 0.87Z" fill="white"/></svg>';

function bindParallax(media) {
  const update = () => {
    const vh = window.innerHeight;
    const r = media.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const k = window.innerWidth < 768 ? 15.39 : 13.23;
    media.style.setProperty('--ty', `${(p * k).toFixed(4)}%`);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-slider-media')) return;
  ensureParagraphs(block);
  // fix-hub-h (en-digital-experience): a paragraph that holds only player widgets (the 16:9 and
  // the mobile player, wrapped together on delivery) is split back into one node per widget
  block.querySelectorAll(':scope > div > div > p').forEach((p) => {
    const kids = [...p.children];
    const onlyWidgets = [...p.childNodes].every((c) => (c.nodeType === Node.ELEMENT_NODE
      ? c.classList.contains('widget') : !c.textContent.trim()));
    if (kids.length > 1 && onlyWidgets) p.replaceWith(...kids);
  });
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  // the player link alone in its paragraph (buildAutoBlocks may already have wrapped any
  // `/widgets/` link into a div.widget — accept either host)
  const isPlayer = (n) => {
    const links = n.tagName === 'A' ? [n] : [...n.querySelectorAll('a[href]')];
    return links.length === 1 && PLAYER.test(links[0].href)
      && n.textContent.trim() === links[0].textContent.trim();
  };
  // a second player link = the <= 767 px player (fix-hub-e, en-digital-experience: the live
  // video-dam-xs container plays a separate 2:3 mobile cut)
  const players = nodes.filter(isPlayer);
  const [player, mobilePlayer] = players;
  const pic = nodes.find((n) => n.tagName === 'PICTURE' || (n.querySelector('picture, img')
    && !n.textContent.trim()));
  const titleP = nodes.find((n) => !players.includes(n) && n.querySelector('a[href]'));
  const rest = nodes.filter((n) => !players.includes(n) && n !== pic && n !== titleP
    && (!titleP || nodes.indexOf(n) > nodes.indexOf(titleP)) && n.textContent.trim());

  const frame = el('div', 'hero-slider-frame');
  const media = el('div', 'hero-slider-media', frame);
  if (player) {
    const a = player.tagName === 'A' ? player : player.querySelector('a[href]');
    const iframe = document.createElement('iframe');
    iframe.src = a.href;
    iframe.title = a.textContent.trim();
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    const video = el('div', 'hero-slider-video', iframe);
    player.classList.add('hero-slider-player-link');
    frame.append(video, player);
    if (mobilePlayer) {
      const ma = mobilePlayer.tagName === 'A' ? mobilePlayer : mobilePlayer.querySelector('a[href]');
      const mframe = document.createElement('iframe');
      mframe.src = ma.href;
      mframe.title = ma.textContent.trim();
      mframe.allow = 'autoplay; fullscreen';
      mframe.allowFullscreen = true;
      mframe.referrerPolicy = 'no-referrer-when-downgrade';
      video.classList.add('desktop');
      mobilePlayer.classList.add('hero-slider-player-link');
      frame.append(el('div', 'hero-slider-video mobile', mframe), mobilePlayer);
    }
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'hero-slider-toggle';
    toggle.setAttribute('aria-label', 'Pause video');
    toggle.innerHTML = PAUSE + PLAY;
    toggle.addEventListener('click', () => {
      const paused = toggle.dataset.state === 'paused';
      toggle.dataset.state = paused ? 'playing' : 'paused';
      toggle.setAttribute('aria-label', paused ? 'Pause video' : 'Play video');
    });
    media.append(toggle);
  } else if (pic) {
    frame.append(el('div', 'hero-slider-video still', pic));
  }

  const row = el('div', 'hero-slider-row');
  if (titleP) {
    const link = titleP.querySelector('a[href]');
    const slots = el('div', 'hero-slider-text', el('div', 'hero-slider-title', titleP));
    if (rest.length) slots.append(el('div', 'hero-slider-desc', ...rest));
    const a = el('a', 'hero-slider-link', slots);
    a.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
    row.append(a);
  }
  const content = el('div', 'hero-slider-content', el('div', 'hero-slider-rule', row));
  block.replaceChildren(media, content);
  // page title (fix-hub-c): a heading authored before the slide link is the hub page h1, set over
  // the band like the media-hero title (source hub heroslider + content-body h1)
  const pageTitle = titleP && nodes.find((n) => /^H[1-6]$/.test(n.tagName) && n !== titleP
    && nodes.indexOf(n) < nodes.indexOf(titleP));
  if (pageTitle) {
    const grid = el('div', 'hero-slider-heading-grid', el('div', 'hero-slider-heading', pageTitle));
    media.append(el('div', 'hero-slider-heading-band', grid));
  }
  block.setAttribute('role', 'region');
  bindParallax(media);
}
