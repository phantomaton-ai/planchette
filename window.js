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
   */
  constructor(options) {
    // Validate and normalize input
    if (options instanceof RegExp) {
      this.regex = options;
    } else if (typeof options === 'object') {
      // Use undefined if not specified to allow default behavior
      this.start = options.start;
      this.end = options.end;
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

    const { start, end } = this._resolve(content);
    return content.slice(start, end);
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

    const { start, end } = this._resolve(content);
    const before = content.slice(0, start);
    const after = content.slice(end);
    
    return [before, replacement, after].join('');
  }

  _resolve(content) {
    const start = this._resolveIndex(content, this.start, true);
    const end = this._resolveIndex(content, this.end, false, start);
    return { start, end };
  }

  /**
   * Resolve an index for windowing
   * @private
   * @param {string} contennt - File content
   * @param {number|string|RegExp} index - Index specifier
   * @returns {number} Resolved character index
   */
  _resolveIndex(content, index, starting, position = 0) {
    if (index === undefined) {
      return starting ? 0 : content.length;
    }

    if (typeof index === 'number') {
      const extra = starting ? 0 : 1;
      const lines = content.split('\n').slice(0, index + extra);
      return lines.reduce((resolved, line) => resolved + line.length, lines.length - extra);
    }
    
    if (typeof index === 'string') {
      const extra = starting ? 0 : index.length;
      return content.indexOf(index, position) + extra;
    }

    if (index instanceof RegExp) {
      const match = content.slice(position).match(index).index;
      const extra = starting ? 0 : match[0].length;
      return match.index + position + extra;
    }

    return 0;
  }
}