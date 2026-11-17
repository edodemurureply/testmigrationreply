# Template cluster brief — render siblings + C-deliver cluster unit (reply.com replica)

You are the subagent for ONE template: render its sibling pages (migrate render units) and deliver them
(C-deliver `cluster-<template>` unit). Project root /workspace/a355dc1b. Hands-off: never ask questions.
The template's archetype is already LIVE and gated on the preview origin; its blocks and the content doc
`content/<archetype-path>.html` are the proven ENCODER — siblings reuse those blocks, never re-author them.

ALSO READ /workspace/a355dc1b/stardust/rollout/briefs/archetype-unit.md: its Context, Read first, Machine limits and
git rules apply to you verbatim (shared run-bg pool with RUN_BG_SLOTS=1, no foreground Playwright, no gate.sh --full,
commit only your own paths, frozen foundation + request lines, token via --token-file "$ADOBE_IMS_TOKEN_FILE").

## Read first
- `/home/node/adobe-skills/plugins/stardust/skills/replica/reference/handoff-contract.md` § 1 (Migrate — sibling
  tier, rows 1–9 + Acceptance) and § 2, via section.mjs. `migrate.mjs --help`, `sibling-variance.mjs --help`.
- Your render units: `node stardust/scripts/replica/json-query.mjs stardust/migrate/progress.json --path units.<name>`
  (fields `slugs`, `archetype`). Pages already delivered (coverage `deployed`/`verified`, or live in a deploy ledger)
  are re-verified, never re-authored.

## Steps
1. Variance probe once: `sibling-variance.mjs <archetype live-preview or source url> <sibling source urls…> --probe
   <block>=<sel> … --width 1440` (through run-bg). Budget each delta as a block VARIANT class (additive, backward
   compatible) — never a per-page block fork.
2. Render each sibling (structural clone of the archetype + this page's verbatim content from
   `stardust/current/pages/<slug>.json` / `.html`) and place it with `migrate.mjs render <slug…> --archetype
   <slug>=<archetype>`; record judgments with `migrate.mjs gate|modules|variant|deviation`. Content-count acceptance
   per page (row 4). Bodyless/placeholder pages → tier `thin` with a declared contentGap, never padded.
   After each render unit (each `<template>-N` group): report nothing yet, just note its final
   `rendered N, unchanged N, refused N, passthrough N` line for your report.
3. Encode each sibling into `content/<path>.html` with the archetype's content model; media via da-media-upload
   (scope = slug); then the per-page chain: delivery-lint → media-reconcile → davids-model-lint → localize-links
   (+ --check) → sanitise.js → block-roundtrip --ew on a representative sibling (through run-bg).
4. Commit + push only your paths (blocks you changed additively, content/, stardust/migrated/ for your slugs, your
   eds-schema, your units paths file). Deploy all your pages: `stardust/rollout/units/cluster-<template>.paths`,
   `deploy-batch.mjs … --ledger stardust/deploy/ledger-cluster-<template>.json --log
   stardust/.work/rollout/cluster-<template>/deploy.log --concurrency 1` through run-bg (re-run the same command
   after a transient failure — it skips live pages).
5. Gate: `gate-all.mjs --only <all your sibling slugs> --eds-host https://main--a355dc1b--aemcoder.aem.page` at 1440 and 360
   with `--origin-concurrency 1 --eds-concurrency 1 --probe-concurrency 1`, through run-bg. Bar: pixel ≤ 10 %,
   |Δh| ≤ 5 %, clipped 0, MISSING/HIDDEN 0. Fix rounds cap 3 per page (block variant / encoder / content re-PUT with
   --force); then record residuals honestly. `crop-compare` header/footer once on one sibling.
6. Bookkeeping: `update-coverage.mjs <slug> --status deployed --url https://main--a355dc1b--aemcoder.aem.live<path>`
   per page (a failing gate row stays `failed` with --error); NEVER `state.mjs advance … --to migrated` and never a hand edit of stardust/state.json (gate-all selects
   status `deployed`; other agents write it at once): after deploy run
   `node stardust/.work/rollout/probes/mark-deployed.mjs <slug>=</path> …` (locked, atomic); `gate-evidence.mjs --slug …`.
   Append decode-tier notes under `## cluster-<template> (2026-11-15)` in stardust/eds-conversion-log.md.
   Do NOT edit stardust/rollout/progress.json or stardust/migrate/progress.json — the coordinator records units.

## Report
Lines, nothing else:
`render <unit-name>: rendered N, unchanged N, refused N, passthrough N` (one per render unit)
`cluster-<template>: pages n/n live, blocks k, gate 1440 x% / 360 y% (worst), failed f, requests r`
plus at most 3 short residual lines (failing slugs with numbers).

## Known (from archetype units)
- gate-all rows currently also read FAIL with `font-not-loaded` (foundation fallback faces use only local('Arial'));
  queued as a foundation request for C-final. Judge your rows on pixel / Δh / clipped / MISSING-HIDDEN; report the
  font flag separately, do not fix it.
- The delivery pipeline drops leading `<br>`; spacing that relied on it is restored in block CSS (see intro.css).
- gate-all only gates pages whose stardust/state.json status is `deployed` with a liveUrl: run mark-deployed.mjs
  right after the deploy batch, BEFORE gate-all. Never `state.mjs advance --to migrated` (it would drop the page
  from the final roster gate).
- Autoplaying carousels: content-presence may count a heading MISSING / edge links HIDDEN when live and build are a
  slide apart; if live hides the same, record it as a carousel-timing residual (archetype-brand-solution did).
