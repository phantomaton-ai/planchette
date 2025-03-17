import { expect, stub } from 'lovecraft';
import Session from './session.js';
import Workspace from './workspace.js';
import commands from './commands.js';

// Stub the imported modules
stub(Workspace.prototype);
stub(commands);

describe('Session', () => {
  let session;
  let options;

  beforeEach(() => {
    // Reset stubs before each test
    Workspace.prototype.constructor.resetHistory();
    commands.resetHistory();
    
    // Mock workspace display method
    Workspace.prototype.display.returns('workspace display');
    
    // Sample command array
    const sampleCommands = ['command1', 'command2'];
    commands.returns(sampleCommands);
    
    // Test options
    options = { home: '/test/home' };
    
    // Create session
    session = new Session(options);
  });

  afterEach(() => {
    // Restore original behavior
    Workspace.prototype.constructor.restore();
    commands.restore();
  });

  describe('constructor', () => {
    it('creates a workspace with provided options', () => {
      expect(Workspace.prototype.constructor.calledOnce).to.be.true;
      expect(Workspace.prototype.constructor.firstCall.args[0]).to.deep.equal(options);
      expect(session.workspace).to.exist;
    });
  });

  describe('commands', () => {
    it('returns commands for the workspace', () => {
      const result = session.commands();
      
      expect(commands.calledOnce).to.be.true;
      expect(commands.firstCall.args[0]).to.equal(session.workspace);
      expect(result).to.deep.equal(['command1', 'command2']);
    });
  });

  describe('display', () => {
    it('delegates to workspace.display', () => {
      const result = session.display();
      
      expect(Workspace.prototype.display.calledOnce).to.be.true;
      expect(result).to.equal('workspace display');
    });
  });
});