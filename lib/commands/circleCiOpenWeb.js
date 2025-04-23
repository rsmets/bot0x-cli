/**
 * CircleCI Open command
 * Usage: botox ccio
 * 
 * Opens the CircleCI web interface for the current project
 * while skipping update checks
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

/**
 * Execute the CircleCI open command with skip-update-check flag
 * @returns {void}
 */
export function ccioHandler() {
  console.log(chalk.cyan('Opening CircleCI in browser...'));
  
  const result = shell.exec('circleci open --skip-update-check', { silent: false });
  
  if (result.code === 0) {
    console.log(chalk.green('CircleCI opened successfully.'));
  } else {
    console.error(chalk.red('Failed to open CircleCI.'));
    process.exit(1);
  }
}

/**
 * Commander command for ccio.
 */
const ccio = new Command('ccio')
  .description('Open CircleCI web interface (circleci open --skip-update-check)')
  .action(ccioHandler);

export default ccio;
