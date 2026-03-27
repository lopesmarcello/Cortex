export const taskTemplate = `# {{taskId}}: {{description}}

## Context
<!-- What this task is about, why it's needed, and how it fits into the larger feature -->

## References
- **Agent**: [{{agent}}](../agents/{{agent}}.agent.md)
- **Instructions**:
{{#each instructions}}
  - [{{this}}](../instructions/{{this}}.instructions.md)
{{/each}}

## Dependencies
{{#if dependencies}}
{{#each dependencies}}
- {{this}} must be completed first
{{/each}}
{{else}}
None
{{/if}}

## Steps
{{#each steps}}
{{math @index 1}}. [ ] {{this}}
{{/each}}

## Acceptance Criteria
{{#each acceptanceCriteria}}
- [ ] {{this}}
{{/each}}

## Notes
<!-- Decisions, trade-offs, or additional context discovered during implementation -->

`;

export const skillTemplate = `# {{skillName}}

## Purpose
<!-- One sentence: what this skill does -->

## When to Use
<!-- Describe the trigger conditions — when should an agent invoke this skill? -->
<!-- Example: "Use when the task requires creating a new API endpoint" -->

## Inputs
<!-- What information does the agent need before using this skill? -->
<!-- Example: "- Endpoint path and HTTP method" -->
<!-- Example: "- Request/response types" -->

## Process
<!-- Step-by-step instructions the agent should follow -->
<!-- 1. First step -->
<!-- 2. Second step -->
<!-- 3. etc. -->

## Output
<!-- What should the agent produce when this skill is complete? -->
<!-- Example: "A route handler file, DTO types, and corresponding test file" -->

## Constraints
<!-- Rules or limitations when applying this skill -->
<!-- Example: "Always validate request body with Zod schema" -->
<!-- Example: "Never create a new module — add to existing feature module" -->

## Examples
<!-- Show a concrete before/after or input/output example -->

`;

export const syntraTaskSkillTemplate = `---
name: syntra-task
description: "Create a Syntra task from a brief description by asking clarifying questions and producing a valid task file. Trigger: /syntra-task {brief}."
user-invocable: true
---

# Syntra Task Skill

Create a fully structured Syntra task file from a short user brief.

---

## Trigger

Use this skill when the user runs:


\`/syntra-task {brief description}\`

Example:

\`/syntra-task add role-based authorization checks to project routes\`

---

## The Job

1. Parse the brief description from the command input
2. Read Syntra task rules from project files (ai/config.yml, task conventions, instructions, and agents)
3. Ask 3-5 essential clarifying questions using lettered options
4. Generate one task file using the Syntra Task model
5. Save the task in the configured active task directory

Important: Do NOT implement code. Only create the task file.

---

## Step 1: Gather Required Context

Before creating the task, inspect:

- ai/config.yml for:
  - tasks.idPrefix
  - tasks.activeDir
  - tasks.doneDir
- ai/instructions/*.instructions.md to pick relevant instructions
- ai/agents/*.agent.md to choose the best execution agent (default: code-generator)

If any required config is missing, use defaults:

- idPrefix: TASK-
- activeDir: active

---

## Step 2: Ask Clarifying Questions

Ask only what is needed to remove ambiguity. Keep it to 3-5 questions with lettered options so users can reply quickly (example: 1B, 2A, 3D).

Focus on:

- Scope boundaries
- Impacted area/module
- Definition of done
- Testing expectations
- Dependencies or ordering constraints

Question format:

1. What is the intended scope for this task?
  A. Minimal change (single focused update)
  B. Medium scope (multiple related files)
  C. Broad scope (cross-module changes)
  D. Other: [please specify]

2. Which area is primarily affected?
  A. UI/frontend
  B. Backend/API
  C. Data/model layer
  D. Tooling/CI/dev-experience

3. What level of testing is required?
  A. Unit tests only
  B. Integration tests
  C. Unit + integration
  D. Follow existing test coverage only

---

## Step 3: Build Task Content Using Syntra Task Model

Create exactly one task file matching this structure:

\`\`\`markdown
# [TASK-ID]: [Short descriptive title]

## Context
[2-4 clear sentences: what, why, expected outcome]

## References
- **Agent**: [agent-name](../agents/agent-name.agent.md)
- **Instructions**:
  - [instruction-1](../instructions/instruction-1.instructions.md)
  - [instruction-2](../instructions/instruction-2.instructions.md)

## Dependencies
[Either "None" or explicit prerequisite tasks]

## Steps
1. [ ] Concrete implementation step
2. [ ] Concrete implementation step
3. [ ] Concrete implementation step

## Acceptance Criteria
- [ ] Verifiable outcome criterion
- [ ] Edge-case or behavior criterion
- [ ] Relevant tests added/updated and passing

## Notes
[Optional constraints, trade-offs, or sequencing notes]
\`\`\`

Rules:

- Task ID must use configured prefix and next available number when possible
- Steps must be specific, ordered, and reviewable
- Acceptance criteria must be objectively verifiable
- Do not include unrelated refactors or extra scope

---

## Step 4: Save Location and Naming

Save task file to:

- ai/tasks/{activeDir}/{taskId}.task.md

Where activeDir and taskId come from project config and generated ID.

---

## Output to User

After saving, return:

- Created task ID
- File path
- 1-2 sentence summary of task intent
- Any open assumptions requiring confirmation

`;