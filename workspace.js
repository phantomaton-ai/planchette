import Adapter from './adapter.js';
import Display from './display.js';
import File from './file.js';
import Home from './home.js';
import Window from './window.js';

export default class Workspace {
  constructor({ adapter, home, size }) {
    this.home = home || process.cwd();
    this.adapter = new Home(this.home, adapter || new Adapter());
    this.display = new Display({ size });
    this.windows = [];
  }

  current() {
    return this.windows[0];
  }

  async open(path) {
    const win = this.find(path) || await this.window(path);
    this.windows = [win, ...(this.windows.filter(w => win !== w))];
  }
  
  close(path) {
    const win = this.find(path);
    this.windows = this.windows.filter(w => win !== w);
  }

  focus(path) {
    const win = this.find(path);
    this.windows = [win, ...(this.windows.filter(w => win !== w))];
  }

  view() {
    return this.display.render(this.windows);
  }

  file(path) {
    return new File(path, this.adapter);
  }

  async window(path) {
    const file = this.file(path);
    const content = await file.read();
    return new Window(file, content);
  }

  find(path) {
    return this.windows.find(w => w.file.path === path);
  }
}
