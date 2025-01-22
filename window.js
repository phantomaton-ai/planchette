/**
 * Window: A contextual view into a text document
 * @module window
 */
export default class Window {
  /**
   * Create a new Window
   * @param {Object|RegExp} options - Window definition
   * @param {number|string|RegExp} [options.start] - Start of window
   * @param {number|string|RegExp} [options.end] - End of window
   * @param {RegExp} [options.regex] - Regex to define window
   */
  constructor(options) {
    // Validate and normalize input
    if (options instanceof RegExp) {
      this.regex = options;
    } else if (typeof options === 'object') {
      // Use undefined if not specified to allow default behavior
      this.start = options.start;
      this.end = options.end;
      this.regex = options.regex;
    } else {
      throw new Error('Invalid window definition');
    }
  }

  /**
   * Read content within the window
   * @param {string} content - Full content to window
   * @returns {string} Windowed content
   */
  read(content) {
    // Regex-based window
    if (this.regex) {
      const match = content.match(this.regex);
      return match ? match[0] : '';
    }

    // Line-based window
    const lines = content.split('\n');
    
    // Resolve start index, defaulting to 0 if not specified
    const startIndex = this.start !== undefined 
      ? this._resolveIndex(lines, this.start) 
      : 0;
    
    // Resolve end index, defaulting to last line if not specified
    const endIndex = this.end !== undefined
      ? this._resolveIndex(lines, this.end)
      : lines.length - 1;

    return lines.slice(startIndex, endIndex + 1).join('\n');
  }

  /**
   * Replace content within the window
   * @param {string} content - Full content
   * @param {string} replacement - Replacement text
   * @returns {string} Modified content
   */
  replace(content, replacement) {
    // Regex-based window
    if (this.regex) {
      return content.replace(this.regex, replacement);
    }

    // Line-based window
    const lines = content.split('\n');
    
    // Resolve start index, defaulting to 0 if not specified
    const startIndex = this.start !== undefined 
      ? this._resolveIndex(lines, this.start) 
      : 0;
    
    // Resolve end index, defaulting to last line if not specified
    const endIndex = this.end !== undefined
      ? this._resolveIndex(lines, this.end)
      : lines.length - 1;

    lines.splice(startIndex, endIndex - startIndex + 1, replacement);
    return lines.join('\n');
  }

  /**
   * Resolve an index for windowing
   * @private
   * @param {string[]} lines - File lines
   * @param {number|string|RegExp} index - Index specifier
   * @returns {number} Resolved line number
   */
  _resolveIndex(lines, index) {
    if (typeof index === 'number') return index;
    
    if (typeof index === 'string') {
      const lineIndex = lines.findIndex(line => line.includes(index));
      return lineIndex !== -1 ? lineIndex : 0;
    }

    if (index instanceof RegExp) {
      const lineIndex = lines.findIndex(line => index.test(line));
      return lineIndex !== -1 ? lineIndex : 0;
    }

    return 0;
  }
}