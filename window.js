const validate = (index) => {
  if (index < 0) {
    throw new Exception('Unknown target');
  }
};

export default class Window {
  constructor(file, content, options = {}) {
    this.file = file;
    this.content = content;
    this.state = {
      scroll: options.scroll || 0,
      cursor: 0,
      end: 0
    };
    this.lines = content.split('\n');
    this.size = options.size || 100;
  }

  before(target) {
    this.state.cursor = this.index(target);
  }
  
  after(target) {
    this.state.cursor = this.index(target) + target.length;
  }

  cursor() {
    return this.state.cursor;
  }
  
  select(start, end) {
    this.state.cursor = this.position(this.index(start));
    this.state.end = this.position(this.index(end));
  }
  
  drag(target) {
    this.state.cursor = this.index(target) + target.length;
  }
  
  async edit(content) {
    const before = this.content.slice(0, this.cursor);
    const after = this.content.slice(this.end);
    this.content = `${before}${content}${after}`;
    await this.file.write(content);
  }
  
  scroll(lines) {
    this.state.scroll = Math.max(0, Math.min(this.lines.length, this.state.scroll + lines));
  }

  selection() {
    return this.selecting() ? content.slice(this.state.cursor, this.state.end - this.state.cursor) : '';
  }

  selected() {
    return { start: this.state.cursor, end: this.state.end };
  }

  selecting() {
    return this.state.end > this.state.cursor;
  }

  find(target) {
    const index = this.content.indexOf(target);
    if (index < 0) {
      throw new Error(`Cannot find ${target}`);
    }
    return index;
  }

  view() {
    return this.lines.slice(this.state.scroll, this.state.scroll + this.size).join('\n');
  }
  
  scrolling() {
    return this.lines.length > this.size || this.state.scroll > 0;
  }
  
  scrolled() {
    return {
      start: this.state.scroll + 1, // 1-based line numbers for display
      end: Math.min(this.state.scroll + this.size, this.lines.length),
      total: this.lines.length
    };
  }
}