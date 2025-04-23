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

  const token = shell.exec(`echo '${pw}' | totp-cli generate unum ${label} | tr -d '\n'`, { silent: true }).stdout.trim();

  // Show the token being used (to stderr so it doesn't affect eval)
  info(`Using MFA token: ${token}`);

  // Get AWS username
  const username = shell.exec("aws sts get-caller-identity --output text --query 'Arn' | cut -f 2 -d '/'", { silent: true }).stdout.trim();

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
  const assumeCmd = `aws sts assume-role --role-arn ${arn} --role-session-name ${username} --serial-number ${mfaSerial} --token-code ${token} --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" --output text`;
  debug(`Command: ${assumeCmd}`);

  // Run the command with verbose output but capture output to avoid printing credentials
  const { stdout, stderr, code } = shell.exec(assumeCmd, { silent: true });
  debug(`Command exit code: ${code}`);
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
    const setarpCmd = [
      `aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID} --profile ${env}-account`,
      `aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY} --profile ${env}-account`,
      `aws configure set aws_session_token ${AWS_SESSION_TOKEN} --profile ${env}-account`,
      `aws configure set region ${region} --profile ${env}-account`,
      `aws configure set output json --profile ${env}-account`,
    ].join(' && ');
    shell.exec(setarpCmd, { silent: true });

    // Output for eval in the shell - make sure to properly format for eval
    output(`export AWS_PROFILE="${env}-account"`);
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
