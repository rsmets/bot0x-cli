/**
 * Sync an ArgoCD application with temporary port-forwarding
 * Usage: bot0x argosync <service>
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';
import { getArgoCdPassword } from '../utils/argocd.js';

/**
 * Sync an ArgoCD application with temporary port-forwarding
 * @param {string} appName - The name of the ArgoCD application to sync
 * @returns {void}
 */
export async function argoSyncHandler(appName) {
  if (!appName) {
    console.error(chalk.red('Usage: bot0x argosync <service>'));
    return;
  }

  const port = 8080;
  
  // Check if port is already in use
  console.log(chalk.cyan(`Checking if port ${port} is available...`));
  const portCheck = shell.exec(`lsof -i TCP:${port} -sTCP:LISTEN`, { silent: true });
  if (portCheck.stdout) {
    console.error(chalk.red(`Port ${port} is already in use. Please free it.`));
    return;
  }
  
  // Start port-forward
  console.log(chalk.cyan(`Starting port-forward for ArgoCD on port ${port}...`));
  const portForward = shell.exec(
    `kubectl port-forward svc/argocd-server -n argocd ${port}:443 > /dev/null 2>&1 &`,
    { silent: true, async: true }
  );
  
  // Store the PID for cleanup later
  const pfPid = shell.exec('echo $!', { silent: true }).stdout.trim();
  
  // Wait for port-forward to become active
  console.log(chalk.cyan('Waiting for port-forward to become active...'));
  let portActive = false;
  for (let i = 0; i < 10; i++) {
    const check = shell.exec(`lsof -i TCP:${port} -sTCP:LISTEN`, { silent: true });
    if (check.stdout) {
      portActive = true;
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (!portActive) {
    console.error(chalk.red(`Failed to establish port-forward on port ${port}.`));
    shell.exec(`kill ${pfPid}`, { silent: true });
    return;
  }
  
  try {
    // Get ArgoCD password
    console.log(chalk.cyan('Retrieving ArgoCD admin password...'));
    const password = getArgoCdPassword();
    
    if (!password) {
      throw new Error('Failed to retrieve ArgoCD password');
    }
    
    // Login to ArgoCD
    console.log(chalk.cyan('Logging into ArgoCD...'));
    const loginResult = shell.exec(
      `argocd login localhost:${port} --username admin --password "${password}" --insecure --skip-test-tls --grpc-web`,
      { silent: true }
    );
    
    if (loginResult.code !== 0) {
      throw new Error(`ArgoCD login failed: ${loginResult.stderr}`);
    }
    
    // Sync application
    console.log(chalk.cyan(`Syncing application: ${appName}`));
    const syncResult = shell.exec(`argocd app sync "${appName}"`, { silent: false });
    
    if (syncResult.code !== 0) {
      throw new Error(`ArgoCD sync failed: ${syncResult.stderr}`);
    }
    
    console.log(chalk.green(`Successfully synced application: ${appName}`));
  } catch (error) {
    console.error(chalk.red(error.message));
  } finally {
    // Clean up port-forward
    console.log(chalk.cyan('Cleaning up port-forward...'));
    shell.exec(`kill ${pfPid}`, { silent: true });
  }
}

/**
 * Commander command for argosync.
 */
const argoSync = new Command('argosync')
  .description('Sync an ArgoCD application with temporary port-forwarding')
  .argument('<service>', 'The name of the ArgoCD application to sync')
  .action(argoSyncHandler);

export default argoSync;
