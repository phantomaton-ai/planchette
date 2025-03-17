export default class Workspace {
  constructor(session) {
    this.session = session;
    this.windows = [];
  }

  current() {
    return this.windows[0];
  }

  open(file) {
    const win = this.find(file) || new Window(file);
    this.windows = [win, ...this.windows.filter(w => win !== w)];
  }
  
  close(file) {
    const win = this.find(file);
    this.windows = this.windows.filter(w => win !== w)];
  }

  focus(file) {
    const win = this.find(file);
    this.windows = [win, ...this.windows.filter(w => win !== w)];
  }

  display() {
    // TODO: render
  }

  find(file) {
    return this.windows.find(w => w.file === file);
  }
}
