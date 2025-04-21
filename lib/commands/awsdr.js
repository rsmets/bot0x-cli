// Command: awsdr
// Unsets AWS credential environment variables in the current shell session.
// Usage: eval $(botox awsdr)

import { Command } from 'commander';

const awsdr = new Command('awsdr')
  .description('Unset AWS credential environment variables for the current shell')
  .action(() => {
    // Output shell code to unset AWS env vars
    // This is meant to be eval'd in the shell: eval $(botox awsdr)
    console.log('unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN');
  });

export default awsdr;
