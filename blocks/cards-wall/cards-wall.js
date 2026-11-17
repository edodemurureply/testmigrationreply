/**
 * cards-wall — masonry card wall (source cards-wall-runtime): stacked < 768; >= 768 a CSS grid with
 * 0px auto-rows and a 5px row gap, each card spanning N rows measured from its height; 2 cols >=
 * 768,
 * 3 >= 1024, 4 >= 1112. Optional "Load more content" pager (reveals hidden cards in batches of 12;
 * the static listing is decision D-02 — index-backed on live). Reconstructive: one row per card.
 *
 * Authoring rows (classified by content):
 *   - card: picture (optional second picture = the <= 576 crop) | heading with the card link |
 *     category paragraph(s) (no link) after the heading; paragraph(s) after the category = abstract
 *     a date-only paragraph (mm/dd/yyyy) after the category = the time stamp in the meta row
 *   - pager: a final row holding only one paragraph without link or picture = the pager label
 *
 * Optional card-type cell (any cell holding only a type token, hub walls): hero | thumb-1-1 |
 *   thumb-2-3 | abstract | hover | hover-1-1, optionally followed by "logo" (then the last
 *   picture of the row is the partner logo shown over the image). Without it a card renders as
 *   before (thumb-2-3 look).
 *   hero = full-width featured card (2:3 -> 2:1 image, overlay body with logo / category / title /
 *   abstract); abstract = bordered card with a visible abstract, no cover link; hover = 2:3 card
 *   whose image shrinks on hover to reveal the abstract.
 * @ew-exempt metadata — the card-type cell selects a card layout and is never displayed
 * @variants card type: hero | thumb-1-1 | thumb-2-3 | abstract | hover | hover-1-1 | product |
 *   event | logo | video | span-N
 *   tls-N / als-N = per-card title / abstract letter-spacing N ‰em below 768 (stand-in face fit);
 *   span-N = the live row span captured at 1440 (masonry placement kept as the source from 1440);
 *   product = 2:3 cover with the copy over a light scrim, the whole card one link (index);
 *   event = white bordered event card (9:4 head with the date block over the photo, title,
 *   category, abstract, location; the whole card one link — hub walls);
 *   video = the card media is the DAM player (a paragraph holding only the player link — kept as a
 *   visually hidden caption, @ew-exempt player-url) with a pause / play disc (index).
 *
 * @variants dark — white copy on the ink band (cardwalldarktheme), brand margin-bottom 56 / 120;
 *   all — every authored card renders (the captured listing batch; the pager stays as on the
 *   source); listing — insights wall margin-bottom 96 / 104 / 96 / 120; split — the cover anchor
 *   is named by the title only (server-rendered source cards: image link + title link);
 *   special — 3 columns from
 *   1112 (index featured wall); home-featured / home-main — index wall margins, home R-02 tracking
 * Hub spacing tokens t-<px> / tm-<px>: the measured space above the wall (>= 768 / < 768).
 * Cover anchors are presentational duplicates of the title link (aria-hidden, tabindex -1).
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

const text = (node) => (node ? node.textContent.trim() : '');

// category dot colours (theme category palette, as rendered on the source cards)
const CATEGORY_COLORS = {
  research: '#00e0ce',
  'white paper': '#00e0ce',
  'product & accelerator': '#02d34a',
  article: '#5b8e7d',
  labs: '#d314c0',
  'case study': '#eb0037',
  acknowledgment: '#ff8c00',
  news: '#ff8c00',
  'best practice': '#ffd138',
};

const BATCH = 12;
const EVENT_TIME = /\d{1,2}(:\d{2})?\s*(AM|PM)\b|\bGMT|\bCES?T\b|^\d{1,2}[:.]\d{2}\b/i;

const TYPE_RE = /^(hero|thumb-1-1|thumb-2-3|abstract|hover-1-1|hover|product|event)(\s+logo)?(\s+video)?(\s+play)?(\s+span-\d+)?((?:\s+[ta]ls-\d+)*)$/i;
const PLAYER = /dam-media\.reply\.com\/.+widget\.html/;

function cardType(row) {
  const cell = [...row.children].find((c) => !c.querySelector('picture, img, a, h1, h2, h3, h4, h5, h6')
    && TYPE_RE.test(text(c)));
  if (!cell) {
    return {
      cell: null, type: '', logo: false, video: false, play: false,
    };
  }
  const [, type, logo, video, play, span, track] = text(cell).toLowerCase().match(TYPE_RE);
  return {
    cell,
    type,
    logo: !!logo,
    video: !!video,
    play: !!play,
    span: span ? span.trim().slice(5) : '',
    track: (track || '').trim().split(/\s+/).filter(Boolean),
  };
}

function buildHeroCard(row, imgs, logoPic, heading, link, cats, abstracts) {
  const image = el('div', 'reply-card-image');
  imgs.forEach((p, i) => {
    let cls = 'reply-card-pic';
    if (imgs.length > 1) cls += i ? ' mobile' : ' desktop';
    image.append(el('div', cls, p));
  });
  const box = el('div', 'reply-card-image-container');
  if (link) {
    const cover = el('a', 'reply-card-cover', image);
    cover.href = link.getAttribute('href');
    cover.tabIndex = -1;
    cover.setAttribute('aria-hidden', 'true');
    cover.title = text(heading);
    box.append(cover);
  } else {
    box.append(image);
  }
  const body = el('div', 'reply-card-body');
  if (logoPic) body.append(el('div', 'reply-card-logo', logoPic));
  cats.forEach((n) => {
    const label = el('div', 'category-label');
    const color = CATEGORY_COLORS[text(n).toLowerCase()];
    if (color) {
      const dot = el('span', 'category-dot');
      dot.style.backgroundColor = color;
      label.append(dot);
    }
    label.append(el('div', 'category-name', n));
    body.append(label);
  });
  if (heading) body.append(el('div', 'reply-card-title', heading));
  if (abstracts.length) body.append(el('div', 'reply-card-abstract', ...abstracts));
  box.append(el('div', 'reply-card-grid', body));
  const item = el('div', 'cards-wall-item featured', el('div', 'reply-card reply-card-hero', box));
  return item;
}

function categoryLabel(n) {
  const label = el('div', 'category-label');
  const color = CATEGORY_COLORS[text(n).toLowerCase()];
  if (color) {
    const dot = el('span', 'category-dot');
    dot.style.backgroundColor = color;
    label.append(dot);
  }
  label.append(el('div', 'category-name', n));
  return label;
}

// product (card-wall-product, index): 2:3 cover, copy over a light scrim, the whole card one link
function buildProductCard(card, imgs, logoPic, heading, link, cats) {
  const image = el('div', 'reply-card-image');
  imgs.forEach((p, i) => {
    let cls = 'reply-card-pic';
    if (imgs.length > 1) cls += i ? ' mobile' : ' desktop';
    image.append(el('div', cls, p));
  });
  const body = el('div', 'reply-card-body');
  if (logoPic) body.append(el('div', 'reply-card-logo', logoPic));
  if (heading) body.append(el('div', 'reply-card-title', heading));
  cats.forEach((n) => body.append(categoryLabel(n)));
  const box = el('div', 'reply-card-image-container', image, body);
  if (link) {
    // EW6 card-as-link: read the href, unwrap the authored anchor, one anchor wraps the card
    const a = el('a', 'reply-card-cover', box);
    a.href = link.getAttribute('href');
    a.title = text(heading);
    if (/^https?:/.test(a.getAttribute('href')) && new URL(a.href).host !== window.location.host) {
      a.target = '_blank';
      a.rel = 'noreferrer';
    }
    link.replaceWith(...link.childNodes);
    card.append(a);
  } else {
    card.append(box);
  }
  return el('div', 'cards-wall-item', card);
}

// event (card-wall-event, hub walls): white bordered card, 9:4 head (event photo under a 20 %
// multiply veil, or the placeholder colour image) with the date block over it; body: title,
// category, abstract, time, location. Rows: [date paragraph(s) before the heading] | heading with
// the event link | category | abstract | [time] | location (the last paragraph when more than one
// follows; a time-like paragraph before it = the time row). Time / location get the source icons.
function buildEventCard(card, all, imgs, heading, link, ranges = false) {
  card.classList.add('reply-card-event');
  const hIdx = heading ? all.indexOf(heading) : -1;
  const paras = all.filter((n) => n !== heading && n.tagName === 'P'
    && !n.querySelector('picture, img') && text(n));
  const dates = paras.filter((n) => hIdx >= 0 && all.indexOf(n) < hIdx);
  const after = paras.filter((n) => !dates.includes(n));
  // ranges variant (fix-hub-e): a long first paragraph is the abstract of a card without a
  // category (live cards with no event type)
  const catless = ranges && after[0] && text(after[0]).split(/\s+/).length > 4;
  const [cat, ...more] = catless ? [null, ...after] : after;
  const loc = more.length > 1 ? more.pop() : null;
  // optional time row (e.g. "8:00 AM – 12:00 PM GMT+1") between the abstract and the location
  const time = more.length > 1 && EVENT_TIME.test(text(more[more.length - 1])) ? more.pop() : null;
  const image = el('div', 'reply-card-image');
  imgs.slice(0, 1).forEach((p) => image.append(el('div', 'reply-card-pic', p)));
  if (dates.length) {
    // first date paragraph = the day(s) (.h3 face), the rest = month + year
    const [day, ...month] = dates;
    const date = el('div', 'reply-card-date', el('div', 'reply-card-day', day));
    if (month.length) date.append(el('div', 'reply-card-month', ...month));
    image.append(date);
  }
  const box = el('div', 'reply-card-image-container', image);
  const body = el('div', 'reply-card-body');
  if (heading) body.append(el('div', 'reply-card-title', heading));
  if (cat) body.append(el('div', 'reply-card-meta', el('div', 'category-label', el('div', 'category-name', cat))));
  if (more.length) body.append(el('div', 'reply-card-abstract', ...more));
  if (time || loc) {
    const info = el('div', 'reply-card-event-info');
    if (time) info.append(el('div', 'reply-card-time-row', time));
    if (loc) info.append(el('div', 'reply-card-location', loc));
    body.append(info);
  }
  if (link) {
    // EW6 card-as-link: read the href, unwrap the authored anchor, one anchor wraps the card
    const a = el('a', 'reply-card-cover', box, body);
    a.href = link.getAttribute('href');
    a.title = text(heading);
    link.replaceWith(...link.childNodes);
    card.append(a);
  } else {
    card.append(box, body);
  }
  return el('div', 'cards-wall-item', card);
}

const PAUSE = '<svg class="reply-card-pause" width="8" height="13" viewBox="0 0 8 13" fill="none" '
  + 'aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.9999 0.794922V12.7949H0.'
  + '399902V0.795117L1.9999 0.794922ZM7.5999 0.794922V12.7949H5.9999V0.795117L7.5999 0.794922Z" '
  + 'fill="white"/></svg>';
const PLAY = '<svg class="reply-card-play" width="13" height="16" viewBox="0 0 13 16" fill="none" '
  + 'aria-hidden="true"><path d="M0.98 0.87L11.94 7.53C12.02 7.58 12.09 7.65 12.13 7.73C12.18 7.81 '
  + '12.2 7.91 12.2 8C12.2 8.09 12.18 8.19 12.13 8.27C12.09 8.35 12.02 8.42 11.94 8.47L0.98 15.13C0.9 '
  + '15.17 0.81 15.2 0.72 15.2C0.63 15.2 0.54 15.18 0.46 15.13C0.38 15.08 0.32 15.01 0.27 14.93C0.22 '
  + '14.84 0.2 14.75 0.2 14.65V1.34C0.2 1.25 0.22 1.15 0.27 1.07C0.32 0.99 0.38 0.92 0.46 0.87C0.54 '
  + '0.82 0.63 0.8 0.72 0.8C0.81 0.8 0.9 0.83 0.98 0.87Z" fill="white"/></svg>';

// video (card-wall-thumb-2-3-logo-video-background, index): the DAM player autoplays muted in the
// card image box (captureState restoreAtDelivery); the player link stays as a hidden caption
function buildVideoBox(player, link, heading) {
  const a = player.tagName === 'A' ? player : player.querySelector('a[href]');
  const iframe = document.createElement('iframe');
  iframe.src = a.href;
  iframe.title = text(a);
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; fullscreen';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  player.classList.add('reply-card-player-link');
  const box = el('div', 'reply-card-image-container', el('div', 'reply-card-video', iframe, player));
  if (link) {
    const cover = el('a', 'reply-card-video-link');
    cover.href = link.getAttribute('href');
    cover.title = text(heading);
    cover.tabIndex = -1;
    cover.setAttribute('aria-hidden', 'true');
    box.append(cover);
  }
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'reply-card-toggle';
  toggle.setAttribute('aria-label', 'Pause video');
  toggle.innerHTML = PAUSE + PLAY;
  toggle.addEventListener('click', () => {
    const paused = toggle.dataset.state === 'paused';
    toggle.dataset.state = paused ? 'playing' : 'paused';
    toggle.setAttribute('aria-label', paused ? 'Pause video' : 'Play video');
  });
  box.append(toggle);
  return box;
}

// play (card-wall-thumb-2-3 with player-icon-container, insights): a dark overlay layer and a
// centred 72 px round play button over the image; the button opens the DAM player in a modal
// dialog (data-toggle="modalvideo" on the source). The player link stays as a hidden caption.
function buildPlayButton(box, player) {
  const a = player.tagName === 'A' ? player : player.querySelector('a[href]');
  player.classList.add('reply-card-player-link');
  const dialog = document.createElement('dialog');
  dialog.className = 'reply-card-modal';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'reply-card-modal-close';
  close.setAttribute('aria-label', 'Close');
  close.textContent = '\u00d7';
  const frame = el('div', 'reply-card-modal-frame');
  dialog.append(close, frame);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'reply-card-play-button';
  button.setAttribute('aria-label', 'Play');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = PLAY;
  button.addEventListener('click', () => {
    if (!frame.firstChild) {
      const iframe = document.createElement('iframe');
      iframe.src = a.href;
      iframe.title = text(a);
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      frame.append(iframe);
    }
    dialog.showModal();
    button.setAttribute('aria-expanded', 'true');
  });
  const shut = () => {
    dialog.close();
    frame.replaceChildren();
    button.setAttribute('aria-expanded', 'false');
  };
  close.addEventListener('click', shut);
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    shut();
  });
  const layer = el('div', 'reply-card-play-layer');
  box.append(layer, el('div', 'reply-card-play-icon', button), player, dialog);
}

function buildCard(row, block) {
  const kind = cardType(row);
  const pics = [...row.querySelectorAll('picture')];
  let imgs = pics.length ? pics : [...row.querySelectorAll('img')];
  const logoPic = kind.logo && imgs.length > 1 ? imgs[imgs.length - 1] : null;
  if (logoPic) imgs = imgs.filter((p) => p !== logoPic);
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  // the DAM player link is never the card link (fix-hub-e: play cards with an unlinked title)
  const link = (heading && heading.querySelector('a[href]'))
    || [...row.querySelectorAll('a[href]')].find((a) => !PLAYER.test(a.href)) || null;
  // video cards: the paragraph holding only the DAM player link is the media, not copy
  // (buildAutoBlocks wraps `/widgets/` links into a div.widget before decoration — accept either)
  const player = (kind.video || kind.play) ? [...row.querySelectorAll(':scope > div > *')].find((n) => {
    const links = n.tagName === 'A' ? [n] : [...n.querySelectorAll('a[href]')];
    return links.length === 1 && PLAYER.test(links[0].href)
      && n.textContent.trim() === links[0].textContent.trim();
  }) : null;
  const all = [...row.querySelectorAll(':scope > div > *')]
    .filter((n) => (!kind.cell || !kind.cell.contains(n)) && n !== player);
  const hIdx = heading ? all.indexOf(heading) : -1;
  const texts = all.filter((n) => n !== heading && n.tagName !== 'PICTURE'
    && !n.querySelector('picture, img') && text(n));
  // a date-only paragraph (mm/dd/yyyy) is the card's time stamp, shown in the meta row
  const times = texts.filter((n) => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(text(n)));
  const rest = texts.filter((n) => !times.includes(n));
  const cats = rest.filter((n, i) => i === 0 && (hIdx < 0 || all.indexOf(n) > hIdx));
  const abstracts = rest.filter((n) => !cats.includes(n));
  if (kind.type === 'hero') return buildHeroCard(row, imgs, logoPic, heading, link, cats, abstracts);

  const card = el('div', 'reply-card');
  if (kind.type) card.classList.add(`reply-card-kind-${kind.type}`);
  // hover-1-1 is the hover card on 16:9 -> 1:1 ratios (card-wall-hover-1-1)
  if (kind.type === 'hover-1-1') card.classList.add('reply-card-kind-hover');
  if (logoPic) card.classList.add('reply-card-logo-over');
  if (kind.type === 'product') return buildProductCard(card, imgs, logoPic, heading, link, cats);
  if (kind.type === 'event') {
    return buildEventCard(card, all, imgs, heading, link, block.classList.contains('ranges'));
  }
  if (player && kind.video) {
    card.append(buildVideoBox(player, link, heading));
  } else if (imgs.length) {
    const image = el('div', 'reply-card-image');
    imgs.forEach((p, i) => {
      let cls = 'reply-card-pic';
      if (imgs.length > 1) cls += i ? ' mobile' : ' desktop';
      image.append(el('div', cls, p));
    });
    const box = el('div', 'reply-card-image-container', image);
    if (logoPic) box.append(el('div', 'reply-card-logo', logoPic));
    if (player) {
      // play: the image is no link — the round play button opens the DAM player in a modal
      buildPlayButton(box, player);
      card.append(box);
    } else if (link && kind.type !== 'abstract') {
      const cover = el('a', 'reply-card-cover', box);
      cover.href = link.getAttribute('href');
      cover.tabIndex = -1;
      cover.setAttribute('aria-hidden', 'true');
      // presentational duplicate of the source's whole-card anchor: same name (title + category;
      // the listing wall, split (server-rendered) and title-name source cards carry the title only)
      const titleOnly = ['listing', 'home-featured', 'home-main', 'split', 'title-name']
        .some((c) => block.classList.contains(c));
      const named = titleOnly ? [heading] : [heading, ...cats];
      cover.title = named.map(text).filter(Boolean).join(' ');
      card.append(cover);
    } else {
      card.append(box);
    }
  }
  const body = el('div', 'reply-card-body');
  if (heading) body.append(el('div', 'reply-card-title', heading));
  if (cats.length) {
    const meta = el('div', 'reply-card-meta');
    cats.forEach((n) => {
      const label = el('div', 'category-label');
      const color = CATEGORY_COLORS[text(n).toLowerCase()];
      if (color) {
        const dot = el('span', 'category-dot');
        dot.style.backgroundColor = color;
        label.append(dot);
      }
      label.append(el('div', 'category-name', n));
      meta.append(label);
    });
    times.forEach((n) => meta.append(el('div', 'reply-card-time', n)));
    body.append(meta);
  }
  // (fix-hub-f) a last abstract paragraph that is one link is the card's CTA (reply-card-cta,
  // e.g. the abstract card's "Download" button-link)
  const tail = abstracts.length > 1 ? abstracts[abstracts.length - 1] : null;
  const ctaLink = tail && tail.querySelector('a[href]');
  const cta = ctaLink && text(ctaLink) === text(tail) ? abstracts.pop() : null;
  if (abstracts.length) body.append(el('div', 'reply-card-abstract', ...abstracts));
  if (cta) body.append(el('div', 'reply-card-cta', cta));
  card.append(body);
  return el('div', 'cards-wall-item', card);
}

const px = (v) => parseFloat(v) || 0;

function bindWall(block) {
  const grid = block.querySelector('.cards-wall-grid');
  // hub walls (typed cards): +3 px before rounding, fitted to the captured live row spans
  const fit = block.querySelector('.reply-card-hero, [class*="reply-card-kind-"]') ? 3 : 0;
  const layout = () => {
    const w = window.innerWidth;
    grid.querySelectorAll('.cards-wall-item').forEach((item) => {
      if (w < 768) {
        item.style.gridRowEnd = '';
        return;
      }
      // a captured live row span (span-N token) is kept from 1440, as the source masonry
      if (w >= 1440 && item.dataset.span) {
        item.style.gridRowEnd = `span ${item.dataset.span}`;
        return;
      }
      const card = item.firstElementChild;
      const mb = px(getComputedStyle(item).marginBottom);
      const h = card.getBoundingClientRect().height + mb + fit;
      item.style.gridRowEnd = `span ${Math.ceil(h / 5) + 1}`;
    });
  };
  const more = block.querySelector('.cards-wall-more');
  if (more) {
    const reveal = () => {
      const hidden = [...grid.querySelectorAll('.cards-wall-item[hidden]')].slice(0, BATCH);
      hidden.forEach((it) => {
        it.hidden = false;
      });
      if (!grid.querySelector('.cards-wall-item[hidden]')) more.parentElement.hidden = true;
      layout();
    };
    more.addEventListener('click', reveal);
    more.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        reveal();
      }
    });
  }
  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  if (window.ResizeObserver) new ResizeObserver(layout).observe(grid);
  grid.querySelectorAll('img').forEach((img) => img.addEventListener('load', layout));
  layout();
}

// hub spacing tokens (additive): t-<px> / tm-<px> = the source section's measured space above
// the wall (>= 768 / < 768); b-<px> / bm-<px> / bx-<px> = space below (>= 768 / < 768 / >= 1440,
// `n` prefix = negative)
function applySpacing(block) {
  let on = false;
  [...block.classList].forEach((c) => {
    const m = c.match(/^(t|tm|b|bm|bx)-(n?\d+)$/);
    if (!m) return;
    on = true;
    if (m[1][0] === 'b') block.classList.add('spaced-b');
    block.style.setProperty(`--sp-${m[1]}`, `${m[2].replace(/^n/, '-')}px`);
  });
  if (on) block.classList.add('spaced');
}

export default function decorate(block) {
  if (block.querySelector(':scope > .cards-wall-wrap')) return;
  applySpacing(block);
  ensureParagraphs(block);
  const rows = [...block.children];
  const last = rows[rows.length - 1];
  const isPager = (row) => row && !row.querySelector('picture, img, a[href], h1, h2, h3, h4, h5, h6')
    && row.querySelectorAll('p').length === 1;
  const pagerRow = rows.length > 1 && isPager(last) ? last : null;
  const grid = el('div', 'cards-wall-grid');
  rows.filter((r) => r !== pagerRow && (text(r) || r.querySelector('picture, img')))
    .forEach((row) => {
      const { span, track } = cardType(row);
      const item = buildCard(row, block);
      if (span) item.dataset.span = span;
      // per-card tracking tokens tls-N / als-N (fix-hub-k): title / abstract letter-spacing N ‰em
      // below 768, measured per card where the stand-in face wraps one line short of the live face
      track.forEach((t) => {
        item.classList.add(`reply-card-${t.slice(0, 3)}`);
        item.style.setProperty(`--cw-${t.slice(0, 3)}`, `${Number(t.slice(4)) / 1000}em`);
      });
      // the featured (hero) card does not count towards the first batch, as on the source
      if (!block.classList.contains('all')
        && grid.querySelectorAll('.cards-wall-item:not(.featured)').length >= BATCH) item.hidden = true;
      grid.append(item);
    });
  const cell = el('div', 'cards-wall-cell r-cell', grid);
  if (pagerRow) {
    // EW7: the label paragraph moves into a role=button wrapper (no <button> hosts authored text)
    const more = el('div', 'cards-wall-more', pagerRow.querySelector('p'));
    more.setAttribute('role', 'button');
    more.tabIndex = 0;
    cell.append(el('div', 'cards-wall-pager', more));
  }
  block.replaceChildren(el('div', 'cards-wall-wrap r-grid', cell));
  bindWall(block);
}
