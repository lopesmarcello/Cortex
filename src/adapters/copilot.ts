import path from 'path';
import { fsUtils } from '../utils/fs.js';
import { loadCanonicalData, withGeneratedBanner, instructionTitle } from './common.js';

export interface AdapterResult {
    writtenFiles: string[];
}

export function syncCopilotAdapter(rootPath: string, activeTaskDir: string = 'active'): AdapterResult {
    const data = loadCanonicalData(rootPath, activeTaskDir);

    const outDir = path.join(rootPath, '.github');
    const agentsDir = path.join(outDir, 'agents');
    fsUtils.mkdir(outDir);
    fsUtils.mkdir(agentsDir);

    const sections = data.instructions
        .map((item) => `## ${instructionTitle(item.name)}\n\n${item.content}`)
        .join('\n\n');

    const copilotInstructions = withGeneratedBanner(`# Project Instructions\n\n${sections}\n`);
    const instructionsPath = path.join(outDir, 'copilot-instructions.md');
    fsUtils.writeFile(instructionsPath, copilotInstructions);

    const writtenFiles = [instructionsPath];

    for (const agent of data.agents) {
        const content = withGeneratedBanner(`---\nname: ${agent.name}\ndescription: ${instructionTitle(agent.name)} agent\n---\n\n# ${instructionTitle(agent.name)}\n\n${agent.content}\n`);
        const outPath = path.join(agentsDir, `${agent.name}.md`);
        fsUtils.writeFile(outPath, content);
        writtenFiles.push(outPath);
    }

    const promptsDir = path.join(outDir, 'prompts');
    fsUtils.mkdir(promptsDir);

    for (const task of data.tasks) {
        const firstLine = task.content.split('\n')[0] ?? '';
        const description = firstLine.replace(/^#+\s*/, '').trim();
        const content = withGeneratedBanner(`---\nmode: 'agent'\ndescription: '${description}'\n---\n\n${task.content}\n`);
        const outPath = path.join(promptsDir, `${task.name}.prompt.md`);
        fsUtils.writeFile(outPath, content);
        writtenFiles.push(outPath);
    }

    return { writtenFiles };
}
