/**
 * Rynex Project Initializer
 * Scaffolds new Rynex projects
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger.js';

const templates = {
  'package.json': (projectName: string) => `{
  "name": "${projectName}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "rynex dev",
    "build": "rynex build"
  },
  "dependencies": {
    "rynex": "^0.1.0"
  }
}`,

  'rynex.config.js': () => `export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  minify: true,
  sourceMaps: true,
  port: 3000,
  hotReload: true
};`,

  'src/index.ts': () => `import { render } from 'rynex';
import App from './App.js';

render(App, document.getElementById('root')!);`,

  'public/styles.css': () => `/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Component-specific styles added via css() function */`,

  'src/App.ts': () => `/**
 * Rynex Starter Template
 * A premium dark-themed starter with modern UI and smooth interactions
 */

import { state } from 'rynex';
import * as UI from 'rynex';

export default function App() {
  const appState = state({
    hoveredButton: null as string | null
  });

  return UI.vbox({
    class: 'app',
    style: {
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }
  }, [
    // Main Content Container
    UI.vbox({
      class: 'container',
      style: {
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '2.5rem'
      }
    }, [
      // Hero Section
      UI.vbox({
        class: 'hero',
        style: {
          textAlign: 'center',
          gap: '1.5rem',
          maxWidth: '800px'
        }
      }, [
        // Logo/Badge
        UI.container({
          style: {
            display: 'inline-block',
            padding: '0.5rem 1.25rem',
            background: '#0a0a0a',
            border: '1px solid #333333',
            borderRadius: '9999px',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 255, 136, 0.1)'
          }
        }, [
          UI.text({
            style: {
              fontSize: '0.875rem',
              color: '#00ff88',
              fontWeight: '600',
              letterSpacing: '0.05em'
            }
          }, 'Rynex')
        ]),

        // Main Title
        UI.h1({
          style: {
            fontSize: '4rem',
            fontWeight: '800',
            lineHeight: '1.1',
            margin: '0',
            fontFamily: '"Montserrat", sans-serif',
            background: 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)',
            webkitBackgroundClip: 'text',
            webkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }
        }, 'Welcome to Rynex'),

        // Subtitle
        UI.text({
          style: {
            fontSize: '1.25rem',
            color: '#b0b0b0',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }
        }, 'A modern, reactive web framework with elegant syntax and powerful features. Build beautiful applications with minimal code and maximum performance.'),

        // Button Group
        UI.hbox({
          class: 'button-group',
          style: {
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '1rem',
            flexWrap: 'wrap'
          }
        }, [
          // Documentation Button
          UI.hbox({
            onClick: () => {
              window.open('https://github.com/razen-core/rynex#readme', '_blank');
            },
            style: {
              padding: '0.875rem 2rem',
              background: '#00ff88',
              color: '#000000',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 4px 6px -1px rgba(0, 255, 136, 0.1)',
              gap: '0.5rem',
              alignItems: 'center',
              display: 'inline-flex'
            },
            onHover: {
              transform: 'translateY(-2px)',
              background: '#00cc6a'
            }
          }, [
            UI.svg({
              viewBox: '0 0 24 24',
              width: '20',
              height: '20',
              fill: 'currentColor',
              style: { display: 'block' }
            }, '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 10h10v2H7zm0 4h7v2H7z"/>'),
            UI.text({}, 'Documentation')
          ]),

          // GitHub Button
          UI.hbox({
            onClick: () => {
              window.open('https://github.com/razen-core/rynex', '_blank');
            },
            style: {
              padding: '0.875rem 2rem',
              background: '#0a0a0a',
              color: '#ffffff',
              border: '1px solid #333333',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 1px 2px rgba(0, 255, 136, 0.1)',
              gap: '0.5rem',
              alignItems: 'center',
              display: 'inline-flex'
            },
            onHover: {
              transform: 'translateY(-2px)',
              borderColor: '#00ff88'
            }
          }, [
            UI.svg({
              viewBox: '0 0 24 24',
              width: '20',
              height: '20',
              fill: 'currentColor',
              style: { display: 'block' }
            }, '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>'),
            UI.text({}, 'GitHub')
          ])
        ])
      ]),

      // Features Grid
      UI.vbox({
        class: 'features',
        style: {
          gap: '1.5rem',
          maxWidth: '900px',
          width: '100%'
        }
      }, [
        UI.text({
          style: {
            fontSize: '1.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '1rem',
            fontFamily: '"Montserrat", sans-serif'
          }
        }, 'Quick Start Guide'),

        UI.hbox({
          style: {
            gap: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }
        }, [
          // Feature Card 1
          UI.vbox({
            style: {
              flex: '1',
              minWidth: '250px',
              padding: '1.5rem',
              background: '#0a0a0a',
              border: '1px solid #333333',
              borderRadius: '0.5rem',
              gap: '0.75rem',
              boxShadow: '0 1px 2px rgba(0, 255, 136, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }
          }, [
            UI.svg({
              viewBox: '0 0 24 24',
              width: '48',
              height: '48',
              fill: '#00ff88',
              style: { display: 'block' }
            }, '<path d="M7 2v11h3v9l7-12h-4l4-8z"/>') as any,
            UI.text({
              style: {
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#00ff88'
              }
            }, 'Reactive by Default'),
            UI.text({
              style: {
                fontSize: '0.875rem',
                color: '#b0b0b0',
                lineHeight: '1.5'
              }
            }, 'Built-in reactivity with automatic UI updates. No manual subscriptions needed.')
          ]),

          // Feature Card 2
          UI.vbox({
            style: {
              flex: '1',
              minWidth: '250px',
              padding: '1.5rem',
              background: '#0a0a0a',
              border: '1px solid #333333',
              borderRadius: '0.5rem',
              gap: '0.75rem',
              boxShadow: '0 1px 2px rgba(0, 255, 136, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }
          }, [
            UI.svg({
              viewBox: '0 0 24 24',
              width: '48',
              height: '48',
              fill: '#00ff88',
              style: { display: 'block' }
            }, '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1 0-.26-.1-.51-.26-.7-.16-.18-.26-.43-.26-.7 0-.55.45-1 1-1h1.18c3.03 0 5.5-2.47 5.5-5.5C20.16 5.79 16.63 2 12 2zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>') as any,
            UI.text({
              style: {
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#00ff88'
              }
            }, 'Clean Syntax'),
            UI.text({
              style: {
                fontSize: '0.875rem',
                color: '#b0b0b0',
                lineHeight: '1.5'
              }
            }, 'Elegant API design with TypeScript support for better developer experience.')
          ]),

          // Feature Card 3
          UI.vbox({
            style: {
              flex: '1',
              minWidth: '250px',
              padding: '1.5rem',
              background: '#0a0a0a',
              border: '1px solid #333333',
              borderRadius: '0.5rem',
              gap: '0.75rem',
              boxShadow: '0 1px 2px rgba(0, 255, 136, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }
          }, [
            UI.svg({
              viewBox: '0 0 24 24',
              width: '48',
              height: '48',
              fill: '#00ff88',
              style: { display: 'block' }
            }, '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>') as any,
            UI.text({
              style: {
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#00ff88'
              }
            }, 'Zero Config'),
            UI.text({
              style: {
                fontSize: '0.875rem',
                color: '#b0b0b0',
                lineHeight: '1.5'
              }
            }, 'Start building immediately with sensible defaults and minimal setup.')
          ])
        ])
      ])
    ]),

    // Footer
    UI.footer({
      style: {
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid #333333',
        background: '#0a0a0a'
      }
    }, [
      UI.text({
        style: {
          fontSize: '0.875rem',
          color: '#b0b0b0'
        }
      }, '© 2024 Rynex. Built with ❤️ and modern web technologies.')
    ])
  ]);
}`,


  'public/index.html': () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rynex - Modern Reactive Framework</title>
  
  <!-- Google Fonts - Poppins & Montserrat -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="styles.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Montserrat', sans-serif;
    }
    
    #root {
      width: 100%;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="bundle.js"></script>
</body>
</html>`,

  'tsconfig.json': () => `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,

  'README.md': (projectName: string) => `# ${projectName}

A Rynex application.

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
${projectName}/
├── src/
│   ├── index.ts           # Entry point
│   ├── App.ts             # Root component
│   └── components/        # Components
├── public/
│   └── index.html         # HTML shell
├── dist/                  # Build output
└── rynex.config.js       # Configuration
\`\`\`

## Learn More

Visit [Rynex Documentation](https://github.com/rynex) to learn more.
`
};

/**
 * Initialize a new Rynex project
 */
export async function initProject(projectName: string): Promise<void> {
  const projectPath = path.join(process.cwd(), projectName);

  logger.info(`Creating Rynex project: ${projectName}`);

  // Create project directory
  if (fs.existsSync(projectPath)) {
    logger.error(`Directory ${projectName} already exists`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });

  // Create directory structure
  const dirs = [
    'src',
    'src/components',
    'public',
    'public/assets',
    'dist'
  ];

  dirs.forEach(dir => {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
  });

  // Create files from templates
  const files: Record<string, string> = {
    'package.json': templates['package.json'](projectName),
    'rynex.config.js': templates['rynex.config.js'](),
    'src/index.ts': templates['src/index.ts'](),
    'src/App.ts': templates['src/App.ts'](),
    'public/index.html': templates['public/index.html'](),
    'public/styles.css': templates['public/styles.css'](),
    'tsconfig.json': templates['tsconfig.json'](),
    'README.md': templates['README.md'](projectName)
  };

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(projectPath, filePath);
    fs.writeFileSync(fullPath, content, 'utf8');
  }

  // Create .gitignore
  fs.writeFileSync(
    path.join(projectPath, '.gitignore'),
    'node_modules\ndist\n.DS_Store\n',
    'utf8'
  );

  logger.success('Project created successfully');
  logger.info('Next steps:');
  console.log(`  cd ${projectName}`);
  console.log('  npm install');
  console.log('  npm run dev');
}
