# Learnings — reply.com replica run

- 2026-11-16 rollout: archetype pages rendered as `<dir>/index.html` but delivered as leaf documents (`/en/iot`) were probed at `<path>/` by verify/done-check (404). Keep the migrated file layout identical to the delivered content tree (`<path>.html`).
- 2026-11-16 rollout: EDS serves paths lowercase; a source path with capitals (`/en/CCPA-privacy-notice`) needs its coverage path lowercased and a redirects-sheet row.
- 2026-11-16 rollout: chrome documents (nav/footer + locale variants) landed in the served sitemap until each carried a `Robots | noindex` metadata row; put it in at C0.
- 2026-11-16 rollout: 953 root-relative hrefs pointed at 584 out-of-plan targets; repoint them at render time, not at E2, so cluster gates and the link audit agree.
- 2026-11-16 header contract: the live explore paces at ~1 state/min against the source edge; `--max-states 18 --max-depth 1` records the 21 top-level states in ~10 min.
- 2026-11-16 fix waves: wrap drift from the licensed-font stand-ins (Archivo for Alaska) is per page; global width re-cuts regress other pages — per-page tracking/variant classes are what moved near-miss pages under the bar.
