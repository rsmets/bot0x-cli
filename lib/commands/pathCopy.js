/**
 * Copy current working directory to clipboard
 * Usage: bot0x pcopy
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

/**
 * Copy the current working directory to the clipboard
 * @returns {void}
 */
export function pcopyHandler() {
  const pwd = shell.pwd().toString();
  
  // Use pbcopy to copy to clipboard (macOS)
  const result = shell.exec(`echo "${pwd}" | pbcopy`, { silent: true });
  
  if (result.code === 0) {
    console.log(chalk.green(`Current directory copied to clipboard: ${chalk.cyan(pwd)}`));
  } else {
    console.error(chalk.red(`Failed to copy to clipboard: ${result.stderr}`));
  }
}

/**
 * Commander command for pcopy.
 */
const pcopy = new Command('pathCopy')
  .alias('pcopy')
  .description('Copy current working directory to clipboard')
  .action(pcopyHandler);

export default pcopy;
