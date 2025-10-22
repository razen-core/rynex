# Examples

Real-world code examples demonstrating common patterns and use cases in Rynex applications.

## Basic Counter App

```typescript
import { div, button, text, state } from 'rynex';

const count = state(0);

const app = div(
  { style: { textAlign: 'center', padding: '2rem' } },
  text(() => `Count: ${count.value}`),
  button(
    { onClick: () => count.value++, style: { marginLeft: '1rem' } },
    'Increment'
  ),
  button(
    { onClick: () => count.value--, style: { marginLeft: '0.5rem' } },
    'Decrement'
  )
);

document.body.appendChild(app);
```

## Todo List Application

```typescript
import { div, input, button, ul, li, text, state } from 'rynex';

const todos = state([]);
const inputValue = state('');

const addTodo = () => {
  if (inputValue.value.trim()) {
    todos.value = [...todos.value, { id: Date.now(), text: inputValue.value }];
    inputValue.value = '';
  }
};

const removeTodo = (id) => {
  todos.value = todos.value.filter(todo => todo.id !== id);
};

const app = div(
  { style: { maxWidth: '500px', margin: '0 auto', padding: '2rem' } },
  div(
    { style: { marginBottom: '1rem' } },
    input({
      type: 'text',
      placeholder: 'Add a todo...',
      value: inputValue.value,
      onInput: (e) => inputValue.value = e.target.value,
      onKeyPress: (e) => e.key === 'Enter' && addTodo()
    }),
    button({ onClick: addTodo, style: { marginLeft: '0.5rem' } }, 'Add')
  ),
  ul(
    {},
    ...todos.value.map(todo =>
      li(
        { style: { marginBottom: '0.5rem' } },
        text(todo.text),
        button(
          { onClick: () => removeTodo(todo.id), style: { marginLeft: '1rem' } },
          'Delete'
        )
      )
    )
  )
);

document.body.appendChild(app);
```

## User Profile Card

```typescript
import { card, avatar, h2, p, badge, hbox, vbox, text } from 'rynex';

const userCard = card(
  {},
  hbox(
    { gap: '1rem' },
    avatar({ src: '/user.jpg', size: '80px' }),
    vbox(
      {},
      h2({}, text('John Doe')),
      p({}, text('Full Stack Developer')),
      hbox(
        { gap: '0.5rem' },
        badge({ variant: 'success' }, text('Active')),
        badge({ variant: 'primary' }, text('Verified'))
      )
    )
  )
);

document.body.appendChild(userCard);
```

## Form with Validation

```typescript
import { form, label, input, textarea, button, div, text } from 'rynex';

const formData = {
  name: '',
  email: '',
  message: ''
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (formData.name && formData.email && formData.message) {
    console.log('Form submitted:', formData);
    // Reset form
    formData.name = '';
    formData.email = '';
    formData.message = '';
  }
};

const contactForm = form(
  { onSubmit: handleSubmit },
  div(
    { style: { marginBottom: '1rem' } },
    label({ htmlFor: 'name' }, 'Name'),
    input({
      id: 'name',
      type: 'text',
      required: true,
      onInput: (e) => formData.name = e.target.value
    })
  ),
  div(
    { style: { marginBottom: '1rem' } },
    label({ htmlFor: 'email' }, 'Email'),
    input({
      id: 'email',
      type: 'email',
      required: true,
      onInput: (e) => formData.email = e.target.value
    })
  ),
  div(
    { style: { marginBottom: '1rem' } },
    label({ htmlFor: 'message' }, 'Message'),
    textarea({
      id: 'message',
      rows: 5,
      onInput: (e) => formData.message = e.target.value
    })
  ),
  button({ type: 'submit' }, 'Send')
);

document.body.appendChild(contactForm);
```

## Data Table

```typescript
import { table, thead, tbody, tr, th, td, caption, text } from 'rynex';

const data = [
  { id: 1, name: 'John', role: 'Developer', salary: '$80,000' },
  { id: 2, name: 'Jane', role: 'Designer', salary: '$70,000' },
  { id: 3, name: 'Bob', role: 'Manager', salary: '$90,000' }
];

const dataTable = table(
  {},
  caption({}, text('Employee Data')),
  thead(
    {},
    tr({},
      th({}, text('ID')),
      th({}, text('Name')),
      th({}, text('Role')),
      th({}, text('Salary'))
    )
  ),
  tbody(
    {},
    ...data.map(row =>
      tr({},
        td({}, text(String(row.id))),
        td({}, text(row.name)),
        td({}, text(row.role)),
        td({}, text(row.salary))
      )
    )
  )
);

document.body.appendChild(dataTable);
```

## Navigation Menu

```typescript
import { nav, NavLink, text, hbox } from 'rynex';

const navigation = nav(
  { style: { background: '#333', padding: '1rem' } },
  hbox(
    { gap: '2rem', style: { maxWidth: '1200px', margin: '0 auto' } },
    NavLink({ to: '/', activeClass: 'active' }, text('Home')),
    NavLink({ to: '/about', activeClass: 'active' }, text('About')),
    NavLink({ to: '/services', activeClass: 'active' }, text('Services')),
    NavLink({ to: '/contact', activeClass: 'active' }, text('Contact'))
  )
);

document.body.appendChild(navigation);
```

## Modal Dialog

```typescript
import { modal, h2, p, button, hbox, text, state } from 'rynex';

const isOpen = state(false);

const confirmModal = modal(
  { open: isOpen.value, onClose: () => isOpen.value = false },
  h2({}, text('Confirm Action')),
  p({}, text('Are you sure you want to proceed?')),
  hbox(
    { gap: '1rem', style: { marginTop: '1rem' } },
    button(
      { onClick: () => { console.log('Confirmed'); isOpen.value = false; } },
      'Yes'
    ),
    button(
      { onClick: () => isOpen.value = false },
      'No'
    )
  )
);

document.body.appendChild(confirmModal);
```

## Search with Debounce

```typescript
import { input, div, list, li, text, debounce, state } from 'rynex';

const searchQuery = state('');
const results = state([]);

const performSearch = debounce((query) => {
  if (query) {
    // Simulate API call
    results.value = [
      { id: 1, title: `Result for "${query}" 1` },
      { id: 2, title: `Result for "${query}" 2` },
      { id: 3, title: `Result for "${query}" 3` }
    ];
  } else {
    results.value = [];
  }
}, 300);

const searchApp = div(
  { style: { maxWidth: '500px', margin: '0 auto', padding: '2rem' } },
  input({
    type: 'search',
    placeholder: 'Search...',
    onInput: (e) => {
      searchQuery.value = e.target.value;
      performSearch(e.target.value);
    }
  }),
  list({
    items: results.value,
    renderItem: (item) => li({}, text(item.title))
  })
);

document.body.appendChild(searchApp);
```

## Tabs Component

```typescript
import { tabs, div, text } from 'rynex';

const tabsComponent = tabs({
  tabs: [
    { label: 'Overview', content: div({}, text('Overview content')) },
    { label: 'Details', content: div({}, text('Details content')) },
    { label: 'Settings', content: div({}, text('Settings content')) }
  ],
  defaultIndex: 0,
  onChange: (index) => console.log('Tab changed to:', index)
});

document.body.appendChild(tabsComponent);
```

## Theme Switcher

```typescript
import { button, div, text, setTheme, state } from 'rynex';

const isDark = state(true);

const themeSwitcher = div(
  { style: { padding: '1rem' } },
  button(
    {
      onClick: () => {
        isDark.value = !isDark.value;
        setTheme({
          background: isDark.value ? '#000' : '#fff',
          color: isDark.value ? '#fff' : '#000'
        });
      }
    },
    () => text(isDark.value ? 'Light Mode' : 'Dark Mode')
  )
);

document.body.appendChild(themeSwitcher);
```

## Animated Loading Spinner

```typescript
import { spinner, div, text, vbox } from 'rynex';

const loadingScreen = vbox(
  { style: { textAlign: 'center', padding: '2rem' } },
  spinner({ size: '50px' }),
  text('Loading...')
);

document.body.appendChild(loadingScreen);
```

## Tips for Examples

- Start with simple examples
- Build up to complex patterns
- Test examples in your application
- Modify examples for your needs
- Combine examples for custom solutions
- Refer to helper documentation for details

## Next Steps

- Explore [Helper Functions](./helpers/index.md)
- Read [Best Practices](./best-practices.md)
- Check [Getting Started](./getting-started.md)
