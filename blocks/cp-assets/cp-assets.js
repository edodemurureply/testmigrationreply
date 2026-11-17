/**
 * cp-assets — /en/company-profile "Strategy / Creativity / Technology" band (live section
 * .xxindfkzbw, theme .interactive-title): three centred outline titles (black-face caps, 1px ink
 * stroke, clear fill) each with a subtitle that fades and rises in on hover (opacity 0 until
 * then, its line box kept), spaced 56 / 64 / 72 px on the #f4f8fc band.
 *
 * Authoring: one row per title — first paragraph (or heading) = the title, the next paragraph =
 * the subtitle. A single cell holding several paragraphs is read as title / subtitle pairs.
 */
function el(tag, className, ...children) {
  const d = document.createElement(tag);
  if (className) d.className = className;
  d.append(...children);
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .cp-assets-col')) return;
  const nodes = [...block.querySelectorAll(':scope > div > div > *')]
    .filter((n) => n.textContent.trim());
  const col = el('div', 'cp-assets-col');
  for (let i = 0; i < nodes.length; i += 2) {
    const title = nodes[i];
    title.classList.add('cp-assets-title');
    const item = el('div', 'cp-assets-item', title);
    if (nodes[i + 1]) {
      nodes[i + 1].classList.add('cp-assets-subtitle');
      item.append(nodes[i + 1]);
    }
    col.append(item);
  }
  block.replaceChildren(col);
}
