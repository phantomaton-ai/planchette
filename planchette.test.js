import { expect } from 'lovecraft';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

import Session from './session.js';
import planchette from './planchette.js';

describe('Planchette', () => {
  const tmp = os.tmpdir();
  const testDir = path.join(tmp, `planchette-test-${Date.now()}`);
  const testFiles = {
    'test1.js': 'const greeting = "Hello";\nconst name = "World";\nconsole.log(greeting + ", " + name + "!");',
    'test2.txt': 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5'
  };
  
  let session;
  
  // Setup test files in temporary directory
  before(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });
  
  // Clean up test files
  after(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (err) {
      console.error('Error cleaning up test directory:', err);
    }
  });
  
  beforeEach(async () => {
    // Create test files
    for (const [filename, content] of Object.entries(testFiles)) {
      await fs.writeFile(path.join(testDir, filename), content);
    }

    // Create fresh session for each test
    session = planchette({ home: testDir });
  });

  it('starts a session with correct home directory', () => {
    expect(session).instanceof(Session);
    expect(session.workspace.home).to.equal(testDir);
  });
  
  it('opens a file and displays its content', async () => {
    // Get command implementations
    const cmds = session.commands();
    const openCmd = cmds.find(cmd => cmd.name === 'open');
    
    // Open a file
    await openCmd.perform({ file: 'test1.js' });
    
    // Verify the workspace display includes file content
    const display = session.display();
    expect(display).to.include('test1.js');
    expect(display).to.include('const greeting = "Hello";');
    expect(display).to.include('const name = "World";');
  });
  
  it('navigates through files with cursor positioning', async () => {
    // Get commands
    const cmds = session.commands();
    const openCmd = cmds.find(cmd => cmd.name === 'open');
    const beforeCmd = cmds.find(cmd => cmd.name === 'before');
    
    // Open a file
    await openCmd.perform({ file: 'test1.js' });
    
    // Position cursor before a specific text
    beforeCmd.perform({ target: 'World' });
    
    // Verify the display shows correct cursor position
    const display = session.display();
    expect(display).to.include('World');
    expect(display).to.include('Cursor at position');
  });
  
  it('selects text in a file', async () => {
    // Get commands
    const cmds = session.commands();
    const openCmd = cmds.find(cmd => cmd.name === 'open');
    const selectCmd = cmds.find(cmd => cmd.name === 'select');
    
    // Open a file
    await openCmd.perform({ file: 'test1.js' });
    
    // Select text between two points
    selectCmd.perform({ start: 'greeting', end: 'World' });
    
    // Verify the selection is displayed correctly
    const display = session.display();
    expect(display).to.include('Selecting text');
    expect(display).to.include('greeting');
  });
  
  it('edits text in a file', async () => {
    // Get commands
    const cmds = session.commands();
    const openCmd = cmds.find(cmd => cmd.name === 'open');
    const selectCmd = cmds.find(cmd => cmd.name === 'select');
    const editCmd = cmds.find(cmd => cmd.name === 'edit');
    
    // Open a file
    await openCmd.perform({ file: 'test1.js' });
    
    // Select text
    selectCmd.perform({ start: 'World', end: 'World' });
    
    // Replace it
    await editCmd.perform({ content: 'Universe' });
    
    // Verify the file was modified
    const content = await fs.readFile(path.join(testDir, 'test1.js'), 'utf-8');
    expect(content).to.include('Universe');
    expect(content).not.to.include('World');
  });
  
  it('manages multiple files in the workspace', async () => {
    // Get commands
    const cmds = session.commands();
    const openCmd = cmds.find(cmd => cmd.name === 'open');
    const focusCmd = cmds.find(cmd => cmd.name === 'focus');
    
    // Open two files
    await openCmd.perform({ file: 'test1.js' });
    await openCmd.perform({ file: 'test2.txt' });
    
    // Verify test2.txt is focused (opened last)
    let display = session.display();
    expect(display).to.include('Focused: `test2.txt`');
    
    // Focus back on test1.js
    focusCmd.perform({ file: 'test1.js' });
    
    // Verify test1.js is now focused
    display = session.display();
    expect(display).to.include('Focused: `test1.js`');
    
    // Both files should be visible in the workspace
    expect(display).to.include('test1.js');
    expect(display).to.include('test2.txt');
  });
  
  it('closes a file', async () => {
    // Get commands
    const cmds = session.commands();
    const openCmd = cmds.find(cmd => cmd.name === 'open');
    const closeCmd = cmds.find(cmd => cmd.name === 'close');
    
    // Open two files
    await openCmd.perform({ file: 'test1.js' });
    await openCmd.perform({ file: 'test2.txt' });
    
    // Close one file
    closeCmd.perform({ file: 'test2.txt' });
    
    // Verify the file is closed and no longer in workspace
    const display = session.display();
    expect(display).to.include('test1.js');
    expect(display).not.to.include('test2.txt');
  });
  
  it('scrolls through file content', async () => {
    // Create a larger test file with many lines
    const manyLines = Array.from({ length: 500 }, (_, i) => `Line ${i + 1}`).join('\n');
    await fs.writeFile(path.join(testDir, 'large.txt'), manyLines);
    
    // Get commands
    const cmds = session.commands();
    const openCmd = cmds.find(cmd => cmd.name === 'open');
    const scrollCmd = cmds.find(cmd => cmd.name === 'scroll');
    
    // Open the large file
    await openCmd.perform({ file: 'large.txt' });
    
    // Get initial display
    let display = session.display();
    expect(display).to.include('Line 1');
    
    // Scroll down
    scrollCmd.perform({ lines: 200 });
    
    // Verify scrolled display shows different content
    display = session.display();
    expect(display).to.include('Line 201');
    expect(display).not.to.include('Line 1');
  });
  
  it('handles drag selection', async () => {
    // Get commands
    const cmds = session.commands();
    const openCmd = cmds.find(cmd => cmd.name === 'open');
    const beforeCmd = cmds.find(cmd => cmd.name === 'before');
    const dragCmd = cmds.find(cmd => cmd.name === 'drag');
    
    // Open a file
    await openCmd.perform({ file: 'test1.js' });
    
    // Position cursor at specific point
    beforeCmd.perform({ target: 'greeting' });
    
    // Drag to another point
    dragCmd.perform({ target: 'World' });
    
    // Verify the selection
    const display = session.display();
    expect(display).to.include('Selecting text');
    expect(display).to.include('greeting');
    expect(display).to.include('World');
  });
});