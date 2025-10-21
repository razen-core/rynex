# Rynex Documentation

> **Version:** 0.1.3  
> **Status:** Production Ready (88% Complete)

Welcome to the Rynex documentation. This guide will help you get started with building reactive web applications using Rynex.

### Quick Links
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Getting Started Guide](./GETTING_STARTED.md) - Installation and basic usage
- [Configuration](./CONFIGURATION.md) - Project configuration options
- [Examples](./EXAMPLES.md) - Code examples and patterns
- [Routing Guide](./ROUTING_GUIDE.md) - Client-side routing

### API Documentation

**Core & State**
- [API Reference](./API_REFERENCE.md) - Main API overview with state, computed, effect, render

**Helper Functions**
- [Utility Functions](./api/utilities.md) - lazy, suspense, errorBoundary, memo, fragment, when, show, each, switchCase, dynamic, portal, css
- [Lifecycle Hooks](./api/lifecycle.md) - onMount, onUnmount, onUpdate, watch, watchEffect, onError
- [Performance Utilities](./api/performance.md) - debounce, throttle, preload, getPreloaded, onIdle, cancelIdle
- [Refs & DOM Access](./api/refs.md) - ref, useRef, forwardRef, callbackRef, mergeRefs
- [Style Utilities](./api/styles.md) - styled, classNames, mergeStyles, theme management, CSS variables

**Recently Added (30 Functions)**
- 4 Utility functions for lazy loading and error handling
- 6 Lifecycle hooks for component management
- 6 Performance utilities for optimization
- 5 Ref utilities for DOM access
- 10 Style utilities for theming and styling
- 2 UI components (tabs, accordion)

### Framework Features

**Production Ready**
- 150+ functions implemented
- TypeScript support throughout
- Comprehensive error handling
- Performance optimized
- Hot reload support

**Developer Experience**
- Clean, intuitive API
- Minimal boilerplate
- Reactive by default
- No virtual DOM overhead

### Quick Start

```bash
npm install rynex
# or
pnpm install rynex
```

```typescript
import { render, state, div, text, button } from 'rynex';

function App() {
  const appState = state({ count: 0 });

  return div({}, [
    text(() => `Count: ${appState.count}`),
    button({ onClick: () => appState.count++ }, 'Increment')
  ]);
}

render(App, document.getElementById('root'));
```

### Resources
- [GitHub Repository](https://github.com/razen-core/rynex)
- [NPM Package](https://www.npmjs.com/package/rynex)
- [Test Suite](../tests/) - Interactive test examples

### Learn More

Start with the [Getting Started](./GETTING_STARTED.md) guide to build your first application.
