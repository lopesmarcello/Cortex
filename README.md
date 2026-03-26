# Cortex CLI

`cortex` is a CLI that scaffolds, manages, validates, and syncs an AI-assisted development framework across tools like GitHub Copilot, Claude Code, and Cursor.

Core principle: **`ai/` is the source of truth**. Adapter folders (`.github/`, `.claude/`, `.cursor/`) are generated artifacts.

---

## Install

### Run with npx

```bash
npx cortex init
```

### Global install

```bash
npm i -g cortex
cortex --help
```

### Local development usage

```bash
npm run build
node dist/index.js --help
```

---

## Canonical Structure

After `cortex init`, the framework is structured like this:

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

You edit files in `ai/`, then run `cortex sync` to regenerate adapters.

---

## Commands

## `cortex init`

Interactive setup:

- Scans project language/framework/package manager/CI
- Prompts for instruction templates and agents
- Prompts for adapter targets
- Creates `ai/` structure and config
- Runs initial adapter sync

```bash
cortex init
```

---

## `cortex add <type> [name]`

Adds framework files from templates.

Supported types:

- `instruction`
- `agent`
- `task` (interactive)
- `skill`

Examples:

```bash
cortex add instruction microfrontends
cortex add agent bug-fixer
cortex add task
cortex add skill api-pagination
```

If `sync.autoSync: true` in `ai/config.yml`, add operations trigger silent adapter sync.

---

## `cortex done <taskId>`

Moves a task from active to done:

```bash
cortex done TASK-001
```

---

## `cortex sync`

Generates tool-specific adapter files from canonical `ai/` files.

```bash
cortex sync
```

Target-specific sync:

```bash
cortex sync --copilot
cortex sync --claude
cortex sync --cursor
```

What gets generated:

- Copilot: `.github/copilot-instructions.md` and `.github/agents/*.md`
- Claude: `.claude/CLAUDE.md`
- Cursor: `.cursor/rules/*.mdc`

---

## `cortex validate`

Validates framework correctness and sync state.

Checks include:

- `ai/config.yml` schema basics
- instruction naming/format
- agent references to instructions
- task structure and references
- sync freshness/manual edit risk signals

```bash
cortex validate
```

Exit behavior:

- exits with non-zero when errors are found
- warnings do not fail the process

---

## `cortex template`

Save and list reusable templates.

```bash
cortex template save my-team-template
cortex template list
```

Saved templates are stored in:

```text
~/.ai-fw/templates/
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
cortex init

# 2) Customize instructions
$EDITOR ai/instructions/architecture.instructions.md

# 3) Add a task
cortex add task

# 4) Sync adapters
cortex sync

# 5) Execute task with your coding agent
# e.g. /TASK-001

# 6) Mark done
cortex done TASK-001

# 7) Validate setup
cortex validate
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
