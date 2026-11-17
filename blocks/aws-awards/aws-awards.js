/**
 * aws-awards — en/aws partner-award tiles (live section .wblimoxxuh: four orange
 * grid-items, each a years line (10 px) over the award title (lead face 20 / 24 px), white,
 * centred). One column < 768, four >= 768; >= 1440 the row overlaps the hero by 60 px.
 *
 * Decode: reconstructive, one row per tile; the cell's nodes (years paragraph, title heading or
 * paragraph) move into the tile in order. An italic run in the years paragraph is the source's
 * orange spacer glyph (kept, coloured as the tile).
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .aws-awards-grid')) return;
  const grid = document.createElement('ul');
  grid.className = 'aws-awards-grid';
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    if (!nodes.length) return;
    const li = document.createElement('li');
    li.className = 'aws-awards-tile';
    const body = document.createElement('div');
    body.className = 'aws-awards-body';
    body.append(...nodes);
    li.append(body);
    grid.append(li);
  });
  block.replaceChildren(grid);
}
