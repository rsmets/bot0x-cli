/**
 * Alias: kgpaw
 * Show all pods across all namespaces and watch for changes.
 * Equivalent to: kubectl get pods -A --watch
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetPodsHandler() {
  const cmd = 'kubectl get pods';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGetPods = new Command('kubectlGetPods')
  .alias('kgp')
  .description('kubectl get pods')
  .action(kubectlGetPodsHandler);

export default kubectlGetPods;
