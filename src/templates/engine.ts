import Handlebars from 'handlebars';
import type { ProjectProfile } from '../utils/types.js';

export interface TemplateData {
  projectProfile: ProjectProfile;
  projectName: string;
  [key: string]: unknown;
}

export function compileTemplate(template: string, data: TemplateData): string {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

export function registerHelper(name: string, fn: (...args: unknown[]) => string): void {
  Handlebars.registerHelper(name, fn);
}

// Register default helpers
registerHelper('if-equals', (a: unknown, b: unknown, options: any): string => {
  return a === b ? options.fn({}) : options.inverse({});
});

registerHelper('if-includes', (arr: unknown, item: unknown, options: any): string => {
  return Array.isArray(arr) && (arr as unknown[]).includes(item) ? options.fn({}) : options.inverse({});
});
