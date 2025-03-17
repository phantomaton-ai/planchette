import { expect, stub } from 'lovecraft';
import Workspace from './workspace.js';
import Adapter from './adapter.js';
import Home from './home.js';
import Display from './display.js';
import File from './file.js';
import Window from './window.js';

describe('Workspace', () => {
  let workspace;
  let adapterStub;
  let homeStub;
  let displayStub;
  let fileStub;
  let windowStub;
  
  const testHome = '/test/home';
  const testPath = 'test.js';
  const testContent = 'Test file content';
  
  beforeEach(() => {
    // Stub adapter
    adapterStub = {
      read: stub().resolves(testContent),
      write: stub().resolves(),
      remove: stub().resolves()
    };
    
    // Stub home (which wraps adapter)
    homeStub = {
      read: stub().resolves(testContent),
      write: stub().resolves(),
      remove: stub().resolves()
    };
    
    // Stub File methods
    fileStub = {
      path: testPath,
      read: stub().resolves(testContent),
      write: stub().resolves(),
      remove: stub().resolves()
    };
    
    // Stub Window
    windowStub = {
      file: { path: testPath },
      content: testContent,
      view: stub().returns('Window view content')
    };
    
    // Stub Display
    displayStub = {
      render: stub().returns('Rendered workspace')
    };
    
    // Stub constructors
    stub(Home, 'prototype').returns(homeStub);
    stub(Display, 'prototype').returns(displayStub);
    stub(File, 'prototype').returns(fileStub);
    stub(Window, 'prototype').returns(windowStub);
    
    // Create workspace instance
    workspace = new Workspace({ 
      adapter: adapterStub,
      home: testHome,
      size: 1000
    });
  });
  
  afterEach(() => {
    Home.prototype.constructor.restore?.();
    Display.prototype.constructor.restore?.();
    File.prototype.constructor.restore?.();
    Window.prototype.constructor.restore?.();
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
      workspace.windows = [windowStub, { file: { path: 'other.js' } }];
      expect(workspace.current()).to.equal(windowStub);
    });
    
    it('returns undefined when no windows are open', () => {
      expect(workspace.current()).to.be.undefined;
    });
  });
  
  describe('open', () => {
    it('adds a new window when file not already open', async () => {
      // Setup Window constructor to return a new instance
      Window.prototype.constructor.returns(windowStub);
      
      await workspace.open(testPath);
      
      expect(workspace.windows.length).to.equal(1);
      expect(workspace.windows[0]).to.equal(windowStub);
    });
    
    it('moves existing window to front when already open', async () => {
      // Add a couple windows
      const window1 = { file: { path: 'first.js' } };
      const window2 = { file: { path: testPath } };
      workspace.windows = [window1, window2];
      
      await workspace.open(testPath);
      
      expect(workspace.windows.length).to.equal(2);
      expect(workspace.windows[0]).to.equal(window2); // Should now be first
      expect(workspace.windows[1]).to.equal(window1);
    });
  });
  
  describe('close', () => {
    it('removes window with matching path', () => {
      // Add windows
      const window1 = { file: { path: 'first.js' } };
      const window2 = { file: { path: testPath } };
      workspace.windows = [window1, window2];
      
      workspace.close(testPath);
      
      expect(workspace.windows.length).to.equal(1);
      expect(workspace.windows[0]).to.equal(window1);
    });
    
    it('does nothing if window not found', () => {
      // Add window
      const window1 = { file: { path: 'first.js' } };
      workspace.windows = [window1];
      
      workspace.close('nonexistent.js');
      
      expect(workspace.windows.length).to.equal(1);
      expect(workspace.windows[0]).to.equal(window1);
    });
  });
  
  describe('focus', () => {
    it('moves matching window to front', () => {
      // Add windows
      const window1 = { file: { path: 'first.js' } };
      const window2 = { file: { path: testPath } };
      workspace.windows = [window1, window2];
      
      workspace.focus(testPath);
      
      expect(workspace.windows.length).to.equal(2);
      expect(workspace.windows[0]).to.equal(window2); // Should now be first
      expect(workspace.windows[1]).to.equal(window1);
    });
    
    it('does nothing if window not found', () => {
      // Add window
      const window1 = { file: { path: 'first.js' } };
      workspace.windows = [window1];
      
      workspace.focus('nonexistent.js');
      
      expect(workspace.windows.length).to.equal(1);
      expect(workspace.windows[0]).to.equal(window1);
    });
  });
  
  describe('view', () => {
    it('delegates to display.render with windows', () => {
      workspace.windows = [windowStub];
      
      const result = workspace.view();
      
      expect(displayStub.render.calledOnce).to.be.true;
      expect(displayStub.render.firstCall.args[0]).to.equal(workspace.windows);
      expect(result).to.equal('Rendered workspace');
    });
  });
  
  describe('file', () => {
    it('creates a File with the right path and adapter', () => {
      const result = workspace.file(testPath);
      
      expect(File.prototype.constructor.calledOnce).to.be.true;
      expect(File.prototype.constructor.firstCall.args[0]).to.equal(testPath);
      expect(File.prototype.constructor.firstCall.args[1]).to.equal(workspace.adapter);
      expect(result).to.equal(fileStub);
    });
  });
  
  describe('window', () => {
    it('creates a Window with file and content', async () => {
      // Setup File to return content
      fileStub.read.resolves(testContent);
      
      const result = await workspace.window(testPath);
      
      expect(File.prototype.constructor.calledOnce).to.be.true;
      expect(fileStub.read.calledOnce).to.be.true;
      expect(Window.prototype.constructor.calledOnce).to.be.true;
      expect(Window.prototype.constructor.firstCall.args[0]).to.equal(fileStub);
      expect(Window.prototype.constructor.firstCall.args[1]).to.equal(testContent);
      expect(result).to.equal(windowStub);
    });
  });
  
  describe('find', () => {
    it('returns window with matching path', () => {
      // Add windows
      const window1 = { file: { path: 'first.js' } };
      const window2 = { file: { path: testPath } };
      workspace.windows = [window1, window2];
      
      const result = workspace.find(testPath);
      
      expect(result).to.equal(window2);
    });
    
    it('returns undefined if no matching window', () => {
      workspace.windows = [{ file: { path: 'first.js' } }];
      
      const result = workspace.find('nonexistent.js');
      
      expect(result).to.be.undefined;
    });
  });
});