/**
 * Rynex Builder - Extended
 * Handles compilation and bundling with TypeScript support using Rolldown
 * Supports both simple and advanced project structures
 */

import { rolldown, Plugin as RolldownPlugin } from 'rolldown';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { parseRynexFile, transformImports } from './parser.js';
import { RouteConfig, RynexConfig } from './config.js';
import { logger } from './logger.js';
import { scanRoutes, generateRouteManifest, generateRouterConfig } from './route-scanner.js';

/**
 * Check if Tailwind CSS is configured
 * Note: Tailwind CSS support with Rolldown will need a custom plugin or PostCSS integration
 */
function hasTailwindConfig(projectRoot: string): boolean {
  const configFiles = ['tailwind.config.js', 'tailwind.config.cjs', 'tailwind.config.mjs', 'tailwind.config.ts'];
  return configFiles.some(file => fs.existsSync(path.join(projectRoot, file)));
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
      const build = await rolldown({
        input: componentPath,
        cwd: projectRoot,
        external: []
      });

      await build.write({
        file: outputPath,
        format: 'es',
        sourcemap: sourceMaps,
        minify
      });

      await build.close();
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
      const build = await rolldown({
        input: pageFile,
        cwd: projectRoot,
        external: []
      });

      await build.write({
        file: outputPath,
        format: 'es',
        sourcemap: sourceMaps,
        minify
      });

      await build.close();

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

  // Create Rolldown plugin for Rynex transformation
  const rynexPlugin: RolldownPlugin = {
    name: 'rynex-transform',
    async transform(code, id) {
      // Only process TypeScript and JavaScript files
      if (!/\.(ts|js|tsx|jsx)$/.test(id)) {
        return null;
      }

      logger.debug(`Processing file: ${id}`);
      
      // Check if file contains view or style keywords
      if (code.includes('view {') || code.includes('style {')) {
        logger.debug(`Found view/style keywords in: ${id}`);
        const parsed = parseRynexFile(code);
        
        if (parsed.styles) {
          logger.debug(`Extracted ${parsed.styles.length} chars of styles from: ${id}`);
          allStyles += parsed.styles;
        }
        
        let transformedCode = parsed.code;
        transformedCode = transformImports(transformedCode);
        
        logger.debug(`Transformed file: ${id}`);

        return {
          code: transformedCode,
          map: null
        };
      }

      // Transform imports even if no view/style
      logger.debug(`No view/style keywords in: ${id}`);
      const transformedCode = transformImports(code);
      return {
        code: transformedCode,
        map: null
      };
    }
  };

  logger.debug(`Building main entry: ${options.entry}`);
  
  // Setup plugins array
  const plugins: RolldownPlugin[] = [];
  
  // Check for Tailwind CSS
  if (hasTailwindConfig(projectRoot)) {
    logger.info('Tailwind CSS config detected (manual PostCSS integration recommended)');
  }
  
  // Add Rynex plugin
  plugins.push(rynexPlugin);
  
  // Build with Rolldown
  const build = await rolldown({
    input: path.join(projectRoot, options.entry),
    cwd: projectRoot,
    plugins: plugins,
    external: []
  });

  await build.write({
    file: path.join(projectRoot, options.output),
    format: 'es',
    sourcemap: options.sourceMaps,
    minify: options.minify
  });

  await build.close();

  logger.debug(`Rolldown build completed successfully`);

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
  
  const rynexPlugin: RolldownPlugin = {
    name: 'rynex-transform',
    async transform(code, id) {
      if (!/\.(ts|js|tsx|jsx)$/.test(id)) {
        return null;
      }

      if (code.includes('view {') || code.includes('style {')) {
        const parsed = parseRynexFile(code);
        let transformedCode = parsed.code;
        transformedCode = transformImports(transformedCode);

        return {
          code: transformedCode,
          map: null
        };
      }

      const transformedCode = transformImports(code);
      return {
        code: transformedCode,
        map: null
      };
    }
  };

  // Setup plugins for watch mode
  const watchPlugins: RolldownPlugin[] = [];
  
  // Check for Tailwind CSS
  if (hasTailwindConfig(projectRoot)) {
    logger.info('Tailwind CSS config detected (manual PostCSS integration recommended)');
  }
  
  // Add Rynex plugin
  watchPlugins.push(rynexPlugin);

  const build = await rolldown({
    input: path.join(projectRoot, options.entry),
    cwd: projectRoot,
    plugins: watchPlugins,
    external: [],
    watch: {
      skipWrite: false
    }
  });

  await build.write({
    file: path.join(projectRoot, options.output),
    format: 'es',
    sourcemap: true,
    minify: false
  });

  logger.success('Watch mode enabled (Note: Rolldown watch support may require manual rebuild)');
}
