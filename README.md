# Syntra CLI

Syntra is a CLI that scaffolds, manages, validates, and syncs an AI-assisted development framework across tools like GitHub Copilot, Claude Code, and Cursor.

Core principle: **`ai/` is the source of truth**. Adapter folders (`.github/`, `.claude/`, `.cursor/`) are generated artifacts.

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
- Prompts for adapter targets
- Creates `ai/` structure and config
- Runs initial adapter sync

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
syntra add task
syntra add skill api-pagination
```

If `sync.autoSync: true` in `ai/config.yml`, add operations trigger silent adapter sync.

---

## `syntra done <taskId>`

Moves a task from active to done:

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
```

What gets generated:

- Copilot: `.github/copilot-instructions.md` and `.github/agents/*.md`
- Claude: `.claude/CLAUDE.md`
- Cursor: `.cursor/rules/*.mdc`

---

## `syntra validate`

Validates framework correctness and sync state.

Checks include:

- `ai/config.yml` schema basics
- instruction naming/format
- agent references to instructions
- task structure and references
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

## Typical Workflow

```bash
# 1) Initialize
syntra init

# 2) Customize instructions
$EDITOR ai/instructions/architecture.instructions.md

# 3) Add a task
syntra add task

# 4) Sync adapters
syntra sync

# 5) Execute task with your coding agent
# e.g. /TASK-001

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

---

## Status and Roadmap

Implemented:

- Phase 1 (init/add/done + templates + config)
- Phase 2 (adapter sync)
- Phase 3 core (validate + template save/list)

Planned next enhancements include additional template workflows and richer validation/polish.
