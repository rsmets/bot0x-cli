/**
 * Alias: awsmfa
 * Generate an AWS MFA token and copy it to the clipboard.
 * Usage: botox awsMfa
 * Equivalent to: echo 'aws' | totp-cli generate unum aws-root | pbcopy
 */
import { Command } from 'commander';
import shell from 'shelljs';
import { getConfig } from '../utils/config.js';

export function awsMfaHandler() {
  const config = getConfig();
  const pw = config.totp.aws_password;
  const label = config.totp.aws_root_label;
  const cmd = `echo '${pw}' | totp-cli generate unum ${label} | pbcopy`;
  shell.exec(cmd, { stdio: 'inherit' });
  console.log('AWS MFA token copied to clipboard.');
}

const awsMfa = new Command('awsMfa')
  .alias('awsmfa')
  .description('Generate an AWS MFA token and copy it to the clipboard')
  .action(awsMfaHandler);

export default awsMfa;
