/**
 * Alias: kgpaw
 * Show all pods across all namespaces and watch for changes.
 * Equivalent to: kubectl get pods -A --watch
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetPodsAllWatchHandler() {
  const cmd = 'kubectl get pods -A --watch';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGetPodsAllWatch = new Command('kubectlGetPodsAllWatch')
  .description('kubectl get pods -A --watch')
  .action(kubectlGetPodsAllWatchHandler);

export default kubectlGetPodsAllWatch;
