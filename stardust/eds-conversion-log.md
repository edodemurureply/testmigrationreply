# EDS conversion log — reply.com replica

## Publish decision (2026-11-15)

Decided by the run (hands-off, pre-made): **publish**. Every delivered page, the redirects sheet and the chrome
documents (nav, footer and their locale variants — Reply EN/locale shells and 4brands Reply EN/DE) go live on
main--a355dc1b--aemcoder.aem.live (`deploy-batch.mjs` without `--no-publish`, or POST admin.hlx.page/live/…).

## Decode tiers

Replica default: template-slotted for fixed compositions (heroes, bands, statements, chrome); reconstructive for
repeat groups (cards, carousels, walls, accordions, tabs). Per-block entries are appended by each unit below.

## C0 foundation (2026-11-15)

- **header** — template-slotted chrome bar (logo, language strip, search panel, burger, collapse button) +
  reconstructive mega-menu panels: `/nav` section 2 is a list (top item label -> columns; a column is a
  `<li>` whose lead link is followed by a nested list; `<strong>` = second-level link), highlight slides
  come from the trailing sections headed by an `<h2>` that repeats the top item label (picture, title link,
  CTA paragraph). Column placement (--lg/--xl grid vars) is chosen from the panel shape (canon presets).
  4brands (`body.brand-4b`) renders the same list as mini-menu dropdowns. Language links are authored as
  locale roots (`/de`, `/4brands-reply/de`) and rewritten to the current page's sibling path.
- **footer** — template-slotted. Reply: logo | group | group | CTA + social lists | legal paragraphs;
  4brands: logo | CTA list | legal group | Reply logo + copyright + cookie label. The legal/copyright
  strip is emitted as a second `<footer>` (source DOM). Qualifiers "(…)" render as `span.q`.
- Chrome routing: `/4brands-reply/(en|de)/…` loads `/4brands-reply/<loc>/nav|footer`; `nav`/`footer`
  metadata overrides; `theme: brand-4b` (or the path) sets `body.brand-4b`.
- Class names: canon BEM `__`/`--` became `-` (stylelint kebab-case); cluster CSS lifted from the
  prototypes must apply the same rename (e.g. `.h7--medium` -> `.h7-medium`).

## archetype-plain (2026-11-15)

- **intro** (/en/accessibility; reused by listing /en/insights) — template-slotted: the block renders the
  canon `.statement-intro` grid (`intro-grid r-grid`: `intro-title` | `intro-rule` > `intro-dash` |
  `intro-lead` | `intro-spacer`). Authoring is one cell: leading heading(s) move to the title slot, every
  node after the first non-heading moves to the lead slot (bare-text cells too); both slots wrap the
  moved nodes in `div.rich`. Lead renders in the statement lead face (canon `.t-lead`); variant
  `plain-lead` keeps it as rich body copy (listing intro). Davids D1 🟡 (one-cell prose block) justified:
  the 48px rule and the 12-col offsets are a fixed composition default content cannot express.
- **statement body** — default content in the intro's own section (same section, after the block),
  styled in intro.css under `.intro-container .default-content-wrapper`: canon `.rich` spacing, h6 face,
  columns 3/11 at >=1024 (side margins of 2 cols + 2 gaps), bottom margin 56/120px. The source opens each
  post-heading paragraph with a `<br>` the pipeline drops; restored as `padding-top: 27px` on `h + p`.
- No captureState / motion of its own (motion is chrome only). Listing reuse note: `.ins-intro` adds
  `margin-bottom` 8/24/8px — add as an additive variant there.

## archetype-editorial (2026-11-15)

Page `/en/covid-19-implications-2021` (archetype `en-covid-19-implications-2021`), 5 blocks converted, 0 reused;
22 editorial images under `media/en-covid-19-implications-2021/` (hero desktop + mobile crop, 3 band backgrounds,
framework figure, 12 charts, 4 icons). Cells are classified by content and MOVED whole, because a single-paragraph
cell is delivered as bare text.
- **editorial-hero** — template-slotted (media band with parallax `--ty` | category label | h1 | lead | tags).
  Optional second image = the 2:3 mobile crop (source `<picture>` art direction). The heading's child nodes are
  moved into one `span.ink`, mirroring the source colour span (span.c-white); block-roundtrip otherwise reports a
  ROLE SWAP, because the prototype classifier reads the span text as body.
- **page-index** — template-slotted bar; the authored `<ul>` of `#<heading-id>` links is moved in (the pipeline's
  heading ids, with a text-slug fallback). The optional second row is the mobile drawer title. Motion delivered:
  fixed-nav pin, scroll-spy `.active`, smooth scroll, share popover (+ working share and copy-link buttons).
  Share and toggle glyphs are generated UI (no authored text).
- **text-band** — template-slotted (title | body groups with a 42px spacer between them | optional figure;
  image-only rows before the title = background). Variants ice / pendulum / framework / highlight, the colours
  orange / green / blue / magenta / white, and `large` (the first highlight title uses the larger size).
- **tension** — the intro is template-slotted (kicker h2 | lead | text | source, where the source is the paragraph
  holding the link). The charts are reconstructive, one row each (title | image | note). Colour variant per tension.
- **prepare** — the title is template-slotted (h3, ink span); the figures are reconstructive (icon | title | text),
  shown as a 4-up figure row. Background = the image-only row before the title.
- Gate (published preview origin): 1440 2.93 % Δh 0, 360 8.88 % Δh 2, clipped 0, MISSING/HIDDEN 0. Crop header
  1.55 %, footer 1.02 %. The row reads FAIL (fonts) only because of the queued fallback @font-face request
  (archetype-plain). Lint is clean.

## archetype-brand-solution (2026-11-15)

Page `/4brands-reply/de/customer-experience-management` (template brand-solution, body.brand-4b). First converter
of nine blocks; every block takes cells by content (a one-paragraph cell is delivered as bare text, so each
block gives it its `<p>` back by moving the nodes) and styles authored elements through wrapper classes (EW2).
Bands paint themselves through block variants (`dark` #151f27, `ice` #f4f8fc) instead of section styles.
- **b4-hero** — template-slotted (media with parallax `--ty` | eyebrow | h1 | lead | CTA). Pictures: first =
  desktop 16:9, optional second = 2:3 mobile crop. Variant `solution` drops the image veil and the brand-home
  H1 tracking. A bold-only paragraph (no link) is the source's contact modal trigger: it moves into a
  `role=button` wrapper that opens a `<dialog class="b4-modal">`, whose content node is the HubSpot form mount
  (dynamics row 18, needs-backend). A linked `<strong>` paragraph stays an EDS button.
- **statement** — template-slotted, one centred cell; `<em>`/`<strong>` = brand-coloured run; p/h2 = t-title,
  h3 = t-subtitle (en-iot / index reuse).
- **b4-intro**, **b4-roadmap** — template-slotted (heading | rich text column); roadmap variant `ice`.
- **section-heading** — template-slotted; default = modules.css spacing (en-iot / index / insights reuse);
  variants `center`, `dark`, `b4` (4brands spacing + spacer), `near` (b4 with 80 px top margin at 1440).
- **b4-tabber** — reconstructive, one row per tab (icon | label | panel). Panel content classified: first
  paragraph = title, paragraph before the list = label, list = benefits, rest = text. Motion delivered: tab
  switch with accent bar entering from the side, prev/next slide, `.all-displayed` re-measured once laid out.
- **b4-accordion** — reconstructive, one row per item (icon name | h3 | body); header is a `role=button` div
  (EW7). The icon-name cell is `@ew-exempt` metadata with a declared vocabulary (cart | cloud | image).
- **card-carousel** — reconstructive, one row per card (picture | h3 with the link + category paragraph);
  EW6 card-as-link, category dot colour from the category name. Loop clones stripped of editor indices.
  Variants `simple`, `scale` (CSS + loop math ported from modules.js), `autoplay` (5 s, pauses on hover /
  hidden tab / reduced motion) — captureState `restoreAtDelivery` implemented (starts at slide 0 like live).
- **b4-teaser** — template-slotted (link | logo | abstract) on the ice card.
- davids-model-lint D1 (statement, b4-intro, section-heading, b4-roadmap, b4-teaser): kept as blocks — each
  owns a fixed grid placement, band colour and spacing the default-content wrapper cannot express.
- Gate (published preview origin): 1440 4.9 % Δh 9, 360 6.32 % Δh 11, clipped 0; content MISSING 1 / HIDDEN 2
  at both widths, all inside the autoplaying related carousel (live and build sit one slide apart at probe
  time; the two partly visible peek cards read as clipped links — the origin has the same two). The carousel
  is declared session-variable in `gates/all-<w>/presence.json`. Crop header 0.89 %, footer 0.91 %. Fonts row
  flag = the queued fallback @font-face request (archetype-plain).

## cluster-plain (2026-11-15)

13 plain siblings of /en/accessibility (render units plain-1, plain-2), variance probe
`stardust/.work/rollout/cluster-plain/variance.json` (13/13 varying: intro height/face, body height, bands).
- **intro** (reused, additive) — eyebrow slot: paragraphs before the first heading move above the title
  (`.intro-eyebrow`, canon .text-pfihz; /en/approach-to-uk-taxation). Variants: `ice` (contacts band),
  `simple` (legacy content-body intro: 1140 container, text-face h1, lead as body copy with the dropped
  leading `<br>` restored as 27px; impressum, datenschutzerklaerung, placeholders), `dark` (event placeholder).
- **table** (new) — reconstructive: row 1 = header row, each row one `<tr>`, cell nodes moved into th/td
  (canon .reply-table, CCPA). Placed on the statement-body 3/11 columns; the mobile column picker is not
  rebuilt (all columns render; logged deviation).
- **quicklinks** (new) — reconstructive: optional heading row, then one card per row (icon image | label);
  a linked label makes the card a link (EW6 unwrap); unlinked labels (HubSpot triggers) render static.
- **accordion** (new) — reconstructive: optional heading row, then title | body per row; empty toggle
  `<button>` beside the moved title (EW7), header click toggles, items independent, start closed.
- **episode** (new) — template-slotted Meta Minutes page: rows classified by content (h1 row, icon+speakers,
  image-link badges, player link, text, CTA row). Player = iframe built from the authored link (link kept
  visually hidden, `@ew-exempt player-url`). Badges rasterised to PNG (source SVGs embed PNG, 56–478 KB,
  over the DA 40 KB SVG cap). Second source h1 on S3E1 authored as h2 (one-h1 contract).
- Thin (branch B, contentGap): /en/autonomousdrivingsafety, /en/lufhtansa, /en/event-detail (CMS placeholder
  pages; verbatim lorem only, empty media/tab/info widgets not rebuilt).
- Davids D1 🟡 on intro (justified as for the archetype); D3 🟡 on quicklinks/accordion/episode (heading row
  is a 1-cell span row by design).

## cluster-brand-solution (2026-11-15)

27 brand-solution siblings (`/4brands-reply/de/…`), encoded from the hydrated capture by
`stardust/.work/rollout/cluster-brand-solution/gen.py` with the archetype's content model; section bands
(dark #151f27 / ice #f4f8fc), two-column vs stacked text and centring read from a live layout probe
(`layout.json`, 1440). Media rehosted per slug (`media/<slug>/img-NN`, mobile hero crop `img-NNm`).
- Reused, unchanged decode tiers: b4-hero (solution), b4-tabber, b4-accordion (icon names mapped from the
  archetype's glyph classes; unknown glyphs omitted), card-carousel (related cards with links only),
  section-heading, b4-intro, b4-roadmap, b4-teaser.
- Additive variants: statement `lead` (section title + body copy), `left`, `dark`, `ice`; b4-intro `dark` /
  `ice`; b4-roadmap `dark`; b4-accordion `dark`; section-heading `ice`. Existing classes untouched.
- **b4-slider** (new) — reconstructive, one row per carousel item (media | body | link button), for the
  free-form cardcarousel-runtime items (icon steps, info cards, stat tiles, image cards without links).
  Variants grid (all-displayed), center, info, icon, cards, dark, ice, scale; prev/next with
  `.all-displayed` when every item fits.
- **b4-cta** (new) — template-slotted text + buttons; bold-only paragraph = form button opening the
  HubSpot dialog (as b4-hero), link-only paragraph = link button; `banner` = ROSE banner panel.
- **b4-media** (new) — template-slotted pictures / DAM video (player link → 16:9 iframe, link kept as
  a visually hidden caption).
- Deviations: smart-retail-execution has no source h1 (hero title paragraph promoted); a body-module h1
  on data-and-analytics-strategie-workshop and revenue-growth-management-reve demoted to h2 (one h1).
  Inline/modal HubSpot forms are not rebuilt (dynamics row 18, needs-backend).
- davids-model-lint D1 🟡 on statement / b4-cta / b4-slider / b4-teaser: kept as blocks (band colour,
  grid placement and spacing the default-content wrapper cannot express).

## archetype-brand-home (2026-11-15)

Page `/4brands-reply/en` (template brand-home, body.brand-4b). Converted 11 blocks, reused 4.
- Template-slotted: **b4-highlight** (fixed sticky teaser: pictures desktop/mobile | title | abstract + CTA),
  **b4-about**, **b4-band** (dark band title), **b4-partner**, **b4-newsroom**.
- Reconstructive: **b4-stats** (one row per counter), **b4-split** (one row per tile), **cards-wall** (one row
  per white-paper card, masonry), **b4-news** (one row per news card, slider), **b4-events** (one row per
  event; date cell = optional photo + day + month), **b4-offices** (map link row, filter label, one row per
  office, button label; the map is a live Google Maps embed — captureState restoreAtDelivery).
- Reused, additive: card-carousel `horizontal` / `ice` / `split` (+ whole-card link named title + category, as
  the source anchor), statement `b4`, section-heading `text`, b4-hero (brand-home).
- Fix round 1: b4-events keeps date paragraphs that wrapped the event photo (EW); cards-wall / b4-news
  presentational cover anchors carry the card title as `title`. clip-allow: REVE card title line-clamp is
  source-faithful (identical clip on the origin).
- davids-model-lint D1/D3/D10 🟡 on b4-band / section-heading / b4-newsroom / cards-wall / b4-offices: kept as
  blocks (band colour + grid placement; offices rows are a data table of office fields).

## cluster-brand-solution (2026-11-15) — gate fix rounds

Published-origin gate (27 siblings, 1440 / 360) failed on systematic deltas; fixed as additive variants
(existing classes untouched) and an encoder pass (`gen.py`, same content model):
- b4-hero `solution` @1440 — rows pinned (`minmax(394px, auto) 1fr`, head 175 px from the top): the
  auto/auto rows split the free space, so one-line titles dropped and the lead rose; archetype rects
  unchanged (kicker 267, body 486).
- b4-slider `tile` (new variant, reconstructive) — card-info-slider-1-1-icon-dark: 1:1 #28333e tiles,
  icon-font glyph (row's `icon-…` paragraph, EW-exempt metadata) + title; the abstract (previously
  dropped by the encoder) restored verbatim and revealed on hover / focus. `info` @1440 — three 411 px
  items per view, text full item width. `.b4-slider-inner` min-width 0 (the rail widened the band < 1440).
- b4-accordion `split` (new variant) — first row h2 + text becomes an intro column (cols 2-4) beside the
  list (cols 6-11) from 1024; stacked below.
- statement `cols` (new variant, CSS only) — title (cols 2-7) over body copy in two 523 px columns.
- b4-cta — cell kept one column (`.r-cell` wrap pushed the actions into a 2nd column); dark-band buttons
  white; @1440 band padding 120, lead line 42 px display.
- b4-tabber `ice`, section-heading `ice` encoded where the source band is #f4f8fc.
- Gate after 2 fix rounds (27 pages, preview origin): 1440 pixel 9.7–35.1 % (worst artificial-intelligence-
  consumer-goods), 360 9.96–30.1 % (worst sap-datasphere-trainings); only data-value-management under the
  pixel bar (fails on content MISSING/HIDDEN). Open: SAC info cards with source background images (not in
  the capture), eyebrow-as-h2 on composable-customer-data-platform, carousel offsets, 360 headings centred
  vs left. Rows recorded `failed` in coverage; font-not-loaded is the known foundation request.

## archetype-brand-case-study (2026-11-15)

Page `/4brands-reply/de/rotkaeppchen-mumm-sektkellereien` (template brand-case-study). Converted 4 blocks, reused 4.
- Template-slotted: **b4-client** (title | rule + text | client logo), **b4-text** (title + rich text; `dark`
  ink band centred), **b4-quote** (quote mark | quote | name, role; `dark` panel), **b4-profile** (brand
  boilerplate card: title link | logo | abstract).
- Reused, additive: b4-hero `case-study`, b4-intro `split` (two text columns, first row = col 1), statement
  `case-study`. b4-intro `split` and b4-text `dark` move the heading's child nodes into one span (source colour
  span; block-roundtrip otherwise reports a ROLE SWAP — same classifier quirk as editorial-hero).
- block-roundtrip needs `--map` for this page (prototype sections are `.b4cs-*`): b4-intro=.b4cs-intro,
  b4-client=.b4cs-client, b4-text=.b4cs-challenge,.b4cs-solution, statement=.b4cs-statement. b4-hero IMG COUNT 🟡
  = desktop + mobile art-direction pictures.
- davids-model-lint D1 🟡 on b4-client / b4-text / b4-quote / statement / b4-profile: kept as blocks (band colour,
  grid placement and the quote-mark/rule decorations are component chrome, not prose).
- Gate (preview host): 1440 1.73 % Δh -1 / 360 3.87 % Δh +2, clip 0, missing 0; row fails only on the queued
  foundation font-not-loaded (khanqyjjei-/tuqgwxsjgq-fallback). Crop hdr 0.79 % / ftr 1.16 %.

## archetype-brand-home (2026-11-15) — gate round 2

Decode tiers unchanged (see the archetype-brand-home section above). Published-origin gate, preview host:
1440 pixel 5.44 % Δh +13, 360 pixel 6.5 % Δh +8, clipped 1 (allowed: source-faithful REVE line clamp),
content MISSING 0 / HIDDEN 0. Round 2 = gate sidecar only (`presence.json` variable regions): the
infinite `scale` slider's peek card (label clipped at x<0 on the source) and the live Google Maps controls
(Maps JS widget on the source, iframe embed on delivery) are counted, not matched. Row still flags
font-not-loaded khanqyjjei/tuqgwxsjgq-fallback — known foundation request, fixed at C-final.

## archetype-hub (2026-11-15)

Page `/en/iot` (template hub, archetype en-iot), 47 images under `media/en-iot/` (desktop + <= 576/767 crops,
partner logos, ROSE logo SVG pure-vector 2.6 KB). Converted 4 blocks, reused 4 (2 with additive variants).
- **media-hero** — template-slotted (pictures desktop 16:9 + optional <= 767 crop | h1, child nodes moved into
  one span as the source title span). Motion delivered: scroll parallax (--ty, k 13.23 / 15.39 %).
- **labs** — reconstructive, one row per info card (picture | category | h3 with link | abstract); EW6 one new
  anchor wraps title + abstract. Motion: hover/tap reveal (checkbox toggle on coarse pointers), `.all-displayed`
  centring when every card fits, prev/next (>= 1024) + swipe otherwise.
- **rose-cta** — intro template-slotted (logo | title | abstract | CTA, the row with the highest-level heading);
  cards reconstructive (picture | label | h4 with link | meta | optional CTA). Motion: ROSE slider transform 1s
  + `.out` opacity on cards scrolled out of view. Contact-card bell glyph is decorative CSS (rose-bell.svg).
- **discover-also** — template-slotted (kicker | authored list moved whole into the keyword rail); prev/next
  stop once the last link is in view.
- Plan blocks `featured` / `awards` delivered as reused **card-carousel** `horizontal` + new additive variants
  `featured` (band margin 64/84/100/120) and `awards` (no margin); `awards` was planned for en-insights and is
  not a separate block. Reused unchanged: **section-heading**.
- Reused, additive: **statement** `hub` (margins 48/50/24); **cards-wall** optional card-type cell
  (`hero | thumb-1-1 | thumb-2-3 | abstract | hover` [+ `logo`], `@ew-exempt metadata` with a declared
  `@variants` vocabulary; untyped cards render as before), the featured card does not count towards the first
  batch of 12, and typed walls add 3 px before the span rounding (fitted to the captured live spans).
- davids-model-lint D1/D3 🟡 on media-hero / statement / section-heading / discover-also / cards-wall /
  rose-cta: kept as blocks (fixed grid placement, band paint, sliders; type cell and pager row differ in
  cell count by design).
- Gate (published preview origin, fix rounds 1): 1440 5.35 % Δh -17, 360 9.44 % Δh -24, clipped 0 (1440 one
  clip-allow: source-faithful 3-line clamp of the AI-Powered Digital Twins title), MISSING/HIDDEN 0. Crop header
  1.64 %, footer 1.68 %. Row reads FAIL (fonts) only for the queued fallback @font-face request.

## archetype-listing (2026-11-15)

Page `/en/insights` (template listing, archetype en-insights), 90 images under `media/en-insights/` (desktop +
<= 768/767/576 crops). Converted 4 blocks, reused 5 (all with additive variants).
- **hero-card** — template-slotted featured banner (pictures desktop 16:9 + optional <= 767 crop | category |
  h3 with the link | abstract; `logo` variant = last picture is the partner logo). Cover anchor is a
  presentational duplicate (aria-hidden, tabindex -1). Motion: card parallax (--ty 0 until the card top passes
  mid-viewport, then 7.5 % per half viewport; translateY(--ty * -0.85) >= 768). Variant `band` = white top half
  over the ink band. Planned for index `feature` too.
- **collections** — template-slotted collection head (eyebrow paragraphs before the heading | heading, child
  nodes moved into one span as the source title span); the section is painted ink (`.collections-container`,
  bottom 88 / 120). Rails = reused **card-carousel** `simple` + new additive `flush` (no 1440 band margin).
- **explore** — title template-slotted; filters reconstructive, one row per filter (label | dropdown heading +
  options list, first item "All"), a final one-paragraph row = search label (shown over the input as the
  placeholder, so it stays authored). Motion: filter dropdown open / close (one at a time, Confirm / Escape /
  outside click), < 1024 "Open filters" toggle panel. `@ew-exempt generated-ui` for Open/Close/Clear/Confirm.
- **awards** — template-slotted acknowledgments head (eyebrow | h3) painting the ice section
  (`.awards-container`); the info rail is reused **labs** + additive `ice` (no grid inset: the track padding is
  the only inset, as card-carousel--info in the band). Plan id `awards` delivered as this head + labs.
- Reused, additive: **intro** `listing` (margin-bottom 8 / 24 / 8), **section-heading** `latest` (no top margin,
  cols 1-4 / 1-5 / 2-7), **card-carousel** `latest` (horizontal band margin 96 / 104 / 96 / 120), **cards-wall**
  card type `hover-1-1`, `all` (every authored card renders; listing is the captured batch, D-02) and `listing`
  (wall margin 96 / 104 / 96 / 120; cover anchor named by the title only, as the source).
- davids-model-lint D1/D3 🟡 on intro / section-heading / hero-card / collections / awards / explore / cards-wall:
  kept as blocks (fixed grid placement, band paint, filter widget; type cell and pager row differ in cell count).
- Gate (published preview origin, fix round 1): 1440 6.94 % Δh +5, 360 2.59 % Δh 0, clipped 5 / 3 within the
  clip-allow (source-faithful 3-line clamp of four wall titles, link inside the clamped h3), MISSING/HIDDEN 0.
  Crop header 1.71 %, footer 1.08 %. Row reads FAIL (fonts) only for the queued fallback @font-face request.

## cluster-brand-case-study (2026-11-15)

7 brand-case-study siblings (`/4brands-reply/de/…`), encoded by
`stardust/.work/rollout/cluster-brand-case-study/gen.py` with the archetype's content model
(rotkaeppchen-mumm-sektkellereien) and EACH PAGE'S OWN section composition (sections, order, repeat
counts) from its hydrated capture; band colour, layout (x / width / alignment) and band spacing read from
a live layout probe (`layout.json`, 1440 / 360) and a computed-style probe (`secstyle.json`). The
encoder re-encodes the archetype to the hand-authored doc (`archetype-encoded.html`) as its check.
Pilot (engpaesse) gated first at 1440 (9.62 %) before the other six.
- Reused, unchanged decode tiers: b4-hero (case-study), b4-intro (split), b4-client, b4-text, b4-quote,
  statement (case-study), b4-profile; from brand-solution b4-slider, b4-tabber, b4-accordion,
  card-carousel, b4-media.
- Additive variants (existing classes untouched): b4-text ice / center / stack / wide / single /
  eyebrow (label moved into the title cell) / top0 / top-s / bot / bot-s / bot0 / first, empty
  title / body cells collapse; b4-intro eyebrow / top0 / bot0 / mid (+ split on a painted band);
  statement eyebrow / flush / flush-b; b4-quote top (dark panel with the top margin); b4-hero plain
  (no image: ink text, tag list aside); b4-profile plain / top0 / bot0; b4-media full (full-bleed
  2:1 picture band); b4-slider box (stat / benefit tiles) / ink / halfdark / feature (icon items) /
  lift; b4-tabber tab abstract (second label paragraph).
- Gate (preview host, 3 fix rounds): 1440 3.44–9.62 % (all ≤ 10 %), 360 8.96–18.18 %; pass at both
  widths: preis-sensing, sap-c4-hana. Open: 360 text-wrap offsets on the fallback faces (engpaesse
  10.85, connected-shelf 10.7, zentis 15.76, gerolsteiner 18.18 — plain hero h1 5 vs 7 lines);
  smart-glasses h1 `S<span>mart …` read as "s mart" by content-presence (source markup). Rows recorded
  `failed` in coverage; font-not-loaded is the known foundation request.

## cluster-brand-home (2026-11-15)

`/4brands-reply/de` encoded by `stardust/.work/rollout/cluster-brand-home/gen.py`: the gated archetype doc
(`content/4brands-reply/en.html`) with the DE capture's verbatim text and links mapped section by section
in document order (identical DAM media reused; DE carries 5 news cards, an h2 about title, the DE
statement brand span). Decode tiers unchanged. Additive variants: statement flush, b4-band tight and
b4-about tight (R-02 compensation for the longer German lines @1440). Presence sidecar (scale slider,
Maps controls) and clip allowance (REVE clamp) mirror the EN archetype. Gate: 1440 6.58 % / 360 18.17 %
(scale-slider heading timing + text-wrap offsets at 360); row `failed`.

## archetype-home (2026-11-15)

Page `/` (content doc `content/index.html`, template home, archetype index), 224 images under `media/index/`.
The main case-study wall (62 cards, 159 images) is authored in the fragment `/fragments/index-wall`
(`robots: noindex`) and placed with a fragment block: the delivery pipeline (html2md) caps a document at
200 images ("maximum number of images reached: 224 of 200 max"). Converted 3 blocks (+ hero-card reused for
the plan's `feature`), reused 6 with additive variants.
- **hero-slider** — template-slotted (DAM player link -> 16:9 iframe, link kept as a visually hidden caption
  `@ew-exempt player-url` | slide title + abstract wrapped in one new anchor, EW6). Motion: parallax --ty
  (13.23 / 15.39 %), pause / play disc; the muted autoplay loop runs inside the DAM player (captureState
  restoreAtDelivery). `buildAutoBlocks` wraps every `/widgets/` link into a `div.widget` before decoration —
  hero-slider and cards-wall accept the player link in either host. Deviation: the source page has no h1; the
  slide title is authored as the page h1 (one-h1 contract) -> block-roundtrip reports one ROLE SWAP on it.
- **believe** — template-slotted eyebrow + reconstructive statements rail (one item per heading, one per
  view, clipped; static as on the home source — live opens on a random statement).
- **make** — template-slotted eyebrow + section title (index .home-make).
- Reused, additive: **hero-card** `feature` / `first` (featured banners, `logo`); **card-carousel** second
  picture = partner logo, pre-heading paragraph = date line, `highlights` (scale band), `ink` (latest-insights
  rail on the ink band), `start-<n>` (opening card, live data-start) — both rails `autoplay` (captureState
  restoreAtDelivery) and the scale title clamp painted through clip-path; **cards-wall** card types `product`,
  `video` (DAM player in the card box + pause disc, captureState restoreAtDelivery), date stamp in the meta row,
  `span-N` token (captured live row span, kept from 1440 so the masonry places cards as the source), `special`
  (3 columns from 1112), `home-featured` / `home-main` (margins, R-02 tracking, cover named by the title);
  **section-heading** `insights` (ink band, title + ghost "View all" — the source's concealable sm/lg pair);
  **rose-cta** `band` (closing ROSE band: logo | display line | button).
- davids-model-lint D1/D3 🟡 on hero-slider / believe / make / hero-card / section-heading / cards-wall /
  rose-cta: kept as blocks (grid placement, band paint, sliders, wall type cells).
- Gate (published preview origin, 2 fix rounds + sidecars): 1440 7.25 % Δh 0 / 360 5.73 % Δh 0 (hero video rows
  masked, `masks.json`), clipped 13 / 15 within the clip-allow (source-faithful 3-line wall title clamps),
  content MISSING 5 / 2 + HIDDEN 2 / 4 — all inside the autoplaying rails declared session-variable in
  `presence.json` (link checks honour it; the heading check in content-presence.mjs does not). Crop header
  2.20 % (64 px band; frozen chrome), footer 1.08 %. Fonts flag = the queued fallback @font-face request.

## cluster-listing (2026-11-15)

`/4brands-reply/de/newsroom` (template listing, archetype en-insights, render unit listing) encoded by
`stardust/.work/rollout/cluster-listing/tools/gen.py` from the hydrated capture: the newsroom is the 4brands
event wall, so the listing model is intro + explore filters + the brand-home **b4-events** wall (reused;
cards-wall has no event card type). Variance probe `stardust/.work/rollout/cluster-listing/variance.json`
(cards 24 -> 38 one family, filters / wall 1312 -> 1087). 7 event photos captured in-page (DAM 403 when
hot-linked) under `media/4brands-reply-de-newsroom/`.
- **intro** (reused, additive) `newsroom` — h1-only ice title band (no rule / lead), 56 / 72 padding.
- **explore** (reused, additive) `newsroom` — no title; filter bar on columns 2 / 12 from 1024, 48px top.
  The search input now carries the authored label as its (transparent) placeholder (source parity).
- **b4-events** (reused, additive) — reconstructive rows unchanged; new row shapes: news / press card
  (one cell: h3 link, category, dd.mm.yyyy date, abstract; title-only link as the source a > h3, category
  dot + date line), event hours paragraph ("11:00–18:00 Uhr MESZ", clock glyph), cross-month ranges (four
  date paragraphs -> two day + month lines). Location / hours glyphs moved from the row ::before to an empty
  decorative `i.b4-event-icon` (content-diff pairs icon-font glyphs only on empty hosts). Variant
  `newsroom`: white band, no top margin under the filters, no R-02 tracking < 768.
- davids-model-lint D1 / D3 🟡 (intro single cell; explore / b4-events rows differ in cell count by design).
- Gate (preview host, 3 rounds): 1440 9.64 % -> 15.35 % Δh 247 (masonry column placement from computed
  spans; the captured `grid-row-end: span N` could be pinned as cards-wall span tokens), 360 23.87 ->
  11.45 % Δh -8 (fallback-font wrap offsets); clipped 0, MISSING / HIDDEN 0; crop header 0.79 %, footer
  1.23 %; content-diff 0 structural (1 nothing-lost: the hidden wall empty-state, logged deviation).

## cluster-hub (2026-11-15)

27 hub siblings of /en/iot (render units hub-1..hub-4), encoded from the hydrated capture by
`stardust/.work/rollout/cluster-hub/gen.py` (the encoder re-encodes the archetype to the hand-authored
`content/en/iot.html` row for row, as its check). Module kind = the section's source runtime
(`gridcontainer` parallax, `heroslider`, `cardcarousel` by data-carousel-type, `cards-wall`, `reply-card`
hero, `slider-with-title`, `page-index`, `rose-banner`, `logo-wall`, `continuous-slider`); text-only
sections by measured face / alignment. Section spacing from a live layout probe (`layout.json`, 1440 / 360)
as additive spacing tokens. Variance probe `variance.json` (27/27 varying). Pilot energy-and-utilities.
- **slider-with-title** (new) — title template-slotted, items reconstructive (media | title | body | CTA);
  variants four / autoplay / infinite / icons / cards / center / dark; prev/next, all-displayed.
- **hub-text** (new) — template-slotted rich-text band (all nodes moved in order); `mixed` = the flattened
  content of a one-off source module (encrypted title, interactive titles, video, flockler, investor
  widgets — logged `module-flattened` deviations), `center`.
- **logo-wall** (new) — title template-slotted, logos reconstructive (5 per row >= 768, pages of 8 < 768).
- **marquee** (new) — reconstructive continuous slider (awards cards / keywords); the loop copy is a
  presentational clone (EW4).
- Reused, additive: media-hero `slide` (heroslider caption, EW6) and `intro` (offering copy over / below
  the band); hero-slider `hub` (DAM video slide); cards-wall `event` card type + `t-`/`tm-` tokens + special
  featured span 3; card-carousel / hero-card / statement / section-heading spacing tokens
  (`t-/tm-/b-/bm-<px>`, `w-<n>`), section-heading `lead`, statement hub `h1`; page-index `hub` (hidden
  < 768 as the source); labs, rose-cta, discover-also unchanged.
- Deviations: second h1s demoted to h2; pages without an h1 promote the slide title / opening statement;
  prose paragraphs with several emphasized links lose the emphasis (one-cta-per-p).
- Crop (energy-and-utilities 1440): header 1.65 %, footer 1.08 %. Fonts flag = queued foundation request.

## cluster-home (2026-11-15)

`/en` = `content/index.html` verbatim (the source serves the same document at / and /en; shares
`/fragments/index-wall`). `/en/christmas` encoded by `stardust/.work/rollout/cluster-home/tools/gen.py`
from the hydrated capture (62 images in-page captured under `media/en-christmas/`).
- New: **video-stories** (reconstructive, one row per story: still | DAM player link; 2:3 stills,
  play disc opens the player, 1 per view + bars < 768, 3 across >= 768); **media-banner** (template-
  slotted ROSE Room event card: background picture(s) + eyebrow / heading / meta / body / note / pills;
  unlinked source buttons authored as `<em>` paragraphs).
- Additive: hero-slider `video` (player alone, 16:9), believe `forward` (statement = page h1, deviation;
  "Make Forward" link heading), make `xmas` / `stories`, card-carousel `highlights xmas` / `ink xmas`,
  cards-wall `home-featured xmas`, section-heading `insights xmas`, section style `xmas-more`
  (Discover more on the ink band). Spacing values from the page CSS (stardust/current/assets/css/pages).
- PENDING at session end: published-origin gate rows for en / en-christmas (deployed + live; gate job
  stopped), block-roundtrip ran unmapped (cards-wall closed, other blocks need --map), crop-compare.
