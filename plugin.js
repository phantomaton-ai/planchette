import chalk from 'chalk';

import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import system from 'phantomaton-system';

export default plugins.create([
  plugins.define(execution.commands).as(() => [{
    name: 'capitalize',
    validate: (attributes, body) => !!attributes.text,
    execute: (attributes) => attributes.text.toUpperCase(),
    example: { attributes: { text: 'Test' } },
    desription: 'Capitalizes text'
  }]),

  plugins.define(execution.commands).as(() => [{
    name: 'lowercase',
    validate: (attributes, body) => !!attributes.text,
    execute: (attributes) => attributes.text.toLowerCase(),
    example: { attributes: { text: 'Test' } },
    desription: 'Lower-cases text'
  }]),

  system.system.decorator(
    [],
    () => (prompt) => () => {
      const value = prompt();
      console.log(chalk.magenta(value));
      return value;
    }
  )
]);
