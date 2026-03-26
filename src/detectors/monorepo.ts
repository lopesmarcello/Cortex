import { fsUtils } from '../utils/fs.js';
import path from 'path';

export function detectMonorepo(rootPath: string): boolean {
  // npm workspaces
  const packageJsonPath = path.join(rootPath, 'package.json');
  if (fsUtils.exists(packageJsonPath)) {
    try {
      const pkg = fsUtils.readJSON(packageJsonPath);
      if (pkg.workspaces) {
        return true;
      }
    } catch {
      // Fall through
    }
  }

  // Lerna
  if (fsUtils.exists(path.join(rootPath, 'lerna.json'))) {
    return true;
  }

  // Nx
  if (fsUtils.exists(path.join(rootPath, 'nx.json'))) {
    return true;
  }

  // Turbo
  if (fsUtils.exists(path.join(rootPath, 'turbo.json'))) {
    return true;
  }

  return false;
}
