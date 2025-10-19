# ZenWeb Quick Start (After NPM Publish)

## Installation

```bash
npm install zenweb
# or
pnpm add zenweb
# or
yarn add zenweb
```

## Basic Usage

### 1. Simple Counter App

```typescript
import { state, render } from 'zenweb';
import * as UI from 'zenweb';

function App() {
  const appState = state({ count: 0 });

  return UI.vbox({
    style: {
      padding: '2rem',
      gap: '1rem',
      alignItems: 'center'
    }
  }, [
    UI.text(() => `Count: ${appState.count}`),
    UI.hbox({ style: { gap: '0.5rem' } }, [
      UI.button({
        onClick: () => { appState.count--; }
      }, 'Decrement'),
      UI.button({
        onClick: () => { appState.count++; }
      }, 'Increment')
    ])
  ]);
}

render(App, document.getElementById('root')!);
```

### 2. Form with Input

```typescript
import { state, render } from 'zenweb';
import * as UI from 'zenweb';

function App() {
  const appState = state({
    name: '',
    email: ''
  });

  return UI.vbox({
    style: { padding: '2rem', gap: '1rem' }
  }, [
    UI.text(() => `Hello, ${appState.name || 'Guest'}!`),
    
    UI.input({
      placeholder: 'Enter your name',
      value: appState.name,
      onInput: (e: Event) => {
        appState.name = (e.target as HTMLInputElement).value;
      }
    }),
    
    UI.input({
      type: 'email',
      placeholder: 'Enter your email',
      value: appState.email,
      onInput: (e: Event) => {
        appState.email = (e.target as HTMLInputElement).value;
      }
    }),
    
    UI.text(() => `Email: ${appState.email}`)
  ]);
}

render(App, document.getElementById('root')!);
```

### 3. Conditional Rendering

```typescript
import { state, render } from 'zenweb';
import * as UI from 'zenweb';

function App() {
  const appState = state({ showDetails: false });

  return UI.vbox({
    style: { padding: '2rem', gap: '1rem' }
  }, [
    UI.button({
      onClick: () => { appState.showDetails = !appState.showDetails; }
    }, () => appState.showDetails ? 'Hide Details' : 'Show Details'),
    
    UI.show(() => appState.showDetails,
      UI.vbox({
        style: {
          padding: '1rem',
          background: '#f0f0f0',
          borderRadius: '8px'
        }
      }, [
        UI.text('These are the details!'),
        UI.text('More information here...')
      ])
    )
  ]);
}

render(App, document.getElementById('root')!);
```

## Import Patterns

### Full Import (Recommended)
```typescript
import { state, render } from 'zenweb';
import * as UI from 'zenweb';
```

### Selective Imports (Better Tree-Shaking)
```typescript
// Only UI helpers
import * as UI from 'zenweb/helpers';

// Only state management
import { state, effect, computed } from 'zenweb/state';

// Only DOM utilities
import { createElement, mount, $ } from 'zenweb/dom';
```

## CLI Usage

### Create New Project
```bash
npx zenweb init my-app
cd my-app
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Features

- **No Virtual DOM**: Direct DOM manipulation for better performance
- **Reactive State**: Proxy-based reactivity with automatic updates
- **TypeScript First**: Full type safety out of the box
- **Zero Dependencies**: Minimal runtime footprint
- **Inline Styles**: Style objects with full TypeScript support
- **Reactive Getters**: No manual effect() calls needed

## Documentation

Visit [GitHub Repository](https://github.com/razen-core/zenweb) for full documentation.

## License

MIT
