import { expect, stub } from 'lovecraft';
import Session from './session.js';
import Workspace from './workspace.js';
import * as commandsModule from './commands.js';

describe('Session', () => {
  let session;
  let options;
  let workspaceStub;
  let commandsStub;

  beforeEach(() => {
    // Test options
    options = { home: '/test/home' };
    
    // Stub the Workspace constructor instead of its prototype
    workspaceStub = {
      display: stub().returns('workspace display')
    };
    
    // Stub the original workspace constructor
    stub(Workspace.prototype, 'constructor').callsFake(function() {
      // Copy properties to the instance
      Object.assign(this, workspaceStub);
      return this;
    });
    
    // Stub the commands function
    commandsStub = stub(commandsModule, 'default').returns(['command1', 'command2']);
    
    // Create session
    session = new Session(options);
  });

  afterEach(() => {
    Workspace.prototype.constructor.restore();
    commandsModule.default.restore();
  });

  describe('constructor', () => {
    it('creates a workspace instance', () => {
      expect(session.workspace).to.exist;
    });
  });

  describe('commands', () => {
    it('returns commands for the workspace', () => {
      const result = session.commands();
      
      expect(commandsStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(['command1', 'command2']);
    });
  });

  describe('display', () => {
    it('delegates to workspace.display', () => {
      const result = session.display();
      
      expect(workspaceStub.display.calledOnce).to.be.true;
      expect(result).to.equal('workspace display');
    });
  });
});