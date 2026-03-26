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