# bot0x.sh: Shell plugin for seamless bot0x CLI integration
# Source this file in your ~/.zshrc or ~/.bashrc for seamless AWS and utility commands
#
# Usage: source /path/to/bot0x.sh
#
# This file wraps commands that need eval (like awssr, awsp, awsdr) and provides direct wrappers for others.

# --- AWS Profile and Role Switching ---
awssr() {
  eval "$(bot0x awsSwitchRole "$@")"
}
awsp() {
  eval "$(bot0x switchAwsProfile "$@")"
}
awsdr() {
  eval "$(bot0x awsdr "$@")"
}
awsdrAll() {
  eval "$(bot0x awsdrAll "$@")"
}

# --- ECR Login ---
ecrLogin() {
  bot0x ecrLogin "$@"
}
ecrlogin() {
  ecrLogin "$@"
}

# --- Utility Wrappers (add more as needed) ---
flushdns() {
  bot0x flushdns "$@"
}
gitclean() {
  bot0x gitclean "$@"
}

# --- Kubectl Helpers ---
kubectlGetPods() {
  bot0x kubectlGetPods "$@"
}
kubectlGetPodsAll() {
  bot0x kubectlGetPodsAll "$@"
}
kubectlGetPodsAllWatch() {
  bot0x kubectlGetPodsAllWatch "$@"
}

# --- Add more wrappers as needed ---

# --- Completion (optional, advanced) ---
# You may add completion support here if your CLI supports it.

# --- Documentation ---
# This file is auto-generated for seamless bot0x CLI integration.
# Place it in your repo and instruct users to source it in their shell config.
