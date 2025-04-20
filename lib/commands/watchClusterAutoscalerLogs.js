/**
 * Watch logs for the cluster-autoscaler deployment in kube-system namespace.
 * Equivalent to: kubectl -n kube-system logs -f deployment.apps/cluster-autoscaler
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function watchClusterAutoscalerLogsHandler() {
  const cmd = "kubectl -n kube-system logs -f deployment.apps/cluster-autoscaler";
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const watchClusterAutoscalerLogs = new Command('watchClusterAutoscalerLogs')
  .description('kubectl -n kube-system logs -f deployment.apps/cluster-autoscaler')
  .action(watchClusterAutoscalerLogsHandler);

export default watchClusterAutoscalerLogs;
