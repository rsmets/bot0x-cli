/**
 * Run terraform command.
 * Equivalent to: terraform
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function terraformHandler() {
  const cmd = 'terraform';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const terraform = new Command('terraform')
  .alias('tf')
  .description('terraform')
  .action(terraformHandler);

export default terraform;
