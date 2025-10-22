# Lifecycle Hooks

Component lifecycle management. Run code at specific stages of a component's life.

## Functions

### onMount

Execute code when element mounts.

**Usage**:
```typescript
import { onMount, div } from 'rynex';

const el = div({});
onMount(el, () => {
  console.log('Element mounted');
  return () => console.log('Cleanup');
});
```

### onUnmount

Execute code when element unmounts.

**Usage**:
```typescript
import { onUnmount, div } from 'rynex';

const el = div({});
onUnmount(el, () => {
  console.log('Element unmounted');
});
```

### onUpdate

Execute code when element updates.

**Usage**:
```typescript
import { onUpdate, div } from 'rynex';

const el = div({});
onUpdate(el, (mutations) => {
  console.log('Element updated', mutations);
});
```

### watch

Watch reactive value for changes.

**Usage**:
```typescript
import { watch, state } from 'rynex';

const count = state(0);
watch(
  () => count.value,
  (newValue, oldValue) => {
    console.log('Count changed:', newValue);
  }
);
```

### watchEffect

Run effect when dependencies change.

**Usage**:
```typescript
import { watchEffect, state } from 'rynex';

const name = state('John');
watchEffect(() => {
  console.log('Name:', name.value);
});
```

### onError

Handle component errors.

**Usage**:
```typescript
import { onError, div } from 'rynex';

const el = div({});
onError(el, (error) => {
  console.error('Error:', error);
});
```

## Common Patterns

### Initialize on Mount

```typescript
import { onMount, div } from 'rynex';

const el = div({});
onMount(el, () => {
  fetch('/api/data').then(data => {
    el.textContent = data;
  });
});
```

### Cleanup on Unmount

```typescript
import { onMount, div } from 'rynex';

const el = div({});
onMount(el, () => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  return () => clearInterval(timer);
});
```

### Watch State Changes

```typescript
import { watch, state } from 'rynex';

const user = state({ name: 'John', age: 30 });
watch(
  () => user.value.name,
  (newName) => {
    console.log('Name changed to:', newName);
  }
);
```

## Tips

- Use onMount for initialization
- Use onUnmount for cleanup
- Use watch for reactive updates
- Return cleanup function from onMount
- Handle errors with onError
- Test lifecycle with different scenarios

## Next Steps

- Learn about [Components](./components.md)
- Explore [Utilities](./utilities.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Components](./components.md)
- [Utilities](./utilities.md)
- [Performance](./performance.md)
