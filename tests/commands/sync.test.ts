import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { syncCommand } from '../../src/commands/sync.js';
import { createWorkspace, fileExists, writeCanonicalFiles, writeConfig, writeFile } from '../helpers/workspace.js';

const cleanups: Array<() => void> = [];

afterEach(() => {
    vi.restoreAllMocks();
    while (cleanups.length > 0) {
        const cleanup = cleanups.pop();
        cleanup?.();
    }
});

describe('syncCommand', () => {
    it('generates adapter files and sync state for enabled adapters', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: true, claude: true, cursor: true });
        writeCanonicalFiles(ws.root);

        syncCommand(ws.root, { silent: true });

        expect(fileExists(ws.root, '.github/copilot-instructions.md')).toBe(true);
        expect(fileExists(ws.root, '.github/agents/code-generator.md')).toBe(true);
        expect(fileExists(ws.root, '.claude/CLAUDE.md')).toBe(true);
        expect(fileExists(ws.root, '.cursor/rules/architecture.mdc')).toBe(true);
        expect(fileExists(ws.root, 'ai/.sync-state.json')).toBe(true);
    });

    it('syncs only explicit target when flags are provided', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-targeted-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: true, claude: true, cursor: true });
        writeCanonicalFiles(ws.root);

        syncCommand(ws.root, { copilot: true, silent: true });

        expect(fileExists(ws.root, '.github/copilot-instructions.md')).toBe(true);
        expect(fileExists(ws.root, '.claude/CLAUDE.md')).toBe(false);
        expect(fileExists(ws.root, '.cursor/rules/architecture.mdc')).toBe(false);
    });

    it('writes tasks to .github/prompts/ as .prompt.md files', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-tasks-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: true });
        writeCanonicalFiles(ws.root);
        writeFile(
            ws.root,
            'ai/tasks/active/TASK-001.task.md',
            '# TASK-001: Add login page\n\n## Steps\n1. [ ] Create component\n',
        );

        syncCommand(ws.root, { copilot: true, silent: true });

        expect(fileExists(ws.root, '.github/prompts/TASK-001.prompt.md')).toBe(true);
    });

    it('includes active tasks in Claude context output', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-claude-tasks-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { claude: true, copilot: false, cursor: false });
        writeCanonicalFiles(ws.root);
        writeFile(
            ws.root,
            'ai/tasks/active/TASK-002.task.md',
            '# TASK-002: Add audit logging\n\n## Steps\n1. [ ] Add logger\n',
        );

        syncCommand(ws.root, { claude: true, silent: true });

        const claudePath = path.join(ws.root, '.claude', 'CLAUDE.md');
        const content = fs.readFileSync(claudePath, 'utf-8');

        expect(content).toContain('## Active Tasks');
        expect(content).toContain('### TASK-002');
        expect(content).toContain('# TASK-002: Add audit logging');
    });

    it('writes active tasks as Cursor rules', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-cursor-tasks-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { cursor: true, copilot: false, claude: false });
        writeCanonicalFiles(ws.root);
        writeFile(
            ws.root,
            'ai/tasks/active/TASK-003.task.md',
            '# TASK-003: Normalize date parsing\n\n## Steps\n1. [ ] Update parser\n',
        );

        syncCommand(ws.root, { cursor: true, silent: true });

        expect(fileExists(ws.root, '.cursor/rules/TASK-003.mdc')).toBe(true);
    });

    it('uses configured active task directory for Claude and Cursor task sync', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-custom-active-dir-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, {
            claude: true,
            cursor: true,
            copilot: false,
            activeDir: 'current',
        });
        writeCanonicalFiles(ws.root);
        writeFile(
            ws.root,
            'ai/tasks/current/TASK-010.task.md',
            '# TASK-010: Enforce strict null checks\n\n## Steps\n1. [ ] Update tsconfig\n',
        );

        syncCommand(ws.root, { claude: true, cursor: true, silent: true });

        const claudePath = path.join(ws.root, '.claude', 'CLAUDE.md');
        const content = fs.readFileSync(claudePath, 'utf-8');

        expect(content).toContain('### TASK-010');
        expect(fileExists(ws.root, '.cursor/rules/TASK-010.mdc')).toBe(true);
    });

    it('supports tasks-only sync mode for Copilot and Cursor', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-tasks-only-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: true, cursor: true, claude: false });
        writeCanonicalFiles(ws.root);
        writeFile(
            ws.root,
            'ai/tasks/active/TASK-021.task.md',
            '# TASK-021: Add retry backoff\n\n## Steps\n1. [ ] Add retry strategy\n',
        );

        syncCommand(ws.root, { copilot: true, cursor: true, tasksOnly: true, silent: true });

        expect(fileExists(ws.root, '.github/prompts/TASK-021.prompt.md')).toBe(true);
        expect(fileExists(ws.root, '.github/copilot-instructions.md')).toBe(false);
        expect(fileExists(ws.root, '.github/agents/code-generator.md')).toBe(false);

        expect(fileExists(ws.root, '.cursor/rules/TASK-021.mdc')).toBe(true);
        expect(fileExists(ws.root, '.cursor/rules/architecture.mdc')).toBe(false);
    });

    it('generates Copilot task alias prompt when syntra-task skill exists', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-copilot-task-alias-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: true, claude: false, cursor: false });
        writeCanonicalFiles(ws.root);
        writeFile(
            ws.root,
            'ai/skills/syntra-task.skill.md',
            '# Syntra Task Skill\n\nUse this skill to create task files.\n',
        );

        syncCommand(ws.root, { copilot: true, silent: true });

        expect(fileExists(ws.root, '.github/prompts/syntra-task.prompt.md')).toBe(true);
        expect(fileExists(ws.root, '.github/prompts/task.prompt.md')).toBe(true);

        const taskPromptPath = path.join(ws.root, '.github', 'prompts', 'task.prompt.md');
        const taskPromptContent = fs.readFileSync(taskPromptPath, 'utf-8');
        expect(taskPromptContent.startsWith('---\n')).toBe(true);
        expect(taskPromptContent).toContain("mode: 'agent'");
    });

    it('generates Claude slash commands from skills including task alias', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-claude-commands-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { claude: true, copilot: false, cursor: false });
        writeCanonicalFiles(ws.root);
        writeFile(
            ws.root,
            'ai/skills/syntra-task.skill.md',
            '# Syntra Task Skill\n\nUse this skill to create task files.\n',
        );

        syncCommand(ws.root, { claude: true, silent: true });

        expect(fileExists(ws.root, '.claude/commands/syntra-task.md')).toBe(true);
        expect(fileExists(ws.root, '.claude/commands/task.md')).toBe(true);
    });

    it('updates Claude active task section in tasks-only mode', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-sync-claude-tasks-only-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { claude: true, copilot: false, cursor: false });
        writeCanonicalFiles(ws.root);
        writeFile(
            ws.root,
            'ai/tasks/active/TASK-030.task.md',
            '# TASK-030: Initial task\n\n## Steps\n1. [ ] Baseline\n',
        );

        syncCommand(ws.root, { claude: true, silent: true });

        writeFile(
            ws.root,
            'ai/tasks/active/TASK-031.task.md',
            '# TASK-031: Follow-up task\n\n## Steps\n1. [ ] Expand\n',
        );

        syncCommand(ws.root, { claude: true, tasksOnly: true, silent: true });

        const claudePath = path.join(ws.root, '.claude', 'CLAUDE.md');
        const content = fs.readFileSync(claudePath, 'utf-8');

        expect(content).toContain('<!-- syntra:tasks:start -->');
        expect(content).toContain('### TASK-031');
        expect(content).toContain('### TASK-030');
    });
});
