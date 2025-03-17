const validate = (index) => {
  if (index < 0) {
    throw new Error('Unknown target');
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
    this.state.cursor = this.find(target);
    this.state.end = this.state.cursor;
  }
  
  after(target) {
    this.state.cursor = this.find(target) + target.length;
    this.state.end = this.state.cursor;
  }

  cursor() {
    return this.state.cursor;
  }
  
  select(start, end) {
    // If start is a string, find its position
    if (typeof start === 'string') {
      this.state.cursor = this.find(start);
    } else {
      this.state.cursor = start;
    }
    
    // If end is a string, find its position
    if (typeof end === 'string') {
      this.state.end = this.find(end) + end.length;
    } else {
      this.state.end = end;
    }
  }
  
  drag(target) {
    const start = this.state.cursor;
    const end = this.find(target) + target.length;
    this.select(start, end);
  }
  
  async edit(content) {
    const before = this.content.slice(0, this.state.cursor);
    const after = this.content.slice(this.state.end);
    this.content = `${before}${content}${after}`;
    await this.file.write(content);
  }
  
  scroll(lines) {
    // Calculate new scroll position
    const newScroll = Math.max(0, Math.min(this.lines.length - 1, this.state.scroll + lines));
    this.state.scroll = newScroll;
  }

  selection() {
    return this.selecting() ? this.content.slice(this.state.cursor, this.state.end) : '';
  }

  selected() {
    return { start: this.state.cursor, end: this.state.end };
  }

  selecting() {
    return this.state.end > this.state.cursor;
  }

  find(target, skip = 0) {
    // Handle non-string targets
    if (typeof target !== 'string') {
      throw new Error(`Cannot find ${target}`);
    }
    
    const index = this.content.indexOf(target, skip);
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