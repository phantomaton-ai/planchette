import { describe, it, expect } from 'vitest';
import Workspace from './workspace.js';

describe('Workspace', () => {
  it('should create an empty workspace', () => {
    const workspace = new Workspace();
    expect(workspace.files).toEqual([]);
    expect(workspace.windows.size).toBe(0);
  });

  it('should open a file', () => {
    const workspace = new Workspace();
    workspace.open('test.txt');
    expect(workspace.files).toContain('test.txt');
  });

  it('should open a file with a window', () => {
    const workspace = new Workspace();
    const window = { start: 0, end: 10 };
    workspace.open('test.txt', window);
    
    expect(workspace.files).toContain('test.txt');
    expect(workspace.windows.get('test.txt')).toEqual(window);
  });

  it('should close a file', () => {
    const workspace = new Workspace();
    workspace.open('test.txt');
    workspace.close('test.txt');
    
    expect(workspace.files).not.toContain('test.txt');
    expect(workspace.windows.has('test.txt')).toBeFalsy();
  });
});