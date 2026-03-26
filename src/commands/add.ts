import { fsUtils } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { prompt } from '../utils/prompt.js';
import { renderTemplate, listTemplates } from '../templates/registry.js';
import { loadConfig } from '../validators/config.js';
import { syncCommand } from './sync.js';
import path from 'path';

export async function addCommand(
    type: 'instruction' | 'agent' | 'task' | 'skill',
    name?: string,
    rootPath: string = process.cwd(),
): Promise<void> {
    const config = loadConfig(rootPath);
    if (!config) {
        logger.error('No syntra configuration found. Run `syntra init` first.');
        return;
    }

    const aiPath = path.join(rootPath, 'ai');

    if (type === 'instruction') {
        await addInstruction(name, aiPath, config);
    } else if (type === 'agent') {
        await addAgent(name, aiPath, config);
    } else if (type === 'task') {
        await addTask(aiPath, config);
    } else if (type === 'skill') {
        await addSkill(name, aiPath, config);
    }

    if (config.sync.autoSync) {
        syncCommand(rootPath, { silent: true });
        logger.info('Auto-sync completed.');
    }
}

async function addInstruction(
    name: string | undefined,
    aiPath: string,
    config: any
): Promise<void> {
    logger.section('Add Instruction');

    if (!name) {
        const templates = listTemplates('instruction');
        const templateNames = templates.map((t) => t.name);
        name = (await prompt({
            message: 'Select instruction template:',
            choices: templateNames,
        })) as string;
    }

    const templateData = {
        projectProfile: {
            language: config.project.language,
            framework: config.project.framework,
            packageManager: config.project.packageManager,
            monorepo: config.project.monorepo,
            cicd: [],
            existingAi: { copilot: false, claude: false, cursor: false },
        },
        projectName: config.project.name,
    };

    const content = renderTemplate(name, templateData);
    const filePath = path.join(aiPath, 'instructions', `${name}.instructions.md`);

    fsUtils.writeFile(filePath, content);
    logger.success(`Created: ai/instructions/${name}.instructions.md`);
}

async function addAgent(
    name: string | undefined,
    aiPath: string,
    config: any
): Promise<void> {
    logger.section('Add Agent');

    if (!name) {
        const templates = listTemplates('agent');
        const templateNames = templates.map((t) => t.name);
        name = (await prompt({
            message: 'Select agent template:',
            choices: templateNames,
        })) as string;
    }

    const templateData = {
        projectProfile: {
            language: config.project.language,
            framework: config.project.framework,
            packageManager: config.project.packageManager,
            monorepo: config.project.monorepo,
            cicd: [],
            existingAi: { copilot: false, claude: false, cursor: false },
        },
        projectName: config.project.name,
    };

    const content = renderTemplate(name, templateData);
    const filePath = path.join(aiPath, 'agents', `${name}.agent.md`);

    fsUtils.writeFile(filePath, content);
    logger.success(`Created: ai/agents/${name}.agent.md`);
}

async function addTask(aiPath: string, config: any): Promise<void> {
    logger.section('Add Task');

    const taskPrefix = config.tasks?.idPrefix ?? 'TASK-';
    const activeDir = config.tasks?.activeDir ?? 'active';

    const taskId = (await prompt({
        message: `Task ID (e.g., ${taskPrefix}001):`,
        validate: (val) => {
            if (!val.length) {
                return 'Task ID is required';
            }
            return val.startsWith(taskPrefix)
                ? true
                : `Task ID must start with ${taskPrefix}`;
        },
    })) as string;

    const description = (await prompt({
        message: 'Short description:',
    })) as string;

    const instructionTemplates = listTemplates('instruction');
    const instructionNames = instructionTemplates.map((t) => t.name);
    const instructions = (await prompt({
        message: 'Which instructions apply?',
        choices: instructionNames,
        checkbox: true,
    })) as string[];

    const agentTemplates = listTemplates('agent');
    const agentNames = agentTemplates.map((t) => t.name);
    const agent = (await prompt({
        message: 'Which agent runs this?',
        choices: agentNames,
    })) as string;

    const templateData = {
        taskId,
        description,
        instructions,
        agent,
        dependencies: [],
        steps: ['Step 1', 'Step 2', 'Step 3'],
        acceptanceCriteria: ['Criterion 1', 'Criterion 2'],
        projectProfile: {
            language: config.project.language,
            framework: config.project.framework,
            packageManager: config.project.packageManager,
            monorepo: config.project.monorepo,
            cicd: [],
            existingAi: { copilot: false, claude: false, cursor: false },
        },
        projectName: config.project.name,
    };

    const content = renderTemplate('task', templateData);
    const filePath = path.join(aiPath, 'tasks', activeDir, `${taskId}.task.md`);

    fsUtils.writeFile(filePath, content);
    logger.success(`Created: ai/tasks/${activeDir}/${taskId}.task.md`);
}

async function addSkill(
    name: string | undefined,
    aiPath: string,
    config: any,
): Promise<void> {
    logger.section('Add Skill');

    if (!name) {
        name = (await prompt({
            message: 'Skill name (e.g., api-pagination):',
        })) as string;
    }

    const templateData = {
        projectProfile: {
            language: config.project.language,
            framework: config.project.framework,
            packageManager: config.project.packageManager,
            monorepo: config.project.monorepo,
            cicd: [],
            existingAi: { copilot: false, claude: false, cursor: false },
        },
        projectName: config.project.name,
        skillName: name,
    };

    const content = renderTemplate('skill', templateData);
    const filePath = path.join(aiPath, 'skills', `${name}.skill.md`);

    fsUtils.writeFile(filePath, content);
    logger.success(`Created: ai/skills/${name}.skill.md`);
}
