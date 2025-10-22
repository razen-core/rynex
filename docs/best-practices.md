# Best Practices

Guidelines and recommendations for building high-quality Rynex applications.

## Importing Helpers

### Import All Helpers as UI Namespace

Import all helpers with a namespace for clean, organized code:

```typescript
import * as UI from 'rynex';

// Use helpers with UI prefix
const app = UI.vbox(
  { style: { height: '100vh' } },
  UI.header({}, UI.h1({}, UI.text('My App'))),
  UI.main({}, UI.text('Content')),
  UI.footer({}, UI.text('Footer'))
);

document.body.appendChild(app);
```

### Benefits of Namespace Import

- **Clear Origin**: Immediately see which functions come from Rynex
- **Auto-completion**: IDE suggests all available helpers
- **Organized Code**: Consistent naming convention
- **Avoid Conflicts**: No naming conflicts with other libraries
- **Maintainability**: Easy to understand dependencies

### Example: Complete App with Namespace

```typescript
import * as UI from 'rynex';

const count = UI.state(0);

const app = UI.vbox(
  { style: { padding: '2rem', textAlign: 'center' } },
  UI.h1({}, UI.text('Counter App')),
  UI.text(() => `Count: ${count.value}`),
  UI.hbox(
    { gap: '1rem', justifyContent: 'center' },
    UI.button(
      { onClick: () => count.value++ },
      UI.text('Increment')
    ),
    UI.button(
      { onClick: () => count.value-- },
      UI.text('Decrement')
    )
  )
);

document.body.appendChild(app);
```

### Selective Imports (Alternative)

If you prefer, import only what you need:

```typescript
import { vbox, hbox, button, text, state } from 'rynex';

const count = state(0);

const app = vbox(
  {},
  text(() => `Count: ${count.value}`),
  button({ onClick: () => count.value++ }, 'Increment')
);
```

---

## Code Organization

### Project Structure

Organize your project logically:

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── helpers/            # Custom helper functions
├── styles/             # Global styles
├── utils/              # Utility functions
├── stores/             # Global state stores
└── index.ts            # Entry point
```

### Component Organization

Keep components focused and single-purpose:

```typescript
import * as UI from 'rynex';

// Good - Single responsibility
const UserCard = (user) => UI.card(
  {},
  UI.h3({}, UI.text(user.name)),
  UI.p({}, UI.text(user.email))
);

const UserList = (users) => UI.list({
  items: users,
  renderItem: UserCard
});

// Avoid - Multiple responsibilities
const UserComponent = (user, onDelete, onEdit) => {
  // Too many concerns
};
```

---

## State Management

### Use Reactive State

Prefer reactive state over manual updates:

```typescript
import * as UI from 'rynex';

// Good - Reactive
const count = UI.state(0);
UI.text(() => `Count: ${count.value}`);
count.value++;

// Avoid - Manual DOM updates
let count = 0;
const el = UI.text('Count: 0');
count++;
el.textContent = 'Count: 1';
```

### Global vs Local State

Use appropriate state scope:

```typescript
import * as UI from 'rynex';

// Good - Local state for component
const isOpen = UI.state(false);
const modal = UI.modal({ open: isOpen.value });

// Good - Global state for app data
const store = UI.createStore('user', { name: 'John' });
```

### Store Pattern

Create stores for shared application state:

```typescript
import * as UI from 'rynex';

// Create store
const userStore = UI.createStore('user', 
  { name: 'John', email: 'john@example.com' },
  (state) => ({
    setName: (name) => state.name = name,
    setEmail: (email) => state.email = email
  })
);

// Use store
const store = UI.useStore('user');
console.log(store.state.name);
store.actions.setName('Jane');
```

---

## Performance

### Optimize Rendering

Use memoization and lazy loading:

```typescript
import * as UI from 'rynex';

// Good - Memoized component
const MemoizedList = UI.memo(UserList);

// Good - Lazy loaded component
const HeavyComponent = UI.lazy(() => import('./Heavy'));
```

### Debounce and Throttle

Use for frequent events:

```typescript
import * as UI from 'rynex';

// Good - Debounced search
const search = UI.debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

UI.input({ onInput: (e) => search(e.target.value) });

// Good - Throttled scroll
const handleScroll = UI.throttle(() => {
  console.log('Scrolling');
}, 1000);

window.addEventListener('scroll', handleScroll);
```

### Lazy Load Images

Use lazy loading for images:

```typescript
import * as UI from 'rynex';

// Good - Lazy loaded image
UI.image({
  src: '/large-image.jpg',
  alt: 'Image',
  lazy: true
});
```

---

## Accessibility

### Semantic HTML

Always use semantic elements:

```typescript
import * as UI from 'rynex';

// Good - Semantic
UI.header({}, UI.h1({}, 'Title'));
UI.main({}, UI.article({}, 'Content'));
UI.footer({}, 'Footer');

// Avoid - Non-semantic
UI.div({ class: 'header' }, UI.div({ class: 'title' }, 'Title'));
```

### Labels and ARIA

Provide proper labels:

```typescript
import * as UI from 'rynex';

// Good - Labeled input
UI.label({ htmlFor: 'email' }, 'Email'),
UI.input({ id: 'email', type: 'email' });

// Good - ARIA attributes
UI.button({ 'aria-label': 'Close menu' }, '×');
```

### Keyboard Navigation

Ensure keyboard accessibility:

```typescript
import * as UI from 'rynex';

// Good - Keyboard accessible
UI.button({
  onClick: handleClick,
  onKeyPress: (e) => {
    if (e.key === 'Enter') handleClick();
  }
}, 'Click');
```

---

## Styling

### Use CSS Classes

Prefer classes over inline styles:

```typescript
import * as UI from 'rynex';

// Good - CSS classes
UI.div({ class: 'card card-primary' });

// Acceptable - Inline for dynamic styles
UI.div({ style: { color: isDark ? '#000' : '#fff' } });
```

### Consistent Naming

Use consistent class naming:

```typescript
import * as UI from 'rynex';

// Good - BEM naming
UI.div({ class: 'card card--active card__header' });

// Good - Utility classes
UI.div({ class: 'p-4 bg-blue-500 rounded' });
```

### Theme Management

Use theme helpers for consistent styling:

```typescript
import * as UI from 'rynex';

// Set theme
UI.setTheme({
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745'
});

// Use theme
const theme = UI.getTheme();
UI.div({ style: { color: theme.primary } });
```

---

## Error Handling

### Use Error Boundaries

Catch and handle errors gracefully:

```typescript
import * as UI from 'rynex';

const app = UI.errorBoundary(
  {
    fallback: (error) => UI.div(
      {},
      UI.h2({}, UI.text('Something went wrong')),
      UI.p({}, UI.text(error.message))
    )
  },
  MyComponent
);
```

### Lifecycle Error Handling

Handle errors in lifecycle hooks:

```typescript
import * as UI from 'rynex';

const el = UI.div({});

UI.onError(el, (error) => {
  console.error('Component error:', error);
});
```

---

## Forms

### Form Validation

Validate form data before submission:

```typescript
import * as UI from 'rynex';

const formData = { email: '', password: '' };

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!formData.email.includes('@')) {
    console.error('Invalid email');
    return;
  }
  
  if (formData.password.length < 8) {
    console.error('Password too short');
    return;
  }
  
  // Submit form
};

const form = UI.form(
  { onSubmit: handleSubmit },
  UI.input({
    type: 'email',
    onInput: (e) => formData.email = e.target.value
  }),
  UI.input({
    type: 'password',
    onInput: (e) => formData.password = e.target.value
  }),
  UI.button({ type: 'submit' }, 'Submit')
);
```

### Accessible Forms

Make forms accessible:

```typescript
import * as UI from 'rynex';

const form = UI.form(
  {},
  UI.fieldset(
    {},
    UI.legend({}, 'Contact Information'),
    UI.label({ htmlFor: 'name' }, 'Name'),
    UI.input({ id: 'name', required: true }),
    UI.label({ htmlFor: 'email' }, 'Email'),
    UI.input({ id: 'email', type: 'email', required: true })
  )
);
```

---

## Lists and Tables

### Dynamic Lists

Render lists efficiently:

```typescript
import * as UI from 'rynex';

const items = UI.state([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

const list = UI.list({
  items: items.value,
  renderItem: (item) => UI.li({}, UI.text(item.name)),
  keyExtractor: (item) => item.id
});
```

### Data Tables

Create structured data tables:

```typescript
import * as UI from 'rynex';

const data = [
  { id: 1, name: 'John', role: 'Developer' },
  { id: 2, name: 'Jane', role: 'Designer' }
];

const table = UI.table(
  {},
  UI.thead(
    {},
    UI.tr({},
      UI.th({}, 'ID'),
      UI.th({}, 'Name'),
      UI.th({}, 'Role')
    )
  ),
  UI.tbody(
    {},
    ...data.map(row => UI.tr({},
      UI.td({}, UI.text(String(row.id))),
      UI.td({}, UI.text(row.name)),
      UI.td({}, UI.text(row.role))
    ))
  )
);
```

---

## Animations

### Smooth Transitions

Use animations for better UX:

```typescript
import * as UI from 'rynex';

const el = UI.div({});

// Fade in animation
UI.fade(el, 'in', { duration: 500 });

// Slide animation
UI.slide(el, 'down', { duration: 400 });

// Custom animation
UI.animate(el, {
  keyframes: [
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ],
  duration: 600
});
```

### Animation Best Practices

- Keep animations short (200-500ms)
- Use `ease-out` for entering animations
- Use `ease-in` for exiting animations
- Avoid animating too many elements
- Test on different devices

---

## Testing

### Component Testing

Test components in isolation:

```typescript
import * as UI from 'rynex';

// Test counter component
const count = UI.state(0);
const button = UI.button(
  { onClick: () => count.value++ },
  'Increment'
);

// Simulate click
button.click();
console.assert(count.value === 1, 'Counter should increment');
```

### State Testing

Test state management:

```typescript
import * as UI from 'rynex';

const store = UI.createStore('test', { value: 0 });
store.state.value = 5;
console.assert(store.state.value === 5, 'State should update');
```

---

## Performance Monitoring

### Use DevTools

Monitor application performance:

```typescript
import * as UI from 'rynex';

// Initialize devtools
UI.devtools({ enabled: true });

// Log events
UI.log.info('Application started');
UI.log.warn('Deprecated API used');
UI.log.error('Error occurred');

// Profile code
UI.profile.start('operation');
// ... do something ...
UI.profile.end('operation');
```

---

## Common Patterns

### Modal Dialog

```typescript
import * as UI from 'rynex';

const isOpen = UI.state(false);

const modal = UI.modal(
  { open: isOpen.value, onClose: () => isOpen.value = false },
  UI.h2({}, 'Confirm'),
  UI.p({}, 'Are you sure?'),
  UI.button({ onClick: () => isOpen.value = false }, 'Close')
);
```

### Dropdown Menu

```typescript
import * as UI from 'rynex';

const menu = UI.dropdown(
  {
    items: [
      { label: 'Edit', onClick: () => console.log('Edit') },
      { label: 'Delete', onClick: () => console.log('Delete') }
    ]
  },
  UI.button({}, 'Menu')
);
```

### Loading State

```typescript
import * as UI from 'rynex';

const isLoading = UI.state(true);

const content = UI.when(
  isLoading.value,
  () => UI.spinner({ size: '40px' }),
  () => UI.text('Content loaded')
);
```

---

## Tips for Success

- Use namespace import (`import * as UI`) for clean code
- Keep components small and focused
- Use reactive state for dynamic content
- Leverage helper functions for common patterns
- Test components thoroughly
- Monitor performance with devtools
- Follow accessibility guidelines
- Use semantic HTML elements
- Keep styling organized
- Document complex logic

---

## Next Steps

- Explore [Examples](./examples.md) for code samples
- Check [Helper Functions](./helpers/index.md) for available functions
- Read [Getting Started](./getting-started.md) for core concepts
