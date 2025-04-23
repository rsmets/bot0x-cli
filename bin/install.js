#!/usr/bin/env node
/**
 * Installation script for bot0x CLI
 * This script is meant to be run after installation to display setup instructions
 */
import chalk from 'chalk';

// Display welcome message
console.log('\n' + chalk.green('🎉 bot0x installed successfully! 🎉') + '\n');
console.log(chalk.bold('To enable shell integration, add these lines to your .zshrc or .bashrc:') + '\n');
console.log(chalk.cyan('# Set up commands that modify your shell environment'));
console.log(chalk.cyan('eval "$(bot0x shellScript --print)"') + '\n');
console.log(chalk.cyan('# Set up all other commands as shell aliases'));
console.log(chalk.cyan('eval "$(bot0x alias)"') + '\n');
console.log(chalk.bold('For more information, run:') + ' ' + chalk.yellow('bot0x --help') + '\n');
console.log(chalk.bold('Documentation:') + ' ' + chalk.blue('https://github.com/rsmets/bot0x-cli') + '\n');
