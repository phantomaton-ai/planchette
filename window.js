export default class Window {
  constructor(file, content, options = {}) {
    this.file = file;
    this.content = content;
    this.scroll = options.scroll || 0;
    this.lines = content.split('\n');
    this.size = options.size || 100;
  }

  before(target) {
    // TODO
  }
  
  after(target) {
    // TODO
  }
  
  select(start, end) {
    // TODO
  }
  
  drag(target) {
    // TODO
  }
  
  edit(content) {
    // TODO
  }
  
  scroll(lines) {
    this.scroll = Math.max(0, Math.min(this.lines.length, this.scroll + lines));
  }

  view() {
    // TODO: Show lines frrom scroll to size
  }
}
