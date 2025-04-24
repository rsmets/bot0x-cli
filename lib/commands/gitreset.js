/**
 * Reset to default branch and delete current branch
 * Usage: bot0x gitreset
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

/**
 * Reset to default branch and delete current branch.
 * Switches to the default branch (main/master), pulls latest changes,
 * and deletes the branch you were previously on.
 * @returns {void}
 */
export function gitResetHandler() {
  // Get the current branch
  const { stdout: currentBranch } = shell.exec('git rev-parse --abbrev-ref HEAD', { silent: true });
  const trimmedCurrentBranch = currentBranch.trim();
  
  console.log(chalk.cyan(`Current branch: ${trimmedCurrentBranch}`));
  
  // Get the default branch
  const { stdout: defaultBranchOutput } = shell.exec('git symbolic-ref refs/remotes/origin/HEAD', { silent: true });
  let defaultBranch;
  
  if (defaultBranchOutput) {
    defaultBranch = defaultBranchOutput.trim().replace('refs/remotes/origin/', '');
  } else {
    // Fallback to checking if main or master exists
    if (shell.exec('git show-ref --verify --quiet refs/heads/main', { silent: true }).code === 0) {
      defaultBranch = 'main';
    } else if (shell.exec('git show-ref --verify --quiet refs/heads/master', { silent: true }).code === 0) {
      defaultBranch = 'master';
    } else {
      console.error(chalk.red('Could not determine default branch'));
      return;
    }
  }
  
  console.log(chalk.cyan(`Default branch: ${defaultBranch}`));
  
  // Store the old branch name
  const oldBranch = trimmedCurrentBranch;
  
  // Only proceed if we're not already on the default branch
  if (trimmedCurrentBranch !== defaultBranch) {
    console.log(chalk.yellow(`Switching to ${defaultBranch} and pulling latest changes...`));
    
    // Checkout default branch
    const checkoutResult = shell.exec(`git checkout ${defaultBranch}`, { silent: true });
    if (checkoutResult.code !== 0) {
      console.error(chalk.red(`Failed to checkout ${defaultBranch}: ${checkoutResult.stderr}`));
      return;
    }
    
    // Pull latest changes
    const pullResult = shell.exec('git pull', { silent: true });
    if (pullResult.code !== 0) {
      console.error(chalk.red(`Failed to pull latest changes: ${pullResult.stderr}`));
      return;
    }
    
    // Delete the old branch
    console.log(chalk.yellow(`Deleting branch: ${oldBranch}`));
    const deleteResult = shell.exec(`git branch -D ${oldBranch}`, { silent: true });
    if (deleteResult.code !== 0) {
      console.error(chalk.red(`Failed to delete branch ${oldBranch}: ${deleteResult.stderr}`));
      return;
    }
    
    console.log(chalk.green(`Successfully reset to ${defaultBranch} and deleted ${oldBranch}`));
  } else {
    console.log(chalk.green(`Already on default branch ${defaultBranch}. Nothing to do.`));
  }
}

/**
 * Commander command for gitreset.
 */
const gitreset = new Command('gitreset')
  .alias('greset')
  .description('Reset to default branch and delete current branch')
  .action(gitResetHandler);

export default gitreset;
