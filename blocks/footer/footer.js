import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Reply footer (canon: dark nav block + black legal strip) and the 4brands minisite footer
 * (body.brand-4b: logo, CTA list, "Privacy and Legal" list + copyright strip).
 * Decode: template-slotted. Authored sections, in order —
 *   Reply:   logo link | group (label + list) | group | CTA list + social list | legal paragraphs
 *   4brands: logo | CTAs | legal group | Reply logo link, copyright, cookie label
 * Authored anchors are MOVED into the template; only glyphs and the separator are synthesized.
 * Behaviour: footer accordions below 768 (canon.js / brand.js), cookie-settings button.
 */

const SMALL = window.matchMedia('(width < 768px)');

/* eslint-disable max-len */
const SVG = {
  arrow: '<svg fill="currentColor" width="16" viewBox="0 0 18 11" aria-hidden="true"><path d="M17.6 5.15 12.650.2l-1.410 1.410 2.530 2.540H.6v2h13.170l-2.530 2.540 1.410 1.410 4.950-4.950Z"/></svg>',
  cookie: '<svg fill="currentColor" viewBox="0 0 24 24" height="20" width="20" aria-hidden="true"><path d="M9.978 9.653a1.76 1.76 0 1 0 0-3.522 1.76 1.76 0 0 0 0 3.522ZM7.63 15.522a1.76 1.76 0 1 0 0-3.521 1.76 1.760 0 0 0 0 3.521ZM15.26 16.696a1.174 1.174 0 1 0 0-2.348 1.174 1.174 0 0 0 0 2.348ZM18.196 3.522a1.76 1.76 0 1 0 0-3.522 1.76 1.76 0 0 0 0 3.522ZM22.826 8.609a1.174 1.174 0 1 0 0-2.348 1.174 1.174 0 0 0 0 2.348Z"/><path d="M23.42 10.815c-2.102-.035-4.344-2.29-3.147-4.954-3.486 1.174-6.785-1.867-6.092-5.353C5.999-1.218 0 5.438 0 12c0 6.48 5.26 11.74 11.74 11.74 6.914 0 12.372-5.964 11.68-12.925ZM11.74 21.392c-5.178 0-9.392-4.215-9.392-9.392 0-3.885 3.205-9.602 9.485-9.414.493 2.981 2.864 5.353 5.858 5.799.082.422.61 2.993 3.428 4.261-.34 5.060-4.614 8.746-9.380 8.746Z"/></svg>',
};
/* eslint-enable max-len */

const SOCIAL_TITLES = {
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  xing: 'Xing',
  instagram: 'Instagram',
  youtube: 'YouTube',
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  children.flat().forEach((c) => c && node.append(c));
  return node;
}

function chromePath(kind) {
  const meta = getMetadata(kind);
  if (meta) return new URL(meta, window.location).pathname;
  const m = window.location.pathname.match(/^\/4brands-reply\/(en|de)(\/|$)/);
  return m ? `/4brands-reply/${m[1]}/${kind}` : `/${kind}`;
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanLink(a) {
  a.removeAttribute('title');
  a.className = '';
  return a;
}

function newTab(a) {
  a.target = '_blank';
  a.rel = 'noreferrer';
  return a;
}

function openCookieSettings(e) {
  e.preventDefault();
  const { OneTrust } = window;
  if (OneTrust && typeof OneTrust.ToggleInfoDisplay === 'function') OneTrust.ToggleInfoDisplay();
}

/* "Privacy Notice (Candidate)" -> qualifier in span.q (grey), as the source renders it */
function markQualifiers(a) {
  [...a.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const m = node.textContent.match(/\([^)]*\)\s*$/);
    if (!m) return;
    const tail = node.splitText(m.index);
    const q = el('span', { class: 'q' });
    tail.replaceWith(q);
    q.append(tail);
  });
}

function legalList(ul, cls, id, labelledBy) {
  const menu = el('menu', { class: `${cls} show`, id, 'aria-labelledby': labelledBy });
  [...(ul?.querySelectorAll(':scope > li') || [])].forEach((li) => {
    const a = li.querySelector('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    cleanLink(a);
    if (href !== '#cookiepref') newTab(a);
    if (href === '#cookiepref') {
      a.dataset.toggle = 'cookiepref';
      a.addEventListener('click', openCookieSettings);
    }
    markQualifiers(a);
    menu.append(el('li', { class: 'footer-text-light' }, a));
  });
  return menu;
}

function toggle(cls, id, controls, labelNode) {
  const label = el('span', { class: 'label-medium' });
  if (labelNode) while (labelNode.firstChild) label.append(labelNode.firstChild);
  return el(
    'button',
    {
      class: cls,
      id,
      'aria-expanded': 'true',
      'aria-haspopup': 'true',
      'aria-controls': controls,
    },
    label,
    el('span', { class: 'footer-plus', 'aria-hidden': 'true' }, el('div'), el('div')),
  );
}

function cta(a) {
  cleanLink(a);
  a.className = 'footer-cta';
  const span = el('span');
  while (a.firstChild) span.append(a.firstChild);
  a.append(el('i', { html: SVG.arrow }), span);
  return a;
}

function cookieButton(labelNode) {
  const label = el('span');
  if (labelNode) while (labelNode.firstChild) label.append(labelNode.firstChild);
  const btn = el('button', {
    id: 'cookie-pref-center',
    class: 'cookie-pref',
    'aria-label': 'Open cookie settings',
  }, label, ' ');
  btn.insertAdjacentHTML('beforeend', SVG.cookie);
  btn.addEventListener('click', openCookieSettings);
  return btn;
}

/* the Reply logos render as inline SVG on the source; inline the icon file (same vector) */
function inlineLogos(root) {
  root.querySelectorAll('.footer-nav-home .icon img, .brand-copyright-logo .icon img').forEach(async (img) => {
    try {
      const resp = await fetch(img.src);
      if (!resp.ok) return;
      const text = await resp.text();
      if (!text.trim().startsWith('<svg')) return;
      const span = img.closest('.icon');
      span.innerHTML = text;
      span.classList.add('icon-inline');
    } catch { /* keep the <img> */ }
  });
}

function wireAccordions(root, smallOnly) {
  root.querySelectorAll('button[aria-controls]:not(.cookie-pref)').forEach((btn) => {
    const list = root.querySelector(`#${btn.getAttribute('aria-controls')}`);
    if (!list) return;
    btn.addEventListener('click', () => {
      if (smallOnly && !SMALL.matches) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      list.classList.toggle('show', open);
    });
  });
}

function buildReply(sections) {
  const [logoSec, ...rest] = sections;
  const legalSec = rest.pop();
  const actionsSec = rest.pop();
  const groups = rest;

  const home = logoSec?.querySelector('a[href]') || el('a', { href: '/' });
  cleanLink(home);
  home.className = 'footer-nav-home';
  home.title = 'Reply';
  home.setAttribute('aria-label', 'Go to homepage');

  const grid = el('menu', { class: 'footer-nav-grid' });
  groups.forEach((sec, i) => {
    const labelNode = sec.querySelector('p');
    const key = slug(labelNode ? labelNode.textContent : `group-${i}`);
    const listId = `footer-dropdown-${key}`;
    const btnId = `footer-${key}`;
    grid.append(el(
      'li',
      { class: `footer-nav-group footer-nav-group-${String.fromCharCode(97 + i)}` },
      toggle('footer-nav-toggle', btnId, listId, labelNode),
      legalList(sec.querySelector('ul'), 'footer-nav-list', listId, btnId),
    ));
  });

  const [ctaList, socialList] = actionsSec ? [...actionsSec.querySelectorAll('ul')] : [];
  const actions = el('menu', { class: 'footer-nav-actions' });
  [...(ctaList?.querySelectorAll('a[href]') || [])].forEach((a) => actions.append(el('li', {}, cta(a))));
  const social = el('menu', { class: 'footer-social' });
  [...(socialList?.querySelectorAll('a[href]') || [])].forEach((a) => {
    const icon = a.querySelector('.icon');
    const name = icon ? [...icon.classList].find((c) => c.startsWith('icon-')).replace(/^icon-(social-)?/, '') : '';
    const img = a.querySelector('img');
    newTab(cleanLink(a));
    a.className = 'round-bt';
    a.title = SOCIAL_TITLES[name] || name;
    a.textContent = '';
    if (img) {
      img.alt = '';
      img.width = 24;
      img.height = 24;
      a.append(el('i', {}, img));
    }
    social.append(el('li', {}, a));
  });
  actions.append(el('li', { class: 'footer-nav-social-li' }, social));
  grid.append(el('li', { class: 'footer-nav-actions-col' }, actions));

  const footer = el(
    'div',
    { id: 'footer-content', class: 'site-footer' },
    el(
      'div',
      { class: 'site-footer-wrap' },
      el('nav', { class: 'footer-nav', 'aria-label': 'Footer navigation' }, home, grid),
    ),
  );

  const paras = legalSec ? [...legalSec.querySelectorAll('p')] : [];
  const copyP = paras.find((p) => !p.querySelector('a'));
  const linkP = paras.find((p) => p.querySelector('a'));
  const cookieP = paras.filter((p) => !p.querySelector('a'))[1];
  const text = el('div', { class: 'site-legal-text footer-text-light' });
  const copy = el('span');
  if (copyP) while (copyP.firstChild) copy.append(copyP.firstChild);
  text.append(copy, ' ', el('span', { class: 'site-legal-sep' }, '-'), ' ');
  const infoLink = linkP?.querySelector('a');
  if (infoLink) text.append(newTab(cleanLink(infoLink)));
  const legal = el(
    'div',
    { class: 'site-legal' },
    el(
      'div',
      { class: 'r-wrap' },
      el(
        'div',
        { class: 'site-legal-inner' },
        el('div', { class: 'site-legal-row' }, text, cookieButton(cookieP)),
      ),
    ),
  );
  return [footer, legal];
}

function buildBrand(sections) {
  const [logoSec, ctaSec, legalSec, copySec] = sections;
  let logoImg = logoSec?.querySelector('img');
  const token = logoSec?.textContent.trim().match(/^:([a-z0-9-]+):$/);
  if (!logoImg && token) {
    /* a lone `:icon:` paragraph is delivered as text; resolve it like decorateIcon does */
    logoImg = el('img', { src: `${window.hlx.codeBasePath}/icons/${token[1]}.svg`, loading: 'lazy' });
  }
  if (logoImg) {
    logoImg.className = 'brand-footer-logo';
    logoImg.alt = 'Logo';
    logoImg.removeAttribute('width');
    logoImg.height = 71;
  }

  const ctaList = el('menu', { class: 'brand-footer-cta-list' });
  [...(ctaSec?.querySelectorAll('a[href]') || [])].forEach((a) => ctaList.append(el('li', {}, cta(a))));
  const ctas = el(
    'li',
    { class: 'brand-footer-ctas' },
    el(
      'ul',
      { class: 'brand-footer-stack' },
      el('li', { class: 'brand-footer-cta-li' }, ctaList),
      el('li', { class: 'brand-footer-social-li' }, el('menu', { class: 'brand-footer-social' })),
    ),
  );

  const labelNode = legalSec?.querySelector('p');
  const listId = 'footer-dropdown_footer_privacy_and_legal';
  const btnId = 'footer_privacy_and_legal';
  const legal = el(
    'li',
    { class: 'brand-footer-legal' },
    toggle('brand-footer-toggle', btnId, listId, labelNode),
    legalList(legalSec?.querySelector('ul'), 'brand-footer-list', listId, btnId),
  );

  const footer = el(
    'div',
    { id: 'footer-content', class: 'site-footer site-footer-brand' },
    el(
      'div',
      { class: 'site-footer-wrap' },
      el(
        'nav',
        { class: 'brand-footer', 'aria-label': 'Footer navigation' },
        logoImg,
        el('menu', { class: 'brand-footer-grid' }, ctas, legal),
      ),
    ),
  );

  const replyLink = copySec?.querySelector('a[href]') || el('a', { href: '/' });
  cleanLink(replyLink);
  replyLink.className = 'brand-copyright-logo';
  replyLink.title = 'Reply';
  replyLink.setAttribute('aria-label', 'Go to Reply website');
  const paras = copySec ? [...copySec.querySelectorAll('p')].filter((p) => !p.querySelector('a')) : [];
  const copy = el('span', { class: 'brand-copyright-copy' });
  if (paras[0]) while (paras[0].firstChild) copy.append(paras[0].firstChild);
  const info = el(
    'div',
    { class: 'brand-copyright-info footer-text-light' },
    replyLink,
    el('span', { class: 'brand-copyright-sep' }),
    ' ',
    copy,
  );
  const strip = el(
    'div',
    { class: 'site-legal site-legal-brand' },
    el(
      'div',
      { class: 'brand-copyright' },
      el('div', { class: 'brand-copyright-row' }, info, cookieButton(paras[1])),
    ),
  );
  return [footer, strip];
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await loadFragment(chromePath('footer'));
  block.textContent = '';
  if (!fragment) return;
  const brand = document.body.classList.contains('brand-4b');
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [nav, legal] = brand ? buildBrand(sections) : buildReply(sections);
  block.append(nav);
  /* the source renders the legal / copyright strip as a second <footer> after the nav footer */
  const host = block.closest('footer');
  if (host) {
    if (host.nextElementSibling?.matches('footer.legal-footer')) host.nextElementSibling.remove();
    host.after(el('footer', { class: 'legal-footer', role: 'contentinfo' }, legal));
  } else {
    block.append(legal);
  }
  inlineLogos(block);
  inlineLogos(legal);
  /* canon: lists are forced open >= 768 by CSS; brand.js ignores clicks >= 768 */
  wireAccordions(block, brand);
}
