/**
 * Alias: kgew
 * Show kubernetes events and watch for changes.
 * Equivalent to: kubectl get events --watch
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetEventsWatchHandler() {
  const cmd = 'kubectl get events --watch';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGetEventsWatch = new Command('kubectlGetEventsWatch')
  .alias('kgew')
  .description('kubectl get events --watch')
  .action(kubectlGetEventsWatchHandler);

export default kubectlGetEventsWatch;
