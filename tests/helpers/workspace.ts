import fs from 'fs';
import os from 'os';
import path from 'path';

export interface TestWorkspace {
    root: string;
    cleanup: () => void;
}

export function createWorkspace(prefix: string = 'cortex-ai-test-'): TestWorkspace {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    return {
        root,
        cleanup: () => {
            fs.rmSync(root, { recursive: true, force: true });
        },
    };
}

export function writeFile(root: string, relativePath: string, content: string): void {
    const fullPath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
}

export function fileExists(root: string, relativePath: string): boolean {
    return fs.existsSync(path.join(root, relativePath));
}

export function writeConfig(
    root: string,
    options: {
        copilot?: boolean;
        claude?: boolean;
        cursor?: boolean;
        autoSync?: boolean;
    } = {},
): void {
    const content = `version: 1
project:
  name: demo
  language: typescript
  framework: react
  packageManager: npm
  monorepo: false
adapters:
  copilot:
    enabled: ${options.copilot ?? true}
    instructionsMode: concatenated
  claude:
    enabled: ${options.claude ?? true}
    instructionsMode: concatenated
  cursor:
    enabled: ${options.cursor ?? true}
    instructionsMode: individual
sync:
  autoSync: ${options.autoSync ?? false}
  warnManualEdits: true
tasks:
  idPrefix: TASK-
  activeDir: active
  doneDir: done
language: en
`;
    writeFile(root, 'ai/config.yml', content);
}

export function writeCanonicalFiles(root: string): void {
    writeFile(
        root,
        'ai/instructions/architecture.instructions.md',
        '# Architecture\n\n## Rules\nUse modular architecture.\n',
    );
    writeFile(
        root,
        'ai/agents/code-generator.agent.md',
        '# Code Generator\n\nFollow architecture.instructions.md\n',
    );
    writeFile(root, 'ai/tasks/active/.keep', '');
    writeFile(root, 'ai/tasks/done/.keep', '');
    writeFile(root, 'ai/skills/.keep', '');
}
