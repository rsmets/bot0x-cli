// Command: awsdrSwitch
// Usage: botox awsdrSwitch <env>
// Handles multi-step AWS environment switching: unsets AWS credentials, assumes role, and switches kubectx.
// Supported envs: dev, staging, sb, prod, sec
import { Command } from 'commander';
import { spawnSync } from 'child_process';

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
  .action(async (env) => {
    if (!ENV_MAP[env]) {
      console.error(`Unknown env: ${env}`);
      process.exit(1);
    }
    // Output shell code to unset AWS vars (for eval usage)
    console.log('unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN');

    const role = ENV_MAP[env].role;

    // Set AWS_PROFILE using switchAwsProfile (outputs export command)
    const profileResult = spawnSync('botox', ['switchAwsProfile', 'default-root'], { encoding: 'utf-8', shell: true });
    if (profileResult.stdout) {
      // Output the export command so it can be eval'd in the shell
      process.stdout.write(profileResult.stdout);
    }

    // Run awsrmfaa <env>
    const awsrmfaa = spawnSync('botox', ['awsrmfaa', role], { stdio: 'inherit', shell: true });
    if (awsrmfaa.status !== 0) {
      process.exit(awsrmfaa.status);
    }

    // Run kubectx if present - but don't output anything for eval
    if (ENV_MAP[env].ctx) {
      // Execute kubectx in a separate process that doesn't affect the eval output
      console.log(`# Switching kubectl context to ${ENV_MAP[env].ctx}`);
      console.log(`kubectx ${ENV_MAP[env].ctx} > /dev/null 2>&1 || true`);
    }
  });

export default awsSwitchRole;
