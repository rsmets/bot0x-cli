#!/usr/bin/env node
/**
 * Bot0x CLI entrypoint.
 * Dynamically loads all command modules from lib/commands for modular scalability.
 * Uses Commander for CLI parsing and help/version handling.
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { createRequire } from 'module';
import { readdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();
program
  .name('bot0x')
  .description('A CLI tool with handy utilities for "experienced" developers and sysadmins - so you don\'t even have to move a muscle 😉.')
  .version(pkg.version, '-v, --version', 'output the current version')
  .showHelpAfterError();

// Dynamically load and register all commands from lib/commands
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commandsDir = resolve(__dirname, '../lib/commands');

for (const file of readdirSync(commandsDir)) {
  if (!file.endsWith('.js')) continue;
  // Import command module
  const commandModule = await import(`${commandsDir}/${file}`);
  if (commandModule.default && typeof commandModule.default === 'object' && typeof commandModule.default._name === 'string') {
    // Register the command with Commander
    program.addCommand(commandModule.default);
  } else {
    console.warn(chalk.yellow(`Warning: Command module ${file} does not export a valid Commander Command instance.`));
  }
}

// Parse CLI args
program.parseAsync(process.argv);
