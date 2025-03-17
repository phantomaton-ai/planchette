const validate = (index) => {
  if (index < 0) {
    throw new Exception('Unknown target');
  }
};

export default class Window {
  constructor(file, content, options = {}) {
    this.file = file;
    this.content = content;
    this.scroll = options.scroll || 0;
    this.lines = content.split('\n');
    this.size = options.size || 100;
    this.cursor = 0;
    this.end = this.cursor;
  }

  before(target) {
    this.cursor = this.index(target);
  }
  
  after(target) {
    this.cursor = this.index(target) + target.length;
  }
  
  select(start, end) {
    this.cursor = this.position(this.index(start));
    this.end = this.position(this.index(end));
  }
  
  drag(target) {
    this.cursor = this.index(target) + target.length;
  }
  
  async edit(content) {
    const before = this.content.slice(0, this.cursor);
    const after = this.content.slice(this.end);
    this.content = `${before}${content}${after}`;
    await this.file.write(content);
  }
  
  scroll(lines) {
    this.scroll = Math.max(0, Math.min(this.lines.length, this.scroll + lines));
  }

  selected() {
    return this.selecting() ? content.slice(this.cursor, this.end - this.cursor) : '';
  }

  selecting() {
    return this.end > this.cursor;
  }

  find(target) {
    const index = this.content.indexOf(target);
    if (index < 0) {
      throw new Error(`Cannot find ${target}`);
    }
    return index;
  }

  view() {
    return this.lines.slice(this.scroll, this.scroll + this.size).join('\n');
  }
  
  scrollInfo() {
    const visibleStart = this.scroll + 1; // 1-based line numbers for display
    const visibleEnd = Math.min(this.scroll + this.size, this.lines.length);
    const totalLines = this.lines.length;
    
    return {
      visibleStart,
      visibleEnd,
      totalLines,
      isComplete: visibleEnd === totalLines && visibleStart === 1
    };
  }
}