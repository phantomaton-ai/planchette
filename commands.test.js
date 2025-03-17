import { expect, stub } from 'lovecraft';
import commands from './commands.js';

describe('Commands', () => {
  let workspace;
  let window;
  let cmds;

  beforeEach(() => {
    // Create stub for workspace and window
    window = {
      before: stub(),
      after: stub(),
      select: stub(),
      drag: stub(),
      edit: stub(),
      scroll: stub()
    };
    
    workspace = {
      open: stub(),
      close: stub(),
      focus: stub(),
      current: stub().returns(window)
    };
    
    cmds = commands(workspace);
  });

  it('returns an array of command objects', () => {
    expect(cmds).to.be.an('array');
    expect(cmds.length).to.be.greaterThan(0);
  });

  describe('open command', () => {
    let openCmd;
    
    beforeEach(() => {
      openCmd = cmds.find(cmd => cmd.name === 'open');
    });
    
    it('has the correct properties', () => {
      expect(openCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
      expect(openCmd.name).to.equal('open');
      expect(openCmd.description).to.be.a('string');
      expect(openCmd.example).to.be.an('object');
    });
    
    it('validates file parameter', () => {
      expect(openCmd.validate({ file: 'test.txt' })).to.be.true;
      expect(openCmd.validate({ file: 123 })).to.be.false;
      expect(openCmd.validate({})).to.be.false;
    });
    
    it('calls workspace.open with file parameter', () => {
      openCmd.perform({ file: 'test.txt' });
      expect(workspace.open.calledOnce).to.be.true;
      expect(workspace.open.firstCall.args[0]).to.equal('test.txt');
    });
  });

  describe('close command', () => {
    let closeCmd;
    
    beforeEach(() => {
      closeCmd = cmds.find(cmd => cmd.name === 'close');
    });
    
    it('has the correct properties', () => {
      expect(closeCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
    });
    
    it('validates file parameter', () => {
      expect(closeCmd.validate({ file: 'test.txt' })).to.be.true;
      expect(closeCmd.validate({ file: 123 })).to.be.false;
    });
    
    it('calls workspace.close with file parameter', () => {
      closeCmd.perform({ file: 'test.txt' });
      expect(workspace.close.calledOnce).to.be.true;
      expect(workspace.close.firstCall.args[0]).to.equal('test.txt');
    });
  });

  describe('focus command', () => {
    let focusCmd;
    
    beforeEach(() => {
      focusCmd = cmds.find(cmd => cmd.name === 'focus');
    });
    
    it('calls workspace.focus with file parameter', () => {
      focusCmd.perform({ file: 'test.txt' });
      expect(workspace.focus.calledOnce).to.be.true;
      expect(workspace.focus.firstCall.args[0]).to.equal('test.txt');
    });
  });

  describe('before command', () => {
    let beforeCmd;
    
    beforeEach(() => {
      beforeCmd = cmds.find(cmd => cmd.name === 'before');
    });
    
    it('calls window.before with target parameter', () => {
      beforeCmd.perform({ target: 'function' });
      expect(workspace.current.calledOnce).to.be.true;
      expect(window.before.calledOnce).to.be.true;
      expect(window.before.firstCall.args[0]).to.equal('function');
    });
  });

  describe('after command', () => {
    let afterCmd;
    
    beforeEach(() => {
      afterCmd = cmds.find(cmd => cmd.name === 'after');
    });
    
    it('calls window.after with target parameter', () => {
      afterCmd.perform({ target: 'import' });
      expect(window.after.calledOnce).to.be.true;
      expect(window.after.firstCall.args[0]).to.equal('import');
    });
  });

  describe('select command', () => {
    let selectCmd;
    
    beforeEach(() => {
      selectCmd = cmds.find(cmd => cmd.name === 'select');
    });
    
    it('calls window.select with start and end parameters', () => {
      selectCmd.perform({ start: 'function', end: '}' });
      expect(window.select.calledOnce).to.be.true;
      expect(window.select.firstCall.args[0]).to.equal('function');
      expect(window.select.firstCall.args[1]).to.equal('}');
    });
  });

  describe('drag command', () => {
    let dragCmd;
    
    beforeEach(() => {
      dragCmd = cmds.find(cmd => cmd.name === 'drag');
    });
    
    it('calls window.drag with target parameter', () => {
      dragCmd.perform({ target: ';' });
      expect(window.drag.calledOnce).to.be.true;
      expect(window.drag.firstCall.args[0]).to.equal(';');
    });
  });

  describe('edit command', () => {
    let editCmd;
    
    beforeEach(() => {
      editCmd = cmds.find(cmd => cmd.name === 'edit');
    });
    
    it('calls window.edit with content parameter', () => {
      const content = 'const newFunction = () => {};';
      editCmd.perform({ content });
      expect(window.edit.calledOnce).to.be.true;
      expect(window.edit.firstCall.args[0]).to.equal(content);
    });
  });

  describe('scroll command', () => {
    let scrollCmd;
    
    beforeEach(() => {
      scrollCmd = cmds.find(cmd => cmd.name === 'scroll');
    });
    
    it('calls window.scroll with lines parameter', () => {
      scrollCmd.perform({ lines: 10 });
      expect(window.scroll.calledOnce).to.be.true;
      expect(window.scroll.firstCall.args[0]).to.equal(10);
    });
  });
});