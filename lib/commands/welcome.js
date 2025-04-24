/**
 * Command: welcome
 * Display welcome message and setup instructions with interactive config setup
 */
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.bot0x');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

const welcome = new Command('welcome')
  .description('Display welcome message and setup instructions')
  .action(async (options) => {
    console.log('\n' + chalk.green('🎉 Welcome to bot0x CLI! 🎉') + '\n');

    // Shell integration instructions
    console.log(chalk.bold('1. Shell Integration') + '\n');
    console.log(chalk.bold('Add these lines to your .zshrc or .bashrc:') + '\n');
    console.log(chalk.cyan('# Set up commands that modify your shell environment'));
    console.log(chalk.cyan('eval "$(bot0x shellScript --print)"') + '\n');
    console.log(chalk.cyan('# Set up all other commands as shell aliases'));
    console.log(chalk.cyan('eval "$(bot0x alias)"') + '\n');

    // Config file setup
    console.log(chalk.bold('2. Configuration') + '\n');

    const configExists = fs.existsSync(CONFIG_PATH);

    if (configExists) {
      console.log(chalk.yellow('A config file already exists at ~/.bot0x'));
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Do you want to overwrite it with a new configuration?',
          default: false
        }
      ]);

      if (!overwrite) {
        console.log(chalk.cyan('\nTo edit your existing config file:'));
        console.log(chalk.cyan('nano ~/.bot0x/config.json') + '\n');
        showAdditionalInfo();
        return;
      }
    }
    
    const { setupNow } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setupNow',
        message: 'Would you like to set up your config file now?',
        default: true
      }
    ]);

    if (setupNow) {
      await setupConfigInteractive();
    } else {
      console.log(chalk.bold('\nTo set up your config file later:') + '\n');
      console.log(chalk.cyan('mkdir -p ~/.bot0x'));
      console.log(chalk.cyan('cp ' + chalk.italic('node_modules/bot0x/bot0x.config.example.json') + ' ~/.bot0x/config.json'));
      console.log(chalk.cyan('nano ~/.bot0x/config.json') + '\n');
      showAdditionalInfo();
    }
  });

async function setupConfigInteractive() {
  console.log(chalk.bold('\nSetting up your bot0x configuration file...\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'aws_root_label',
      message: 'Enter your AWS TOTP label (used by totp-cli):',
      default: 'aws-root'
    },
    {
      type: 'password',
      name: 'aws_password',
      message: 'Enter your AWS TOTP password (or press Enter to set it later):',
      default: '${AWS_TOTP_PASSWORD}'
    },
    {
      type: 'input',
      name: 'default_region',
      message: 'Enter your default AWS region:',
      default: 'us-west-2'
    },
    {
      type: 'input',
      name: 'dev_account_id',
      message: 'Enter your DEV AWS account ID:'
    },
    {
      type: 'input',
      name: 'staging_account_id',
      message: 'Enter your STAGING AWS account ID:'
    },
    {
      type: 'input',
      name: 'sb_account_id',
      message: 'Enter your SANDBOX AWS account ID:'
    },
    {
      type: 'input',
      name: 'prod_account_id',
      message: 'Enter your PRODUCTION AWS account ID:'
    },
    {
      type: 'input',
      name: 'sec_account_id',
      message: 'Enter your SECURITY AWS account ID:'
    },
    {
      type: 'input',
      name: 'mfa_serial',
      message: 'Enter your AWS MFA serial ARN:',
      default: 'arn:aws:iam::ACCOUNT_ID:mfa/YOUR_USERNAME'
    },
    {
      type: 'input',
      name: 'argocd_namespace',
      message: 'Enter your ArgoCD namespace:',
      default: 'argocd'
    }
  ]);

  const config = {
    totp: {
      aws_password: answers.aws_password,
      aws_root_label: answers.aws_root_label
    },
    aws: {
      default_region: answers.default_region,
      mfa_serial: answers.mfa_serial,
      roles: {
        prod: {
          env: 'production',
          arn: `arn:aws:iam::${answers.prod_account_id}:role/admin-role`
        },
        sb: {
          env: 'sandbox',
          arn: `arn:aws:iam::${answers.sb_account_id}:role/admin-role`
        },
        staging: {
          env: 'staging',
          arn: `arn:aws:iam::${answers.staging_account_id}:role/admin-role`
        },
        sec: {
          env: 'security',
          arn: `arn:aws:iam::${answers.sec_account_id}:role/admin-role`
        },
        dev: {
          env: 'dev',
          arn: `arn:aws:iam::${answers.dev_account_id}:role/admin-role`
        }
      }
    },
    argocd: {
      namespace: answers.argocd_namespace
    }
  };

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log(chalk.green('\n✅ Configuration file created successfully at ~/.bot0x/config.json\n'));
    console.log(chalk.yellow('Note: You can edit this file anytime with:'));
    console.log(chalk.cyan('nano ~/.bot0x/config.json') + '\n');
  } catch (error) {
    console.error(chalk.red('\n❌ Error creating configuration file:'), error.message);
    console.log(chalk.yellow('\nYou can manually create it later with:'));
    console.log(chalk.cyan('mkdir -p ~/.bot0x'));
    console.log(chalk.cyan('cp ' + chalk.italic('node_modules/bot0x/bot0x.config.example.json') + ' ~/.bot0x/config.json'));
    console.log(chalk.cyan('nano ~/.bot0x/config.json') + '\n');
  }

  showAdditionalInfo();
}

function showAdditionalInfo() {
  console.log(chalk.bold('For more information, run:') + ' ' + chalk.yellow('bot0x --help') + '\n');
  console.log(chalk.bold('Documentation:') + ' ' + chalk.blue('https://github.com/rsmets/bot0x-cli') + '\n');
}

export default welcome;
