/**
 * Alias: argopw
 * Get the ArgoCD initial admin password from the Kubernetes secret.
 * Usage: botox argocdPassword
 * Equivalent to: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function argocdPasswordHandler() {
  const cmd = 'kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo';
  shell.exec(cmd, { stdio: 'inherit' });
}

const argocdPassword = new Command('argocdPassword')
  .alias('argopw')
  .description('Get the ArgoCD initial admin password from the Kubernetes secret')
  .action(argocdPasswordHandler);

export default argocdPassword;
