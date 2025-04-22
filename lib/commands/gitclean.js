/**
 * Clean up merged git branches except main/master
 * Usage: bot0x gitclean
 */
/**
 * Defines the gitclean command for the CLI.
 * Usage: bot0x gitclean
 * Cleans up merged git branches except main/master.
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

/**
 * Clean up merged git branches except main/master.
 * @returns {void}
 */
export function cleanMergedBranches() {
  console.log(chalk.cyan('Fetching latest...'));
  shell.exec('git fetch', { silent: true });

  console.log(chalk.cyan('Finding merged branches...'));
  const { stdout } = shell.exec('git branch --merged', { silent: true });
  const branches = stdout.split('\n')
    .map(b => b.trim())
    .filter(b => b && b !== 'main' && b !== 'master' && !b.startsWith('*'));

  if (branches.length === 0) {
    console.log(chalk.green('No merged branches to delete.'));
    return;
  }

  console.log(chalk.yellow('Deleting merged branches:'), branches.join(', '));
  for (const branch of branches) {
    const result = shell.exec(`git branch -d ${branch}`, { silent: true });
    if (result.code === 0) {
      console.log(chalk.green(`Deleted ${branch}`));
    } else {
      console.error(chalk.red(`Failed to delete ${branch}: ${result.stderr}`));
    }
  }
}

/**
 * Commander command for gitclean.
 */
const gitclean = new Command('gitclean')
  .description('Clean up merged git branches (except main/master)')
  .action(cleanMergedBranches);

export default gitclean;

