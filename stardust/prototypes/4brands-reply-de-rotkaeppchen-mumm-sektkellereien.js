/* 4brands-reply-de-rotkaeppchen-mumm-sektkellereien — hero "Kontaktieren Sie uns" form modal (PROMOTE to brand.js).
   Observed on live (motion/<slug>.json): the CTA moves .modal.modal--form + .modal__backdrop into body>.popup-host
   and adds .show (opacity/transform/visibility .3s ease-out; backdrop opacity .5). Dismiss: the round
   external button, the backdrop, or Escape. The HubSpot form body (data-hubspot-form) is a third-party
   embed restored at delivery. */
(() => {
  const host = document.createElement('div'); // body > .popup-host
  host.className = 'b4-popup-host';
  document.body.append(host);
  document.querySelectorAll('[data-toggle="modal"][aria-controls]').forEach((btn) => {
    const modal = document.getElementById(btn.getAttribute('aria-controls'));
    if (!modal) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'b4-modal__backdrop';
    modal.removeAttribute('hidden');
    const set = (open) => {
      modal.classList.toggle('show', open);
      backdrop.classList.toggle('show', open);
      btn.setAttribute('aria-expanded', String(open));
      modal.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('overflow-hidden', open);
    };
    set(false);
    btn.addEventListener('click', () => {
      // like the live runtime: the modal stays in its .hubspot-container until first opened, then
      // moves into the body-level popup host (out of the hero's z-index:1 stacking context)
      if (modal.parentElement !== host) host.append(backdrop, modal);
      requestAnimationFrame(() => requestAnimationFrame(() => set(true)));
    });
    backdrop.addEventListener('click', () => set(false));
    modal.querySelector('.b4-modal__dismiss')?.addEventListener('click', () => set(false));
    modal.addEventListener('click', (e) => { if (e.target === modal) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show')) set(false); });
  });
})();
