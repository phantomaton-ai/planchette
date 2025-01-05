import aleister from 'aleister';
import ouijaboard from 'ouijaboard';

class Blog {
  constructor() {
    this.blog = ouijaboard();
  }

  /**
   * Read documentation of the blog syntax.
   * 
   * @returns {string} Documentation of blog syntax.
   * @example commands.document()
   */
  document() {
    return this.blog.document();
  }

  /**
   * List all existing blog posts.
   * 
   * @returns {string} A list of blog posts, by name.
   * @example commands.list()
   */
  list() {
    return this.blog.list();
  }

  /**
   * Reads the content of the specified blog post.
   * 
   * @param {string} post - The machine-readable name of the post.
   * @returns {string} The contents of the specified post.
   * @example commands.read('hello-world')
   */
  read(post) {
    return this.blog.read(post);
  }

  /**
   * Writes the provided content to the specified post. This overwrites all
   * content in the post; consider using `replace` to update only part of a
   * post.
   * 
   * @param {string} post - The machine-readable name of the post.
   * @param {string} content - The content to write to the post.
   * @body content
   * @returns {string} A message indicating the post's write status.
   * @example commands.write('hello-world', '# Hello World\n\nThis is the content of the blog post.')
   */
  write(post, content) {
    return this.blog.write(post, content);
  }

  /**
   * Replaces content in the blog post. Replacement begins at the first
   * instance of `from` found in the current blog content, and continues
   * until the first instance of `to` found thereafter. 
   * 
   * @param {string} post - The machine-readable name of the post.
   * @param {string} from - A string to match as the start of replacement.
   * @param {string} to - A string to match as the end of replacement.
   * @param {string} content - The replacement text content.
   * @body content
   * @returns {string} A message indicating the post's write status.
   * @example commands.replace('hello-world', 'Hello', 'World', 'Hi, globe')
   */
  replace(post, from, to, content) {
    return this.blog.replace(post, from, to, content);
  }

  /**
   * Publishes the specified blog post.
   * 
   * @param {string} post - The machine-readable name of the post.
   * @returns {string} A message indicating success/failure.
   * @example commands.publish('hello-world')
   */
  publish(post) {
    return this.blog.publish(post);
  }
}

export default aleister(Blog);
