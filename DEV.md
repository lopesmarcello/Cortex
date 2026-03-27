# Development Guide (DEV)

This guide is for contributors who want to run Syntra locally, add features, and verify behavior before opening a PR.

## Prerequisites

- Node.js 18+
- npm 9+
- Linux/macOS/WSL recommended

## 1) Clone and install

```bash
git clone <repo-url>
cd syntra
npm install
```

## 2) Build and run locally

```bash
npm run build
node dist/index.js --help
```

For fast iteration (without rebuilding every command change):

```bash
npm run dev -- --help
npm run dev -- sync --help
```

## 3) Test suite

Run all tests (non-watch):

```bash
npm test
```

Watch mode for focused development:

```bash
npm run test:watch
```

Current tests cover:

- sync generation and target-specific sync behavior
- skills included in adapter sync (canonical data loading)
- done command task movement
- validation outcomes for valid/invalid setups
- template save/list behavior
- sync status warning logic
- template render safety (all registered templates rendered)

## 4) Lint and type checks

```bash
npm run lint
npm run build
```

Use both before opening a PR.

## 5) Manual smoke tests

Use a temporary workspace to avoid modifying real projects:

```bash
mkdir -p /tmp/syntra-smoke && cd /tmp/syntra-smoke
node /path/to/syntra/dist/index.js init
# syntra-task skill is auto-created at ai/skills/syntra-task.skill.md (used via /task, alias /syntra-task)
# verify it exists:
cat ai/skills/syntra-task.skill.md
node /path/to/syntra/dist/index.js add task
node /path/to/syntra/dist/index.js sync
# verify skill is synced to selected adapters, e.g.:
cat .github/prompts/syntra-task.prompt.md
cat .github/prompts/task.prompt.md
cat .claude/commands/task.md
node /path/to/syntra/dist/index.js validate
```

## 6) Project structure (high-level)

```text
src/
├── commands/     # CLI command handlers
├── detectors/    # project auto-detection
├── adapters/     # generators for Copilot/Claude/Cursor (instructions, agents, skills)
├── templates/    # built-in template content + renderer
├── validators/   # config/content/sync checks
└── utils/        # fs/logger/prompt helpers

tests/
├── commands/
├── validators/
├── templates/
└── helpers/
```

## 7) Contribution expectations

- Keep changes focused and minimal.
- Add/adjust tests for behavior changes.
- Preserve `ai/` as canonical source-of-truth behavior.
- Avoid introducing breaking CLI changes without updating docs.

## 8) Release checklist (local)

1. `npm install`
2. `npm run lint`
3. `npm run build`
4. `npm test`
5. Bump version in `package.json`
6. Update `RELEASE_NOTES.md` with the new version entry
7. Update `README.md` "What's New" section
8. Update `llms.txt` version field if needed

If all pass, changes are ready for review.
