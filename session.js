import commands from './commands.js';
import Workspace from './workspace.js';

class Session {
  constructor(options = {}) {
    this.workspace = new Workspace(options);
  }
  
  commands() {
    return commands(this.workspace);
  }
  
  display() {
    return this.workspace.display();
  }
}
