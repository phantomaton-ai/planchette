class Interface {
  constructor(workspace) {
    this.workspace = workspace;
  }
  
  // File commands
  open(file) {
    this.workspace.open(file);
  }
  
  close(file) {
    this.workspace.close(file);
  }
  
  focus(file) {
    this.workspace.focus(file);
  }

  // Cursor commands
  before(target) {
    this.workspace.current().before(target);
  }
  
  after(target) {
    this.workspace.current().after(target);
  }
  
  // Selection commands
  select(start, end) {
    this.workspace.current().select(start, end);
  }
  
  drag(target) {
    this.workspace.current().drag(target);
  }
  
  // Editing commands
  edit(content) {
    this.workspace.current().edit(content);
  }
  
  // View commands
  scroll(lines) {
    this.workspace.current().scroll(lines);
  }
}
