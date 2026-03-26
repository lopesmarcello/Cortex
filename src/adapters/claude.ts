import path from 'path';
import { fsUtils } from '../utils/fs.js';
import { loadCanonicalData, withGeneratedBanner, instructionTitle } from './common.js';
import type { AdapterResult } from './copilot.js';

export function syncClaudeAdapter(rootPath: string): AdapterResult {
    const data = loadCanonicalData(rootPath);

    const outDir = path.join(rootPath, '.claude');
    fsUtils.mkdir(outDir);

    const instructionSections = data.instructions
        .map((item) => `## ${instructionTitle(item.name)}\n\n${item.content}`)
        .join('\n\n');

    const agentSections = data.agents
        .map((agent) => `### ${agent.name}\n\n${agent.content}`)
        .join('\n\n');

    const content = withGeneratedBanner(`# Project Context\n\nRead the following instruction files before any task:\n\n${instructionSections}\n\n## Available Agents\n\n${agentSections}\n\n## Task Format\nWhen given a task file, follow its steps sequentially. After each step:\n1. Implement the change\n2. Report what was done\n3. Wait for human review before proceeding\n`);

    const outPath = path.join(outDir, 'CLAUDE.md');
    fsUtils.writeFile(outPath, content);

    return { writtenFiles: [outPath] };
}
