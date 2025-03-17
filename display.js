const tickquote = str => '`' + str + '`';

const summarize = win => {
  let summary = '';

  if (!win.selecting()) {
    summary += `Cursor at position ${win.cursor}\n`;    
  } else {
    summary += `Selecting text from ${win.cursor} to ${win.end}:\n\n`;
    summary += '```\n';
    summary += `${win.selected()}`;
    summary += '```\n';
  }

  return summary;
}

export default class Display {
  constructor({ size }) {
    this.size = size || 16384;
  }

  render(windows) {
    let rendered = '# Workspace\n\n';
    let skipped = 0;

    windows.forEach((win, index) => {
      const file = tickquote(win.file.path);
      const header = index === 0 ? 
        `## Focused window: ${file}\n` :
        `## Background window #${index}: ${file}\n`;
      const content = ['```', win.view(), '```'].join('\n');
      const summary = index === 0 ? summarize(win) : '';
      const displayed = [header, content, summary].join('\n');
      if (displayed.length + rendered.length < this.size) {
        rendered += displayed;
      } else {
        skipped += 1;
      }
    });

    if (skipped > 0) {
      rendered += '## Hidden\n\n';
      rendered += `${skipped} windows hidden for space.`;
    }

    return rendered;
  }
}
