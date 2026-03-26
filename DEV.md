# Development Guide (DEV)

This guide is for contributors who want to run Cortex locally, add features, and verify behavior before opening a PR.

## Prerequisites

- Node.js 18+
- npm 9+
- Linux/macOS/WSL recommended

## 1) Clone and install

```bash
git clone <repo-url>
cd cortex
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
- done command task movement
- validation outcomes for valid/invalid setups
- template save/list behavior
- sync status warning logic

## 4) Lint and type checks

```bash
npm run lint
npm run build
```

Use both before opening a PR.

## 5) Manual smoke tests

Use a temporary workspace to avoid modifying real projects:

```bash
mkdir -p /tmp/cortex-smoke && cd /tmp/cortex-smoke
node /path/to/cortex/dist/index.js init
node /path/to/cortex/dist/index.js add task
node /path/to/cortex/dist/index.js sync
node /path/to/cortex/dist/index.js validate
```

## 6) Project structure (high-level)

```text
src/
├── commands/     # CLI command handlers
├── detectors/    # project auto-detection
├── adapters/     # generators for Copilot/Claude/Cursor
├── templates/    # built-in template content + renderer
├── validators/   # config/content/sync checks
└── utils/        # fs/logger/prompt helpers

tests/
├── commands/
├── validators/
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
5. Update `README.md` and `DEV.md` when command behavior changes.

If all pass, changes are ready for review.
