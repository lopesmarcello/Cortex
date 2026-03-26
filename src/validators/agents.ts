import path from 'path';
import { fsUtils } from '../utils/fs.js';
import type { ValidationIssue, ValidationSummary } from './instructions.js';

function extractInstructionReferences(markdown: string): string[] {
    const matches = markdown.match(/([a-z0-9-]+)\.instructions\.md/gi) || [];
    return [...new Set(matches.map((entry) => entry.replace(/\.instructions\.md$/i, '').toLowerCase()))];
}

export function validateAgents(rootPath: string): ValidationSummary {
    const agentsDir = path.join(rootPath, 'ai', 'agents');
    const instructionsDir = path.join(rootPath, 'ai', 'instructions');

    const instructionNames = new Set(
        fsUtils
            .listFiles(instructionsDir)
            .filter((file) => file.endsWith('.instructions.md'))
            .map((file) => path.basename(file, '.instructions.md').toLowerCase()),
    );

    const files = fsUtils.listFiles(agentsDir).filter((file) => file.endsWith('.agent.md'));
    const issues: ValidationIssue[] = [];

    for (const filePath of files) {
        const fileName = path.basename(filePath);
        const content = fsUtils.readFile(filePath);

        if (!content.trim().startsWith('# ')) {
            issues.push({
                level: 'error',
                message: `${fileName} must start with a level-1 heading (# Title).`,
            });
        }

        const refs = extractInstructionReferences(content);
        for (const ref of refs) {
            if (!instructionNames.has(ref)) {
                issues.push({
                    level: 'warning',
                    message: `${fileName} references missing instruction: ${ref}.instructions.md`,
                });
            }
        }
    }

    return {
        checked: files.length,
        issues,
    };
}
