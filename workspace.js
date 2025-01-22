/**
 * Planchette Workspace - Manages open files and their contexts
 * @module workspace
 */
export default class Workspace {
  constructor(session) {
    this.session = session;

    /**
     * Map of open files to their current windows/contexts
     * @type {Record<string, Window>}
     */
    this.windows = {};

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
  open(file, window = undefined) {
    if (!this.files.includes(file)) {
      this.files.push(file);
    }
    this.windows[file] = window;
  }

  /**
   * Close a file, removing it from workspace
   * @param {string} file - Path to the file
   */
  close(file) {
    this.files = this.files.filter(f => f !== file);
    delete this.windows.delete[file];
  }

  /**
   * Read contents of open files with their windows
   * @returns {Promise<object[]>} File contents, within their windows
   */
  read() {
    return Promise.all(this.files.map(async file => {
      const window = this.windows[file];
      const content = await this.session.read(file, window);
      return {file, content, window};
    }));
  }
}
