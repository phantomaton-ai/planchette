const commands = workspace => [
  {
    name: 'open',
    description: 'Open the specified file in the current workspace',
    example: {
      description: 'Open the file test.txt in the home directory',
      options: { file: 'test.text' }
    },
    perform: ({ file }) => workspace.open(file),
    validate: ({ file }) => typeof file === 'string',
  }
];

export default commands;
