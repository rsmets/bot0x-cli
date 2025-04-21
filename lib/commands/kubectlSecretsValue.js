/**
 * Alias: ksv
 * Get a value from a Kubernetes secret (base64 decoded).
 * Usage: bot0x kubectlSecretsValue <key> [secret_name]
 * Equivalent to: kubectl get secret "<secret_name>" -o jsonpath="{.data.<key>}" | base64 --decode
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function kubectlSecretsValueHandler(key, secretName = 'core-service') {
  if (!key) {
    console.error(chalk.red('Key must be provided.'));
    process.exit(1);
  }
  const cmd = `kubectl get secret "${secretName}" -o jsonpath=\"{.data.${key}}\" | base64 --decode`;
  shell.exec(cmd, { stdio: 'inherit' });
}

const kubectlSecretsValue = new Command('kubectlSecretsValue')
  .alias('ksv')
  .description('Get a value from a Kubernetes secret (base64 decoded)')
  .argument('<key>', 'Key in the secret')
  .argument('[secret_name]', 'Secret name (default: core-service)')
  .action(kubectlSecretsValueHandler);

export default kubectlSecretsValue;
