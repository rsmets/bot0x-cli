/**
 * Tail logs for external-dns using stern.
 * Equivalent to: stern -n external-dns external-dns -t --tail=50
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function sternExternalDnsLogsHandler() {
  const cmd = "stern -n external-dns external-dns -t --tail=50";
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const sternExternalDnsLogs = new Command('sternExternalDnsLogs')
  .description('stern -n external-dns external-dns -t --tail=50')
  .action(sternExternalDnsLogsHandler);

export default sternExternalDnsLogs;
