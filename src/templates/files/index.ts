export const taskTemplate = `# {{taskId}}: {{description}}

## Context
<!-- What this task is about and why it's important -->

## References
{{#each instructions}}
- [{{this}}.instructions.md](../instructions/{{this}}.instructions.md)
{{/each}}
- [{{agent}}.agent.md](../agents/{{agent}}.agent.md)

## Steps
{{#each steps}}
{{ @index }. [ ] {{this}}
{{/each}}

## Acceptance Criteria
{{#each acceptanceCriteria}}
- [ ] {{this}}
{{/each}}

## Status
- [ ] In progress
- [ ] Human review
- [ ] Done

## Notes
<!-- Add any notes, decisions, or context here -->

`;

export const skillTemplate = `# {{skillName}}

## Purpose
<!-- What this skill does and when to use it -->

## Usage
\`\`\`
How to invoke or use this skill
\`\`\`

## Details
<!-- Detailed information about this skill -->

## Examples
<!-- Practical examples of using this skill -->

## Related Skills
<!-- Links to related skills -->

`;
