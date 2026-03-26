import { fsUtils } from '../utils/fs.js';
import path from 'path';
import type { ProjectProfile } from '../utils/types.js';

export function detectPackageManager(
  rootPath: string,
  language: ProjectProfile['language']
): ProjectProfile['packageManager'] {
  // JavaScript/TypeScript package managers
  if (language === 'typescript' || language === 'javascript') {
    // npm (package-lock.json)
    if (fsUtils.exists(path.join(rootPath, 'package-lock.json'))) {
      return 'npm';
    }

    // yarn (yarn.lock)
    if (fsUtils.exists(path.join(rootPath, 'yarn.lock'))) {
      return 'yarn';
    }

    // pnpm (pnpm-lock.yaml)
    if (fsUtils.exists(path.join(rootPath, 'pnpm-lock.yaml'))) {
      return 'pnpm';
    }

    // bun (bun.lockb)
    if (fsUtils.exists(path.join(rootPath, 'bun.lockb'))) {
      return 'bun';
    }

    // Default to npm if package.json exists
    if (fsUtils.exists(path.join(rootPath, 'package.json'))) {
      return 'npm';
    }
  }

  // Python package managers
  if (language === 'python') {
    if (fsUtils.exists(path.join(rootPath, 'poetry.lock'))) {
      return 'python';
    }
    if (fsUtils.exists(path.join(rootPath, 'pipenv.lock'))) {
      return 'python';
    }
    if (fsUtils.exists(path.join(rootPath, 'requirements.txt'))) {
      return 'python';
    }
    return 'python';
  }

  return 'other';
}
