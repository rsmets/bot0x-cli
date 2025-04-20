/**
 * Enable kube context using kubeon.
 * Equivalent to: kubeon
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubeonHandler() {
  const cmd = 'kubeon';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubeon = new Command('kubeon')
  .description('kubeon')
  .action(kubeonHandler);

export default kubeon;
