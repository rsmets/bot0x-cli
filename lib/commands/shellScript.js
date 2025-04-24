/**
 * Reads and outputs the shell script for AWS environment commands
 * Usage: bot0x shellScript [--print]
 */
import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the path to the bot0x.sh script
 * @returns {string} Absolute path to bot0x.sh
 */
export function getScriptPath() {
  // The script is in the root of the project
  return resolve(__dirname, '../../bot0x.sh');
}

/**
 * Read the shell script content from bot0x.sh file
 * @returns {string} The shell script content
 */
function readShellScript() {
  try {
    const scriptPath = getScriptPath();
    return readFileSync(scriptPath, 'utf8');
  } catch (error) {
    console.error(chalk.red(`Error reading bot0x.sh: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Print the shell script or its path
 * @param {Object} options Command options
 */
export function shellScriptHandler(options) {
  if (options.print) {
    // Print the shell script content from bot0x.sh
    console.log(readShellScript());
  } else {
    // Print a message about how to use the command
    console.log(chalk.cyan('To use bot0x AWS environment commands, add this to your .zshrc or .bashrc:'));
    console.log(chalk.yellow('\neval "$(bot0x shellScript --print)"\n'));
    console.log(chalk.cyan('Or save it to a file and source it:'));
    console.log(chalk.yellow('\nbot0x shellScript --print > ~/.bot0x-aws.sh'));
    console.log(chalk.yellow('source ~/.bot0x-aws.sh\n'));

    // Show the path to the source file
    console.log(chalk.cyan('Shell script source file:'));
    console.log(chalk.yellow(getScriptPath() + '\n'));
  }
}

const shellScript = new Command('shellScript')
  .description('Generate shell functions for AWS environment commands')
  .option('-p, --print', 'Print the shell script content')
  .action(shellScriptHandler);

export default shellScript;
