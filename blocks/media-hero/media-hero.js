/**
 * media-hero — hub page hero: full-bleed image band (2:3 below 768, 2:1 above) with a bottom scrim
 * and the page title (h1, display face) on the 4 / 8 / 12-col grid (reply.com hub, .media-hero).
 *
 * Decode: template-slotted. Authored nodes are MOVED into empty slots by role.
 *
 * Authoring rows (classified by content, not by position):
 *   - picture(s): first = desktop 16:9, optional second = the <= 767 crop (source art direction)
 *   - page title as Heading 1
 *
 * Motion: the image moves with scroll (parallax, translateY of --ty), as on the source.
 * @variants tint-20 / tint-40 — black veil over the image (the source overlay alpha).
 * @variants slide — hub heroslider (heroslider-runtime, one slide): the paragraph(s) after the
 *   title form the slide caption at the band's foot (hairline rule, linked caption title + abstract
 *   >= 1024); EW6: the caption link's href is read, the authored anchor unwrapped, one new anchor
 *   wraps the caption title + abstract (as the source anchor does).
 * @variants label — the first paragraph after the title is the category label above it (10 px
 *   uppercase); a bold + italic paragraph (no link) in the intro is the form trigger button.
 * @variants intro — hub offering hero: the paragraph(s) after the title are the hero intro, set
 *   over the band below the title (cols 3-7, 16 px / 300, white) >= 768 and below the band
 *   (ink, 40 px padding) < 768 — the same authored nodes, re-parented on resize;
 *   over (with intro) — the intro stays over the band below 768 too (en/adobe live hero).
 */

function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...children);
  return d;
}

function bindParallax(block) {
  const update = () => {
    const vh = window.innerHeight;
    const band = block.querySelector(':scope > .media-hero-bg') || block;
    const r = band.getBoundingClientRect();
    // live progress: 0 when the band top sits at mid-viewport, 1 one band height later;
    // max shift 12.5 % (probed on the source at 1440 and 360, scroll 0..900)
    const p = Math.min(1, Math.max(0, (vh / 2 - r.top) / (r.height || 1)));
    block.style.setProperty('--ty', `${(p * 12.5).toFixed(4)}%`);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .media-hero-bg')) return;
  const pics = [...block.querySelectorAll('picture')];
  const imgs = pics.length ? pics : [...block.querySelectorAll('img')];
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const bg = div('media-hero-bg');
  imgs.forEach((p, i) => {
    let cls = 'media-hero-pic';
    if (imgs.length > 1) cls += i ? ' mobile' : ' desktop';
    bg.append(div(cls, p));
  });
  // video (fix-hub-c): a paragraph holding only the DAM player link is the band's media (the
  // source video-dam-container); the link stays in the band as a visually hidden caption
  const player = [...block.querySelectorAll(':scope > div > div > p')].find((n) => {
    const links = [...n.querySelectorAll('a[href]')];
    return links.length === 1 && /dam-media\.reply\.com\/.+widget\.html/.test(links[0].href)
      && n.textContent.trim() === links[0].textContent.trim();
  });
  if (player) {
    const a = player.querySelector('a[href]');
    const iframe = document.createElement('iframe');
    iframe.src = a.href;
    iframe.title = a.textContent.trim();
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    player.classList.add('media-hero-player-link');
    bg.append(div('media-hero-video', iframe), player);
  }
  const title = div('media-hero-title r-cell');
  if (heading) {
    // the source paints the title through an inner span; mirror it by MOVING the child nodes
    const s = document.createElement('span');
    s.append(...heading.childNodes);
    heading.append(s);
    title.append(heading);
  }
  const rest = [...block.querySelectorAll(':scope > div > div > *')];
  const capLink = block.classList.contains('slide')
    ? rest.map((n) => n.querySelector('a[href]')).find(Boolean) : null;
  let caption = null;
  if (capLink) {
    // slide caption: title paragraph (holding the link) + abstract paragraph(s)
    const capNodes = rest.filter((n) => n.tagName === 'P');
    const titleP = capNodes.find((n) => n.contains(capLink));
    const slots = div('media-hero-caption-text', div('media-hero-caption-title', titleP));
    const desc = capNodes.filter((n) => n !== titleP);
    if (desc.length) slots.append(div('media-hero-caption-desc', ...desc));
    const a = document.createElement('a');
    a.className = 'media-hero-caption-link';
    a.href = capLink.getAttribute('href');
    capLink.replaceWith(...capLink.childNodes);
    a.append(slots);
    caption = div('media-hero-caption r-grid', div('media-hero-caption-rule', a));
  }
  // intro / label: the paragraphs that wrapped the moved pictures are left empty — not intro copy
  const sparse = block.classList.contains('intro') || block.classList.contains('label');
  const leftovers = [...block.querySelectorAll(':scope > div > div > *')]
    .filter((n) => !sparse || n.textContent.trim() || n.querySelector('picture, img, iframe, a'));
  // label: the first paragraph after the title is the category label set above it
  if (block.classList.contains('label') && leftovers[0] && leftovers[0].tagName === 'P') {
    const label = div('media-hero-label');
    label.append(...leftovers.shift().childNodes);
    title.prepend(label);
  }
  // a paragraph that is only bold + italic text (no link) is the source's form trigger button
  leftovers.forEach((p) => {
    const em = p.querySelector(':scope > strong > em:only-child, :scope > em > strong:only-child');
    if (!em || p.children.length !== 1 || p.querySelector('a')
      || em.textContent.trim() !== p.textContent.trim()) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'media-hero-cta';
    btn.append(...em.childNodes);
    p.replaceChildren(btn);
    p.classList.add('media-hero-cta-wrap');
  });
  const grid = div('r-grid', title);
  const overlay = div('media-hero-overlay', grid);
  let intro = null;
  if (block.classList.contains('intro') && leftovers.length) {
    intro = div('media-hero-intro r-cell', ...leftovers);
  } else {
    // leftovers (any other authored node) follow the title
    leftovers.forEach((n) => title.append(n));
  }
  block.replaceChildren(bg, overlay);
  if (caption) block.append(caption);
  if (intro) {
    const below = div('media-hero-below r-grid');
    block.append(below);
    const mq = window.matchMedia('(width >= 768px)');
    // over (fix-hub-e, en/adobe): the intro stays over the band below 768 too
    const over = block.classList.contains('over');
    const place = () => (mq.matches || over ? grid.append(intro) : below.append(intro));
    mq.addEventListener('change', place);
    place();
  }
  bindParallax(block);
}
