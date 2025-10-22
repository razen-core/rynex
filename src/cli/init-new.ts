/**
 * Rynex Project Initializer - Enhanced Version
 * Interactive project scaffolding with multiple templates
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';
import { banner, select, confirm, input, nextSteps, info, warn, success } from './prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProjectConfig {
  name: string;
  template: 'empty' | 'minimal' | 'routed';
  useTypeScript: boolean;
}

/**
 * Copy directory recursively
 */
function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Replace placeholders in file
 */
function replacePlaceholders(filePath: string, projectName: string): void {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/PROJECT_NAME/g, projectName);
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Initialize a new Rynex project with interactive prompts
 */
export async function initProject(projectName?: string): Promise<void> {
  // Show banner
  banner();

  // Get project name
  const name = projectName || await input(
    'What is your project name?',
    'my-rynex-app'
  );

  // Check if directory exists
  const projectPath = path.join(process.cwd(), name);
  if (fs.existsSync(projectPath)) {
    logger.error(`Directory "${name}" already exists`);
    process.exit(1);
  }

  // Select template
  const template = await select(
    'Which template would you like to use?',
    [
      {
        value: 'empty',
        label: 'Empty',
        description: 'Minimal setup with just the basics'
      },
      {
        value: 'minimal',
        label: 'Minimal',
        description: 'Single page app with modern UI'
      },
      {
        value: 'routed',
        label: 'Routed',
        description: 'Multi-page app with routing and navigation'
      }
    ],
    'minimal'
  ) as 'empty' | 'minimal' | 'routed';

  // Select language
  const useTypeScript = await select(
    'Would you like to use TypeScript or JavaScript?',
    [
      {
        value: 'typescript',
        label: 'TypeScript',
        description: 'Recommended for better type safety'
      },
      {
        value: 'javascript',
        label: 'JavaScript',
        description: 'Classic JavaScript (Coming soon)'
      }
    ],
    'typescript'
  );

  // Check if JavaScript selected
  if (useTypeScript === 'javascript') {
    console.log();
    warn('JavaScript templates are not available yet.');
    info('We are working on bringing JavaScript support soon!');
    info('TypeScript provides better type safety and IDE support.');
    console.log();
    
    const switchToTS = await confirm('Would you like to use TypeScript instead?', true);
    
    if (!switchToTS) {
      logger.error('Project creation cancelled');
      process.exit(0);
    }
  }

  const config: ProjectConfig = {
    name,
    template,
    useTypeScript: true // Always TypeScript for now
  };

  // Create project
  console.log();
  info(`Creating ${config.template} project: ${config.name}`);
  console.log();

  try {
    // Get template path - resolve from package root
    // When running from dist/cli/init-new.js, __dirname is dist/cli
    // We need to go up to package root and then into templates
    const templatePath = path.join(
      path.dirname(path.dirname(__dirname)), // Go up to package root
      'templates',
      config.template,
      'typescript'
    );

    if (!fs.existsSync(templatePath)) {
      logger.error(`Template not found: ${config.template}`);
      process.exit(1);
    }

    // Copy template
    copyDir(templatePath, projectPath);

    // Replace placeholders in package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    replacePlaceholders(packageJsonPath, config.name);

    // Create README
    const readmeContent = `# ${config.name}

A Rynex application built with the **${config.template}** template.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
${config.name}/
├── src/
│   ├── index.ts           # Entry point
│   ├── App.ts             # Root component${config.template === 'routed' ? `
│   ├── components/        # Reusable components
│   └── pages/            # Route pages` : ''}
├── public/
│   ├── index.html        # HTML shell
│   └── styles.css        # Global styles
└── rynex.config.js      # Configuration
\`\`\`

## Learn More

- [Rynex Documentation](https://github.com/razen-core/rynex)
- [API Reference](https://github.com/razen-core/rynex#api)
- [Examples](https://github.com/razen-core/rynex/tree/main/examples)

## Features

${config.template === 'empty' ? '- Minimal setup\n- Quick start\n- Clean slate for your ideas' : ''}${config.template === 'minimal' ? '- Modern dark theme\n- Reactive state management\n- Beautiful UI components\n- Hot reload support' : ''}${config.template === 'routed' ? '- File-based routing\n- Multiple pages\n- Navigation components\n- Lazy loading support\n- Modern dark theme' : ''}

Built with Rynex v0.1.3
`;

    fs.writeFileSync(path.join(projectPath, 'README.md'), readmeContent, 'utf8');

    // Success!
    console.log();
    success('Project created successfully!');
    
    // Show next steps
    nextSteps(config.name, config.useTypeScript);

  } catch (error) {
    logger.error('Failed to create project');
    console.error(error);
    process.exit(1);
  }
}
