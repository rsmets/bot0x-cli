/**
 * Kill process running on a specific port
 * Usage: botox killbyport <port>
 */
/**
 * Kill a process running on a specific port.
 * @param {string|number} port - The port to kill the process on.
 * @returns {void}
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function killProcessByPort(port) {
  if (!/^[0-9]+$/.test(String(port))) {
    console.error(chalk.red('Port must be a number.'));
    process.exit(1);
  }
  console.log(chalk.cyan(`Searching for process on port ${port}...`));
  const { stdout } = shell.exec(`lsof -i :${port} -t`, { silent: true });
  const pid = stdout.trim();
  if (!pid) {
    console.log(chalk.yellow(`No process found on port ${port}.`));
    return;
  }
  console.log(chalk.yellow(`Killing process with PID ${pid}...`));
  const result = shell.exec(`kill -9 ${pid}`, { silent: true });
  if (result.code === 0) {
    console.log(chalk.green(`Successfully killed process on port ${port}.`));
  } else {
    console.error(chalk.red(`Failed to kill process: ${result.stderr}`));
    process.exit(1);
  }
}

/**
 * Commander command for killbyport (and kbp alias).
 */
const killbyport = new Command('killbyport')
  .alias('kbp')
  .arguments('<port>')
  .description('Kill process running on a specific port')
  .action(killProcessByPort);

export default killbyport;

