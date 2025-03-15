export default class Workspace {
  constructor(session) {
    this.session = session;
    this.windows = [];
  }

  current() {
    return this.windows[0];
  }

  open(file) {
    // TODO
  }
  
  close(file) {
    // TODO
  }
  
  focus(file) {
    // TODO
  }

  display() {
    // TODO
  }
}
