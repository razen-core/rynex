/**
 * CSS Processor for Rynex
 * Handles PostCSS processing for Tailwind CSS v4 and other CSS transformations
 * Integrated directly into build and dev commands like Next.js/Vite
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger.js';
import { spawn, ChildProcess } from 'child_process';

export interface CSSProcessorOptions {
  entry: string;
  output: string;
  minify?: boolean;
  sourcemap?: boolean;
  watch?: boolean;
  projectRoot: string;
}

export interface CSSProcessorResult {
  css: string;
  map?: string;
  success: boolean;
  error?: string;
}

/**
 * Check if PostCSS and Tailwind CSS are installed
 */
export function checkCSSSetup(projectRoot: string): {
  hasPostCSS: boolean;
  hasTailwind: boolean;
  hasPostCSSCLI: boolean;
  hasTailwindPostCSS: boolean;
} {
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return {
        hasPostCSS: false,
        hasTailwind: false,
        hasPostCSSCLI: false,
        hasTailwindPostCSS: false
      };
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };
    
    return {
      hasPostCSS: 'postcss' in deps,
      hasTailwind: 'tailwindcss' in deps,
      hasPostCSSCLI: 'postcss-cli' in deps,
      hasTailwindPostCSS: '@tailwindcss/postcss' in deps
    };
  } catch {
    return {
      hasPostCSS: false,
      hasTailwind: false,
      hasPostCSSCLI: false,
      hasTailwindPostCSS: false
    };
  }
}

/**
 * Check if PostCSS config exists
 */
export function hasPostCSSConfig(projectRoot: string): boolean {
  const configFiles = [
    'postcss.config.mjs',
    'postcss.config.js',
    'postcss.config.cjs'
  ];
  
  return configFiles.some(file => fs.existsSync(path.join(projectRoot, file)));
}

/**
 * Process CSS using PostCSS
 */
export async function processCSS(options: CSSProcessorOptions): Promise<CSSProcessorResult> {
  const { entry, output, minify, sourcemap, projectRoot } = options;
  
  const entryPath = path.join(projectRoot, entry);
  const outputPath = path.join(projectRoot, output);
  
  // Check if entry file exists
  if (!fs.existsSync(entryPath)) {
    return {
      css: '',
      success: false,
      error: `CSS entry file not found: ${entry}`
    };
  }
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Try to use PostCSS programmatically first
    const postcss = await tryImportPostCSS(projectRoot);
    
    if (postcss) {
      return await processWithPostCSS(postcss, entryPath, outputPath, minify, sourcemap, projectRoot);
    } else {
      // Fallback to CLI
      return await processWithCLI(entryPath, outputPath, minify, sourcemap, projectRoot);
    }
  } catch (error) {
    return {
      css: '',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Try to import PostCSS from project dependencies
 */
async function tryImportPostCSS(projectRoot: string): Promise<any> {
  try {
    const postcssPath = path.join(projectRoot, 'node_modules', 'postcss', 'lib', 'postcss.mjs');
    if (fs.existsSync(postcssPath)) {
      const module = await import(postcssPath);
      return module.default || module;
    }
  } catch {}
  
  return null;
}

/**
 * Process CSS using PostCSS API
 */
async function processWithPostCSS(
  postcss: any,
  entryPath: string,
  outputPath: string,
  minify?: boolean,
  sourcemap?: boolean,
  projectRoot?: string
): Promise<CSSProcessorResult> {
  try {
    // Load PostCSS config
    const config = await loadPostCSSConfig(projectRoot || process.cwd());
    
    // Read CSS file
    const css = fs.readFileSync(entryPath, 'utf8');
    
    // Process CSS
    const result = await postcss(config.plugins).process(css, {
      from: entryPath,
      to: outputPath,
      map: sourcemap ? { inline: false } : false
    });
    
    // Write output
    fs.writeFileSync(outputPath, result.css, 'utf8');
    
    if (result.map && sourcemap) {
      fs.writeFileSync(`${outputPath}.map`, result.map.toString(), 'utf8');
    }
    
    return {
      css: result.css,
      map: result.map?.toString(),
      success: true
    };
  } catch (error) {
    return {
      css: '',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Process CSS using PostCSS CLI
 */
async function processWithCLI(
  entryPath: string,
  outputPath: string,
  minify?: boolean,
  sourcemap?: boolean,
  projectRoot?: string
): Promise<CSSProcessorResult> {
  return new Promise((resolve) => {
    const args = [
      entryPath,
      '-o',
      outputPath
    ];
    
    if (sourcemap) {
      args.push('--map');
    }
    
    if (minify) {
      args.push('--env', 'production');
    }
    
    const postcssPath = path.join(projectRoot || process.cwd(), 'node_modules', '.bin', 'postcss');
    
    const child = spawn(postcssPath, args, {
      cwd: projectRoot,
      stdio: 'pipe'
    });
    
    let stderr = '';
    
    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        try {
          const css = fs.readFileSync(outputPath, 'utf8');
          resolve({
            css,
            success: true
          });
        } catch (error) {
          resolve({
            css: '',
            success: false,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      } else {
        resolve({
          css: '',
          success: false,
          error: stderr || `PostCSS CLI exited with code ${code}`
        });
      }
    });
    
    child.on('error', (error) => {
      resolve({
        css: '',
        success: false,
        error: error.message
      });
    });
  });
}

/**
 * Watch CSS files for changes
 */
export function watchCSS(options: CSSProcessorOptions, onChange?: () => void): ChildProcess | null {
  const { entry, output, minify, sourcemap, projectRoot } = options;
  
  const entryPath = path.join(projectRoot, entry);
  const outputPath = path.join(projectRoot, output);
  
  const args = [
    entryPath,
    '-o',
    outputPath,
    '--watch'
  ];
  
  if (sourcemap) {
    args.push('--map');
  }
  
  if (minify) {
    args.push('--env', 'production');
  }
  
  const postcssPath = path.join(projectRoot, 'node_modules', '.bin', 'postcss');
  
  if (!fs.existsSync(postcssPath)) {
    logger.error('PostCSS CLI not found. Install with: pnpm add -D postcss-cli');
    return null;
  }
  
  const child = spawn(postcssPath, args, {
    cwd: projectRoot,
    stdio: 'pipe'
  });
  
  child.stdout?.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Compiled') || output.includes('compiled')) {
      logger.success('CSS compiled');
      onChange?.();
    }
  });
  
  child.stderr?.on('data', (data) => {
    const error = data.toString();
    if (!error.includes('Watching')) {
      logger.error(`CSS compilation error: ${error}`);
    }
  });
  
  child.on('error', (error) => {
    logger.error(`CSS watch error: ${error.message}`);
  });
  
  return child;
}

/**
 * Load PostCSS config
 */
async function loadPostCSSConfig(projectRoot: string): Promise<any> {
  const configFiles = [
    'postcss.config.mjs',
    'postcss.config.js',
    'postcss.config.cjs'
  ];
  
  for (const file of configFiles) {
    const configPath = path.join(projectRoot, file);
    if (fs.existsSync(configPath)) {
      try {
        const config = await import(configPath);
        return config.default || config;
      } catch (error) {
        logger.debug(`Failed to load ${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  
  // Return default config
  return {
    plugins: {}
  };
}

/**
 * Generate PostCSS config for Tailwind CSS v4
 */
export function generatePostCSSConfig(projectRoot: string): void {
  const configPath = path.join(projectRoot, 'postcss.config.mjs');
  
  if (fs.existsSync(configPath)) {
    logger.info('PostCSS config already exists');
    return;
  }
  
  const config = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
`;
  
  fs.writeFileSync(configPath, config, 'utf8');
  logger.success('Created postcss.config.mjs');
}

/**
 * Generate Tailwind CSS entry file (v4 style)
 */
export function generateTailwindEntry(projectRoot: string, entryPath: string): void {
  const fullPath = path.join(projectRoot, entryPath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (fs.existsSync(fullPath)) {
    logger.info('CSS entry file already exists');
    return;
  }
  
  const css = `@import "tailwindcss";

/* Optional: CSS-first configuration (Tailwind v4) */
@theme {
  /* Custom colors */
  --color-primary: oklch(0.5 0.2 250);
  --color-secondary: oklch(0.7 0.15 180);
  
  /* Custom fonts */
  --font-display: "Inter", system-ui, sans-serif;
  
  /* Custom breakpoints */
  --breakpoint-3xl: 1920px;
}

/* Custom component styles */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold transition-colors;
  }
  
  .btn-primary {
    @apply btn bg-blue-500 text-white hover:bg-blue-600;
  }
  
  .btn-secondary {
    @apply btn bg-gray-200 text-gray-800 hover:bg-gray-300;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
`;
  
  fs.writeFileSync(fullPath, css, 'utf8');
  logger.success(`Created ${entryPath}`);
}

/**
 * Print CSS setup instructions
 */
export function printCSSSetupInstructions(): void {
  logger.info('\nTo use Tailwind CSS with Rynex, install dependencies:\n');
  logger.info('  pnpm add -D tailwindcss @tailwindcss/postcss postcss postcss-cli autoprefixer');
  logger.info('  # or');
  logger.info('  npm install --save-dev tailwindcss @tailwindcss/postcss postcss postcss-cli autoprefixer\n');
  logger.info('Then run: rynex init:css\n');
}
