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
      // 2. Check ~/.botox/config.json
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


export function getConfig() {
  if (configCache) return configCache;
  const configPath = path.resolve(process.cwd(), 'bot0x.config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('bot0x.config.json not found in project root');
  }
  const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  configCache = substituteEnvVars(rawConfig);
  return configCache;
}
