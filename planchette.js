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
   * Replace text in a file with advanced options
   * @param {string} filePath - Path to the file
   * @param {string|RegExp} search - Text or regex to search for
   * @param {string|Function} replace - Replacement text or transformation function
   */
  async replace(filePath, search, replace) {
    let content = await this.read(filePath);
    
    // Handle different replacement scenarios
    if (typeof replace === 'function') {
      // If replace is a function, pass matched content to it
      content = content.replace(search, replace);
    } else if (search instanceof RegExp) {
      // If search is a regex, use standard regex replacement
      content = content.replace(search, replace);
    } else {
      // Simple string replacement
      content = content.split(search).join(replace);
    }

    await this.write(filePath, content);
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