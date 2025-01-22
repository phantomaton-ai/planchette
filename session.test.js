import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { planchette } from './session.js';

describe('Session', () => {
  let tempDir;
  let session;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planchette-'));
    session = planchette({ rootDir: tempDir });
  });

  it('should create a session', () => {
    expect(session).toBeTruthy();
    expect(session.workspace).toBeTruthy();
  });

  it('should open and read a file', async () => {
    const testFile = path.join(tempDir, 'test.txt');
    await fs.writeFile(testFile, 'Hello, Phantomaton!');
    
    await session.open('test.txt');
    const content = await session.read('test.txt');
    
    expect(content).toBe('Hello, Phantomaton!');
  });

  it('should open a file with a regex window', async () => {
    const testFile = path.join(tempDir, 'test.txt');
    await fs.writeFile(testFile, 'Hello, Phantomaton!\nSecond line.');
    
    const content = await session.read('test.txt', /Phantomaton/);
    expect(content).toBe('Phantomaton');
  });

  it('should edit a file', async () => {
    const testFile = path.join(tempDir, 'test.txt');
    await fs.writeFile(testFile, 'Original content');
    
    await session.edit('test.txt', 'Updated content');
    const content = await session.read('test.txt');
    
    expect(content).toBe('Updated content');
  });

  it('should execute shell commands', async () => {
    const result = await session.execute('echo "Hello, World!"');
    expect(result.stdout.trim()).toBe('Hello, World!');
  });

  it('should remove a file', async () => {
    const testFile = path.join(tempDir, 'test.txt');
    await fs.writeFile(testFile, 'Content to remove');
    
    await session.open('test.txt');
    await session.remove('test.txt');
    
    await expect(fs.access(testFile)).rejects.toThrow();
    expect(session.workspace.files).not.toContain(testFile);
  });
});