const commands = workspace => [
  {
    name: 'open',
    description: 'Open the specified file in the current Workspace',
    example: {
      description: 'Open the file test.txt',
      options: { file: 'test.txt' }
    },
    perform: ({ file }) => workspace.open(file),
    validate: ({ file }) => typeof file === 'string',
  },
  {
    name: 'close',
    description: 'Close the specified file in the current Workspace',
    example: {
      description: 'Close the file test.txt',
      options: { file: 'test.txt' }
    },
    perform: ({ file }) => workspace.close(file),
    validate: ({ file }) => typeof file === 'string',
  },
  {
    name: 'focus',
    description: 'Focus on a specific file in the current Workspace',
    example: {
      description: 'Focus on the file utils.js',
      options: { file: 'utils.js' }
    },
    perform: ({ file }) => workspace.focus(file),
    validate: ({ file }) => typeof file === 'string',
  },
  {
    name: 'before',
    description: 'Position the cursor before specified text in the focused Window',
    example: {
      description: 'Position cursor before the first occurrence of "function"',
      options: { target: 'function' }
    },
    perform: ({ target }) => workspace.current().before(target),
    validate: ({ target }) => typeof target === 'string',
  },
  {
    name: 'after',
    description: 'Position the cursor after specified text in the focused Window',
    example: {
      description: 'Position cursor after the first occurrence of "import"',
      options: { target: 'import' }
    },
    perform: ({ target }) => workspace.current().after(target),
    validate: ({ target }) => typeof target === 'string',
  },
  {
    name: 'select',
    description: 'Select text between start and end markers in the focused Window',
    example: {
      description: 'Select text from "function" to the next "}"',
      options: { start: 'function', end: '}' }
    },
    perform: ({ start, end }) => workspace.current().select(start, end),
    validate: ({ start, end }) => typeof start === 'string' && typeof end === 'string',
  },
  {
    name: 'drag',
    description: 'Select text from current cursor position to specified target in the focused Window',
    example: {
      description: 'Select from current position to the next ";"',
      options: { target: ';' }
    },
    perform: ({ target }) => workspace.current().drag(target),
    validate: ({ target }) => typeof target === 'string',
  },
  {
    name: 'edit',
    description: 'Replace selected text or insert at cursor in the focused Window',
    example: {
      description: 'Replace selected text with "const newFunction = () => {};"',
      options: { content: 'const newFunction = () => {};' }
    },
    perform: ({ content }) => workspace.current().edit(content),
    validate: ({ content }) => typeof content === 'string',
  },
  {
    name: 'scroll',
    description: 'Scroll the focused Window up or down by specified lines',
    example: {
      description: 'Scroll down 10 lines',
      options: { lines: 10 }
    },
    perform: ({ lines }) => workspace.current().scroll(parseInt(lines)),
    validate: ({ lines }) => typeof lines === 'string' && !isNaN(parseInt(lines)),
  }
];

export default commands;