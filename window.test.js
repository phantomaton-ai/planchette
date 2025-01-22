import { expect } from 'lovecraft';
import Window from './window.js';

const multilineContent = `first line
second line
third line
fourth line
fifth line`;

describe('Window', () => {
  describe('Regex Window', () => {
    it('should read content matching a regex', () => {
      const content = 'hello world, hello universe';
      const window = new Window(/hello/);
      
      expect(window.read(content)).to.equal('hello');
    });

    it('should replace content matching a regex', () => {
      const content = 'hello world, hello universe';
      const window = new Window(/hello/);
      
      expect(window.replace(content, 'hi')).to.equal('hi world, hello universe');
    });
  });

  describe('Line-based Window', () => {
    it('should create a window with start and end', () => {
      const window = new Window({ 
        start: 1, 
        end: 3 
      });
      
      const result = window.read(multilineContent);
      expect(result).to.equal('second line\nthird line\nfourth line');
    });

    it('should create a window with string-based start/end', () => {
      const window = new Window({ 
        start: 'second', 
        end: 'fourth' 
      });
      
      const result = window.read(multilineContent);
      expect(result).to.equal('second line\nthird line\nfourth');
    });

    it('should replace content in a line-based window', () => {
      const window = new Window({ 
        start: 1, 
        end: 3
      });
      
      const result = window.replace(multilineContent, 'replacement');
      expect(result).to.equal(`first line
replacement
fifth line`);
    });

    it('should handle default start/end', () => {
      expect(new Window({ start: 0 }).read(multilineContent)).to.equal(multilineContent);
      expect(new Window({ start: 4 }).read(multilineContent)).to.equal('fifth line');
      expect(new Window({ end: 0 }).read(multilineContent)).to.equal('first line');
      expect(new Window({ end: 5 }).read(multilineContent)).to.equal(multilineContent);
    });
  });

  describe('Unspecified Window', () => {
    it('reads full content', () => {
      expect(new Window().read(multilineContent)).to.equal(multilineContent);
    });

    it('replaces full content', () => {
      expect(new Window().replace(multilineContent, 'foo')).to.equal('foo');      
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid window definition', () => {
      expect(() => new Window(123)).to.throw('Invalid window definition');
    });
  });
});