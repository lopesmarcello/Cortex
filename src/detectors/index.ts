import { detectLanguage } from './language.js';
import { detectFramework } from './framework.js';
import { detectPackageManager } from './packageManager.js';
import { detectMonorepo } from './monorepo.js';
import { detectCicd } from './cicd.js';
import { detectExistingAi } from './existingAi.js';
import type { ProjectProfile } from '../utils/types.js';

export async function detectProject(rootPath: string): Promise<ProjectProfile> {
  const language = detectLanguage(rootPath);
  const framework = detectFramework(rootPath, language);
  const packageManager = detectPackageManager(rootPath, language);
  const monorepo = detectMonorepo(rootPath);
  const cicd = detectCicd(rootPath);
  const existingAi = detectExistingAi(rootPath);

  return {
    language,
    framework,
    packageManager,
    monorepo,
    cicd,
    existingAi,
  };
}

export { detectLanguage } from './language.js';
export { detectFramework } from './framework.js';
export { detectPackageManager } from './packageManager.js';
export { detectMonorepo } from './monorepo.js';
export { detectCicd } from './cicd.js';
export { detectExistingAi } from './existingAi.js';
