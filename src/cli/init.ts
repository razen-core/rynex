/**
 * ZenWeb Project Initializer
 * Scaffolds new ZenWeb projects
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
    "dev": "zenweb dev",
    "build": "zenweb build"
  },
  "dependencies": {
    "zenweb": "^1.0.0"
  }
}`,

  'zenweb.config.js': () => `export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  minify: true,
  sourceMaps: true,
  port: 3000,
  hotReload: true
};`,

  'src/index.ts': () => `import { render } from 'zenweb/runtime';
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
 * ZenWeb App - Main Component
 * Uses namespaced imports and reactive getters for auto-updates
 */

import { state, effect } from 'zenweb/runtime';
import * as UI from 'zenweb/runtime';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

export default function App() {
  // Reactive state
  const appState = state({
    count: 0,
    name: ''
  });

  // Reactive displays using getters
  const greetingText = UI.text(() => \`Hello, \${appState.name || 'Guest'}!\`);
  const countDisplay = UI.text(() => \`Count: \${appState.count}\`);

  return UI.vbox({
    class: 'app-container',
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  }, [
    Header({ title: 'Welcome to ZenWeb' }),
    
    UI.vbox({
      class: 'main-content',
      style: {
        flex: '1',
        padding: '2rem',
        gap: '1.5rem',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, [
      UI.text({
        class: 'greeting',
        style: {
          fontSize: '2rem',
          color: 'white',
          fontWeight: 'bold'
        }
      }, () => \`Hello, \${appState.name || 'Guest'}!\`),
      
      UI.input({
        placeholder: 'Enter your name',
        value: appState.name,
        onInput: (e: Event) => { appState.name = (e.target as HTMLInputElement).value; },
        style: {
          padding: '0.75rem',
          borderRadius: '8px',
          border: '2px solid white',
          fontSize: '1rem',
          width: '300px'
        }
      }),
      
      UI.hbox({
        class: 'counter-section',
        style: {
          gap: '1rem',
          alignItems: 'center'
        }
      }, [
        UI.button({
          onClick: () => { appState.count--; },
          style: {
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: 'white',
            color: '#667eea',
            fontWeight: '600',
            cursor: 'pointer'
          }
        }, 'Decrement'),
        UI.text({
          class: 'count-display',
          style: {
            fontSize: '1.5rem',
            color: 'white',
            minWidth: '120px',
            textAlign: 'center'
          }
        }, () => \`Count: \${appState.count}\`),
        UI.button({
          onClick: () => { appState.count++; },
          style: {
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: 'white',
            color: '#667eea',
            fontWeight: '600',
            cursor: 'pointer'
          }
        }, 'Increment')
      ]),
      
      UI.button({
        class: 'reset-btn',
        onClick: () => {
          appState.count = 0;
          appState.name = '';
        },
        style: {
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          background: 'white',
          color: '#667eea',
          fontWeight: '600',
          cursor: 'pointer'
        }
      }, 'Reset All')
    ]),
    
    Footer()
  ]);
}`,

  'src/components/Header.ts': () => `import * as UI from 'zenweb/runtime';

interface HeaderProps {
  title: string;
}

export default function Header(props: HeaderProps) {
  return UI.hbox({
    class: 'header',
    style: {
      padding: '1.5rem',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      justifyContent: 'center'
    }
  }, [
    UI.text({
      class: 'title',
      style: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white'
      }
    }, props.title)
  ]);
}`,

  'src/components/Footer.ts': () => `import * as UI from 'zenweb/runtime';

export default function Footer() {
  return UI.hbox({
    class: 'footer',
    style: {
      padding: '1rem',
      background: 'rgba(0, 0, 0, 0.2)',
      justifyContent: 'center',
      color: 'white'
    }
  }, [
    UI.text({}, 'Built with ZenWeb 🧘')
  ]);
}`,

  'public/index.html': () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZenWeb App</title>
  <link rel="stylesheet" href="styles.css">
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

A ZenWeb application.

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
└── zenweb.config.js       # Configuration
\`\`\`

## Learn More

Visit [ZenWeb Documentation](https://github.com/zenweb) to learn more.
`
};

/**
 * Initialize a new ZenWeb project
 */
export async function initProject(projectName: string): Promise<void> {
  const projectPath = path.join(process.cwd(), projectName);

  logger.info(`Creating ZenWeb project: ${projectName}`);

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
    'zenweb.config.js': templates['zenweb.config.js'](),
    'src/index.ts': templates['src/index.ts'](),
    'src/App.ts': templates['src/App.ts'](),
    'src/components/Header.ts': templates['src/components/Header.ts'](),
    'src/components/Footer.ts': templates['src/components/Footer.ts'](),
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
