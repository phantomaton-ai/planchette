import Adapter from './adapter.js';
import Display from './display.js';

export default class Workspace {
  constructor({ adapter, display, home }) {
    this.home = home || process.cwd();
    this.adapter = new Home(this.home, adapter || new Adapter());
    this.display = new Display(display);
    this.windows = [];
  }

  current() {
    return this.windows[0];
  }

  open(path) {
    const win = this.find(file) || new Window(file);
    this.windows = [win, ...(this.windows.filter(w => win !== w))];
  }
  
  close(path) {
    const win = this.find(file);
    this.windows = this.windows.filter(w => win !== w);
  }

  focus(file) {
    const win = this.find(file);
    this.windows = [win, ...(this.windows.filter(w => win !== w))];
  }

  display() {
    return this.display.render(this.windows);
  }

  file(path) {
    return new File(path, this.adapter);
  }

  find(path) {
    return this.windows.find(w => w.file.path === path);
  }
}
