# Journal — reply.com replica run

## Extract — 100/100 pages captured live, 8 templates typed (2026-11-15)

- `crawl.mjs --pages <100 planned URLs> --dynamics --concurrency 3`: 100/100 captured, 0 failures, real Chrome headless, no bot wall. `/en` is a duplicate render of `/` (`duplicateOf: index`) — both are in the plan, both kept.
- Vision check (thumbnails, subagent): 96 ok, 4 suspect — `en-autonomousdrivingsafety`, `en-lufhtansa`, `en-event-detail` are unfilled template pages on the live site (lorem ipsum), `en-acknowledgement` carries a Gartner MQ page under that title. These are the live state; replica replicates them as captured.
- Page types (8): home 3, hub 28, brand-home 2, brand-solution 28, brand-case-study 8, listing 2, editorial 15, plain 14. Archetypes: index, en-iot, 4brands-reply-en, 4brands-reply-de-customer-experience-management, 4brands-reply-de-rotkaeppchen-mumm-sektkellereien, en-insights, en-covid-19-implications-2021, en-accessibility.
- Source CSS: theme + shared styles + ONE generated stylesheet per page (hashed per-instance section classes, stable across requests) — all harvested to `stardust/current/assets/css/pages/<slug>.css`.
- Fonts: Alaska Beta (newglyph, commercial) self-hosted on www.reply.com; Remix Icon (open). (Corrected in Recreate: the origin does NOT send CORS — see register R-02.)
- Style census 1440+360 over 99 unique URLs; cap-probe: contentMaxWidth 1660px (module), shell fluid; one single-section 1480px cap on 4brands-reply/en flagged for the register.
- Capture gaps (scope debt — the page plan is fixed for this run): uncaptured first-level targets: en 142, en/aws 3, en/esg 0, en/iot 12. Links to them stay pointed at the source.
- Sequential flow chosen over the two-track first-page-first opening: the runner's phase plan drives this run; the home page is the first archetype.

## Preserve direction — verbatim promotion, pure-replica register, 58 dynamic rows triaged (2026-11-15)

- current/PRODUCT.md, DESIGN.md, DESIGN.json promoted verbatim to the root; `stardust/direction.md` records preserve mode; state: 100 pages → directed.
- Inconsistency register: 3 entries, all `deferred` (4brands single 1480px cap, Alaska font licensing — referenced from the source origin, live placeholder pages). No design delta applied.
- Dynamics: detect on 8 archetypes → 58 rows (self 12, owner batch 46); curated in `stardust/dynamic-features.md` with decision batch D-01…D-06; every row has a disposition.
- Martech (owner asked to keep tags/consent): spec-martech → OneTrust (domain script found) + GTM-5J8JCZQ + GA/Ads, HubSpot, pixels; `martech-contract.json` with every part disabled; `martech-scaffold.mjs` wrote scripts/martech.js and the consent hooks (0 routes enabled).

## Recreate — all 8 archetypes gated at 1440 and 360 (2026-11-15)

- en-accessibility (plain): authored the canon (tokens, grid, header, footer, canon.js). 1440 2.21 % / Δh 0, 360 3.82 % / Δh 0 after the font switch.
- Font finding: www.reply.com/fonts is served WITHOUT CORS → Alaska cannot be borrowed and is not rehosted. Register R-02 applied: static Archivo instances (OFL) per Alaska cut, browser-calibrated widths (±0.5 %), Alaska vertical metrics via overrides.
- en-iot (hub): 1440 2.91 % / Δh 0; 360 9.46 % / Δh +24 px — residual after the 3-iteration cap (substitute-font wrap forks). Shared modules in prototypes/modules.css/js.
- index (home): 1440 9.44 % / Δh 0, 360 5.59 % / Δh 0; residuals are live video frames and autoplaying carousels (captureState restoreAtDelivery).
- en-insights (listing): 1440 1.28 % / Δh 0, 360 2.01 % / Δh 0, 2 iterations each; reuses canon + modules; new wall-filters module (en-insights.css/js) to promote to modules at delivery.
- 4brands-reply-en (brand-home): 1440 2.04 % / Δh 0, 360 3.16 % / Δh 2, 3 iterations each. 4brands chrome + shared brand modules in prototypes/brand.css/js (body.brand-4b); Google Maps is a static capture to restore at delivery.
- en-covid-19-implications-2021 (editorial): 1440 2.81 % / Δh 0, 360 8.89 % / Δh 2, 3 iterations each; residual R-02 wrap forks at 360; live 10px overflow clipped. New page-index (sticky anchor nav + scroll-spy + share) module to promote.
- 4brands-reply-de-rotkaeppchen-mumm-sektkellereien (brand-case-study): 1440 1.68 % / Δh -1, 360 3.87 % / Δh 2, 3 iterations each; HubSpot form modal (restoreAtDelivery); b4-quote/b4-profile/b4-modal to promote to brand.css.
- 4brands-reply-de-customer-experience-management (brand-solution): 1440 1.74 % / Δh 0, 360 3.65 % / Δh -2, 3 iterations each; added b4-tabber, b4-accordion, b4-teaser to brand.css/js (additions only, page-scoped resets for two brand-home tweaks).
- Prototype tables (gate-all --stage prototype): 1440 8/8 PASS, 360 8/8 PASS.
- Modules to promote at delivery (C0/blocks): wall-filters (listing), page-index/ed-* (editorial), b4-quote/b4-profile/b4-modal (case study). Brief: stardust/replica/archetype-brief.md.

## Migrate plan — 8 archetypes rendered, 92 siblings planned in 15 clusters (2026-11-15)

- `migrate.mjs render` over the 8 gated archetypes: rendered 8, refused 0 → stardust/migrated/. Links to pages outside the 100-page plan are reported broken (soft).
- modules[] is empty on the archetype sidecars (prototypes carry no data-module); set them with `migrate.mjs modules` before rollout B-block dedups.
- stardust/migrate/progress.json: plan done; render units per template (≤ 8 siblings each), each runs after that template's C-deliver `archetype` unit.

## Rollout A-inventory — 100 pages in coverage, 8 archetypes to deliver first (2026-11-15)

- inventory.mjs: 100 pages · 8 pending (archetypes) · 92 content-pending (siblings, rendered after their archetype unit). rollout.json site: DA aemcoder/a355dc1b, ref main, liveHost main--a355dc1b--aemcoder.aem.live.
- Sibling rows group by page type until their render writes `template` = archetype slug; blocks.mjs needs modules[] on the archetype sidecars first.

## Rollout B-block — 41 distinct blocks, each converted on one archetype (2026-11-15)

- modules[] set on the 8 archetype sidecars from their prototype sections; shared ids where the prototypes share a module (section-heading ×5, statement ×5, card-carousel ×4, cards-wall ×4, b4-hero ×3, awards ×2). 61 instances → 41 conversions.
- plan.json: representative-first; chrome (header/footer, Reply + 4brands variants) is delivered by C0 foundation, not counted here.

## Rollout B2-dynamic — 58 rows re-verified against the preview host (2026-11-15)

- dynamics-plan --target-origin main--a355dc1b--aemcoder.aem.page --migrated: 58 rows · self 8 · owner batch 41 · delivered 9 · host-bound 4/4 (first-party /api/content-list, /api/content-meta-options, /product-detail — all already dispositioned "static snapshot as captured", D-02). No new row; curated stardust/dynamic-features.md stands.
- Martech: contract all parts disabled, scripts/martech.js + handoff committed (dynamics-check verifies at E).

## Migrate render — all 92 siblings rendered and live; cluster gates mostly over bar (2026-11-16)
- Render units hub-1..4 (27), listing (1), home (2) done; every render unit in stardust/migrate/progress.json is `done`.
- cluster-hub failed: 27/27 live, worst 58.9%/56.78% (one-off source modules kept as rich text, carousel timing).
- cluster-listing failed: 15.35%/11.45% (event wall spans); cluster-home live, gates still pending (deliver.sh re-run).
- Next: cluster-home gates, then C-final font fallback fix and re-gate of failed clusters, gate-all, final.

## C-final fix wave — plain/home 9/12, 4brands small 4/9, editorial 2/14 pass both widths (2026-11-16)
- fix-editorial recorded failed after 4 rounds; fix-editorial-2 (second round) 2/14, with regressions on both biotagging pages (added video row) and learning-partner 360 (Δh +621) to revert.
- fix-plain-home 9/12 (open: en-christmas, en, index — carousel timing, title clamp); fix-4brands-small 4/9 (remaining five fail at 360 only, 10.6–14.5 %).
- Open: second rounds for hub and brand-solution, then gate-all-2 and final.

## C-final fix wave 2 — hub and brand-solution round 2 shipped, gates pending (2026-11-16)
- Merged gate table (summary + newer --only runs): 28/100 pass both widths before the wave (plain 14/14, brand-home 2/2).
- fix-hub-d recorded failed 0/13 (1440 worst 33.0 %, 360 worst 32.1 %); residuals: card-carousel simple rails, google-cloud specializations/companies, social-wall images, autoplay MISSING.
- fix-hub-c and fix-brand-solution-2 stopped at the session budget boundary with their fixes pushed and deployed; both are back to pending — re-gate only, then record.
- Open: fix-editorial-3, fix-small-2 (unit files written), then gate-all-2 and final.

## C-final fix wave 3 — hub-c 1/14, brand-solution-2 0/25, small-2 7/8; editorial-3 shipped, gate pending (2026-11-16)
- Re-gated fix-hub-c (1/14 both widths; digital-assets / artificial-intelligence only content MISSING at 1440) and fix-brand-solution-2 (0/25; 7 pass 1440; regression checks 4brands-reply-de + rotkaeppchen PASS).
- Foundation experiment: size-adjust on the Archivo stand-ins (branch fontfix, 8 pages at 360) — 2 better, 5 worse; rejected, branch deleted.
- fix-small-2 7/8 (newsroom 360 12.18 % open; en/index/en-christmas pass via instrument overrides).
- fix-editorial-3: reverts + round-2 fixes pushed (314e189), stopped at the session boundary before its gate. Open: its gate, then gate-all-2 and final.

## C-final fix wave 4 — editorial-3 3/12; font re-cut rejected; hub-e and brand-solution-3 launched (2026-11-16)
- fix-editorial-3 re-gated: 3/12 pass both widths (becoming-ai-native, building-resilient-eu-forms, frontier-event-2026); latest rows across all runs: 36/100 pages pass both widths (plain 14/14, brand-case-study 8/8, brand-home 2/2, editorial 6/15, brand-solution 3/28, hub 2/28, listing 1/2, home 0/3).
- gate-all-2 first attempt hit run-bg's 900 s default cap (roster needs --timeout); deferred until after this wave.
- fontfix2: Archivo contrast cuts re-instanced at browser-calibrated wdth (rendered corpus width within 0.05 % of Alaska); 14-page branch-host sample went 3 → 4 pass-both with regressions elsewhere — rejected (foundation-requests.md).
- Wave 4: fix-hub-e (13 hub pages, re-prototype treatment) and fix-brand-solution-3 (25) running as subagents; fix-hub-f (13) and fix-small-3 (13) queued.
- Wave 4 results: fix-hub-e 1/13 pass both widths (en-design; adobe and ai-powered-software-engineering pass 1440), fix-brand-solution-3 3/25 (data-value-management, process-mining, reply-routes). Runner stopped the session at the budget cap after these units; fix-hub-f, fix-small-3, gate-all-2 (run-bg --timeout 6000) and final remain.
- fix-small-3 (session 13): 5/13 pass both widths (adds en-a-very-covid-19-christmas, en-covid-19-travel-and-tourism); autoplay hero video rows masked in all-<w>/masks.json; residuals: ethical-ai carousel controls, learning-partner Elevate carousel, ai-now-summit 360 origin is a crawl screenshot, newsroom 360 font wraps.
- fix-hub-f (session 13): 3/13 pass both widths (energy-and-utilities, investors, labs); environment and esg pass 1440 only; governance 1440 capture stalls (stitch scroll at 1803 px); residuals: gaming social wall, google-cloud cards/walls, healthcare labs slider, hybrid-work, logistics, financial-services. Session stopped at the runner's budget boundary; open: gate-all-2 (run-bg --timeout 6000), then final.

## C-final gate-all-2 — roster re-gated: 45/100 pass both widths (2026-11-16)
- gate-all-2 (run-bg --timeout 6000, --skip-existing): 1440 49 PASS / 51 FAIL (pixel 41, content 19, clip 1); 360 46 PASS / 54 FAIL (pixel 45, content 18, clip 3, height 1); 45 pass both (up from 36).
- Coverage: update-coverage --gate 1440 then 360 (last table wins), so the 4 pages failing only at 1440 were re-marked `failed` (error `gate 1440: …`); 16 rows carrying stale cluster-report errors that now pass both returned to `deployed`. done-check offline: pages_failed 55.
- done-check live surfaced two path issues for D-site: (a) archetype rows with migratedHtml `<dir>/index.html` are probed at `<path>/` (404; served at `<path>`) — rotkaeppchen, 4brands-reply/en, en/accessibility, covid-19-implications-2021 (+ cem, insights, iot when they pass); (b) `/en/CCPA-privacy-notice` is served lowercase (`/en/ccpa-privacy-notice`) — coverage path + redirect row needed.
- header_parity gap: no header contract yet (live explore timed out earlier); a reduced run (`--max-states 60 --max-depth 2`, widths 1440,360) was started and stopped at the runner's boundary.
- Next session: re-run chrome-explore (above flags) → chrome-compare --profile replica → unit `final` (freeze check passed: 22 files unchanged; apply foundation-requests once) → C-deliver end → D-site … I-dashboard; then fix waves on the 55 failing pages.

## C-deliver — closed: 100/100 live, 45/100 pass the published-origin gate at both widths (2026-11-16)
- Unit `final`: foundation freeze clean (22 files); foundation-requests applied once — fallback local() faces already carry Liberation Sans/Arimo, the intro rich-text rules stay block-scoped, Archivo width offsets rejected twice by measurement (residual R-02).
- `/en/CCPA-privacy-notice` is served lowercase: coverage path set to `/en/ccpa-privacy-notice`, redirect row added (D-site).
- Header contract: the full live explore runs ~1 state/min against the source edge; re-run with `--max-states 18 --max-depth 1`.
- 55 pages still fail the gate; fix-brand-solution-4 (12 near-miss pages) running beside the remaining rollout phases.

## Rollout D-site … G-aem — site assembled, links repointed, no open P1 (2026-11-16)
- D-site: served sitemap 100 = assembled after Robots noindex on 6 chrome docs; redirects sheet live (CCPA lowercase 301); `/` 200.
- D2: parity.json 58 features / 66 checks, 61 pass; 5 pending = out-of-plan locale twins and search results page (repointed at E2).
- E: 7 archetype rows probed at `<path>/` — migrated files flattened to `<path>.html`. E2: 953 hrefs → 584 out-of-plan targets repointed to www.reply.com; 0 internal 404s.
- F: P1 0, P2 100 (JSON-LD per page, manual via head/metadata), G: 0 auto-fixable.
- Header contract recorded (18 states/width); header open-state fix 10 → 2 errors (EN dropdown font width, source carousel load motion); foundation re-frozen.
- fix-brand-solution-4: 10/12 pass both widths (gate rows via --only; roster table not yet refreshed). fix-small-4 running.
- Session 15 end: rollout I-dashboard ended; runner stopped at its time boundary. fix-small-4 interrupted mid-round (uncommitted agent edits may be in the worktree — review `git status` first). Next: re-run fix-small-4, refresh the roster table (gate-all over all pages so the fix-unit rows land in summary.json, then update-coverage --gate 1440/360), then fix waves on hub (21) and editorial (7), then done-check.

## C-final fix wave 5 — small-5 10/16, hub-g 3/14, brand-solution-5 3/8; 62/100 pass both widths by latest rows (2026-11-16)
- fix-small-5: home pages (index, en, en-christmas) and most brand-solution near-misses now pass; residuals: sac-advanced-scripting 360, newsroom 360 wraps, acknowledgement, ethical-ai, learning-partner, ai-now-summit (360 origin capture stalls).
- fix-hub-g: ai-powered-software-engineering, automotive-and-manufacturing, company-profile pass (timing overrides with evidence); governance 1440 capture stalls on the shrinking header (foundation request filed).
- fix-brand-solution-5: intelligent-product-recommendations, demand-driven-replenishment, sac-insight-story-design pass; REVE lower sections and recipe scale-card slider still open.
- The roster table (summary.json) is NOT refreshed: done-check still reads the gate-all-2 table. Runner stopped the session at its time boundary.
- Next: gate-all-3 roster run (run-bg --timeout 6000, --skip-existing, 1440 then 360) → update-coverage --gate both → done-check; then fix waves on the remaining hub/brand-solution/editorial pages.

## C-final gate-all-3 — roster re-gated: 68/100 pass both widths (2026-11-17)
- gate-all --skip-existing over all 100 pages: 1440 70 PASS + 8 overrides = 78; 360 62 + 8 = 70; both widths 68/100.
- New at 1440: 4brands intelligent-enterprise reads font-not-loaded (3 random-named families) at 57.51 % — a regression or capture flake, handed to fix-brand-solution-6.
- update-coverage --gate 1440 then 360; the two pages failing only at 1440 re-marked failed by hand-command.
- Fix units launched: fix-hub-h (7 hub pages), fix-brand-solution-6 (8 4brands pages).
- Session 17 end: runner stopped at its time boundary; fix-hub-h and fix-brand-solution-6 interrupted mid-round (their run-bg jobs stopped by PID). Their notes: stardust/.work/rollout/<unit>/notes.md. Next: resume both units from their notes (re-gate their pages at 1440/360 with --only --recapture-eds), then update-coverage, then fix editorial/small (acknowledgement, ai-now-summit, ethical-ai, learning-partner) and the remaining hub pages (aws, cloud-computing, google-cloud, hybrid-work, data-world, gaming), then done-check.

## C-final fix wave 6 — brand-solution-6 8/8, hub-j 4/5; hub-h, hub-i stopped at session boundary (2026-11-17)
- / and /en: coverage `failed` only from verify's /fragments/index-wall link flag (fragment served 200 on .page and .live; gate passes with override) → update-coverage `deployed`.
- New unit files: fix-hub-i (aws, cloud-computing, google-cloud, hybrid-work, data-world, gaming), fix-hub-j, fix-editorial-4 (acknowledgement, ai-now-summit, ethical-ai, learning-partner), fix-4brands-3 (ai-voice-assistant-fmcg-sales, newsroom @360).
- fix-brand-solution-6 done: 8/8 pass both widths (1440 worst 9.88 %, 360 worst 8.93 %).
- fix-hub-j done: 4/5; en-digital-assets 360 13.4 % + MISSING 2 (rail phase, abstract wrap), round limit used.
- fix-hub-h (round C, several pages passing per its evidence commit) and fix-hub-i (round 2) told to stop at the runner's time boundary; resume from their notes.md.
- Next session: update-coverage --gate from the units' runs (or gate-all --skip-existing roster refresh), done-check; then fix-editorial-4 and fix-4brands-3, finish hub-h / hub-i residuals.

## C-final fix wave 7 — 93/100 by latest rows: brand 2/2, hub-k 3/3, hub-l 4/5, editorial 1/4 + 1/3 + 0/2 (2026-11-17)
- Roster refresh from unit runs (merge of summary + runs/, latest row per slug → update-coverage --gate): 18 pages flipped to pass; two with a hand-set `gate 1440:` error set `deployed` by command.
- fix-4brands-3 2/2 (b4-events relayout on card resize, 360 wrap fit). fix-hub-k 3/3 (3d, dx via rail timing overrides with timelines). fix-hub-l 4/5 (cloud-computing 360 10.31 % + MISSING 1 left; 1 foundation request: missing 300 weight).
- fix-editorial-4 → acknowledgement pass; fix-editorial-5 → learning-partner pass, ai-now 360 now a real capture with --vh 1100; fix-editorial-6 → ai-now 360 10.56 % + 1 clipped link (fix shipped, ungated), ethical-ai unchanged.
- Remaining failed (done-check): en-cloud-computing, en-ai-now-summit-reply-sail-reply-sovereign-ai, en-ethical-ai-shaping-the-future-of-responsible-innovation.
- Next: re-gate ai-now 360 (--vh 1100 --recapture-eds) and ethical-ai 1440 (override applies); ethical-ai 360 per fix-editorial-6 notes; cloud-computing 360 per fix-hub-l notes; then gate-all roster refresh, C-final foundation-requests, done-check, replica handoff end.

## C-final fix wave 8 + handoff close — 100/100 pass both widths; done-check complete (2026-11-17)
- fix-editorial-7 2/2: ai-now 360 8.24 % (re-gate of shipped clamp/shade rules); ethical-ai 360 8.44 % after one text-band round (< 1024 rules on page-only classes) + 360 rail timing override; ethical-ai 1440 8.92 % via its existing override.
- fix-hub-m 1/1: cloud-computing 360 5.46 % (media-hero tint-24, cards-wall evmeta, rose-cta logo27, lh27 liga off, 360 Technology rail timing override), 1440 2.44 % (cloud-info-rail fit-state rounding fixed: empty arrow row kept ≥ 768).
- Coverage: the three slugs' latest rows (summary + runs/, stardust/.work/merge-roster.mjs) → update-coverage --gate; verify.mjs per slug → verified. done-check: complete, no gaps.
- Open, non-gating: two queued foundation requests (header-wrapper shrink on scroll for short hub pages; missing weight-300 face for tuqgwxsjgq) stay with the owner; residual R-02 font substitution as logged.
