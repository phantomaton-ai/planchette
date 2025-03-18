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

    metamagic('close', 
      ({ file }) => workspace.close(file), 
      {
        attributes: {
          file: {
            description: 'File to close',
            validate: (file) => typeof file === 'string'
          }
        },
        example: {
          attributes: { file: 'test.txt' },
          description: 'Close the file test.txt'
        }
      }
    ),

    metamagic('focus', 
      ({ file }) => workspace.focus(file), 
      {
        attributes: {
          file: {
            description: 'File to focus on',
            validate: (file) => typeof file === 'string'
          }
        },
        example: {
          attributes: { file: 'utils.js' },
          description: 'Focus on the file utils.js'
        }
      }
    ),

    metamagic('before', 
      ({ target }) => workspace.current().before(target), 
      {
        attributes: {
          target: {
            description: 'Text to position cursor before',
            validate: (target) => typeof target === 'string'
          }
        },
        example: {
          attributes: { target: 'function' },
          description: 'Position cursor before the first occurrence of "function"'
        }
      }
    ),

    metamagic('after', 
      ({ target }) => workspace.current().after(target), 
      {
        attributes: {
          target: {
            description: 'Text to position cursor after',
            validate: (target) => typeof target === 'string'
          }
        },
        example: {
          attributes: { target: 'import' },
          description: 'Position cursor after the first occurrence of "import"'
        }
      }
    ),

    metamagic('select', 
      ({ start, end }) => workspace.current().select(start, end), 
      {
        attributes: {
          start: {
            description: 'Start marker for text selection',
            validate: (start) => typeof start === 'string'
          },
          end: {
            description: 'End marker for text selection',
            validate: (end) => typeof end === 'string'
          }
        },
        example: {
          attributes: { start: 'function', end: '}' },
          description: 'Select text from "function" to the next "}"'
        }
      }
    ),

    metamagic('drag', 
      ({ target }) => workspace.current().drag(target), 
      {
        attributes: {
          target: {
            description: 'Text to drag selection to',
            validate: (target) => typeof target === 'string'
          }
        },
        example: {
          attributes: { target: ';' },
          description: 'Select from current position to the next ";"'
        }
      }
    ),

    metamagic('edit', 
      ({ content }) => workspace.current().edit(content), 
      {
        attributes: {
          content: {
            description: 'Content to replace or insert',
            validate: (content) => typeof content === 'string'
          }
        },
        example: {
          attributes: { content: 'const newFunction = () => {};' },
          description: 'Replace selected text with a new function'
        }
      }
    ),

    metamagic('scroll', 
      ({ lines }) => workspace.current().scroll(parseInt(lines)), 
      {
        attributes: {
          lines: {
            description: 'Number of lines to scroll',
            validate: (lines) => typeof lines === 'string' && !isNaN(parseInt(lines))
          }
        },
        example: {
          attributes: { lines: '10' },
          description: 'Scroll down 10 lines'
        }
      }
    )
  ];
}