#!/usr/bin/env node

/**
 * Rynex CLI
 * Command-line interface for Rynex framework
 */

import { initProject } from "../init-new.js";  // Modern project initialization
import { build, watch } from "../builder.js";
import { startDevServer } from "../dev-server.js";
import { startProductionServer } from "../prod-server.js";
import { loadConfig, validateConfig } from "../config.js";
import { logger } from "../logger.js";
import { handleAddCommand } from "../add-command.js";
import { runTypeCheck } from "../type-checker.js";
import { runRynexValidation } from "../rynex-validator.js";
import { initCSS } from "../init-css-command.js";
import { cleanCommand } from "../clean-command.js";
import * as path from "path";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case "init": {
      const projectName = args[1]; // Optional, will prompt if not provided
      await initProject(projectName);
      break;
    }

    case "build": {
      const config = await loadConfig();
      if (!validateConfig(config)) {
        process.exit(1);
      }

      // Run Rynex validation FIRST
      const rynexValid = runRynexValidation(process.cwd());

      if (!rynexValid) {
        logger.error("\n❌ Build failed: Fix Rynex validation errors above\n");
        process.exit(1);
      }

      // Run type checking
      const typeCheckResult = runTypeCheck(process.cwd());

      if (!typeCheckResult.success) {
        logger.error(
          `\n❌ Build failed: Found ${typeCheckResult.errorCount} type error(s)`,
        );
        logger.error("Fix the errors above and try again.\n");
        process.exit(1);
      }

      await build({
        entry: config.entry,
        output: config.output,
        minify: config.minify,
        sourceMaps: config.sourceMaps,
        routes: config.routes,
        config,
      });
      break;
    }

    case "dev": {
      const config = await loadConfig();
      if (!validateConfig(config)) {
        process.exit(1);
      }

      // Run Rynex validation (show warnings in dev mode)
      const rynexValid = runRynexValidation(process.cwd());

      if (!rynexValid) {
        logger.warning("\nFound Rynex validation errors");
        logger.warning(
          "Continuing in development mode, but please fix these errors.\n",
        );
      }

      // Run type checking (show warnings but don't fail in dev mode)
      const typeCheckResult = runTypeCheck(process.cwd());

      if (!typeCheckResult.success) {
        logger.warning(`\nFound ${typeCheckResult.errorCount} type error(s)`);
        logger.warning(
          "Continuing in development mode, but please fix these errors.\n",
        );
      }

      // Build first
      await build({
        entry: config.entry,
        output: config.output,
        minify: false,
        sourceMaps: true,
        routes: config.routes,
        config,
      });

      // Start watch mode
      watch({
        entry: config.entry,
        output: config.output,
        minify: false,
        sourceMaps: true,
        routes: config.routes,
        config,
      });

      // Start dev server
      const distDir = path.join(process.cwd(), path.dirname(config.output));
      await startDevServer({
        port: config.port,
        root: distDir,
        hotReload: config.hotReload,
        routes: config.routes,
        config,
      });
      break;
    }

    case "start": {
      const config = await loadConfig();
      if (!validateConfig(config)) {
        process.exit(1);
      }

      // Start production server
      const distDir = path.join(process.cwd(), path.dirname(config.output));
      await startProductionServer({
        port: config.port,
        root: distDir,
        config,
      });
      break;
    }

    case "add": {
      const integration = args[1];
      await handleAddCommand(integration);
      break;
    }

    case "init:css": {
      await initCSS();
      break;
    }

    case "clean": {
      const force = args.includes("--force") || args.includes("-f");
      const verbose = args.includes("--verbose") || args.includes("-v");
      await cleanCommand({ force, verbose });
      break;
    }

    case "help":
    case "--help":
    case "-h":
    default: {
      console.log(`
Rynex CLI - Minimalist JavaScript Framework

Usage:
  rynex <command> [options]

Commands:
  init [name]       Create a new Rynex project
  init:css          Initialize Tailwind CSS v4 setup
  build             Build project for production
  dev               Start development server with hot reload
  start             Start production server (Express or native HTTP)
  add <name>        Add integrations (e.g., tailwind)
  clean [options]   Remove build artifacts (dist directory)
  help              Show this help message

Clean Options:
  -f, --force       Skip confirmation prompt
  -v, --verbose     Show detailed output

Examples:
  rynex init my-app
  rynex init:css
  rynex dev
  rynex build
  rynex clean
  rynex clean --force
  rynex clean --verbose
  rynex add tailwind
  rynex start

For more information, visit: https://github.com/rynex
      `);
      break;
    }
  }
}

main().catch((error) => {
  logger.error("Fatal error", error);
  process.exit(1);
});
