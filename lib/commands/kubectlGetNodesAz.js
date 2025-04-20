/**
 * Show kubernetes nodes and their availability zones.
 * Equivalent to: kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.failure-domain\\.beta\\.kubernetes\\.io/zone}{"\n"}{end}'
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetNodesAzHandler() {
  const cmd = "kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{\"\t\"}{.metadata.labels.failure-domain\\.beta\\.kubernetes\\.io/zone}{\"\n\"}{end}'";
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGetNodesAz = new Command('kubectlGetNodesAz')
  .description('kubectl get nodes -o jsonpath for AZ')
  .action(kubectlGetNodesAzHandler);

export default kubectlGetNodesAz;
