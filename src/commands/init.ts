import { detectProject } from '../detectors/index.js';
import { fsUtils } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { prompt } from '../utils/prompt.js';
import { createConfig, saveConfig } from '../validators/config.js';
import { renderTemplate, listTemplates } from '../templates/registry.js';
import { syncAdapters } from '../adapters/index.js';
import { writeSyncState } from '../validators/syncStatus.js';
import path from 'path';

export async function initCommand(rootPath: string = process.cwd()): Promise<void> {
    logger.section('🔍 Initializing AI Framework');
    logger.newline();

    // Step 1: Detect project
    const spinner = logger.spinner('Scanning project...');
    try {
        const profile = await detectProject(rootPath);
        spinner.succeed();

        logger.info(`Language: ${profile.language}`);
        logger.info(`Framework: ${profile.framework}`);
        logger.info(`Package Manager: ${profile.packageManager}`);
        logger.info(`Monorepo: ${profile.monorepo ? 'Yes' : 'No'}`);
        if (profile.cicd.length > 0) {
            logger.info(`CI/CD: ${profile.cicd.join(', ')}`);
        }
        logger.newline();

        // Step 2: Confirm detection
        const confirmed = await prompt({
            message: 'Does this look right?',
            default: true,
        });

        if (!confirmed) {
            logger.warn('Setup cancelled.');
            return;
        }

        logger.newline();

        // Step 3: Get project name
        const projectName = await prompt({
            message: 'Project name:',
            default: path.basename(rootPath),
        });

        // Step 4: Select instruction templates
        const instructionChoices = listTemplates('instruction').map((t) => t.name);
        const selectedInstructions = (await prompt({
            message: 'Select instruction templates to include:',
            choices: instructionChoices,
            checkbox: true,
        })) as string[];

        // Step 5: Select agents
        const agentChoices = listTemplates('agent').map((t) => t.name);
        const selectedAgents = (await prompt({
            message: 'Select agents to include:',
            choices: agentChoices,
            checkbox: true,
        })) as string[];

        // Step 6: Select AI tool adapters
        const adapters = (await prompt({
            message: 'Which AI tool adapters do you use?',
            choices: ['GitHub Copilot', 'Claude Code', 'Cursor'],
            checkbox: true,
        })) as string[];

        // Create config
        const config = createConfig(
            projectName as string,
            profile,
            {
                copilot: adapters.includes('GitHub Copilot'),
                claude: adapters.includes('Claude Code'),
                cursor: adapters.includes('Cursor'),
            }
        );

        logger.newline();

        // Create directories and files
        const spinner2 = logger.spinner('Creating framework structure...');

        // Create ai/ structure
        const aiPath = path.join(rootPath, 'ai');
        fsUtils.mkdir(aiPath);

        // Save config
        saveConfig(rootPath, config);

        // Create instructions
        const instructionsPath = path.join(aiPath, 'instructions');
        fsUtils.mkdir(instructionsPath);

        for (const instruction of selectedInstructions) {
            const templateData = {
                projectProfile: profile,
                projectName: projectName as string,
            };
            const content = renderTemplate(instruction, templateData);
            const filePath = path.join(instructionsPath, `${instruction}.instructions.md`);
            fsUtils.writeFile(filePath, content);
        }

        // Create agents
        const agentsPath = path.join(aiPath, 'agents');
        fsUtils.mkdir(agentsPath);

        for (const agent of selectedAgents) {
            const templateData = {
                projectProfile: profile,
                projectName: projectName as string,
            };
            const content = renderTemplate(agent, templateData);
            const filePath = path.join(agentsPath, `${agent}.agent.md`);
            fsUtils.writeFile(filePath, content);
        }

        // Create tasks directories
        const tasksPath = path.join(aiPath, 'tasks');
        fsUtils.mkdir(path.join(tasksPath, 'active'));
        fsUtils.mkdir(path.join(tasksPath, 'done'));

        // Create skills directory
        fsUtils.mkdir(path.join(aiPath, 'skills'));

        spinner2.succeed();

        // Create adapters (empty for now, Phase 2)
        const syncResult = syncAdapters(rootPath, config);
        if (syncResult.targets.length > 0) {
            writeSyncState(rootPath);
        }

        logger.newline();
        logger.success('✔ Framework initialized successfully!');
        logger.info(`Config saved to: ai/config.yml`);
        logger.info(`Instructions: ${selectedInstructions.length} files created`);
        logger.info(`Agents: ${selectedAgents.length} files created`);
        logger.info(`Synced adapters: ${syncResult.targets.join(', ')}`);
        logger.newline();
        logger.info('Next steps:');
        logger.dim('1. Edit ai/instructions/*.md to customize for your project');
        logger.dim('2. Run `syntra add task` to create your first task');
        logger.dim('3. Run `syntra sync` to sync adapters for your AI tools');
    } catch (e) {
        spinner.fail();
        logger.error(`Initialization failed: ${e}`);
        throw e;
    }
}
