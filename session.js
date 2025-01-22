/**
 * Planchette Session - Manages LLM's interaction with files and system
 * @module session
 */
import Workspace from './workspace.js';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const asyncExec = util.promisify(exec);

export default class Session {
  /**
   * Create a new Planchette session
   * @param {Object} [options] - Session configuration
   */
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.workspace = new Workspace();
  }

  /**
   * Open a file in the workspace
   * @param {string} file - Path to the file
   * @param {object|string|RegExp} [window] - Context window definition
   */
  async open(file, window = null) {
    const fullPath = path.resolve(this.rootDir, file);
    await fs.access(fullPath); // Verify file exists
    this.workspace.open(fullPath, window);
  }

  /**
   * Close a file in the workspace
   * @param {string} file - Path to the file
   */
  close(file) {
    const fullPath = path.resolve(this.rootDir, file);
    this.workspace.close(fullPath);
  }

  /**
   * Read a file (or part of a file)
   * @param {string} file - Path to the file
   * @param {object|string|RegExp} [window] - Context window definition
   * @returns {Promise<string>} File contents
   */
  async read(file, window = null) {
    const fullPath = path.resolve(this.rootDir, file);
    const content = await fs.readFile(fullPath, 'utf-8');
    
    // TODO: Implement sophisticated windowing logic
    if (window instanceof RegExp) {
      const match = content.match(window);
      return match ? match[0] : content;
    }

    if (typeof window === 'object' && window.start !== undefined) {
      // Placeholder for more complex windowing
      const lines = content.split('\n');
      const start = this._resolveIndex(lines, window.start);
      const end = this._resolveIndex(lines, window.end);
      return lines.slice(start, end + 1).join('\n');
    }

    return content;
  }

  /**
   * Edit a file
   * @param {string} file - Path to the file
   * @param {string} content - New content
   * @param {object|string|RegExp} [window] - Context window definition
   */
  async edit(file, content, window = null) {
    const fullPath = path.resolve(this.rootDir, file);
    
    if (window) {
      // TODO: Implement windowed editing
      const existingContent = await fs.readFile(fullPath, 'utf-8');
      // For now, replace entire file
      await fs.writeFile(fullPath, content, 'utf-8');
    } else {
      await fs.writeFile(fullPath, content, 'utf-8');
    }
  }

  /**
   * Execute a shell command
   * @param {string} command - Command to execute
   * @param {object} [input] - Optional input for the command
   * @returns {Promise<{stdout: string, stderr: string}>} Command output
   */
  async execute(command, input = null) {
    try {
      const { stdout, stderr } = await asyncExec(command, {
        cwd: this.rootDir
      });
      return { stdout, stderr };
    } catch (error) {
      return { 
        stdout: error.stdout || '', 
        stderr: error.stderr || error.message 
      };
    }
  }

  /**
   * Remove a file
   * @param {string} file - Path to the file
   */
  async remove(file) {
    // const fullPath = path.resolve(this.rootDir, file);
    // await fs.unlink(fullPath);
    // this.close(file);
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

/**
 * Create a new Planchette session
 * @param {Object} [options] - Session configuration
 * @returns {Session} Planchette session
 */
export function planchette(options) {
  return new Session(options);
}