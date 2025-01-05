import chalk from 'chalk';

import projects from 'phantomaton-projects';

import blog from './blog.js';
import preamble from './preamble.js';
import prefix from './prefix.js';

const greenlist = ['list', 'files', 'read'];

class Planchette {
  constructor(options = {}) {
    this.options = options;
    this.blog = blog();
    this.projects = projects();
  }

  commands() {
    return [
      ...prefix(
        this.projects.commands.filter(({ name }) => greenlist.includes(name)),
        'projects'
      ),
      ...prefix(this.blog.commands, 'blog')
    ];
  }

  conversation(wrapped) {
    return turns => {
      const conversation = wrapped(turns);
      const advance = async () => {
        const executed = preamble(conversation);
        if (executed) {
          console.log(chalk.magenta(executed) + '\n');
        }
        const result = await conversation.advance();
        return result;
      };
      return { advance };      
    };
  }

  system(wrapped) {
    return () => {
      const value = wrapped();
      console.log(chalk.blue(value));
      return value;      
    };
  }
}

export default Planchette;
