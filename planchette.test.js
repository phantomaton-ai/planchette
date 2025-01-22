import { expect } from 'lovecraft';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import planchette from './planchette.js';

describe('Planchette', () => {
  const tempDir = os.tmpdir();

  it('should create a planchette instance', () => {
    const api = planchette({ rootDir: tempDir });
    expect(api).not.to.be.undefined;
  });

  it('should write and read a file', async () => {
    const api = planchette({ rootDir: tempDir });
    const testFile = path.join(tempDir, 'test.txt');
    const testContent = 'Hello, Phantomaton!';

    await api.write(testFile, testContent);
    const readContent = await api.read(testFile);

    expect(readContent).to.equal(testContent);
  });

  it('should replace text in a file', async () => {
    const api = planchette({ rootDir: tempDir });
    const testFile = path.join(tempDir, 'replace-test.txt');
    const initialContent = 'The quick brown fox';
    
    await api.write(testFile, initialContent);
    await api.replace(testFile, 'brown', 'spectral');

    const updatedContent = await api.read(testFile);
    expect(updatedContent).to.equal('The quick spectral fox');
  });
});