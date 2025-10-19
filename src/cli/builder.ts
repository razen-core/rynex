/**
 * ZenWeb Builder
 * Handles compilation and bundling
 */

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { parseZenWebFile, transformImports } from './parser.js';

export interface BuildOptions {
  entry: string;
  output: string;
  minify: boolean;
  sourceMaps: boolean;
  watch?: boolean;
}

import { logger } from './logger.js';

/**
 * Build a ZenWeb project
 */
export async function build(options: BuildOptions): Promise<void> {
  const isDebug = process.argv.includes('--debug');
  if (isDebug) {
    logger.setDebug(true);
  }

  logger.info('Building ZenWeb project');
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

  // Create esbuild plugin for ZenWeb transformation
  const zenwebPlugin: esbuild.Plugin = {
    name: 'zenweb-transform',
    setup(build) {
      build.onLoad({ filter: /\.(ts|js|tsx|jsx)$/ }, async (args) => {
        logger.debug(`Processing file: ${args.path}`);
        const source = await fs.promises.readFile(args.path, 'utf8');
        
        // Check if file contains view or style keywords
        if (source.includes('view {') || source.includes('style {')) {
          logger.debug(`Found view/style keywords in: ${args.path}`);
          const parsed = parseZenWebFile(source);
          
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
      plugins: [zenwebPlugin],
      external: [],
      write: true,
      logLevel: isDebug ? 'debug' : 'warning'
    });

    logger.debug(`esbuild completed successfully`);
    logger.debug(`Output files: ${result.outputFiles?.length || 'written to disk'}`);

    // Write styles to CSS file
    if (allStyles) {
      const cssPath = path.join(distDir, 'styles.css');
      logger.debug(`Writing ${allStyles.length} chars of CSS to ${cssPath}`);
      await fs.promises.writeFile(cssPath, allStyles, 'utf8');
      logger.success(`Styles written to ${cssPath}`);
    } else {
      logger.debug(`No styles to write`);
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
  
  const zenwebPlugin: esbuild.Plugin = {
    name: 'zenweb-transform',
    setup(build) {
      build.onLoad({ filter: /\.(ts|js|tsx|jsx)$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        
        if (source.includes('view {') || source.includes('style {')) {
          const parsed = parseZenWebFile(source);
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
    plugins: [zenwebPlugin]
  });

  await ctx.watch();
  logger.success('Watch mode enabled');
}
