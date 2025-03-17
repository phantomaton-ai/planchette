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
      expect(window.scroll).to.equal(0);
      expect(window.size).to.equal(3);
      expect(window.cursor).to.equal(0);
      expect(window.end).to.equal(0);
      expect(window.lines).to.deep.equal(['line1', 'line2', 'line3', 'line4', 'line5']);
    });
    
    it('uses default options when not provided', () => {
      const defaultWindow = new Window(file, testContent);
      expect(defaultWindow.scroll).to.equal(0);
      expect(defaultWindow.size).to.equal(100);
    });
  });

  describe('before', () => {
    it('sets cursor to the index of the target', () => {
      window.before('line2');
      expect(window.cursor).to.equal(testContent.indexOf('line2'));
    });
    
    it('throws error if target not found', () => {
      expect(() => window.before('nonexistent')).to.throw('Cannot find nonexistent');
    });
  });

  describe('after', () => {
    it('sets cursor to the index after the target', () => {
      window.after('line2');
      const targetIndex = testContent.indexOf('line2');
      expect(window.cursor).to.equal(targetIndex + 'line2'.length);
    });
  });

  describe('select', () => {
    it('sets cursor to start and end to end position', () => {
      window.select('line2', 'line3');
      const startIndex = testContent.indexOf('line2');
      const endIndex = testContent.indexOf('line3');
      
      expect(window.cursor).to.equal(startIndex);
      expect(window.end).to.equal(endIndex);
    });
  });

  describe('drag', () => {
    it('sets cursor to index after target', () => {
      window.cursor = 5; // Set initial cursor position
      window.drag('line3');
      const targetIndex = testContent.indexOf('line3');
      
      expect(window.cursor).to.equal(targetIndex + 'line3'.length);
    });
  });

  describe('edit', () => {
    it('replaces content between cursor and end', async () => {
      window.cursor = 6; // Start of line2
      window.end = 17;   // Start of line4
      const newContent = 'replaced content';
      
      await window.edit(newContent);
      
      const expectedContent = 'line1\n' + newContent + 'line4\nline5';
      expect(window.content).to.equal(expectedContent);
      expect(file.write.calledOnce).to.be.true;
      expect(file.write.firstCall.args[0]).to.equal(newContent);
    });
    
    it('inserts at cursor when not selecting', async () => {
      window.cursor = 6; // Start of line2
      window.end = 6;    // Same position (no selection)
      const newContent = 'inserted ';
      
      await window.edit(newContent);
      
      const expectedContent = 'line1\n' + newContent + 'line2\nline3\nline4\nline5';
      expect(window.content).to.equal(expectedContent);
    });
  });

  describe('scroll', () => {
    it('scrolls down by specified lines', () => {
      window.scroll(2);
      expect(window.scroll).to.equal(2);
    });
    
    it('does not scroll below 0', () => {
      window.scroll(-5);
      expect(window.scroll).to.equal(0);
    });
    
    it('does not scroll beyond line count', () => {
      window.scroll(10);
      expect(window.scroll).to.equal(5); // 5 lines total
    });
  });

  describe('selecting', () => {
    it('returns true when end > cursor', () => {
      window.cursor = 5;
      window.end = 10;
      expect(window.selecting()).to.be.true;
    });
    
    it('returns false when end === cursor', () => {
      window.cursor = 5;
      window.end = 5;
      expect(window.selecting()).to.be.false;
    });
  });

  describe('selected', () => {
    it('returns selected text when selecting', () => {
      // Modifying window.content so we can control the exact substring behavior
      window.content = 'abcdefghij';
      window.cursor = 2; // 'c'
      window.end = 7;    // 'h'
      
      expect(window.selected()).to.equal('cdefg');
    });
    
    it('returns empty string when not selecting', () => {
      window.cursor = 5;
      window.end = 5;
      expect(window.selected()).to.equal('');
    });
  });

  describe('find', () => {
    it('returns index of first occurrence of target', () => {
      const index = window.find('line3');
      expect(index).to.equal(testContent.indexOf('line3'));
    });
    
    it('throws error if target not found', () => {
      expect(() => window.find('nonexistent')).to.throw('Cannot find nonexistent');
    });
  });

  describe('view', () => {
    it('returns visible lines based on scroll and size', () => {
      window.scroll = 1; // Start at line2
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
      window.scroll = 1;
      expect(window.scrolling()).to.be.true;
    });
    
    it('returns false when all content visible', () => {
      window.size = 10; // More than lines available
      window.scroll = 0;
      expect(window.scrolling()).to.be.false;
    });
  });

  describe('scrolled', () => {
    it('returns correct scroll information', () => {
      window.scroll = 1;
      window.size = 2;
      
      const info = window.scrolled();
      expect(info.start).to.equal(2); // 1-based, line2
      expect(info.end).to.equal(3);   // Up to line3
      expect(info.total).to.equal(5); // Total 5 lines
    });
  });
});