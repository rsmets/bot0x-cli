/**
 * Outputs shell functions for each bot0x subcommand, enabling shell aliasing.
 * Usage: eval "$(bot0x alias -- "$0")"
 */
import { Command } from 'commander';
import { readdirSync } from 'fs';
import { resolve, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * List of commands that require eval (modify the shell environment)
 * These will be excluded from the alias command and handled by shellScript
 */
const EVAL_COMMANDS = [
  'awsSwitchRole',
  'awssr',
  'switchAwsProfile',
  'awsp',
  'awsdr',
  'awsdrAll',
  'assumeAwsMfaRoleAutomatically',
  'awsrmfaa',
  'awsMfa',
  'awsmfa'
];

/**
 * Discover all available subcommands in lib/commands (excluding alias itself and commands that require eval).
 * @returns {string[]} List of subcommand names
 */
// Async: dynamically import each command module to get the subcommand name
// Async: dynamically import each command module to get the subcommand name and all aliases
async function getSubcommandNamesAndAliases() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const commandsDir = resolve(__dirname);
  const files = readdirSync(commandsDir).filter(f => f.endsWith('.js') && f !== 'alias.js');
  const names = new Set();
  for (const f of files) {
    const mod = await import(commandsDir + '/' + f);
    // Main command name
    const commandName = mod.default?._name || basename(f, '.js');
    if (!EVAL_COMMANDS.includes(commandName)) names.add(commandName);

    // All aliases, if defined
    if (mod.default && typeof mod.default.aliases === 'function') {
      const aliases = mod.default.aliases();
      if (Array.isArray(aliases)) {
        for (const alias of aliases) {
          if (!EVAL_COMMANDS.includes(alias)) names.add(alias);
        }
      }
    }
  }
  return Array.from(names).filter(Boolean);
}

/**
 * Print shell functions for each subcommand.
 */
// Async: print shell aliases for all subcommands
// Async: print shell aliases for all subcommands and all their aliases
async function printShellAliases(binName) {
  const subcommands = await getSubcommandNamesAndAliases();
  for (const cmd of subcommands) {
    // Print a shell function for each subcommand and alias
    // e.g. kbp() { bot0x kbp "$@"; }
    console.log(`${cmd}() { ${binName} ${cmd} "$@"; }`);
  }
}

const alias = new Command('alias')
  .description('Emit shell functions for all bot0x subcommands (for eval in your shell)')
  .allowExcessArguments()
  .argument('[bin]', 'Name of the bot0x binary (default: bot0x)', 'bot0x')
  .action(async (bin) => {
    await printShellAliases(bin);
  });

export default alias;
