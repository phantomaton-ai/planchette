# Planchette 🔮

A spectral project management tool for Large Language Models.

## Overview 👁️

Planchette is a tool designed for LLMs to manage projects and interact with files. The name references the pointer used on a ouija board, as a metaphor for a tool that lends agency to an unseen force.

Planchette provides file operations, text editing, and a windowed workspace view designed specifically for LLMs to effectively manipulate and navigate text files without having to rewrite entire files for each change.

## Installation 📦

```bash
npm install planchette
```

## Usage 🛠️

### Basic Setup

```javascript
import planchette from 'planchette';

// Create a new session
const session = planchette({
  home: '/path/to/project'
});

// Get available commands
const commands = session.commands();

// Get workspace representation
const display = session.display();
```

### Integration with LLMs 🧠

Planchette is designed to be integrated with LLM-powered applications. There are two key components that you'll need to incorporate:

1. **Commands** - These should be exposed as tools/functions to the LLM
2. **Workspace Display** - This should be included in the system prompt to show the LLM the current state

## Command Structure 📝

Each command in Planchette's command array has the following structure:

```javascript
{
  name: 'commandName',       // Name of the command
  description: 'Detailed description of what the command does',
  example: {
    description: 'Example usage description',
    options: { /* parameter examples */ }
  },
  perform: (options) => {},  // Function that performs the command
  validate: (options) => {}  // Validates the command parameters
}
```

When integrating with an LLM, you should:

1. Map these commands to the function-calling capabilities of your LLM
2. Use the `validate` function to verify parameters before execution
3. Call the `perform` function with the parameters provided by the LLM

## Available Features ✨

Planchette provides functionality in these core areas:

### File Management

- Opening files in the workspace
- Closing files when no longer needed
- Focusing on different files in the workspace

### Text Navigation

- Positioning the cursor before/after specific text
- Selecting text ranges between markers
- Dragging selections from cursor to target

### Text Editing

- Replacing selected text
- Inserting at cursor position
- Making incremental changes to files

### Content Viewing

- Scrolling through file content
- Displaying visible portions of files
- Showing cursor and selection state

## Workspace Display 🖥️

The workspace display is a formatted text representation of the current state, including:

- Open files with their content
- Current focus highlighting
- Cursor position and/or text selection
- Scrolling position information

Example output:

    # Workspace
    
    ## Focused: `app.js`
    ```
    function hello() {
      console.log("Hello world");
    }
    ```
    Lines 1-3 of 10
    Cursor at position 12
    
    ## Window 1: `utils.js`
    ```
    export function helper() {
      return 'utility function';
    }
    ```
    Lines 1-3 of 5
    ```

This display may be included in the LLM's system prompt to provide context about the current workspace state.

## Architecture 🏗️

Planchette follows a modular architecture with these key components:

- **Session** - Manages the overall environment and provides the main API
- **Workspace** - Tracks open files and their windows
- **Window** - Provides a view into a file with cursor/selection state
- **Commands** - Implements operations exposed to the LLM

## Contributing 🦄

We welcome contributions to the Planchette project! If you have any ideas, bug reports, or pull requests, please feel free to submit them on the [GitHub repository](https://github.com/phantomaton-ai/planchette).

## License 📄

Planchette is licensed under the [MIT License](LICENSE).