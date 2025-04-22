// Command: awsdrAll
// Usage: botox awsdrAll
// Runs all the common awsdr && awsrmfaa && kubectx combinations for all environments.
import { Command } from 'commander';
import { spawnSync } from 'child_process';

const ENV_LIST = [
  { env: 'dev', ctx: 'eks/dev-account-saas-cluster' },
  { env: 'staging', ctx: 'eks/staging-account-core-cluster' },
  { env: 'sb', ctx: 'eks/sandbox-account-saas-cluster' },
  { env: 'prod', ctx: 'eks/production-account-core-cluster' },
  { env: 'sec', ctx: null },
];

const awsdrAll = new Command('awsdrAll')
  .description('Run awsdr && awsrmfaa <env> && kubectx for all common environments')
  .action(async () => {
    for (const { env, ctx } of ENV_LIST) {
      console.log(`\n--- Switching to ${env} ---`);
      // Unset AWS env vars
      console.log('unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN');
      // Run awsrmfaa <env>
      const awsrmfaa = spawnSync('botox', ['awsrmfaa', env], { stdio: 'inherit', shell: true });
      if (awsrmfaa.status !== 0) {
        console.error(`awsrmfaa failed for ${env}`);
        continue;
      }
      // Run kubectx if present
      if (ctx) {
        const kubectx = spawnSync('kubectx', [ctx], { stdio: 'inherit', shell: true });
        if (kubectx.status !== 0) {
          console.error(`kubectx failed for ${ctx}`);
        }
      }
    }
  });

export default awsdrAll;
