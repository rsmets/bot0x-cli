#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { createRequire } from 'module';
import killbyport from '../lib/commands/killbyport.js';
import gitclean from '../lib/commands/gitclean.js';
import flushdns from '../lib/commands/flushdns.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();

program
  .name('botox')
  .description('A multi-tool CLI for system utilities')
  .version(pkg.version, '-v, --version', 'output the current version')
  .showHelpAfterError();

// killbyport / kbp
program
  .command('killbyport <port>')
  .alias('kbp')
  .description('Kill process running on a specific port')
  .action(async (port) => {
    try {
      await killbyport(port);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

// gitclean
program
  .command('gitclean')
  .description('Clean up merged git branches (except main/master)')
  .action(async () => {
    try {
      await gitclean();
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

// flushdns
program
  .command('flushdns')
  .description('Flush DNS cache')
  .action(async () => {
    try {
      await flushdns();
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

// Parse args
program.parseAsync(process.argv);
