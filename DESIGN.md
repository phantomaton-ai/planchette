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
└─────┬───┬──────┘
      │   │
      │   ▼
      │ ┌────────────────┐
      └►│   Interface    │  Command interface for LLM operations
        └───────┬────────┘
                │
                ▼
        ┌────────────────┐
        │   Workspace    │  Manages open files and windows
        └───────┬────────┘
                │
                ▼
        ┌────────────────┐
        │     Window     │  Provides views into files
        └────────────────┘
```

## Component Responsibilities

### Session

The Session owns the Interface and Workspace, serving as the primary external API:

- Initializes and configures the workspace and interface
- Exposes command execution to external callers
- Generates system prompts for LLMs

```javascript
class Session {
  constructor(options = {}) {
    this.workspace = new Workspace(options);
    this.interface = new Interface(this.workspace);
  }
  
  // Primary API method
  async run(command, body) {
    return await this.interface[command](body);
  }
  
  // System prompt generation
  prompt() {
    return this.workspace.format();
  }
}
```

### Interface

The Interface implements all LLM commands, delegating to the Workspace and Windows:

```javascript
class Interface {
  constructor(workspace) {
    this.workspace = workspace;
  }
  
  // File commands
  open(file) {
    this.workspace.open(file);
    this.workspace.focus(file);
  }
  
  close(file) {
    this.workspace.close(file);
  }
  
  // Navigation commands
  focus(file) {
    this.workspace.focus(file);
  }
  
  before(target) {
    this.workspace.current().before(target);
  }
  
  after(target) {
    this.workspace.current().after(target);
  }
  
  // Selection commands
  select(start, end) {
    this.workspace.current().select(start, end);
  }
  
  drag(target, opts = {}) {
    // Uses cursor position as start point
    this.workspace.current().drag(target, opts);
  }
  
  // Editing commands
  edit(content) {
    const window = this.workspace.current();
    if (window.hasSelection()) {
      window.replace(content);
    } else {
      window.insert(content);
    }
  }
  
  // View commands
  scroll(lines) {
    this.workspace.current().scroll(lines);
  }
}
```

### Workspace

The Workspace manages open files, windows, and focus state:

```javascript
class Workspace {
  constructor(options = {}) {
    this.options = options;
    this.windows = {};         // Map of file paths to Window objects
    this.files = [];           // List of open files
    this.focused = null;       // Currently focused file
  }
  
  open(file) {
    if (!this.windows[file]) {
      this.windows[file] = new Window(file, this.options);
      this.files.push(file);
    }
    return this.windows[file];
  }
  
  close(file) {
    if (this.windows[file]) {
      this.files = this.files.filter(f => f !== file);
      delete this.windows[file];
      
      if (this.focused === file && this.files.length > 0) {
        this.focused = this.files[0];
      } else if (this.files.length === 0) {
        this.focused = null;
      }
    }
  }
  
  focus(file) {
    if (this.windows[file]) {
      this.focused = file;
    } else {
      // Optionally auto-open the file
      this.open(file);
      this.focused = file;
    }
  }
  
  current() {
    return this.focused ? this.windows[this.focused] : null;
  }
  
  format() {
    // Format workspace state for display in system prompt
    // Implementation details...
  }
}
```

### Window

A Window manages viewing and editing of a specific file:

```javascript
class Window {
  constructor(file, options = {}) {
    this.file = file;
    this.content = null;       // File content
    this.visibleLines = {      // Visible portion of file
      start: 0,
      end: 20                  // Default: show first 20 lines
    };
    this.cursor = {            // Cursor position
      line: 0,
      char: 0
    };
    this.selection = null;     // Current selection, if any
    
    // Load file content
    this.load();
  }
  
  async load() {
    // Load file content from disk
    // Implementation details...
  }
  
  // Navigation methods
  before(target) {
    const position = this.find(target);
    if (position) {
      this.cursor = position;
      this.selection = null;
    }
  }
  
  after(target) {
    const position = this.find(target);
    if (position) {
      // Adjust position to be after the target
      this.cursor = {
        line: position.line,
        char: position.char + target.length
      };
      this.selection = null;
    }
  }
  
  // Selection methods
  select(start, end) {
    const startPos = this.find(start);
    const endPos = this.find(end, startPos);
    if (startPos && endPos) {
      this.selection = {
        start: startPos,
        end: {
          line: endPos.line,
          char: endPos.char + end.length
        }
      };
      this.cursor = startPos;
    }
  }
  
  drag(target, opts = {}) {
    const startPos = this.cursor;
    const endPos = this.find(target, startPos);
    if (endPos) {
      this.selection = {
        start: startPos,
        end: opts.inclusive ? 
          { line: endPos.line, char: endPos.char + target.length } : 
          endPos
      };
    }
  }
  
  // Editing methods
  replace(content) {
    if (this.selection) {
      // Replace selected text with new content
      // Implementation details...
    }
  }
  
  insert(content) {
    // Insert content at cursor position
    // Implementation details...
  }
  
  // View methods
  scroll(lines) {
    this.visibleLines.start = Math.max(0, this.visibleLines.start + lines);
    this.visibleLines.end = this.visibleLines.start + 20; // Assuming 20-line window
  }
  
  // Utility methods
  find(target, startFrom = null) {
    // Find position of target in content, starting from optional position
    // Implementation details...
  }
  
  hasSelection() {
    return this.selection !== null;
  }
  
  // Display methods
  getVisibleContent() {
    // Return visible portion of content
    // Implementation details...
  }
  
  getSelectionPreview() {
    // Return a preview of selected text
    // Implementation details...
  }
  
  getCursorInfo() {
    // Return information about cursor position
    // Implementation details...
  }
}
```

## Command Implementation Examples

### `/open(file)`

Opens and focuses a file:

```javascript
// In Interface
open(file) {
  this.workspace.open(file);
  this.workspace.focus(file);
}

// Usage from Session
session.run('open', 'example.js');
```

### `/edit() { content }`

Edits current selection or inserts at cursor:

```javascript
// In Interface
edit(content) {
  const window = this.workspace.current();
  if (window.hasSelection()) {
    window.replace(content); 
  } else {
    window.insert(content);
  }
}

// Usage from Session
session.run('edit', 'const x = 42;');
```

### `/after() { target }`

Positions cursor after target text:

```javascript
// In Interface
after(target) {
  this.workspace.current().after(target);
}

// Usage from Session
session.run('after', 'function');
```

### `/select(start, end)`

Creates selection between two points:

```javascript
// In Interface
select(start, end) {
  this.workspace.current().select(start, end);
}

// Usage from Session
session.run('select', { start: 'function', end: '}' });
```

## System Prompt Representation

The workspace state is represented in the system prompt:

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

// Get system prompt representation
const prompt = session.prompt();
```

## File Structure

```
planchette/
├── planchette.js       # Main entry point
├── session.js          # Session implementation
├── interface.js        # Command interface implementation
├── workspace.js        # Workspace implementation
├── window.js           # Window implementation
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