/**
 * Get kubernetes certificates.
 * Equivalent to: kubectl get certificate
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlGetCertificateHandler() {
  const cmd = 'kubectl get certificate';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlGetCertificate = new Command('kubectlGetCertificate')
  .description('kubectl get certificate')
  .action(kubectlGetCertificateHandler);

export default kubectlGetCertificate;
