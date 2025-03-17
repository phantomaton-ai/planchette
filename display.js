const quote = str => '`' + str + '`';

const scroll = win => {
  const view = win.scrolled();
  return win.scrolling() 
    ? `Lines ${view.start}-${view.end} of ${view.total}`
    : `Full content shown`;
};

const cursor = win => {
  if (!win.selecting()) {
    return `Cursor at position ${win.cursor()}`;    
  } else {
    const { start, end } = win.selected();
    return `Selecting text from ${start} to ${end}:\n\n` +
           '```\n' +
           `${win.selection()}` +
           '```\n';
  }
};

export default class Display {
  constructor({ size }) {
    this.size = size || 16384;
  }

  render(windows) {
    let text = '# Workspace\n\n';
    
    if (!windows.length) {
      return text + 'The Workspace is empty, no Windows are open.';
    }
    
    let hidden = 0;

    windows.forEach((win, i) => {
      const file = quote(win.file.path);
      const head = i === 0 ? 
        `## Focused: ${file}\n` :
        `## Window ${i}: ${file}\n`;
      const body = ['```', win.view(), '```'].join('\n');
      
      // Always show scroll info
      const scrollStatus = scroll(win);
      
      // Only show cursor info for focused window
      const info = i === 0 ? 
        [scrollStatus, cursor(win)].join('\n\n') : 
        scrollStatus;
      
      const block = [head, body, info].join('\n\n');
      
      if (block.length + text.length < this.size) {
        text += block + '\n\n';
      } else {
        hidden += 1;
      }
    });

    if (hidden > 0) {
      text += `## Hidden: ${hidden} windows`;
    }

    return text;
  }
}