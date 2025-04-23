/**
 * Command: welcome
 * Display welcome message and setup instructions
 */
import { Command } from 'commander';
import chalk from 'chalk';

const welcome = new Command('welcome')
  .description('Display welcome message and setup instructions')
  .action(() => {
    console.log('\n' + chalk.green('🎉 Welcome to bot0x CLI! 🎉') + '\n');
    console.log(chalk.bold('To enable shell integration, add these lines to your .zshrc or .bashrc:') + '\n');
    console.log(chalk.cyan('# Set up commands that modify your shell environment'));
    console.log(chalk.cyan('eval "$(bot0x shellScript --print)"') + '\n');
    console.log(chalk.cyan('# Set up all other commands as shell aliases'));
    console.log(chalk.cyan('eval "$(bot0x alias)"') + '\n');
    console.log(chalk.bold('For more information, run:') + ' ' + chalk.yellow('bot0x --help') + '\n');
    console.log(chalk.bold('Documentation:') + ' ' + chalk.blue('https://github.com/rsmets/bot0x-cli') + '\n');
  });

export default welcome;
