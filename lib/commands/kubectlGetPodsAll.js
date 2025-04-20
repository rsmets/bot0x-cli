/**
 * Alias: kgpaw
 * Show all pods across all namespaces and watch for changes.
 * Equivalent to: kubectl get pods -A --watch
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetPodsAllHandler() {
  const cmd = 'kubectl get pods -A';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGetPodsAll = new Command('kubectlGetPodsAll')
  .alias('kgpa')
  .description('kubectl get pods -A')
  .action(kubectlGetPodsAllHandler);

export default kubectlGetPodsAll;
