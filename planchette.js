/**
 * Planchette: A spectral project management tool for LLMs
 * @module planchette
 */
import fs from 'fs/promises';
import path from 'path';

import Session from './session.js';

/**
 * Create a new Planchette instance
 * @param {Object} [options] - Configuration options
 * @returns {Planchette} Planchette instance
 */
export default function planchette(options) {
  return new Session(options);
}