/**
 * Run terragrunt plan command.
 * Equivalent to: terragrunt plan
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function terragruntPlanHandler() {
  const cmd = 'terragrunt plan';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const terragruntPlan = new Command('terragruntPlan')
  .description('terragrunt plan')
  .action(terragruntPlanHandler);

export default terragruntPlan;
