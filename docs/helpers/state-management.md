# State Management

Global state and context management. Share data across components and manage application state.

## Functions

### createStore

Create a global reactive store.

**Usage**:
```typescript
import { createStore } from 'rynex';

const store = createStore('user', {
  name: 'John',
  age: 30
}, (state) => ({
  setName: (name) => state.name = name
}));
```

### useStore

Access a global store.

**Usage**:
```typescript
import { useStore } from 'rynex';

const store = useStore('user');
console.log(store.state.name);
```

### createContext

Create a context for component tree.

**Usage**:
```typescript
import { createContext } from 'rynex';

const ThemeContext = createContext({ primary: '#007bff' });
```

### useContext

Use context value.

**Usage**:
```typescript
import { useContext } from 'rynex';

const theme = useContext(ThemeContext);
```

### provider

Provide context to children.

**Usage**:
```typescript
import { provider } from 'rynex';

provider(contextKey, value, children);
```

### getStores

Get all registered stores.

**Usage**:
```typescript
import { getStores } from 'rynex';

const stores = getStores();
```

### removeStore

Remove a store.

**Usage**:
```typescript
import { removeStore } from 'rynex';

removeStore('user');
```

### clearStores

Clear all stores.

**Usage**:
```typescript
import { clearStores } from 'rynex';

clearStores();
```

## Common Patterns

### Global Store

```typescript
import { createStore, useStore } from 'rynex';

const store = createStore('app', {
  count: 0
}, (state) => ({
  increment: () => state.count++,
  decrement: () => state.count--
}));

// Use in component
const appStore = useStore('app');
console.log(appStore.state.count);
appStore.actions.increment();
```

### Context Provider

```typescript
import { createContext, useContext, provider } from 'rynex';

const UserContext = createContext({ name: 'Guest' });

const user = { name: 'John' };
provider(UserContext.key, user, children);

// Use in child
const currentUser = useContext(UserContext);
```

### Store Subscription

```typescript
import { createStore, useStore } from 'rynex';

const store = createStore('user', { name: 'John' });

const unsubscribe = store.subscribe(() => {
  console.log('Store updated');
});

// Later...
unsubscribe();
```

## Tips

- Use stores for global state
- Use context for component trees
- Subscribe to store changes
- Clean up subscriptions
- Keep stores organized
- Avoid prop drilling with context

## Next Steps

- Learn about [Lifecycle Hooks](./lifecycle.md)
- Explore [Components](./components.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Lifecycle Hooks](./lifecycle.md)
- [Components](./components.md)
- [Utilities](./utilities.md)
