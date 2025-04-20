/**
 * Run terragrunt apply command.
 * Equivalent to: terragrunt apply
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function terragruntApplyHandler() {
  const cmd = 'terragrunt apply';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const terragruntApply = new Command('terragruntApply')
  .description('terragrunt apply')
  .action(terragruntApplyHandler);

export default terragruntApply;
