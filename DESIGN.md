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
│   Workspace    │◄────┤     Window     │  Tracks open files and their views
└───────┬────────┘     └────────────────┘
        │
        ▼
┌────────────────┐     ┌────────────────┐
│     Editor     │◄────┤    Selector    │  Handles text editing and selection
└────────────────┘     └────────────────┘
```

### Session

The Session manages the LLM's current working system environment, similar to a shell session:

- Tracks the current workspace state
- Provides methods for file operations
- Executes system commands
- Maintains focus and selection state

```javascript
class Session {
  constructor(options = {})
  
  // File operations
  async open(file)
  close(file)
  async read(file, options = {})
  async edit(file, content, options = {})
  async remove(file)
  
  // Navigation and selection
  focus(file)
  before(target)
  after(target)
  select(start, end, options = {})
  drag(target, options = {})
  
  // Window management
  scroll(lines)
  
  // System operations
  async execute(command, input = null)
}
```

### Workspace

The Workspace manages open files and their display properties:

- Tracks open files
- Maintains focused file state
- Supports windowed views of files
- Handles cursor and selection state

```javascript
class Workspace {
  constructor(options = {})
  
  // Window management
  open(file, options = {})
  close(file)
  focus(file)
  
  // View properties
  getWindows()
  getFocusedWindow()
  
  // State representation
  getSystemPromptRepresentation()
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
  constructor(file, options = {})
  
  // Visibility
  setVisibleLines(start, end)
  scroll(lines)
  
  // Cursor and selection
  setCursor(position)
  setSelection(start, end)
  clearSelection()
  
  // Navigation
  moveCursorTo(target, mode = 'before')
  
  // Content representation
  getVisibleContent()
  getSelectionPreview()
  getCursorInfo()
}
```

### Editor

The Editor handles text manipulation operations:

- Performs text replacements
- Handles insertions at cursor positions
- Manages selection replacements
- Works with the Window's selection state

```javascript
class Editor {
  constructor(window)
  
  // Editing operations
  async replace(selection, content)
  async insertAtCursor(content)
  async insertAtPosition(position, content)
  
  // Selection operations
  async selectBetween(start, end, options = {})
  async selectFrom(start, options = {})
  async dragToTarget(target, options = {})
}
```

### Selector

The Selector interprets different ways of specifying text positions:

- Resolves line/character positions
- Finds text matches
- Handles regex patterns
- Supports landmark-based positioning

```javascript
class Selector {
  constructor(content)
  
  // Position resolution
  findPosition(target, mode = 'before')
  findRange(start, end, options = {})
  
  // Target types
  findText(text, options = {})
  findRegex(pattern, options = {})
  findLine(lineNumber)
}
```

## Command Implementation

Each command from EXPERIENCE.md is implemented as follows:

### `/after() { target }`

Sets the cursor position after the specified target text in the focused window.

```javascript
session.after(target) 
```

### `/before() { target }`

Sets the cursor position before the specified target text in the focused window.

```javascript
session.before(target)
```

### `/close(file)`

Closes the specified file.

```javascript
session.close(file)
```

### `/drag(inclusive) { target }`

Selects text from the current cursor position to the target.

```javascript
session.drag(target, { inclusive })
```

### `/edit() { content }`

Replaces the current selection with the provided content, or inserts at the cursor position if no selection exists.

```javascript
session.edit(focusedFile, content)
```

### `/focus(file)`

Focuses the specified file.

```javascript
session.focus(file)
```

### `/open(file)`

Opens and focuses the specified file.

```javascript
session.open(file)
```

### `/scroll(lines)`

Scrolls the focused window.

```javascript
session.scroll(lines)
```

### `/select(start, end)`

Creates a selection from start to end in the focused window.

```javascript
session.select(start, end)
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
Showing lines 1 through 5 of 120 (1-based)
Cursor at line 3, character 1, just before: function...

+===================== utils.js ======================+
export function helper() {
  return 'helper';
}
+=====================================================+
Showing lines 1 through 3 of 45 (1-based)
```

## Main Exports and API

The main module exports a factory function that returns a new Session instance:

```javascript
import planchette from 'planchette';

// Create a new session
const session = planchette({
  rootDir: '/path/to/project'
});

// Use the session
await session.open('example.js');
session.before('function');
session.edit('example.js', '// Add a comment\n');
```

## File Structure

```
planchette/
├── planchette.js       # Main entry point
├── session.js          # Session implementation
├── workspace.js        # Workspace implementation
├── window.js           # Window implementation
├── editor.js           # Text editing operations
├── selector.js         # Selection utilities
└── utils/
    ├── display.js      # Format text for display
    └── file.js         # File system utilities
```

## Future Extensions

1. **Integration with LLM Frameworks**: Direct integration with LLM providers
2. **Project Templates**: Quick-start project scaffolding
3. **Language-Specific Enhancements**: Syntax-aware editing for programming languages
4. **Multi-File Operations**: Coordinated changes across multiple files
5. **Version Control Integration**: Git operations and diff visualization