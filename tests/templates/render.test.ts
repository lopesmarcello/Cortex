import { describe, it, expect } from 'vitest';
import { listTemplates, renderTemplate } from '../../src/templates/registry.js';
import type { ProjectProfile } from '../../src/utils/types.js';

describe('template rendering', () => {
    it('renders every registered template without parser errors', () => {
        const profile: ProjectProfile = {
            language: 'typescript',
            framework: 'next.js',
            packageManager: 'npm',
            monorepo: false,
            cicd: [],
            existingAi: {
                copilot: true,
                claude: false,
                cursor: false,
            },
        };

        const templateData = {
            projectProfile: profile,
            projectName: 'syntra-docs',
        };

        const templates = listTemplates();
        for (const template of templates) {
            expect(() => renderTemplate(template.name, templateData)).not.toThrow();
        }
    });
});
