# C-final fix-wave brief (reply.com replica, published-origin gate failures)

You are the subagent for ONE fix unit: make a short list of already-LIVE pages pass the published-origin gate.
Project root /workspace/a355dc1b. Hands-off: never ask questions.

ALSO READ /workspace/a355dc1b/stardust/rollout/briefs/archetype-unit.md: its Context, Read first, Machine limits
and git rules apply verbatim (shared run-bg pool, `RUN_BG_SLOTS=2`, no foreground Playwright, no `gate.sh --full`,
commit only your own paths, frozen foundation + request lines, `--token-file "$ADOBE_IMS_TOKEN_FILE"`).
Steps 1 and 4–6 of that brief apply to the extent your fixes need them (re-PUT with `--force`, re-gate, bookkeeping).

## Inputs
- Your pages: `stardust/rollout/units/<unit>.slugs` (+ `.paths`).
- Latest roster rows: `stardust/replica/gates/all-<w>/summary.json` (`json-query.mjs … --path rows --match
  slug=<re>`), per-page evidence in `stardust/replica/gates/all-<w>/<slug>/` (diff/band data, content-presence
  output, capture records) and `runs/` (the latest `--only` run per page wins). Earlier fix units already
  worked on many of these pages: read their notes in `stardust/.work/rollout/fix-*/` (latest first) and the
  unit verdicts via `json-query.mjs stardust/rollout/progress.json --path units.<fix-unit>.verdict` before you
  start, so you never repeat a rejected fix (e.g. a font re-cut was rejected).
- Content source of truth: `stardust/current/pages/<slug>.json` / `.html`. Content docs `content/<path>.html`.

## Method
1. Per page, read the evidence: which criterion fails (pixel, Δh, clipped, MISSING/HIDDEN, font). For pixel, the
   first hot band top-down; everything below it is offset-contaminated. Use `measure.mjs <live> --against <eds
   preview url> --selectors …` (through run-bg) for box deltas — fixes come off instruments, never off eyeballing.
2. Fix at the right layer: block CSS/JS (additive, backward-compatible variant classes; the block serves every page
   of the template — re-check one passing sibling after a block change), or the page's content doc (re-PUT with
   `--force`). Content stays verbatim; no redesign.
3. Overrides / masks in `stardust/replica/gates/all-<w>/overrides.json|masks.json` are allowed ONLY for a
   documented non-defect with evidence (live-side autoplay/timing difference shown on both captures, origin capture
   stall reproduced twice). Never mask a real layout difference.
4. Re-gate each touched page on the preview host: `gate-all.mjs --only <slugs> --eds-host
   https://main--a355dc1b--aemcoder.aem.page --width <w> --origin-concurrency 1 --eds-concurrency 1
   --probe-concurrency 1 --skip-existing` through run-bg (add `--recapture-eds` after a fix). Cap 3 fix rounds per
   page; then record residuals honestly.
5. Publish touched pages (deploy-batch without --no-publish, or the page's re-PUT does it). Write your notes to
   `stardust/.work/rollout/<unit>/notes.md`. Commit + push only your paths. Do NOT edit stardust/rollout/progress.json,
   stardust/state.json by hand, or any frozen foundation file. `foundation-freeze.mjs check` must exit 0.
6. Time box: finish and report within ~2 hours, even if pages remain.

## Report
ONE line: `<unit>: pages p/n pass both widths, 1440 worst x% / 360 worst y%, blocks touched k, requests r — failing:
<slug numbers; …>` plus at most 3 short lines.
