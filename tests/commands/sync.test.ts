import { afterEach, describe, expect, it, vi } from 'vitest';
import { syncCommand } from '../../src/commands/sync.js';
import { createWorkspace, fileExists, writeCanonicalFiles, writeConfig } from '../helpers/workspace.js';

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
});
