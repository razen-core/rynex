#!/usr/bin/env node

/**
 * ZenWeb CLI
 * Command-line interface for ZenWeb framework
 */

import { initProject } from '../init.js';
import { build, watch } from '../builder.js';
import { startDevServer } from '../dev-server.js';
import { loadConfig, validateConfig } from '../config.js';
import * as path from 'path';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'init': {
      const projectName = args[1] || 'my-zenweb-app';
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
        sourceMaps: config.sourceMaps
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
        sourceMaps: true
      });

      // Start watch mode
      watch({
        entry: config.entry,
        output: config.output,
        minify: false,
        sourceMaps: true
      });

      // Start dev server
      const publicDir = path.join(process.cwd(), 'public');
      await startDevServer({
        port: config.port,
        root: publicDir,
        hotReload: config.hotReload
      });
      break;
    }

    case 'clean': {
      const { execSync } = await import('child_process');
      console.log('🧹 Cleaning build artifacts...');
      execSync('rm -rf dist', { stdio: 'inherit' });
      console.log('✅ Clean complete');
      break;
    }

    case 'help':
    case '--help':
    case '-h':
    default: {
      console.log(`
ZenWeb CLI - Minimalist JavaScript Framework

Usage:
  zenweb <command> [options]

Commands:
  init [name]    Create a new ZenWeb project
  build          Build project for production
  dev            Start development server with hot reload
  clean          Remove build artifacts
  help           Show this help message

Examples:
  zenweb init my-app
  zenweb dev
  zenweb build

For more information, visit: https://github.com/zenweb
      `);
      break;
    }
  }
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
