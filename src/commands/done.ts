import { fsUtils } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export function doneCommand(taskId: string, rootPath: string = process.cwd()): void {
  const aiPath = path.join(rootPath, 'ai');
  const activeTaskPath = path.join(aiPath, 'tasks', 'active', `${taskId}.task.md`);
  const doneTaskPath = path.join(aiPath, 'tasks', 'done', `${taskId}.task.md`);

  if (!fsUtils.exists(activeTaskPath)) {
    logger.error(`Task not found: ai/tasks/active/${taskId}.task.md`);
    return;
  }

  try {
    fsUtils.moveFile(activeTaskPath, doneTaskPath);
    logger.success(`Marked as done: ai/tasks/done/${taskId}.task.md`);
  } catch (e) {
    logger.error(`Failed to move task: ${e}`);
  }
}
