# Botox CLI

A Node.js CLI tool with handy utilities for "experienced" developers and sysadmins - so you don't even have to move a muscle 😉.

## Features

- `botox kbp <port>` / `botox killbyport <port>`: Kill process by port
- `botox gitclean`: Clean up merged git branches (except main/master)
- `botox flushdns`: Flush DNS cache (macOS, Windows, Linux)

## Installation

```sh
npm install -g .
# or for local development
npm link
```

## Usage

```sh
botox --help
botox kbp 3000
botox gitclean
botox flushdns
```

## Project Structure

```
my-cli-tool/
├── bin/index.js         # CLI entry point
├── lib/commands/
│   ├── killbyport.js
│   ├── gitclean.js
│   └── flushdns.js
├── package.json
└── README.md
```

## Development

- Each command lives in its own module in `lib/commands/`
- Uses [commander](https://www.npmjs.com/package/commander) for CLI parsing
- Uses [shelljs](https://www.npmjs.com/package/shelljs) for shell commands
- Uses [chalk](https://www.npmjs.com/package/chalk) for colorful output

## Shell Alias Integration (Advanced)

You can enable first-class shell aliases for all your `botox` commands—just like the GitHub CLI—using the built-in `alias` command. 

**To make aliases available in every shell session, add this line to your `.zshrc`, `.bashrc`, or similar shell profile:**

```sh
# Enable botox subcommands as top-level shell commands (e.g. 'kbp', 'gitclean', 'flushdns')
eval "$(botox alias -- "$0")"
```

This will let you run `kbp 3000` or `gitclean` directly in your shell, as if they were standalone commands, while still using the single `botox` binary under the hood.

- **Why?**
  - Faster workflows (type `kbp 8080` instead of `botox kbp 8080`)
  - Shell completion and history for subcommands
  - Feels like a suite of first-class tools
- **How does it work?**
  - The built-in `alias` command emits shell functions for each subcommand, which forward to `botox`.
  - Inspired by the GitHub CLI's alias system ([see this blog post](https://www.builder.io/blog/github-copilot-cli-first-look)).

> **Note:** This is optional. You can always use `botox <command>` as normal.

## License

MIT
