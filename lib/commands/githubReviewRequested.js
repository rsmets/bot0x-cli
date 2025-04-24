/**
 * Open GitHub pull requests waiting for your review
 * Usage: bot0x githubReviewRequested
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

/**
 * Open GitHub pull requests waiting for your review in Chrome
 * @returns {void}
 */
export function githubReviewRequestedHandler() {
  console.log(chalk.cyan('Opening GitHub pull requests waiting for your review...'));
  
  const url = 'https://github.com/pulls/review-requested';
  const browser = 'Google Chrome';
  
  // Use the open command to open the URL in Chrome
  const result = shell.exec(`open -a '${browser}' '${url}'`, { silent: true });
  
  if (result.code !== 0) {
    console.error(chalk.red(`Failed to open URL: ${result.stderr}`));
    return;
  }
  
  console.log(chalk.green(`Successfully opened ${url} in ${browser}`));
}

/**
 * Commander command for githubReviewRequested.
 */
const githubReviewRequested = new Command('githubReviewRequested')
  .alias('ghrr')
  .description('Open GitHub pull requests waiting for your review in Chrome')
  .action(githubReviewRequestedHandler);

export default githubReviewRequested;
