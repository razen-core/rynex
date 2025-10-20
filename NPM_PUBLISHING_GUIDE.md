# Rynex - NPM Publishing Guide

## Current Status

### Development (Current)
```typescript
// Using relative paths
import { state } from '../../../dist/runtime/index.js';
import * as UI from '../../../dist/runtime/index.js';
```

### After Publishing to NPM
```typescript
// Clean imports - what users will use
import { state } from 'rynex';
import * as UI from 'rynex';

// Or selective imports
import * as UI from 'rynex/helpers';
import { state, effect } from 'rynex/state';
```

---

## Pre-Publishing Checklist

### 1. Update package.json

Current package.json needs these updates:

```json
{
  "name": "rynex",
  "version": "1.0.0",
  "description": "A minimalist TypeScript framework for building reactive web applications",
  "main": "dist/runtime/index.js",
  "types": "dist/runtime/index.d.ts",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/runtime/index.d.ts",
      "import": "./dist/runtime/index.js"
    },
    "./runtime": {
      "types": "./dist/runtime/index.d.ts",
      "import": "./dist/runtime/index.js"
    },
    "./helpers": {
      "types": "./dist/runtime/helpers/index.d.ts",
      "import": "./dist/runtime/helpers/index.js"
    },
    "./state": {
      "types": "./dist/runtime/state.d.ts",
      "import": "./dist/runtime/state.js"
    },
    "./dom": {
      "types": "./dist/runtime/dom.d.ts",
      "import": "./dist/runtime/dom.js"
    }
  },
  "bin": {
    "rynex": "./dist/cli/bin/rynex.js"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build:framework": "tsc",
    "prepublishOnly": "pnpm build:framework",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "framework",
    "reactive",
    "ui",
    "minimalist",
    "rynex",
    "typescript",
    "vanilla-js",
    "no-virtual-dom",
    "proxy-based",
    "state-management"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/razen-core/rynex.git"
  },
  "bugs": {
    "url": "https://github.com/razen-core/rynex/issues"
  },
  "homepage": "https://github.com/razen-core/rynex#readme",
  "packageManager": "pnpm@10.12.1",
  "dependencies": {
    "esbuild": "^0.19.0",
    "chokidar": "^3.5.3"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0"
  }
}
```

### 2. Create .npmignore

```
# Source files
src/
tsconfig.json
pnpm-workspace.yaml

# Examples
examples/

# Development files
.git/
.gitignore
*.md
!README.md

# Build artifacts
*.log
*.tsbuildinfo

# IDE
.vscode/
.idea/

# Tests
test/
*.test.ts
*.spec.ts
```

---

## Publishing Steps

### Step 1: Login to NPM

```bash
npm login
# Enter your npm username, password, and email
```

### Step 2: Test Package Locally

```bash
# Build the package
pnpm build:framework

# Test pack (creates a tarball without publishing)
npm pack

# This creates: rynex-1.0.0.tgz
# You can test install it locally:
npm install ./rynex-1.0.0.tgz
```

### Step 3: Check Package Contents

```bash
# See what will be published
npm publish --dry-run
```

### Step 4: Publish to NPM

```bash
# For first time (public package)
npm publish --access public

# For updates
npm publish
```

### Step 5: Verify Publication

```bash
# Check if package is available
npm view rynex

# Install and test
npm install rynex
```

---

## Testing the Published Package

### Create a Test Project

```bash
mkdir test-rynex-npm
cd test-rynex-npm
npm init -y
npm install rynex
```

### Test File (test-app.ts)

```typescript
// Clean imports - this is what users will use!
import { state, render } from 'rynex';
import * as UI from 'rynex';

function App() {
  const appState = state({
    count: 0,
    name: ''
  });

  return UI.vbox({
    style: {
      padding: '2rem',
      gap: '1rem'
    }
  }, [
    UI.text(() => `Count: ${appState.count}`),
    UI.button({
      onClick: () => { appState.count++; }
    }, 'Increment'),
    
    UI.input({
      value: appState.name,
      onInput: (e: Event) => {
        appState.name = (e.target as HTMLInputElement).value;
      }
    }),
    UI.text(() => `Hello, ${appState.name || 'Guest'}!`)
  ]);
}

render(App, document.getElementById('root')!);
```

---

## Version Management

### Semantic Versioning

- **Patch** (1.0.x): Bug fixes
  ```bash
  npm version patch
  npm publish
  ```

- **Minor** (1.x.0): New features (backwards compatible)
  ```bash
  npm version minor
  npm publish
  ```

- **Major** (x.0.0): Breaking changes
  ```bash
  npm version major
  npm publish
  ```

---

## NPM Scripts for Publishing

Add to package.json:

```json
{
  "scripts": {
    "build:framework": "tsc",
    "prepublishOnly": "pnpm build:framework",
    "release:patch": "npm version patch && npm publish",
    "release:minor": "npm version minor && npm publish",
    "release:major": "npm version major && npm publish"
  }
}
```

---

## After Publishing

### 1. Update README with Installation

```markdown
## Installation

\`\`\`bash
npm install rynex
# or
pnpm add rynex
# or
yarn add rynex
\`\`\`

## Quick Start

\`\`\`typescript
import { state, render } from 'rynex';
import * as UI from 'rynex';

function App() {
  const appState = state({ count: 0 });
  
  return UI.vbox({}, [
    UI.text(() => \`Count: \${appState.count}\`),
    UI.button({ onClick: () => appState.count++ }, 'Increment')
  ]);
}

render(App, document.getElementById('root')!);
\`\`\`
```

### 2. Add NPM Badge to README

```markdown
[![npm version](https://badge.fury.io/js/rynex.svg)](https://www.npmjs.com/package/rynex)
[![npm downloads](https://img.shields.io/npm/dm/rynex.svg)](https://www.npmjs.com/package/rynex)
```

### 3. Update Examples to Use NPM Package

After publishing, update examples:

```typescript
// OLD (development)
import { state } from '../../../dist/runtime/index.js';
import * as UI from '../../../dist/runtime/index.js';

// NEW (after npm publish)
import { state } from 'rynex';
import * as UI from 'rynex';
```

---

## Troubleshooting

### Package Name Already Taken

If "rynex" is taken, try:
- `@your-username/rynex`
- `rynex-framework`
- `zen-web`

### TypeScript Definitions Not Working

Ensure:
1. `types` field in package.json points to `.d.ts` files
2. TypeScript compiled with `declaration: true`
3. `.d.ts` files are in the `dist/` folder

### Module Resolution Issues

Check:
1. `"type": "module"` in package.json
2. All imports use `.js` extensions
3. `exports` field is correctly configured

---

## Quick Publish Checklist

- [ ] Update version in package.json
- [ ] Update author and repository info
- [ ] Run `pnpm build:framework`
- [ ] Test with `npm pack`
- [ ] Run `npm publish --dry-run`
- [ ] Login with `npm login`
- [ ] Publish with `npm publish --access public`
- [ ] Test install: `npm install rynex`
- [ ] Update README with npm install instructions
- [ ] Push git tags: `git push --tags`

---

## Next Steps

1. Update package.json with correct author info
2. Create .npmignore file
3. Build the framework
4. Test locally with npm pack
5. Publish to npm
6. Test the published package
7. Update documentation

Would you like me to update the package.json and create the .npmignore file now?
