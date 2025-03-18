import { expect, stub } from 'lovecraft';
import Session from './session.js';

describe('Session', () => {
  let session;
  let adapterStub;

  beforeEach(() => {
    // Create stub adapter
    adapterStub = {
      read: stub().resolves('file content'),
      write: stub().resolves(),
      remove: stub().resolves()
    };
    
    // Create session with stubbed adapter
    session = new Session({
      adapter: adapterStub,
      home: '/test/home'
    });
  });

  describe('constructor', () => {
    it('creates a workspace with provided options', () => {
      expect(session.workspace).to.exist;
    });
  });

  describe('commands', () => {
    it('returns an array of commands', () => {
      const cmds = session.commands();
      
      expect(cmds).to.be.an('array');
      expect(cmds.length).to.be.greaterThan(0);
      
      // Check that each command has the required properties
      cmds.forEach(cmd => {
        expect(cmd).to.have.all.keys('name', 'description', 'example', 'execute', 'validate');
      });
    });
  });

  describe('display', () => {
    it('returns workspace display output', () => {
      // This test is simple since we'd need extensive mocking to test the actual display output
      // We're just verifying the method exists and runs without errors
      expect(() => session.display()).to.not.throw();
    });
  });
});