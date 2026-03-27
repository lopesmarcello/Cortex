# Syntra CLI

[![npm version](https://img.shields.io/npm/v/syntra)](https://www.npmjs.com/package/syntra)
[![npm downloads](https://img.shields.io/npm/dm/syntra)](https://www.npmjs.com/package/syntra)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

**[npmjs.com/package/syntra](https://www.npmjs.com/package/syntra)**

Syntra is a CLI that scaffolds, manages, validates, and syncs an AI-assisted development framework across tools like GitHub Copilot, Claude Code, and Cursor.

Core principle: **`ai/` is the source of truth**. Adapter folders (`.github/`, `.claude/`, `.cursor/`) are generated artifacts.

---

## What's New

### 0.3.2

- Stability improvements and build fixes.
- Minor edge-case fixes across sync and validate commands.

### 0.3.1

- Sync state tracking: `syntra sync` now writes `ai/.sync-state.json` after each successful sync.
- `syntra validate` uses sync state to compare canonical file modification times against the last sync timestamp, warning when `ai/` files have been changed without re-syncing.
- Sync freshness check correctly handles missing state (first-run projects are not penalized).

### 0.3.0

- **Claude slash commands**: skills are now also written to `.claude/commands/*.md` as native Claude Code slash commands (e.g. `/syntra-task`, `/task`).
- The `syntra-task` skill auto-creates both `syntra-task.md` and `task.md` in `.claude/commands/`, so both `/syntra-task` and `/task` work out of the box.
- `CLAUDE.md` continues to be generated for full instruction and agent context.

### 0.2.9

- Added `syntra sync --tasks-only` to refresh active task adapter artifacts without regenerating instruction/agent/skill artifacts where supported.
- Task sync is now included across all adapters:
	- Copilot tasks → `.github/prompts/*.prompt.md`
	- Claude tasks → `## Active Tasks` section in `.claude/CLAUDE.md`
	- Cursor tasks → `.cursor/rules/*.mdc`

---

## Install

### Run with npx

```bash
npx syntra init
```

### Global install

```bash
npm i -g syntra
syntra --help
```

### Local development usage

```bash
npm run build
node dist/index.js --help
```

---

## Canonical Structure

After `syntra init`, the framework is structured like this:

```
project-root/
├── ai/
│   ├── config.yml
│   ├── .sync-state.json       # written by syntra sync
│   ├── instructions/
│   │   ├── architecture.instructions.md
│   │   ├── style.instructions.md
│   │   └── ...
│   ├── agents/
│   │   ├── code-generator.agent.md
│   │   ├── code-reviewer.agent.md
│   │   └── ...
│   ├── skills/
│   │   └── *.skill.md
│   └── tasks/
│       ├── active/
│       └── done/
│
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   │   └── *.md
│   └── prompts/
│       └── *.prompt.md
│
├── .claude/
│   ├── CLAUDE.md
│   └── commands/
│       └── *.md               # skills as slash commands
│
└── .cursor/
    └── rules/
        └── *.mdc
```

You edit files in `ai/`, then run `syntra sync` to regenerate adapters.

---

## Commands

## `syntra init`

Interactive setup:

- Scans project language/framework/package manager/CI
- Prompts for instruction templates and agents
- Prompts for adapter targets (GitHub Copilot, Claude Code, Cursor)
- Creates `ai/` structure and config
- **Auto-creates `ai/skills/syntra-task.skill.md`** — ready to use as `/task {brief}` (alias: `/syntra-task`) in your AI tool
- Runs initial adapter sync (including skills)

```bash
syntra init
```

---

## `syntra add <type> [name]`

Adds framework files from templates.

Supported types:

- `instruction`
- `agent`
- `task` (interactive)
- `skill`

Examples:

```bash
syntra add instruction microfrontends
syntra add agent bug-fixer
# create a task via AI skill (preferred)
/task add role-based authorization checks to project routes
# alias (still supported)
/syntra-task add role-based authorization checks to project routes
syntra add skill api-pagination
```

Built-in skill templates can provide richer guided behavior. For example,
`syntra-task` scaffolds a `/task {brief}` workflow (alias: `/syntra-task`) that asks clarifying
questions and generates a task file aligned with the Syntra task model.

> **Note:** `syntra-task` is automatically created by `syntra init`. You only
> need `syntra add skill syntra-task` when adding it to an existing project.

If `sync.autoSync: true` in `ai/config.yml`, add operations trigger silent adapter sync.

For `task`, task IDs and task directories are read from `ai/config.yml`:

- `tasks.idPrefix` (default: `TASK-`)
- `tasks.activeDir` (default: `active`)
- `tasks.doneDir` (default: `done`)

Task file format requirements are documented in **Task Template Contract** below.

### Built-in skill templates

Syntra supports custom skills and built-in skills.

- Generic skill scaffold: `syntra add skill <name>`
- Built-in task creation skill: auto-created by `syntra init`, or `syntra add skill syntra-task` for existing projects

When `syntra-task` is present, it creates:

- `ai/skills/syntra-task.skill.md`

This skill is synced to your adapter automatically by `syntra sync`. It is designed for AI-tool invocation via:

- `/task {brief}` (alias: `/syntra-task {brief}`)

**Claude Code** users get both `/task` and `/syntra-task` available as native slash commands via `.claude/commands/`.

Example:

```
/task add role-based authorization checks to project routes
```

The skill guides an agent to ask clarifying questions and produce one valid task file in your configured active task directory.

---

## `syntra done <taskId>`

Moves a task from the configured active directory to the configured done directory:

```bash
syntra done TASK-001
```

---

## `syntra sync`

Generates tool-specific adapter files from canonical `ai/` files. Writes `ai/.sync-state.json` after each successful sync.

```bash
syntra sync
```

Target-specific sync:

```bash
syntra sync --copilot
syntra sync --claude
syntra sync --cursor
syntra sync --tasks-only
syntra sync --claude --tasks-only
```

`--tasks-only` behavior:

- Copilot: updates only task prompt files in `.github/prompts/`
- Cursor: updates only task rule files in `.cursor/rules/`
- Claude: updates the `## Active Tasks` block in `.claude/CLAUDE.md` when marker block exists, otherwise falls back to full file generation

What gets generated:

| Adapter | Output |
|---|---|
| Copilot | `.github/copilot-instructions.md`, `.github/agents/*.md`, `.github/prompts/*.prompt.md` |
| Claude | `.claude/CLAUDE.md` (instructions + agents + skills + tasks), `.claude/commands/*.md` (skills as slash commands) |
| Cursor | `.cursor/rules/*.mdc` (instructions, agents, skills, and active tasks) |

---

## `syntra validate`

Validates framework correctness and sync state.

Checks include:

- `ai/config.yml` schema basics
- instruction naming/format
- agent references to instructions
- task structure and references (requires `Context`, `References`, `Dependencies`, `Steps`, `Acceptance Criteria`, `Notes`)
- sync freshness: warns when `ai/` files were modified after the last recorded sync

```bash
syntra validate
```

Exit behavior:

- exits with non-zero when errors are found
- warnings do not fail the process

---

## `syntra template`

Save and list reusable templates.

```bash
syntra template save my-team-template
syntra template list
```

Saved templates are stored in:

```
~/.syntra/templates/
```

---

## Configuration

Main config file: `ai/config.yml`.

Typical sections:

- `project`: language/framework/package manager profile
- `adapters`: enabled adapters and instruction mode
- `sync`: auto-sync and manual edit warnings
- `tasks`: ID prefix and folders
- `language`: generation language

---

## Built-in Templates

### Instruction templates

- `architecture`
- `style`
- `testing`
- `security`
- `deploy`

### Agent templates

- `code-generator`
- `code-reviewer`
- `task-planner`
- `bug-fixer`

### File and skill templates

- `task` (task file scaffold)
- `skill` (generic skill scaffold)
- `syntra-task` (specialized skill for task creation workflows)

---

## Project Detection

`syntra init` auto-detects your project profile before prompting:

| Property | Detected values |
|---|---|
| Language | `typescript`, `javascript`, `python`, `go`, `rust`, `other` |
| Framework | `next.js`, `nuxt`, `angular`, `vite`, `react`, `vue`, `nestjs`, `express`, `django`, `fastapi`, `flask`, `starlette`, `unknown` |
| Package manager | `npm`, `yarn`, `pnpm`, `bun` |
| Monorepo | detected via workspace config |
| CI/CD | GitHub Actions, GitLab CI, CircleCI, and others |

---

## Task Template Contract

Task files must follow this structure to pass validation:

- Required headings: `Context`, `References`, `Dependencies`, `Steps`, `Acceptance Criteria`, `Notes`
- File location: `ai/tasks/{tasks.activeDir}/{taskId}.task.md` while active
- Task ID prefix: must match `tasks.idPrefix` from `ai/config.yml`

Example:

```markdown
# TASK-001: Add date utility validation

## Context
Add a reusable date validation helper used by form input checks.

## References
- **Agent**: [code-generator](../agents/code-generator.agent.md)
- **Instructions**:
	- [architecture](../instructions/architecture.instructions.md)
	- [testing](../instructions/testing.instructions.md)

## Dependencies
None

## Steps
1. [ ] Add `isDateAfterToday` in `src/utils/date.ts`
2. [ ] Add unit tests for happy path and edge cases
3. [ ] Use helper in form validation flow

## Acceptance Criteria
- [ ] Returns `true` only for strictly future dates
- [ ] Returns `false` for invalid or empty input
- [ ] Unit tests cover new logic and pass

## Notes
Keep changes scoped to utility + tests + call site.
```

---

## Typical Workflow

```bash
# 1) Initialize (syntra-task skill auto-created)
syntra init

# 2) Customize instructions
$EDITOR ai/instructions/architecture.instructions.md

# 3) Create a task with the syntra-task skill
/task add login page
# alias: /syntra-task add login page

# 4) Sync adapters
syntra sync

# 5) Execute the generated task with your coding agent
# (e.g. /TASK-001)

# 6) Mark done
syntra done TASK-001

# 7) Validate setup
syntra validate
```

---

## Testing

Regression tests are included for core command behavior.

```bash
npm test
```

Targeted check for template parse/render safety:

```bash
npm test -- tests/templates/render.test.ts
```

---

## Upcoming Features

- **Language template improvements**: richer instruction and agent templates tailored for TypeScript, Python, and Rust projects; additional language support beyond the current detection set
- **Better LLM and agent compatibility**: improved adapter output structure for broader LLM compatibility; support for additional AI tools and agent runtimes beyond Copilot, Claude, and Cursor

---

## Changelog

### 0.3.2 — 2026-03-27

#### Fixed
- Stability improvements and build fixes.
- Minor edge-case fixes across sync and validate commands.

---

### 0.3.1 — 2026-03-27

#### Added
- `syntra sync` now writes `ai/.sync-state.json` after each successful sync run, recording the timestamp of the last sync.
- `syntra validate` reads sync state and compares canonical file modification times against the last sync timestamp, warning when `ai/` files have changed since the last sync.
- Sync freshness check is gracefully skipped on first-run projects with no prior sync state.

---

### 0.3.0 — 2026-03-27

#### Added
- **Claude slash commands**: skills are now written to `.claude/commands/*.md` in addition to `CLAUDE.md`, enabling native slash command access in Claude Code.
- The `syntra-task` skill auto-creates both `.claude/commands/syntra-task.md` and `.claude/commands/task.md`, making both `/syntra-task` and `/task` available without extra configuration.

#### Changed
- Claude adapter output now includes both `CLAUDE.md` (full context file) and `.claude/commands/` (skills as slash commands).

---

### 0.2.9 — 2026-03-27

#### Added
- `syntra sync --tasks-only` to refresh active task artifacts without regenerating non-task adapter artifacts.

#### Changed
- Task sync now covers all adapters:
  - **Copilot**: active tasks synced to `.github/prompts/*.prompt.md`
  - **Claude**: active tasks included in `.claude/CLAUDE.md` under a managed `## Active Tasks` section
  - **Cursor**: active tasks synced to `.cursor/rules/*.mdc`

#### Notes
- In `--tasks-only` mode, Claude updates its managed task block in place when available and falls back to full `CLAUDE.md` generation when no managed block is present.

---

### 0.2.8 — 2026-03-27

#### Added
- `syntra init` now automatically creates `ai/skills/syntra-task.skill.md` based on the LLM adapter selected — no separate `syntra add skill syntra-task` step required.
- Skills are now included in adapter sync for all three targets:
  - **Copilot**: skills synced as `.github/prompts/*.prompt.md`
  - **Claude**: skills included in `.claude/CLAUDE.md` under a `## Skills` section
  - **Cursor**: skills synced as `.cursor/rules/*.mdc`

#### Changed
- `syntra init` workflow simplified: initializing a project now produces ready-to-use task commands for the chosen AI tool (`/task` preferred, `/syntra-task` alias) without manual configuration.

---

### 0.2.7 — 2026-03-27

#### Fixed
- Resolved a template parsing failure during `syntra init` caused by malformed Handlebars block closures in the `architecture` instruction template.
- `next.js` TypeScript projects now initialize successfully with all instruction templates selected.

#### Quality
- Added a regression test that renders all registered templates and fails on Handlebars parser errors (`tests/templates/render.test.ts`).
