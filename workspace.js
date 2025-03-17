export default class Workspace {
  constructor({ adapter, display }) {
    this.adapter = adapter;
    this.display = new Display(display);
    this.windows = [];
  }

  current() {
    return this.windows[0];
  }

  open(path) {
    const win = this.find(file) || new Window(file);
    this.windows = [win, ...this.windows.filter(w => win !== w)];
  }
  
  close(path) {
    const win = this.find(file);
    this.windows = this.windows.filter(w => win !== w)];
  }

  focus(file) {
    const win = this.find(file);
    this.windows = [win, ...this.windows.filter(w => win !== w)];
  }

  display() {
    return this.display.render(this.windows);
  }

  find(path) {
    return this.windows.find(w => w.file.path === path);
  }
}
