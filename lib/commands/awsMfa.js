/**
 * Alias: awsmfa
 * Generate an AWS MFA token and copy it to the clipboard.
 * Usage: bot0x awsMfa
 * Equivalent to: echo 'aws' | totp-cli generate unum aws-root | pbcopy
 */
import { Command } from 'commander';
import shell from 'shelljs';
import { getConfigAsync } from '../utils/config.js';

/**
 * Handler for "awsmfa" command. Loads config interactively if missing.
 */
export async function awsMfaHandler() {
  // Use the async config loader to allow interactive creation if missing
  const config = await getConfigAsync();
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
