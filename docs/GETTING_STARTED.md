# Getting Started with ZenWeb

A comprehensive guide to building your first application with ZenWeb.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Your First Component](#your-first-component)
5. [State Management](#state-management)
6. [Routing](#routing)
7. [Building for Production](#building-for-production)
8. [Next Steps](#next-steps)

---

## Installation

### Prerequisites

- Node.js 16 or higher
- pnpm, npm, or yarn

### Create a New Project

```bash
# Using npx
npx zenweb init my-app

# Or install globally
npm install -g zenweb
zenweb init my-app

# Navigate to project
cd my-app
```

### Install Dependencies

```bash
pnpm install
# or
npm install
```

---

## Quick Start

### Start Development Server

```bash
pnpm dev
```

This will:
- Build your application
- Start the development server on `http://localhost:3000`
- Enable hot module replacement (HMR)
- Watch for file changes

### Project Structure

After initialization, your project will have this structure:

```
my-app/
├── src/
│   ├── index.ts          # Application entry point
│   ├── App.ts            # Main application component
│   ├── components/       # Reusable components
│   └── pages/            # Page components (file-based routing)
├── public/
│   ├── index.html        # HTML template
│   └── styles.css        # Global styles
├── dist/                 # Build output (generated)
├── zenweb.config.js      # Framework configuration
├── package.json
└── tsconfig.json
```

---

## Your First Component

### Basic Component

Create a simple component in `src/components/Welcome.ts`:

```typescript
import * as UI from 'zenweb';

export default function Welcome() {
  return UI.vbox({
    style: {
      padding: '2rem',
      textAlign: 'center'
    }
  }, [
    UI.h1({}, 'Welcome to ZenWeb'),
    UI.text({}, 'Build fast, reactive web applications')
  ]);
}
```

### Using the Component

Import and use it in `src/App.ts`:

```typescript
import * as UI from 'zenweb';
import Welcome from './components/Welcome.js';

export default function App() {
  return UI.vbox({
    style: { minHeight: '100vh' }
  }, [
    Welcome()
  ]);
}
```

---

## State Management

### Creating Reactive State

ZenWeb uses Proxy-based reactivity for automatic UI updates:

```typescript
import { state } from 'zenweb';
import * as UI from 'zenweb';

export default function Counter() {
  // Create reactive state
  const counterState = state({
    count: 0
  });

  return UI.vbox({
    style: { padding: '2rem', gap: '1rem' }
  }, [
    // Reactive text - updates automatically
    UI.text({}, () => `Count: ${counterState.count}`),
    
    UI.hbox({ style: { gap: '0.5rem' } }, [
      UI.button({
        onClick: () => counterState.count--
      }, 'Decrement'),
      
      UI.button({
        onClick: () => counterState.count++
      }, 'Increment')
    ])
  ]);
}
```

### Computed Values

Create derived values that update automatically:

```typescript
import { state, computed } from 'zenweb';

const appState = state({
  price: 100,
  quantity: 2
});

const total = computed(() => appState.price * appState.quantity);

// Use in component
UI.text({}, () => `Total: $${total()}`)
```

### Effects

Run side effects when state changes:

```typescript
import { state, effect } from 'zenweb';

const appState = state({ count: 0 });

effect(() => {
  console.log('Count changed:', appState.count);
  document.title = `Count: ${appState.count}`;
});
```

---

## Routing

### File-Based Routing

ZenWeb supports Next.js-style file-based routing. Create pages in the `src/pages/` directory:

```
src/pages/
├── index.ts              # Route: /
├── about.ts              # Route: /about
├── blog/
│   ├── page.ts           # Route: /blog
│   └── [slug]/
│       └── page.ts       # Route: /blog/:slug (dynamic)
└── user/
    └── [id]/
        └── page.ts       # Route: /user/:id (dynamic)
```

### Creating a Page

Create `src/pages/about.ts`:

```typescript
import * as UI from 'zenweb';

export default function AboutPage() {
  return UI.vbox({
    style: { padding: '2rem' }
  }, [
    UI.h1({}, 'About Us'),
    UI.text({}, 'Learn more about our application'),
    UI.link({ href: '/' }, 'Back to Home')
  ]);
}
```

### Dynamic Routes

Create `src/pages/user/[id]/page.ts`:

```typescript
import * as UI from 'zenweb';
import { RouteContext } from 'zenweb';

export default function UserPage(ctx: RouteContext) {
  const userId = ctx.params.id;
  
  return UI.vbox({
    style: { padding: '2rem' }
  }, [
    UI.h1({}, `User Profile: ${userId}`),
    UI.text({}, `Viewing profile for user ${userId}`),
    UI.link({ href: '/' }, 'Back to Home')
  ]);
}
```

### Programmatic Routing

Set up a router in your main app:

```typescript
import { createRouter } from 'zenweb';
import * as UI from 'zenweb';
import HomePage from './pages/index.js';
import AboutPage from './pages/about.js';

export default function App() {
  const router = createRouter([
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage }
  ]);

  // Add navigation
  const nav = UI.nav({
    style: { padding: '1rem', background: '#333' }
  }, [
    UI.link({ 
      href: '/',
      style: { color: 'white', marginRight: '1rem' }
    }, 'Home'),
    UI.link({ 
      href: '/about',
      style: { color: 'white' }
    }, 'About')
  ]);

  return UI.vbox({}, [
    nav,
    UI.RouterOutlet(router)
  ]);
}
```

---

## Building for Production

### Build Your Application

```bash
pnpm build
```

This creates an optimized production build in the `dist/` directory with:
- Minified JavaScript
- Source maps
- Optimized assets

### Start Production Server

```bash
pnpm start
# or
zenweb start
```

The production server:
- Uses Express if available (falls back to native HTTP)
- Serves static files with caching
- Handles SPA routing
- Includes compression (with Express)

### Deploy

Deploy the `dist/` directory to any static hosting service:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Push `dist/` to gh-pages branch
- **Custom Server**: Use `zenweb start` on your server

---

## Next Steps

### Learn More

- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Routing Guide](./ROUTING_GUIDE.md) - Advanced routing features
- [Configuration](./CONFIGURATION.md) - Configure your application
- [Examples](./EXAMPLES.md) - Real-world examples

### Key Concepts

1. **No Virtual DOM**: ZenWeb updates the DOM directly for better performance
2. **Reactive State**: Use `state()` for automatic UI updates
3. **File-Based Routing**: Organize pages by file structure
4. **TypeScript First**: Full type safety out of the box

### Common Patterns

#### Form Handling

```typescript
import { state } from 'zenweb';
import * as UI from 'zenweb';

export default function LoginForm() {
  const formState = state({
    email: '',
    password: ''
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Login:', formState.email, formState.password);
  };

  return UI.form({
    onSubmit: handleSubmit,
    style: { padding: '2rem', gap: '1rem' }
  }, [
    UI.input({
      type: 'email',
      placeholder: 'Email',
      value: formState.email,
      onInput: (e) => {
        formState.email = (e.target as HTMLInputElement).value;
      }
    }),
    
    UI.input({
      type: 'password',
      placeholder: 'Password',
      value: formState.password,
      onInput: (e) => {
        formState.password = (e.target as HTMLInputElement).value;
      }
    }),
    
    UI.button({ type: 'submit' }, 'Login')
  ]);
}
```

#### Conditional Rendering

```typescript
import { state } from 'zenweb';
import * as UI from 'zenweb';

export default function ConditionalExample() {
  const appState = state({ showContent: false });

  return UI.vbox({ style: { padding: '2rem' } }, [
    UI.button({
      onClick: () => appState.showContent = !appState.showContent
    }, () => appState.showContent ? 'Hide' : 'Show'),
    
    // Conditional rendering
    UI.show(() => appState.showContent,
      UI.vbox({}, [
        UI.text({}, 'This content is conditionally rendered!')
      ])
    )
  ]);
}
```

#### List Rendering

```typescript
import { state } from 'zenweb';
import * as UI from 'zenweb';

export default function TodoList() {
  const todos = state({
    items: ['Learn ZenWeb', 'Build an app', 'Deploy']
  });

  return UI.vbox({ style: { padding: '2rem' } }, [
    UI.h2({}, 'Todo List'),
    
    UI.each(
      () => todos.items,
      (item, index) => 
        UI.hbox({ 
          key: index,
          style: { padding: '0.5rem', gap: '1rem' }
        }, [
          UI.text({}, item),
          UI.button({
            onClick: () => {
              todos.items = todos.items.filter((_, i) => i !== index);
            }
          }, 'Delete')
        ])
    )
  ]);
}
```

### Best Practices

1. **Component Organization**: Keep components small and focused
2. **State Management**: Use local state when possible, global state when needed
3. **File Structure**: Group related files together
4. **TypeScript**: Leverage type safety for better development experience
5. **Performance**: Use `batch()` for multiple state updates

### Getting Help

- GitHub Issues: Report bugs or request features
- Documentation: Check the docs folder for detailed guides
- Examples: See the `examples/` directory for sample projects

---

## Summary

You now know how to:
- Create a new ZenWeb project
- Build components with reactive state
- Set up routing for your application
- Build and deploy for production

Start building your application and explore the advanced features in the other documentation files.
