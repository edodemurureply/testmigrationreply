/**
 * b4-quote — case-study testimonial panel: quote mark (decorative), the quote and its citation
 * (name, role). The panel starts at the container edge and ends at col 11 from 1024.
 * Template-slotted.
 *
 * Authoring (one paragraph per cell, classified by content): the longest paragraph = the quote;
 * the remaining paragraphs in order = name, then role.
 *
 * @variants dark — #28333e panel, white text, no top margin
 *   (default: ice panel, top margin 56 / 120 @1440)
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

// decorative quote glyph (source svg, 60 x 46 viewBox) — generated UI, aria-hidden
const QUOTE_PATH = [
  'M54.7233 41.7367C58.1567 38.09 60 34 60 27.37C60 15.7033 51.81 5.24666 39.9 0.07',
  '66602L36.9233 4.66999C48.04 10.6833 50.2133 18.4867 51.08 23.4067C49.29 22.48 46',
  '.9467 22.1567 44.65 22.37C38.6367 22.9267 33.8967 27.8633 33.8967 34C33.8967 37.',
  '0942 35.1258 40.0616 37.3138 42.2496C39.5017 44.4375 42.4691 45.6667 45.5633 45.',
  '6667C49.14 45.6667 52.56 44.0333 54.7233 41.7367ZM21.39 41.7367C24.8233 38.09 26',
  '.6667 34 26.6667 27.37C26.6667 15.7033 18.4767 5.24666 6.56667 0.0766602L3.59 4.',
  '66999C14.7067 10.6833 16.88 18.4867 17.7467 23.4067C15.9567 22.48 13.6133 22.156',
  '7 11.3167 22.37C5.30334 22.9267 0.563339 27.8633 0.563339 34C0.563339 37.0942 1.',
  '7925 40.0616 3.98043 42.2496C6.16835 44.4375 9.13581 45.6667 12.23 45.6667C15.80',
  '67 45.6667 19.2267 44.0333 21.39 41.7367Z',
].join('');

function el(tag, className, ...children) {
  const d = document.createElement(tag);
  d.className = className;
  d.append(...children);
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .b4-quote-grid')) return;
  ensureParagraphs(block);
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const quote = nodes.reduce((a, n) => (
    !a || n.textContent.length > a.textContent.length ? n : a), null);
  const rest = nodes.filter((n) => n !== quote);
  const [name, ...roles] = rest;

  const icon = el('div', 'b4-quote-icon');
  icon.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '65');
  svg.setAttribute('height', '50');
  svg.setAttribute('viewBox', '0 0 60 46');
  svg.setAttribute('fill', 'currentColor');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', QUOTE_PATH);
  svg.append(path);
  icon.append(svg);
  const text = el('blockquote', 'b4-quote-text');
  if (quote) text.append(quote);
  const cite = el('figcaption', 'b4-quote-cite');
  if (name) cite.append(el('div', 'b4-quote-name', name));
  if (roles.length) cite.append(el('div', 'b4-quote-role', ...roles));
  const panel = el('figure', 'b4-quote-panel', icon, el('div', 'b4-quote-body', text, cite));
  block.replaceChildren(el('div', 'b4-quote-grid', el('div', 'b4-quote-cell', panel)));
}
