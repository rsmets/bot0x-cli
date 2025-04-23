/**
 * CircleCI command
 * Usage: botox cci [command]
 * 
 * Executes circleci commands
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

/**
 * Execute the CircleCI command
 * @param {string[]} args - Command arguments
 * @returns {void}
 */
export function cciHandler(args) {
  if (!args || args.length === 0) {
    console.log(chalk.yellow('No CircleCI command specified. Running circleci help...'));
    shell.exec('circleci help', { stdio: 'inherit' });
    return;
  }

  console.log(chalk.cyan(`Running circleci ${args.join(' ')}...`));
  
  const result = shell.exec(`circleci ${args.join(' ')}`, { stdio: 'inherit' });
  
  if (result.code !== 0) {
    console.error(chalk.red(`CircleCI command failed with exit code ${result.code}`));
    process.exit(result.code);
  }
}

/**
 * Commander command for cci.
 */
const cci = new Command('cci')
  .description('Run CircleCI commands (alias for circleci)')
  .allowUnknownOption()
  .allowExcessArguments()
  .action((_, command) => {
    // Get all the arguments after the command name
    const args = command.args;
    cciHandler(args);
  });

export default cci;
