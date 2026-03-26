export const testingTemplate = `# Testing Instructions

## Testing Framework
{{#if-includes projectProfile.framework 'next.js'}}
- **Unit Tests**: Jest (Next.js default)
- **Integration Tests**: Jest with Node environment
- **E2E Tests**: Playwright or Cypress recommended
{{else if-includes projectProfile.framework 'react'}}
- **Unit Tests**: Jest or Vitest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright or Cypress
{{else if-includes projectProfile.language 'python'}}
- **Unit Tests**: pytest
- **Integration Tests**: pytest with fixtures
- **E2E Tests**: pytest-selenium or similar
{{/if-includes}}

## Test Organization
- **Location**: \`tests/\` or \`__tests__/\` directory parallel to source
- **File naming**: \`*.test.ts\` or \`*.spec.ts\`
- **Structure**: One test file per source file

## Test Coverage Requirements
- **Minimum coverage**: 80% line coverage
- **Critical paths**: 100% coverage required
- **Coverage report**: Generated on every test run

## Unit Test Guidelines
- **Test naming**: Describe what the function does (e.g., \`describes what getUserById returns when user exists\`)
- **Arrange-Act-Assert**: Follow AAA pattern
- **One assertion per test**: When possible (or test one behavior)
- **Mocking**: Mock external dependencies, test business logic
- **Avoid flakiness**: No time-dependent tests, no random data

## Integration Test Guidelines
- **Test real interactions**: Database, APIs, file system
- **Setup/Teardown**: Clean state for each test
- **Test data**: Use fixtures or factories

## E2E Test Guidelines
- **User perspective**: Test user workflows, not implementation details
- **Stability**: Retry mechanisms for network/timing issues
- **Critical paths**: Focus on main user journeys

## Running Tests
\`\`\`bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage

# Specific test file
npm test -- tests/utils/date.test.ts
\`\`\`

`;
