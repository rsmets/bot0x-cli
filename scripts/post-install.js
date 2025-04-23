#!/usr/bin/env node

/**
 * This script runs after npm install and displays helpful information
 * about how to set up bot0x for shell integration.
 */

import chalk from 'chalk';

// Show the message if installed globally or if run directly
const isGlobalInstall = process.env.npm_config_global === 'true';
const isRunDirectly = !process.env.npm_lifecycle_event;

// Display the message if it's a global install or if the script is being run directly for testing
if (isGlobalInstall || isRunDirectly) {
  console.log('\n' + chalk.green('🎉 bot0x installed successfully! 🎉') + '\n');
  console.log(chalk.bold('To enable shell integration, add these lines to your .zshrc or .bashrc:') + '\n');
  console.log(chalk.cyan('# Set up commands that modify your shell environment'));
  console.log(chalk.cyan('eval "$(bot0x shellScript --print)"') + '\n');
  console.log(chalk.cyan('# Set up all other commands as shell aliases'));
  console.log(chalk.cyan('eval "$(bot0x alias)"') + '\n');
  console.log(chalk.bold('For more information, run:') + ' ' + chalk.yellow('bot0x --help') + '\n');
  console.log(chalk.bold('Documentation:') + ' ' + chalk.blue('https://github.com/rsmets/bot0x-cli') + '\n');
}
