/**
 * Flush DNS cache
 * Usage: botox flushdns
 */
import shell from 'shelljs';
import chalk from 'chalk';

export default async function flushdns() {
  console.log(chalk.cyan('Flushing DNS cache...'));
  let result;
  if (process.platform === 'darwin') {
    // macOS
    result = shell.exec('sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder', { silent: false });
  } else if (process.platform === 'win32') {
    // Windows
    result = shell.exec('ipconfig /flushdns', { silent: false });
  } else {
    // Linux (systemd)
    result = shell.exec('sudo systemd-resolve --flush-caches', { silent: false });
  }
  if (result.code === 0) {
    console.log(chalk.green('DNS cache flushed successfully.'));
  } else {
    console.error(chalk.red('Failed to flush DNS cache.'));
    process.exit(1);
  }
}
