import path from 'path';
import { fsUtils } from '../utils/fs.js';
import { loadCanonicalData, withGeneratedBanner, instructionTitle } from './common.js';
import type { AdapterResult } from './copilot.js';

const TASK_MARKER_START = '<!-- syntra:tasks:start -->';
const TASK_MARKER_END = '<!-- syntra:tasks:end -->';

function buildTaskBlock(data: { tasks: Array<{ name: string; content: string }> }): string {
    const taskSections = data.tasks
        .map((task) => `### ${task.name}\n\n${task.content}`)
        .join('\n\n');

    const taskBody = data.tasks.length > 0
        ? `## Active Tasks\n\n${taskSections}`
        : '## Active Tasks\n\nNo active tasks found.';

    return `${TASK_MARKER_START}\n${taskBody}\n${TASK_MARKER_END}`;
}

function isTaskSkillAliasName(name: string): boolean {
    return name === 'syntra-task' || name === 'task';
}

export function syncClaudeAdapter(
    rootPath: string,
    activeTaskDir: string = 'active',
    tasksOnly: boolean = false,
): AdapterResult {
    const data = loadCanonicalData(rootPath, activeTaskDir);

    const outDir = path.join(rootPath, '.claude');
    fsUtils.mkdir(outDir);

    const outPath = path.join(outDir, 'CLAUDE.md');
    const taskBlock = buildTaskBlock(data);

    if (tasksOnly && fsUtils.exists(outPath)) {
        const existing = fsUtils.readFile(outPath);
        const hasMarkers = existing.includes(TASK_MARKER_START) && existing.includes(TASK_MARKER_END);
        if (hasMarkers) {
            const markerPattern = new RegExp(`${TASK_MARKER_START}[\\s\\S]*?${TASK_MARKER_END}`);
            const updated = existing.replace(markerPattern, taskBlock);
            fsUtils.writeFile(outPath, updated);
            return { writtenFiles: [outPath] };
        }
    }

    const commandPaths: string[] = [];
    if (!tasksOnly) {
        const commandsDir = path.join(outDir, 'commands');
        fsUtils.mkdir(commandsDir);

        for (const skill of data.skills) {
            const commandPath = path.join(commandsDir, `${skill.name}.md`);
            fsUtils.writeFile(commandPath, withGeneratedBanner(skill.content));
            commandPaths.push(commandPath);

            if (isTaskSkillAliasName(skill.name)) {
                const aliasPath = path.join(commandsDir, 'task.md');
                if (aliasPath !== commandPath) {
                    fsUtils.writeFile(aliasPath, withGeneratedBanner(skill.content));
                    commandPaths.push(aliasPath);
                }
            }
        }
    }

    const instructionSections = data.instructions
        .map((item) => `## ${instructionTitle(item.name)}\n\n${item.content}`)
        .join('\n\n');

    const agentSections = data.agents
        .map((agent) => `### ${agent.name}\n\n${agent.content}`)
        .join('\n\n');

    const skillSections = data.skills
        .map((skill) => `### ${skill.name}\n\n${skill.content}`)
        .join('\n\n');

    const skillBlock = data.skills.length > 0
        ? `\n\n## Skills\n\n${skillSections}`
        : '';

    const content = withGeneratedBanner(`# Project Context\n\nRead the following instruction files before any task:\n\n${instructionSections}\n\n## Available Agents\n\n${agentSections}${skillBlock}\n\n${taskBlock}\n\n## Task Execution\nWhen working an active task, follow its steps sequentially. After each step:\n1. Implement the change\n2. Report what was done\n3. Wait for human review before proceeding\n`);

    fsUtils.writeFile(outPath, content);

    return { writtenFiles: [outPath, ...commandPaths] };
}
