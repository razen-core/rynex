/**
 * Rynex Builder - Extended
 * Handles compilation and bundling with TypeScript support
 * Supports both simple and advanced project structures
 */

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { parseRynexFile, transformImports } from './parser.js';
import { RouteConfig, RynexConfig } from './config.js';
import { logger } from './logger.js';
import { scanRoutes, generateRouteManifest, generateRouterConfig } from './route-scanner.js';

/**
 * Load Tailwind CSS plugin if configured
 */
async function loadTailwindPlugin(projectRoot: string): Promise<esbuild.Plugin | null> {
  // Check if Tailwind is configured
  const configFiles = ['tailwind.config.js', 'tailwind.config.cjs', 'tailwind.config.mjs', 'tailwind.config.ts'];
  const hasTailwindConfig = configFiles.some(file => fs.existsSync(path.join(projectRoot, file)));
  
  if (!hasTailwindConfig) {
    return null;
  }
  
  try {
    // Dynamic import of esbuild-plugin-tailwindcss
    const tailwindPluginModule = await import('esbuild-plugin-tailwindcss');
    const tailwindPlugin = tailwindPluginModule.default || tailwindPluginModule;
    
    logger.info('Tailwind CSS enabled');
    return tailwindPlugin();
  } catch (error) {
    logger.warning('Tailwind config found but esbuild-plugin-tailwindcss not available');
    return null;
  }
}

export interface BuildOptions {
  entry: string;
  output: string;
  minify: boolean;
  sourceMaps: boolean;
  watch?: boolean;
  routes?: RouteConfig[];
  config?: RynexConfig;
}

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
 * Build components in src/components directory
 */
async function buildComponents(
  projectRoot: string,
  distDir: string,
  minify: boolean,
  sourceMaps: boolean
): Promise<void> {
  const componentsDir = path.join(projectRoot, 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    logger.debug('No components directory found');
    return;
  }

  const componentFiles = fs.readdirSync(componentsDir).filter(f => 
    (f.endsWith('.ts') || f.endsWith('.tsx')) && !f.endsWith('.d.ts')
  );
  
  if (componentFiles.length === 0) {
    logger.debug('No component files to build');
    return;
  }

  logger.info(`Building ${componentFiles.length} components`);

  const distComponentsDir = path.join(distDir, 'components');
  if (!fs.existsSync(distComponentsDir)) {
    fs.mkdirSync(distComponentsDir, { recursive: true });
  }

  for (const file of componentFiles) {
    const componentPath = path.join(componentsDir, file);
    const componentName = path.basename(file, path.extname(file));
    const outputPath = path.join(distComponentsDir, `${componentName}.bundel.js`);

    logger.debug(`Building component: ${componentName}`);

    try {
      await esbuild.build({
        entryPoints: [componentPath],
        bundle: true,
        outfile: outputPath,
        format: 'esm',
        platform: 'browser',
        target: 'es2020',
        minify,
        sourcemap: sourceMaps,
        external: [],
        write: true,
        absWorkingDir: projectRoot
      });

      logger.success(`Built component: ${componentName}.bundel.js`);
    } catch (error) {
      logger.error(`Failed to build component ${componentName}`, error as Error);
    }
  }
}

/**
 * Generate a cache-busting hash based on timestamp
 */
function generateBuildHash(): string {
  const timestamp = Date.now().toString();
  return crypto.createHash('md5').update(timestamp).digest('hex').substring(0, 8);
}

/**
 * Generate HTML file for a page with cache-busting
 */
function generatePageHTML(pageName: string, distPageDir: string, buildHash: string): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta name="build-version" content="${buildHash}">
  <title>${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Rynex</title>
  <link rel="stylesheet" href="styles.css?v=${buildHash}">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="bundel.js?v=${buildHash}"></script>
</body>
</html>
`;

  const htmlPath = path.join(distPageDir, 'page.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  logger.debug(`Generated HTML for page: ${pageName} with build hash: ${buildHash}`);
}

/**
 * Generate CSS file for a page
 */
function generatePageCSS(distPageDir: string): void {
  const css = `/* Page Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
`;

  const cssPath = path.join(distPageDir, 'styles.css');
  fs.writeFileSync(cssPath, css, 'utf8');
  logger.debug(`Generated CSS for page`);
}

/**
 * Build pages in src/pages directory
 */
async function buildPages(
  projectRoot: string,
  distDir: string,
  minify: boolean,
  sourceMaps: boolean,
  buildHash: string
): Promise<void> {
  const pagesDir = path.join(projectRoot, 'src', 'pages');
  if (!fs.existsSync(pagesDir)) {
    logger.debug('No pages directory found');
    return;
  }

  const pageDirectories = fs.readdirSync(pagesDir).filter(f => {
    const fullPath = path.join(pagesDir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  if (pageDirectories.length === 0) {
    logger.debug('No page directories to build');
    return;
  }

  logger.info(`Building ${pageDirectories.length} pages`);

  for (const pageDir of pageDirectories) {
    const pagePath = path.join(pagesDir, pageDir);
    const pageFile = path.join(pagePath, 'page.ts');
    
    if (!fs.existsSync(pageFile)) {
      logger.warning(`No page.ts found in ${pageDir}`);
      continue;
    }

    const distPageDir = path.join(distDir, 'pages', pageDir);
    if (!fs.existsSync(distPageDir)) {
      fs.mkdirSync(distPageDir, { recursive: true });
    }

    // Build page TypeScript to bundel.js
    const outputPath = path.join(distPageDir, 'bundel.js');
    logger.debug(`Building page: ${pageDir}`);

    try {
      await esbuild.build({
        entryPoints: [pageFile],
        bundle: true,
        outfile: outputPath,
        format: 'esm',
        platform: 'browser',
        target: 'es2020',
        minify,
        sourcemap: sourceMaps,
        external: [],
        write: true,
        absWorkingDir: projectRoot
      });

      // Generate page.html with cache-busting
      generatePageHTML(pageDir, distPageDir, buildHash);

      // Generate styles.css
      generatePageCSS(distPageDir);

      logger.success(`Built page: ${pageDir}`);
    } catch (error) {
      logger.error(`Failed to build page ${pageDir}`, error as Error);
    }
  }
}

/**
 * Build main entry point (for simple projects)
 */
async function buildMainEntry(
  projectRoot: string,
  options: BuildOptions,
  allStyles: string,
  buildHash: string
): Promise<void> {
  const isDebug = process.argv.includes('--debug');
  const distDir = path.join(projectRoot, path.dirname(options.output));

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

  logger.debug(`Building main entry: ${options.entry}`);
  
  // Setup plugins array
  const plugins: esbuild.Plugin[] = [];
  
  // Add Tailwind CSS plugin if configured
  const tailwindPlugin = await loadTailwindPlugin(projectRoot);
  if (tailwindPlugin) {
    plugins.push(tailwindPlugin);
  }
  
  // Add Rynex plugin
  plugins.push(rynexPlugin);
  
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
    plugins: plugins,
    external: [],
    write: true,
    logLevel: isDebug ? 'debug' : 'warning',
    absWorkingDir: projectRoot
  });

  logger.debug(`esbuild completed successfully`);
  logger.debug(`Output files: ${result.outputFiles?.length || 'written to disk'}`);

  // Handle styles.css
  const publicStylesPath = path.join(projectRoot, 'public', 'styles.css');
  const distStylesPath = path.join(distDir, 'styles.css');
  
  if (allStyles) {
    // If we extracted styles from components, write them
    logger.debug(`Writing ${allStyles.length} chars of extracted CSS to ${distStylesPath}`);
    await fs.promises.writeFile(distStylesPath, allStyles, 'utf8');
    logger.success('Component styles written to dist/styles.css');
  } else if (!fs.existsSync(distStylesPath)) {
    // If no extracted styles and no styles.css exists, create empty one
    logger.debug('No styles found, creating default styles.css');
    const defaultStyles = `/* Rynex Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
`;
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
}

/**
 * Build a Rynex project
 * Supports both simple and advanced project structures
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

  // Generate build hash for cache-busting
  const buildHash = generateBuildHash();
  logger.info(`Build hash: ${buildHash}`);

  // Collect all styles
  let allStyles = '';

  try {
    // Scan and generate routes if file-based routing is enabled
    if (options.config?.routing?.fileBasedRouting) {
      const pagesDir = path.join(projectRoot, options.config.routing.pagesDir || 'src/pages');
      if (fs.existsSync(pagesDir)) {
        logger.info('Scanning file-based routes...');
        const routeManifest = scanRoutes(pagesDir);
        
        // Generate route manifest
        const manifestPath = path.join(distDir, 'route-manifest.js');
        generateRouteManifest(routeManifest, manifestPath);
        
        // Generate router config
        const routerConfigPath = path.join(distDir, 'router-config.js');
        generateRouterConfig(routeManifest, routerConfigPath);
        
        logger.success(`Generated routes: ${routeManifest.routes.length} routes found`);
      }
    }
    
    // Check if this is an advanced project structure (has components or pages)
    const hasComponents = fs.existsSync(path.join(srcDir, 'components'));
    const hasPages = fs.existsSync(path.join(srcDir, 'pages'));
    
    if (hasComponents || hasPages) {
      logger.info('Detected advanced project structure');
      
      // Build components
      if (hasComponents) {
        await buildComponents(projectRoot, distDir, options.minify, options.sourceMaps);
      }
      
      // Build pages
      if (hasPages) {
        await buildPages(projectRoot, distDir, options.minify, options.sourceMaps, buildHash);
      }
    }
    
    // Always build main entry point
    await buildMainEntry(projectRoot, options, allStyles, buildHash);
    
    // Update index.html with cache-busting if it exists
    const indexHtmlPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      
      // Add cache-busting meta tags if not present
      if (!indexHtml.includes('Cache-Control')) {
        indexHtml = indexHtml.replace(
          '<head>',
          `<head>\n  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n  <meta http-equiv="Pragma" content="no-cache">\n  <meta http-equiv="Expires" content="0">\n  <meta name="build-version" content="${buildHash}">`
        );
      }
      
      // Add version query params to JS and CSS files
      indexHtml = indexHtml.replace(
        /(src|href)="([^"]+\.(js|css|mjs))"/g,
        (match, attr, file) => {
          if (file.includes('?v=')) return match;
          return `${attr}="${file}?v=${buildHash}"`;
        }
      );
      
      fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
      logger.success(`Updated index.html with cache-busting (v=${buildHash})`);
    }

    // Copy public files to dist
    const publicDir = path.join(projectRoot, 'public');
    if (fs.existsSync(publicDir)) {
      logger.debug(`Copying public files from ${publicDir} to ${distDir}`);
      copyPublicFiles(publicDir, distDir);
      logger.success('Public files copied to dist');
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

  // Setup plugins for watch mode
  const watchPlugins: esbuild.Plugin[] = [];
  
  // Add Tailwind CSS plugin if configured
  const tailwindPlugin = await loadTailwindPlugin(projectRoot);
  if (tailwindPlugin) {
    watchPlugins.push(tailwindPlugin);
  }
  
  // Add Rynex plugin
  watchPlugins.push(rynexPlugin);

  const ctx = await esbuild.context({
    entryPoints: [path.join(projectRoot, options.entry)],
    bundle: true,
    outfile: path.join(projectRoot, options.output),
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    minify: false,
    sourcemap: true,
    plugins: watchPlugins
  });

  await ctx.watch();
  logger.success('Watch mode enabled');
}
