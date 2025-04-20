# Botox CLI

A Node.js CLI tool with handy utilities for developers and sysadmins.

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

## License

MIT
