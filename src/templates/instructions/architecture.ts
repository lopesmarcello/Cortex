export const architectureTemplate = `# Architecture Instructions

## Project Type
{{#if-includes projectProfile.language 'typescript'}}
This is a {{projectProfile.framework}} project written in TypeScript.
{{else}}
This is a {{projectProfile.framework}} project written in {{projectProfile.language}}.
{{/if-includes}}

## Language Standards
{{#if-includes projectProfile.language 'typescript'}}
- **Language**: TypeScript
- **Strict Mode**: Enabled
- **No \`any\` types**: Unless explicitly justified with a comment
- **Type Safety**: All public APIs must be fully typed
{{else if-includes projectProfile.language 'javascript'}}
- **Language**: JavaScript (Modern ES2020+)
- **JSDoc**: Use for documenting complex functions
{{else if-includes projectProfile.language 'python'}}
- **Language**: Python 3.8+
- **Type Hints**: Required for all functions and class methods
- **Docstrings**: Use Google-style docstrings
{{/if-includes}}

## Project Structure
<!-- Describe your project's folder structure and conventions -->

\`\`\`
{{projectName}}/
├── src/
├── tests/
├── docs/
└── README.md
\`\`\`

## Module Organization
- **Single Responsibility**: Each module has one clear purpose
- **Clear dependencies**: No circular dependencies
- **Exports**: Only export what's meant to be public

## Conventions
<!-- Document any custom conventions for this project -->

## Code Patterns
- **Error Handling**: [Describe your error handling strategy]
- **Logging**: [Describe logging conventions]
- **Configuration**: [Describe how configuration is managed]

`;
