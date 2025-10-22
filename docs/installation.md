# Installation Guide

Get Rynex installed and ready to use in your project.

## Prerequisites

Before installing Rynex, make sure you have:

- Node.js 14 or higher
- npm or yarn package manager
- A code editor (VSCode recommended)

Check your Node.js version:

```bash
node --version
npm --version
```

## Installation Methods

### Method 1: NPM (Recommended)

Install Rynex using npm:

```bash
npm install rynex
```

### Method 2: Yarn

If you prefer yarn:

```bash
yarn add rynex
```

### Method 3: From Source

Clone the repository and build locally:

```bash
git clone https://github.com/zen-web/rynex.git
cd rynex
npm install
npm run build
```

## Verify Installation

Create a test file to verify Rynex is working:

```typescript
import { div, text } from 'rynex';

const app = div(
  { class: 'app' },
  text('Rynex is installed!')
);

document.body.appendChild(app);
```

Run your test file and you should see "Rynex is installed!" displayed.

## Setup Development Environment

### TypeScript Configuration

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Build Configuration

For Webpack:

```javascript
module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
```

For Vite:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020'
  }
});
```

## Project Structure

After installation, organize your project like this:

```
my-rynex-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── index.ts
│   └── main.ts
├── dist/
├── node_modules/
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## First Steps

1. Create your first component:

```typescript
// src/components/App.ts
import { div, text } from 'rynex';

export function App() {
  return div(
    { class: 'app' },
    text('Welcome to Rynex!')
  );
}
```

2. Mount it to the DOM:

```typescript
// src/main.ts
import { App } from './components/App';

const app = App();
document.body.appendChild(app);
```

3. Build and run:

```bash
npm run build
npm run serve
```

## Troubleshooting Installation

### Issue: Module not found

Make sure you installed Rynex in the correct directory:

```bash
npm list rynex
```

### Issue: TypeScript errors

Update your TypeScript version:

```bash
npm install --save-dev typescript@latest
```

### Issue: Build fails

Clear your build cache:

```bash
rm -rf dist node_modules
npm install
npm run build
```

## Next Steps

- Read [Getting Started](./getting-started.md)
- Create your [First Project](./project-creation.md)
- Explore [Helper Functions](./helpers/index.md)

## Need Help?

- Check the [FAQ](./faq.md)
- Review [Examples](./examples.md)
- Read [Best Practices](./best-practices.md)
