/**
 * Run terragrunt apply -auto-approve command.
 * Equivalent to: terragrunt apply -auto-approve
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function terragruntApplyAutoApproveHandler() {
  const cmd = 'terragrunt apply -auto-approve';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const terragruntApplyAutoApprove = new Command('terragruntApplyAutoApprove')
  .description('terragrunt apply -auto-approve')
  .action(terragruntApplyAutoApproveHandler);

export default terragruntApplyAutoApprove;
