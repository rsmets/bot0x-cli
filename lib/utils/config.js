// Utility to load bot0x.config.json
import fs from 'fs';
import path from 'path';

let configCache = null;

import { getUserSecretSync, promptAndSaveSecret } from './secretStore.js';

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function substituteEnvVarsSync(obj) {
  if (typeof obj === 'string') {
    const envVarMatch = obj.match(/^\$\{([A-Z0-9_]+)\}$/);
    if (envVarMatch) {
      const envVar = envVarMatch[1];
      // 1. Check process.env
      if (envVar in process.env) {
        return process.env[envVar];
      }
      // 2. Check ~/.bot0x/config.json
      const secret = getUserSecretSync(envVar);
      if (secret) {
        return secret;
      }
      // 3. Prompt user and save
      throw new Error(`Missing required environment variable: ${envVar}.\nPlease set it, or run a command that prompts for it interactively.`);
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(substituteEnvVarsSync);
  } else if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = substituteEnvVarsSync(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
}

// Async version for future use if needed
export async function substituteEnvVarsAsync(obj) {
  if (typeof obj === 'string') {
    const envVarMatch = obj.match(/^\$\{([A-Z0-9_]+)\}$/);
    if (envVarMatch) {
      const envVar = envVarMatch[1];
      if (envVar in process.env) {
        return process.env[envVar];
      }
      let secret = getUserSecretSync(envVar);
      if (secret) {
        return secret;
      }
      // Prompt user interactively
      secret = await promptAndSaveSecret(envVar, `Enter value for secret ${envVar}: `);
      return secret;
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return Promise.all(obj.map(substituteEnvVarsAsync));
  } else if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = await substituteEnvVarsAsync(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
}


import os from 'os';
import path from 'path';
import fs from 'fs';

/**
 * Loads configuration for bot0x CLI.
 * Priority:
 *   1. Project-local config: ./bot0x.config.json (if present)
 *   2. Global config: ~/.bot0x/config.json
 * Project config overrides global config (shallow merge).
 * Throws if neither exists.
 * Returns config with environment variable substitution and secret prompting.
 */
export function getConfig() {
  if (configCache) return configCache;
  const globalConfigPath = path.join(os.homedir(), '.bot0x', 'config.json');
  const projectConfigPath = path.resolve(process.cwd(), 'bot0x.config.json');

  let config = {};
  let found = false;

  // Load global config if it exists
  if (fs.existsSync(globalConfigPath)) {
    config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));
    found = true;
  }

  // If project config exists, shallow-merge over global config
  if (fs.existsSync(projectConfigPath)) {
    const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf-8'));
    config = { ...config, ...projectConfig };
    found = true;
  }

  if (!found) {
    throw new Error('No bot0x config found. Create ~/.bot0x/config.json or ./bot0x.config.json');
  }

  configCache = substituteEnvVarsSync(config);
  return configCache;
}
