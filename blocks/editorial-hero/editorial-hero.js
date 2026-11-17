/**
 * editorial-hero — research-report hero: parallax image band, category label, page title (h1),
 * lead paragraph and tags (reply.com editorial template, section .ed-hero).
 *
 * Decode: template-slotted. Authored nodes are MOVED into the template by role.
 *
 * Authoring rows:
 *   1. hero image (desktop, 16:9) | optional second image (mobile crop, 2:3)
 *      (cells are classified by content, not by position)
 *   2. category label (e.g. "Research")
 *   3. page title as Heading 1
 *   4. lead paragraph
 *   5. tags paragraph (one tag per line)
 *
 * @variants light — no media band (white hero, ink text); event — tags slot = event info card;
 *   dim — 40 % black layer on the image; overlay — title, lead and CTA (last cell) on the image;
 *   xl — larger article title, white foot.
 *
 * Motion: the image band moves with scroll (parallax, translateY of --ty), as on the source.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...children);
  return d;
}

// the source paints heading text through an inner colour span (span.c-white); mirror it by MOVING
// the heading's child nodes into one span (the heading element itself stays the authored node)
function inkSpan(heading) {
  if (!heading || heading.querySelector(':scope > span.ink')) return;
  const s = document.createElement('span');
  s.className = 'ink';
  s.append(...heading.childNodes);
  heading.append(s);
}

function bindParallax(media) {
  const update = () => {
    const vh = window.innerHeight;
    const r = media.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    // factor fitted to the live transform (13.23 % >= 768, 15.39 % below)
    const k = window.innerWidth < 768 ? 15.39 : 13.23;
    media.style.setProperty('--ty', `${(p * k).toFixed(4)}%`);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// pin-info (< 1024): once the hero is scrolled past, the source event info box leaves the flow
// and becomes a fixed white bar under the header showing the event title (the page shortens by
// the box's in-flow overhang); scrolling back above the collapsed hero bottom restores it
function bindPinInfo(block, tags, heading) {
  const bar = div('pin-title');
  bar.textContent = heading ? heading.textContent.trim() : '';
  bar.setAttribute('aria-hidden', 'true');
  tags.prepend(bar);
  const mq = window.matchMedia('(width < 1024px)');
  let releaseAt = 0;
  const update = () => {
    const on = tags.classList.contains('pinned');
    if (!mq.matches) {
      if (on) tags.classList.remove('pinned');
      return;
    }
    if (!on) {
      const bottom = block.getBoundingClientRect().bottom + window.scrollY;
      if (window.scrollY <= bottom) return;
      const h0 = document.documentElement.scrollHeight;
      tags.classList.add('pinned');
      releaseAt = bottom - (h0 - document.documentElement.scrollHeight);
    } else if (window.scrollY < releaseAt) tags.classList.remove('pinned');
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .grid')) return;

  // classify CELLS (a single-paragraph cell is delivered as bare text, so cells move whole)
  const media = [];
  let headingCell = null;
  const before = [];
  const after = [];
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (cell.querySelector('h1, h2')) {
      headingCell = cell;
      return;
    }
    const pics = [...cell.querySelectorAll('picture, img')].filter((n) => !n.closest('picture')
      || n.tagName === 'PICTURE');
    if (pics.length && !cell.textContent.trim()) {
      media.push(...pics);
      return;
    }
    if (!cell.textContent.trim()) return;
    (headingCell ? after : before).push(cell);
  });
  const [lead, ...tags] = after;

  // media band
  const bg = div('media-bg');
  if (media[0]) bg.append(wrapNode(media[0], 'pic-desktop'));
  if (media[1]) bg.append(wrapNode(media[1], 'pic-mobile'));
  else bg.classList.add('single');
  const mediaBox = div('media', bg);
  mediaBox.dataset.parallaxHero = '';

  // head: category label + spacer + title
  const title = div('title r-cell');
  if (before.length) {
    const dot = document.createElement('span');
    dot.className = 'category-dot';
    title.append(div('category-label', dot, div('category-name', ...before)));
  }
  const spacer = div('sp-hero');
  spacer.setAttribute('aria-hidden', 'true');
  title.append(spacer);
  if (headingCell) {
    inkSpan(headingCell.querySelector('h1, h2'));
    title.append(wrapNode(headingCell, 'title-text'));
  }
  const head = div('head', div('r-grid', title));

  // foot: dash + lead + tags
  const dash = div('dash r-cell', document.createElement('span'));
  dash.setAttribute('aria-hidden', 'true');
  const footGrid = div('r-grid', dash);
  // dl: the lead cell's last paragraph is the source download trigger (hubspot modal <button>)
  // under the lead; its text nodes are MOVED into the button
  const leadPs = lead ? lead.querySelectorAll(':scope > p') : [];
  if (block.matches('.dl') && leadPs.length > 1) {
    const p = leadPs[leadPs.length - 1];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button dl-btn';
    btn.append(...p.childNodes);
    p.className = 'dl';
    p.append(btn);
  }
  if (lead) footGrid.append(div('lead r-cell', wrapNode(lead, 'txt')));
  // overlay: the last cell is the call to action (source hubspot form trigger, a <button>);
  // its text nodes are MOVED into the button
  if (block.matches('.overlay, .cta') && tags.length && !tags.at(-1).querySelector('a')) {
    const cell = tags.at(-1);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button';
    const src = cell.querySelector('p') || cell;
    btn.append(...src.childNodes);
    src.append(btn);
  }
  if (tags.length) footGrid.append(div('tags r-cell', div('txt', ...tags)));
  const foot = div('foot', footGrid);

  block.replaceChildren(div('grid', mediaBox, head, foot));
  bindParallax(mediaBox);
  const tagsCell = foot.querySelector('.tags');
  if (block.matches('.pin-info') && tagsCell) {
    bindPinInfo(block, tagsCell, block.querySelector('h1, h2'));
  }
}
