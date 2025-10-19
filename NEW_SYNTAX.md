# ZenWeb - Simple & Clean Syntax

> **Goal:** Minimal, readable, no verbose code. Use built-in functions from ZenWeb.

---

## 1. Basic Counter Example

### `src/App.ts`

```typescript
import * as Zen from 'zenweb';

export function App() {
  // Reactive state
  const $ = state({ count: 0 });
  
  return vbox(
    Zen.text(() => `Count: ${$.count}`),  // Function = auto-reactive
    Zen.button('Increment', () => $.count++),
    Zen.button('Decrement', () => $.count--),
    Zen.button('Reset', () => $.count = 0)
  );
}
```

### `src/index.ts`

```typescript
import * as Zen from 'zenweb';
import { App } from './App';

Zen.render(App, document.getElementById('root'));
```

### Key Features:
- ✅ `state()` creates reactive state
- ✅ `text(() => ...)` auto-updates when state changes
- ✅ `button(label, handler)` - label first, clean syntax
- ✅ No verbose props objects
- ✅ No manual `effect()` needed

---

## 2. Form Example with Styling

### `src/LoginForm.ts`

```typescript
import * as Zen from 'zenweb';

export function LoginForm() {
  const $ = Zen.state({ 
    email: '', 
    password: '',
    error: ''
  });
  
  const handleLogin = () => {
    if (!$.email || !$.password) {
      $.error = 'Please fill all fields';
      return;
    }
    console.log('Login:', $.email, $.password);
    $.error = '';
  };
  
  return (vbox({ class: 'login-form' },
    Zen.h2('Login'),
    
    vbox({ class: 'field' },
      Zen.text('Email:'),
      Zen.input({ 
        type: 'email',
        placeholder: 'Enter email',
        value: $.email,
        onInput: (e) => $.email = e.target.value
      })
    ),
    
    Zen.vbox({ class: 'field' },
      Zen.text('Password:'),
      Zen.input({ 
        type: 'password',
        placeholder: 'Enter password',
        value: $.password,
        Zen.onInput: (e) => $.password = e.target.value
      })
    ),
    
    $.error && Zen.text({ class: 'error' }, $.error),
    
    Zen.button('Login', handleLogin)
  );)
}

// Component styles
LoginForm.styles = `
  .login-form {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    gap: 15px;
  }
  
  .field {
    gap: 5px;
  }
  
  .field input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .error {
    color: red;
    font-size: 14px;
  }
  
  button {
    padding: 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
`;
```

---

## 3. Todo List with All Features

### `src/TodoApp.ts`

```typescript
import * as Zen from 'zenweb';

export function TodoApp() {
  const $ = Zen.state({
    todos: [],
    newTodo: '',
    filter: 'all'
  });
  
  const addTodo = () => {
    if (!$.newTodo.trim()) return;
    $.todos.push({
      id: Date.now(),
      text: $.newTodo,
      done: false
    });
    $.newTodo = '';
  };
  
  const toggleTodo = (id) => {
    const todo = $.todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  };
  
  const deleteTodo = (id) => {
    $.todos = $.todos.filter(t => t.id !== id);
  };
  
  return (Zen.vbox({ class: 'todo-app' },
    Zen.h1('My Todo List'),
    
    Zen.hbox({ class: 'add-todo' },
      Zen.input({
        placeholder: 'What needs to be done?',
        value: $.newTodo,
        onInput: (e) => $.newTodo = e.target.value,
        onKeyDown: (e) => e.key === 'Enter' && addTodo()
      }),
      Zen.button('Add', addTodo)
    ),
    
    Zen.hbox({ class: 'filters' },
      Zen.button('All', () => $.filter = 'all'),
      Zen.button('Active', () => $.filter = 'active'),
      Zen.button('Completed', () => $.filter = 'completed')
    ),
    
    Zen.vbox({ class: 'todo-list' },
      ...$.todos.filter(todo => {
        if ($.filter === 'active') return !todo.done;
        if ($.filter === 'completed') return todo.done;
        return true;
      }).map(todo =>
        Zen.hbox({ class: 'todo-item' },
          Zen.checkbox({
            checked: todo.done,
            onChange: () => toggleTodo(todo.id)
          }),
          Zen.text({ class: todo.done ? 'done' : '' }, todo.text),
          Zen.button('Delete', () => deleteTodo(todo.id))
        )
      )
    )
  );)
}

TodoApp.styles = `
  .todo-app {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    gap: 20px;
  }
  
  .add-todo {
    gap: 10px;
  }
  
  .add-todo input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .filters {
    gap: 10px;
    justify-content: center;
  }
  
  .filters button {
    padding: 8px 16px;
    background: #f0f0f0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .filters button.active {
    background: #007bff;
    color: white;
  }
  
  .todo-list {
    gap: 10px;
  }
  
  .todo-item {
    padding: 10px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    align-items: center;
    gap: 10px;
  }
  
  .todo-item .done {
    text-decoration: line-through;
    color: #999;
  }
`;
```

---

## 4. Layout Examples

```typescript
import { 
  vbox, hbox, grid, center, scroll,
  text, button, card
} from 'zenweb';

// Vertical layout
const VerticalLayout = () => vbox({ class: 'container' },
  text('Item 1'),
  text('Item 2'),
  text('Item 3')
);

// Horizontal layout
const HorizontalLayout = () => hbox({ class: 'container' },
  button('Button 1'),
  button('Button 2'),
  button('Button 3')
);

// Grid layout
const GridLayout = () => grid({ columns: 3, gap: '20px' },
  card('Card 1'),
  card('Card 2'),
  card('Card 3'),
  card('Card 4'),
  card('Card 5'),
  card('Card 6')
);

// Centered content
const CenteredLayout = () => center({ style: { height: '100vh' } },
  vbox(
    text('Centered Content'),
    button('Click Me')
  )
);

// Scrollable content
const ScrollableLayout = () => scroll({ style: { maxHeight: '400px' } },
  vbox(
    ...Array(50).fill(0).map((_, i) => text(`Item ${i + 1}`))
  )
);
```

---

## 6. Component Structure

### Best Practices:

```typescript
import { state, vbox, text, button } from 'zenweb';

// 1. Component function
export function MyComponent(props) {
  // 2. State
  const $ = state({ count: 0 });
  
  // 3. Logic/handlers
  const increment = () => $.count++;
  
  // 4. Return UI
  return vbox(
    text(() => `Count: ${$.count}`),
    button('Increment', increment)
  );
}

// 5. Styles (optional)
MyComponent.styles = `
  /* Component styles */
`;
```

---

## 7. Available Functions (From FUNCTIONS_LIST.md)

### Layout:
- `vbox()` - Vertical flex
- `hbox()` - Horizontal flex
- `grid()` - Grid layout
- `center()` - Center content
- `scroll()` - Scrollable

### Elements:
- `text()` - Text/span
- `button()` - Button
- `input()` - Input field
- `checkbox()` - Checkbox
- `textarea()` - Textarea
- `select()` - Select dropdown

### Typography:
- `h1()`, `h2()`, `h3()`, `h4()`, `h5()`, `h6()` - Headings
- `p()` - Paragraph
- `strong()` - Bold
- `em()` - Italic
- `code()` - Code

### Forms:
- `form()` - Form container
- `input()` - Input
- `textarea()` - Textarea
- `select()` - Select
- `option()` - Option

### Semantic:
- `header()` - Header
- `footer()` - Footer
- `nav()` - Navigation
- `main()` - Main content
- `section()` - Section
- `article()` - Article

---

## 8. Syntax Rules

### ✅ DO:
```typescript
// Clean function calls
vbox(
  text('Hello'),
  button('Click', () => alert('Hi'))
)

// Reactive text with function
text(() => `Count: ${$.count}`)

// Props when needed
button({ class: 'primary' }, 'Submit', handleSubmit)

// Spread arrays
vbox(
  ...items.map(item => text(item))
)
```

### ❌ DON'T:
```typescript
// Don't use arrays unnecessarily
vbox([text('Hello'), button('Click')])  // ❌

// Don't use verbose props for simple cases
button({ onClick: handler }, 'Click')  // ❌
button('Click', handler)  // ✅

// Don't create manual effects
effect(() => element.textContent = $.count)  // ❌
text(() => $.count)  // ✅
```

---

## Summary

**ZenWeb Syntax Philosophy:**
1. ✅ **Simple** - Minimal boilerplate
2. ✅ **Clean** - No verbose code
3. ✅ **Reactive** - Auto-updates with functions
4. ✅ **Flexible** - Props when needed
5. ✅ **Readable** - Looks like what it does

**Key Pattern:**
```typescript
const $ = state({ ... });  // State
return vbox(               // Layout
  text(() => $.value),     // Auto-reactive
  button('Label', handler) // Clean events
);
```