import { expect } from 'lovecraft';
import Window from './window.js';

describe('Window', () => {
  describe('Regex Window', () => {
    it('should create a window from a regex', () => {
      const window = new Window(/hello/);
      expect(window.regex).toBeTruthy();
    });

    it('should read content matching a regex', () => {
      const content = 'hello world, hello universe';
      const window = new Window(/hello/);
      
      expect(window.read(content)).toBe('hello');
    });

    it('should replace content matching a regex', () => {
      const content = 'hello world, hello universe';
      const window = new Window(/hello/);
      
      expect(window.replace(content, 'hi')).toBe('hi world, hi universe');
    });
  });

  describe('Line-based Window', () => {
    const multilineContent = `first line
second line
third line
fourth line
fifth line`;

    it('should create a window with start and end', () => {
      const window = new Window({ 
        start: 1, 
        end: 3 
      });
      
      const result = window.read(multilineContent);
      expect(result).toBe('second line\nthird line\nfourth line');
    });

    it('should create a window with string-based start/end', () => {
      const window = new Window({ 
        start: 'second', 
        end: 'fourth' 
      });
      
      const result = window.read(multilineContent);
      expect(result).toBe('second line\nthird line\nfourth line');
    });

    it('should replace content in a line-based window', () => {
      const window = new Window({ 
        start: 1, 
        end: 3 
      });
      
      const result = window.replace(multilineContent, 'replacement');
      expect(result).toBe(`first line
replacement
fifth line`);
    });

    it('should handle default start/end', () => {
      const windowStart = new Window({ start: 0 });
      expect(windowStart.read(multilineContent)).toBe('first line');

      const windowEnd = new Window({ end: 4 });
      expect(windowEnd.read(multilineContent)).toBe(multilineContent);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid window definition', () => {
      expect(() => new Window(123)).toThrow('Invalid window definition');
    });
  });
});