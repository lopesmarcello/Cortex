import path from 'path';
import { fsUtils } from '../utils/fs.js';
import { loadCanonicalData, withGeneratedBanner, instructionTitle } from './common.js';
import type { AdapterResult } from './copilot.js';

function toMdc(description: string, body: string): string {
    return withGeneratedBanner(`---\ndescription: ${description}\nglobs: [\"**/*\"]\n---\n\n${body}\n`);
}

export function syncCursorAdapter(
    rootPath: string,
    activeTaskDir: string = 'active',
    tasksOnly: boolean = false,
): AdapterResult {
    const data = loadCanonicalData(rootPath, activeTaskDir);

    const rulesDir = path.join(rootPath, '.cursor', 'rules');
    fsUtils.mkdir(rulesDir);

    const writtenFiles: string[] = [];

    if (!tasksOnly) {
        for (const item of data.instructions) {
            const outPath = path.join(rulesDir, `${item.name}.mdc`);
            const content = toMdc(`${instructionTitle(item.name)} rules for this project`, item.content);
            fsUtils.writeFile(outPath, content);
            writtenFiles.push(outPath);
        }

        for (const agent of data.agents) {
            const outPath = path.join(rulesDir, `${agent.name}.mdc`);
            const content = toMdc(`${instructionTitle(agent.name)} agent rules`, agent.content);
            fsUtils.writeFile(outPath, content);
            writtenFiles.push(outPath);
        }

        for (const skill of data.skills) {
            const outPath = path.join(rulesDir, `${skill.name}.mdc`);
            const content = toMdc(`${instructionTitle(skill.name)} skill`, skill.content);
            fsUtils.writeFile(outPath, content);
            writtenFiles.push(outPath);
        }
    }

    for (const task of data.tasks) {
        const firstLine = task.content.split('\n')[0] ?? '';
        const description = firstLine.replace(/^#+\s*/, '').trim() || task.name;
        const outPath = path.join(rulesDir, `${task.name}.mdc`);
        const content = toMdc(`Active task: ${description}`, task.content);
        fsUtils.writeFile(outPath, content);
        writtenFiles.push(outPath);
    }

    return { writtenFiles };
}
