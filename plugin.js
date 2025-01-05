import chalk from 'chalk';

import conversations from 'phantomaton-conversations';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import system from 'phantomaton-system';

export default plugins.create([
  plugins.define(execution.command).as({
    name: 'capitalize',
    validate: (attributes, body) => !!attributes.text,
    execute: (attributes) => attributes.text.toUpperCase(),
    example: { attributes: { text: 'Test' } },
    desription: 'Capitalizes text'
  }),

  plugins.define(execution.command).as({
    name: 'lowercase',
    validate: (attributes, body) => !!attributes.text,
    execute: (attributes) => attributes.text.toLowerCase(),
    example: { attributes: { text: 'Test' } },
    desription: 'Lower-cases text'
  }),

  conversations.assistant.decorator(
    [],
    () => (assistant) => ({
      async converse(turns, message) {
        const reply = await assistant.converse(turns, message);
        console.log(chalk.magenta(assistant.preamble));
        return reply;
      }
    })
  ),

  system.system.decorator(
    [],
    () => (prompt) => () => {
      const value = prompt();
      console.log(chalk.blue(value));
      return value;
    }
  )
]);
