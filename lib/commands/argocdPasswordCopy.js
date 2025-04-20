/**
 * Alias: argopwc
 * Copy the ArgoCD initial admin password to the clipboard.
 * Usage: botox argocdPasswordCopy
 * Equivalent to: echo $(argopw) | pbcopy
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function argocdPasswordCopyHandler() {
  const cmd = 'kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d | pbcopy';
  shell.exec(cmd, { stdio: 'inherit' });
}

const argocdPasswordCopy = new Command('argocdPasswordCopy')
  .alias('argopwc')
  .description('Copy the ArgoCD initial admin password to the clipboard')
  .action(argocdPasswordCopyHandler);

export default argocdPasswordCopy;
