/**
 * Planchette: A spectral project management tool for LLMs
 * @module planchette
 */
import fs from 'fs/promises';
import path from 'path';

class Planchette {
  /**
   * Create a new Planchette instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      rootDir: options.rootDir || process.cwd(),
      ...options
    };
  }

  /**
   * Read a file with advanced text manipulation capabilities
   * @param {string} filePath - Path to the file
   * @param {Object} [options] - Reading options
   * @returns {Promise<string>} File contents
   */
  async read(filePath, options = {}) {
    const fullPath = path.resolve(this.options.rootDir, filePath);
    return await fs.readFile(fullPath, 'utf-8');
  }

  /**
   * Write file with intelligent text replacement
   * @param {string} filePath - Path to the file
   * @param {string} content - Content to write
   * @param {Object} [options] - Writing options
   */
  async write(filePath, content, options = {}) {
    const fullPath = path.resolve(this.options.rootDir, filePath);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  /**
   * Replace specific text in a file
   * @param {string} filePath - Path to the file
   * @param {string} search - Text to search for
   * @param {string} replace - Replacement text
   */
  async replace(filePath, search, replace) {
    const content = await this.read(filePath);
    const newContent = content.replace(search, replace);
    await this.write(filePath, newContent);
  }
}

/**
 * Create a new Planchette instance
 * @param {Object} [options] - Configuration options
 * @returns {Planchette} Planchette instance
 */
export default function planchette(options) {
  return new Planchette(options);
}