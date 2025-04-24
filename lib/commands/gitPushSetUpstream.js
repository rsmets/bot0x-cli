/**
 * Push current branch and set upstream to origin
 * Usage: bot0x gitPushSetUpstream
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

/**
 * Push the current branch and set upstream to origin
 * @returns {void}
 */
export function gitPushSetUpstreamHandler() {
  // Get the current branch
  const { stdout: currentBranch } = shell.exec('git rev-parse --abbrev-ref HEAD', { silent: true });
  const trimmedCurrentBranch = currentBranch.trim();
  
  if (!trimmedCurrentBranch || trimmedCurrentBranch === 'HEAD') {
    console.error(chalk.red('Not on a branch. Cannot push.'));
    return;
  }
  
  console.log(chalk.cyan(`Pushing branch ${trimmedCurrentBranch} and setting upstream...`));
  
  // Push and set upstream
  const result = shell.exec(`git push --set-upstream origin "${trimmedCurrentBranch}"`, { silent: false });
  
  if (result.code !== 0) {
    console.error(chalk.red(`Failed to push branch: ${result.stderr}`));
    return;
  }
  
  console.log(chalk.green(`Successfully pushed ${trimmedCurrentBranch} and set upstream`));
}

/**
 * Commander command for gitPushSetUpstream.
 */
const gitPushSetUpstream = new Command('gitPushSetUpstream')
  .alias('gp')
  .description('Push current branch and set upstream to origin')
  .action(gitPushSetUpstreamHandler);

export default gitPushSetUpstream;
