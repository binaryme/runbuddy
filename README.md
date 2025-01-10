# RunBuddy 🏃‍♂️

A VS Code extension that helps you run your favorite commands with just one click! Whether it's starting a development server, running tests, or any other command - RunBuddy makes it quick and easy.

## Features ✨

- 🎯 Custom command execution with a single click
- ⚡ Quick access through the VS Code status bar
- 🛠️ Configurable through VS Code settings
- 💪 Support for any shell command
- 🔄 Perfect for repetitive commands like:
  - `npm run dev`
  - `uvicorn app.main:app --reload`
  - `python manage.py runserver`
  - And many more!

## Installation 📦

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "RunBuddy"
4. Click Install

## Configuration ⚙️

1. Open VS Code Settings (Ctrl+, or Cmd+,)
2. Search for "RunBuddy"
3. Add your custom commands in the settings:

```json
{
  "runbuddy.commands": [
    {
      "name": "FastAPI Dev Server",
      "command": "uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
    },
    {
      "name": "Next.js Dev",
      "command": "npm run dev"
    }
  ]
}
```

## Usage 🚀

1. After configuration, you'll see a play button in your VS Code status bar
2. Click it to run your configured command
3. The command will execute in a new terminal window

## Contributing 🤝

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a Pull Request

## License 📄

MIT

## Support 💖

If you find this extension helpful, please:
- Star the repository on GitHub
- Leave a review on the VS Code Marketplace
- Report any issues on the GitHub repository

## Author ✍️
Israel Ortiz Cortés - binaryme
Created with ❤️ for the developer community
