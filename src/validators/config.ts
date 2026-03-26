import { fsUtils } from '../utils/fs.js';
import { parse, stringify } from 'yaml';
import path from 'path';
import type { Config, ProjectProfile } from '../utils/types.js';
import type { ValidationIssue } from './instructions.js';

const DEFAULT_CONFIG: Config = {
    version: 1,
    project: {
        name: 'my-project',
        language: 'typescript',
        framework: 'react',
        packageManager: 'npm',
        monorepo: false,
    },
    adapters: {
        copilot: {
            enabled: true,
            instructionsMode: 'concatenated',
        },
        claude: {
            enabled: true,
            instructionsMode: 'concatenated',
        },
        cursor: {
            enabled: true,
            instructionsMode: 'individual',
        },
    },
    sync: {
        autoSync: false,
        warnManualEdits: true,
    },
    tasks: {
        idPrefix: 'TASK-',
        activeDir: 'active',
        doneDir: 'done',
    },
    language: 'en',
};

export function createConfig(
    projectName: string,
    profile: ProjectProfile,
    aiToolChoices?: { copilot?: boolean; claude?: boolean; cursor?: boolean }
): Config {
    return {
        ...DEFAULT_CONFIG,
        project: {
            name: projectName,
            language: profile.language,
            framework: profile.framework,
            packageManager: profile.packageManager,
            monorepo: profile.monorepo,
        },
        adapters: {
            copilot: {
                enabled: aiToolChoices?.copilot ?? true,
                instructionsMode: 'concatenated',
            },
            claude: {
                enabled: aiToolChoices?.claude ?? true,
                instructionsMode: 'concatenated',
            },
            cursor: {
                enabled: aiToolChoices?.cursor ?? true,
                instructionsMode: 'individual',
            },
        },
    };
}

export function loadConfig(rootPath: string): Config | null {
    const configPath = path.join(rootPath, 'ai', 'config.yml');
    if (!fsUtils.exists(configPath)) {
        return null;
    }

    try {
        const content = fsUtils.readFile(configPath);
        return parse(content) as Config;
    } catch (e) {
        throw new Error(`Failed to parse config: ${e}`);
    }
}

export function saveConfig(rootPath: string, config: Config): void {
    const configPath = path.join(rootPath, 'ai', 'config.yml');
    const yaml = stringify(config);
    fsUtils.writeFile(configPath, yaml);
}

export function getConfigPath(rootPath: string): string {
    return path.join(rootPath, 'ai', 'config.yml');
}

export function validateConfigSchema(config: Config | null): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!config) {
        issues.push({
            level: 'error',
            message: 'ai/config.yml is missing or invalid YAML.',
        });
        return issues;
    }

    if (typeof config.version !== 'number') {
        issues.push({ level: 'error', message: 'ai/config.yml: version must be a number.' });
    }

    if (!config.project?.name) {
        issues.push({ level: 'error', message: 'ai/config.yml: project.name is required.' });
    }

    if (!config.project?.language) {
        issues.push({ level: 'error', message: 'ai/config.yml: project.language is required.' });
    }

    if (!config.adapters) {
        issues.push({ level: 'error', message: 'ai/config.yml: adapters section is required.' });
    }

    if (!config.sync) {
        issues.push({ level: 'error', message: 'ai/config.yml: sync section is required.' });
    }

    if (!config.tasks) {
        issues.push({ level: 'error', message: 'ai/config.yml: tasks section is required.' });
    }

    return issues;
}
