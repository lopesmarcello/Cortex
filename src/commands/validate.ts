import { loadConfig, validateConfigSchema } from '../validators/config.js';
import { validateInstructions } from '../validators/instructions.js';
import { validateAgents } from '../validators/agents.js';
import { validateTasks } from '../validators/tasks.js';
import { validateSyncStatus } from '../validators/syncStatus.js';
import { logger } from '../utils/logger.js';

export interface ValidateResult {
    errors: number;
    warnings: number;
}

export function validateCommand(rootPath: string = process.cwd()): ValidateResult {
    logger.section('Validate AI Framework');

    const config = loadConfig(rootPath);
    const configIssues = validateConfigSchema(config);

    const errorCount = configIssues.filter((i) => i.level === 'error').length;
    const warningCount = configIssues.filter((i) => i.level === 'warning').length;

    if (configIssues.length === 0) {
        logger.success('ai/config.yml — valid');
    } else {
        for (const issue of configIssues) {
            if (issue.level === 'error') {
                logger.error(issue.message);
            } else {
                logger.warn(issue.message);
            }
        }
    }

    let errors = errorCount;
    let warnings = warningCount;

    if (!config) {
        logger.newline();
        logger.error(`Found ${errors} errors, ${warnings} warnings.`);
        return { errors, warnings };
    }

    const instructionSummary = validateInstructions(rootPath);
    if (instructionSummary.issues.length === 0) {
        logger.success(`ai/instructions/ — ${instructionSummary.checked} files, all valid format`);
    }
    for (const issue of instructionSummary.issues) {
        if (issue.level === 'error') {
            logger.error(issue.message);
            errors += 1;
        } else {
            logger.warn(issue.message);
            warnings += 1;
        }
    }

    const agentSummary = validateAgents(rootPath);
    if (agentSummary.issues.length === 0) {
        logger.success(`ai/agents/ — ${agentSummary.checked} files, all valid format`);
    }
    for (const issue of agentSummary.issues) {
        if (issue.level === 'error') {
            logger.error(issue.message);
            errors += 1;
        } else {
            logger.warn(issue.message);
            warnings += 1;
        }
    }

    const taskSummary = validateTasks(rootPath);
    if (taskSummary.issues.length === 0) {
        logger.success(`ai/tasks/ — ${taskSummary.checked} files, all valid format`);
    }
    for (const issue of taskSummary.issues) {
        if (issue.level === 'error') {
            logger.error(issue.message);
            errors += 1;
        } else {
            logger.warn(issue.message);
            warnings += 1;
        }
    }

    const syncIssues = validateSyncStatus(rootPath, config);
    if (syncIssues.length === 0) {
        logger.success('Sync status — up to date');
    }
    for (const issue of syncIssues) {
        if (issue.level === 'error') {
            logger.error(issue.message);
            errors += 1;
        } else {
            logger.warn(issue.message);
            warnings += 1;
        }
    }

    logger.newline();
    if (errors > 0) {
        logger.error(`Found ${errors} errors, ${warnings} warnings.`);
    } else if (warnings > 0) {
        logger.warn(`Found ${errors} errors, ${warnings} warnings.`);
    } else {
        logger.success('Found 0 errors, 0 warnings.');
    }

    return { errors, warnings };
}
