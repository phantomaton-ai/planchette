import { expect, stub } from 'lovecraft';
import fs from 'fs/promises';
import path from 'path';

import Adapter from './adapter.js';

describe('Adapter', () => {
  let adapter;
  let fsStub;
  
  const testRoot = '/test/root';
  const testFile = 'test.txt';
  const testContent = 'Test file content';
  const fullPath = path.resolve(testRoot, testFile);
  
  beforeEach(() => {
    // Stub fs module methods
    fsStub = {
      readFile: stub(fs, 'readFile').resolves(testContent),
      writeFile: stub(fs, 'writeFile').resolves(),
      unlink: stub(fs, 'unlink').resolves(),
      mkdir: stub(fs, 'mkdir').resolves()
    };
    
    adapter = new Adapter(testRoot);
  });
  
  afterEach(() => {
    // Restore all stubs
    Object.values(fsStub).forEach(stub => stub.restore());
  });
  
  describe('read', () => {
    it('reads file content from the filesystem', async () => {
      const content = await adapter.read(testFile);
      
      expect(fsStub.readFile.calledOnce).to.be.true;
      expect(fsStub.readFile.firstCall.args[0]).to.equal(fullPath);
      expect(fsStub.readFile.firstCall.args[1]).to.equal('utf-8');
      expect(content).to.equal(testContent);
    });
    
    it('propagates errors from file reading', async () => {
      const error = new Error('File not found');
      fsStub.readFile.rejects(error);
      
      await expect(adapter.read(testFile)).to.be.rejectedWith(error);
    });
  });
  
  describe('write', () => {
    it('writes content to the filesystem', async () => {
      await adapter.write(testFile, testContent);
      
      // Should ensure directory exists first
      expect(fsStub.mkdir.calledOnce).to.be.true;
      expect(fsStub.mkdir.firstCall.args[0]).to.equal(path.dirname(fullPath));
      expect(fsStub.mkdir.firstCall.args[1]).to.deep.equal({ recursive: true });
      
      // Then write the file
      expect(fsStub.writeFile.calledOnce).to.be.true;
      expect(fsStub.writeFile.firstCall.args[0]).to.equal(fullPath);
      expect(fsStub.writeFile.firstCall.args[1]).to.equal(testContent);
      expect(fsStub.writeFile.firstCall.args[2]).to.equal('utf-8');
    });
    
    it('propagates errors from file writing', async () => {
      const error = new Error('Permission denied');
      fsStub.writeFile.rejects(error);
      
      await expect(adapter.write(testFile, testContent)).to.be.rejectedWith(error);
    });
  });
  
  describe('remove', () => {
    it('removes file from the filesystem', async () => {
      await adapter.remove(testFile);
      
      expect(fsStub.unlink.calledOnce).to.be.true;
      expect(fsStub.unlink.firstCall.args[0]).to.equal(fullPath);
    });
    
    it('propagates errors from file removal', async () => {
      const error = new Error('File not found');
      fsStub.unlink.rejects(error);
      
      await expect(adapter.remove(testFile)).to.be.rejectedWith(error);
    });
  });
  
  describe('constructor', () => {
    it('uses process.cwd() as default root', () => {
      const cwd = process.cwd();
      const defaultAdapter = new Adapter();
      
      expect(defaultAdapter.root).to.equal(cwd);
    });
    
    it('uses provided root path', () => {
      expect(adapter.root).to.equal(testRoot);
    });
  });
});