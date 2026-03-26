import path from 'path';
import { fsUtils } from '../utils/fs.js';
import { loadCanonicalData, withGeneratedBanner, instructionTitle } from './common.js';

export interface AdapterResult {
    writtenFiles: string[];
}

export function syncCopilotAdapter(rootPath: string): AdapterResult {
    const data = loadCanonicalData(rootPath);

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

    return { writtenFiles };
}
