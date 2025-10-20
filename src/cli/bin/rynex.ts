#!/usr/bin/env node

/**
 * Rynex CLI
 * Command-line interface for Rynex framework
 */

import { initProject } from '../init.js';
import { build, watch } from '../builder.js';
import { startDevServer } from '../dev-server.js';
import { startProductionServer } from '../prod-server.js';
import { loadConfig, validateConfig } from '../config.js';
import { logger } from '../logger.js';
import * as path from 'path';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'init': {
      const projectName = args[1] || 'my-rynex-app';
      await initProject(projectName);
      break;
    }

    case 'build': {
      const config = await loadConfig();
      if (!validateConfig(config)) {
        process.exit(1);
      }

      await build({
        entry: config.entry,
        output: config.output,
        minify: config.minify,
        sourceMaps: config.sourceMaps,
        routes: config.routes,
        config
      });
      break;
    }

    case 'dev': {
      const config = await loadConfig();
      if (!validateConfig(config)) {
        process.exit(1);
      }

      // Build first
      await build({
        entry: config.entry,
        output: config.output,
        minify: false,
        sourceMaps: true,
        routes: config.routes,
        config
      });

      // Start watch mode
      watch({
        entry: config.entry,
        output: config.output,
        minify: false,
        sourceMaps: true,
        routes: config.routes,
        config
      });

      // Start dev server
      const distDir = path.join(process.cwd(), path.dirname(config.output));
      await startDevServer({
        port: config.port,
        root: distDir,
        hotReload: config.hotReload,
        routes: config.routes,
        config
      });
      break;
    }

    case 'start': {
      const config = await loadConfig();
      if (!validateConfig(config)) {
        process.exit(1);
      }

      // Start production server
      const distDir = path.join(process.cwd(), path.dirname(config.output));
      await startProductionServer({
        port: config.port,
        root: distDir,
        config
      });
      break;
    }

    case 'clean': {
      const { execSync } = await import('child_process');
      logger.info('Cleaning build artifacts');
      execSync('rm -rf dist', { stdio: 'inherit' });
      logger.success('Clean complete');
      break;
    }

    case 'help':
    case '--help':
    case '-h':
    default: {
      console.log(`
Rynex CLI - Minimalist JavaScript Framework

Usage:
  rynex <command> [options]

Commands:
  init [name]    Create a new Rynex project
  build          Build project for production
  dev            Start development server with hot reload
  start          Start production server (Express or native HTTP)
  clean          Remove build artifacts
  help           Show this help message

Examples:
  rynex init my-app
  rynex dev
  rynex build
  rynex start

For more information, visit: https://github.com/rynex
      `);
      break;
    }
  }
}

main().catch(error => {
  logger.error('Fatal error', error);
  process.exit(1);
});
