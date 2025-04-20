/**
 * Alias: kn
 * Switch kubectl namespace using kubens.
 * Equivalent to: kubens
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubensHandler() {
  const cmd = 'kubens';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubens = new Command('kubens')
  .alias('kn')
  .description('kubens')
  .action(kubensHandler);

export default kubens;
