import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { templateListCommand, templateSaveCommand } from '../../src/commands/template.js';
import { createWorkspace, writeConfig, writeFile } from '../helpers/workspace.js';

const cleanups: Array<() => void> = [];

function withTempHome(): { home: string; cleanup: () => void } {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'syntra-home-'));
    const homedirSpy = vi.spyOn(os, 'homedir').mockReturnValue(home);
    return {
        home,
        cleanup: () => {
            homedirSpy.mockRestore();
            fs.rmSync(home, { recursive: true, force: true });
        },
    };
}

afterEach(() => {
    vi.restoreAllMocks();
    while (cleanups.length > 0) {
        const cleanup = cleanups.pop();
        cleanup?.();
    }
});

describe('template commands', () => {
    it('saves ai folder as named template', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-template-');
        cleanups.push(ws.cleanup);
        const home = withTempHome();
        cleanups.push(home.cleanup);

        writeConfig(ws.root, { copilot: false, claude: false, cursor: false });
        writeFile(ws.root, 'ai/instructions/architecture.instructions.md', '# Architecture\n\n## Rules\nRule\n');

        templateSaveCommand('team-template', ws.root);

        const directPath = path.join(home.home, '.ai-fw', 'templates', 'team-template', 'instructions', 'architecture.instructions.md');
        const nestedPath = path.join(home.home, '.ai-fw', 'templates', 'team-template', 'ai', 'instructions', 'architecture.instructions.md');
        expect(fs.existsSync(directPath) || fs.existsSync(nestedPath)).toBe(true);
    });

    it('lists available templates', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('syntra-template-list-');
        cleanups.push(ws.cleanup);
        const home = withTempHome();
        cleanups.push(home.cleanup);

        writeConfig(ws.root, { copilot: false, claude: false, cursor: false });
        writeFile(ws.root, 'ai/instructions/architecture.instructions.md', '# Architecture\n\n## Rules\nRule\n');
        templateSaveCommand('template-a', ws.root);

        templateListCommand();

        const joined = consoleSpy.mock.calls
            .flat()
            .map((entry) => String(entry))
            .join('\n');

        expect(joined).toMatch(/template-a/);
    });
});
