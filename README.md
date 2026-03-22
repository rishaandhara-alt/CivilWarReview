# Smart Todo Local

Open `public/index.html` in a browser, or serve the folder with any static file host.

## What it does

- Smooth animated todo list
- Add new todos
- Add extra information per task
- Mark old todos as done
- Save todos locally
- Turn paragraphs into tasks with Cerebras `llama3.1-8b`
- Separate chatbot area for summaries or casual chat

## AI setup

The AI features now call Cerebras directly from the browser with `llama3.1-8b` using `public/cerebras-config.js`.

That means:

- you do not need the local proxy for AI anymore
- your Cerebras API key is exposed in the frontend code
