/**
 * ZenWeb Project Initializer
 * Scaffolds new ZenWeb projects
 */

import * as fs from 'fs';
import * as path from 'path';

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

  'src/App.ts': () => `import { state } from 'zenweb/runtime';
import { vbox, hbox, text, button, input } from 'zenweb/runtime';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

export default function App() {
  const [count, setCount] = state(0);
  const [name, setName] = state('');

  view {
    vbox({ class: 'app-container' }, [
      Header({ title: 'Welcome to ZenWeb' }),
      
      vbox({ class: 'main-content' }, [
        text({ class: 'greeting' }, \`Hello, \${name() || 'Guest'}!\`),
        
        input({
          placeholder: 'Enter your name',
          value: name(),
          onInput: (e: Event) => setName((e.target as HTMLInputElement).value)
        }),
        
        hbox({ class: 'counter-section' }, [
          button({ onClick: () => setCount(count() - 1) }, 'Decrement'),
          text({ class: 'count-display' }, \`Count: \${count()}\`),
          button({ onClick: () => setCount(count() + 1) }, 'Increment')
        ]),
        
        button({
          class: 'reset-btn',
          onClick: () => {
            setCount(0);
            setName('');
          }
        }, 'Reset All')
      ]),
      
      Footer()
    ])
  }

  style {
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .main-content {
      flex: 1;
      padding: 2rem;
      gap: 1.5rem;
      align-items: center;
      justify-content: center;
    }
    
    .greeting {
      font-size: 2rem;
      color: white;
      font-weight: bold;
    }
    
    .counter-section {
      gap: 1rem;
      align-items: center;
    }
    
    .count-display {
      font-size: 1.5rem;
      color: white;
      min-width: 120px;
      text-align: center;
    }
    
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      background: white;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    button:hover {
      transform: scale(1.05);
    }
    
    input {
      padding: 0.75rem;
      border-radius: 8px;
      border: 2px solid white;
      font-size: 1rem;
      width: 300px;
    }
  }
}`,

  'src/components/Header.ts': () => `import { hbox, text } from 'zenweb/runtime';

interface HeaderProps {
  title: string;
}

export default function Header(props: HeaderProps) {
  view {
    hbox({ class: 'header' }, [
      text({ class: 'title' }, props.title)
    ])
  }

  style {
    .header {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      justify-content: center;
    }
    
    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }
  }
}`,

  'src/components/Footer.ts': () => `import { hbox, text } from 'zenweb/runtime';

export default function Footer() {
  view {
    hbox({ class: 'footer' }, [
      text({}, 'Built with ZenWeb 🧘')
    ])
  }

  style {
    .footer {
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      justify-content: center;
      color: white;
    }
  }
}`,

  'public/index.html': () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZenWeb App</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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

  console.log(`🎨 Creating ZenWeb project: ${projectName}`);

  // Create project directory
  if (fs.existsSync(projectPath)) {
    console.error(`❌ Directory ${projectName} already exists`);
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

  console.log('✅ Project created successfully!');
  console.log('\nNext steps:');
  console.log(`  cd ${projectName}`);
  console.log('  npm install');
  console.log('  npm run dev');
}
