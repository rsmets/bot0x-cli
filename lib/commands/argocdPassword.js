/**
 * Alias: argopw
 * Get the ArgoCD initial admin password from the Kubernetes secret.
 * Usage: bot0x argocdPassword
 * Equivalent to: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

import { getArgoCdPassword } from '../utils/argocd.js';

export function argocdPasswordHandler() {
  // Print the password to stdout with a newline
  console.log(getArgoCdPassword() + '\n');
}

const argocdPassword = new Command('argocdPassword')
  .alias('argopw')
  .description('Get the ArgoCD initial admin password from the Kubernetes secret')
  .action(argocdPasswordHandler);

export default argocdPassword;
