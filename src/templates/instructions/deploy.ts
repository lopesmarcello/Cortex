export const deployTemplate = `# Deployment & CI/CD Instructions

## Branch Strategy
<!-- UPDATE to match your team's workflow -->
- **main**: Production — protected, requires PR with approvals
- **develop**: Integration branch — auto-deploys to staging
- **Feature branches**: \`feature/TICKET-ID-short-description\`
- **Bugfix branches**: \`fix/TICKET-ID-short-description\`

## Commit Conventions
Use Conventional Commits format:
\`\`\`
type(scope): short description

feat(auth): add password reset flow
fix(datepicker): handle invalid date strings
refactor(utils): extract date formatting helpers
test(dateUtils): add edge case coverage for isDateAfterToday
chore(deps): update React to 19.1
\`\`\`

**Types**: feat, fix, refactor, test, chore, docs, style, perf, ci
**Scope**: The module or feature area affected

## CI Pipeline
{{#if-includes projectProfile.cicd 'github-actions'}}
GitHub Actions runs on every PR. Your code must pass all checks before merge:

1. **Lint** — ESLint / Ruff must pass with zero errors
2. **Type check** — \`tsc --noEmit\` must pass (TypeScript projects)
3. **Unit tests** — All tests pass, coverage threshold met
4. **Build** — Production build completes without errors
{{else}}
<!-- UPDATE: Describe your CI pipeline checks here -->
CI runs on every PR. Your code must pass all checks before merge.
{{/if-includes}}

## Environment Constraints
{{#if-includes projectProfile.framework 'next'}}
- **Edge Runtime**: Some routes may use Edge Runtime — no Node.js APIs (\`fs\`, \`path\`, etc.)
- **Server Components**: Cannot use browser APIs (\`window\`, \`document\`, \`localStorage\`)
- **Serverless Functions**: Default timeout varies by provider — keep API routes fast
- **Bundle size**: Monitor with \`next build\` output — flag significant increases
{{else if-includes projectProfile.framework 'react'}}
- **Bundle size**: Be mindful of imports — use tree-shakeable imports where possible
- **Browser support**: Check \`browserslist\` config before using newer APIs
{{else if-includes projectProfile.framework 'nest'}}
- **Memory**: Be aware of container memory limits — avoid loading large datasets into memory
- **Startup time**: Keep module initialization lean for container scaling
{{else if-includes projectProfile.language 'python'}}
- **Python version**: Match the version specified in \`pyproject.toml\` or \`Dockerfile\`
- **System dependencies**: If your code needs a system package, document it in the Dockerfile
{{/if-includes}}

## Environment Variables
- All environments (dev, staging, prod) use the same variable names with different values
- See \`.env.example\` for the complete list
- When adding a new env variable:
  1. Add it to \`.env.example\` with a descriptive comment
  2. Add it to the CI/CD secrets configuration
  3. Document what it's for and what format it expects

## Build & Output
{{#if-includes projectProfile.language 'typescript'}}
\`\`\`bash
npm run build          # Production build
npm run lint           # Lint check
npm run type-check     # TypeScript check (if separate from build)
npm test               # Run tests
\`\`\`
{{else if-includes projectProfile.language 'python'}}
\`\`\`bash
ruff check .           # Lint
mypy .                 # Type check
pytest                 # Run tests
\`\`\`
{{/if-includes}}

## AI Agent Rules
- Always follow the commit convention format above
- When creating a PR description, summarize what changed and why
- If your changes add a new env variable, update \`.env.example\`
- If your changes affect the build pipeline, flag for human review
- Never modify CI/CD workflow files unless the task explicitly requires it
- Never modify Dockerfiles or infrastructure config unless explicitly asked
`;