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
      expect(closeCmd.validate({})).to.be.false;
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
    
    it('has the correct properties', () => {
      expect(focusCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
    });
    
    it('validates file parameter', () => {
      expect(focusCmd.validate({ file: 'test.txt' })).to.be.true;
      expect(focusCmd.validate({ file: 123 })).to.be.false;
      expect(focusCmd.validate({})).to.be.false;
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
    
    it('has the correct properties', () => {
      expect(beforeCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
    });
    
    it('validates target parameter', () => {
      expect(beforeCmd.validate({ target: 'function' })).to.be.true;
      expect(beforeCmd.validate({ target: 123 })).to.be.false;
      expect(beforeCmd.validate({})).to.be.false;
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
    
    it('has the correct properties', () => {
      expect(afterCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
    });
    
    it('validates target parameter', () => {
      expect(afterCmd.validate({ target: 'import' })).to.be.true;
      expect(afterCmd.validate({ target: 123 })).to.be.false;
      expect(afterCmd.validate({})).to.be.false;
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
    
    it('has the correct properties', () => {
      expect(selectCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
    });
    
    it('validates start and end parameters', () => {
      expect(selectCmd.validate({ start: 'function', end: '}' })).to.be.true;
      expect(selectCmd.validate({ start: 'function', end: 123 })).to.be.false;
      expect(selectCmd.validate({ start: 123, end: '}' })).to.be.false;
      expect(selectCmd.validate({ start: 'function' })).to.be.false;
      expect(selectCmd.validate({ end: '}' })).to.be.false;
      expect(selectCmd.validate({})).to.be.false;
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
    
    it('has the correct properties', () => {
      expect(dragCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
    });
    
    it('validates target parameter', () => {
      expect(dragCmd.validate({ target: ';' })).to.be.true;
      expect(dragCmd.validate({ target: 123 })).to.be.false;
      expect(dragCmd.validate({})).to.be.false;
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
    
    it('has the correct properties', () => {
      expect(editCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
    });
    
    it('validates content parameter', () => {
      expect(editCmd.validate({ content: 'const x = 42;' })).to.be.true;
      expect(editCmd.validate({ content: 123 })).to.be.false;
      expect(editCmd.validate({})).to.be.false;
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
    
    it('has the correct properties', () => {
      expect(scrollCmd).to.include.keys('name', 'description', 'example', 'perform', 'validate');
    });
    
    it('validates lines parameter', () => {
      expect(scrollCmd.validate({ lines: 10 })).to.be.true;
      expect(scrollCmd.validate({ lines: -5 })).to.be.true; // Negative numbers are valid
      expect(scrollCmd.validate({ lines: '10' })).to.be.false;
      expect(scrollCmd.validate({})).to.be.false;
    });
    
    it('calls window.scroll with lines parameter', () => {
      scrollCmd.perform({ lines: 10 });
      expect(window.scroll.calledOnce).to.be.true;
      expect(window.scroll.firstCall.args[0]).to.equal(10);
    });
  });
});