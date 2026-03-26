export const styleTemplate = `# Code Style Instructions

## Naming Conventions
{{#if-includes projectProfile.language 'typescript'}}
- **Classes**: PascalCase (e.g., \`UserManager\`)
- **Functions/Methods**: camelCase (e.g., \`getUserById\`)
- **Constants**: UPPER_SNAKE_CASE (e.g., \`MAX_RETRIES\`)
- **Private members**: Prefix with underscore (e.g., \`_internalState\`)
- **Interfaces**: PascalCase, optionally prefix with I (e.g., \`IUserRepository\`)
{{else if-includes projectProfile.language 'python'}}
- **Classes**: PascalCase (e.g., \`UserManager\`)
- **Functions**: snake_case (e.g., \`get_user_by_id\`)
- **Constants**: UPPER_SNAKE_CASE (e.g., \`MAX_RETRIES\`)
- **Private members**: Prefix with underscore (e.g., \`_internal_state\`)
{{/if-includes}}

## Code Formatting
- **Line length**: 100 characters max
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: {{#if-includes projectProfile.language 'typescript'}}Required{{else}}As needed{{/if-includes}}
- **Quotes**: Single quotes for strings where possible
- **Trailing commas**: Always use in multi-line structures

## Comments
- **Comments should explain WHY, not WHAT**: Good code is self-documenting
- **TODO comments**: Use format \`// TODO: description with ticket ID if applicable\`
- **Documentation**: Use JSDoc/docstrings for public APIs

## Imports/Includes
- **Order**: External imports first, then internal imports, separated by blank line
- **Organization**: Alphabetically sorted within each group
- **Cleanup**: Remove unused imports

## Function Guidelines
- **Maximum length**: 50 lines (consider breaking into smaller functions)
- **Parameters**: Maximum 3-4 parameters (use object destructuring for more)
- **Return types**: Always specify for {{#if-includes projectProfile.language 'typescript'}}TypeScript{{else}}documented in docstring{{/if-includes}}

## Error Handling
- Use specific error types rather than generic \`Error\`
- Provide meaningful error messages with context
- Avoid silent failures or unhandled exceptions

`;
