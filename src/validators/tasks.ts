import path from 'path';
import { fsUtils } from '../utils/fs.js';
import type { ValidationIssue, ValidationSummary } from './instructions.js';

const REQUIRED_SECTIONS = [
    '## Context',
    '## References',
    '## Dependencies',
    '## Steps',
    '## Acceptance Criteria',
    '## Notes',
];

function extractReferences(markdown: string, suffix: '.instructions.md' | '.agent.md'): string[] {
    const escaped = suffix.replace('.', '\\.');
    const regex = new RegExp(`([a-z0-9-]+)${escaped}`, 'gi');
    const matches: string[] = [];
    for (const match of markdown.matchAll(regex)) {
        matches.push(match[1].toLowerCase());
    }
    return [...new Set(matches)];
}

export function validateTasks(rootPath: string): ValidationSummary {
    const activeDir = path.join(rootPath, 'ai', 'tasks', 'active');
    const doneDir = path.join(rootPath, 'ai', 'tasks', 'done');
    const instructionsDir = path.join(rootPath, 'ai', 'instructions');
    const agentsDir = path.join(rootPath, 'ai', 'agents');

    const instructionNames = new Set(
        fsUtils
            .listFiles(instructionsDir)
            .filter((file) => file.endsWith('.instructions.md'))
            .map((file) => path.basename(file, '.instructions.md').toLowerCase()),
    );

    const agentNames = new Set(
        fsUtils
            .listFiles(agentsDir)
            .filter((file) => file.endsWith('.agent.md'))
            .map((file) => path.basename(file, '.agent.md').toLowerCase()),
    );

    const files = [
        ...fsUtils.listFiles(activeDir).filter((file) => file.endsWith('.task.md')),
        ...fsUtils.listFiles(doneDir).filter((file) => file.endsWith('.task.md')),
    ];

    const issues: ValidationIssue[] = [];

    for (const filePath of files) {
        const fileName = path.basename(filePath);
        const content = fsUtils.readFile(filePath);

        for (const section of REQUIRED_SECTIONS) {
            if (!content.includes(section)) {
                issues.push({
                    level: 'warning',
                    message: `${fileName} is missing section: ${section.replace('## ', '')}`,
                });
            }
        }

        const referencedInstructions = extractReferences(content, '.instructions.md');
        for (const ref of referencedInstructions) {
            if (!instructionNames.has(ref)) {
                issues.push({
                    level: 'warning',
                    message: `${fileName} references missing instruction: ${ref}.instructions.md`,
                });
            }
        }

        const referencedAgents = extractReferences(content, '.agent.md');
        for (const ref of referencedAgents) {
            if (!agentNames.has(ref)) {
                issues.push({
                    level: 'warning',
                    message: `${fileName} references missing agent: ${ref}.agent.md`,
                });
            }
        }
    }

    return {
        checked: files.length,
        issues,
    };
}
