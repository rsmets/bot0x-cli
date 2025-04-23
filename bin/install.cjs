#!/usr/bin/env node
/**
 * Installation script for bot0x CLI
 * This script is meant to be run after installation to display setup instructions
 */

// Simple colored output functions without dependencies
const color = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

// Force output to be visible even when npm might suppress it
process.stderr.write('\n' + color.green('🎉 bot0x installed successfully! 🎉') + '\n\n');
process.stderr.write(color.bold('To enable shell integration, add these lines to your .zshrc or .bashrc:') + '\n\n');
process.stderr.write(color.cyan('# Set up commands that modify your shell environment\n'));
process.stderr.write(color.cyan('eval "$(bot0x shellScript --print)"') + '\n\n');
process.stderr.write(color.cyan('# Set up all other commands as shell aliases\n'));
process.stderr.write(color.cyan('eval "$(bot0x alias)"') + '\n\n');
process.stderr.write(color.bold('For more information, run:') + ' ' + color.yellow('bot0x --help') + '\n\n');
process.stderr.write(color.bold('Documentation:') + ' ' + color.blue('https://github.com/rsmets/bot0x-cli') + '\n\n');
