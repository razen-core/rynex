# Rynex New Features Guide

> **Version:** 0.1.40  
> **Last Updated:** October 21, 2025  
> **Status:** Production Ready

## Overview

This guide covers the newly implemented features in Rynex framework:
- Animation & Transitions
- State Management (Store & Context)
- Developer Tools (Logger & Profiler)

All features include comprehensive error handling, validation, and debugging support.

---

## Animation & Transitions

Simple, performant animations using the Web Animations API without external dependencies.

### transition(element, config)

Applies CSS transitions to elements.

```typescript
import { transition } from 'rynex';

const box = div({ class: 'box' }, 'Animated Box');

// Apply transition
transition(box, {
  duration: 300,
  easing: 'ease-in-out',
  delay: 0,
  onStart: () => console.log('Transition started'),
  onEnd: () => console.log('Transition ended')
});

// Change properties to see transition
box.style.opacity = '0.5';
```

### animate(element, config)

Web Animations API wrapper for complex animations.

```typescript
import { animate } from 'rynex';

const animation = animate(box, {
  keyframes: [
    { transform: 'translateX(0px)', opacity: 1 },
    { transform: 'translateX(100px)', opacity: 0.5 }
  ],
  duration: 500,
  easing: 'ease-out',
  iterations: 1,
  fill: 'forwards'
});

// Control animation
animation.pause();
animation.play();
animation.cancel();
```

### fade(element, direction, config)

Fade in/out animations.

```typescript
import { fade } from 'rynex';

// Fade in
fade(box, 'in', { duration: 300 });

// Fade out
fade(box, 'out', { duration: 300 });

// Toggle fade
fade(box, 'toggle', { duration: 300 });
```

### slide(element, direction, config)

Slide animations in four directions.

```typescript
import { slide } from 'rynex';

// Slide from different directions
slide(box, 'down', { duration: 400 });
slide(box, 'up', { duration: 400 });
slide(box, 'left', { duration: 400 });
slide(box, 'right', { duration: 400 });
```

### scale(element, direction, config)

Scale in/out animations.

```typescript
import { scale } from 'rynex';

// Scale in
scale(box, 'in', { duration: 300 });

// Scale out
scale(box, 'out', { duration: 300 });

// Toggle scale
scale(box, 'toggle', { duration: 300 });
```

### rotate(element, degrees, config)

Rotate element by specified degrees.

```typescript
import { rotate } from 'rynex';

// Rotate 360 degrees
rotate(box, 360, { duration: 1000 });

// Rotate 180 degrees
rotate(box, 180, { duration: 500 });
```

---

## State Management

### Global Store

Create and manage global application state.

#### createStore(name, initialState, actions)

```typescript
import { createStore } from 'rynex';

// Create a store
const userStore = createStore(
  'user',
  { 
    name: 'Guest',
    isLoggedIn: false,
    credits: 0
  },
  (state) => ({
    login: (username: string) => {
      state.name = username;
      state.isLoggedIn = true;
    },
    logout: () => {
      state.name = 'Guest';
      state.isLoggedIn = false;
    },
    addCredits: (amount: number) => {
      state.credits += amount;
    }
  })
);

// Use the store
userStore.actions.login('John');
console.log(userStore.state.name); // 'John'

// Subscribe to changes
const unsubscribe = userStore.subscribe(() => {
  console.log('Store updated:', userStore.state);
});

// Get snapshot of state
const snapshot = userStore.getState();
```

#### useStore(name)

Retrieve an existing store.

```typescript
import { useStore } from 'rynex';

// In another component
const userStore = useStore('user');

if (userStore) {
  console.log(userStore.state.name);
  userStore.actions.addCredits(100);
}
```

#### Store Management

```typescript
import { getStores, removeStore, clearStores } from 'rynex';

// Get all store names
const storeNames = getStores();
console.log(storeNames); // ['user', 'cart', 'settings']

// Remove a specific store
removeStore('user');

// Clear all stores
clearStores();
```

### Context API

Share data across component tree without prop drilling.

#### createContext(defaultValue)

```typescript
import { createContext, useContext } from 'rynex';

// Create context
const ThemeContext = createContext({ theme: 'light', color: '#000' });

// Use Provider
function App() {
  const themeValue = { theme: 'dark', color: '#fff' };
  
  return ThemeContext.Provider({
    value: themeValue,
    children: div({}, [
      Header(),
      Content()
    ])
  });
}

// Consume context
function Header() {
  const theme = useContext(ThemeContext);
  
  return div({
    style: { 
      background: theme.color === '#fff' ? '#333' : '#fff',
      color: theme.color
    }
  }, `Theme: ${theme.theme}`);
}
```

#### provider(contextKey, value, children)

Generic provider function.

```typescript
import { provider } from 'rynex';

const myContext = Symbol('myContext');

const app = provider(
  myContext,
  { data: 'value' },
  div({}, 'Content')
);
```

---

## Developer Tools

Comprehensive debugging, logging, and profiling utilities.

### Logger

Structured logging with levels and timestamps.

#### Basic Usage

```typescript
import { logger, LogLevel } from 'rynex';

// Create logger
const log = logger({
  level: LogLevel.DEBUG,
  prefix: '[MyApp]',
  timestamp: true,
  colors: true
});

// Log messages
log.debug('Debug message', { data: 'value' });
log.info('Info message', { status: 'ok' });
log.warn('Warning message', { level: 'medium' });
log.error('Error message', { code: 500 });

// Get all logs
const logs = log.getLogs();

// Clear logs
log.clearLogs();

// Change log level
log.setLevel(LogLevel.WARN);
```

#### Quick Access

```typescript
import { log } from 'rynex';

log.debug('Debug info');
log.info('Information');
log.warn('Warning');
log.error('Error occurred');
```

### Profiler

Performance profiling and measurement.

#### Basic Usage

```typescript
import { profiler } from 'rynex';

const prof = profiler();

// Start profiling
prof.start('data-fetch');

// ... do some work ...

// End profiling
const duration = prof.end('data-fetch');
console.log(`Operation took ${duration}ms`);
```

#### Measure Functions

```typescript
import { profile } from 'rynex';

// Measure synchronous function
const result = profile.measure('calculation', () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
});

// Measure async function
const data = await profile.measureAsync('api-call', async () => {
  const response = await fetch('/api/data');
  return response.json();
});

// Get profile report
const report = profile.report();
console.table(report.completed);
```

#### Advanced Profiling

```typescript
const prof = profiler();

// Profile with metadata
prof.start('render', { component: 'UserList' });
// ... render logic ...
prof.end('render');

// Get specific profile
const renderProfile = prof.getProfile('render');

// Get average duration
const avgDuration = prof.getAverageDuration('render');

// Clear profiles
prof.clear();
```

### DevTools Integration

Access debugging tools from browser console.

```typescript
import { devtools } from 'rynex';

// Initialize devtools
const tools = devtools({
  enabled: true
});

// Access from console
window.__RYNEX_DEVTOOLS__.logger.info('From console');
window.__RYNEX_DEVTOOLS__.profiler.report();

// Inspect elements
const info = tools.inspect(document.querySelector('.my-element'));

// Enable/disable
tools.disable();
tools.enable();
```

---

## Error Handling

All new features include comprehensive error handling:

### Validation

```typescript
// Invalid inputs are caught and logged
fade(null, 'in'); // Warns: Invalid element provided to fade
createStore('', {}); // Throws: Invalid store name
useContext(null); // Throws: Invalid context object
```

### Debug Logging

```typescript
// Enable debug mode to see internal operations
import { logger, LogLevel } from 'rynex';

logger({ level: LogLevel.DEBUG });

// Now all operations log debug info:
// [Rynex] [DEBUG] Animation started: 300ms
// [Rynex] [DEBUG] Store created: user
// [Rynex] [DEBUG] Context value retrieved
```

### Error Recovery

```typescript
// Animations return null on error instead of throwing
const animation = fade(invalidElement, 'in');
if (!animation) {
  console.log('Animation failed gracefully');
}

// Store operations return null on error
const store = useStore('nonexistent');
if (!store) {
  console.log('Store not found, using fallback');
}
```

---

## Best Practices

### Animations

1. **Reuse animation configs**
```typescript
const fadeConfig = { duration: 300, easing: 'ease-in-out' };
fade(element1, 'in', fadeConfig);
fade(element2, 'in', fadeConfig);
```

2. **Clean up animations**
```typescript
const animation = animate(element, config);
// Later, when component unmounts
animation.cancel();
```

3. **Use callbacks for sequencing**
```typescript
fade(element, 'out', {
  duration: 300,
  onEnd: () => {
    element.remove();
  }
});
```

### State Management

1. **Keep stores focused**
```typescript
// Good: Separate stores for different domains
const userStore = createStore('user', userState, userActions);
const cartStore = createStore('cart', cartState, cartActions);

// Avoid: One giant store for everything
```

2. **Use context for component-specific state**
```typescript
// Use stores for global app state
// Use context for theme, locale, or component tree state
```

3. **Always unsubscribe**
```typescript
const cleanup = store.subscribe(listener);
// Later
cleanup();
```

### Developer Tools

1. **Use appropriate log levels**
```typescript
log.debug('Detailed debugging info');
log.info('General information');
log.warn('Something unexpected');
log.error('Critical error');
```

2. **Profile performance bottlenecks**
```typescript
profile.start('expensive-operation');
// ... code ...
profile.end('expensive-operation');

// Check if it's slow
const avg = profiler().getAverageDuration('expensive-operation');
if (avg > 100) {
  console.warn('Operation is slow:', avg);
}
```

3. **Disable in production**
```typescript
const isDev = process.env.NODE_ENV === 'development';
const log = logger({ 
  level: isDev ? LogLevel.DEBUG : LogLevel.ERROR 
});
```

---

## TypeScript Support

All features are fully typed:

```typescript
import { 
  createStore, 
  createContext,
  logger,
  LogLevel,
  TransitionConfig,
  AnimationConfig 
} from 'rynex';

// Type-safe store
interface UserState {
  name: string;
  age: number;
}

const store = createStore<UserState, any>(
  'user',
  { name: 'John', age: 30 },
  (state) => ({
    setName: (name: string) => state.name = name
  })
);

// Type-safe context
interface ThemeValue {
  primary: string;
  secondary: string;
}

const ThemeContext = createContext<ThemeValue>({
  primary: '#000',
  secondary: '#fff'
});
```

---

## Migration Guide

If you're upgrading from an earlier version:

### Before (Custom Implementation)
```typescript
// Manual animation
element.style.transition = 'all 300ms ease';
element.style.opacity = '0';

// Manual state management
let globalState = { count: 0 };
function updateState() { /* ... */ }

// Manual logging
console.log('[App]', 'Message');
```

### After (Using New Features)
```typescript
import { fade, createStore, log } from 'rynex';

// Built-in animation
fade(element, 'out', { duration: 300 });

// Built-in state management
const store = createStore('app', { count: 0 }, (state) => ({
  increment: () => state.count++
}));

// Built-in logging
log.info('Message');
```

---

## Examples

See the `/examples` directory for complete working examples:
- `animation-demo.html` - Animation showcase
- `store-example.html` - State management patterns
- `devtools-demo.html` - Debugging and profiling

---

## API Reference

For complete API documentation, see:
- [Animation API](./api/animations.md)
- [State Management API](./api/state-management.md)
- [DevTools API](./api/devtools.md)

---

## Support

- GitHub Issues: [Report bugs](https://github.com/razen-core/rynex/issues)
- Documentation: [Full docs](./README.md)
- Examples: [Code examples](../examples/)

---

**Last Updated:** October 21, 2025  
**Maintained By:** Razen Core Team  
**License:** Apache-2.0
