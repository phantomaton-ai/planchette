# Planchette

A spectral project management tool for Large Language Models.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Planchette1.JPG/320px-Planchette1.JPG" align="right" width="150" alt="Planchette">

## Overview

Planchette is a tool designed for LLMs to manage projects and interact with files. The name references the pointer used on a ouija board, as a metaphor for a tool that lends agency to an unseen force.

Planchette provides file operations, text editing, and a windowed workspace view designed specifically for LLMs to effectively manipulate and navigate text files without having to rewrite entire files for each change.

## Features

- **File Management** - Open, close, and focus on multiple files
- **Text Selection** - Position cursor, select text ranges, and drag selections
- **Editing** - Replace selections or insert at cursor position
- **Navigation** - Scroll through file content
- **Workspace View** - See open files and current state in a formatted display

## Installation

```bash
npm install planchette
```

## Usage

### Basic Usage

```javascript
import planchette from 'planchette';

// Create a new session
const session = planchette({
  home: '/path/to/project'
});

// Get available commands
const commands = session.commands();

// Find specific commands
const openCmd = commands.find(cmd => cmd.name === 'open');
const editCmd = commands.find(cmd => cmd.name === 'edit');

// Use commands
await openCmd.perform({ file: 'example.js' });
await editCmd.perform({ content: '// Add a new comment\n' });

// Get workspace representation
const display = session.display();
console.log(display);
```

### Core Commands

Planchette provides a set of commands for LLMs to interact with files:

- **open(file)** - Open a file in the workspace
- **close(file)** - Close a file
- **focus(file)** - Focus on an open file
- **before(target)** - Position cursor before text
- **after(target)** - Position cursor after text
- **select(start, end)** - Select text between start and end
- **drag(target)** - Select from cursor to target
- **edit(content)** - Replace selection or insert at cursor
- **scroll(lines)** - Scroll up or down

### Example Workflow

```javascript
// Open a file
await openCmd.perform({ file: 'app.js' });

// Position cursor before specific text
beforeCmd.perform({ target: 'function main' });

// Add a comment above the function
await editCmd.perform({ content: '// Main application entry point\n' });

// Select the function signature
selectCmd.perform({ start: 'function main', end: ') {' });

// Replace it with an updated signature
await editCmd.perform({ content: 'function main(options = {})' });
```

## Architecture

Planchette follows a modular architecture with the following key components:

- **Session** - Manages the overall environment and workspace
- **Workspace** - Tracks open files and windows
- **Window** - Provides view into a file with cursor and selection state
- **Commands** - Implements operations for the LLM to use

## Workspace Display

The workspace is displayed to the LLM with file content, cursor information, and selection state:

```
# Workspace

## Focused: `app.js`
```
function hello() {
  console.log("Hello world");
}
```
Showing lines 1-3 of 10
Cursor at position 12

## Window 1: `utils.js`
```
export function helper() {
  return 'utility function';
}
```
Showing lines 1-3 of 5
```

## License

MIT