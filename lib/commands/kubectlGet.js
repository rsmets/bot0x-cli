/**
 * Run kubectl get command.
 * Equivalent to: kubectl get
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetHandler() {
  const cmd = 'kubectl get';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGet = new Command('kubectlGet')
  .alias('kg')
  .description('kubectl get')
  .action(kubectlGetHandler);

export default kubectlGet;
