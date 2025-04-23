# Bot0x CLI

A Node.js CLI tool with handy utilities for "experienced" developers and sysadmins - so you don't even have to move a muscle 😉.

## Features

- `bot0x kbp <port>` / `bot0x killbyport <port>`: Kill process by port
- `bot0x gitclean`: Clean up merged git branches (except main/master)
- `bot0x flushdns`: Flush DNS cache (macOS, Windows, Linux)

## Usage

```sh
bot0x --help
bot0x kbp 3000
bot0x gitclean
bot0x flushdns
```

## Installation

```sh
npm install -g .
# or for local development
npm link
```

### Shell Alias Integration (Advanced)

You can enable first-class shell aliases for all your `bot0x` commands — just like the original [github-copilot-cli][copilot-cli], which this project drew [inspiration][builder-blog] from — using the built-in `alias` command. 

**To make aliases available in every shell session, add this line to your `.zshrc`, `.bashrc`, or similar shell profile:**

```sh
# Enable bot0x subcommands as top-level shell commands (e.g. 'kbp', 'gitclean', 'flushdns')
eval "$(bot0x alias -- "$0")"
```

This will let you run `kbp 3000` or `gitclean` directly in your shell, as if they were standalone commands, while still using the single `bot0x` binary under the hood.

### Shell Integration (Important Order!)

For the best experience, you should set up your shell integration in the following order:

1. First, source the bot0x shell script for AWS environment commands:

```sh
# Add this FIRST to your .zshrc or .bashrc to enable AWS environment commands
source "$(bot0x shellScript)"
```

2. Then, set up the alias integration:

```sh
# Add this AFTER sourcing the bot0x.sh script
eval "$(bot0x alias)"
```

This order is important to avoid conflicts between the shell functions.

Alternatively, you can print the script content directly and save it wherever you want:

```sh
# Print the script content
bot0x shellScript --print > ~/.bot0x.sh

# Then in your .zshrc or .bashrc (in this order):
source ~/.bot0x.sh
eval "$(bot0x alias)"
```

This script provides the following commands that modify your shell environment:

- `awssr <env>` - Switch AWS role and context (dev, staging, prod, etc.)
- `awsp <profile>` - Switch AWS profile
- `awsdr <role>` - Assume AWS direct role
- `awsdrAll` - Assume all AWS direct roles
- `awsrmfaa <role>` - Assume AWS MFA role automatically
- `awsmfa <profile>` - Set AWS MFA credentials

- **Why?**
  - Faster workflows (type `kbp 8080` instead of `bot0x kbp 8080`)
  - Shell completion and history for subcommands
  - Feels like a suite of first-class tools
- **How does it work?**
  - The built-in `alias` command emits shell functions for each subcommand, which forward to `bot0x`.
  - Inspired by the GitHub CLI's alias system ([see this blog post][builder-blog]).

> **Note:** This is optional. You can always use `bot0x <command>` as normal.


## Development

- Each command lives in its own module in `lib/commands/`
- Uses [commander](https://www.npmjs.com/package/commander) for CLI parsing
- Uses [shelljs](https://www.npmjs.com/package/shelljs) for shell commands
- Uses [chalk](https://www.npmjs.com/package/chalk) for colorful output

### Project Structure

```
bot0x/
├── bin/index.js         # CLI entry point
├── lib/commands/
│   ├── killbyport.js
│   ├── gitclean.js
│   └── flushdns.js
├── package.json
└── README.md
```

### Local Development & Testing

To use `bot0x` globally from any terminal during development, run:

```sh
npm link
```

This symlinks your project as a global CLI, so you can run `bot0x` and all its subcommands from anywhere. This is also required for the alias integration to work as expected.

- After running `npm link`, you can test `bot0x`, `kbp`, `gitclean`, etc. from any directory.
- Changes you make to your code will be reflected immediately (no need to re-link).

## License

MIT

<!-- Reference-style links -->

[copilot-cli]: https://github.com/orgs/community/discussions/86354
[builder-blog]: https://www.builder.io/blog/github-copilot-cli-first-look
