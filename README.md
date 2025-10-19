# ZenWeb Framework

A minimalist TypeScript framework for building reactive web applications without complex tooling.

## ✨ Features

- **🎯 Minimalist**: Clean, declarative syntax using pure TypeScript
- **⚡ Reactive**: Fine-grained reactivity with automatic dependency tracking
- **🔧 Zero Config**: Works out of the box with sensible defaults
- **📦 Tiny Bundle**: Under 15KB gzipped
- **🎨 Scoped Styles**: Component-scoped CSS with the `style` keyword
- **🚀 Fast**: Virtual DOM with efficient diffing algorithm
- **💪 TypeScript**: Full TypeScript support with type safety

## 🚀 Quick Start

### Installation

```bash
npm install -g zenweb-cli
```

### Create a New Project

```bash
zenweb init my-app
cd my-app
npm install
npm run dev
```

## 📖 Core Concepts

### Components

Components are pure functions that return UI structures:

```typescript
import { state } from 'zenweb/runtime';
import { vbox, text, button } from 'zenweb/runtime';

export default function Counter() {
  const [count, setCount] = state(0);

  view {
    vbox({ class: 'counter' }, [
      text({}, `Count: ${count()}`),
      button({ onClick: () => setCount(count() + 1) }, 'Increment')
    ])
  }

  style {
    .counter {
      padding: 2rem;
      text-align: center;
    }
    
    button {
      padding: 0.5rem 1rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
```

### State Management

Reactive state with automatic dependency tracking:

```typescript
import { state, computed, effect } from 'zenweb/runtime';

// Simple state
const [count, setCount] = state(0);

// Computed values
const doubled = computed(() => count() * 2);

// Side effects
effect(() => {
  console.log('Count changed:', count());
});
```

### Helper Functions

Built-in layout and component helpers:

- **Layout**: `vbox`, `hbox`, `grid`
- **Elements**: `text`, `button`, `input`, `image`, `link`
- **HTML**: `div`, `span`, `h1-h6`, `p`, `form`, `textarea`, `select`, `option`
- **Lists**: `list` with virtual scrolling support

## 🎨 View & Style Keywords

### View Keyword

The `view` keyword declares component template structure:

```typescript
view {
  vbox({ class: 'container' }, [
    text({}, 'Hello World')
  ])
}
```

### Style Keyword

The `style` keyword defines scoped component styling:

```typescript
style {
  .container {
    padding: 1rem;
    background: #f0f0f0;
  }
}
```

Styles are automatically scoped to the component and won't leak to other components.

## 🛠️ CLI Commands

```bash
# Create new project
zenweb init [project-name]

# Start development server
zenweb dev

# Build for production
zenweb build

# Clean build artifacts
zenweb clean
```

## ⚙️ Configuration

Create a `zenweb.config.js` file in your project root:

```javascript
export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  minify: true,
  sourceMaps: true,
  port: 3000,
  hotReload: true
};
```

## 📁 Project Structure

```
my-zenweb-app/
├── src/
│   ├── index.ts           # Entry point
│   ├── App.ts             # Root component
│   └── components/        # Component directory
│       ├── Header.ts
│       └── Footer.ts
├── public/
│   ├── index.html         # HTML shell
│   └── assets/            # Static assets
├── dist/                  # Build output
├── zenweb.config.js       # Configuration
└── package.json
```

## 🎯 Design Philosophy

ZenWeb follows these principles:

1. **Simplicity First**: No complex build configurations or tooling
2. **Pure Functions**: Components are just functions
3. **Reactive by Default**: State changes automatically update the UI
4. **TypeScript Native**: Built with TypeScript for TypeScript
5. **Performance**: Minimal runtime overhead with efficient updates

## 📚 Examples

### Todo List

```typescript
import { state } from 'zenweb/runtime';
import { vbox, input, button, list, text } from 'zenweb/runtime';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = state<Todo[]>([]);
  const [input, setInput] = state('');

  const addTodo = () => {
    if (input().trim()) {
      setTodos([...todos(), {
        id: Date.now(),
        text: input(),
        done: false
      }]);
      setInput('');
    }
  };

  view {
    vbox({ class: 'todo-app' }, [
      vbox({ class: 'input-section' }, [
        input({
          value: input(),
          onInput: (e: Event) => setInput((e.target as HTMLInputElement).value),
          placeholder: 'What needs to be done?'
        }),
        button({ onClick: addTodo }, 'Add')
      ]),
      
      list({
        items: todos(),
        renderItem: (todo) => 
          vbox({ class: 'todo-item' }, [
            text({}, todo.text)
          ]),
        keyExtractor: (todo) => todo.id
      })
    ])
  }

  style {
    .todo-app {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
    }
    
    .input-section {
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .todo-item {
      padding: 1rem;
      background: white;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Documentation](https://github.com/zenweb/docs)
- [Examples](https://github.com/zenweb/examples)
- [Community](https://github.com/zenweb/community)

---

Built with 🧘 by the ZenWeb team
