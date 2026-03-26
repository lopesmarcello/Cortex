import path from 'path';
import { fsUtils } from '../utils/fs.js';

export interface ValidationIssue {
    level: 'error' | 'warning';
    message: string;
}

export interface ValidationSummary {
    checked: number;
    issues: ValidationIssue[];
}

export function validateInstructions(rootPath: string): ValidationSummary {
    const instructionsDir = path.join(rootPath, 'ai', 'instructions');
    const files = fsUtils.listFiles(instructionsDir).filter((file) => file.endsWith('.instructions.md'));
    const issues: ValidationIssue[] = [];

    for (const filePath of files) {
        const fileName = path.basename(filePath);
        const content = fsUtils.readFile(filePath);

        if (!fileName.match(/^[a-z0-9-]+\.instructions\.md$/)) {
            issues.push({
                level: 'warning',
                message: `Instruction file name should be kebab-case: ${fileName}`,
            });
        }

        if (!content.trim().startsWith('# ')) {
            issues.push({
                level: 'error',
                message: `${fileName} must start with a level-1 heading (# Title).`,
            });
        }

        if (!content.includes('\n## ')) {
            issues.push({
                level: 'warning',
                message: `${fileName} should include at least one section heading (## ...).`,
            });
        }
    }

    return {
        checked: files.length,
        issues,
    };
}
