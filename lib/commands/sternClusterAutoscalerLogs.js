/**
 * Tail logs for the cluster-autoscaler using stern.
 * Equivalent to: stern -n kube-system cluster-autoscaler --tail=50
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function sternClusterAutoscalerLogsHandler() {
  const cmd = "stern -n kube-system cluster-autoscaler --tail=50";
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const sternClusterAutoscalerLogs = new Command('sternClusterAutoscalerLogs')
  .description('stern -n kube-system cluster-autoscaler --tail=50')
  .action(sternClusterAutoscalerLogsHandler);

export default sternClusterAutoscalerLogs;
