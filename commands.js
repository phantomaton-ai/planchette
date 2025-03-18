import metamagic from 'metamagic';

export default function createCommands(workspace) {
  return [
    metamagic(
      'open', 
      ({ file }) => workspace.open(file), 
      {
        attributes: { file: { description: 'File to open' } },
        description: 'Open the specified file in the current Workspace',
        example: {
          attributes: { file: 'test.txt' },
          description: 'Open the file test.txt'
        }
      }
    ),

    metamagic(
      'close', 
      ({ file }) => workspace.close(file), 
      {
        attributes: { file: { description: 'File to close' } },
        description: 'Close the specified file in the current Workspace',
        example: {
          attributes: { file: 'test.txt' },
          description: 'Close the file test.txt'
        }
      }
    ),

    metamagic(
      'focus', 
      ({ file }) => workspace.focus(file), 
      {
        attributes: { file: { description: 'File to focus on' } },
        description: 'Focus on a specific file in the current Workspace',
        example: {
          attributes: { file: 'utils.js' },
          description: 'Focus on the file utils.js'
        }
      }
    ),

    metamagic(
      'before', 
      ({ target }) => workspace.current().before(target), 
      {
        attributes: { target: { description: 'Text to position cursor before' } },
        description: 'Position the cursor before specified text in the focused Window',
        example: {
          attributes: { target: 'function' },
          description: 'Position cursor before the first occurrence of "function"'
        }
      }
    ),

    metamagic(
      'after', 
      ({ target }) => workspace.current().after(target), 
      {
        attributes: { target: { description: 'Text to position cursor after' } },
        description: 'Position the cursor after specified text in the focused Window',
        example: {
          attributes: { target: 'import' },
          description: 'Position cursor after the first occurrence of "import"'
        }
      }
    ),

    metamagic(
      'select', 
      ({ start, end }) => workspace.current().select(start, end), 
      {
        attributes: { 
          start: { description: 'Start marker for text selection' },
          end: { description: 'End marker for text selection' }
        },
        description: 'Select text between start and end markers in the focused Window',
        example: {
          attributes: { start: 'function', end: '}' },
          description: 'Select text from "function" to the next "}"'
        }
      }
    ),

    metamagic(
      'drag', 
      ({ target }) => workspace.current().drag(target), 
      {
        attributes: { target: { description: 'Text to drag selection to' } },
        description: 'Select text from current cursor position to specified target in the focused Window',
        example: {
          attributes: { target: ';' },
          description: 'Select from current position to the next ";"'
        }
      }
    ),

    metamagic(
      'edit', 
      ({ content }) => workspace.current().edit(content), 
      {
        attributes: { content: { description: 'Content to replace or insert' } },
        description: 'Replace selected text or insert at cursor in the focused Window',
        example: {
          attributes: { content: 'const newFunction = () => {};' },
          description: 'Replace selected text with a new function'
        }
      }
    ),

    metamagic(
      'scroll', 
      ({ lines }) => workspace.current().scroll(parseInt(lines)), 
      {
        attributes: { 
          lines: { 
            description: 'Number of lines to scroll',
            validate: (lines) => typeof lines === 'string' && !isNaN(parseInt(lines))
          } 
        },
        description: 'Scroll the focused Window up or down by specified lines',
        example: {
          attributes: { lines: '10' },
          description: 'Scroll down 10 lines'
        }
      }
    )
  ];
}