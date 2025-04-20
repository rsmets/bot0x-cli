/**
 * Disable kube context globally using kubeoff -g.
 * Equivalent to: kubeoff -g
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubeoffGHandler() {
  const cmd = 'kubeoff -g';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubeoffG = new Command('kubeoffG')
  .description('kubeoff -g')
  .action(kubeoffGHandler);

export default kubeoffG;
