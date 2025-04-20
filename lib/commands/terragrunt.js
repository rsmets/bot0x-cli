/**
 * Run terragrunt command.
 * Equivalent to: terragrunt
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function terragruntHandler() {
  const cmd = 'terragrunt';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const terragrunt = new Command('terragrunt')
  .description('terragrunt')
  .action(terragruntHandler);

export default terragrunt;
