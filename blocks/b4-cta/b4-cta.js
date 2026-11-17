/**
 * b4-cta — 4brands call-to-action band: centred statement text with one or more buttons
 * (whitepaper download / contact / booking). Template-slotted.
 *
 * Authoring (one cell, classified by content): headings and paragraphs = text; a paragraph that is
 * only a link = link button (<strong> = filled); a paragraph that is only bold text (no link) =
 * form button, opening the contact dialog whose content node is the HubSpot form mount
 * (dynamics: forms, as b4-hero). Pictures (banner logo) lead the text.
 *
 * @variants dark — #151f27 band, white text; ice — #f4f8fc band;
 *   banner — dark rounded panel (ROSE banner: logo, title, abstract, button, link cards);
 *   download — download glyph after the form-button label
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

function div(className, ...children) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...children);
  return d;
}

const emphasisOnly = (p) => p.tagName === 'P' && p.children.length === 1
  && /^(STRONG|B)$/.test(p.firstElementChild.tagName)
  && p.textContent.trim() === p.firstElementChild.textContent.trim();
const linkOnly = (p) => p.tagName === 'P' && p.querySelector('a')
  && p.textContent.trim() === p.querySelector('a').textContent.trim();

let modals = 0;

function formButton(p) {
  modals += 1;
  const id = `b4-cta-modal-${modals}`;
  const dialog = document.createElement('dialog');
  dialog.className = 'b4-modal';
  dialog.id = id;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'b4-modal-dismiss';
  close.setAttribute('aria-label', document.documentElement.lang === 'de' ? 'Schließen' : 'Close');
  close.addEventListener('click', () => dialog.close());
  dialog.append(close, div('b4-modal-content'));
  const btn = div('b4-cta-btn', p);
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

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-cta-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const text = div('b4-cta-text');
  const actions = div('b4-cta-actions');
  const logo = div('b4-cta-logo');
  nodes.forEach((n) => {
    if (n.tagName === 'PICTURE' || (n.tagName === 'P' && n.querySelector('picture, img')
      && !n.textContent.trim())) {
      logo.append(n);
    } else if (linkOnly(n)) {
      const a = n.querySelector('a');
      a.classList.add('button');
      actions.append(div('b4-cta-link', n));
    } else if (emphasisOnly(n)) {
      actions.append(...formButton(n));
    } else {
      text.append(n);
    }
  });
  const cell = div('b4-cta-cell r-cell');
  if (logo.children.length) cell.append(logo);
  cell.append(text);
  if (actions.children.length) cell.append(actions);
  block.replaceChildren(div('b4-cta-grid r-grid', cell));
}
