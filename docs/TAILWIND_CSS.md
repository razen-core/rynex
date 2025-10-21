# Tailwind CSS Integration

Rynex provides seamless Tailwind CSS integration with a simple opt-in command.

## Quick Setup

```bash
# Navigate to your Rynex project
cd my-rynex-app

# Add Tailwind CSS
rynex add tailwind

# Choose your package manager when prompted:
# 1) npm
# 2) pnpm
# 3) yarn
# 4) bun

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## What Gets Configured

When you run `rynex add tailwind`, the following happens automatically:

1. **Dependencies Installed**:
   - `tailwindcss` (latest v4.x)
   - `postcss` (v8.5.x)
   - `autoprefixer` (v10.4.x)

2. **Configuration Created**:
   - `tailwind.config.js` with optimized settings

3. **CSS Updated**:
   - `@import "tailwindcss"` added to `public/styles.css`

4. **Entry Point Updated**:
   - CSS import added to your main `index.ts`

5. **HTML Updated**:
   - `<link>` tag added to `public/index.html`

## Usage

### Basic Example

```typescript
import * as UI from 'rynex';

export default function App() {
  return UI.vbox({
    class: 'min-h-screen bg-gray-100 flex items-center justify-center p-4'
  }, [
    UI.vbox({
      class: 'bg-white rounded-xl shadow-lg p-8 max-w-md w-full'
    }, [
      UI.text({
        class: 'text-3xl font-bold text-gray-800 mb-4'
      }, 'Welcome to Rynex + Tailwind'),
      UI.text({
        class: 'text-gray-600 mb-6'
      }, 'Build beautiful UIs with utility-first CSS'),
      UI.button({
        class: 'w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors',
        onClick: () => alert('Hello!')
      }, 'Get Started')
    ])
  ]);
}
```

### Responsive Design

```typescript
UI.container({
  class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'
}, items.map(item => 
  UI.vbox({
    class: 'bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow'
  }, [
    UI.text({
      class: 'text-xl font-bold mb-2'
    }, item.title),
    UI.text({
      class: 'text-gray-600'
    }, item.description)
  ])
));
```

### Dynamic Classes

```typescript
import { state } from 'rynex';

const appState = state({ isActive: false });

UI.button({
  class: () => appState.isActive 
    ? 'bg-green-500 text-white' 
    : 'bg-gray-200 text-gray-800',
  onClick: () => appState.isActive = !appState.isActive
}, 'Toggle');
```

### Hover & Transitions

```typescript
UI.button({
  class: 'bg-blue-500 hover:bg-blue-600 hover:scale-105 transform transition-all duration-200 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg'
}, 'Hover Me');
```

## Configuration

The generated `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
    "./dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Customizing Theme

```javascript
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
```

## How It Works

### Class Detection

Tailwind scans your source files for class names:

```typescript
// ✅ Detected
class: 'flex items-center'
class: "bg-blue-500"
const classes = 'p-4 rounded-lg';

// ❌ Not detected (dynamic)
const color = 'blue';
class: `bg-${color}-500`  // Won't work

// ✅ Solution: Use complete class names
class: color === 'blue' ? 'bg-blue-500' : 'bg-red-500'
```

### Build Process

**Development Mode** (`rynex dev`):
1. Builder detects `tailwind.config.js`
2. Loads `esbuild-plugin-tailwindcss`
3. Plugin processes CSS with Tailwind
4. Generates `bundle.css` with all used classes
5. Hot reload watches for changes

**Production Mode** (`rynex build`):
1. Same as dev mode
2. Tailwind purges unused classes
3. CSS is minified
4. Autoprefixer adds vendor prefixes
5. Optimized `bundle.css` generated

## Common Patterns

### Card Component

```typescript
function Card({ title, description, image }) {
  return UI.vbox({
    class: 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow'
  }, [
    UI.image({
      src: image,
      class: 'w-full h-48 object-cover'
    }),
    UI.vbox({
      class: 'p-6'
    }, [
      UI.text({
        class: 'text-xl font-semibold text-gray-800 mb-2'
      }, title),
      UI.text({
        class: 'text-gray-600'
      }, description)
    ])
  ]);
}
```

### Form with Validation

```typescript
import { state } from 'rynex';

function LoginForm() {
  const formState = state({
    email: '',
    password: '',
    error: ''
  });

  return UI.vbox({
    class: 'max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'
  }, [
    UI.text({
      class: 'text-2xl font-bold mb-6 text-center'
    }, 'Login'),
    UI.input({
      type: 'email',
      class: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4',
      placeholder: 'Email',
      value: () => formState.email,
      onInput: (e) => formState.email = e.target.value
    }),
    UI.input({
      type: 'password',
      class: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6',
      placeholder: 'Password',
      value: () => formState.password,
      onInput: (e) => formState.password = e.target.value
    }),
    UI.button({
      class: 'w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors',
      onClick: () => handleLogin(formState)
    }, 'Sign In')
  ]);
}
```

### Navigation Bar

```typescript
function Navbar() {
  return UI.hbox({
    class: 'bg-white shadow-md px-6 py-4 flex items-center justify-between'
  }, [
    UI.text({
      class: 'text-2xl font-bold text-blue-600'
    }, 'MyApp'),
    UI.hbox({
      class: 'flex gap-6'
    }, [
      UI.link({
        href: '/',
        class: 'text-gray-600 hover:text-blue-600 transition-colors'
      }, 'Home'),
      UI.link({
        href: '/about',
        class: 'text-gray-600 hover:text-blue-600 transition-colors'
      }, 'About'),
      UI.button({
        class: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
      }, 'Sign Up')
    ])
  ]);
}
```

## Performance

| Metric | Value |
|--------|-------|
| **Development** | Full Tailwind utilities (~3MB) |
| **Production** | 10-30KB (purged, only used classes) |
| **Build Time (dev)** | <100ms (JIT mode) |
| **Build Time (prod)** | <2s (full optimization) |

## Troubleshooting

### Classes Not Applying

1. Check `tailwind.config.js` content paths include your files
2. Verify CSS is imported in your entry point
3. Rebuild: `rynex build`
4. Check browser console for CSS loading errors

### Slow Build Times

1. JIT mode is enabled by default
2. Optimize content paths in `tailwind.config.js`
3. Remove unused files from content scan

### CSS Not Loading

1. Verify `<link rel="stylesheet" href="./bundle.css">` in HTML
2. Check that `bundle.css` exists in `public/` after build
3. Clear browser cache

## Advanced Features

### Dark Mode

```javascript
// tailwind.config.js
export default {
  darkMode: 'class', // or 'media'
  // ...
}
```

```typescript
UI.vbox({
  class: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
}, [
  UI.text({
    class: 'text-gray-600 dark:text-gray-300'
  }, 'This adapts to dark mode')
]);
```

### Custom Plugins

```bash
pnpm add -D @tailwindcss/forms @tailwindcss/typography
```

```javascript
// tailwind.config.js
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  plugins: [forms, typography],
}
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind UI Components](https://tailwindui.com)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

## Next Steps

- Explore [Tailwind UI Components](https://tailwindui.com/components)
- Try [Tailwind Plugins](https://tailwindcss.com/docs/plugins)
- Build your first styled Rynex app!
