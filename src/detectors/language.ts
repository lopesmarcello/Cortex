import { fsUtils } from '../utils/fs.js';
import path from 'path';
import type { ProjectProfile } from '../utils/types.js';

export function detectLanguage(rootPath: string): ProjectProfile['language'] {
  // Check for TypeScript/JavaScript
  const packageJsonPath = path.join(rootPath, 'package.json');
  if (fsUtils.exists(packageJsonPath)) {
    try {
      const pkg = fsUtils.readJSON(packageJsonPath);
        if ((pkg as any).devDependencies?.typescript || (pkg as any).dependencies?.typescript) {
        return 'typescript';
      }
      return 'javascript';
    } catch {
      // Fall through
    }
  }

  // Check for Python
  if (fsUtils.exists(path.join(rootPath, 'pyproject.toml')) ||
      fsUtils.exists(path.join(rootPath, 'setup.py')) ||
      fsUtils.exists(path.join(rootPath, 'requirements.txt'))) {
    return 'python';
  }

  // Check for Go
  if (fsUtils.exists(path.join(rootPath, 'go.mod'))) {
    return 'go';
  }

  // Check for Rust
  if (fsUtils.exists(path.join(rootPath, 'Cargo.toml'))) {
    return 'rust';
  }

  return 'other';
}
