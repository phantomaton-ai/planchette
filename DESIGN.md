# Planchette Design

Planchette is a tool designed for LLMs to manage projects and interact with files. The name references a ouija board pointer, metaphorically giving agency to the LLM. This document outlines the architecture and design of Planchette.

## Core Design Philosophy

1. **LLM-Centric Interface**: Optimize for the way LLMs process and generate text
2. **Minimal Round Trips**: Support complex operations in a single message
3. **Stateful Editing**: Maintain cursor and selection state to enable incremental edits
4. **Plaintext Focus**: Work effectively with any text-based file format

## Architecture

Planchette follows a modular architecture with the following key components:

```
┌────────────────┐
│   Planchette   │  Main entry point - factory function
└───────┬────────┘
        │
        ▼
┌────────────────┐
│    Session     │  Manages the LLM's interaction context
└───────┬────────┘
        │
        ▼
┌────────────────┐     ┌────────────────┐
│   Commander    │◄────┤   Workspace    │  Command interface for LLM operations
└───────┬────────┘     └────────────────┘
        │
        ▼
┌────────────────┐     ┌────────────────┐
│     Window     │◄────┤    Editor      │  File views and text operations
└────────────────┘     └────────────────┘
```

### Session

The Session manages the LLM's current working system environment, similar to a shell session:

- Maintains a workspace state
- Holds a reference to the commander
- Serves as the primary external API

```javascript
class Session {
  constructor(options = {})
  
  // Public API - delegates to Commander
  async run(command, body)
  
  // Configuration
  config(options)
  
  // System prompt generation
  prompt()
}
```

### Commander

The Commander implements all command handlers and provides the interface for LLM operations:

- Exposes all command methods directly supporting the LLM interface
- Translates high-level commands to file operations
- Manages cursor and selection state through window objects

```javascript
class Commander {
  constructor(workspace, options = {})
  
  // File commands
  open(file)
  close(file)
  read(file, opts = {})
  edit(content, opts = {})
  remove(file)
  
  // Navigation commands
  focus(file)
  before(target)
  after(target)
  select(start, end, opts = {})
  drag(target, opts = {})
  
  // View commands
  scroll(lines)
  
  // System commands
  exec(command, input = null)
}
```

### Workspace

The Workspace manages open files and their display state:

- Tracks open files and windows
- Maintains focused window state
- Provides window access to the Commander

```javascript
class Workspace {
  constructor(options = {})
  
  // Window tracking
  add(file, opts = {})
  remove(file)
  focus(file)
  
  // Access
  files()
  windows()
  current()
  
  // State representation
  view()
}
```

### Window

A Window represents a view into a specific file:

- Tracks visible portion of a file
- Maintains cursor position
- Holds selection state
- Handles scrolling and navigation

```javascript
class Window {
  constructor(file, opts = {})
  
  // File access
  path()
  content()
  
  // Visibility
  span(start, end)
  scroll(lines)
  
  // Cursor and selection
  point(position)
  mark(start, end)
  clear()
  
  // Navigation
  goto(target, mode = 'before')
  
  // Representation
  text()
  preview()
  info()
}
```

### Editor

The Editor handles text manipulation operations:

- Performs text replacements
- Handles insertions at cursor positions
- Processes text transformations

```javascript
class Editor {
  constructor(window)
  
  // Content operations
  swap(selection, content)
  inject(content)
  place(position, content)
  
  // Text finding
  find(text, opts = {})
  seek(pattern, opts = {})
  line(num)
  range(start, end, opts = {})
}
```

## Command Implementation

Each command from EXPERIENCE.md maps directly to a Commander method:

### `/after() { target }`

Positions the cursor after the specified target text.

```javascript
commander.after(target) 
```

### `/before() { target }`

Positions the cursor before the specified target text.

```javascript
commander.before(target)
```

### `/close(file)`

Closes the specified file.

```javascript
commander.close(file)
```

### `/drag(inclusive) { target }`

Selects text from the current cursor position to the target.

```javascript
commander.drag(target, { inclusive })
```

### `/edit() { content }`

Replaces selection or inserts at cursor position.

```javascript
commander.edit(content)
```

### `/focus(file)`

Focuses the specified file.

```javascript
commander.focus(file)
```

### `/open(file)`

Opens and focuses the specified file.

```javascript
commander.open(file)
```

### `/scroll(lines)`

Scrolls the focused window.

```javascript
commander.scroll(lines)
```

### `/select(start, end)`

Creates a selection from start to end.

```javascript
commander.select(start, end)
```

## System Prompt Representation

The workspace state is represented in the system prompt with a format like:

```
WORKSPACE:

+===================== file.js (FOCUSED) ===============+
import foo from './foo.js';
import bar from './bar.js';

function example() {
  // Contents here
}
+=====================================================+
Lines 1-5 of 120
Cursor at line 3, char 1, before: function...

+===================== utils.js ======================+
export function helper() {
  return 'helper';
}
+=====================================================+
Lines 1-3 of 45
```

## Main Exports and API

The main module exports a factory function that returns a new Session instance:

```javascript
import planchette from 'planchette';

// Create a new session
const session = planchette({
  root: '/path/to/project'
});

// Use the session
await session.run('open', 'example.js');
await session.run('before', 'function');
await session.run('edit', '// Add a comment\n');
```

## File Structure

```
planchette/
├── planchette.js       # Main entry point
├── session.js          # Session implementation
├── commander.js        # Command interface implementation
├── workspace.js        # Workspace implementation
├── window.js           # Window implementation
├── editor.js           # Text editing operations
└── utils/
    ├── display.js      # Format text for display
    └── file.js         # File system utilities
```

## Future Extensions

1. **LLM Integration**: Direct integration with LLM frameworks
2. **Templates**: Project scaffolding capabilities
3. **Syntax Support**: Language-aware editing features
4. **Multi-File**: Coordinated changes across files
5. **Git Operations**: Version control integration