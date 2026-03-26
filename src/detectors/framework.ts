import { fsUtils } from '../utils/fs.js';
import path from 'path';
import type { ProjectProfile } from '../utils/types.js';

export function detectFramework(rootPath: string, language: ProjectProfile['language']): string {
  // JavaScript/TypeScript frameworks
  if (language === 'typescript' || language === 'javascript') {
    // Next.js
    if (fsUtils.exists(path.join(rootPath, 'next.config.js')) ||
        fsUtils.exists(path.join(rootPath, 'next.config.ts'))) {
      return 'next.js';
    }

    // Nuxt
    if (fsUtils.exists(path.join(rootPath, 'nuxt.config.ts')) ||
        fsUtils.exists(path.join(rootPath, 'nuxt.config.js'))) {
      return 'nuxt';
    }

    // Angular
    if (fsUtils.exists(path.join(rootPath, 'angular.json'))) {
      return 'angular';
    }

    // Vite
    if (fsUtils.exists(path.join(rootPath, 'vite.config.ts')) ||
        fsUtils.exists(path.join(rootPath, 'vite.config.js'))) {
      return 'vite';
    }

    // React (via Vite or CRA)
    const packageJsonPath = path.join(rootPath, 'package.json');
    if (fsUtils.exists(packageJsonPath)) {
      try {
        const pkg = fsUtils.readJSON(packageJsonPath);
          if ((pkg as any).dependencies?.react || (pkg as any).devDependencies?.react) {
          return 'react';
        }
          if ((pkg as any).dependencies?.vue || (pkg as any).devDependencies?.vue) {
          return 'vue';
        }
          if ((pkg as any).dependencies?.['@nestjs/core']) {
          return 'nestjs';
        }
          if ((pkg as any).dependencies?.express) {
          return 'express';
        }
      } catch {
        // Fall through
      }
    }
  }

  // Python frameworks
  if (language === 'python') {
    const pyprojectPath = path.join(rootPath, 'pyproject.toml');
    if (fsUtils.exists(pyprojectPath)) {
      const content = fsUtils.readFile(pyprojectPath);
      if (content.includes('django')) return 'django';
      if (content.includes('fastapi')) return 'fastapi';
      if (content.includes('flask')) return 'flask';
      if (content.includes('starlette')) return 'starlette';
    }

    const requirementsPath = path.join(rootPath, 'requirements.txt');
    if (fsUtils.exists(requirementsPath)) {
      const content = fsUtils.readFile(requirementsPath);
      if (content.includes('django')) return 'django';
      if (content.includes('fastapi')) return 'fastapi';
      if (content.includes('flask')) return 'flask';
    }
  }

  return 'unknown';
}
