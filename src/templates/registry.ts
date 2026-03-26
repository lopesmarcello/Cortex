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
  ['architecture', {
    type: 'instruction',
    name: 'architecture',
    template: architectureTemplate,
    description: 'Architecture and design patterns',
  }],
  ['style', {
    type: 'instruction',
    name: 'style',
    template: styleTemplate,
    description: 'Code style and conventions',
  }],
  ['testing', {
    type: 'instruction',
    name: 'testing',
    template: testingTemplate,
    description: 'Testing strategies and best practices',
  }],
  ['security', {
    type: 'instruction',
    name: 'security',
    template: securityTemplate,
    description: 'Security guidelines',
  }],
  ['deploy', {
    type: 'instruction',
    name: 'deploy',
    template: deployTemplate,
    description: 'Deployment procedures',
  }],
  // Agent templates
  ['code-generator', {
    type: 'agent',
    name: 'code-generator',
    template: codeGeneratorTemplate,
    description: 'Generates code following project instructions',
  }],
  ['code-reviewer', {
    type: 'agent',
    name: 'code-reviewer',
    template: codeReviewerTemplate,
    description: 'Reviews code against instructions',
  }],
  ['task-planner', {
    type: 'agent',
    name: 'task-planner',
    template: taskPlannerTemplate,
    description: 'Breaks features into task files',
  }],
  ['bug-fixer', {
    type: 'agent',
    name: 'bug-fixer',
    template: bugFixerTemplate,
    description: 'Diagnoses and fixes bugs',
  }],
  // File templates
  ['task', {
    type: 'task',
    name: 'task',
    template: taskTemplate,
    description: 'Task file template',
  }],
  ['skill', {
    type: 'skill',
    name: 'skill',
    template: skillTemplate,
    description: 'Skill file template',
  }],
]);

export function getTemplate(name: string): TemplateEntry | undefined {
  return templates.get(name);
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

export { TemplateData };
