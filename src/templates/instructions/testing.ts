export const testingTemplate = `# Testing Instructions

## Test Stack
{{#if-includes projectProfile.framework 'next'}}
- **Unit/Integration**: Vitest or Jest
- **Component Tests**: React Testing Library
- **E2E**: Playwright
{{else if-includes projectProfile.framework 'react'}}
- **Unit/Integration**: Vitest or Jest
- **Component Tests**: React Testing Library
- **E2E**: Playwright
{{else if-includes projectProfile.framework 'nest'}}
- **Unit/Integration**: Jest (NestJS default)
- **E2E**: Supertest
{{else if-includes projectProfile.language 'python'}}
- **Unit/Integration**: pytest
- **E2E**: pytest with httpx (FastAPI) or Django test client
{{else}}
- **Unit/Integration**: Jest or Vitest
{{/if-includes}}

## Test File Conventions
{{#if-includes projectProfile.language 'typescript'}}
- **Location**: Co-located with source — \`Button.tsx\` → \`Button.test.tsx\` in the same folder
- **File naming**: \`{filename}.test.ts\` or \`{filename}.test.tsx\`
- **Test data/fixtures**: \`__fixtures__/\` folder next to tests when shared across files
{{else if-includes projectProfile.language 'python'}}
- **Location**: \`tests/\` directory mirroring \`src/\` structure
- **File naming**: \`test_{filename}.py\`
- **Fixtures**: In \`conftest.py\` files at appropriate directory levels
{{/if-includes}}

## What to Test
- Business logic and utility functions — always
- Edge cases: empty inputs, null/undefined, boundary values, error states
- Integration points: API calls, database queries, external services
- User-facing behavior in components
- Error handling paths

## What NOT to Test
- Simple getters/setters with no logic
- Framework internals (don't test that React renders a div)
- Implementation details (don't test internal state, private methods)
- Third-party library behavior
- Type-only validations (TypeScript handles those)
- One-line wrappers that just delegate to another function

## Test Structure
{{#if-includes projectProfile.language 'typescript'}}
Follow the **Arrange → Act → Assert** pattern. One behavior per test.

\`\`\`typescript
describe('isDateAfterToday', () => {
  it('returns true when date is in the future', () => {
    // Arrange
    const futureDate = '2099-01-01';

    // Act
    const result = isDateAfterToday(futureDate);

    // Assert
    expect(result).toBe(true);
  });

  it('returns false for today', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    expect(isDateAfterToday(today)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isDateAfterToday('')).toBe(false);
  });

  it('returns false for invalid date', () => {
    expect(isDateAfterToday('not-a-date')).toBe(false);
  });
});
\`\`\`
{{else if-includes projectProfile.language 'python'}}
Follow the **Arrange → Act → Assert** pattern. One behavior per test.

\`\`\`python
class TestIsDateAfterToday:
    def test_returns_true_for_future_date(self):
        result = is_date_after_today("2099-01-01")
        assert result is True

    def test_returns_false_for_today(self):
        today = date.today().isoformat()
        assert is_date_after_today(today) is False

    def test_returns_false_for_empty_string(self):
        assert is_date_after_today("") is False
\`\`\`
{{/if-includes}}

## Naming Convention
- **describe block**: The function/component/module name
- **it/test block**: Describes the expected behavior starting with a verb
  - Good: \`it('returns false for invalid date')\`
  - Good: \`it('displays error message when submission fails')\`
  - Bad: \`it('test invalid date')\`
  - Bad: \`it('should work')\`

{{#if-includes projectProfile.framework 'react'}}
## React Component Testing
Use **React Testing Library**. Test what the user sees and does, not implementation details.

\`\`\`tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('displays validation error when email is empty', async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
\`\`\`

**Rules:**
- Query by role, label, or text — never by test ID unless no semantic option exists
- Use \`userEvent\` over \`fireEvent\` (simulates real user behavior)
- Never test component state directly (\`useState\` values)
- Never assert on CSS classes or DOM structure
- Mock API calls, not components
{{/if-includes}}

## Mocking
{{#if-includes projectProfile.language 'typescript'}}
- Mock at the **boundary**: API calls, database, file system, timers
- Never mock the function you're testing
- Use \`vi.fn()\` / \`jest.fn()\` for function mocks
- Use \`vi.spyOn()\` / \`jest.spyOn()\` when you need to preserve original behavior
- Reset mocks in \`beforeEach\` or use \`vi.restoreAllMocks()\`
- For dates/time: use \`vi.useFakeTimers()\` with a fixed date
{{else if-includes projectProfile.language 'python'}}
- Mock at the **boundary**: API calls, database, file system
- Use \`unittest.mock.patch\` or \`pytest-mock\`
- Mock where the function is imported, not where it's defined
- Use \`freezegun\` for date/time dependent tests
{{/if-includes}}

## Coverage
- Target: 80%+ line coverage overall
- Critical business logic: 100% branch coverage
- Don't write meaningless tests just to hit coverage numbers — uncovered simple code is better than poorly tested complex code

## AI Instructions for Writing Tests
- When creating a new function, always create the corresponding test file
- Write tests for the happy path first, then edge cases, then error cases
- If modifying an existing function, update its tests to cover the new behavior
- Run existing tests mentally before modifying them — don't break passing tests
- If a task doesn't mention tests, still write them for any new logic
`;