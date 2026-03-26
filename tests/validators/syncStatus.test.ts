import { afterEach, describe, expect, it, vi } from 'vitest';
import { validateSyncStatus, writeSyncState } from '../../src/validators/syncStatus.js';
import { syncCommand } from '../../src/commands/sync.js';
import { createWorkspace, writeCanonicalFiles, writeConfig, writeFile } from '../helpers/workspace.js';
import { loadConfig } from '../../src/validators/config.js';

const cleanups: Array<() => void> = [];

afterEach(() => {
    vi.restoreAllMocks();
    while (cleanups.length > 0) {
        const cleanup = cleanups.pop();
        cleanup?.();
    }
});

describe('validateSyncStatus', () => {
    it('warns when adapters are enabled but no adapter files exist', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-syncstatus-empty-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: true, claude: false, cursor: false });
        writeCanonicalFiles(ws.root);

        const config = loadConfig(ws.root);
        if (!config) throw new Error('config not loaded');

        const issues = validateSyncStatus(ws.root, config);
        expect(issues.some((issue) => issue.message.includes('no adapter files'))).toBe(true);
    });

    it('warns when canonical files are newer than adapter files', async () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-syncstatus-stale-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: true, claude: false, cursor: false });
        writeCanonicalFiles(ws.root);
        syncCommand(ws.root, { silent: true });

        await new Promise((resolve) => setTimeout(resolve, 20));
        writeFile(ws.root, 'ai/instructions/architecture.instructions.md', '# Architecture\n\n## Rules\nUpdated\n');

        const config = loadConfig(ws.root);
        if (!config) throw new Error('config not loaded');

        const issues = validateSyncStatus(ws.root, config);
        expect(issues.some((issue) => issue.message.includes('out of date'))).toBe(true);
    });
});
