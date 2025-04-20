# Botox CLI

A Node.js CLI tool with handy utilities for "experienced" developers and sysadmins - so you don't even have to move a muscle 😉.

## Features

- `botox kbp <port>` / `botox killbyport <port>`: Kill process by port
- `botox gitclean`: Clean up merged git branches (except main/master)
- `botox flushdns`: Flush DNS cache (macOS, Windows, Linux)

## Usage

```sh
botox --help
botox kbp 3000
botox gitclean
botox flushdns
```

## Installation

```sh
npm install -g .
# or for local development
npm link
```

### Shell Alias Integration (Advanced)

You can enable first-class shell aliases for all your `botox` commands — just like the original [github-copilot-cli][copilot-cli], which this project drew [inspiration][builder-blog] from — using the built-in `alias` command. 

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
  - Inspired by the GitHub CLI's alias system ([see this blog post][builder-blog]).

> **Note:** This is optional. You can always use `botox <command>` as normal.


## Development

- Each command lives in its own module in `lib/commands/`
- Uses [commander](https://www.npmjs.com/package/commander) for CLI parsing
- Uses [shelljs](https://www.npmjs.com/package/shelljs) for shell commands
- Uses [chalk](https://www.npmjs.com/package/chalk) for colorful output

### Project Structure

```
botox/
├── bin/index.js         # CLI entry point
├── lib/commands/
│   ├── killbyport.js
│   ├── gitclean.js
│   └── flushdns.js
├── package.json
└── README.md
```

### Local Development & Testing

To use `botox` globally from any terminal during development, run:

```sh
npm link
```

This symlinks your project as a global CLI, so you can run `botox` and all its subcommands from anywhere. This is also required for the alias integration to work as expected.

- After running `npm link`, you can test `botox`, `kbp`, `gitclean`, etc. from any directory.
- Changes you make to your code will be reflected immediately (no need to re-link).

## License

MIT

<!-- Reference-style links -->

[copilot-cli]: https://github.com/orgs/community/discussions/86354
[builder-blog]: https://www.builder.io/blog/github-copilot-cli-first-look
