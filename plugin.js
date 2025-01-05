import plugins from 'phantomaton-plugins';
import system from 'phantomaton-system';

export default plugins.create([
  system.system.decorator(
    [],
    () => (prompt) => () => {
      const value = prompt();
      console.log(value);
      return value;
    }
  )
]);
