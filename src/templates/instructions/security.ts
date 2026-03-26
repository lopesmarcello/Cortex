export const securityTemplate = `# Security Instructions

## Environment Variables
- **No secrets in code**: All secrets must be in \`.env\` (commit \`.env.example\` without values)
- **No logging secrets**: Never log API keys, tokens, or passwords
- **Rotation**: Change secrets regularly and when team members leave

## Dependencies
- **Audit**: Run \`npm audit\` and \`npm audit fix\` regularly
- **Updates**: Keep dependencies up-to-date
- **Security advisories**: Address immediately

## Input Validation
- **Validate all inputs**: Never trust user input
- **Sanitize for context**: Sanitize for HTML/SQL/Command context appropriately
- **Whitelist approach**: Validate against known good patterns

## Authentication & Authorization
- **Never store passwords**: Use cryptographic hashing (bcrypt, argon2)
- **Session security**: Use secure session management
- **Token expiry**: Implement token expiration
- **RBAC**: Implement role-based access control

## API Security
- **Rate limiting**: Implement to prevent abuse
- **CORS**: Configure properly, don't use wildcard in production
- **HTTPS/TLS**: Always required in production
- **API versioning**: Support versioning for backward compatibility

## Data Protection
- **Encryption at rest**: Encrypt sensitive data in databases
- **Encryption in transit**: Use HTTPS/TLS
- **PII handling**: Comply with GDPR, CCPA, and local regulations
- **Data retention**: Delete data when no longer needed

## Code Security
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Escape output, use Content Security Policy
- **CSRF Protection**: Use CSRF tokens
- **Dependency scanning**: Regular dependency audits

`;
