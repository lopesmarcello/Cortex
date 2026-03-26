import { fsUtils } from '../utils/fs.js';
import path from 'path';

export function detectCicd(rootPath: string): string[] {
  const cicdSystems: string[] = [];

  // GitHub Actions
  if (fsUtils.isDirectory(path.join(rootPath, '.github', 'workflows')) ||
      fsUtils.exists(path.join(rootPath, '.github', 'workflows'))) {
    cicdSystems.push('github-actions');
  }

  // GitLab CI
  if (fsUtils.exists(path.join(rootPath, '.gitlab-ci.yml'))) {
    cicdSystems.push('gitlab-ci');
  }

  // Jenkins
  if (fsUtils.exists(path.join(rootPath, 'Jenkinsfile'))) {
    cicdSystems.push('jenkins');
  }

  // CircleCI
  if (fsUtils.isDirectory(path.join(rootPath, '.circleci'))) {
    cicdSystems.push('circleci');
  }

  return cicdSystems.length > 0 ? cicdSystems : [];
}
