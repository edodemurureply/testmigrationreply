/* en-covid-19-implications-2021 — page-index behaviour, as observed on the live page
   (motion/en-covid-19-implications-2021.json + the source page-index-runtime element):
   - nav.fixed-nav while the index block is out of view above the viewport
     (IntersectionObserver: !isIntersecting && top < 0) — the nav goes position:fixed (>=768 CSS) and the
     block collapses out of the flow, as on the source;
   - .active on the first list item whose heading is in view below header + nav
     (rootMargin -(--header-height + nav height) px top); a click scrolls smoothly to the heading;
   - share button toggles .open on the social-share popover. */
(() => {
  const root = document.querySelector('.page-index');
  if (!root) return;
  const nav = root.querySelector('.page-index__nav');
  const navH = nav.offsetHeight;
  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 0;
  const items = [...root.querySelectorAll('.page-index__item')].map((el) => {
    const ref = el.querySelector('a').getAttribute('href');
    return { ref, el, target: document.querySelector(ref), inView: false };
  });
  let active = 0;
  const paint = () => items.forEach((it, i) => it.el.classList.toggle('active', i === active));

  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const it = items.find((x) => x.target === e.target);
      if (it) it.inView = e.isIntersecting;
    });
    const i = items.findIndex((x) => x.inView);
    if (i >= 0) active = i;
    paint();
  }, { rootMargin: `-${headerH + navH}px 0px 0px 0px`, threshold: 0 });
  items.forEach((it) => it.target && itemObserver.observe(it.target));

  new IntersectionObserver((entries) => {
    entries.forEach((e) => nav.classList.toggle('fixed-nav', !e.isIntersecting && e.target.getBoundingClientRect().top < 0));
  }).observe(root);

  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const ref = a.getAttribute('href');
    const t = document.querySelector(ref);
    if (!t) return;
    active = items.findIndex((x) => x.ref === ref);
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth' });
  });

  const share = root.querySelector('.social-share');
  const trigger = share && share.querySelector('.social-share__trigger');
  if (trigger) {
    trigger.addEventListener('click', () => {
      const open = share.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
    });
  }
})();
