/**
 * Rynex Add Command
 * Adds integrations like Tailwind CSS to existing Rynex projects
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { logger } from './logger.js';

/**
 * Detect package manager in use
 */
function detectPackageManager(projectRoot: string): 'npm' | 'pnpm' | 'yarn' | 'bun' {
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(projectRoot, 'bun.lockb'))) {
    return 'bun';
  }
  return 'npm';
}

/**
 * Prompt user to choose package manager
 */
async function promptPackageManager(): Promise<'npm' | 'pnpm' | 'yarn' | 'bun'> {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    logger.info('');
    logger.info('Choose your package manager:');
    logger.info('  1) npm');
    logger.info('  2) pnpm');
    logger.info('  3) yarn');
    logger.info('  4) bun');
    logger.info('');
    
    rl.question('Enter your choice (1-4): ', (answer) => {
      rl.close();
      
      switch (answer.trim()) {
        case '1':
          resolve('npm');
          break;
        case '2':
          resolve('pnpm');
          break;
        case '3':
          resolve('yarn');
          break;
        case '4':
          resolve('bun');
          break;
        default:
          logger.warning(`Invalid choice "${answer}", defaulting to npm`);
          resolve('npm');
      }
    });
  });
}

/**
 * Install packages using specified package manager
 */
function installPackages(packages: string[], pm: 'npm' | 'pnpm' | 'yarn' | 'bun', isDev: boolean = true): void {
  const devFlag = isDev ? (pm === 'npm' ? '--save-dev' : '-D') : '';
  
  logger.info(`Installing packages with ${pm}...`);
  logger.info('');
  
  try {
    const command = `${pm} ${pm === 'yarn' || pm === 'bun' ? 'add' : 'install'} ${devFlag} ${packages.join(' ')}`;
    logger.debug(`Running: ${command}`);
    
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    logger.success('Packages installed successfully');
  } catch (error) {
    logger.error('Failed to install packages', error as Error);
    throw error;
  }
}

/**
 * Generate Tailwind config file
 */
function generateTailwindConfig(projectRoot: string): void {
  const configPath = path.join(projectRoot, 'tailwind.config.js');
  
  if (fs.existsSync(configPath)) {
    logger.info('tailwind.config.js already exists');
    return;
  }
  
  const config = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts}",
    "./public/**/*.html",
    "./dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
  
  fs.writeFileSync(configPath, config, 'utf8');
  logger.success('Created tailwind.config.js');
}

/**
 * Add Tailwind directives to CSS file
 */
function addTailwindDirectives(cssPath: string): void {
  if (!fs.existsSync(cssPath)) {
    const dirPath = path.dirname(cssPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
  
  let content = '';
  if (fs.existsSync(cssPath)) {
    content = fs.readFileSync(cssPath, 'utf8');
  }
  
  // Check if Tailwind directives already exist
  if (content.includes('@import "tailwindcss"') || content.includes("@import 'tailwindcss'")) {
    logger.info('Tailwind directives already present in CSS file');
    return;
  }
  
  // Add Tailwind import at the top
  const tailwindImport = `@import "tailwindcss";\n\n`;
  content = tailwindImport + content;
  
  fs.writeFileSync(cssPath, content, 'utf8');
  logger.success('Added Tailwind CSS import to styles.css');
}

/**
 * Ensure CSS is imported in entry point (JS/TS)
 */
function ensureCSSImport(projectRoot: string): void {
  const entryPoints = [
    path.join(projectRoot, 'index.ts'),
    path.join(projectRoot, 'index.js'),
    path.join(projectRoot, 'src', 'index.ts'),
    path.join(projectRoot, 'src', 'index.js'),
  ];
  
  for (const entryPath of entryPoints) {
    if (fs.existsSync(entryPath)) {
      let content = fs.readFileSync(entryPath, 'utf8');
      
      // Check if CSS is already imported
      if (content.includes('styles.css') || content.includes('/public/styles.css') || content.includes('bundle.css')) {
        logger.info('CSS already imported in entry point');
        return;
      }
      
      // Add CSS import at the top (after any comments)
      const lines = content.split('\n');
      let insertIndex = 0;
      
      // Skip initial comments
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
          insertIndex = i;
          break;
        }
      }
      
      const cssImport = "./public/styles.css';";
      lines.splice(insertIndex, 0, `import '${cssImport}`, '');
      
      fs.writeFileSync(entryPath, lines.join('\n'), 'utf8');
      logger.success(`Added CSS import to ${path.basename(entryPath)}`);
      return;
    }
  }
  
  logger.warning('Could not find entry point to add CSS import');
  logger.info('Please manually add: import "./public/styles.css"; to your entry file');
}

/**
 * Add CSS link to HTML file
 */
function addCSSLinkToHTML(projectRoot: string): void {
  const htmlPaths = [
    path.join(projectRoot, 'public', 'index.html'),
    path.join(projectRoot, 'index.html'),
  ];
  
  for (const htmlPath of htmlPaths) {
    if (fs.existsSync(htmlPath)) {
      let content = fs.readFileSync(htmlPath, 'utf8');
      
      // Check if CSS link already exists
      if (content.includes('bundle.css') || content.includes('styles.css')) {
        logger.info('CSS link already present in HTML');
        return;
      }
      
      // Add CSS link in <head> section
      if (content.includes('</head>')) {
        const cssLink = '  <link rel="stylesheet" href="./bundle.css">\n';
        content = content.replace('</head>', `${cssLink}</head>`);
        
        fs.writeFileSync(htmlPath, content, 'utf8');
        logger.success(`Added CSS link to ${path.basename(htmlPath)}`);
        return;
      }
    }
  }
  
  logger.warning('Could not find HTML file to add CSS link');
  logger.info('Please manually add: <link rel="stylesheet" href="./bundle.css"> to your HTML <head>');
}

/**
 * Add Tailwind CSS to the project
 */
async function addTailwind(): Promise<void> {
  logger.info('Adding Tailwind CSS support to your Rynex project...');
  logger.info('');
  
  const projectRoot = process.cwd();
  
  // Check if already installed
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps['tailwindcss']) {
      logger.warning('Tailwind CSS is already installed');
      logger.info('Reconfiguring...');
      logger.info('');
    }
  }
  
  // Prompt user to choose package manager
  const packageManager = await promptPackageManager();
  logger.info('');
  
  // Install Tailwind CSS packages (latest versions as of October 2025)
  const packages = [
    'tailwindcss@latest',      // v4.x (released January 2025)
    'postcss@latest',          // v8.5.x
    'autoprefixer@latest'      // v10.4.x
  ];
  
  try {
    installPackages(packages, packageManager, true);
    
    // Generate config
    generateTailwindConfig(projectRoot);
    
    // Add Tailwind directives to CSS
    const cssPath = path.join(projectRoot, 'public', 'styles.css');
    addTailwindDirectives(cssPath);
    
    // Ensure CSS is imported in entry point
    ensureCSSImport(projectRoot);
    
    // Add CSS link to HTML file
    addCSSLinkToHTML(projectRoot);
    
    logger.success('');
    logger.success('✅ Tailwind CSS has been added to your project!');
    logger.info('');
    logger.info('📝 What was configured:');
    logger.info('  - Installed: tailwindcss, postcss, autoprefixer');
    logger.info('  - Created: tailwind.config.js');
    logger.info('  - Updated: public/styles.css');
    logger.info('  - Added CSS import to entry point');
    logger.info('  - Added CSS link to HTML file');
    logger.info('');
    logger.info('🚀 Next steps:');
    logger.info('  1. Start dev server: pnpm dev (or npm run dev)');
    logger.info('  2. Use Tailwind classes in your components!');
    logger.info('');
    logger.info('💡 Example usage:');
    logger.info('  UI.container({ class: "flex items-center justify-center" })');
    
  } catch (error) {
    logger.error('Failed to add Tailwind CSS', error as Error);
    process.exit(1);
  }
}

/**
 * Main add command handler
 */
export async function handleAddCommand(integration: string): Promise<void> {
  const validIntegrations = ['tailwind', 'tailwindcss'];
  
  if (!integration) {
    logger.error('Please specify what to add');
    logger.info('');
    logger.info('Available integrations:');
    logger.info('  rynex add tailwind    - Add Tailwind CSS support');
    logger.info('');
    process.exit(1);
  }
  
  const normalizedIntegration = integration.toLowerCase();
  
  if (!validIntegrations.includes(normalizedIntegration)) {
    logger.error(`Unknown integration: ${integration}`);
    logger.info('');
    logger.info('Available integrations:');
    logger.info('  tailwind    - Add Tailwind CSS support');
    logger.info('');
    process.exit(1);
  }
  
  // Handle the integration
  if (normalizedIntegration === 'tailwind' || normalizedIntegration === 'tailwindcss') {
    await addTailwind();
  }
}
