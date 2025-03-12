Planchette is a tool for creating, editing, and managing projects, targeted at large language models. It is sort of like an operating system or an IDE for LLMs. The name references the pointer used on a ouija board, as a metaphor for a tool used which lends agency to an unseen force.

# Concept

Large language models are built to work with text. Some command line tooling may be natively useful; graphical user interfaces probably won't be.

We want our LLM to have access to some basic filesystem style commands, with some additional customizations to simplify things for LLMs. For example, we'd like our LLMs to edit potentially-large text files without rewriting the whole thing every time; we want robust support for text replacement.

# Model

## Session

A session represents an LLM's current working system environment, similar to a command-line shell session. It offers the following API:

- `close(file)`: Remove a file from the active workspace.
- `edit(file, content, window?)`: Modify the content of a file
- `execute(command, input?)`: Execute a shell command.
- `open(file, window?)`: Open a file (or part of a file) in the workspace.
- `read(file, window?)`: Read a file (or part of a file)
- `remove(file)`: Remove a file
- `workspace`: An instance of the session workspace.

### Workspace

The primary use case of the workspace is to populate an LLM's system prompt with "open files", analogous to the tabs in a text editor or IDE.

- `files`: A list of open files.
- `windows`: A map of open files to their windows.
- `read()`: Get a map of open files to their windowed contents.

## Window

A valid context window for viewing a text file is one of the following:

* A regex, referring to the first match within the file (spanning from start to end of the match).
* An object with `start` and `end` properties, where each of `start` and `end` is one of:
  * A number, referring to the start of the corresponding line in the text file, starting at 0.
  * A string, referring to the first match within the text
  * A regex, referring to the first match within the text

Note that "first match" refers to the first match *after the start*, in the case of the `end` parameter.

# Form

We like to adhere to the Phantomaton style, exporting a single `planchette` function which instantiates
a new `Planchette` instance using some probvided options:

```
import planchette from 'planchette';

const options = {}; // TBD!
const session = planchette(options);
```

---

# Planchette 2

Vision for a future maturation: Planchette as an agent-oriented windowing environment. GNOME for LLMs.

Opinionated hypothesis: Exposing traditional GUIs to LLMs is generally inefficient and over-complicated; building LLM-oriented user interfaces around a paucity of text content will improve general token efficiency during the performance of complicated tasks, as well as effectiveness due to support for pruning of less-relevant semantic content.

## Session

* `applications`
* `clipboard`
* `configuration`
* `close(index)`
* `copy(index, target)`
* `focus(index)`
* `focused`: Window
* `hide(index)`
* `paste(index, target)`
* `scroll(index, position)` TODO: Position?
* `shortcut(hotkey)`
* `show(index)`
* `open(application, options, body)`
* `view(size)`
* `windows`

### Clipboard

* `content`

### Configuration

* `applications`: Available application
* `windows`: Number; maximum windows available

### Window

* `application`
* `instance`
* `content`
* `title`
* `width`
* `height`
* `scroll`
* `size`

## Application

* `run(options, body) -> Instance`

## Action

* `name`
* `body`
* `description`
* `examples`
* `hotkey`
* `options`
* `perform(options, body)`

### Example

* `description`
* `options`

### Option

* `name`
* `description`
* `type`
* `validate(value)`

## Instance

* `click(target)`
* `hover(target)`
* `drag(target)`
* `type(target, text)`
* `menu() -> Action[]`
* `view()`

### Browser

* `back()`
* `forward()`
* `navigate(url)`
* `navigation`
* `click(target)`
* `hover(target)`
* `type(text)`

### Editor

* `revert()`
* `save()`

### Terminal

* `execute(command)`