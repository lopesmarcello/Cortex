import fs from 'fs';
import path from 'path';
import { fsUtils } from '../utils/fs.js';
import type { Config } from '../utils/types.js';
import type { ValidationIssue } from './instructions.js';

export interface SyncState {
    lastSyncAt: string;
}

const SYNC_STATE_PATH = path.join('ai', '.sync-state.json');

function getMtime(filePath: string): number {
    return fs.statSync(filePath).mtimeMs;
}

function listAdapterFiles(rootPath: string, config: Config): string[] {
    const files: string[] = [];

    if (config.adapters.copilot.enabled) {
        const githubDir = path.join(rootPath, '.github');
        files.push(...fsUtils.listFiles(githubDir));
        files.push(...fsUtils.listFiles(path.join(githubDir, 'agents')));
    }

    if (config.adapters.claude.enabled) {
        files.push(...fsUtils.listFiles(path.join(rootPath, '.claude')));
    }

    if (config.adapters.cursor.enabled) {
        files.push(...fsUtils.listFiles(path.join(rootPath, '.cursor', 'rules')));
    }

    return files.filter((filePath) => fsUtils.exists(filePath));
}

function listCanonicalFiles(rootPath: string, config: Config): string[] {
    const activeDir = config.tasks?.activeDir ?? 'active';
    const doneDir = config.tasks?.doneDir ?? 'done';

    return [
        path.join(rootPath, 'ai', 'config.yml'),
        ...fsUtils.listFiles(path.join(rootPath, 'ai', 'instructions')).filter((file) => file.endsWith('.instructions.md')),
        ...fsUtils.listFiles(path.join(rootPath, 'ai', 'agents')).filter((file) => file.endsWith('.agent.md')),
        ...fsUtils.listFiles(path.join(rootPath, 'ai', 'skills')).filter((file) => file.endsWith('.skill.md')),
        ...fsUtils.listFiles(path.join(rootPath, 'ai', 'tasks', activeDir)).filter((file) => file.endsWith('.task.md')),
        ...fsUtils.listFiles(path.join(rootPath, 'ai', 'tasks', doneDir)).filter((file) => file.endsWith('.task.md')),
    ].filter((filePath) => fsUtils.exists(filePath));
}

export function writeSyncState(rootPath: string): void {
    const absolute = path.join(rootPath, SYNC_STATE_PATH);
    fsUtils.writeJSON(absolute, { lastSyncAt: new Date().toISOString() });
}

export function readSyncState(rootPath: string): SyncState | null {
    const absolute = path.join(rootPath, SYNC_STATE_PATH);
    if (!fsUtils.exists(absolute)) {
        return null;
    }

    try {
        const parsed = fsUtils.readJSON(absolute) as Record<string, unknown>;
        if (typeof parsed.lastSyncAt !== 'string' || !parsed.lastSyncAt) {
            return null;
        }
        return { lastSyncAt: parsed.lastSyncAt };
    } catch {
        return null;
    }
}

export function validateSyncStatus(rootPath: string, config: Config): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const adapterFiles = listAdapterFiles(rootPath, config);
    const canonicalFiles = listCanonicalFiles(rootPath, config);

    const enabledAdapters = [
        config.adapters.copilot.enabled ? '.github/' : null,
        config.adapters.claude.enabled ? '.claude/' : null,
        config.adapters.cursor.enabled ? '.cursor/' : null,
    ].filter(Boolean);

    if (enabledAdapters.length > 0 && adapterFiles.length === 0) {
        issues.push({
            level: 'warning',
            message: `Sync status: adapters enabled (${enabledAdapters.join(', ')}) but no adapter files were found.`,
        });
        return issues;
    }

    if (adapterFiles.length > 0 && canonicalFiles.length > 0) {
        const newestCanonical = Math.max(...canonicalFiles.map(getMtime));
        const oldestAdapter = Math.min(...adapterFiles.map(getMtime));

        if (newestCanonical > oldestAdapter) {
            issues.push({
                level: 'warning',
                message: 'Sync status: adapter files may be out of date. Run `syntra sync`.',
            });
        }
    }

    const syncState = readSyncState(rootPath);
    if (syncState) {
        const lastSyncMs = Date.parse(syncState.lastSyncAt);
        const manuallyEdited = adapterFiles.some((filePath) => getMtime(filePath) > lastSyncMs + 1000);

        if (manuallyEdited) {
            issues.push({
                level: 'warning',
                message: 'Sync status: adapter files appear manually edited and may be overwritten on next sync.',
            });
        }
    }

    return issues;
}
