/**
 * Enable kube context globally using kubeon -g.
 * Equivalent to: kubeon -g
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubeonGHandler() {
  const cmd = 'kubeon -g';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubeonG = new Command('kubeonG')
  .description('kubeon -g')
  .action(kubeonGHandler);

export default kubeonG;
