import { loadConfig } from '../validators/config.js';
import { logger } from '../utils/logger.js';
import { syncAdapters } from '../adapters/index.js';
import { writeSyncState } from '../validators/syncStatus.js';

export interface SyncCommandOptions {
    copilot?: boolean;
    claude?: boolean;
    cursor?: boolean;
    tasksOnly?: boolean;
    silent?: boolean;
}

export function syncCommand(rootPath: string = process.cwd(), options: SyncCommandOptions = {}): void {
    const config = loadConfig(rootPath);
    if (!config) {
        logger.error('No syntra configuration found. Run `syntra init` first.');
        return;
    }

    const hasExplicitTarget = Boolean(options.copilot || options.claude || options.cursor);

    const result = syncAdapters(
        rootPath,
        config,
        hasExplicitTarget
            ? {
                copilot: options.copilot === true,
                claude: options.claude === true,
                cursor: options.cursor === true,
                tasksOnly: options.tasksOnly === true,
            }
            : {
                tasksOnly: options.tasksOnly === true,
            },
    );

    if (result.targets.length > 0) {
        writeSyncState(rootPath);
    }

    if (!options.silent) {
        if (result.targets.length === 0) {
            logger.warn('No adapters enabled to sync.');
            return;
        }

        if (options.tasksOnly) {
            logger.info('Tasks-only mode enabled: syncing active task artifacts only.');
        }

        logger.success(`Synced adapters: ${result.targets.join(', ')}`);
        logger.info(`Updated ${result.writtenFiles.length} file(s).`);
    }
}
