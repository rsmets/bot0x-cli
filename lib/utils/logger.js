/**
 * Utility for consistent logging with debug mode support
 *
 * IMPORTANT: This logger makes a careful distinction between stdout and stderr:
 * - stdout (console.log): Used ONLY for actual shell commands that will be executed by eval
 * - stderr (console.error): Used for all informational, debug, and error messages
 *
 * This separation ensures that when using 'eval "$(botox command)"', only the actual
 * shell commands are executed, while informational messages are displayed to the user
 * but not interpreted as commands by the shell.
 */

// Global debug flag that can be set by commands
let debugMode = false;

/**
 * Set the debug mode
 * @param {boolean} isDebug - Whether debug mode is enabled
 */
export function setDebugMode(isDebug) {
  debugMode = !!isDebug;
}

/**
 * Get the current debug mode
 * @returns {boolean} - Whether debug mode is enabled
 */
export function getDebugMode() {
  return debugMode;
}

/**
 * Log a debug message to stderr (only if debug mode is enabled)
 * Uses stderr to avoid interference with shell commands when using eval
 * @param {string} message - The message to log
 */
export function debug(message) {
  if (debugMode) {
    console.error(`# Debug: ${message}`);
  }
}

/**
 * Log an info message to stderr (always shown)
 * Uses stderr instead of stdout to prevent messages from being executed by eval
 * @param {string} message - The message to log
 */
export function info(message) {
  console.error(`# ${message}`);
}

/**
 * Log an error message to stderr (always shown)
 * Uses stderr to ensure error messages are visible but not executed by eval
 * @param {string} message - The message to log
 */
export function error(message) {
  console.error(message);
}

/**
 * Log a message to stdout (for eval)
 * Uses stdout specifically for content that should be executed by the shell
 * when using eval "$(botox command)". Only actual shell commands should use this.
 * @param {string} message - The message to output (shell command to be executed)
 */
export function output(message) {
  console.log(message);
}
