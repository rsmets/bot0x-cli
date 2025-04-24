/**
 * Alias: awsrmfaa
 * Assume an AWS IAM role with MFA automatically for a given environment.
 * Usage: bot0x assumeAwsMfaRoleAutomatically <env>
 * Equivalent to: The shell function 'assumeAwsMfaRoleAutomatically'
 */
import { Command } from 'commander';
import shell from 'shelljs';
import { getConfig } from '../utils/config.js';
import { debug, info, error, output, setDebugMode } from '../utils/logger.js';

const ROLE_MAP = {
  prod: {
    env: 'production',
    arn: 'arn:aws:iam::574388719779:role/admin-role',
  },
  sb: {
    env: 'sandbox',
    arn: 'arn:aws:iam::032538391126:role/admin-role',
  },
  staging: {
    env: 'staging',
    arn: 'arn:aws:iam::058264190665:role/admin-role',
  },
  sec: {
    env: 'security',
    arn: 'arn:aws:iam::653738373620:role/admin-role',
  },
  dev: {
    env: 'dev',
    arn: 'arn:aws:iam::408067220840:role/admin-role',
  },
};

export async function assumeAwsMfaRoleAutomaticallyHandler(envArg) {
  // Use the unified config loader for global/project config
  const config = getConfig();
  const { env, arn } = ROLE_MAP[envArg] || ROLE_MAP['dev'];

  // Generate MFA token using config values
  const pw = config.totp.aws_password;
  const label = config.totp.aws_root_label;

  // Show the command being used to generate the token
  info(`Generating MFA token using: totp-cli generate unum ${label}`);

  // Try to get the current token
  const token = shell.exec(`echo '${pw}' | totp-cli generate unum ${label} | tr -d '\n'`, { silent: true }).stdout.trim();
  info(`Using MFA token: ${token}`);

  // Get AWS username
  let username = shell.exec("aws sts get-caller-identity --output text --query 'Arn' | cut -f 2 -d '/'", { silent: true }).stdout.trim();

  // Ensure we have a valid session name - use 'bot0x-session' if username is empty
  if (!username) {
    username = 'bot0x-session';
    debug('Could not determine username, using default session name: bot0x-session');
  }

  // Debug the current AWS profile
  const currentProfile = process.env.AWS_PROFILE || 'default';
  debug(`Current AWS profile: ${currentProfile}`);

  // Use config for MFA serial and region
  const mfaSerial = config.aws.mfa_serial;
  const region = config.aws.default_region;

  // Debug logging
  debug(`Environment: ${envArg}`);
  debug(`Role ARN: ${arn}`);
  debug(`Username: ${username}`);
  debug(`MFA Serial: ${mfaSerial}`);
  debug(`Region: ${region}`);

  // Assume role with verbose output
  debug(`Running AWS assume-role command...`);

  // First try with the current token
  let assumeCmd = `aws sts assume-role --role-arn ${arn} --role-session-name ${username} --serial-number ${mfaSerial} --token-code ${token} --duration-seconds 3600 --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" --output text`;
  debug(`Command: ${assumeCmd}`);

  // Run the command with verbose output but capture output to avoid printing credentials
  let result = shell.exec(assumeCmd, { silent: true });
  let { stdout, stderr, code } = result;
  debug(`Command exit code: ${code}`);

  // Handle various error cases and retry as needed
  if (code !== 0) {
    // Case 1: Invalid MFA code
    if (stderr && stderr.includes('invalid MFA one time pass code')) {
      info(`First token attempt failed. Waiting for next token...`);

      // Wait a few seconds to get a new token
      shell.exec('sleep 2', { silent: true });

      // Try to get a new token
      const newToken = shell.exec(`echo '${pw}' | totp-cli generate unum ${label} | tr -d '\n'`, { silent: true }).stdout.trim();

      // Only try again if we got a different token
      if (newToken !== token) {
        info(`Trying again with new token: ${newToken}`);

        // Try again with the new token
        assumeCmd = `aws sts assume-role --role-arn ${arn} --role-session-name ${username} --serial-number ${mfaSerial} --token-code ${newToken} --duration-seconds 3600 --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" --output text`;
        result = shell.exec(assumeCmd, { silent: true });
        stdout = result.stdout;
        stderr = result.stderr;
        code = result.code;
        debug(`Second attempt command exit code: ${code}`);
      }
    }
    // Case 2: Expired token
    else if (stderr && stderr.includes('ExpiredToken')) {
      info(`AWS credentials expired. Try refreshing your credentials first.`);
      info(`Run 'aws sso login' or 'aws configure' to refresh your credentials.`);

      // Suggest a fix
      info(`\nSuggested fix: `);
      info(`1. Run 'aws configure' to set up your AWS CLI credentials`);
      info(`2. Make sure your default profile is configured correctly`);
      info(`3. Try running the command again`);
    }
    // Case 3: Other errors
    else {
      debug(`Command failed with error: ${stderr}`);
    }
  }

  debug(`Got stdout length: ${stdout ? stdout.length : 0}`);

  if (code !== 0) {
    error('Failed to get aws credentials');
    if (stderr) error(stderr);
    process.exit(1);
    return;
  }

  // Parse the credentials from the output
  const credentials = stdout.trim().split(/\s+/);
  debug(`Parsed ${credentials.length} credential components`);

  if (credentials.length >= 3) {
    const [AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN] = credentials;
    debug(`Successfully parsed credentials (access key ID: ${AWS_ACCESS_KEY_ID.substring(0, 5)}...)`);

    // Set the assumed role profile using setarp logic
    const profileName = `${env}-account`;
    debug(`Setting AWS profile: ${profileName}`);
    
    const setarpCmd = [
      `aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID} --profile ${profileName}`,
      `aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY} --profile ${profileName}`,
      `aws configure set aws_session_token ${AWS_SESSION_TOKEN} --profile ${profileName}`,
      `aws configure set region ${region} --profile ${profileName}`,
      `aws configure set output json --profile ${profileName}`,
    ].join(' && ');
    shell.exec(setarpCmd, { silent: true });

    // Output for eval in the shell - make sure to properly format for eval
    output(`export AWS_PROFILE="${profileName}"`);
    output(`export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"`);
    output(`export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"`);
    output(`export AWS_SESSION_TOKEN="${AWS_SESSION_TOKEN}"`);
    output(`export AWS_DEFAULT_REGION="${region}"`);
    debug(`Successfully exported AWS environment variables`);
  } else {
    error('Failed to parse AWS credentials');
    process.exit(1);
  }
}

const assumeAwsMfaRoleAutomatically = new Command('assumeAwsMfaRoleAutomatically')
  .alias('awsrmfaa')
  .description('Assume an AWS IAM role with MFA automatically')
  .argument('<env>', 'Environment (dev, staging, sb, prod, sec)')
  .option('--debug', 'Enable debug logging')
  .action((envArg, options) => {
    // Set debug mode based on the flag
    setDebugMode(options.debug);
    assumeAwsMfaRoleAutomaticallyHandler(envArg);
  });

export default assumeAwsMfaRoleAutomatically;
