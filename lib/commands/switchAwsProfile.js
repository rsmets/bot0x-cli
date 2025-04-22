// Command: switchAwsProfile
// Usage: eval $(botox switchAwsProfile <profileName>)
// Outputs shell code to set AWS_PROFILE for the current shell session.

import { Command } from 'commander';

const switchAwsProfile = new Command('switchAwsProfile')
  .alias('awsp')
  .description('Output shell code to set AWS_PROFILE to the given value')
  .argument('<profile>', 'AWS profile name')
  .action((profile) => {
    // Output shell code to set AWS_PROFILE
    // This is meant to be eval'd in the shell: eval $(botox switchAwsProfile <profile>)
    console.log(`export AWS_PROFILE=${profile}`);
  });

export default switchAwsProfile;
