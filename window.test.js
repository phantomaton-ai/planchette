import { expect, stub } from 'lovecraft';
import Window from './window.js';

describe('Window', () => {
  let window;
  let file;
  const testContent = 'line1\nline2\nline3\nline4\nline5';

  beforeEach(() => {
    // Create stub file
    file = {
      path: '/test/file.txt',
      write: stub().resolves()
    };
    
    // Create window with test content
    window = new Window(file, testContent, { scroll: 0, size: 3 });
  });

  describe('constructor', () => {
    it('initializes with correct properties', () => {
      expect(window.file).to.equal(file);
      expect(window.content).to.equal(testContent);
      expect(window.state.scroll).to.equal(0);
      expect(window.size).to.equal(3);
      expect(window.lines).to.deep.equal(['line1', 'line2', 'line3', 'line4', 'line5']);
    });
    
    it('uses default options when not provided', () => {
      const defaultWindow = new Window(file, testContent);
      expect(defaultWindow.state.scroll).to.equal(0);
      expect(defaultWindow.size).to.equal(100);
    });
  });

  describe('before', () => {
    it('sets cursor position before the target', () => {
      window.before('line2');
      expect(window.cursor()).to.equal(testContent.indexOf('line2'));
      expect(window.selecting()).to.be.false;
    });
    
    it('throws error if target not found', () => {
      expect(() => window.before('nonexistent')).to.throw('Cannot find nonexistent');
    });
  });

  describe('after', () => {
    it('sets cursor position after the target', () => {
      window.after('line2');
      expect(window.cursor()).to.equal(testContent.indexOf('line2') + 'line2'.length);
      expect(window.selecting()).to.be.false;
    });
  });

  describe('cursor', () => {
    it('returns the current cursor position', () => {
      window.state.cursor = testContent.indexOf('line2');
      expect(window.cursor()).to.equal(testContent.indexOf('line2'));
    });
  });

  describe('select', () => {
    it('selects text between start and end targets', () => {
      window.select('line2', 'line3');
      
      // Check that we're selecting
      expect(window.selecting()).to.be.true;
      
      // Check selection bounds via selected()
      const selection = window.selected();
      expect(selection.start).to.equal(testContent.indexOf('line2'));
      expect(selection.end).to.equal(testContent.indexOf('line3') + 'line3'.length);
      
      // Check selected text
      const expectedText = testContent.substring(
        testContent.indexOf('line2'),
        testContent.indexOf('line3') + 'line3'.length
      );
      expect(window.selection()).to.equal(expectedText);
    });
  });

  describe('drag', () => {
    it('selects from current cursor to target', () => {
      // Position cursor at line2
      window.before('line2');
      
      // Drag to line3
      window.drag('line3');
      
      // Check that we're selecting
      expect(window.selecting()).to.be.true;
      
      // Check selection bounds
      const selection = window.selected();
      expect(selection.start).to.equal(testContent.indexOf('line2'));
      
      // Check selected text (should include line3)
      const expectedText = testContent.substring(
        testContent.indexOf('line2'),
        testContent.indexOf('line3') + 'line3'.length
      );
      expect(window.selection()).to.include('line2');
      expect(window.selection()).to.include('line3');
      expect(window.selection()).to.equal(expectedText);
    });
  });

  describe('edit', () => {
    it('replaces selected content', async () => {
      window.select('line2', 'line3');
      const newContent = 'replaced content';
      
      await window.edit(newContent);
      
      // Expected content should have line2 and line3 replaced
      const prefix = testContent.substring(0, testContent.indexOf('line2'));
      const suffix = testContent.substring(testContent.indexOf('line3') + 'line3'.length);
      const expectedContent = prefix + newContent + suffix;
      
      expect(window.content).to.equal(expectedContent);
      expect(file.write.calledOnce).to.be.true;
      expect(file.write.firstCall.args[0]).to.equal(newContent);
    });
    
    it('inserts at cursor when not selecting', async () => {
      // Position cursor at start of line2
      window.before('line2');
      const newContent = 'inserted ';
      
      await window.edit(newContent);
      
      // Expected content should have newContent inserted before line2
      const prefix = testContent.substring(0, testContent.indexOf('line2'));
      const suffix = testContent.substring(testContent.indexOf('line2'));
      const expectedContent = prefix + newContent + suffix;
      
      expect(window.content).to.equal(expectedContent);
      expect(file.write.calledOnce).to.be.true;
    });
  });

  describe('scroll', () => {
    it('scrolls down by specified lines', () => {
      window.scroll(2);
      const info = window.scrolled();
      expect(info.start).to.equal(3); // 1-based line number
    });
    
    it('does not scroll below 0', () => {
      window.scroll(-5);
      const info = window.scrolled();
      expect(info.start).to.equal(1); // First line
    });
    
    it('does not scroll beyond line count', () => {
      window.scroll(10);
      const info = window.scrolled();
      expect(info.start).to.equal(1); // Scrolled to show last lines
      expect(info.end).to.equal(5);   // Last line
    });
  });

  describe('selecting', () => {
    it('returns true when there is a selection', () => {
      window.select('line2', 'line3');
      expect(window.selecting()).to.be.true;
    });
    
    it('returns false when there is no selection', () => {
      window.before('line2');
      expect(window.selecting()).to.be.false;
    });
  });

  describe('selection', () => {
    it('returns selected text when selecting', () => {
      window.select('line2', 'line3');
      
      const expectedText = testContent.substring(
        testContent.indexOf('line2'),
        testContent.indexOf('line3') + 'line3'.length
      );
      expect(window.selection()).to.equal(expectedText);
    });
    
    it('returns empty string when not selecting', () => {
      window.before('line2');
      expect(window.selection()).to.equal('');
    });
  });

  describe('selected', () => {
    it('returns selected range', () => {
      window.select('line2', 'line3');
      
      const selection = window.selected();
      expect(selection.start).to.equal(testContent.indexOf('line2'));
      expect(selection.end).to.equal(testContent.indexOf('line3') + 'line3'.length);
    });
  });

  describe('find', () => {
    it('returns index of first occurrence of target', () => {
      const index = window.find('line3');
      expect(index).to.equal(testContent.indexOf('line3'));
    });
    
    it('finds target after specified position', () => {
      // Find the first occurrence of 'line' after line1
      const firstLinePos = testContent.indexOf('line1') + 'line1'.length;
      const index = window.find('line', firstLinePos);
      
      // Should find 'line' in 'line2'
      expect(index).to.equal(testContent.indexOf('line2'));
    });
    
    it('throws error if target not found', () => {
      expect(() => window.find('nonexistent')).to.throw('Cannot find nonexistent');
    });
  });

  describe('view', () => {
    it('returns visible lines based on scroll and size', () => {
      window.state.scroll = 1; // Start at line2
      window.size = 2;   // Show 2 lines
      
      expect(window.view()).to.equal('line2\nline3');
    });
  });

  describe('scrolling', () => {
    it('returns true when content exceeds window size', () => {
      window.size = 3; // Show only 3 lines
      expect(window.scrolling()).to.be.true;
    });
    
    it('returns true when scrolled down', () => {
      window.state.scroll = 1;
      expect(window.scrolling()).to.be.true;
    });
    
    it('returns false when all content visible', () => {
      window.size = 10; // More than lines available
      window.state.scroll = 0;
      expect(window.scrolling()).to.be.false;
    });
  });

  describe('scrolled', () => {
    it('returns correct scroll information', () => {
      window.state.scroll = 1;
      window.size = 2;
      
      const info = window.scrolled();
      expect(info.start).to.equal(2); // 1-based, line2
      expect(info.end).to.equal(3);   // Up to line3
      expect(info.total).to.equal(5); // Total 5 lines
    });
  });
});