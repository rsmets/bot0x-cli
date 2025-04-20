/**
 * Show resource usage for all pods across namespaces.
 * Equivalent to: kubectl top pod -A
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlTopPodAllHandler() {
  const cmd = 'kubectl top pod -A';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlTopPodAll = new Command('kubectlTopPodAll')
  .description('kubectl top pod -A')
  .action(kubectlTopPodAllHandler);

export default kubectlTopPodAll;
