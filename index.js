export default class Planchette {
  constructor(options = {}) {
    this.options = options;
  }

  channel(name) {
    return {
      summon: (prompt) => {
        // Future LLM integration will go here
        console.log(`Summoning spirits for post: ${name}`);
        console.log(`Prompt: ${prompt}`);
      }
    };
  }
}