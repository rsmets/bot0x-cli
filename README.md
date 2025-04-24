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

Run:
```sh
npm install -g bot0x
bot0x welcome
```

Then follow the instructions in the welcome message.

### Shell Integration

Bot0x commands fall into two categories:

1. **Shell Environment Commands**: Commands that need to modify your current shell environment (like AWS profile switching)
2. **Regular Commands**: Commands that don't need to modify your shell environment (like `ccio`, `kbp`, etc.)

#### Setup: Two-step approach

Add both of these to your `.zshrc` or `.bashrc`:

```sh
# 1. Set up commands that modify your shell environment
eval "$(bot0x shellScript --print)"

# 2. Set up all other commands as shell aliases
eval "$(bot0x alias)"
```

This creates:

1. Shell functions for commands that modify your shell environment:
   - `awssr <env>` - Switch AWS role and context (dev, staging, prod, etc.)
   - `awsp <profile>` - Switch AWS profile
   - `awsdr <role>` - Unset AWS credential environment variables
   - `awsdrAll` - Run awsdr && awsrmfaa && kubectx for all environments
   - `awsrmfaa <role>` - Assume AWS MFA role automatically
   - `awsmfa <profile>` - Generate AWS MFA token

2. Shell aliases for all other commands:
   - These aliases let you run commands like `kbp 3000` or `gitclean` directly in your shell
   - **Note**: The `alias` command automatically excludes commands that require `eval`, so there are no conflicts between the two.

#### Alternative: Save to a file

If you prefer, you can save the shell environment functions to a file:

```sh
# Save the shell functions to a file
bot0x shellScript --print > ~/.bot0x-env.sh

# Then in your .zshrc or .bashrc:
source ~/.bot0x-env.sh
eval "$(bot0x alias)"
```

#### Usage Examples

```sh
# Use shell functions for environment commands
awssr dev
awsp default-root

# Use regular aliases for other commands
ccio
kbp 3000
gitclean
```

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
