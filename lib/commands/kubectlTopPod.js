/**
 * Show resource usage for pods.
 * Equivalent to: kubectl top pod
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlTopPodHandler() {
  const cmd = 'kubectl top pod';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlTopPod = new Command('kubectlTopPod')
  .description('kubectl top pod')
  .action(kubectlTopPodHandler);

export default kubectlTopPod;
