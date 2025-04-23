# bot0x.sh: Shell plugin for seamless bot0x CLI integration
# Source this file in your ~/.zshrc or ~/.bashrc for seamless AWS environment variable updates
#
# Usage: source /path/to/bot0x.sh
#
# This file wraps commands that need eval to modify the current shell environment
# IMPORTANT: Source this BEFORE running eval "$(bot0x alias)" to avoid conflicts

# --- Commands that modify shell environment variables (require eval) ---

# AWS Profile and Role Switching
__bot0x_awssr() {
  eval "$(bot0x awsSwitchRole "$@")"
}

__bot0x_awsp() {
  eval "$(bot0x switchAwsProfile "$@")"
}

__bot0x_awsdr() {
  eval "$(bot0x awsdr "$@")"
}

__bot0x_awsdrAll() {
  eval "$(bot0x awsdrAll "$@")"
}

__bot0x_awsrmfaa() {
  eval "$(bot0x assumeAwsMfaRoleAutomatically "$@")"
}

__bot0x_awsmfa() {
  eval "$(bot0x awsMfa "$@")"
}

# Create aliases to the functions
alias awssr='__bot0x_awssr'
alias awsp='__bot0x_awsp'
alias awsdr='__bot0x_awsdr'
alias awsdrAll='__bot0x_awsdrAll'
alias awsrmfaa='__bot0x_awsrmfaa'
alias awsmfa='__bot0x_awsmfa'

# --- Documentation ---
# This file contains only commands that need to modify the shell environment.
# For all other commands, use the alias feature:
#
# Add this to your ~/.zshrc or ~/.bashrc:
# eval "$(bot0x alias)"
#
# This will create shell functions for all bot0x commands.
