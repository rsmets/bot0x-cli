/**
 * Alias: szf
 * Show a Zsh function definition from the custom.zsh file.
 * Usage: bot0x showZshFunction <functionName>
 * Equivalent to: grep -A 15 -B 5 "<functionName>()" ~/.oh-my-zsh/custom/custom.zsh
 */
import { Command } from 'commander';
import shell from 'shelljs';

export function showZshFunctionHandler(functionName) {
  const file = process.env.HOME + '/.oh-my-zsh/custom/custom.zsh';
  const cmd = `grep -A 15 -B 5 \"${functionName}()\" ${file}`;
  shell.exec(cmd, { stdio: 'inherit' });
}

const showZshFunction = new Command('showZshFunction')
  .alias('szf')
  .description('Show a Zsh function definition from your custom.zsh')
  .argument('<functionName>', 'Name of the function to show')
  .action(showZshFunctionHandler);

export default showZshFunction;
