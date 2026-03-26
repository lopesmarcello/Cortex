import { fsUtils } from '../utils/fs.js';
import path from 'path';

export function detectExistingAi(rootPath: string): {
  copilot: boolean;
  claude: boolean;
  cursor: boolean;
} {
  return {
    copilot: fsUtils.exists(path.join(rootPath, '.github', 'copilot-instructions.md')),
    claude: fsUtils.isDirectory(path.join(rootPath, '.claude')),
    cursor: fsUtils.isDirectory(path.join(rootPath, '.cursor')),
  };
}
