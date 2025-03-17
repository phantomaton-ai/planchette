/**
 * File system adapter for Planchette
 * @module adapter
 */
import fs from 'fs/promises';
import path from 'path';

/**
 * Adapter provides file system operations for Planchette
 */
export default class Adapter {
  /**
   * Create a new file system adapter
   * @param {string} root - Root directory for relative paths
   */
  constructor(root) {
    this.root = root || process.cwd();
  }

  /**
   * Read text contents from file system
   * @param {string} filePath - Path to the file (relative to root)
   * @returns {Promise<string>} File contents
   */
  async read(filePath) {
    const fullPath = path.resolve(this.root, filePath);
    try {
      return await fs.readFile(fullPath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read ${filePath}: ${error.message}`);
    }
  }

  /**
   * Remove file from file system
   * @param {string} filePath - Path to the file (relative to root)
   * @returns {Promise<void>}
   */
  async remove(filePath) {
    const fullPath = path.resolve(this.root, filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      throw new Error(`Failed to remove ${filePath}: ${error.message}`);
    }
  }

  /**
   * Write text content to file system
   * @param {string} filePath - Path to the file (relative to root)
   * @param {string} content - Content to write
   * @returns {Promise<void>}
   */
  async write(filePath, content) {
    const fullPath = path.resolve(this.root, filePath);
    try {
      // Ensure directory exists
      const directory = path.dirname(fullPath);
      await fs.mkdir(directory, { recursive: true });
      
      // Write the file
      await fs.writeFile(fullPath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write ${filePath}: ${error.message}`);
    }
  }

  /**
   * Check if a file exists
   * @param {string} filePath - Path to the file (relative to root)
   * @returns {Promise<boolean>} True if file exists
   */
  async exists(filePath) {
    const fullPath = path.resolve(this.root, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}