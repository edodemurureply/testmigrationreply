/**
 * aise-intro — /en/ai-powered-software-engineering opening statement (live section
 * .qjgxpjlbof): a 10 px uppercase slate eyebrow heading, a 24 / 20 px spacer and the centred
 * display-face lead (28 px, 36 px >= 1440) on cols 1-4 / 1-8 / 3-10.
 *
 * Authoring: one cell — the eyebrow heading, then the lead paragraph(s). Template-slotted: the
 * authored nodes keep their order inside one centred column.
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const col = document.createElement('div');
  col.className = 'aise-intro-col';
  cells.forEach((cell) => col.append(...cell.childNodes));
  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) heading.classList.add('aise-intro-eyebrow');
  col.querySelectorAll(':scope > p').forEach((p) => p.classList.add('aise-intro-lead'));
  block.replaceChildren(col);
}
