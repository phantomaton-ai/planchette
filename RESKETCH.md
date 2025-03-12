Reimagining Planchette as an agent-oriented tool:

```
import planchette from 'planchette';

planchette.configure({ ...options });

planchette('Write a poem to poem.txt').then(outcome => console.log(outcome));
```

Where options include:

* `converse(message, prompt)`: An asynchronous function to receive a reply from an LLM.
  * `message`: A string; the message being sent.
  * `prompt`: A string; the system prompt for the LLM.
* `home`: The working directory in which Planchette will run.

---

Implementation:

The LLM will run with a set of commands available to it:

- `close(file)`: Remove a file from the active workspace.
- `edit(file, content, window?)`: Modify the content of a file
- `execute(command, input?)`: Execute a shell command.
- `open(file, window?)`: Open a file (or part of a file) in the workspace.
- `read(file, window?)`: Read a file (or part of a file)
- `remove(file)`: Remove a file

It will also have access to a visible workspace of files.

Summarization may be used to simplify messaging.

Planchette is a good case for `phantomaton` invoked programmatically.

---

The way I'd like it to work:

```
import fs from 'fs';
import phantomaton from 'phantomaton';

import conversations from 'phantomaton-conversations';
import execution from 'phantomaton-execution';

import Assistant from './Assistant.js';
import commands from './commands.js';
import prompt from './prompt.js';
import User from './User.js';

const planchette = (task, options) => phantomaton(prompt(task), {
  [conversations.assistant]: new Assistant(options.converse),
  [conversations.user]: new User(),
  [execution.commands]: commands(options.home),
  [phantomaton.start]: ...,
});

export default planchette;
```

...which would require some changes to Phantomaton, but do-able. In particular:

* Take DI things as key-value pairs
* Return a result somehow (from start? sure)
