import { expect, stub } from 'lovecraft';
import path from 'path';
import Workspace from './workspace.js';

describe('Workspace', () => {
  let workspace;
  let adapterStub;
  
  const testHome = '/test/home';
  const testPath = 'test.js';
  const testContent = 'Test file content';
  
  beforeEach(() => {
    // Stub adapter methods
    adapterStub = {
      read: stub().resolves(testContent),
      write: stub().resolves(),
      remove: stub().resolves()
    };
    
    // Create workspace with stubbed adapter
    workspace = new Workspace({ 
      adapter: adapterStub,
      home: testHome
    });
  });
  
  describe('constructor', () => {
    it('initializes with correct properties', () => {
      expect(workspace.home).to.equal(testHome);
      expect(workspace.adapter).to.exist;
      expect(workspace.display).to.exist;
      expect(workspace.windows).to.be.an('array').that.is.empty;
    });
    
    it('uses process.cwd() as default home', () => {
      const defaultWorkspace = new Workspace({});
      expect(defaultWorkspace.home).to.equal(process.cwd());
    });
  });
  
  describe('current', () => {
    it('returns the first window', () => {
      const testWindow = { file: { path: testPath } };
      workspace.windows = [testWindow, { file: { path: 'other.js' } }];
      expect(workspace.current()).to.equal(testWindow);
    });
    
    it('returns undefined when no windows are open', () => {
      expect(workspace.current()).to.be.undefined;
    });
  });
  
  describe('open', () => {
    it('adds a new window when file not already open', async () => {
      await workspace.open(testPath);
      
      expect(workspace.windows.length).to.equal(1);
      expect(workspace.windows[0].file.path).to.equal(testPath);
      expect(workspace.windows[0].content).to.equal(testContent);
      
      // Verify adapter was called
      expect(adapterStub.read.calledOnce).to.be.true;
      expect(adapterStub.read.firstCall.args[0]).to.include(testPath);
    });
    
    it('moves existing window to front when already open', async () => {
      // First open a couple of files
      await workspace.open('first.js');
      await workspace.open(testPath);
      
      // Reset the read stub for clarity
      adapterStub.read.resetHistory();
      
      // Now reopen the second file
      await workspace.open(testPath);
      
      expect(workspace.windows.length).to.equal(2);
      expect(workspace.windows[0].file.path).to.equal(testPath);
      expect(workspace.windows[1].file.path).to.equal('first.js');
      
      // Adapter shouldn't be called again since file is already open
      expect(adapterStub.read.called).to.be.false;
    });
  });
  
  describe('close', () => {
    it('removes window with matching path', async () => {
      // Add windows
      await workspace.open('first.js');
      await workspace.open(testPath);
      
      workspace.close(testPath);
      
      expect(workspace.windows.length).to.equal(1);
      expect(workspace.windows[0].file.path).to.equal('first.js');
    });
    
    it('does nothing if window not found', async () => {
      // Add window
      await workspace.open('first.js');
      
      workspace.close('nonexistent.js');
      
      expect(workspace.windows.length).to.equal(1);
      expect(workspace.windows[0].file.path).to.equal('first.js');
    });
  });
  
  describe('focus', () => {
    it('moves matching window to front', async () => {
      // Add windows
      await workspace.open('first.js');
      await workspace.open(testPath);
      
      // Change order so first.js is at front
      workspace.focus('first.js');
      
      // Now focus the second file
      workspace.focus(testPath);
      
      expect(workspace.windows.length).to.equal(2);
      expect(workspace.windows[0].file.path).to.equal(testPath);
      expect(workspace.windows[1].file.path).to.equal('first.js');
    });
    
    it('does nothing if window not found', async () => {
      // Add window
      await workspace.open('first.js');
      
      workspace.focus('nonexistent.js');
      
      expect(workspace.windows.length).to.equal(1);
      expect(workspace.windows[0].file.path).to.equal('first.js');
    });
  });
  
  describe('view', () => {
    it('returns a string representation of the workspace', async () => {
      await workspace.open(testPath);
      
      const result = workspace.view();
      
      expect(result).to.be.a('string');
      expect(result).to.include('Workspace');
      expect(result).to.include(testPath);
    });
    
    it('shows empty workspace message when no windows open', () => {
      const result = workspace.view();
      
      expect(result).to.include('Workspace is empty');
    });
  });
  
  describe('file', () => {
    it('creates a File with the right path', () => {
      const result = workspace.file(testPath);
      
      expect(result.path).to.equal(testPath);
      expect(result.adapter).to.equal(workspace.adapter);
    });
  });
  
  describe('window', () => {
    it('creates a Window with file and content', async () => {
      const win = await workspace.window(testPath);
      
      expect(win.file.path).to.equal(testPath);
      expect(win.content).to.equal(testContent);
      expect(adapterStub.read.calledOnce).to.be.true;
    });
  });
  
  describe('find', () => {
    it('returns window with matching path', async () => {
      // Add windows
      await workspace.open('first.js');
      await workspace.open(testPath);
      
      const result = workspace.find(testPath);
      
      expect(result).to.exist;
      expect(result.file.path).to.equal(testPath);
    });
    
    it('returns undefined if no matching window', async () => {
      await workspace.open('first.js');
      
      const result = workspace.find('nonexistent.js');
      
      expect(result).to.be.undefined;
    });
  });
});