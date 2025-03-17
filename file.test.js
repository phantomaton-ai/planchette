import { expect, stub } from 'lovecraft';
import File from './file.js';

describe('File', () => {
  let file;
  let adapter;
  const testPath = '/test/file.txt';
  const testContent = 'Test file content';

  beforeEach(() => {
    // Create a stub adapter
    adapter = {
      read: stub().resolves(testContent),
      write: stub().resolves(),
      remove: stub().resolves()
    };

    file = new File(testPath, adapter);
  });

  describe('read', () => {
    it('delegates to adapter.read with the correct path', async () => {
      const content = await file.read();
      
      expect(adapter.read.calledOnce).to.be.true;
      expect(adapter.read.firstCall.args[0]).to.equal(testPath);
      expect(content).to.equal(testContent);
    });
  });

  describe('write', () => {
    it('delegates to adapter.write with the correct path and content', async () => {
      await file.write(testContent);
      
      expect(adapter.write.calledOnce).to.be.true;
      expect(adapter.write.firstCall.args[0]).to.equal(testPath);
      expect(adapter.write.firstCall.args[1]).to.equal(testContent);
    });
  });

  describe('remove', () => {
    it('delegates to adapter.remove with the correct path', async () => {
      await file.remove();
      
      expect(adapter.remove.calledOnce).to.be.true;
      expect(adapter.remove.firstCall.args[0]).to.equal(testPath);
    });
  });
});