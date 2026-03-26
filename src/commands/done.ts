import { fsUtils } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { loadConfig } from '../validators/config.js';
import path from 'path';

export function doneCommand(taskId: string, rootPath: string = process.cwd()): void {
  const aiPath = path.join(rootPath, 'ai');
  const config = loadConfig(rootPath);
  const activeDir = config?.tasks?.activeDir ?? 'active';
  const doneDir = config?.tasks?.doneDir ?? 'done';

  const activeTaskPath = path.join(aiPath, 'tasks', activeDir, `${taskId}.task.md`);
  const doneTaskPath = path.join(aiPath, 'tasks', doneDir, `${taskId}.task.md`);

  if (!fsUtils.exists(activeTaskPath)) {
    logger.error(`Task not found: ai/tasks/${activeDir}/${taskId}.task.md`);
    return;
  }

  try {
    fsUtils.moveFile(activeTaskPath, doneTaskPath);
    logger.success(`Marked as done: ai/tasks/${doneDir}/${taskId}.task.md`);
  } catch (e) {
    logger.error(`Failed to move task: ${e}`);
  }
}
