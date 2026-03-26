export const styleTemplate = `# Code Style Instructions

## Formatting
{{#if-includes projectProfile.language 'typescript'}}
- **Indentation**: 2 spaces
- **Line length**: 100 characters max
- **Semicolons**: Required
- **Quotes**: Single quotes for strings, double quotes in JSX
- **Trailing commas**: Always in multi-line structures
- **Braces**: Same-line opening brace, always use braces for conditionals (no one-liners)
- **Parentheses**: Omit around single arrow function parameters
{{else if-includes projectProfile.language 'python'}}
- **Indentation**: 4 spaces
- **Line length**: 88 characters (Black formatter default)
- **Quotes**: Double quotes for strings (Black convention)
- **Trailing commas**: Always in multi-line structures
- **Formatter**: Black, enforced via pre-commit
- **Linter**: Ruff
{{/if-includes}}

## Comments
- Explain **why**, not **what** — the code should be readable on its own
- \`// TODO: description (TICKET-ID)\` for known technical debt
- \`// HACK: explanation\` for intentional workarounds that should be revisited
- No commented-out code in committed files — use version control
- No redundant comments like \`// increment counter\` above \`counter++\`
{{#if-includes projectProfile.language 'typescript'}}

### JSDoc
- Required on all exported functions, types, and interfaces
- Not needed on internal/private functions unless logic is complex
- Include \`@param\`, \`@returns\`, and \`@throws\` when applicable
- Use \`@example\` for non-obvious utility functions
{{else if-includes projectProfile.language 'python'}}

### Docstrings
- Required on all public functions, classes, and modules
- Google-style format
- Include Args, Returns, and Raises sections
- Use \`Examples\` section for non-obvious utilities
{{/if-includes}}

## Function Shape
- **Max length**: ~40 lines — if longer, extract helper functions
- **Max parameters**: 3 positional; use an options/config object beyond that
- **Early returns**: Prefer guard clauses over nested conditionals
- **Pure functions**: Prefer pure functions where possible; isolate side effects
{{#if-includes projectProfile.language 'typescript'}}
- **Arrow vs function**: Arrow for callbacks and short utilities, \`function\` for top-level declarations
- **Async**: Always \`async/await\` over raw Promises; never mix \`.then()\` and \`await\`
{{/if-includes}}

{{#if-includes projectProfile.framework 'react'}}
## React Patterns
- **Functional components only** — no class components
- **Named exports** for components (\`export function Button\`, not \`export default\`)
- **Props**: Destructure in the function signature, define a \`Props\` type above the component
- **Hooks**: Extract custom hooks when logic is reused or a component grows complex
- **State**: Keep state as close to where it's used as possible; lift only when needed
- **Effects**: Minimize \`useEffect\` — prefer derived state, event handlers, or server-side data fetching
- **Conditional rendering**: Use early returns for loading/error states, ternaries for simple toggles
- **Event handlers**: Name with \`handle\` prefix (\`handleSubmit\`, \`handleClick\`)
- **Keys**: Never use array index as key for dynamic lists

### Component File Structure
\`\`\`tsx
// 1. Type definitions
type Props = { ... }

// 2. Component
export function MyComponent({ prop1, prop2 }: Props) {
  // 3. Hooks (state, refs, custom hooks)
  // 4. Derived values
  // 5. Event handlers
  // 6. Effects (last resort)
  // 7. Early returns (loading, error)
  // 8. Main render
}
\`\`\`
{{/if-includes}}

{{#if-includes projectProfile.framework 'next'}}
## Next.js Patterns
- **Server Components** by default — only add \`'use client'\` when you need interactivity or browser APIs
- **Data fetching**: Fetch in Server Components or Route Handlers, not in \`useEffect\`
- **Server Actions**: Use for mutations (forms, updates, deletes)
- **Route Handlers**: Use for external API integrations or when you need fine control over the response
- **Metadata**: Export \`metadata\` or \`generateMetadata\` from page/layout files
- **Loading/Error states**: Use \`loading.tsx\` and \`error.tsx\` conventions
{{/if-includes}}

{{#if-includes projectProfile.framework 'nest'}}
## NestJS Patterns
- **One module per domain/feature** — avoid god modules
- **DTOs**: Use class-validator decorators for request validation
- **Services**: Business logic lives here, not in controllers
- **Controllers**: Thin — validate input, call service, return response
- **Repository pattern**: Abstract database access behind repository classes
- **Dependency injection**: Always inject via constructor, never import services directly
{{/if-includes}}

## Linting & Formatting Tools
{{#if-includes projectProfile.language 'typescript'}}
<!-- UPDATE: Reference your actual config files -->
- **ESLint**: Enforces code quality rules — see \`.eslintrc\`
- **Prettier**: Enforces formatting — see \`.prettierrc\`
- AI-generated code must pass both without modifications
{{else if-includes projectProfile.language 'python'}}
- **Ruff**: Linting and import sorting
- **Black**: Code formatting
- AI-generated code must pass both without modifications
{{/if-includes}}

## What AI Must Follow
- Match the style of surrounding code, even if it differs from these guidelines
- When in doubt, look at existing files in the same directory for patterns
- Never reformat existing code unless the task explicitly asks for it
`;
