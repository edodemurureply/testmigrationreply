# C-deliver resume notes (updated 2026-11-17, end of session 17)
- Done archetypes: all 8 (home carries carousel-timing MISSING residuals + header crop 2.20%, see progress.json).
- Render units: ALL done (migrate:render ended 2026-11-16).
- Clusters failed (re-gate at C-final after font fix): plain, editorial, brand-solution, brand-case-study, brand-home, hub, listing. cluster-home: live, gates pending (re-run stardust/.work/rollout/cluster-home/tools/deliver.sh via run-bg).
  Then gate-all, final.
- Throughput: browser jobs RUN_BG_SLOTS=2; deploy batches in --dir stardust/.work/replica/bg-deploy. Max 2 subagents.
- Systemic: siblings fail on wrap offsets at 360 — fallback fonts (foundation-requests.md) first at C-final, then re-gate.
- Brief lesson: pilot one sibling's gate before rendering the rest; never git stash/--autostash (shared worktree).
- Proto server: start `python3 -m http.server 8791` in stardust/prototypes, record its PID, stop it at session end.
- Session 13: fix-hub-f 3/13, fix-small-3 5/13 recorded. Next: gate-all-2 roster run (run-bg --timeout 6000, --skip-existing) then update-coverage --gate, final; done-check still lists pages_failed.
- Session 17: gate-all-3 recorded 68/100 both widths. fix-hub-h + fix-brand-solution-6 interrupted (briefs/fix-unit.md; notes in .work/rollout/<unit>/notes.md) — resume them first.
