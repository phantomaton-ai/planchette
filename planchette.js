import chalk from 'chalk';

import preamble from './preamble.js';

class Planchette {
  constructor(options = {}) {
    this.options = options;
  }

  commands() {
    return [];
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
