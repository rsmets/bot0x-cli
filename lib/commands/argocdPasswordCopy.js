/**
 * Alias: argopwc
 * Copy the ArgoCD initial admin password to the clipboard.
 * Usage: bot0x argocdPasswordCopy
 * Equivalent to: echo $(argopw) | pbcopy
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

import { getArgoCdPassword } from '../utils/argocd.js';
import { execSync } from 'child_process';

export function argocdPasswordCopyHandler() {
  // Copy the password to the clipboard
  execSync('pbcopy', { input: getArgoCdPassword() });
  console.log('ArgoCD password copied to clipboard.');
}

const argocdPasswordCopy = new Command('argocdPasswordCopy')
  .alias('argopwc')
  .description('Copy the ArgoCD initial admin password to the clipboard')
  .action(argocdPasswordCopyHandler);

export default argocdPasswordCopy;
