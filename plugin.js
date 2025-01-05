import chalk from 'chalk';

import conversations from 'phantomaton-conversations';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import system from 'phantomaton-system';

const preamble = assistant =>
  assistant.preamble || (assistant.assistant && preamble(assistant.assistant));

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

  conversations.conversation.decorator(
    [],
    () => conversation => turns => {
      const instance = conversation(turns);
      const advance = async () => {
        const executed = preamble(instance);
        if (executed) {
          console.log(chalk.magenta(executed) + '\n');
        }
        const result = await instance.advance();
        return result;
      };
      return { advance };
    }
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
