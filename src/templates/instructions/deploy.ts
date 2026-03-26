export const deployTemplate = `# Deployment Instructions

## Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code review approved
- [ ] Security audit passed
- [ ] Environment variables configured
- [ ] Documentation updated
- [ ] Version bumped (semantic versioning)

## Build Process
{{#if-includes projectProfile.language 'typescript'}}
\`\`\`bash
npm run build
# Check dist/ folder is generated correctly
\`\`\`
{{else if-includes projectProfile.language 'python'}}
\`\`\`bash
python -m pip install -e .
python -m pip install -r requirements-dev.txt
\`\`\`
{{/if-includes}}

## Deployment Environments
- **Development**: Automatic deployment on push to develop branch
- **Staging**: Automatic deployment on push to staging branch, requires approval
- **Production**: Manual deployment with approval from 2 team members

## Rollback Procedure
- **Quick rollback**: Revert to previous version tag
- **Database migrations**: Document rollback steps
- **Communication**: Notify team immediately
- **Post-mortem**: Document what went wrong

## Monitoring Post-Deployment
- **Health checks**: Verify endpoints responding
- **Error logs**: Monitor for new errors
- **Performance metrics**: Check latency and throughput
- **User reports**: Monitor for user-reported issues

## Deployment Tools
{{#if-includes projectProfile.cicd 'github-actions'}}
- **CI/CD**: GitHub Actions
- **Workflow**: See \`.github/workflows/deploy.yml\`
{{/if-includes}}

## Versioning
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Git tags**: Tag releases automatically
- **Changelog**: Maintain CHANGELOG.md

`;
