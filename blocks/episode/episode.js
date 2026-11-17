/**
 * episode — podcast episode page (reply.com plain template, Meta Minutes series): hero (series
 * label, title, speakers with mic icon, listen-on badges), video player on a half-dark band,
 * centred episode text on the dark band, and a closing statement + CTA.
 *
 * Decode: template-slotted. Rows are classified by content (never by index); authored nodes are
 * MOVED into the template by role.
 *
 * Authoring rows (any order; classification below):
 *   - hero: the row holding the Heading 1 (series label paragraph before it, heading(s))
 *   - speakers: icon image + speakers paragraph (a row with one image and text)
 *   - badges: links wrapping images (Apple Podcasts / Spotify / Amazon Music)
 *   - player: a link to the media player (dam-media openPlayer widget URL)
 *   - text: paragraphs (the episode description)
 *   - outro: the last row holding a button link (statement paragraph + CTA)
 *
 * @ew-exempt player-url — the player link is the iframe source; it stays in the DOM, visually
 *   hidden, as the authored value.
 */

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children);
  return e;
}

function nodesOf(row) {
  const out = [];
  [...row.children].forEach((col) => {
    [...col.childNodes].forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) out.push(n);
      else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        const p = document.createElement('p');
        p.append(n);
        out.push(p);
      }
    });
  });
  return out;
}

function classify(row) {
  if (row.querySelector('h1, h2')) return 'hero';
  const links = [...row.querySelectorAll('a[href]')];
  if (links.some((a) => /openPlayer|widget\.html/i.test(a.href))) return 'player';
  if (links.length && links.every((a) => a.querySelector('img, picture'))) return 'badges';
  if (row.querySelector('.button, strong a, em a')) return 'outro';
  if (row.querySelector('img, picture') && row.textContent.trim()) return 'speakers';
  return 'text';
}

function buildPlayer(nodes) {
  const box = el('div', 'episode-player-frame');
  const a = nodes.map((n) => (n.matches('a') ? n : n.querySelector('a[href]'))).find(Boolean);
  if (a) {
    const iframe = document.createElement('iframe');
    iframe.src = a.href;
    iframe.title = a.textContent.trim() || 'Episode player';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    iframe.loading = 'lazy';
    box.append(iframe);
  }
  const keep = el('div', 'episode-player-src');
  keep.append(...nodes);
  box.append(keep);
  return box;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .episode-hero')) return; // EW9 re-entrant

  const slots = {
    hero: [], speakers: [], badges: [], player: [], text: [], outro: [],
  };
  [...block.children].forEach((row) => slots[classify(row)].push(...nodesOf(row)));

  // hero: series label (paragraphs before the first heading) + heading(s)
  const firstH = slots.hero.findIndex((n) => /^H[1-6]$/.test(n.tagName));
  const label = firstH > 0 ? slots.hero.slice(0, firstH) : [];
  const title = slots.hero.slice(label.length);

  const heroCell = el('div', 'episode-hero-cell r-cell');
  if (label.length) heroCell.append(el('div', 'episode-label', ...label));
  heroCell.append(el('div', 'episode-title rich', ...title));

  if (slots.speakers.length) {
    const icon = slots.speakers.filter((n) => n.querySelector('img') || n.matches('picture, img'));
    const text = slots.speakers.filter((n) => !icon.includes(n));
    heroCell.append(el(
      'div',
      'episode-speakers',
      el('div', 'episode-speakers-icon', ...icon),
      el('div', 'episode-speakers-text', ...text),
    ));
  }
  if (slots.badges.length) {
    const badges = el('div', 'episode-badges');
    slots.badges.forEach((n) => {
      const links = n.matches('a') ? [n] : [...n.querySelectorAll('a')];
      if (links.length > 1 || n.matches('ul, ol')) {
        links.forEach((a) => badges.append(el('div', 'episode-badge', a)));
      } else badges.append(el('div', 'episode-badge', n));
    });
    heroCell.append(badges);
  }

  const hero = el('div', 'episode-hero r-grid', heroCell);
  const player = el('div', 'episode-player', el(
    'div',
    'r-grid',
    el('div', 'episode-player-cell r-cell', buildPlayer(slots.player)),
  ));
  const text = el('div', 'episode-text', el(
    'div',
    'r-grid',
    el('div', 'episode-text-cell r-cell', el('div', 'rich', ...slots.text)),
  ));
  const parts = [hero, player, text];
  if (slots.outro.length) {
    parts.push(el('div', 'episode-outro', el(
      'div',
      'r-grid',
      el('div', 'episode-outro-cell r-cell', el('div', 'episode-outro-inner', ...slots.outro)),
    )));
  }
  if (!slots.player.length) block.classList.add('no-player');
  block.replaceChildren(...parts);
}
