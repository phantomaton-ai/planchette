import commands from './commands.js';
import Interface from './interface.js';
import Workspace from './workspace.js';

class Session {
  constructor(options = {}) {
    this.workspace = new Workspace(options);
    this.interface = new Interface(this.workspace);
  }
  
  commands() {
    return commands(this.api);
  }
  
  display() {
    return this.workspace.display();
  }
}
