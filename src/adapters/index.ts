import type { Config } from '../utils/types.js';
import { syncCopilotAdapter } from './copilot.js';
import { syncClaudeAdapter } from './claude.js';
import { syncCursorAdapter } from './cursor.js';

export interface SyncOptions {
    copilot?: boolean;
    claude?: boolean;
    cursor?: boolean;
    tasksOnly?: boolean;
}

export interface SyncResult {
    targets: string[];
    writtenFiles: string[];
}

export function syncAdapters(rootPath: string, config: Config, options: SyncOptions = {}): SyncResult {
    const shouldSyncCopilot = options.copilot ?? config.adapters.copilot.enabled;
    const shouldSyncClaude = options.claude ?? config.adapters.claude.enabled;
    const shouldSyncCursor = options.cursor ?? config.adapters.cursor.enabled;

    const targets: string[] = [];
    const writtenFiles: string[] = [];

    if (shouldSyncCopilot) {
        const result = syncCopilotAdapter(rootPath, config.tasks?.activeDir ?? 'active', options.tasksOnly ?? false);
        targets.push('copilot');
        writtenFiles.push(...result.writtenFiles);
    }

    if (shouldSyncClaude) {
        const result = syncClaudeAdapter(rootPath, config.tasks?.activeDir ?? 'active', options.tasksOnly ?? false);
        targets.push('claude');
        writtenFiles.push(...result.writtenFiles);
    }

    if (shouldSyncCursor) {
        const result = syncCursorAdapter(rootPath, config.tasks?.activeDir ?? 'active', options.tasksOnly ?? false);
        targets.push('cursor');
        writtenFiles.push(...result.writtenFiles);
    }

    return { targets, writtenFiles };
}
