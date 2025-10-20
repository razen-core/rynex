/**
 * ZenWeb Configuration
 * Load and validate configuration
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger.js';

export interface RouteConfig {
  path: string;
  component?: string;
  lazy?: boolean;
  middleware?: string[];
  guards?: string[];
  meta?: Record<string, any>;
  name?: string;
  children?: RouteConfig[];
}

export interface ZenWebConfig {
  entry: string;
  output: string;
  minify: boolean;
  sourceMaps: boolean;
  port: number;
  hotReload: boolean;
  routes?: RouteConfig[];
  routing?: {
    mode?: 'hash' | 'history';
    base?: string;
    fileBasedRouting?: boolean;
    pagesDir?: string;
    scrollBehavior?: 'auto' | 'smooth' | 'instant';
    trailingSlash?: boolean;
  };
  middleware?: {
    global?: string[];
    routes?: Record<string, string[]>;
  };
  build?: {
    splitting?: boolean;
    chunkSize?: number;
    publicPath?: string;
    analyze?: boolean;
  };
}

const defaultConfig: ZenWebConfig = {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  minify: true,
  sourceMaps: true,
  port: 3000,
  hotReload: true,
  routing: {
    mode: 'history',
    base: '/',
    fileBasedRouting: true,
    pagesDir: 'src/pages',
    scrollBehavior: 'smooth',
    trailingSlash: false
  },
  middleware: {
    global: [],
    routes: {}
  },
  build: {
    splitting: true,
    chunkSize: 500,
    publicPath: '/',
    analyze: false
  }
};

/**
 * Load ZenWeb configuration
 */
export async function loadConfig(): Promise<ZenWebConfig> {
  const configPath = path.join(process.cwd(), 'zenweb.config.js');

  if (!fs.existsSync(configPath)) {
    logger.info('Using default configuration');
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
    logger.error('Error loading config', error as Error);
    return defaultConfig;
  }
}

/**
 * Validate configuration
 */
export function validateConfig(config: ZenWebConfig): boolean {
  if (!config.entry) {
    logger.error('Config error: entry is required');
    return false;
  }

  if (!config.output) {
    logger.error('Config error: output is required');
    return false;
  }

  return true;
}
