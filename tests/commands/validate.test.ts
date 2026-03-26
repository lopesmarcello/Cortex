import { afterEach, describe, expect, it, vi } from 'vitest';
import { validateCommand } from '../../src/commands/validate.js';
import { createWorkspace, writeConfig, writeFile } from '../helpers/workspace.js';

const cleanups: Array<() => void> = [];

afterEach(() => {
    vi.restoreAllMocks();
    while (cleanups.length > 0) {
        const cleanup = cleanups.pop();
        cleanup?.();
    }
});

describe('validateCommand', () => {
    it('returns error when config is missing', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('cortex-ai-validate-missing-');
        cleanups.push(ws.cleanup);

        const result = validateCommand(ws.root);
        expect(result.errors).toBeGreaterThan(0);
    });

    it('returns clean result for valid minimal setup', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('cortex-ai-validate-clean-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: false, claude: false, cursor: false });
        writeFile(ws.root, 'ai/instructions/architecture.instructions.md', '# Architecture\n\n## Rules\nRule\n');
        writeFile(ws.root, 'ai/agents/code-generator.agent.md', '# Code Generator\n\nUse architecture.instructions.md\n');
        writeFile(
            ws.root,
            'ai/tasks/active/TASK-001.task.md',
            '# TASK-001\n\n## Context\nA\n\n## References\n- architecture.instructions.md\n- code-generator.agent.md\n\n## Steps\n1. [ ] Step\n\n## Acceptance Criteria\n- [ ] Done\n\n## Status\n- [ ] In progress\n',
        );
        writeFile(ws.root, 'ai/tasks/done/.keep', '');
        writeFile(ws.root, 'ai/skills/.keep', '');

        const result = validateCommand(ws.root);
        expect(result.errors).toBe(0);
        expect(result.warnings).toBe(0);
    });

    it('returns warning when agent references missing instruction', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);

        const ws = createWorkspace('cortex-ai-validate-warning-');
        cleanups.push(ws.cleanup);

        writeConfig(ws.root, { copilot: false, claude: false, cursor: false });
        writeFile(ws.root, 'ai/instructions/architecture.instructions.md', '# Architecture\n\n## Rules\nRule\n');
        writeFile(ws.root, 'ai/agents/code-reviewer.agent.md', '# Reviewer\n\nUse api-design.instructions.md\n');
        writeFile(ws.root, 'ai/tasks/active/.keep', '');
        writeFile(ws.root, 'ai/tasks/done/.keep', '');
        writeFile(ws.root, 'ai/skills/.keep', '');

        const result = validateCommand(ws.root);
        expect(result.errors).toBe(0);
        expect(result.warnings).toBeGreaterThan(0);
    });
});
