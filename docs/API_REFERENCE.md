# Rynex API Reference

> **Version:** 0.1.35  
> **Last Updated:** October 21, 2025  
> **Package:** rynex

## Installation

```bash
npm install rynex
# or
pnpm install rynex
```

## Quick Start

```typescript
import { render, state, div, text, button } from 'rynex';

function App() {
  const appState = state({ count: 0 });

  return div({}, [
    text(() => `Count: ${appState.count}`),
    button({ 
      onClick: () => appState.count++ 
    }, 'Increment')
  ]);
}

render(App, document.getElementById('root'));
```

## Core API

### State Management

#### state(initialState)
Creates a reactive state object using JavaScript Proxies.

```typescript
const appState = state({
  count: 0,
  name: 'John'
});

// Updates automatically trigger re-renders
appState.count++;
```

#### computed(computeFn)
Creates a computed value that updates when dependencies change.

```typescript
const doubled = computed(() => appState.count * 2);
console.log(doubled.value); // Reactive value
```

#### effect(effectFn)
Runs a function when reactive dependencies change.

```typescript
const cleanup = effect(() => {
  console.log('Count:', appState.count);
});

// Call cleanup when done
cleanup();
```

#### batch(fn)
Batches multiple state updates together for performance.

```typescript
batch(() => {
  appState.count++;
  appState.name = 'Jane';
  // Only triggers one update
});
```

### Rendering

#### render(component, target)
Mounts a component to a DOM element.

```typescript
render(App, document.getElementById('root'));
```

## Reactivity Patterns

### Static Values
```typescript
text('Hello World')
div({ class: 'container' }, 'Content')
```

### Reactive Values (Getter Functions)
```typescript
text(() => `Count: ${state.count}`)
div({ 
  style: { 
    color: () => state.active ? 'green' : 'red' 
  } 
})
```

## Component Patterns

### Function Components
```typescript
function Counter() {
  const state = state({ count: 0 });
  
  return div({}, [
    text(() => `Count: ${state.count}`),
    button({ onClick: () => state.count++ }, 'Increment')
  ]);
}
```

### With Props
```typescript
function Greeting(props: { name: string }) {
  return div({}, [
    text(`Hello, ${props.name}!`)
  ]);
}

// Usage
Greeting({ name: 'John' })
```

## API Categories

- [Layout Helpers](./api/layout.md) - vbox, hbox, grid, center, etc.
- [Basic Elements](./api/elements.md) - div, span, text, button, input, etc.
- [Typography](./api/typography.md) - h1-h6, p, strong, em, etc.
- [Form Elements](./api/forms.md) - form, input, select, checkbox, etc.
- [UI Components](./api/components.md) - tabs, accordion, modal, dropdown, etc.
- [Utility Functions](./api/utilities.md) - lazy, suspense, errorBoundary, memo, etc.
- [Lifecycle Hooks](./api/lifecycle.md) - onMount, onUnmount, watch, etc.
- [Performance](./api/performance.md) - debounce, throttle, preload, etc.
- [Refs & DOM](./api/refs.md) - ref, useRef, forwardRef, etc.
- [Style Utilities](./api/styles.md) - styled, classNames, theme, etc.
- [Routing](./api/routing.md) - Router, Link, NavLink, etc.

## TypeScript Support

Rynex is written in TypeScript and provides full type definitions.

```typescript
import { state, DOMProps } from 'rynex';

interface AppState {
  count: number;
  user: { name: string; email: string };
}

const appState = state<AppState>({
  count: 0,
  user: { name: '', email: '' }
});
```

## Best Practices

### 1. Use Getter Functions for Reactivity
```typescript
// Good
text(() => `Count: ${state.count}`)

// Bad (won't update)
text(`Count: ${state.count}`)
```

### 2. Batch Related Updates
```typescript
batch(() => {
  state.firstName = 'John';
  state.lastName = 'Doe';
  state.age = 30;
});
```

### 3. Clean Up Effects
```typescript
const cleanup = effect(() => {
  // Effect logic
});

// Later
cleanup();
```

### 4. Use Memoization for Expensive Components
```typescript
const MemoizedComponent = memo((props) => {
  // Expensive rendering
  return div({}, 'Content');
});
```

## Package Exports

```typescript
// Main export
import { state, render, div } from 'rynex';

// Specific imports
import { state } from 'rynex/state';
import { div, text } from 'rynex/helpers';
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern browsers with Proxy support

## License

Apache-2.0

## Links

- [GitHub Repository](https://github.com/razen-core/rynex)
- [Getting Started Guide](./GETTING_STARTED.md)
- [Examples](./EXAMPLES.md)
- [Routing Guide](./ROUTING_GUIDE.md)
