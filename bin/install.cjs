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

// Display welcome message
console.log('\n' + color.green('🎉 bot0x installed successfully! 🎉') + '\n');
console.log(color.bold('To enable shell integration, add these lines to your .zshrc or .bashrc:') + '\n');
console.log(color.cyan('# Set up commands that modify your shell environment'));
console.log(color.cyan('eval "$(bot0x shellScript --print)"') + '\n');
console.log(color.cyan('# Set up all other commands as shell aliases'));
console.log(color.cyan('eval "$(bot0x alias)"') + '\n');
console.log(color.bold('For more information, run:') + ' ' + color.yellow('bot0x --help') + '\n');
console.log(color.bold('Documentation:') + ' ' + color.blue('https://github.com/rsmets/bot0x-cli') + '\n');
