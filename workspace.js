/**
 * Planchette Workspace - Manages open files and their contexts
 * @module workspace
 */
export default class Workspace {
  constructor() {
    /**
     * Map of open files to their current windows/contexts
     * @type {Map<string, object>}
     */
    this.windows = new Map();

    /**
     * List of currently open files
     * @type {string[]}
     */
    this.files = [];
  }

  /**
   * Open a file with an optional context window
   * @param {string} file - Path to the file
   * @param {object|string|RegExp} [window] - Context window definition
   */
  open(file, window = null) {
    if (!this.files.includes(file)) {
      this.files.push(file);
    }
    
    if (window !== null) {
      this.windows.set(file, window);
    }
  }

  /**
   * Close a file, removing it from workspace
   * @param {string} file - Path to the file
   */
  close(file) {
    this.files = this.files.filter(f => f !== file);
    this.windows.delete(file);
  }

  /**
   * Read contents of open files with their windows
   * @returns {Map<string, string>} Map of file contents within their windows
   */
  read() {
    // TODO: Implement actual windowing logic
    const contents = new Map();
    return contents;
  }
}