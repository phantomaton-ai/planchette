import path from 'path';

import Adapter from './adapter.js';

export default class Home extends Adapter {
  constructor(root, adapter) {
    this.root = root;
    this.adapter = adapter;
  }

  read(file) {
    return this.adapter.read(path.resolve(this.root, file));
  }

  remove(file) {
    return this.adapter.remove(path.resolve(this.root, file));
  }

  async write(file, content) {
    return this.adapter.write(path.resolve(this.root, file), content);
  }
}
