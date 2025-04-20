/**
 * Show kubernetes events.
 * Equivalent to: kubectl get events
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetEventsHandler() {
  const cmd = 'kubectl get events';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGetEvents = new Command('kubectlGetEvents')
  .description('kubectl get events')
  .action(kubectlGetEventsHandler);

export default kubectlGetEvents;
