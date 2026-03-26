import { compileTemplate, type TemplateData } from './engine.js';
import {
  architectureTemplate,
  styleTemplate,
  testingTemplate,
  securityTemplate,
  deployTemplate,
} from './instructions/index.js';
import {
  codeGeneratorTemplate,
  codeReviewerTemplate,
  taskPlannerTemplate,
  bugFixerTemplate,
} from './agents/index.js';
import { taskTemplate, skillTemplate } from './files/index.js';

type TemplateType = 'instruction' | 'agent' | 'task' | 'skill';

interface TemplateEntry {
  type: TemplateType;
  name: string;
  template: string;
  description: string;
}

const templates: Map<string, TemplateEntry> = new Map([
  // Instruction templates
  [
    'architecture',
    {
      type: 'instruction',
      name: 'architecture',
      template: architectureTemplate,
      description: 'Project structure, modules, naming conventions, imports',
    },
  ],
  [
    'style',
    {
      type: 'instruction',
      name: 'style',
      template: styleTemplate,
      description: 'Code formatting, framework patterns, component conventions',
    },
  ],
  [
    'testing',
    {
      type: 'instruction',
      name: 'testing',
      template: testingTemplate,
      description: 'Test stack, patterns, coverage, component testing',
    },
  ],
  [
    'security',
    {
      type: 'instruction',
      name: 'security',
      template: securityTemplate,
      description: 'Input validation, secrets handling, safe code patterns',
    },
  ],
  [
    'deploy',
    {
      type: 'instruction',
      name: 'deploy',
      template: deployTemplate,
      description: 'Branch strategy, CI/CD, commit conventions, environment constraints',
    },
  ],
  // Agent templates
  [
    'code-generator',
    {
      type: 'agent',
      name: 'code-generator',
      template: codeGeneratorTemplate,
      description: 'Implements tasks step by step with human review between steps',
    },
  ],
  [
    'code-reviewer',
    {
      type: 'agent',
      name: 'code-reviewer',
      template: codeReviewerTemplate,
      description: 'Reviews code against project instructions with severity levels',
    },
  ],
  [
    'task-planner',
    {
      type: 'agent',
      name: 'task-planner',
      template: taskPlannerTemplate,
      description: 'Breaks features and requirements into structured task files',
    },
  ],
  [
    'bug-fixer',
    {
      type: 'agent',
      name: 'bug-fixer',
      template: bugFixerTemplate,
      description: 'Diagnoses root cause then implements minimal fix with regression test',
    },
  ],
  // File templates
  [
    'task',
    {
      type: 'task',
      name: 'task',
      template: taskTemplate,
      description: 'Task file with steps, references, and acceptance criteria',
    },
  ],
  [
    'skill',
    {
      type: 'skill',
      name: 'skill',
      template: skillTemplate,
      description: 'Reusable skill with trigger conditions, process, and constraints',
    },
  ],
]);

export function getTemplate(name: string): TemplateEntry | undefined {
  return templates.get(name);
}

export function hasTemplate(name: string): boolean {
  return templates.has(name);
}

export function listTemplates(type?: TemplateType): TemplateEntry[] {
  return Array.from(templates.values()).filter((t) => !type || t.type === type);
}

export function renderTemplate(name: string, data: TemplateData): string {
  const entry = getTemplate(name);
  if (!entry) {
    throw new Error(`Template not found: ${name}`);
  }
  return compileTemplate(entry.template, data);
}

export { TemplateData, TemplateType, TemplateEntry };