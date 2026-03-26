export const architectureTemplate = `# Architecture Instructions

## Project Overview
{{#if-includes projectProfile.language 'typescript'}}
This is a **{{projectProfile.framework}}** project written in **TypeScript**.
{{else}}
This is a **{{projectProfile.framework}}** project written in **{{projectProfile.language}}**.
{{/if-includes}}
{{#if projectProfile.monorepo}}
This is a **monorepo** managed with {{projectProfile.monorepoTool}}.
{{/if}}

## Language Standards
{{#if-includes projectProfile.language 'typescript'}}
- TypeScript with strict mode enabled
- No \`any\` types unless justified with a \`// TODO: type properly\` comment
- All public APIs, function parameters, and return types must be explicitly typed
- Use \`interface\` for object shapes, \`type\` for unions/intersections
- Prefer \`unknown\` over \`any\` when the type is genuinely not known
- Enums: prefer \`as const\` objects over TypeScript enums
{{else if-includes projectProfile.language 'javascript'}}
- Modern JavaScript (ES2020+)
- JSDoc type annotations on all exported functions
- Use optional chaining and nullish coalescing over manual checks
{{else if-includes projectProfile.language 'python'}}
- Python 3.10+
- Type hints required on all function signatures
- Google-style docstrings on all public functions and classes
- Use dataclasses or Pydantic models for structured data
{{/if-includes}}

## Project Structure
<!-- UPDATE THIS to match your actual project structure -->
{{#if-includes projectProfile.framework 'next'}}
\`\`\`
src/
├── app/              # App Router pages and layouts
├── components/       # Reusable UI components
│   ├── ui/           # Base/primitive components
│   └── features/     # Feature-specific components
├── lib/              # Shared utilities, helpers, constants
├── hooks/            # Custom React hooks
├── services/         # API calls and external service integrations
├── types/            # Shared TypeScript types and interfaces
└── styles/           # Global styles and theme
\`\`\`
{{else if-includes projectProfile.framework 'react'}}
\`\`\`
src/
├── components/       # Reusable UI components
│   ├── ui/           # Base/primitive components
│   └── features/     # Feature-specific components
├── pages/            # Page-level components / routes
├── hooks/            # Custom React hooks
├── services/         # API calls and external integrations
├── utils/            # Pure utility functions
├── types/            # Shared TypeScript types
└── styles/           # Global styles and theme
\`\`\`
{{else if-includes projectProfile.framework 'nest'}}
\`\`\`
src/
├── modules/          # Feature modules (one folder per domain)
│   └── {feature}/
│       ├── {feature}.controller.ts
│       ├── {feature}.service.ts
│       ├── {feature}.module.ts
│       ├── dto/
│       └── entities/
├── common/           # Shared decorators, guards, pipes, filters
├── config/           # Configuration files
└── database/         # Database config and migrations
\`\`\`
{{else}}
\`\`\`
{{projectName}}/
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
└── README.md
\`\`\`
{{/else}}

## Module Organization
- **Single Responsibility**: Each file/module has one clear purpose
- **No circular dependencies**: If A imports B, B must not import A (directly or indirectly)
- **Explicit exports**: Only export what other modules need; keep internals private
- **Co-location**: Keep related files together (component + test + styles + types)

## Naming Conventions
{{#if-includes projectProfile.language 'typescript'}}
- **Files**: camelCase for utilities (\`dateUtils.ts\`), PascalCase for components (\`DatePicker.tsx\`)
- **Variables/Functions**: camelCase (\`getUserById\`)
- **Types/Interfaces/Classes**: PascalCase (\`UserProfile\`)
- **Constants**: UPPER_SNAKE_CASE for true constants (\`MAX_RETRY_COUNT\`), camelCase for config objects
- **Booleans**: prefix with \`is\`, \`has\`, \`should\`, \`can\` (\`isLoading\`, \`hasPermission\`)
{{else if-includes projectProfile.language 'python'}}
- **Files/Modules**: snake_case (\`date_utils.py\`)
- **Functions/Variables**: snake_case (\`get_user_by_id\`)
- **Classes**: PascalCase (\`UserProfile\`)
- **Constants**: UPPER_SNAKE_CASE (\`MAX_RETRY_COUNT\`)
- **Private**: prefix with underscore (\`_internal_method\`)
{{/if-includes}}

## Import Order
{{#if-includes projectProfile.language 'typescript'}}
1. External libraries (\`react\`, \`next\`, third-party)
2. Internal aliases (\`@/lib\`, \`@/components\`, \`@/services\`)
3. Relative imports from parent directories (\`../\`)
4. Relative imports from same directory (\`./\`)
5. Type-only imports last (\`import type { ... }\`)

Separate each group with a blank line.
{{else if-includes projectProfile.language 'python'}}
1. Standard library
2. Third-party packages
3. Local application imports

Separate each group with a blank line (enforced by isort).
{{/if-includes}}

## Error Handling
{{#if-includes projectProfile.framework 'next'}}
- Use error boundaries for UI error recovery
- API routes: return consistent error shapes \`{ error: string, code: string }\`
- Never swallow errors silently; always log or re-throw
- Use custom error classes for domain-specific errors
{{else if-includes projectProfile.framework 'nest'}}
- Use NestJS exception filters for HTTP error responses
- Throw typed exceptions (\`NotFoundException\`, \`BadRequestException\`)
- Wrap external service calls in try/catch with meaningful error context
{{else}}
- Never swallow errors silently; always log or re-throw
- Use custom error classes for domain-specific errors
- External calls: wrap in try/catch with meaningful context
{{/else}}

## Dependencies
- Do not install new dependencies without explicit approval
- Prefer well-maintained packages with active communities
- Check bundle size impact before adding frontend dependencies
- Document why each non-obvious dependency exists

## AI Agent Boundaries
- **Do NOT** create new folders outside the existing structure
- **Do NOT** install or suggest new dependencies without asking
- **Do NOT** refactor unrelated code when completing a task
- **Do NOT** change configuration files (tsconfig, eslint, etc.) unless the task requires it
- **DO** follow existing patterns in the codebase even if you'd do it differently
- **DO** ask for clarification if a task conflicts with these instructions
`;