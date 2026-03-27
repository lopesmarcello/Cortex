# Release Notes

## 0.2.9 - 2026-03-27

### Added
- Added `syntra sync --tasks-only` to refresh active task artifacts without regenerating non-task adapter artifacts where supported.

### Changed
- Task sync now covers all adapters:
  - **Copilot**: active tasks synced to `.github/prompts/*.prompt.md`
  - **Claude**: active tasks included in `.claude/CLAUDE.md` under a managed `## Active Tasks` section
  - **Cursor**: active tasks synced to `.cursor/rules/*.mdc`

### Notes
- In `--tasks-only` mode, Claude updates its managed task block in place when available and falls back to full `CLAUDE.md` generation when no managed block is present.

## 0.2.8 - 2026-03-27

### Added
- `syntra init` now automatically creates `ai/skills/syntra-task.skill.md` based on the LLM adapter selected — no separate `syntra add skill syntra-task` step required.
- Skills are now included in adapter sync for all three targets:
  - **Copilot**: skills synced as `.github/prompts/*.prompt.md`
  - **Claude**: skills included in `.claude/CLAUDE.md` under a `## Skills` section
  - **Cursor**: skills synced as `.cursor/rules/*.mdc`

### Changed
- `syntra init` workflow simplified: initializing a project now produces ready-to-use task commands for the chosen AI tool (`/task` preferred, `/syntra-task` alias) without manual configuration.

---

## 0.2.7 - 2026-03-27

### Fixed
- Resolved a template parsing failure during `syntra init` caused by malformed Handlebars block closures in the `architecture` instruction template.
- `next.js` TypeScript projects now initialize successfully with architecture/style/testing/security/deploy instructions selected.

### Quality
- Added a regression test that renders all registered templates and fails on Handlebars parser errors (`tests/templates/render.test.ts`).
