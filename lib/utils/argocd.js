// Utility functions for ArgoCD password handling
import shell from 'shelljs';

/**
 * Fetch the ArgoCD initial admin password from the Kubernetes secret.
 * Returns the password as a string (trims whitespace).
 */
export function getArgoCdPassword() {
  const cmd = 'kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d';
  const result = shell.exec(cmd, { silent: true });
  return result.stdout.trim();
}
