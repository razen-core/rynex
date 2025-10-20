# ZenWeb Framework

A minimalist TypeScript framework for building reactive web applications with no Virtual DOM.

## Features

- **No Virtual DOM**: Direct DOM manipulation for maximum performance
- **Reactive State**: Proxy-based reactivity with automatic UI updates
- **File-Based Routing**: Next.js style routing with dynamic routes
- **TypeScript First**: Full type safety out of the box
- **Zero Configuration**: Sensible defaults, works immediately
- **Production Ready**: Express server with native HTTP fallback
- **Hot Module Replacement**: Instant feedback during development
- **Tiny Bundle**: Approximately 15KB gzipped

## Quick Start

```bash
# Create new project
npx zenweb init my-app
cd my-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Your application will be running at `http://localhost:3000`

## Example

### Simple Counter Component

```typescript
import { state } from 'zenweb';
import * as UI from 'zenweb';

export default function Counter() {
  const counterState = state({ count: 0 });

  return UI.vbox({
    style: { padding: '2rem', gap: '1rem' }
  }, [
    UI.text({}, () => `Count: ${counterState.count}`),
    UI.hbox({ style: { gap: '0.5rem' } }, [
      UI.button({
        onClick: () => counterState.count--
      }, 'Decrement'),
      UI.button({
        onClick: () => counterState.count++
      }, 'Increment')
    ])
  ]);
}
```

## Core Concepts

### Reactive State Management

```typescript
import { state, computed, effect } from 'zenweb';

// Create reactive state
const appState = state({
  count: 0,
  name: 'John'
});

// Computed values
const doubled = computed(() => appState.count * 2);

// Side effects
effect(() => {
  console.log('Count changed:', appState.count);
});

// Updates trigger automatic re-renders
appState.count++;
```

### File-Based Routing

Organize pages by file structure:

```
src/pages/
├── index.ts              # Route: /
├── about.ts              # Route: /about
├── blog/
│   ├── page.ts           # Route: /blog
│   └── [slug]/
│       └── page.ts       # Route: /blog/:slug (dynamic)
└── user/
    └── [id]/
        └── page.ts       # Route: /user/:id (dynamic)
```

### Dynamic Routes

```typescript
import * as UI from 'zenweb';
import { RouteContext } from 'zenweb';

export default function UserPage(ctx: RouteContext) {
  const userId = ctx.params.id;
  
  return UI.vbox({
    style: { padding: '2rem' }
  }, [
    UI.h1({}, `User Profile: ${userId}`),
    UI.text({}, `Viewing profile for user ${userId}`),
    UI.link({ href: '/' }, 'Go Home')
  ]);
}
```

## CLI Commands

```bash
# Create new project
zenweb init [project-name]

# Start development server with HMR
zenweb dev

# Build for production
zenweb build

# Start production server
zenweb start

# Clean build artifacts
zenweb clean
```

## Configuration

Create `zenweb.config.js` in your project root:

```javascript
export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  port: 3000,
  minify: true,
  sourceMaps: true,
  hotReload: true,
  
  // Routing configuration
  routing: {
    mode: 'history',
    fileBasedRouting: true,
    pagesDir: 'src/pages',
    scrollBehavior: 'smooth'
  },
  
  // Build configuration
  build: {
    splitting: true,
    chunkSize: 500,
    publicPath: '/'
  }
};
```

## Project Structure

```
my-app/
├── src/
│   ├── index.ts          # Entry point
│   ├── App.ts            # Main component
│   ├── components/       # Reusable components
│   └── pages/            # Route pages
├── public/
│   ├── index.html        # HTML template
│   └── styles.css        # Global styles
├── dist/                 # Build output
├── zenweb.config.js      # Configuration
├── package.json
└── tsconfig.json
```

## Documentation

Complete documentation is available in the `docs/` directory:

- [Getting Started](./docs/GETTING_STARTED.md) - Installation and first steps
- [Routing Guide](./docs/ROUTING_GUIDE.md) - File-based routing and navigation
- [Configuration](./docs/CONFIGURATION.md) - Project configuration options
- [Examples](./docs/EXAMPLES.md) - Real-world code examples

## Key Features

### UI Helper Functions

- **Layout**: `vbox`, `hbox`, `grid`, `container`, `center`, `stack`
- **Elements**: `text`, `button`, `input`, `link`, `image`, `div`, `span`
- **Typography**: `h1-h6`, `p`, `strong`, `em`, `code`, `pre`
- **Forms**: `form`, `textarea`, `select`, `checkbox`, `radio`
- **Components**: `card`, `badge`, `avatar`, `modal`, `dropdown`, `tooltip`
- **Utilities**: `show`, `each`, `when`, `fragment`, `portal`

### Router Features

- File-based routing (Next.js style)
- Dynamic routes with parameters
- Catch-all routes
- Route middleware and guards
- Lazy loading with code splitting
- Navigation hooks
- Router components (Link, NavLink, Breadcrumb)

### State Management

- Proxy-based reactivity
- Computed values
- Side effects
- Batch updates
- Automatic dependency tracking

## Design Philosophy

1. **Simplicity First**: No complex build configurations
2. **Direct DOM**: No Virtual DOM overhead
3. **Reactive by Default**: State changes automatically update UI
4. **TypeScript Native**: Built with TypeScript for TypeScript
5. **Performance**: Minimal runtime with efficient updates
6. **Developer Experience**: Hot reload, source maps, clear errors

## Performance

- No Virtual DOM diffing overhead
- Direct DOM updates
- Lazy loading support
- Code splitting
- Tree shaking
- Minification
- Compression (with Express)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache License 2.0 - see [LICENSE](./LICENSE) file for details

## Links

- [GitHub Repository](https://github.com/razen-core/zenweb)
- [Documentation](./docs/)
- [Examples](./examples/)
- [Issue Tracker](https://github.com/razen-core/zenweb/issues)

---

Built with care by the Razen Core 
- Developer: Prathmesh Barot
