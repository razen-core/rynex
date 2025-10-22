# Utilities

Utility functions for conditional rendering, advanced patterns, and component composition. Handle complex logic with ease.

## Functions

### fragment

Render multiple elements without a wrapper.

**Usage**:
```typescript
import { fragment, div, text } from 'rynex';

fragment(
  div({}, text('Item 1')),
  div({}, text('Item 2'))
)
```

### when

Conditionally render content.

**Usage**:
```typescript
import { when, div, text } from 'rynex';

when(isLoggedIn, () => div({}, text('Welcome!')))
```

### show

Show or hide content based on condition.

**Usage**:
```typescript
import { show, div, text } from 'rynex';

show(isVisible, div({}, text('Visible content')))
```

### each

Render array items.

**Usage**:
```typescript
import { each, li } from 'rynex';

each(items, (item) => li({}, item.name))
```

### switchCase

Conditional rendering with multiple cases.

**Usage**:
```typescript
import { switchCase, div, text } from 'rynex';

switchCase(status, {
  'active': () => div({}, text('Active')),
  'inactive': () => div({}, text('Inactive'))
})
```

### dynamic

Render component dynamically.

**Usage**:
```typescript
import { dynamic } from 'rynex';

dynamic(MyComponent, { prop: 'value' })
```

### portal

Render content in different DOM location.

**Usage**:
```typescript
import { portal, div, text } from 'rynex';

portal([div({}, text('Modal content'))], '#modal-root')
```

### css

Add CSS styles dynamically.

**Usage**:
```typescript
import { css } from 'rynex';

css('.my-class', { color: 'red', fontSize: '16px' })
```

### lazy

Lazy load components.

**Usage**:
```typescript
import { lazy } from 'rynex';

const MyComponent = lazy(() => import('./MyComponent'))
```

### suspense

Handle async components with fallback.

**Usage**:
```typescript
import { suspense, div, text } from 'rynex';

suspense(
  { fallback: div({}, text('Loading...')) },
  () => fetchComponent()
)
```

### errorBoundary

Catch and handle component errors.

**Usage**:
```typescript
import { errorBoundary, div, text } from 'rynex';

errorBoundary(
  { fallback: (error) => div({}, text('Error: ' + error.message)) },
  MyComponent
)
```

### memo

Memoize component to prevent re-renders.

**Usage**:
```typescript
import { memo } from 'rynex';

const MemoizedComponent = memo(MyComponent)
```

## Common Patterns

### Conditional Rendering

```typescript
import { when, div, text } from 'rynex';

div(
  {},
  when(isAdmin, () => div({}, text('Admin Panel'))),
  when(isUser, () => div({}, text('User Area')))
)
```

### List Rendering

```typescript
import { each, li, ul } from 'rynex';

ul(
  {},
  each(users, (user) => li({}, user.name))
)
```

### Status Display

```typescript
import { switchCase, div, text } from 'rynex';

switchCase(state, {
  'loading': () => div({}, text('Loading...')),
  'success': () => div({}, text('Success!')),
  'error': () => div({}, text('Error'))
})
```

## Tips

- Use `when` for simple conditions
- Use `switchCase` for multiple conditions
- Use `each` for rendering lists
- Use `lazy` for code splitting
- Use `suspense` for async components
- Use `errorBoundary` for error handling
- Use `memo` for performance optimization

## Next Steps

- Learn about [Components](./components.md)
- Explore [Lifecycle Hooks](./lifecycle.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Components](./components.md)
- [Lifecycle Hooks](./lifecycle.md)
- [Performance](./performance.md)
