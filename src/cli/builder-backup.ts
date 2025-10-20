/**
 * Rynex Builder
 * Handles compilation and bundling
 */

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { parseRynexFile, transformImports } from './parser.js';

export interface BuildOptions {
  entry: string;
  output: string;
  minify: boolean;
  sourceMaps: boolean;
  watch?: boolean;
}

import { logger } from './logger.js';

/**
 * Copy files from public directory to dist
 */
function copyPublicFiles(sourceDir: string, destDir: string): void {
  const files = fs.readdirSync(sourceDir);
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Recursively copy directories
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyPublicFiles(sourcePath, destPath);
    } else {
      // Copy files (skip styles.css as it's handled separately)
      if (file !== 'styles.css') {
        fs.copyFileSync(sourcePath, destPath);
        logger.debug(`Copied: ${file}`);
      }
    }
  }
}

/**
 * Build a Rynex project
 */
export async function build(options: BuildOptions): Promise<void> {
  const isDebug = process.argv.includes('--debug');
  if (isDebug) {
    logger.setDebug(true);
  }

  logger.info('Building Rynex project');
  logger.debug(`Build options: ${JSON.stringify(options)}`);

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  const distDir = path.join(projectRoot, path.dirname(options.output));
  
  logger.debug(`Project root: ${projectRoot}`);
  logger.debug(`Source directory: ${srcDir}`);
  logger.debug(`Output directory: ${distDir}`);

  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Collect all styles
  let allStyles = '';

  // Create esbuild plugin for Rynex transformation
  const rynexPlugin: esbuild.Plugin = {
    name: 'rynex-transform',
    setup(build) {
      build.onLoad({ filter: /\.(ts|js|tsx|jsx)$/ }, async (args) => {
        logger.debug(`Processing file: ${args.path}`);
        const source = await fs.promises.readFile(args.path, 'utf8');
        
        // Check if file contains view or style keywords
        if (source.includes('view {') || source.includes('style {')) {
          logger.debug(`Found view/style keywords in: ${args.path}`);
          const parsed = parseRynexFile(source);
          
          if (parsed.styles) {
            logger.debug(`Extracted ${parsed.styles.length} chars of styles from: ${args.path}`);
            allStyles += parsed.styles;
          }
          
          let transformedCode = parsed.code;
          transformedCode = transformImports(transformedCode);
          
          logger.debug(`Transformed file: ${args.path}`);

          return {
            contents: transformedCode,
            loader: args.path.endsWith('.ts') || args.path.endsWith('.tsx') ? 'ts' : 'js'
          };
        }

        // Transform imports even if no view/style
        logger.debug(`No view/style keywords in: ${args.path}`);
        const transformedCode = transformImports(source);
        return {
          contents: transformedCode,
          loader: args.path.endsWith('.ts') || args.path.endsWith('.tsx') ? 'ts' : 'js'
        };
      });
    }
  };

  try {
    logger.debug(`Starting esbuild with entry: ${options.entry}`);
    
    // Build with esbuild
    const result = await esbuild.build({
      entryPoints: [path.join(projectRoot, options.entry)],
      bundle: true,
      outfile: path.join(projectRoot, options.output),
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      minify: options.minify,
      sourcemap: options.sourceMaps,
      plugins: [rynexPlugin],
      external: [],
      write: true,
      logLevel: isDebug ? 'debug' : 'warning'
    });

    logger.debug(`esbuild completed successfully`);
    logger.debug(`Output files: ${result.outputFiles?.length || 'written to disk'}`);

    // Copy public files to dist
    const publicDir = path.join(projectRoot, 'public');
    if (fs.existsSync(publicDir)) {
      logger.debug(`Copying public files from ${publicDir} to ${distDir}`);
      copyPublicFiles(publicDir, distDir);
      logger.success('Public files copied to dist');
    }

    // Handle styles.css
    const publicStylesPath = path.join(publicDir, 'styles.css');
    const distStylesPath = path.join(distDir, 'styles.css');
    
    if (allStyles) {
      // If we extracted styles from components, write them
      logger.debug(`Writing ${allStyles.length} chars of extracted CSS to ${distStylesPath}`);
      await fs.promises.writeFile(distStylesPath, allStyles, 'utf8');
      logger.success('Component styles written to dist/styles.css');
    } else if (!fs.existsSync(distStylesPath)) {
      // If no extracted styles and no styles.css exists, create empty one
      logger.debug('No styles found, creating empty styles.css');
      const defaultStyles = `/* Rynex Styles */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n}\n`;
      await fs.promises.writeFile(distStylesPath, defaultStyles, 'utf8');
      logger.success('Created default styles.css');
    }

    logger.success(`Build complete: ${options.output}`);
    
    if (result.warnings.length > 0) {
      logger.warning(`Build warnings: ${result.warnings.length} warning(s)`);
      result.warnings.forEach(w => {
        logger.debug(`Warning: ${w.text}`);
        if (w.location) {
          logger.debug(`  at ${w.location.file}:${w.location.line}:${w.location.column}`);
        }
      });
    } else {
      logger.debug(`No build warnings`);
    }
    
    if (result.errors.length > 0) {
      logger.error(`Build errors: ${result.errors.length} error(s)`);
      result.errors.forEach(e => {
        logger.error(`Error: ${e.text}`);
        if (e.location) {
          logger.error(`  at ${e.location.file}:${e.location.line}:${e.location.column}`);
        }
      });
    }
  } catch (error) {
    logger.error('Build failed', error as Error);
    logger.debug(`Error details: ${JSON.stringify(error, null, 2)}`);
    throw error;
  }
}

/**
 * Watch mode for development
 */
export async function watch(options: BuildOptions): Promise<void> {
  logger.info('Watching for changes');
  
  // Use esbuild's watch mode
  const projectRoot = process.cwd();
  
  const rynexPlugin: esbuild.Plugin = {
    name: 'rynex-transform',
    setup(build) {
      build.onLoad({ filter: /\.(ts|js|tsx|jsx)$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        
        if (source.includes('view {') || source.includes('style {')) {
          const parsed = parseRynexFile(source);
          let transformedCode = parsed.code;
          transformedCode = transformImports(transformedCode);

          return {
            contents: transformedCode,
            loader: args.path.endsWith('.ts') || args.path.endsWith('.tsx') ? 'ts' : 'js'
          };
        }

        const transformedCode = transformImports(source);
        return {
          contents: transformedCode,
          loader: args.path.endsWith('.ts') || args.path.endsWith('.tsx') ? 'ts' : 'js'
        };
      });
    }
  };

  const ctx = await esbuild.context({
    entryPoints: [path.join(projectRoot, options.entry)],
    bundle: true,
    outfile: path.join(projectRoot, options.output),
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    minify: false,
    sourcemap: true,
    plugins: [rynexPlugin]
  });

  await ctx.watch();
  logger.success('Watch mode enabled');
}
