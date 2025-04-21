/**
 * Alias: cdar
 * Clean up dangling ArgoCD resources and remove finalizers.
 * Usage: bot0x cleanupDanglingArgocdResources <resource>
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function cleanupDanglingArgocdResourcesHandler(resource) {
  if (!resource) {
    console.error(chalk.red('Resource name must be provided.'));
    process.exit(1);
  }
  const cleanupCmd = `kubectl delete hpa,service,ingress,secret,cm,deploy ${resource}`;
  const patchCmd = `kubectl patch application/${resource} --type json --patch='[ { "op": "remove", "path": "/metadata/finalizers" } ]' -n argocd`;
  shell.exec(cleanupCmd, { stdio: 'inherit' });
  shell.exec(patchCmd, { stdio: 'inherit' });
}

const cleanupDanglingArgocdResources = new Command('cleanupDanglingArgocdResources')
  .alias('cdar')
  .description('Clean up dangling ArgoCD resources and remove finalizers')
  .argument('<resource>', 'Resource name')
  .action(cleanupDanglingArgocdResourcesHandler);

export default cleanupDanglingArgocdResources;
