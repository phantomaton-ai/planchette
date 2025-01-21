Planchette is a tool for creating, editing, and managing projects, targeted at large language models. It is sort of like an operarting system for LLMs. The name references the pointer used on a ouija board, as a metaphor for a tool used which lends agency to an unseen force.

# Concept

Large language models are built to work with text. Some command line tooling may be natively useful; graphical user interfaces probably won't be.

We want our LLM to have access to some basic filesystem style commands, with some additional customizations to simplify things for LLMs. For example, we'd like our LLMs to edit potentially-large text files without rewriting the whole thing every time; we want robust support for text replacement.

# Form

We like to adhere to the Phantomaton style, exporting a single `planchette` function which instantiates
a new `Planchette` instance using some probvided options:

```
import planchette from 'planchette';

const options = {}; // TBD!
const api = planchette(options);
```
