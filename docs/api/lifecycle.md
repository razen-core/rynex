# Lifecycle Hooks API

Lifecycle hooks for managing component mount, unmount, updates, and reactive watching.

## onMount

Executes a callback when an element is mounted to the DOM.

**Signature:**
```typescript
function onMount(
  element: HTMLElement,
  callback: () => void | CleanupFunction
): void
```

**Example:**
```typescript
import { onMount, div, text } from 'rynex';

const myDiv = div({}, 'Hello');

onMount(myDiv, () => {
  console.log('Element mounted!');
  
  // Optional cleanup
  return () => {
    console.log('Cleanup on unmount');
  };
});
```

**Use Cases:**
- Initialize third-party libraries
- Start animations
- Fetch data
- Set up event listeners

## onUnmount

Executes a callback when an element is removed from the DOM.

**Signature:**
```typescript
function onUnmount(
  element: HTMLElement,
  callback: CleanupFunction
): void
```

**Example:**
```typescript
import { onUnmount, div } from 'rynex';

const myDiv = div({}, 'Content');

onUnmount(myDiv, () => {
  console.log('Element unmounted!');
  // Clean up resources
});
```

**Use Cases:**
- Remove event listeners
- Cancel timers
- Clean up subscriptions
- Destroy third-party instances

## onUpdate

Executes a callback when an element's attributes or children change.

**Signature:**
```typescript
function onUpdate(
  element: HTMLElement,
  callback: (mutations: MutationRecord[]) => void
): CleanupFunction
```

**Example:**
```typescript
import { onUpdate, div, button, state } from 'rynex';

const appState = state({ count: 0 });
const myDiv = div({}, `Count: ${appState.count}`);

const cleanup = onUpdate(myDiv, (mutations) => {
  console.log('Element updated:', mutations);
});

// Later, stop watching
cleanup();
```

**Use Cases:**
- Track DOM changes
- Sync with external libraries
- Debug component updates
- Implement custom animations

## watch

Watches a reactive value and executes a callback when it changes.

**Signature:**
```typescript
function watch<T>(
  getter: () => T,
  callback: (newValue: T, oldValue: T) => void,
  options?: { immediate?: boolean }
): CleanupFunction
```

**Example:**
```typescript
import { watch, state } from 'rynex';

const appState = state({ count: 0, name: 'John' });

// Watch a single value
const cleanup = watch(
  () => appState.count,
  (newVal, oldVal) => {
    console.log(`Count changed from ${oldVal} to ${newVal}`);
  }
);

// Watch with immediate execution
watch(
  () => appState.name,
  (newVal, oldVal) => {
    console.log(`Name: ${newVal}`);
  },
  { immediate: true } // Runs immediately
);

// Cleanup when done
cleanup();
```

**Use Cases:**
- Side effects on state changes
- Sync with localStorage
- API calls on value changes
- Analytics tracking

## watchEffect

Automatically tracks dependencies and re-runs when they change.

**Signature:**
```typescript
function watchEffect(
  effectFn: EffectFunction
): CleanupFunction
```

**Example:**
```typescript
import { watchEffect, state } from 'rynex';

const appState = state({ 
  firstName: 'John',
  lastName: 'Doe'
});

const cleanup = watchEffect(() => {
  // Automatically tracks firstName and lastName
  console.log(`Full name: ${appState.firstName} ${appState.lastName}`);
  
  // Optional cleanup
  return () => {
    console.log('Effect cleanup');
  };
});

// Later
cleanup();
```

**Use Cases:**
- Computed side effects
- Automatic dependency tracking
- Complex reactive logic
- Synchronization tasks

## onError

Catches errors within a component tree.

**Signature:**
```typescript
function onError(
  element: HTMLElement,
  handler: (error: Error) => void
): void
```

**Example:**
```typescript
import { onError, div } from 'rynex';

const myComponent = div({}, 'Content');

onError(myComponent, (error) => {
  console.error('Error in component:', error);
  // Send to error tracking service
  trackError(error);
});
```

**Use Cases:**
- Error logging
- Error tracking services
- Graceful error handling
- User notifications

## Practical Examples

### Component Lifecycle
```typescript
import { div, onMount, onUnmount, state } from 'rynex';

function Timer() {
  const timerState = state({ seconds: 0 });
  const container = div({}, () => `Seconds: ${timerState.seconds}`);
  
  onMount(container, () => {
    const interval = setInterval(() => {
      timerState.seconds++;
    }, 1000);
    
    return () => clearInterval(interval);
  });
  
  return container;
}
```

### Data Fetching
```typescript
import { div, onMount, state, text } from 'rynex';

function UserProfile({ userId }: { userId: string }) {
  const profileState = state({ 
    loading: true, 
    user: null as any 
  });
  
  const container = div({}, [
    () => profileState.loading 
      ? text('Loading...') 
      : text(`User: ${profileState.user.name}`)
  ]);
  
  onMount(container, async () => {
    const user = await fetchUser(userId);
    profileState.user = user;
    profileState.loading = false;
  });
  
  return container;
}
```

### Watching Multiple Values
```typescript
import { watch, state } from 'rynex';

const formState = state({
  email: '',
  password: ''
});

// Watch form changes
watch(
  () => ({ email: formState.email, password: formState.password }),
  (newVal, oldVal) => {
    console.log('Form changed:', newVal);
    // Auto-save to localStorage
    localStorage.setItem('form', JSON.stringify(newVal));
  }
);
```

### Cleanup Pattern
```typescript
import { div, onMount, onUnmount } from 'rynex';

function WebSocketComponent() {
  const container = div({}, 'Connected');
  let ws: WebSocket;
  
  onMount(container, () => {
    ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      console.log('Message:', event.data);
    };
    
    return () => {
      ws.close();
    };
  });
  
  return container;
}
```

## Best Practices

### 1. Always Clean Up Resources
```typescript
onMount(element, () => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
});
```

### 2. Use watch for Specific Values
```typescript
// Good - watches specific value
watch(() => state.userId, (newId) => {
  fetchUserData(newId);
});

// Avoid - watches entire object
watch(() => state, (newState) => {
  // Triggers on any state change
});
```

### 3. Use watchEffect for Multiple Dependencies
```typescript
watchEffect(() => {
  // Automatically tracks all accessed values
  const fullName = `${state.firstName} ${state.lastName}`;
  document.title = fullName;
});
```

### 4. Combine Lifecycle Hooks
```typescript
const element = div({}, 'Content');

onMount(element, () => {
  console.log('Mounted');
});

onUpdate(element, () => {
  console.log('Updated');
});

onUnmount(element, () => {
  console.log('Unmounted');
});
```
