# Utility Functions API

Utility functions for conditional rendering, lazy loading, error handling, and more.

## lazy

Lazy load a component for code splitting and performance optimization.

**Signature:**
```typescript
function lazy<T>(
  loader: () => Promise<{ default: T }>
): () => Promise<T>
```

**Example:**
```typescript
import { lazy, suspense, div } from 'rynex';

const HeavyComponent = lazy(() => 
  import('./HeavyComponent.js')
);

// Use with suspense
suspense(
  {
    fallback: div({}, 'Loading...'),
  },
  async () => {
    const Component = await HeavyComponent();
    return Component();
  }
);
```

## suspense

Shows fallback content while async content is loading.

**Signature:**
```typescript
function suspense(
  props: {
    fallback: HTMLElement;
    onError?: (error: Error) => void;
  },
  children: () => Promise<HTMLElement> | HTMLElement
): HTMLElement
```

**Example:**
```typescript
import { suspense, div, text } from 'rynex';

suspense(
  {
    fallback: div({ class: 'loading' }, 'Loading...'),
    onError: (error) => console.error('Failed to load:', error)
  },
  async () => {
    const data = await fetchData();
    return div({}, text(data.message));
  }
);
```

## errorBoundary

Catches errors in child components and displays fallback UI.

**Signature:**
```typescript
function errorBoundary(
  props: {
    fallback: (error: Error) => HTMLElement;
    onError?: (error: Error) => void;
  },
  children: HTMLElement | (() => HTMLElement)
): HTMLElement
```

**Example:**
```typescript
import { errorBoundary, div, text } from 'rynex';

errorBoundary(
  {
    fallback: (error) => div({ class: 'error' }, [
      text('Something went wrong:'),
      text(error.message)
    ]),
    onError: (error) => {
      console.error('Error caught:', error);
      // Send to error tracking service
    }
  },
  () => {
    // Component that might throw
    return MyComponent();
  }
);
```

## memo

Memoizes a component to prevent unnecessary re-renders.

**Signature:**
```typescript
function memo<P extends Record<string, any>>(
  component: (props: P) => HTMLElement,
  areEqual?: (prevProps: P, nextProps: P) => boolean
): (props: P) => HTMLElement
```

**Example:**
```typescript
import { memo, div, text } from 'rynex';

const ExpensiveComponent = memo((props: { value: number }) => {
  console.log('Rendering...'); // Only logs when value changes
  return div({}, text(`Value: ${props.value}`));
});

// Usage
ExpensiveComponent({ value: 10 });
ExpensiveComponent({ value: 10 }); // Skips render, uses cached
ExpensiveComponent({ value: 20 }); // Re-renders
```

**Custom Equality:**
```typescript
const MemoizedComponent = memo(
  (props) => div({}, text(props.user.name)),
  (prev, next) => prev.user.id === next.user.id
);
```

## fragment

Renders children without a wrapper element.

**Signature:**
```typescript
function fragment(...children: DOMChildren[]): HTMLElement[]
```

**Example:**
```typescript
import { fragment, div, text } from 'rynex';

div({}, fragment(
  text('First'),
  text('Second'),
  text('Third')
));
```

## when

Conditional rendering helper.

**Signature:**
```typescript
function when(
  condition: boolean,
  content: () => HTMLElement | DOMChildren
): HTMLElement | null
```

**Example:**
```typescript
import { when, div, text, state } from 'rynex';

const appState = state({ isLoggedIn: false });

div({}, [
  when(appState.isLoggedIn, () => 
    text('Welcome back!')
  ),
  when(!appState.isLoggedIn, () => 
    text('Please log in')
  )
]);
```

## show

Shows or hides content based on condition with reactive support.

**Signature:**
```typescript
function show(
  condition: boolean | (() => boolean),
  content: HTMLElement
): HTMLElement
```

**Example:**
```typescript
import { show, div, text, state } from 'rynex';

const appState = state({ visible: true });

show(
  () => appState.visible,
  div({}, 'This content toggles')
);
```

## each

Iterates over an array and renders items.

**Signature:**
```typescript
function each<T>(
  items: T[],
  renderFn: (item: T, index: number) => HTMLElement,
  keyFn?: (item: T, index: number) => string | number
): HTMLElement[]
```

**Example:**
```typescript
import { each, div, text } from 'rynex';

const items = ['Apple', 'Banana', 'Orange'];

div({}, each(
  items,
  (item, index) => div({}, text(`${index + 1}. ${item}`)),
  (item) => item // key function
));
```

## switchCase

Switch-case style rendering.

**Signature:**
```typescript
function switchCase<T>(
  value: T,
  cases: Record<string, () => HTMLElement>,
  defaultCase?: () => HTMLElement
): HTMLElement | null
```

**Example:**
```typescript
import { switchCase, div, text, state } from 'rynex';

const appState = state({ status: 'loading' });

switchCase(
  appState.status,
  {
    loading: () => div({}, 'Loading...'),
    success: () => div({}, 'Success!'),
    error: () => div({}, 'Error occurred')
  },
  () => div({}, 'Unknown status')
);
```

## dynamic

Renders a component dynamically based on type.

**Signature:**
```typescript
function dynamic(
  component: Function | string,
  props: any,
  ...children: DOMChildren[]
): HTMLElement
```

**Example:**
```typescript
import { dynamic, div } from 'rynex';

const componentType = 'div'; // or a function
dynamic(componentType, { class: 'container' }, 'Content');
```

## portal

Renders content in a different DOM location.

**Signature:**
```typescript
function portal(
  children: DOMChildren[],
  target: string | HTMLElement
): HTMLElement
```

**Example:**
```typescript
import { portal, div, text } from 'rynex';

// Render to body
portal(
  [div({}, text('Modal content'))],
  document.body
);

// Render to selector
portal(
  [div({}, text('Sidebar content'))],
  '#sidebar'
);
```

## css

Adds styles to a global stylesheet.

**Signature:**
```typescript
function css(
  selector: string,
  styles: Partial<CSSStyleDeclaration> | string
): void
```

**Example:**
```typescript
import { css } from 'rynex';

// Object syntax
css('.my-class', {
  color: 'red',
  fontSize: '16px',
  fontWeight: 'bold'
});

// String syntax
css('.my-class', 'color: red; font-size: 16px;');
```

## Best Practices

### 1. Use lazy for Code Splitting
```typescript
// Split large components
const Dashboard = lazy(() => import('./Dashboard.js'));
const Settings = lazy(() => import('./Settings.js'));
```

### 2. Combine suspense with lazy
```typescript
suspense(
  { fallback: div({}, 'Loading...') },
  async () => {
    const Component = await lazyComponent();
    return Component();
  }
);
```

### 3. Use errorBoundary at Route Level
```typescript
errorBoundary(
  {
    fallback: (error) => ErrorPage({ error }),
    onError: (error) => logError(error)
  },
  () => RouteComponent()
);
```

### 4. Memoize Expensive Components
```typescript
const HeavyList = memo((props) => {
  // Expensive rendering logic
  return div({}, props.items.map(renderItem));
});
```
