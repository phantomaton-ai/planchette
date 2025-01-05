import conversations from 'phantomaton-conversations';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import system from 'phantomaton-system';

import Planchette from './planchette.js';

export default plugins.create(configuration => {
  const planchette = new Planchette(configuration);
  return [
    ...planchette.commands().map(
      command => plugins.define(execution.command).as(command)
    ),
    conversations.conversation.decorator(
      [],
      () => conversation => planchette.conversation(conversation)
    ),
    system.system.decorator(
      [],
      () => system => planchette.system(system)
    )
  ];
});
