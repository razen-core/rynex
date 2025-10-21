# Performance Utilities API

Performance optimization functions for debouncing, throttling, and resource preloading.

## debounce

Delays function execution until after a specified wait time has elapsed since the last call.

**Signature:**
```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void
```

**Example:**
```typescript
import { debounce, input } from 'rynex';

const searchAPI = debounce((query: string) => {
  console.log('Searching for:', query);
  // API call here
}, 500);

input({
  type: 'text',
  onInput: (e) => searchAPI((e.target as HTMLInputElement).value)
});
```

**Use Cases:**
- Search input
- Window resize handlers
- Auto-save functionality
- API rate limiting

## throttle

Ensures a function is called at most once per specified time period.

**Signature:**
```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void
```

**Example:**
```typescript
import { throttle } from 'rynex';

const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

**Use Cases:**
- Scroll handlers
- Mouse move tracking
- Button click prevention
- Animation frame limiting

## preload

Preloads a resource and caches it for later use.

**Signature:**
```typescript
function preload<T>(
  loader: () => Promise<T>
): Promise<T>
```

**Example:**
```typescript
import { preload } from 'rynex';

// Preload data
const dataLoader = () => fetch('/api/data').then(r => r.json());
preload(dataLoader);

// Later, use the preloaded data
const data = await dataLoader(); // Returns cached result
```

**Use Cases:**
- Prefetching route data
- Image preloading
- Component code splitting
- Resource optimization

## getPreloaded

Retrieves a previously preloaded resource from cache.

**Signature:**
```typescript
function getPreloaded<T>(
  loader: () => Promise<T>
): Promise<T> | null
```

**Example:**
```typescript
import { preload, getPreloaded } from 'rynex';

const loader = () => fetch('/api/user').then(r => r.json());

// Preload
await preload(loader);

// Get from cache
const cached = getPreloaded(loader);
if (cached) {
  const user = await cached;
  console.log('From cache:', user);
}
```

## onIdle

Executes a callback during browser idle time.

**Signature:**
```typescript
function onIdle(
  callback: () => void,
  options?: { timeout?: number }
): number
```

**Example:**
```typescript
import { onIdle, cancelIdle } from 'rynex';

const id = onIdle(() => {
  console.log('Browser is idle, running low-priority task');
  // Analytics, prefetching, etc.
}, { timeout: 2000 });

// Cancel if needed
cancelIdle(id);
```

**Use Cases:**
- Analytics tracking
- Background data sync
- Prefetching resources
- Non-critical updates

## cancelIdle

Cancels a previously scheduled idle callback.

**Signature:**
```typescript
function cancelIdle(id: number): void
```

**Example:**
```typescript
import { onIdle, cancelIdle } from 'rynex';

const id = onIdle(() => {
  // Low priority task
});

// Cancel before execution
cancelIdle(id);
```

## Practical Examples

### Search with Debounce
```typescript
import { debounce, input, div, state } from 'rynex';

function SearchComponent() {
  const searchState = state({ results: [] });
  
  const performSearch = debounce(async (query: string) => {
    if (!query) return;
    const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
    searchState.results = results;
  }, 300);
  
  return div({}, [
    input({
      type: 'search',
      placeholder: 'Search...',
      onInput: (e) => performSearch((e.target as HTMLInputElement).value)
    }),
    div({}, () => `Found ${searchState.results.length} results`)
  ]);
}
```

### Scroll Progress with Throttle
```typescript
import { throttle, div, state } from 'rynex';

function ScrollProgress() {
  const scrollState = state({ progress: 0 });
  
  const updateProgress = throttle(() => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / height) * 100;
    scrollState.progress = Math.round(progress);
  }, 100);
  
  window.addEventListener('scroll', updateProgress);
  
  return div({
    style: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: () => `${scrollState.progress}%`,
      height: '4px',
      background: '#00ff88'
    }
  });
}
```

### Route Preloading
```typescript
import { preload, lazy } from 'rynex';

const Dashboard = lazy(() => import('./Dashboard.js'));
const Settings = lazy(() => import('./Settings.js'));

// Preload on hover
button({
  onMouseEnter: () => preload(() => import('./Dashboard.js')),
  onClick: () => {
    // Already preloaded, loads instantly
    navigateTo('/dashboard');
  }
}, 'Go to Dashboard');
```

### Idle Time Analytics
```typescript
import { onIdle } from 'rynex';

onIdle(() => {
  // Send analytics when browser is idle
  sendAnalytics({
    page: window.location.pathname,
    duration: getSessionDuration(),
    interactions: getInteractionCount()
  });
}, { timeout: 5000 });
```

## Performance Comparison

### Debounce vs Throttle

```typescript
// Debounce: Waits for quiet period
const debouncedFn = debounce(() => {
  console.log('Called after 500ms of no calls');
}, 500);

// Rapid calls: only last one executes after 500ms
debouncedFn(); // Cancelled
debouncedFn(); // Cancelled
debouncedFn(); // Executes after 500ms

// Throttle: Limits rate
const throttledFn = throttle(() => {
  console.log('Called at most once per 500ms');
}, 500);

// Rapid calls: first executes, others ignored for 500ms
throttledFn(); // Executes immediately
throttledFn(); // Ignored
throttledFn(); // Ignored
// After 500ms, next call will execute
```

## Best Practices

### 1. Choose the Right Tool
```typescript
// Use debounce for: search, auto-save, resize
const search = debounce(searchFn, 300);

// Use throttle for: scroll, mousemove, animation
const scroll = throttle(scrollFn, 100);
```

### 2. Preload Critical Resources
```typescript
// Preload next route on current route load
onMount(currentRoute, () => {
  preload(() => import('./NextRoute.js'));
});
```

### 3. Use Idle Time Wisely
```typescript
// Non-critical tasks in idle time
onIdle(() => {
  prefetchImages();
  warmupCache();
  sendAnalytics();
});
```

### 4. Clean Up Event Listeners
```typescript
const handleResize = debounce(() => {
  // Handle resize
}, 200);

window.addEventListener('resize', handleResize);

// Clean up
onUnmount(element, () => {
  window.removeEventListener('resize', handleResize);
});
```
