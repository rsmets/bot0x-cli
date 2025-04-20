// Utility to load bot0x.config.json
import fs from 'fs';
import path from 'path';

let configCache = null;

function substituteEnvVars(obj) {
  if (typeof obj === 'string') {
    const envVarMatch = obj.match(/^\$\{([A-Z0-9_]+)\}$/);
    if (envVarMatch) {
      const envVar = envVarMatch[1];
      if (!(envVar in process.env)) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
      return process.env[envVar];
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(substituteEnvVars);
  } else if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = substituteEnvVars(obj[key]);
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
