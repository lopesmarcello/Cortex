# Syntra CLI

Syntra is a CLI that scaffolds, manages, validates, and syncs an AI-assisted development framework across tools like GitHub Copilot, Claude Code, and Cursor.

Core principle: **`ai/` is the source of truth**. Adapter folders (`.github/`, `.claude/`, `.cursor/`) are generated artifacts.

---

## What's New

### 0.2.9

- Added `syntra sync --tasks-only` to refresh active task adapter artifacts without regenerating instruction/agent/skill artifacts where supported.
- Task sync is now included across all adapters:
	- Copilot tasks -> `.github/prompts/*.prompt.md`
	- Claude tasks -> `## Active Tasks` section in `.claude/CLAUDE.md`
	- Cursor tasks -> `.cursor/rules/*.mdc`

### 0.2.8

- `syntra init` now auto-creates `ai/skills/syntra-task.skill.md` based on the LLM adapter you select — no manual step needed.
- Skills are now included in adapter sync for all targets: Copilot (`.github/prompts/`), Claude (`.claude/CLAUDE.md`), Cursor (`.cursor/rules/`).
- Workflow simplified: `npx syntra init` is now sufficient to get task creation commands ready in your AI tool (`/task` preferred, `/syntra-task` alias).

### 0.2.7

- Fixed `syntra init` template rendering failure caused by malformed Handlebars block closures in the architecture template.
- Added regression coverage to render all registered templates and fail fast on parser issues (`tests/templates/render.test.ts`).
- Added built-in **`syntra-task`** skill template to scaffold a `/task {brief}` workflow (with `/syntra-task` alias) for creating valid Syntra task files.

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

```text
project-root/
├── ai/
│   ├── config.yml
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
├── .claude/
└── .cursor/
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

Example:

```text
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

Generates tool-specific adapter files from canonical `ai/` files.

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

- Copilot: `.github/copilot-instructions.md`, `.github/agents/*.md`, `.github/prompts/*.prompt.md` (tasks + skills)
- Claude: `.claude/CLAUDE.md` (instructions, agents, skills, and active tasks)
- Cursor: `.cursor/rules/*.mdc` (instructions, agents, skills, and active tasks)

---

## `syntra validate`

Validates framework correctness and sync state.

Checks include:

- `ai/config.yml` schema basics
- instruction naming/format
- agent references to instructions
- task structure and references (requires `Context`, `References`, `Dependencies`, `Steps`, `Acceptance Criteria`, `Notes`)
- sync freshness/manual edit risk signals

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

Saved templates are currently stored in:

```text
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
# then execute the generated task id (e.g. /TASK-001)

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

## Status and Roadmap

Implemented:

- Phase 1 (init/add/done + templates + config)
- Phase 2 (adapter sync)
- Phase 3 core (validate + template save/list)
- Built-in `syntra-task` skill, auto-created on `syntra init`
- Skills included in adapter sync (Copilot prompts, Claude context, Cursor rules)
- Template render regression test coverage for parser safety

Planned next enhancements include additional template workflows and richer validation/polish.
