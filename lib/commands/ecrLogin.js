/**
 * Alias: ecrlogin
 * Login to AWS ECR for the specified environment (sb, prod, or dev).
 * Usage: botox ecrLogin <env>
 * Equivalent to: aws ecr get-login-password ... | docker login ...
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export function ecrLoginHandler(env) {
  const region = 'us-west-2';
  let accountNumber = '';
  process.env.HELM_EXPERIMENTAL_OCI = '1';
  switch (env) {
    case 'sb':
      accountNumber = '032538391126';
      break;
    case 'prod':
      accountNumber = '574388719779';
      break;
    default:
      accountNumber = '408067220840';
      break;
  }
  const cmd = `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountNumber}.dkr.ecr.${region}.amazonaws.com`;
  shell.exec(cmd, { stdio: 'inherit' });
}

const ecrLogin = new Command('ecrLogin')
  .alias('ecrlogin')
  .description('Login to AWS ECR for the specified environment (sb, prod, dev)')
  .argument('<env>', 'Environment (sb, prod, dev)')
  .action(ecrLoginHandler);

export default ecrLogin;
