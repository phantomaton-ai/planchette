const status = win => {
  let info = '';
  
  // Add scroll information
  const view = win.scrolled();
  info += win.scrolling() 
    ? `Lines ${view.start}-${view.end} of ${view.total}\n`
    : `Full content shown\n`;

  // Add cursor/selection information
  if (!win.selecting()) {
    info += `Cursor at position ${win.cursor}`;    
  } else {
    info += `Selecting text from ${win.cursor} to ${win.end}:\n\n`;
    info += '```\n';
    info += `${win.selected()}`;
    info += '```\n';
  }

  return info;
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
      const file = '`' + win.file.path + '`';
      const head = i === 0 ? 
        `## Focused: ${file}\n` :
        `## Window ${i}: ${file}\n`;
      const body = ['```', win.view(), '```'].join('\n');
      const info = i === 0 ? status(win) : status(win).split('\n')[0]; // Just scroll info for background windows
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