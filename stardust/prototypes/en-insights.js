/* === module: wall-filters (owner: en-insights) — candidate for modules.js ===
   Observed on the live listing (motion/en-insights.json): clicking a filter select opens its dropdown
   (.filter-dropdown gains .show — same class here: max-height/opacity/padding transition .3s, chevron flips via
   aria-expanded). Only one dropdown is open at a time; Confirm, Escape or a click outside closes it.
   The listing itself is the captured settled state (decision D-02: no client-side refetch). */
(() => {
  const filters = [...document.querySelectorAll('.ins-filter')];
  const close = (f) => {
    f.querySelector('.ins-filter__toggle').setAttribute('aria-expanded', 'false');
    f.querySelector('.ins-filter__dropdown').classList.remove('show');
  };
  filters.forEach((f) => {
    const btn = f.querySelector('.ins-filter__toggle');
    const dd = f.querySelector('.ins-filter__dropdown');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = btn.getAttribute('aria-expanded') !== 'true';
      filters.forEach((o) => { if (o !== f) close(o); });
      btn.setAttribute('aria-expanded', String(open));
      dd.classList.toggle('show', open);
    });
    dd.addEventListener('click', (e) => e.stopPropagation());
    f.querySelector('[data-dismiss]')?.addEventListener('click', () => close(f));
  });
  document.addEventListener('click', () => filters.forEach(close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') filters.forEach(close); });
})();
/* === /module: wall-filters === */
