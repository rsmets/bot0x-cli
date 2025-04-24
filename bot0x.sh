#!/bin/sh
# bot0x.sh: Shell plugin for seamless bot0x CLI integration
# Source this file in your ~/.zshrc or ~/.bashrc for seamless AWS environment variable updates
#
# Usage: source /path/to/bot0x.sh
#
# This file wraps commands that need eval to modify the current shell environment
# IMPORTANT: Source this BEFORE running eval "$(bot0x alias)" to avoid conflicts

# --- Commands that modify shell environment variables (require eval) ---
__bot0x_awsp() {
  eval "$(bot0x switchAwsProfile "$@")"
}

__bot0x_awsdr() {
  eval "$(bot0x awsdr)"
}

__bot0x_awsrmfaa() {
  eval "$(bot0x assumeAwsMfaRoleAutomatically "$@")"
}

__bot0x_awsmfa() {
  eval "$(bot0x awsMfa "$@")"
}

# Function to handle swapping AWS role and kubectx
__bot0x_awsr() {
  # Get the environment and kubectx arguments
  local env=$1
  local kubectx=$2
  # Shift off the first two arguments if they exist, or just the first if only one exists
  # This removes env and kubectx from $@ so remaining args can be passed to awsrmfaa
  shift 2 2>/dev/null || shift $(($# > 0 ? 1 : 0))
  
  # Execute commands one by one
  __bot0x_awsdr
  __bot0x_awsp default-root
  __bot0x_awsrmfaa $env "$@" # Pass env and any additional args
  
  # Only switch kubectx if it was provided
  if [ -n "$kubectx" ]; then
    /usr/local/bin/kubectx $kubectx
  fi
}

# Create aliases to the functions
alias awsp='__bot0x_awsp'
alias awsdr='__bot0x_awsdr'
alias awsrmfaa='__bot0x_awsrmfaa'
alias awsmfa='__bot0x_awsmfa'
alias awsr='__bot0x_awsr'
alias awsdra='__bot0x_awsr dev eks/dev-account-saas-cluster'
alias awsrsta='__bot0x_awsr staging eks/staging-account-core-cluster'
alias awsrsba='__bot0x_awsr sb eks/sandbox-account-saas-cluster'
alias awsrpa='__bot0x_awsr prod eks/production-account-core-cluster'
alias awsrseca='__bot0x_awsr sec'

# --- Documentation ---
# This file contains only commands that need to modify the shell environment.
# For all other commands, use the alias feature:
#
# Add this to your ~/.zshrc or ~/.bashrc:
# eval "$(bot0x alias)"
#
# This will create shell functions for all bot0x commands.
