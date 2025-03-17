export default class File {
  constructor(path, adapter) {
    this.path = path;
    this.adapter = adapter;
  }
  
  read() {
    return this.adapter.read(this.path);
  }

  remove() {
    return this.adapter.remove(this.path);
  }

  write(content) {
    return this.adapter.write(this.path, this.content);
  }
};
