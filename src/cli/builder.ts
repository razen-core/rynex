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
  logger.info('Building ZenWeb project');

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  const distDir = path.join(projectRoot, path.dirname(options.output));

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
        const source = await fs.promises.readFile(args.path, 'utf8');
        
        // Check if file contains view or style keywords
        if (source.includes('view {') || source.includes('style {')) {
          const parsed = parseZenWebFile(source);
          allStyles += parsed.styles;
          
          let transformedCode = parsed.code;
          transformedCode = transformImports(transformedCode);

          return {
            contents: transformedCode,
            loader: args.path.endsWith('.ts') || args.path.endsWith('.tsx') ? 'ts' : 'js'
          };
        }

        // Transform imports even if no view/style
        const transformedCode = transformImports(source);
        return {
          contents: transformedCode,
          loader: args.path.endsWith('.ts') || args.path.endsWith('.tsx') ? 'ts' : 'js'
        };
      });
    }
  };

  try {
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
      write: true
    });

    // Write styles to CSS file
    if (allStyles) {
      const cssPath = path.join(distDir, 'styles.css');
      await fs.promises.writeFile(cssPath, allStyles, 'utf8');
      logger.success(`Styles written to ${cssPath}`);
    }

    logger.success(`Build complete: ${options.output}`);
    
    if (result.warnings.length > 0) {
      logger.warning(`Build warnings: ${result.warnings.length} warning(s)`);
      result.warnings.forEach(w => logger.debug(w.text));
    }
  } catch (error) {
    logger.error('Build failed', error as Error);
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
