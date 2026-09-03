import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class FileTaskStore {
  constructor(filePath) {
    this.filePath = path.resolve(filePath);
  }

  async read() {
    let content;
    try {
      content = await readFile(this.filePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') return { version: 1, tasks: [] };
      throw error;
    }

    const board = JSON.parse(content);
    if (board.version !== 1 || !Array.isArray(board.tasks)) {
      throw new Error('Unsupported Relayboard data format.');
    }
    return board;
  }

  async write(board) {
    const directory = path.dirname(this.filePath);
    const temporaryPath = `${this.filePath}.${process.pid}.tmp`;
    await mkdir(directory, { recursive: true });
    try {
      await writeFile(temporaryPath, `${JSON.stringify(board, null, 2)}\n`, 'utf8');
      await rename(temporaryPath, this.filePath);
    } finally {
      await unlink(temporaryPath).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
    }
  }
}
