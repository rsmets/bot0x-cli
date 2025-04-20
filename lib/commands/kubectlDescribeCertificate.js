/**
 * Describe kubernetes certificates.
 * Equivalent to: kubectl describe certificate
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlDescribeCertificateHandler() {
  const cmd = 'kubectl describe certificate';
  console.log(chalk.cyan('Running:'), cmd);
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlDescribeCertificate = new Command('kubectlDescribeCertificate')
  .description('kubectl describe certificate')
  .action(kubectlDescribeCertificateHandler);

export default kubectlDescribeCertificate;
