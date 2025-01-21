import { describe, it, expect } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import planchette from './planchette.js';

describe('Planchette', () => {
  const tempDir = os.tmpdir();

  it('should create a planchette instance', () => {
    const api = planchette({ rootDir: tempDir });
    expect(api).toBeTruthy();
  });

  it('should write and read a file', async () => {
    const api = planchette({ rootDir: tempDir });
    const testFile = path.join(tempDir, 'test.txt');
    const testContent = 'Hello, Phantomaton!';

    await api.write(testFile, testContent);
    const readContent = await api.read(testFile);

    expect(readContent).toBe(testContent);
  });

  it('should replace text with simple string replacement', async () => {
    const api = planchette({ rootDir: tempDir });
    const testFile = path.join(tempDir, 'replace-test.txt');
    const initialContent = 'The quick brown fox';
    
    await api.write(testFile, initialContent);
    await api.replace(testFile, 'brown', 'spectral');

    const updatedContent = await api.read(testFile);
    expect(updatedContent).toBe('The quick spectral fox');
  });

  it('should replace text with regex', async () => {
    const api = planchette({ rootDir: tempDir });
    const testFile = path.join(tempDir, 'regex-replace.txt');
    const initialContent = 'Hello 123 World 456';
    
    await api.write(testFile, initialContent);
    await api.replace(testFile, /\d+/g, 'NUMBER');

    const updatedContent = await api.read(testFile);
    expect(updatedContent).toBe('Hello NUMBER World NUMBER');
  });

  it('should replace text with transformation function', async () => {
    const api = planchette({ rootDir: tempDir });
    const testFile = path.join(tempDir, 'function-replace.txt');
    const initialContent = 'apple banana cherry';
    
    await api.write(testFile, initialContent);
    await api.replace(testFile, /\w+/g, (match) => match.toUpperCase());

    const updatedContent = await api.read(testFile);
    expect(updatedContent).toBe('APPLE BANANA CHERRY');
  });
});