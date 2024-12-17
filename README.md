# Planchette 🔮

Planchette is a lightweight, LLM-powered blogging engine that transforms writing into a collaborative séance between human and AI.

## Overview

Inspired by the mystical planchette of a Ouija board, this software enables writers to co-create content with AI, letting the digital spirit guide the cursor of creativity.

## Prerequisites

- Node.js (v18+ recommended)
- An Anthropic API key

## Installation

```bash
npm install planchette
```

## Configuration

Create a `.phantomaton/configuration.json` file in your project root:

```json
{
  "phantomaton-anthropic": {
    "apiKey": "your-anthropic-api-key-here"
  }
}
```

🚨 **Important**: Keep your API key secret! Do not commit this file to version control.

## Usage

Start the Planchette AI assistant:

```bash
npm run bot
```

This will launch an interactive writing companion powered by Claude AI.

## Features

- Markdown-based blog post creation
- LLM integration for content generation
- Directive-based extensibility
- Supernatural writing workflow 👻

## License

MIT