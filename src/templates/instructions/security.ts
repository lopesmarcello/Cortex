export const securityTemplate = `# Security Instructions

## Secrets & Environment Variables
- **Never hardcode** secrets, API keys, tokens, passwords, or connection strings
- All secrets go in \`.env\` — commit only \`.env.example\` with empty values
- Access via \`process.env.VARIABLE_NAME\` (never import .env files directly)
- Never log, serialize, or include secrets in error messages or stack traces
- Never commit \`.env\` — verify it's in \`.gitignore\`

{{#if-includes projectProfile.language 'typescript'}}
\`\`\`typescript
// ❌ NEVER
const apiKey = 'sk-1234567890abcdef';
console.log('Auth failed for token:', token);

// ✅ ALWAYS
const apiKey = process.env.API_KEY;
console.log('Auth failed for user:', userId); // log identifier, not secret
\`\`\`
{{/if-includes}}

## Input Validation
{{#if-includes projectProfile.language 'typescript'}}
- Validate **all** external input at the boundary (API routes, form handlers, URL params)
- Use a validation library (Zod, Yup, class-validator) — never hand-roll validation for complex shapes
- Whitelist allowed values rather than blacklisting dangerous ones
- Validate types, ranges, lengths, and formats
- Reject unexpected fields — don't pass raw request bodies to business logic

\`\`\`typescript
// ❌ NEVER — trusting raw input
app.post('/users', (req, res) => {
  db.insert('users', req.body); // anything could be in body
});

// ✅ ALWAYS — validate and extract
const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
});

app.post('/users', (req, res) => {
  const data = CreateUserSchema.parse(req.body);
  db.insert('users', data); // only validated fields
});
\`\`\`
{{else if-includes projectProfile.language 'python'}}
- Validate all external input at the boundary (API endpoints, CLI args, file uploads)
- Use Pydantic models for request validation
- Whitelist allowed values rather than blacklisting dangerous ones
- Reject unexpected fields — use Pydantic's \`model_config = ConfigDict(extra='forbid')\`
{{/if-includes}}

## Output Encoding
{{#if-includes projectProfile.framework 'react'}}
- React auto-escapes JSX expressions — **never** bypass with \`dangerouslySetInnerHTML\`
- If \`dangerouslySetInnerHTML\` is absolutely required, sanitize with DOMPurify first
- Never construct HTML strings from user input
{{else if-includes projectProfile.framework 'next'}}
- React auto-escapes JSX — **never** use \`dangerouslySetInnerHTML\` without DOMPurify
- Server Components: be careful with user data in meta tags and headers
- Route Handlers: set appropriate Content-Type headers
{{/if-includes}}
- URLs: validate and whitelist protocols (\`https:\`, \`mailto:\`) — never allow \`javascript:\`
- Never interpolate user input into \`eval()\`, \`new Function()\`, or template literals executed as code

## Database Queries
{{#if-includes projectProfile.language 'typescript'}}
- **Always** use parameterized queries or an ORM — never string concatenation
\`\`\`typescript
// ❌ NEVER — SQL injection
const query = \\\`SELECT * FROM users WHERE id = '\${userId}'\\\`;

// ✅ ALWAYS — parameterized
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
// ✅ ALWAYS — ORM
const user = await userRepository.findById(userId);
\`\`\`
{{else if-includes projectProfile.language 'python'}}
- Always use parameterized queries or ORM methods — never f-strings in SQL
\`\`\`python
# ❌ NEVER
cursor.execute(f"SELECT * FROM users WHERE id = '{user_id}'")

# ✅ ALWAYS
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
\`\`\`
{{/if-includes}}

## Authentication Patterns
- Never implement custom crypto or hashing — use established libraries
{{#if-includes projectProfile.language 'typescript'}}
- Passwords: bcrypt or argon2 only — never MD5, SHA-1, or SHA-256 for passwords
- Tokens: use short-lived JWTs or session tokens — never store in localStorage (use httpOnly cookies)
- Compare secrets with timing-safe functions (\`crypto.timingSafeEqual\`)
{{else if-includes projectProfile.language 'python'}}
- Passwords: bcrypt or argon2 via \`passlib\` — never hashlib for passwords
- Compare secrets with \`hmac.compare_digest\` (timing-safe)
{{/if-includes}}

## Sensitive Data in Code
- Never log PII (emails, names, addresses, IPs) at INFO level — DEBUG only
- Never include sensitive data in error messages returned to clients
- Mask sensitive fields in logs: \`email: j***@example.com\`
- Never commit test data with real user information

## Dependency Security
- Do not add dependencies from unknown or unmaintained packages
- Prefer packages with >1000 weekly downloads and recent activity
- If a task requires a new dependency that handles security-critical logic (auth, crypto, sanitization), flag it for human review

## AI Agent Rules
- When writing any endpoint or form handler, **always** include input validation
- When adding a new environment variable, **always** add it to \`.env.example\`
- When handling user input that will be displayed, verify output encoding is handled
- When writing database queries, **always** use parameterized queries
- Never generate code that disables security features (CORS wildcards, SSL verification off, CSRF disabled) even for "testing purposes"
- If a task requires handling secrets or auth, flag it for human review
`;