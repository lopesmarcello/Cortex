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

export function registerHelper(
  name: string,
  fn: (...args: unknown[]) => string
): void {
  Handlebars.registerHelper(name, fn);
}

// Register default helpers

// Handles both string equality and array inclusion:
// {{#if-includes projectProfile.language 'typescript'}} → checks string contains or equals
// {{#if-includes projectProfile.frameworks 'react'}} → checks array includes
registerHelper(
  'if-includes',
  function (this: unknown, value: unknown, search: unknown, options: any): string {
    if (typeof value === 'string' && typeof search === 'string') {
      return value.toLowerCase().includes(search.toLowerCase())
        ? options.fn(this)
        : options.inverse(this);
    }
    if (Array.isArray(value)) {
      return value.some(
        (item) =>
          typeof item === 'string' &&
          typeof search === 'string' &&
          item.toLowerCase() === search.toLowerCase()
      )
        ? options.fn(this)
        : options.inverse(this);
    }
    return options.inverse(this);
  }
);

// Strict equality check:
// {{#if-equals projectProfile.packageManager 'npm'}}
registerHelper(
  'if-equals',
  function (this: unknown, a: unknown, b: unknown, options: any): string {
    return a === b ? options.fn(this) : options.inverse(this);
  }
);

// Arithmetic helper for step numbering in task templates:
// {{math @index 1}} → outputs @index + 1
registerHelper('math', (a: unknown, b: unknown): string => {
  return String(Number(a) + Number(b));
});