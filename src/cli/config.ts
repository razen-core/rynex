/**
 * ZenWeb Configuration
 * Load and validate configuration
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ZenWebConfig {
  entry: string;
  output: string;
  minify: boolean;
  sourceMaps: boolean;
  port: number;
  hotReload: boolean;
}

const defaultConfig: ZenWebConfig = {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  minify: true,
  sourceMaps: true,
  port: 3000,
  hotReload: true
};

/**
 * Load ZenWeb configuration
 */
export async function loadConfig(): Promise<ZenWebConfig> {
  const configPath = path.join(process.cwd(), 'zenweb.config.js');

  if (!fs.existsSync(configPath)) {
    console.log('⚙️  Using default configuration');
    return defaultConfig;
  }

  try {
    const configModule = await import(configPath);
    const userConfig = configModule.default || configModule;

    return {
      ...defaultConfig,
      ...userConfig
    };
  } catch (error) {
    console.error('❌ Error loading config:', error);
    return defaultConfig;
  }
}

/**
 * Validate configuration
 */
export function validateConfig(config: ZenWebConfig): boolean {
  if (!config.entry) {
    console.error('❌ Config error: entry is required');
    return false;
  }

  if (!config.output) {
    console.error('❌ Config error: output is required');
    return false;
  }

  return true;
}
