// Command: awsdrSwitch
// Usage: botox awsdrSwitch <env>
// Handles multi-step AWS environment switching: unsets AWS credentials, assumes role, and switches kubectx.
// Supported envs: dev, staging, sb, prod, sec
import { Command } from 'commander';
import { spawnSync } from 'child_process';
import { debug, info, error, output, setDebugMode } from '../utils/logger.js';

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
  .action(async (env, options) => {
    // Set debug mode based on the flag
    setDebugMode(options.debug);
    if (!ENV_MAP[env]) {
      error(`Unknown env: ${env}`);
      process.exit(1);
    }
    // Output shell code to unset AWS vars (for eval usage)
    output('unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN');

    const role = ENV_MAP[env].role;

    // Set AWS_PROFILE using switchAwsProfile (outputs export command)
    debug(`Setting AWS_PROFILE to default-root`);
    const profileResult = spawnSync('botox', ['switchAwsProfile', 'default-root'], { encoding: 'utf-8', shell: true });
    if (profileResult.stdout) {
      // Output the export command so it can be eval'd in the shell
      process.stdout.write(profileResult.stdout);
    }

    // Run awsrmfaa <env>
    debug(`Assuming role: ${role}`);
    const awsrmfaaArgs = ['awsrmfaa', role];
    if (options.debug) {
      awsrmfaaArgs.push('--debug');
    }
    const awsrmfaa = spawnSync('botox', awsrmfaaArgs, { stdio: 'inherit', shell: true });
    if (awsrmfaa.status !== 0) {
      process.exit(awsrmfaa.status);
    }

    // Run kubectx if present - make sure it's executed properly in the shell
    if (ENV_MAP[env].ctx) {
      // Add the kubectx command directly to be eval'd by the shell
      info(`Switching kubectl context to ${ENV_MAP[env].ctx}`);
      // Using a direct command for eval that will be executed in the user's shell
      output(`/usr/local/bin/kubectx ${ENV_MAP[env].ctx}`);
    }
  });

export default awsSwitchRole;
