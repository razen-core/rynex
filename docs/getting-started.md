# Getting Started with Rynex

Welcome to Rynex, a modern web framework for building fast, reactive user interfaces. This guide will help you understand the core concepts and get up and running quickly.

## What is Rynex?

Rynex is a lightweight, reactive web framework that provides a collection of helper functions for building web applications. It focuses on simplicity, performance, and developer experience.

## Core Concepts

### Reactive State

Rynex uses reactive state management, which means your UI automatically updates when data changes. You don't need to manually update the DOM.

```typescript
import { state, effect } from 'rynex';

const counter = state(0);

effect(() => {
  console.log('Counter changed:', counter.value);
});

counter.value = 1; // Automatically triggers the effect
```

### Helper Functions

Rynex provides helper functions organized by category:

- **DOM Elements**: Create and manage HTML elements
- **Layout**: Build responsive layouts with flexbox and grid
- **Components**: Pre-built UI components
- **State Management**: Manage application state
- **Lifecycle**: Handle component lifecycle events
- **Performance**: Optimize your application
- **Animation**: Create smooth animations
- **Styling**: Apply styles dynamically

### Component Creation

Components are functions that return HTML elements:

```typescript
import { div, button, text } from 'rynex';

function Counter() {
  const count = state(0);
  
  return div(
    { class: 'counter' },
    text(() => `Count: ${count.value}`),
    button(
      { onClick: () => count.value++ },
      'Increment'
    )
  );
}
```

## Key Features

### Reactive Updates

Your UI stays in sync with your data automatically. No manual DOM manipulation needed.

### Type Safe

Built with TypeScript for better development experience and fewer runtime errors.

### Performance Optimized

Efficient rendering and caching ensure your application runs smoothly.

### Developer Friendly

Clear, intuitive API with comprehensive documentation and examples.

## Next Steps

1. Read the [Installation Guide](./installation.md)
2. Create your [First Project](./project-creation.md)
3. Explore [Helper Functions](./helpers/index.md)
4. Learn [Best Practices](./best-practices.md)

## Common Tasks

### Display Text

```typescript
import { text } from 'rynex';

text('Hello, World!')
```

### Create a Button

```typescript
import { button } from 'rynex';

button(
  { onClick: () => console.log('Clicked!') },
  'Click Me'
)
```

### Build a Layout

```typescript
import { vbox, hbox, div } from 'rynex';

vbox(
  { class: 'container' },
  hbox({ class: 'header' }, 'Header'),
  div({ class: 'content' }, 'Content'),
  hbox({ class: 'footer' }, 'Footer')
)
```

### Manage State

```typescript
import { state, effect } from 'rynex';

const user = state({ name: 'John', age: 30 });

effect(() => {
  console.log('User:', user.value);
});

user.value = { name: 'Jane', age: 25 };
```

## Troubleshooting

### Issue: State changes don't update the UI

Make sure you're using the state value inside a component or effect. Rynex tracks dependencies automatically.

### Issue: Performance is slow

Check if you're creating too many effects or listeners. Use memoization and caching when needed.

### Issue: TypeScript errors

Make sure you have the correct types imported. Check the helper function documentation for the correct prop types.

## Getting Help

- Check the [Helper Functions Documentation](./helpers/index.md)
- Review [Examples](./examples.md)
- Read [Best Practices](./best-practices.md)
- Check the [FAQ](./faq.md)

## What's Next?

Once you're comfortable with the basics, explore:

- Advanced state management with stores
- Creating custom components
- Performance optimization techniques
- Building real-world applications

Happy coding!
