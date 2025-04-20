// Utilities for storing and retrieving secrets in ~/.botox/config.json
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';

const userConfigDir = path.join(os.homedir(), '.botox');
const userConfigPath = path.join(userConfigDir, 'config.json');

export function getUserSecretSync(key) {
  if (fs.existsSync(userConfigPath)) {
    const config = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
    if (config[key]) return config[key];
  }
  return null;
}

export async function promptAndSaveSecret(key, promptText) {
  await fs.promises.mkdir(userConfigDir, { recursive: true });
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(promptText, (answer) => {
      let config = {};
      if (fs.existsSync(userConfigPath)) {
        config = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
      }
      config[key] = answer;
      fs.writeFileSync(userConfigPath, JSON.stringify(config, null, 2), { mode: 0o600 });
      rl.close();
      resolve(answer);
    });
  });
}
