/**
 * Clean Command
 * Removes the dist directory and all build artifacts
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger.js';
import { loadConfig } from './config.js';
import { confirm } from './prompts.js';

/**
 * Get directory size in bytes
 */
function getDirectorySize(dirPath: string): number {
  let totalSize = 0;

  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

/**
 * Format bytes to human readable size
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Count files in directory recursively
 */
function countFiles(dirPath: string): number {
  let count = 0;

  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      count += countFiles(filePath);
    } else {
      count++;
    }
  }

  return count;
}

/**
 * Clean command options
 */
export interface CleanOptions {
  force?: boolean;
  verbose?: boolean;
}

/**
 * Clean the dist directory
 */
export async function cleanCommand(options: CleanOptions = {}): Promise<void> {
  const projectRoot = process.cwd();
  
  // Load config to get output directory
  const config = await loadConfig();
  const outputDir = config.output || 'dist/bundle.js';
  const distDir = path.join(projectRoot, path.dirname(outputDir));

  logger.info('Rynex Clean Command');
  console.log();

  // Check if dist directory exists
  if (!fs.existsSync(distDir)) {
    logger.info(`Directory '${path.basename(distDir)}' does not exist`);
    logger.success('Nothing to clean!');
    return;
  }

  // Get directory info
  const fileCount = countFiles(distDir);
  const dirSize = getDirectorySize(distDir);

  if (fileCount === 0) {
    logger.info(`Directory '${path.basename(distDir)}' is already empty`);
    logger.success('Nothing to clean!');
    return;
  }

  // Show what will be deleted
  logger.info(`Found: ${path.basename(distDir)}/`);
  logger.info(`  Files: ${fileCount}`);
  logger.info(`  Size: ${formatBytes(dirSize)}`);
  console.log();

  // Ask for confirmation unless force flag is set
  let shouldClean = options.force || false;

  if (!shouldClean) {
    shouldClean = await confirm(
      `Are you sure you want to delete the '${path.basename(distDir)}' directory?`,
      false
    );
  }

  if (!shouldClean) {
    logger.info('Clean cancelled');
    return;
  }

  // Perform cleaning
  try {
    logger.info('Cleaning...');
    
    if (options.verbose) {
      // Show files being deleted
      const files = fs.readdirSync(distDir);
      for (const file of files) {
        logger.debug(`Removing: ${file}`);
      }
    }

    // Remove the directory
    fs.rmSync(distDir, { recursive: true, force: true });

    console.log();
    logger.success(`Cleaned ${fileCount} file(s) (${formatBytes(dirSize)})`);
    logger.success(`Directory '${path.basename(distDir)}' removed successfully!`);

  } catch (error) {
    console.log();
    logger.error('Failed to clean directory');
    
    if (error instanceof Error) {
      logger.error(error.message);
    }
    
    process.exit(1);
  }
}
