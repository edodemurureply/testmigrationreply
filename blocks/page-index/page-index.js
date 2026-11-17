/**
 * page-index — dark in-page index bar with share popover (reply.com editorial, .ed-index).
 *
 * Decode: template-slotted bar; the authored list is MOVED in as-is (one link per index entry,
 * href = "#<heading-id>"); the optional authored paragraph is the mobile panel title ("Index").
 *
 * Authoring rows:
 *   1. bulleted list of links to the page's section headings
 *   2. (optional) panel title, shown on the mobile drawer
 *
 * Motion (as on the source page-index runtime):
 *   - >= 768: the bar pins under the header (nav.fixed-nav) once it scrolls out above the viewport;
 *   - scroll-spy: .active on the first entry whose heading is in view below header + bar;
 *   - a click scrolls smoothly to the heading; < 768 the list lives in a bottom drawer (toggle);
 *   - the share button opens the share popover; each share button opens its network / copies.
 * @variants hub — hub pages: below 768 the index takes no room in the flow (the source bar has
 *   height 0 there).
 */

const SVG = {
  links: [
    '<svg class="icon-links" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox',
    '="0 0 20 20" height="20" width="20"><path d="M2.5 10.83h1.67V9.17H2.5v1.66ZM2.5 14.17h',
    '1.67V12.5H2.5v1.67ZM2.5 7.5h1.67V5.83H2.5V7.5ZM5.83 10.83H17.5V9.17H5.83v1.66ZM5.83 14',
    '.17H17.5V12.5H5.83v1.67ZM5.83 5.83V7.5H17.5V5.83H5.83Z"></path></svg>',
  ].join(''),
  linksSelected: [
    '<svg class="icon-links-selected" width="14" height="14" viewBox="0 0 14 14" fill="curr',
    'entColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.00023 5.58611L11.9502 0.63610',
    '8L13.3642 2.05011L8.41423 7.00011L13.3642 11.9501L11.9502 13.3641L7.00023 8.41411L2.05',
    '023 13.3641L0.63623 11.9501L5.58623 7.00011L0.63623 2.05011L2.05023 0.636108L7.00023 5',
    '.58611Z"></path></svg>',
  ].join(''),
  share: [
    '<svg width="18" height="19" viewBox="0 0 19 22" fill="currentColor" xmlns="http://www.',
    'w3.org/2000/svg"><path d="M11.12 16.023L6.92096 13.733C6.37276 14.319 5.66095 14.7266 ',
    '4.87803 14.9028C4.09512 15.079 3.27731 15.0157 2.53088 14.721C1.78445 14.4263 1.14392 ',
    '13.9139 0.692529 13.2504C0.241137 12.5869 -0.000244141 11.803 -0.000244141 11.0005C-0.',
    '000244141 10.198 0.241137 9.41402 0.692529 8.75051C1.14392 8.08701 1.78445 7.57461 2.5',
    '3088 7.27992C3.27731 6.98523 4.09512 6.92187 4.87803 7.09807C5.66095 7.27428 6.37276 7',
    '.68189 6.92096 8.26796L11.121 5.97796C10.8825 5.03403 10.9965 4.03555 11.4416 3.16966C',
    '11.8867 2.30378 12.6323 1.62994 13.5386 1.27446C14.445 0.918981 15.4499 0.906264 16.36',
    '49 1.23869C17.28 1.57112 18.0424 2.22588 18.5093 3.08022C18.9761 3.93457 19.1153 4.929',
    '85 18.9009 5.8795C18.6864 6.82916 18.1329 7.66799 17.3442 8.23877C16.5555 8.80954 15.5',
    '857 9.07307 14.6166 8.97995C13.6474 8.88684 12.7456 8.44347 12.08 7.73296L7.87996 10.0',
    '23C8.04116 10.6643 8.04116 11.3356 7.87996 11.977L12.079 14.267C12.7446 13.5564 13.646',
    '4 13.1131 14.6156 13.02C15.5847 12.9268 16.5545 13.1904 17.3432 13.7611C18.1319 14.331',
    '9 18.6854 15.1708 18.8999 16.1204C19.1143 17.0701 18.9751 18.0654 18.5083 18.9197C18.0',
    '414 19.774 17.279 20.4288 16.3639 20.7612C15.4489 21.0937 14.444 21.0809 13.5376 20.72',
    '55C12.6313 20.37 11.8857 19.6961 11.4406 18.8303C10.9955 17.9644 10.8815 16.9659 11.12',
    ' 16.022V16.023ZM3.99996 13C4.53039 13 5.0391 12.7892 5.41418 12.4142C5.78925 12.0391 5',
    '.99996 11.5304 5.99996 11C5.99996 10.4695 5.78925 9.96082 5.41418 9.58574C5.0391 9.210',
    '67 4.53039 8.99996 3.99996 8.99996C3.46953 8.99996 2.96082 9.21067 2.58575 9.58574C2.2',
    '1068 9.96082 1.99996 10.4695 1.99996 11C1.99996 11.5304 2.21068 12.0391 2.58575 12.414',
    '2C2.96082 12.7892 3.46953 13 3.99996 13ZM15 6.99996C15.5304 6.99996 16.0391 6.78925 16',
    '.4142 6.41417C16.7892 6.0391 17 5.53039 17 4.99996C17 4.46953 16.7892 3.96082 16.4142 ',
    '3.58575C16.0391 3.21067 15.5304 2.99996 15 2.99996C14.4695 2.99996 13.9608 3.21067 13.',
    '5857 3.58575C13.2107 3.96082 13 4.46953 13 4.99996C13 5.53039 13.2107 6.0391 13.5857 6',
    '.41417C13.9608 6.78925 14.4695 6.99996 15 6.99996ZM15 19C15.5304 19 16.0391 18.7892 16',
    '.4142 18.4142C16.7892 18.0391 17 17.5304 17 17C17 16.4695 16.7892 15.9608 16.4142 15.5',
    '857C16.0391 15.2107 15.5304 15 15 15C14.4695 15 13.9608 15.2107 13.5857 15.5857C13.210',
    '7 15.9608 13 16.4695 13 17C13 17.5304 13.2107 18.0391 13.5857 18.4142C13.9608 18.7892 ',
    '14.4695 19 15 19Z"></path></svg>',
  ].join(''),
  facebook: [
    '<svg width="10" height="18" viewBox="0 0 10 18" fill="currentColor" xmlns="http://www.',
    'w3.org/2000/svg"><path d="M6.66683 10.25H8.75016L9.5835 6.91663H6.66683V5.24996C6.6668',
    '3 4.39163 6.66683 3.58329 8.3335 3.58329H9.5835V0.783293C9.31183 0.747459 8.286 0.6666',
    '26 7.20266 0.666626C4.94016 0.666626 3.3335 2.04746 3.3335 4.58329V6.91663H0.833496V10',
    '.25H3.3335V17.3333H6.66683V10.25Z"></path></svg>',
  ].join(''),
  twitter: [
    '<svg width="24" height="24" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www',
    '.w3.org/2000/svg"><path d="M4.1 3.9h4.6c.1 0 .1 0 .2.1l1.5 2.1c.6.9 1.2 1.8 1.8 2.6.2.',
    '4.5.7.7 1.1 0 .1.1.1.1 0 .9-1 1.8-2.1 2.6-3.1.8-.9 1.6-1.9 2.4-2.8h1.4c-.2.2-.3.4-.5.5',
    '-.7.8-1.4 1.6-2 2.4-1.1 1.2-2.1 2.5-3.2 3.7l-.1.1c-.1.1-.1.1 0 .2l3.3 4.8c.7 1.1 1.5 2',
    '.1 2.2 3.2.3.4.5.8.8 1.2h-4.7c-.1 0-.1 0-.2-.1-.5-.7-1-1.4-1.5-2.2l-2.6-3.8c.1.1.1 0 0',
    '-.1-.1.1-.2.2-.3.4-.9 1-1.8 2.1-2.7 3.1-.8.9-1.6 1.8-2.4 2.8 0 0 0 .1-.1.1H4c.1-.2.3-.',
    '3.4-.4.6-.8 1.1-1.4 1.7-2 .8-.9 1.6-1.9 2.4-2.8l1.7-2v-.1c-1-1.5-2-2.9-3-4.4-.8-1.2-1.',
    '5-2.3-2.3-3.4-.3-.4-.5-.8-.8-1.2zm1.9 1s0 .1 0 0c.9 1.2 1.7 2.4 2.5 3.6 1.4 1.9 2.7 3.',
    '9 4 5.8 1.1 1.6 2.2 3.2 3.3 4.7l.1.1H18V19l-2.8-4-2.7-3.9c-.9-1.1-1.7-2.3-2.5-3.5-.6-.',
    '9-1.2-1.7-1.8-2.6 0 0 0-.1-.1-.1H6z" fill="currentColor"></path></svg>',
  ].join(''),
  linkedIn: [
    '<svg width="17" height="16" viewBox="0 0 17 16" fill="currentColor" xmlns="http://www.',
    'w3.org/2000/svg"><path d="M3.78328 2.16665C3.78306 2.60867 3.60726 3.03251 3.29454 3.3',
    '4491C2.98182 3.65732 2.55781 3.8327 2.11578 3.83248C1.67376 3.83226 1.24992 3.65645 0.',
    '937517 3.34373C0.625113 3.03102 0.44973 2.60701 0.449951 2.16498C0.450172 1.72295 0.62',
    '5979 1.29912 0.938696 0.986712C1.25141 0.674307 1.67542 0.498925 2.11745 0.499146C2.55',
    '948 0.499367 2.98331 0.675173 3.29572 0.98789C3.60812 1.30061 3.78351 1.72462 3.78328 ',
    '2.16665ZM3.83328 5.06664H0.499951V15.5H3.83328V5.06664ZM9.09995 5.06664H5.78328V15.5H9',
    '.06662V10.025C9.06662 6.97498 13.0416 6.69164 13.0416 10.025V15.5H16.3333V8.89164C16.3',
    '333 3.74998 10.45 3.94164 9.06662 6.46664L9.09995 5.06664Z"></path></svg>',
  ].join(''),
  xing: [
    '<svg width="15" height="17" viewBox="0 0 15 17" fill="currentColor" xmlns="http://www.',
    'w3.org/2000/svg"><path d="M14.0518 0.691711C14.1793 0.691711 14.3076 0.756711 14.3718 ',
    '0.820878C14.4033 0.879999 14.4198 0.945965 14.4198 1.01296C14.4198 1.07996 14.4033 1.1',
    '4592 14.3718 1.20504L9.30758 10.18L12.5126 16.0767C12.5442 16.1359 12.5608 16.2021 12.',
    '5608 16.2692C12.5608 16.3364 12.5442 16.4025 12.5126 16.4617C12.425 16.5418 12.3113 16',
    '.5874 12.1926 16.59H9.88425C9.56425 16.59 9.37175 16.3334 9.24342 16.1409L5.97425 10.1',
    '792C6.16675 9.92338 11.1026 1.14171 11.1026 1.14171C11.2309 0.885878 11.4234 0.693378 ',
    '11.7443 0.693378H14.0518V0.691711ZM4.43592 3.83338C4.75675 3.83338 4.94842 4.09004 5.0',
    '7758 4.28171L6.67925 7.03838C6.55175 7.16671 4.17925 11.3967 4.17925 11.3967C4.05175 1',
    '1.59 3.85925 11.8467 3.53842 11.8467H1.29508C1.1761 11.8443 1.06206 11.7987 0.974248 1',
    '1.7184C0.942589 11.6592 0.926025 11.593 0.926025 11.5259C0.926025 11.4587 0.942589 11.',
    '3926 0.974248 11.3334L3.34592 7.03838L1.80758 4.34671C1.77592 4.28749 1.75936 4.22137 ',
    '1.75936 4.15421C1.75936 4.08706 1.77592 4.02094 1.80758 3.96171C1.89539 3.88139 2.0094',
    '3 3.83578 2.12841 3.83338H4.43675H4.43592Z"></path></svg>',
  ].join(''),
  copyLink: [
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.',
    'w3.org/2000/svg"><path d="M14.3033 11.9467L13.125 10.7667L14.3033 9.58832C14.693 9.202',
    '03 15.0025 8.74257 15.2142 8.23632C15.4258 7.73007 15.5354 7.187 15.5366 6.63829C15.53',
    '78 6.08959 15.4306 5.54604 15.2212 5.03887C15.0118 4.5317 14.7042 4.07089 14.3162 3.68',
    '289C13.9282 3.2949 13.4674 2.98736 12.9603 2.77793C12.4531 2.5685 11.9095 2.46131 11.3',
    '608 2.46251C10.8121 2.46372 10.2691 2.57328 9.76281 2.78493C9.25656 2.99658 8.7971 3.3',
    '0613 8.4108 3.69582L7.23247 4.87499L6.0533 3.69666L7.2333 2.51832C8.32732 1.42431 9.81',
    '113 0.809692 11.3583 0.809692C12.9055 0.809692 14.3893 1.42431 15.4833 2.51832C16.5773',
    ' 3.61234 17.1919 5.09615 17.1919 6.64332C17.1919 8.1905 16.5773 9.6743 15.4833 10.7683',
    'L14.3041 11.9467H14.3033ZM11.9466 14.3033L10.7675 15.4817C9.67345 16.5757 8.18964 17.1',
    '903 6.64247 17.1903C5.09529 17.1903 3.61149 16.5757 2.51747 15.4817C1.42345 14.3876 0.',
    '808838 12.9038 0.808838 11.3567C0.808838 9.80948 1.42345 8.32568 2.51747 7.23166L3.696',
    '64 6.05332L4.87497 7.23332L3.69664 8.41166C3.30694 8.79795 2.99739 9.25741 2.78574 9.7',
    '6366C2.5741 10.2699 2.46453 10.813 2.46333 11.3617C2.46212 11.9104 2.56931 12.4539 2.7',
    '7874 12.9611C2.98817 13.4683 3.29571 13.9291 3.6837 14.3171C4.0717 14.7051 4.53251 15.',
    '0126 5.03968 15.2221C5.54685 15.4315 6.0904 15.5387 6.63911 15.5375C7.18781 15.5363 7.',
    '73088 15.4267 8.23713 15.2151C8.74338 15.0034 9.20284 14.6938 9.58914 14.3042L10.7675 ',
    '13.1258L11.9466 14.3042V14.3033ZM11.3566 5.46416L12.5358 6.64332L6.6433 12.535L5.46414',
    ' 11.3567L11.3566 5.46499V5.46416Z"></path></svg>',
  ].join(''),
};

const SHARE = [
  ['facebook', 'Share on Facebook', 'https://www.facebook.com/sharer/sharer.php?u='],
  ['twitter', 'Share on Twitter', 'https://twitter.com/intent/tweet?url='],
  ['linkedIn', 'Share on LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url='],
  ['xing', 'Share on Xing', 'https://www.xing.com/spi/shares/new?url='],
  ['copyLink', 'Copy link to clipboard', ''],
];

function el(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'html') n.innerHTML = v;
    else n.setAttribute(k, v);
  });
  n.append(...children);
  return n;
}

const slug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function findTarget(ref) {
  if (!ref || !ref.startsWith('#') || ref.length < 2) return null;
  const id = decodeURIComponent(ref.slice(1));
  const byId = document.getElementById(id);
  if (byId) return byId;
  return [...document.querySelectorAll('main :is(h1, h2, h3, h4, h5, h6)')]
    .find((h) => slug(h.textContent) === id) || null;
}

function buildShare() {
  const trigger = el('button', {
    type: 'button',
    class: 'share-trigger round-bt',
    'aria-haspopup': 'true',
    'aria-label': 'Share with a friend',
    'aria-controls': 'page-share',
    'aria-expanded': 'false',
    html: SVG.share,
  });
  const panel = el('div', { class: 'share-panel', id: 'page-share' });
  SHARE.forEach(([key, title, base]) => {
    const b = el('button', {
      type: 'button',
      class: 'round-bt round-bt-sm',
      'data-share': key,
      tabindex: '-1',
      title,
      html: SVG[key],
    });
    b.addEventListener('click', () => {
      const url = window.location.href;
      if (!base) {
        if (navigator.clipboard) navigator.clipboard.writeText(url);
        return;
      }
      window.open(`${base}${encodeURIComponent(url)}`, '_blank', 'noopener');
    });
    panel.append(b);
  });
  const share = el('div', { class: 'share social-share' }, trigger, panel);
  trigger.addEventListener('click', () => {
    const open = share.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(open));
  });
  return share;
}

function bindIndex(root, nav, list) {
  const items = [...list.querySelectorAll('li')].map((li) => {
    const a = li.querySelector('a');
    const ref = a ? a.getAttribute('href') : '';
    return {
      ref, li, target: findTarget(ref), inView: false,
    };
  });
  let active = 0;
  const paint = () => items.forEach((it, i) => it.li.classList.toggle('active', i === active));
  paint();

  const headerH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
    10,
  ) || 0;
  const navH = nav.offsetHeight || 72;
  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const it = items.find((x) => x.target === e.target);
      if (it) it.inView = e.isIntersecting;
    });
    const i = items.findIndex((x) => x.inView);
    if (i >= 0) active = i;
    paint();
  }, { rootMargin: `-${headerH + navH}px 0px 0px 0px`, threshold: 0 });
  items.forEach((it) => {
    if (it.target) itemObserver.observe(it.target);
  });

  // keep (fix-small-3): the source pins a copy of the bar and leaves the original in the flow
  // (the band keeps its height and its bar) — the pinned copy is an inert clone
  const keep = !!root.closest('.page-index.keep');
  let pin = null;
  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const out = !e.isIntersecting && e.target.getBoundingClientRect().top < 0;
      if (keep) {
        if (out && !pin && window.matchMedia('(width >= 768px)').matches) {
          pin = nav.cloneNode(true);
          pin.classList.add('fixed-nav');
          pin.setAttribute('aria-hidden', 'true');
          pin.inert = true;
          nav.after(pin);
        } else if (!out && pin) {
          pin.remove();
          pin = null;
        }
        return;
      }
      // inset (fix-hub-e): the contained bar never pins; inset pin (fix-hub-h,
      // en/cx-and-digital-commerce): it pins and its wrapper collapses (live height 72 -> 0)
      const still = root.closest('.page-index.inset') && !root.closest('.page-index.pin');
      nav.classList.toggle('fixed-nav', out && !still);
    });
  }).observe(root);

  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const ref = a.getAttribute('href');
    const t = findTarget(ref);
    if (!t) return;
    active = items.findIndex((x) => x.ref === ref);
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth' });
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .r-wrap')) return;
  const list = block.querySelector('ul, ol');
  const label = [...block.querySelectorAll(':scope > div > div')]
    .find((c) => !c.querySelector('ul, ol') && c.textContent.trim());

  const toggle = el('input', { class: 'toggle', id: 'page-index-toggle', type: 'checkbox' });
  const title = el('span', { class: 'title' });
  if (label) title.append(label);
  const button = el('label', { class: 'button', for: 'page-index-toggle' });
  button.append(
    el('span', { class: 'icon-links', 'aria-label': 'Show page index', html: SVG.links }),
    el('span', {
      class: 'icon-links-selected',
      'aria-label': 'Hide page index',
      html: SVG.linksSelected,
    }),
    title,
  );

  const scroll = el('div', { class: 'scroll' });
  if (list) scroll.append(list);
  // optional rows after the panel title (fix-editorial): a text cell is the reading time (shown
  // in the separator slot with a clock glyph), a link cell the round download button
  const extras = [...block.querySelectorAll(':scope > div > div')]
    .filter((c) => c !== label && !c.querySelector('ul, ol') && c.textContent.trim());
  const sep = el('div', { class: 'sep' });
  const actionItems = [sep];
  extras.forEach((cell) => {
    const a = cell.querySelector('a');
    if (a) {
      a.className = 'download round-bt';
      a.setAttribute('aria-label', a.textContent.trim());
      const text = el('span', { class: 'download-label' }, ...a.childNodes);
      a.replaceChildren(text);
      actionItems.push(a);
    } else {
      sep.classList.add('has-read');
      sep.append(el('span', { class: 'read-icon', 'aria-hidden': 'true' }), el('span', { class: 'read' }, ...cell.childNodes));
    }
  });
  const actions = el('div', { class: 'actions' }, ...actionItems, buildShare());
  const nav = el('nav', { class: 'nav', 'aria-label': 'Page index' }, el(
    'div',
    { class: 'container' },
    scroll,
    actions,
  ));
  const panel = el('div', { class: 'panel' }, button, nav);
  const root = el('div', { class: 'index' }, toggle, panel);
  block.replaceChildren(el('div', { class: 'r-wrap' }, root));

  if (list) bindIndex(root, nav, list);
}
