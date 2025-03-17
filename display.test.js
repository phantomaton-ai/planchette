import { expect, stub } from 'lovecraft';
import Display from './display.js';

describe('Display', () => {
  let display;
  let window;

  beforeEach(() => {
    display = new Display({ size: 5000 });
    
    // Create a stub window object with all the methods we need
    window = {
      file: { path: 'test.js' },
      view: stub().returns('const test = true;'),
      scrolling: stub().returns(true),
      scrolled: stub().returns({ start: 1, end: 20, total: 100 }),
      selecting: stub().returns(false),
      cursor: 10,
      selected: stub().returns('selected text')
    };
  });

  describe('render', () => {
    it('renders an empty workspace message when no windows exist', () => {
      const result = display.render([]);
      
      expect(result).to.include('# Workspace');
      expect(result).to.include('The Workspace is empty, no Windows are open.');
    });
    
    it('renders a focused window with full status information', () => {
      const result = display.render([window]);
      
      expect(result).to.include('# Workspace');
      expect(result).to.include('## Focused: `test.js`');
      expect(result).to.include('const test = true;');
      expect(result).to.include('Lines 1-20 of 100');
      expect(result).to.include('Cursor at position 10');
    });
    
    it('renders a background window with only scroll information', () => {
      // Add a second window
      const window2 = { ...window, file: { path: 'second.js' } };
      const result = display.render([window, window2]);
      
      expect(result).to.include('## Window 1: `second.js`');
      expect(result).to.include('Lines 1-20 of 100');
      // Should not include cursor information for background window
      expect(result).not.to.include('Cursor at position 10');
    });
    
    it('shows selection information when window has selection', () => {
      window.selecting.returns(true);
      const result = display.render([window]);
      
      expect(result).to.include('Selecting text from 10 to');
      expect(result).to.include('selected text');
    });
    
    it('shows full content message when not scrolling', () => {
      window.scrolling.returns(false);
      const result = display.render([window]);
      
      expect(result).to.include('Full content shown');
    });

    it('shows hidden windows count when size limit is reached', () => {
      // Create a small display
      const smallDisplay = new Display({ size: 100 });
      
      // Create many windows to exceed size limit
      const windows = [window, { ...window, file: { path: 'second.js' } }];
      
      const result = smallDisplay.render(windows);
      
      expect(result).to.include('## Hidden: 1 windows');
    });
  });
});