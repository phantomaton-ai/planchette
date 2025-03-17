import { expect, stub } from 'lovecraft';
import path from 'path';
import Home from './home.js';

describe('Home', () => {
  let home;
  let adapter;
  const testRoot = '/test/root';
  const testFile = 'file.txt';
  const fullPath = path.resolve(testRoot, testFile);
  const testContent = 'Test file content';

  beforeEach(() => {
    // Create a stub adapter
    adapter = {
      read: stub().resolves(testContent),
      write: stub().resolves(),
      remove: stub().resolves()
    };

    home = new Home(testRoot, adapter);
  });

  describe('read', () => {
    it('resolves file path and delegates to adapter.read', async () => {
      const content = await home.read(testFile);
      
      expect(adapter.read.calledOnce).to.be.true;
      expect(adapter.read.firstCall.args[0]).to.equal(fullPath);
      expect(content).to.equal(testContent);
    });
  });

  describe('write', () => {
    it('resolves file path and delegates to adapter.write', async () => {
      await home.write(testFile, testContent);
      
      expect(adapter.write.calledOnce).to.be.true;
      expect(adapter.write.firstCall.args[0]).to.equal(fullPath);
      expect(adapter.write.firstCall.args[1]).to.equal(testContent);
    });
  });

  describe('remove', () => {
    it('resolves file path and delegates to adapter.remove', async () => {
      await home.remove(testFile);
      
      expect(adapter.remove.calledOnce).to.be.true;
      expect(adapter.remove.firstCall.args[0]).to.equal(fullPath);
    });
  });

  describe('constructor', () => {
    it('stores the root directory and adapter', () => {
      expect(home.root).to.equal(testRoot);
      expect(home.adapter).to.equal(adapter);
    });
  });
});