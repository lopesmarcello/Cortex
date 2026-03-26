import { afterEach, describe, expect, it, vi } from 'vitest';
import { addCommand } from '../../src/commands/add.js';
import { doneCommand } from '../../src/commands/done.js';
import { createWorkspace, fileExists, writeConfig, writeFile } from '../helpers/workspace.js';
import * as promptModule from '../../src/utils/prompt.js';

const cleanups: Array<() => void> = [];

afterEach(() => {
    vi.restoreAllMocks();
    while (cleanups.length > 0) {
        const cleanup = cleanups.pop();
        cleanup?.();
    }
});

describe('addCommand task flow', () => {
    it('uses configured task prefix and active directory', async () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-add-task-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, {
            copilot: false,
            claude: false,
            cursor: false,
            idPrefix: 'LTC-',
            activeDir: 'in-progress',
            doneDir: 'completed',
        });

        const promptSpy = vi.spyOn(promptModule, 'prompt');
        promptSpy
            .mockResolvedValueOnce('LTC-5002')
            .mockResolvedValueOnce('Implement a utility')
            .mockResolvedValueOnce(['architecture', 'testing'])
            .mockResolvedValueOnce('code-generator');

        await addCommand('task', undefined, ws.root);

        expect(fileExists(ws.root, 'ai/tasks/in-progress/LTC-5002.task.md')).toBe(true);
    });

    it('done command uses configured active and done directories', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-done-configured-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, {
            copilot: false,
            claude: false,
            cursor: false,
            activeDir: 'in-progress',
            doneDir: 'completed',
        });
        writeFile(ws.root, 'ai/tasks/in-progress/TASK-001.task.md', '# TASK-001\n');

        doneCommand('TASK-001', ws.root);

        expect(fileExists(ws.root, 'ai/tasks/in-progress/TASK-001.task.md')).toBe(false);
        expect(fileExists(ws.root, 'ai/tasks/completed/TASK-001.task.md')).toBe(true);
    });
});
