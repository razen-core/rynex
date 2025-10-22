# Frequently Asked Questions

Common questions and answers about Rynex development.

## Getting Started

### Q: How do I create my first Rynex project?

**A:** Use the interactive CLI:

```bash
npx rynex init
```

Follow the prompts to choose your template (empty, minimal, or routed) and language (TypeScript or JavaScript).

### Q: What's the difference between the templates?

**A:** 
- **Empty**: Minimal setup, perfect for learning
- **Minimal**: Single page with components and state management
- **Routed**: Multi-page app with file-based routing

### Q: Do I need TypeScript?

**A:** No, but it's recommended for better type safety and IDE support. JavaScript is also supported.

---

## Importing and Usage

### Q: How should I import helpers?

**A:** Use namespace import for clean code:

```typescript
import * as UI from 'rynex';

const app = UI.vbox(
  {},
  UI.h1({}, UI.text('Hello'))
);
```

Or import specific helpers:

```typescript
import { vbox, h1, text } from 'rynex';

const app = vbox(
  {},
  h1({}, text('Hello'))
);
```

### Q: What's the difference between `text()` and `div()`?

**A:** 
- `text()`: Creates a `<span>` for text content, supports reactive updates
- `div()`: Creates a `<div>` container for grouping elements

### Q: How do I add CSS classes?

**A:** Use the `class` property:

```typescript
import * as UI from 'rynex';

UI.div({ class: 'container primary' });
```

---

## State Management

### Q: How do I create reactive state?

**A:** Use the `state()` function:

```typescript
import * as UI from 'rynex';

const count = UI.state(0);
count.value++; // Update state
```

### Q: How do I watch state changes?

**A:** Use the `watch()` function:

```typescript
import * as UI from 'rynex';

const name = UI.state('John');

UI.watch(
  () => name.value,
  (newValue) => console.log('Name changed:', newValue)
);
```

### Q: How do I create a global store?

**A:** Use `createStore()`:

```typescript
import * as UI from 'rynex';

const store = UI.createStore('user', 
  { name: 'John' },
  (state) => ({
    setName: (name) => state.name = name
  })
);

const userStore = UI.useStore('user');
```

### Q: How do I share state between components?

**A:** Use global stores or context:

```typescript
import * as UI from 'rynex';

// Global store
const appStore = UI.createStore('app', { theme: 'light' });

// Or use context
const ThemeContext = UI.createContext({ theme: 'light' });
```

---

## Forms

### Q: How do I handle form submission?

**A:** Use the `form` element with `onSubmit`:

```typescript
import * as UI from 'rynex';

const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form submitted');
};

UI.form(
  { onSubmit: handleSubmit },
  UI.input({ type: 'text' }),
  UI.button({ type: 'submit' }, 'Submit')
);
```

### Q: How do I validate form inputs?

**A:** Check values in the submit handler:

```typescript
import * as UI from 'rynex';

const formData = { email: '' };

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!formData.email.includes('@')) {
    console.error('Invalid email');
    return;
  }
  
  // Submit
};
```

### Q: How do I get input values?

**A:** Use `onInput` or `onChange` handlers:

```typescript
import * as UI from 'rynex';

const inputValue = UI.state('');

UI.input({
  onInput: (e) => inputValue.value = e.target.value
});
```

---

## Styling

### Q: How do I apply inline styles?

**A:** Use the `style` property:

```typescript
import * as UI from 'rynex';

UI.div({
  style: {
    color: 'red',
    fontSize: '16px',
    padding: '1rem'
  }
});
```

### Q: How do I use CSS variables?

**A:** Use `setCSSVariable()` and `getCSSVariable()`:

```typescript
import * as UI from 'rynex';

UI.setCSSVariable('--primary-color', '#007bff');
const color = UI.getCSSVariable('--primary-color');
```

### Q: How do I switch themes?

**A:** Use `setTheme()`:

```typescript
import * as UI from 'rynex';

UI.setTheme({
  primary: '#007bff',
  secondary: '#6c757d'
});
```

---

## Animations

### Q: How do I add animations?

**A:** Use animation helpers:

```typescript
import * as UI from 'rynex';

const el = UI.div({});

// Fade in
UI.fade(el, 'in', { duration: 500 });

// Slide
UI.slide(el, 'down', { duration: 400 });

// Custom animation
UI.animate(el, {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  duration: 300
});
```

### Q: How do I animate on mount?

**A:** Use `onMount()` with animation:

```typescript
import * as UI from 'rynex';

const el = UI.div({});

UI.onMount(el, () => {
  UI.fade(el, 'in', { duration: 500 });
});
```

---

## Performance

### Q: How do I debounce function calls?

**A:** Use `debounce()`:

```typescript
import * as UI from 'rynex';

const search = UI.debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

UI.input({ onInput: (e) => search(e.target.value) });
```

### Q: How do I throttle events?

**A:** Use `throttle()`:

```typescript
import * as UI from 'rynex';

const handleScroll = UI.throttle(() => {
  console.log('Scrolling');
}, 1000);

window.addEventListener('scroll', handleScroll);
```

### Q: How do I lazy load components?

**A:** Use `lazy()`:

```typescript
import * as UI from 'rynex';

const HeavyComponent = UI.lazy(() => import('./Heavy'));
```

---

## Routing

### Q: How do I create navigation links?

**A:** Use `Link` or `NavLink`:

```typescript
import * as UI from 'rynex';

UI.Link({ to: '/about' }, 'About');
UI.NavLink({ to: '/home', activeClass: 'active' }, 'Home');
```

### Q: How do I protect routes?

**A:** Use `RouteGuard`:

```typescript
import * as UI from 'rynex';

UI.RouteGuard(
  (ctx) => ctx.user.isAdmin,
  AdminPanel,
  LoginPage
);
```

---

## Debugging

### Q: How do I debug my application?

**A:** Use devtools and logging:

```typescript
import * as UI from 'rynex';

// Initialize devtools
UI.devtools({ enabled: true });

// Log messages
UI.log.info('Info message');
UI.log.warn('Warning message');
UI.log.error('Error message');
```

### Q: How do I profile performance?

**A:** Use the profiler:

```typescript
import * as UI from 'rynex';

UI.profile.start('operation');
// ... do something ...
UI.profile.end('operation');
```

---

## Accessibility

### Q: How do I make my app accessible?

**A:** Follow these guidelines:

- Use semantic HTML elements
- Provide labels for form inputs
- Add ARIA attributes where needed
- Ensure keyboard navigation
- Use sufficient color contrast
- Test with screen readers

### Q: How do I add labels to inputs?

**A:** Use the `label` element:

```typescript
import * as UI from 'rynex';

UI.label({ htmlFor: 'email' }, 'Email'),
UI.input({ id: 'email', type: 'email' });
```

---

## Common Issues

### Q: My state isn't updating the UI

**A:** Make sure you're using reactive state:

```typescript
import * as UI from 'rynex';

// Good - Reactive
const count = UI.state(0);
UI.text(() => `Count: ${count.value}`);
count.value++; // Updates UI

// Wrong - Not reactive
let count = 0;
UI.text(`Count: ${count}`);
count++; // Doesn't update UI
```

### Q: My component isn't rendering

**A:** Make sure to append it to the DOM:

```typescript
import * as UI from 'rynex';

const app = UI.div({}, UI.text('Hello'));
document.body.appendChild(app); // Don't forget this!
```

### Q: My styles aren't applying

**A:** Check class names and CSS:

```typescript
import * as UI from 'rynex';

// Make sure CSS exists
UI.div({ class: 'my-class' }); // CSS: .my-class { color: red; }
```

### Q: My form isn't submitting

**A:** Use `type="submit"` on button:

```typescript
import * as UI from 'rynex';

UI.form(
  { onSubmit: handleSubmit },
  UI.button({ type: 'submit' }, 'Submit') // type="submit" required
);
```

---

## Best Practices

### Q: Should I use namespace imports?

**A:** Yes, it's recommended:

```typescript
import * as UI from 'rynex';

// Clear, organized code
UI.vbox({}, UI.text('Hello'));
```

### Q: How should I organize my code?

**A:** Use this structure:

```
src/
├── components/
├── pages/
├── stores/
├── styles/
└── index.ts
```

### Q: When should I use global state?

**A:** Use for app-wide data:

- User information
- Theme settings
- Authentication state
- Global UI state

Use local state for component-specific data.

---

## Getting Help

### Q: Where can I find more information?

**A:** Check these resources:

- [Getting Started](./getting-started.md) - Core concepts
- [Helper Functions](./helpers/index.md) - All available functions
- [Examples](./examples.md) - Code samples
- [Best Practices](./best-practices.md) - Development tips

### Q: How do I report bugs?

**A:** Open an issue on GitHub:
- [Rynex GitHub](https://github.com/razen-core/rynex)

### Q: How do I contribute?

**A:** See the contributing guide on GitHub for guidelines.

---

## Tips

- Start with simple examples
- Use TypeScript for better IDE support
- Keep components small and focused
- Use reactive state for dynamic content
- Test your code thoroughly
- Monitor performance with devtools
- Follow accessibility guidelines
- Read the helper documentation
- Check examples for patterns
- Ask questions in the community

---

## Next Steps

- Explore [Examples](./examples.md)
- Read [Best Practices](./best-practices.md)
- Check [Helper Functions](./helpers/index.md)
- Visit [Getting Started](./getting-started.md)
