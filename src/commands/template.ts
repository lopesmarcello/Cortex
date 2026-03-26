import fs from 'fs';
import os from 'os';
import path from 'path';
import { fsUtils } from '../utils/fs.js';
import { logger } from '../utils/logger.js';

function getTemplateRoot(): string {
    return path.join(os.homedir(), '.ai-fw', 'templates');
}

function ensureTemplateRoot(): void {
    fsUtils.mkdir(getTemplateRoot());
}

function getTemplatePath(name: string): string {
    return path.join(getTemplateRoot(), name);
}

export function templateSaveCommand(name: string, rootPath: string = process.cwd()): void {
    if (!name || !name.trim()) {
        logger.error('Template name is required. Usage: cortex template save <name>');
        return;
    }

    const aiDir = path.join(rootPath, 'ai');
    if (!fsUtils.isDirectory(aiDir)) {
        logger.error('No ai/ directory found. Run `cortex init` first.');
        return;
    }

    ensureTemplateRoot();

    const destination = getTemplatePath(name.trim());
    if (fs.existsSync(destination)) {
        fs.rmSync(destination, { recursive: true, force: true });
    }

    fsUtils.copyDir(aiDir, destination);
    logger.success(`Template saved: ${name}`);
    logger.info(`Path: ${destination}`);
}

export function templateListCommand(): void {
    ensureTemplateRoot();
    const templateRoot = getTemplateRoot();

    const entries = fs
        .readdirSync(templateRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));

    if (entries.length === 0) {
        logger.info('No templates found. Save one with `cortex template save <name>`.');
        return;
    }

    logger.section('Available templates');
    for (const template of entries) {
        logger.dim(`- ${template}`);
    }
}
