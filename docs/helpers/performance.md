# Performance

Performance optimization utilities. Improve application speed and responsiveness.

## Functions

### debounce

Delay function execution until after wait time.

**Usage**:
```typescript
import { debounce, input } from 'rynex';

const handleSearch = debounce((query) => {
  console.log('Search:', query);
}, 300);

input({ onInput: (e) => handleSearch(e.target.value) })
```

### throttle

Limit function execution frequency.

**Usage**:
```typescript
import { throttle } from 'rynex';

const handleScroll = throttle(() => {
  console.log('Scrolling');
}, 1000);

window.addEventListener('scroll', handleScroll);
```

### preload

Preload resources in advance.

**Usage**:
```typescript
import { preload } from 'rynex';

preload(() => import('./HeavyComponent'));
```

### getPreloaded

Get previously preloaded resource.

**Usage**:
```typescript
import { getPreloaded } from 'rynex';

const component = getPreloaded(() => import('./Component'));
```

### onIdle

Execute during browser idle time.

**Usage**:
```typescript
import { onIdle } from 'rynex';

onIdle(() => {
  console.log('Browser is idle');
});
```

### cancelIdle

Cancel idle callback.

**Usage**:
```typescript
import { onIdle, cancelIdle } from 'rynex';

const id = onIdle(() => {
  console.log('Idle');
});

cancelIdle(id);
```

## Common Patterns

### Search Input

```typescript
import { debounce, input } from 'rynex';

const search = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 500);

input({
  type: 'search',
  onInput: (e) => search(e.target.value)
})
```

### Window Resize

```typescript
import { throttle } from 'rynex';

const handleResize = throttle(() => {
  console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);
```

### Lazy Load Components

```typescript
import { preload } from 'rynex';

preload(() => import('./HeavyComponent'));

// Later...
const Component = await getPreloaded(() => import('./HeavyComponent'));
```

## Tips

- Use debounce for search inputs
- Use throttle for scroll/resize events
- Use preload for heavy components
- Use onIdle for non-critical tasks
- Test performance improvements
- Monitor bundle size

## Next Steps

- Learn about [Lifecycle Hooks](./lifecycle.md)
- Explore [Utilities](./utilities.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Lifecycle Hooks](./lifecycle.md)
- [Utilities](./utilities.md)
- [Components](./components.md)
