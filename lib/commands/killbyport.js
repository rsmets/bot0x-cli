/**
 * Kill process running on a specific port
 * Usage: botox killbyport <port>
 */
import shell from 'shelljs';
import chalk from 'chalk';

export default async function killbyport(port) {
  if (!/^[0-9]+$/.test(port)) {
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
