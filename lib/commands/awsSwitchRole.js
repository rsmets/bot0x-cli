/**
 * Command: awsSwitchRole (alias: awssr)
 * Usage: botox awssr <env>
 * Handles multi-step AWS environment switching: unsets AWS credentials, assumes role, and switches kubectx.
 * Supported envs: dev, staging, sb, prod, sec
 */
import { Command } from 'commander';
import { debug, info, output, setDebugMode } from '../utils/logger.js';

const ENV_MAP = {
  dev: {
    role: 'dev',
    ctx: 'eks/dev-account-saas-cluster',
  },
  staging: {
    role: 'staging',
    ctx: 'eks/staging-account-core-cluster',
  },
  sb: {
    role: 'sb',
    ctx: 'eks/sandbox-account-saas-cluster',
  },
  prod: {
    role: 'prod',
    ctx: 'eks/production-account-core-cluster',
  },
  sec: {
    role: 'sec',
    ctx: null, // no kubectx for sec
  },
};

const awsSwitchRole = new Command('awsSwitchRole')
  .alias('awssr')
  .description('Unset AWS credentials, assume role, and switch kubectx for an env')
  .argument('<env>', 'Environment (dev, staging, sb, prod, sec)')
  .option('--debug', 'Enable debug logging')
  .action((env, options) => {
    // Set debug mode based on the flag
    setDebugMode(options.debug);

    // Get the environment configuration
    const envConfig = ENV_MAP[env];
    if (!envConfig) {
      console.error(`Unknown environment: ${env}`);
      process.exit(1);
      return;
    }

    // Simple approach: just output the shell commands to be eval'd
    debug(`Setting up environment for: ${env}`);

    // 1. Unset AWS environment variables
    output('unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN');

    // 2. Set AWS profile to default-root
    output('export AWS_PROFILE=default-root');

    // 3. Run awsrmfaa with the role
    info(`Assuming role: ${envConfig.role}`);
    output(`botox awsrmfaa ${envConfig.role}${options.debug ? ' --debug' : ''}`);

    // 4. Switch kubectl context if applicable
    if (envConfig.ctx) {
      info(`Switching kubectl context to: ${envConfig.ctx}`);
      // Use the full path to kubectx to ensure it's found
      // The command needs to be executed directly by the shell, not as a subcommand
      output(`/usr/local/bin/kubectx ${envConfig.ctx}`);
    }
  });

export default awsSwitchRole;
