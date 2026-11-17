/**
 * social-wall — the source's embedded social feed carousel (Flockler wall on en-gaming): one
 * rail of post cards (#222 card: author row with avatar, name, handle and X badge, the 280 px
 * square post picture, a footer with the post age), previous / next buttons over the rail edges,
 * the selected card centred, the rail wrapping around (Flickity wrapAround, cellAlign center).
 *
 * Authoring: a row holding only an in-page link (#…) is the feed's skip link (kept, visually
 * hidden). Every other row is one post: first cell = the post picture; second cell = the author
 * avatar picture and one paragraph with the post links as on the source (profile link, the
 * post link behind the X badge, the post-age link). Legacy: one cell of paragraphs, one per post.
 */

const SVG = {
  x: '<svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"><path fill="currentColor"'
    + ' d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78'
    + 'L17.75 3Zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44Z"/></svg>',
  clock: '<svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true"><g fill="none"'
    + ' stroke="currentColor" stroke-width="1.3"><circle cx="9" cy="9" r="6"/><path d="M9 6v3.5'
    + 'l2 1.5"/></g></svg>',
  out: '<svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path fill="none"'
    + ' stroke="currentColor" stroke-width="1.2" d="M6 1h3v3M9 1 4.5 5.5M8 6.5V9H1V2h2.5"/></svg>',
};

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

function arrow(dir) {
  const b = el('button', `social-wall-${dir} round-bt`);
  b.type = 'button';
  b.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
  const d = dir === 'prev' ? 'M12 4 6 10l6 6' : 'M8 4l6 6-6 6';
  b.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor"
    stroke-width="1.5" aria-hidden="true"><path d="${d}"/></svg>`;
  return b;
}

function srOnly(text) {
  return el('span', 'social-wall-sr', text);
}

// the source's link labels carry their screen-reader text inline ("REPLY TOTEMSee profile page
// of @x (X (Twitter))@x", "1 yr. agoSee original post on Twitter (…)"): split them into the
// visible parts and a visually hidden part
function decorateProfile(a, avatar) {
  const m = a.textContent.trim().match(/^(.*?)(See profile page of .*?\)\))(@\S+)$/);
  const details = m
    ? el(
      'span',
      'social-wall-details',
      el('span', 'social-wall-name', m[1].trim()),
      srOnly(m[2]),
      el('span', 'social-wall-handle', m[3]),
    )
    : el('span', 'social-wall-details', el('span', 'social-wall-name', a.textContent.trim()));
  a.className = 'social-wall-profile';
  a.replaceChildren(...(avatar ? [el('span', 'social-wall-avatar', avatar)] : []), details);
  return a;
}

function decorateAge(a) {
  const m = a.textContent.trim().match(/^(.*?)(See original post.*)$/);
  const time = el('span', 'social-wall-age', m ? m[1].trim() : a.textContent.trim());
  a.className = 'social-wall-source';
  a.replaceChildren(time, ...(m ? [srOnly(m[2])] : []));
  a.insertAdjacentHTML('afterbegin', SVG.clock);
  a.insertAdjacentHTML('beforeend', SVG.out);
  return a;
}

function buildCard(post, avatar, links) {
  const [profile, ...rest] = links;
  const age = rest.filter((a) => a.textContent.trim()).pop();
  const badge = rest.find((a) => !a.textContent.trim());
  const meta = el('div', 'social-wall-meta');
  if (profile) meta.append(decorateProfile(profile, avatar));
  // the X badge links the post (an empty link on the source); a span if the link was dropped
  const mark = badge || el('span');
  mark.className = 'social-wall-badge';
  // its label is the post link's own screen-reader text (as on the source)
  const said = age && age.textContent.match(/See original post.*$/);
  if (badge && said) badge.setAttribute('aria-label', said[0].trim());
  mark.innerHTML = SVG.x;
  meta.append(mark);
  const card = el('div', 'social-wall-post', meta);
  if (post) card.append(el('div', 'social-wall-media', post));
  if (age) card.append(el('div', 'social-wall-footer', decorateAge(age)));
  return el('li', 'social-wall-card', card);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .social-wall-inner')) return;
  let skip = null;
  const rail = el('ul', 'social-wall-rail');
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const paras = [...row.querySelectorAll(':scope > div > p')];
    // the skip link: a lone in-page link (its paragraph, or the bare cell once unwrapped)
    [...paras, ...row.children].forEach((p) => {
      const a = p.querySelector('a[href^="#"]');
      if (!skip && a && p.textContent.trim() === a.textContent.trim()) skip = p;
    });
    const cells = [...row.children];
    const post = cells[0]?.querySelector('picture');
    if (post && cells.length > 1) {
      const avatar = cells[1].querySelector('picture');
      rail.append(buildCard(post, avatar, [...cells[1].querySelectorAll('a')]));
      return;
    }
    paras.filter((p) => p !== skip).forEach((p) => {
      rail.append(buildCard(null, null, [...p.querySelectorAll('a')]));
    });
  });
  const prev = arrow('prev');
  const next = arrow('next');
  const viewport = el('div', 'social-wall-viewport', rail);
  const inner = el('div', 'social-wall-inner', viewport, prev, next);
  if (skip) skip.classList.add('social-wall-skip');
  block.replaceChildren(...(skip ? [skip] : []), inner);

  const cards = [...rail.children];
  let index = 0;
  // wrap around: lay the cards out from the selected one, the remainder on both sides
  const layout = () => {
    const n = cards.length;
    if (!n) return;
    const step = cards[0].offsetWidth;
    const start = (viewport.clientWidth - step) / 2;
    const before = Math.floor((n - 1) / 2);
    cards.forEach((c, i) => {
      const slot = ((i - index + before + n) % n) - before;
      c.style.transform = `translateX(${start + slot * step - i * step}px)`;
    });
  };
  const go = (d) => {
    index = (index + d + cards.length) % cards.length;
    layout();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  if (window.ResizeObserver) new ResizeObserver(layout).observe(viewport);
  layout();
}
