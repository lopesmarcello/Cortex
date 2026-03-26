#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { doneCommand } from './commands/done.js';
import { syncCommand } from './commands/sync.js';
import { validateCommand } from './commands/validate.js';
import { templateSaveCommand, templateListCommand } from './commands/template.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
    .name('syntra')
    .description('AI-assisted development framework CLI')
    .version('0.1.0');

// Init command
program
    .command('init')
    .description('Initialize AI framework in project')
    .action(async () => {
        try {
            await initCommand();
        } catch (e) {
            process.exit(1);
        }
    });

// Add command
program
    .command('add <type> [name]')
    .description('Add framework file (instruction, agent, task, skill)')
    .action(async (type: string, name?: string) => {
        try {
            if (!['instruction', 'agent', 'task', 'skill'].includes(type)) {
                logger.error(`Unknown type: ${type}`);
                logger.info('Valid types: instruction, agent, task, skill');
                process.exit(1);
            }
            await addCommand(type as any, name);
        } catch (e) {
            process.exit(1);
        }
    });

// Done command
program
    .command('done <taskId>')
    .description('Mark task as done')
    .action((taskId: string) => {
        try {
            doneCommand(taskId);
        } catch (e) {
            logger.error(`Failed: ${e}`);
            process.exit(1);
        }
    });

// Sync command
program
    .command('sync')
    .description('Sync canonical ai/ files to configured AI tool adapters')
    .option('--copilot', 'Sync only GitHub Copilot adapter')
    .option('--claude', 'Sync only Claude Code adapter')
    .option('--cursor', 'Sync only Cursor adapter')
    .action((options: { copilot?: boolean; claude?: boolean; cursor?: boolean }) => {
        try {
            syncCommand(process.cwd(), {
                copilot: options.copilot,
                claude: options.claude,
                cursor: options.cursor,
            });
        } catch (e) {
            logger.error(`Failed: ${e}`);
            process.exit(1);
        }
    });

// Validate command
program
    .command('validate')
    .description('Validate framework setup and sync status')
    .action(() => {
        try {
            const result = validateCommand(process.cwd());
            if (result.errors > 0) {
                process.exitCode = 1;
            }
        } catch (e) {
            logger.error(`Failed: ${e}`);
            process.exit(1);
        }
    });

// Template commands
const template = program
    .command('template')
    .description('Manage reusable framework templates');

template
    .command('save <name>')
    .description('Save current ai/ setup as a reusable template')
    .action((name: string) => {
        try {
            templateSaveCommand(name, process.cwd());
        } catch (e) {
            logger.error(`Failed: ${e}`);
            process.exit(1);
        }
    });

template
    .command('list')
    .description('List saved templates')
    .action(() => {
        try {
            templateListCommand();
        } catch (e) {
            logger.error(`Failed: ${e}`);
            process.exit(1);
        }
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
