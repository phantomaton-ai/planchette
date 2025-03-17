import fs from 'fs/promises';
import path from 'path';

export default class Adapter {
  constructor(root) {
    this.root = root || process.cwd();
  }

  async read(filePath) {
    const fullPath = path.resolve(this.root, filePath);
    return await fs.readFile(fullPath, 'utf-8');
  }

  async remove(filePath) {
    const fullPath = path.resolve(this.root, filePath);
    await fs.unlink(fullPath);
  }

  async write(filePath, content) {
    const fullPath = path.resolve(this.root, filePath);
    const directory = path.dirname(fullPath);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
  }
}