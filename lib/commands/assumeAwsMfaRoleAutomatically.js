/**
 * Alias: awsrmfaa
 * Assume an AWS IAM role with MFA automatically for a given environment.
 * Usage: bot0x assumeAwsMfaRoleAutomatically <env>
 * Equivalent to: The shell function 'assumeAwsMfaRoleAutomatically'
 */
import { Command } from 'commander';
import shell from 'shelljs';
import { getConfig } from '../utils/config.js';

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
  console.log(arn);

  // Generate MFA token using config values
  const pw = config.totp.aws_password;
  const label = config.totp.aws_root_label;
  const token = shell.exec(`echo '${pw}' | totp-cli generate unum ${label} | tr -d '\n'`, { silent: true }).stdout.trim();
  console.log(token);

  // Get AWS username
  const username = shell.exec("aws sts get-caller-identity --output text --query 'Arn' | cut -f 2 -d '/'", { silent: true }).stdout.trim();
  console.log(username);

  // Use config for MFA serial and region
  const mfaSerial = config.aws.mfa_serial;
  const region = config.aws.default_region;

  // Assume role
  const assumeCmd = `aws sts assume-role --role-arn ${arn} --role-session-name ${username} --serial-number ${mfaSerial} --token-code ${token} --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" --output text`;
  const { stdout } = shell.exec(assumeCmd, { silent: true });
  const [AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN] = stdout.trim().split(/\s+/);

  if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_SESSION_TOKEN) {
    // Set the assumed role profile using setarp logic
    const setarpCmd = [
      `aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID} --profile ${env}-account`,
      `aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY} --profile ${env}-account`,
      `aws configure set aws_session_token ${AWS_SESSION_TOKEN} --profile ${env}-account`,
      `aws configure set region ${region} --profile ${env}-account`,
      `aws configure set output json --profile ${env}-account`,
    ].join(' && ');
    shell.exec(setarpCmd, { stdio: 'inherit' });
    shell.exec(`export AWS_PROFILE=${env}-account`);
    console.log(`AWS_PROFILE set to ${env}-account`);
  } else {
    console.error('Failed to get aws credentials');
    process.exit(1);
  }
}

const assumeAwsMfaRoleAutomatically = new Command('assumeAwsMfaRoleAutomatically')
  .alias('awsrmfaa')
  .description('Assume an AWS IAM role with MFA automatically for a given environment')
  .argument('<env>', 'Environment (prod, sb, staging, sec, dev)')
  .action(assumeAwsMfaRoleAutomaticallyHandler);

export default assumeAwsMfaRoleAutomatically;
