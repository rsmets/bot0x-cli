/**
 * Switch kubectl context using kubectx.
 * Equivalent to: kubectx
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectxHandler() {
  const cmd = 'kubectx';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectx = new Command('kubectx')
  .description('kubectx')
  .action(kubectxHandler);

export default kubectx;
