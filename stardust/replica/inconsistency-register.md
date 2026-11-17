# Inconsistency register — reply.com replica

The ONLY permitted design deltas for this run. No audit was requested and no
user register was supplied: no design changes are applied — a pure replica.
Entries below are capture-state / delivery notes (status `deferred` = changes
nothing; they ride along as a handover list).

## R-01 — Single-section 1480px content cap on the 4brands home

- **Evidence:** cap-probe (DESIGN.json extensions.breakpoints.capRegister): module cap 1480px on one section of https://www.reply.com/4brands-reply/en while every other module caps at 1660px.
- **Finding:** one section caps narrower than the site's 1660px module cap with no responsive cause visible.
- **Minimal change:** none in this run — replicated as captured (1480px on that section).
- **Status:** deferred
- **Where:** brand-home, one section

## R-02 — Brand typeface is a licensed commercial font (Alaska, newglyph) — substituted

- **Evidence:** stardust/current/assets/fonts/*.otf name tables "Alaska Beta … ©newglyph 2020"; www.reply.com/fonts/* is served WITHOUT Access-Control-Allow-Origin (curl with Origin aem.page / aem.live / localhost, 2026-11-15, CloudFront hit), so it cannot be loaded cross-origin by the new host.
- **Finding:** the font cannot be rehosted on the delivery host without the owner's licence, and cannot be borrowed cross-origin.
- **Minimal change:** metric-matched open substitute Archivo (variable, OFL) under the SAME family aliases as the source CSS: contrast cuts at wdth 112–116 (advance widths within 0.5 % of Alaska, x-height 0.526 vs 0.521), expanded cuts at wdth 125 + size-adjust 116.5 % (browser-calibrated), Alaska vertical metrics via ascent/descent/line-gap overrides. Glyph-shape pixel deltas in text are the expected residual. A licensed Alaska drop-in later replaces only the @font-face src lines.
- **Status:** applied
- **Where:** all page types (all text)

## R-03 — Live placeholder pages

- **Evidence:** vision check (_crawl-log.json#visionCheck): en-autonomousdrivingsafety, en-lufhtansa, en-event-detail show template lorem ipsum; en-acknowledgement shows a Gartner MQ page.
- **Finding:** unfilled or mis-titled pages are published on the live site.
- **Minimal change:** none — replicated as captured; flagged to the owner.
- **Status:** deferred
- **Where:** plain, editorial
