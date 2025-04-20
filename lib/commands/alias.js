/**
 * Outputs shell functions for each botox subcommand, enabling shell aliasing.
 * Usage: eval "$(botox alias -- "$0")"
 */
import { Command } from 'commander';
import { readdirSync } from 'fs';
import { resolve, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Discover all available subcommands in lib/commands (excluding alias itself).
 * @returns {string[]} List of subcommand names
 */
function getSubcommandNames() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const commandsDir = resolve(__dirname);
  return readdirSync(commandsDir)
    .filter(f => f.endsWith('.js') && f !== 'alias.js')
    .map(f => {
      // Import the command module and get the command name
      const mod = require(commandsDir + '/' + f);
      return mod.default?._name || basename(f, '.js');
    })
    .filter(Boolean);
}

/**
 * Print shell functions for each subcommand.
 */
function printShellAliases(binName) {
  const subcommands = getSubcommandNames();
  for (const cmd of subcommands) {
    // Print a shell function for each subcommand
    // e.g. kbp() { botox kbp "$@"; }
    console.log(`${cmd}() { ${binName} ${cmd} "$@"; }`);
  }
}

const alias = new Command('alias')
  .description('Emit shell functions for all botox subcommands (for eval in your shell)')
  .allowExcessArguments()
  .argument('[bin]', 'Name of the botox binary (default: botox)', 'botox')
  .action((bin) => {
    printShellAliases(bin);
  });

export default alias;
