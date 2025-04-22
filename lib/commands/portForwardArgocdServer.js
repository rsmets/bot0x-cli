/**
 * Alias: pfas
 * Port-forward the ArgoCD server pod and open the UI in Chrome.
 * Usage: bot0x portForwardArgocdServer
 */
import { Command } from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';

export async function portForwardArgocdServerHandler() {
  // Get ArgoCD password (calls argopw)
  shell.exec('kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo', { stdio: 'inherit' });
  const podNameCmd = "kubectl get pods -n argocd -l app.kubernetes.io/name=argocd-server -o name | awk -F '/' '{print $2}'";
  const podName = shell.exec(podNameCmd, { silent: true }).stdout.trim();
  const port = 8080;
  shell.exec(`open -a 'Google Chrome' http://localhost:${port}`);
  shell.exec(`kubectl port-forward ${podName} -n argocd ${port}:${port}`, { stdio: 'inherit' });
}

const portForwardArgocdServer = new Command('portForwardArgocdServer')
  .alias('pfas')
  .description('Port-forward the ArgoCD server pod and open the UI in Chrome')
  .action(portForwardArgocdServerHandler);

export default portForwardArgocdServer;
