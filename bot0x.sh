# bot0x.sh: Shell plugin for seamless bot0x CLI integration
# Source this file in your ~/.zshrc or ~/.bashrc for seamless AWS environment variable updates
#
# Usage: source /path/to/bot0x.sh
#
# This file wraps commands that need eval to modify the current shell environment
# For all other commands, use: eval "$(bot0x alias)"

# --- Commands that modify shell environment variables (require eval) ---

# AWS Profile and Role Switching
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

awsrmfaa() {
  eval "$(bot0x assumeAwsMfaRoleAutomatically "$@")"
}

awsmfa() {
  eval "$(bot0x awsMfa "$@")"
}

# --- Documentation ---
# This file contains only commands that need to modify the shell environment.
# For all other commands, use the alias feature:
#
# Add this to your ~/.zshrc or ~/.bashrc:
# eval "$(bot0x alias)"
#
# This will create shell functions for all bot0x commands.
