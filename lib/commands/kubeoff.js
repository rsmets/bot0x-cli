/**
 * Disable kube context using kubeoff.
 * Equivalent to: kubeoff
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubeoffHandler() {
  const cmd = 'kubeoff';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubeoff = new Command('kubeoff')
  .description('kubeoff')
  .action(kubeoffHandler);

export default kubeoff;
