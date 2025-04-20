/**
 * Show all pods wide and watch for changes.
 * Equivalent to: kubectl get pods -o wide --watch
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetPodsWideWatchHandler() {
  const cmd = 'kubectl get pods -o wide --watch';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGetPodsWideWatch = new Command('kubectlGetPodsWideWatch')
  .description('kubectl get pods -o wide --watch')
  .action(kubectlGetPodsWideWatchHandler);

export default kubectlGetPodsWideWatch;
