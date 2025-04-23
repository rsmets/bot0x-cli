/**
 * Outputs the path to or content of the bot0x.sh script
 * Usage: bot0x shellScript [--print]
 */
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
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
 * Print the path to or content of the bot0x.sh script
 * @param {Object} options Command options
 */
export function shellScriptHandler(options) {
  const scriptPath = getScriptPath();
  
  if (options.print) {
    // Print the content of the script
    try {
      const scriptContent = readFileSync(scriptPath, 'utf8');
      console.log(scriptContent);
    } catch (error) {
      console.error(chalk.red(`Error reading script: ${error.message}`));
      process.exit(1);
    }
  } else {
    // Print the path to the script
    console.log(scriptPath);
  }
}

const shellScript = new Command('shellScript')
  .description('Get the path to or content of the bot0x.sh script for shell integration')
  .option('-p, --print', 'Print the content of the script instead of the path')
  .action(shellScriptHandler);

export default shellScript;
