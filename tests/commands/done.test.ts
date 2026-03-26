import { afterEach, describe, expect, it, vi } from 'vitest';
import { doneCommand } from '../../src/commands/done.js';
import { createWorkspace, fileExists, writeFile } from '../helpers/workspace.js';

const cleanups: Array<() => void> = [];

afterEach(() => {
    vi.restoreAllMocks();
    while (cleanups.length > 0) {
        const cleanup = cleanups.pop();
        cleanup?.();
    }
});

describe('doneCommand', () => {
    it('moves task from active to done folder', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('cortex-done-');
        cleanups.push(ws.cleanup);

        writeFile(ws.root, 'ai/tasks/active/TASK-001.task.md', '# TASK-001\n');
        writeFile(ws.root, 'ai/tasks/done/.keep', '');

        doneCommand('TASK-001', ws.root);

        expect(fileExists(ws.root, 'ai/tasks/active/TASK-001.task.md')).toBe(false);
        expect(fileExists(ws.root, 'ai/tasks/done/TASK-001.task.md')).toBe(true);
    });
});
