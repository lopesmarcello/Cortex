import fs from 'fs';
import path from 'path';


export const fsUtils = {
    exists: (filePath: string): boolean => {
        return fs.existsSync(filePath);
    },

    readFile: (filePath: string): string => {
        return fs.readFileSync(filePath, 'utf-8');
    },

    writeFile: (filePath: string, content: string): void => {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, content, 'utf-8');
    },

    readJSON: (filePath: string): Record<string, unknown> => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    },

    writeJSON: (filePath: string, data: Record<string, unknown>): void => {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    },

    listFiles: (dirPath: string, ext?: string): string[] => {
        if (!fs.existsSync(dirPath)) return [];
        return fs
            .readdirSync(dirPath)
            .filter((file) => {
                if (ext) {
                    return file.endsWith(ext);
                }
                return true;
            })
            .map((file) => path.join(dirPath, file));
    },

    mkdir: (dirPath: string): void => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    },

    isDirectory: (filePath: string): boolean => {
        if (!fs.existsSync(filePath)) return false;
        return fs.statSync(filePath).isDirectory();
    },

    removeFile: (filePath: string): void => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    },

    moveFile: (oldPath: string, newPath: string): void => {
        const dir = path.dirname(newPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.renameSync(oldPath, newPath);
    },

    copyFile: (src: string, dest: string): void => {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
    },

    copyDir: (srcDir: string, destDir: string): void => {
        if (!fs.existsSync(srcDir)) {
            return;
        }

        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true, force: true });
    },

    getProjectRoot: (startPath: string = process.cwd()): string => {
        let current = startPath;
        while (current !== path.dirname(current)) {
            if (fs.existsSync(path.join(current, 'package.json'))) {
                return current;
            }
            current = path.dirname(current);
        }
        return startPath;
    },
};
