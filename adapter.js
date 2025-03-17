import fs from 'fs/promises';
import path from 'path';

export default class Adapter {
  async read(file) {
    return await fs.readFile(file, 'utf-8');
  }

  async remove(file) {
    await fs.unlink(file);
  }

  async write(file, content) {
    const directory = path.dirname(file);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(file, content, 'utf-8');
  }
}