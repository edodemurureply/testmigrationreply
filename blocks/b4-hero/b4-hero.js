/**
 * b4-hero — 4brands Reply page hero: full-bleed image (parallax) with the H1 on it, lead + CTA
 * below (on the image from 1440). Template-slotted.
 *
 * Authoring rows (one cell each, classified by content, order-tolerant):
 *   - picture: the first is the desktop image (16:9), an optional second the mobile crop (2:3)
 *   - paragraph BEFORE the heading: eyebrow (category label above the H1)
 *   - h1 (or h2): headline
 *   - paragraph(s) after the heading without a link: lead
 *   - paragraph with a link: CTA (<strong> = filled button)
 *   - paragraph that is only bold text (no link): contact button — opens the contact dialog
 *     (source: modal trigger whose HubSpot form mounts in .b4-modal-content)
 *
 * @variants solution — no image veil (solution / offering pages); default keeps the dark veil;
 *   with solution: veil — the default 180deg gradient veil; veil-flat — flat 40 % veil;
 *   veil-low — 0deg 60 % → 0 at 50 % (with veil-lg: the 180deg gradient from 1024);
 *   veil-lg alone — no veil below 1024, the 180deg gradient from 1024; download — download glyph
 *   after the contact-button label;
 *   case-study — flat 40 % veil, category dot before the eyebrow, H1 text in a span;
 *   plain (cluster-brand-case-study, with case-study) — no image: ink text on white, leads
 *   after the first (source tag list) in an aside column
 */

// A one-paragraph cell is delivered as bare inline content: give it its <p> back by MOVING the
// cell's nodes into one (never copied), so every text has a block element to slot and style.
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

// EDS buttonizes `p > strong > a` before blocks decorate; a CTA rescued from a bare cell gets the
// same classes here (strong = primary, em = secondary).
function buttonize(p) {
  const a = p.querySelector('a[href]');
  if (!a || a.classList.contains('button') || a.querySelector('img')) return;
  const strong = a.closest('strong');
  const em = a.closest('em');
  if (!strong && !em) return;
  p.classList.add('button-wrapper');
  a.classList.add('button', strong ? 'primary' : 'secondary');
}

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

const emphasisOnly = (p) => p.children.length === 1
  && /^(STRONG|B)$/.test(p.firstElementChild.tagName)
  && p.textContent.trim() === p.firstElementChild.textContent.trim();

let modals = 0;

// contact button (theme modal trigger): the authored <p> moves into a role=button wrapper that
// opens a dialog; the dialog's content node is the HubSpot form mount (dynamics: forms).
function contactButton(p) {
  modals += 1;
  const id = `b4-contact-modal-${modals}`;
  const dialog = document.createElement('dialog');
  dialog.className = 'b4-modal';
  dialog.id = id;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'b4-modal-dismiss';
  close.setAttribute('aria-label', document.documentElement.lang === 'de' ? 'Schließen' : 'Close');
  close.addEventListener('click', () => dialog.close());
  dialog.append(close, div('b4-modal-content'));
  const btn = div('b4-hero-btn', p);
  btn.setAttribute('role', 'button');
  btn.tabIndex = 0;
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-controls', id);
  btn.setAttribute('aria-expanded', 'false');
  const open = () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    btn.setAttribute('aria-expanded', 'true');
  };
  dialog.addEventListener('close', () => btn.setAttribute('aria-expanded', 'false'));
  btn.addEventListener('click', open);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
  return [btn, dialog];
}

function bindParallax(media) {
  // gridcontainer-runtime .parallax-fullw: --ty = scroll progress x k
  // (k 15.39 % < 768, 12.46 % >= 768)
  const update = () => {
    const vh = window.innerHeight;
    const r = media.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const k = window.innerWidth < 768 ? 15.39 : 12.46;
    media.style.setProperty('--ty', `${(p * k).toFixed(4)}%`);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-hero-grid')) return;
  ensureParagraphs(block);
  const heading = block.querySelector('h1, h2');
  const pictures = [...block.querySelectorAll('picture')];
  const imgs = pictures.length ? pictures : [...block.querySelectorAll('img')];
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const all = [...block.querySelectorAll('*')];
  const isBefore = (a, b) => all.indexOf(a) < all.indexOf(b);
  const ctas = paras.filter((p) => p.querySelector('a'));
  const buttons = paras.filter((p) => !p.querySelector('a') && emphasisOnly(p)
    && (!heading || isBefore(heading, p)));
  const texts = paras.filter((p) => !p.querySelector('a') && !buttons.includes(p));
  const eyebrows = heading ? texts.filter((p) => isBefore(p, heading)) : [];
  const leads = texts.filter((p) => !eyebrows.includes(p));
  const asides = block.classList.contains('plain') ? leads.splice(1) : [];

  // media
  const bg = div('b4-hero-bg');
  if (imgs[0]) bg.append(wrapNode(imgs[0], imgs[1] ? 'b4-hero-pic b4-hero-pic-desktop' : 'b4-hero-pic'));
  if (imgs[1]) bg.append(wrapNode(imgs[1], 'b4-hero-pic b4-hero-pic-mobile'));
  const media = div('b4-hero-media', bg);
  const veiled = [...block.classList].some((c) => c.startsWith('veil'));
  if (!block.classList.contains('solution') || veiled) media.append(div('b4-hero-veil'));

  // head: eyebrow + h1
  const title = div('b4-hero-title r-cell');
  if (eyebrows.length) {
    title.append(div('b4-hero-kicker', ...eyebrows), div('b4-spacer b4-spacer-kicker'));
  }
  const emSpan = heading && heading.querySelector(':scope > em');
  if (emSpan) {
    // an authored emphasis marks the source span when it opens mid-word ("S<span>mart …",
    // solution: '"SAC Advanced Scripting<span>": </span>…' — a separate source text run)
    const span = document.createElement('span');
    span.append(...emSpan.childNodes);
    emSpan.replaceWith(span);
  } else if (heading && block.classList.contains('case-study')
    && !heading.querySelector(':scope > span')) {
    // case-study source sets the H1 text in a span: move the heading's nodes into one
    const span = document.createElement('span');
    span.append(...heading.childNodes);
    heading.append(span);
  }
  if (heading) title.append(wrapNode(heading, 'b4-hero-h'));
  const head = div('b4-hero-head', div('r-grid', title));

  // body: rule + lead + CTA
  const text = div('b4-hero-text r-cell');
  if (leads.length) text.append(div('b4-hero-lead', ...leads));
  if (ctas.length || buttons.length) {
    if (leads.length) text.append(div('b4-spacer b4-spacer-hero'));
    ctas.forEach(buttonize);
    text.append(div('b4-hero-cta', ...ctas, ...buttons.flatMap(contactButton)));
  }
  const rule = div('b4-hero-rule r-cell', document.createElement('span'));
  rule.firstElementChild.className = 'b4-rule';
  const bodyGrid = div('r-grid', rule, text);
  if (asides.length) bodyGrid.append(div('b4-hero-aside r-cell', ...asides));
  const body = div('b4-hero-body', bodyGrid);

  block.replaceChildren(div('b4-hero-grid', media, head, body));
  bindParallax(media);
}
