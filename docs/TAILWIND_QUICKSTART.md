# Tailwind CSS v4 Quick Start for Rynex

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
pnpm add -D tailwindcss @tailwindcss/postcss postcss postcss-cli autoprefixer
```

Or with npm:

```bash
npm install --save-dev tailwindcss @tailwindcss/postcss postcss postcss-cli autoprefixer
```

### Step 2: Initialize Tailwind CSS

```bash
rynex init:css
```

This command will:
- ✅ Create `postcss.config.mjs`
- ✅ Create `src/styles/main.css` with Tailwind imports
- ✅ Update `rynex.config.js` to enable CSS processing
- ✅ Create an example component

### Step 3: Start Development

```bash
rynex dev
```

That's it! Your CSS will be automatically compiled and watched for changes.

## 📝 What Gets Created

### `postcss.config.mjs`
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### `src/styles/main.css`
```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.5 0.2 250);
  --color-secondary: oklch(0.7 0.15 180);
}
```

### `rynex.config.js` (updated)
```javascript
export default {
  // ... other config
  css: {
    enabled: true,
    entry: 'src/styles/main.css',
    output: 'dist/styles.css',
    minify: false,
    sourcemap: true,
  },
};
```

## 🎨 Usage Examples

### Basic Component

```typescript
import { vbox, text, button } from 'rynex/helpers';

export function Card() {
  return vbox()
    .class('bg-white rounded-lg shadow-lg p-6')
    .gap(1)
    .add([
      text('Hello Tailwind!')
        .class('text-2xl font-bold text-gray-800')
        .build(),
      
      button('Click Me')
        .class('bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg')
        .click(() => console.log('Clicked!'))
        .build()
    ])
    .build();
}
```

### Responsive Design

```typescript
import { grid } from 'rynex/helpers';

grid()
  .class('grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4')
  .add([
    // Your content
  ])
  .build()
```

### Custom Theme Colors

```css
/* In src/styles/main.css */
@theme {
  --color-brand: oklch(0.5 0.2 250);
  --color-accent: oklch(0.7 0.15 180);
}
```

```typescript
import { vbox } from 'rynex/helpers';

// Use in components
vbox()
  .class('bg-brand text-accent')
  .build()
```

## 🔥 Key Features

### ✅ Zero Configuration
- No `tailwind.config.js` needed
- Automatic content detection
- No need to configure `content` paths

### ✅ Automatic CSS Processing
- CSS compiles automatically with `rynex dev`
- CSS compiles automatically with `rynex build`
- Hot reload on CSS changes

### ✅ Tailwind CSS v4 Features
- **3.5x faster** full builds
- **8x faster** incremental builds
- CSS-first configuration with `@theme`
- Built-in `@import` support
- Modern CSS features (cascade layers, color-mix, etc.)

## 🛠️ Commands

### Development
```bash
rynex dev
```
- Compiles CSS automatically
- Watches for changes
- Hot reloads on CSS updates

### Production Build
```bash
rynex build
```
- Compiles and minifies CSS
- Purges unused styles automatically
- Optimizes for production

### Initialize Tailwind
```bash
rynex init:css
```
- Sets up Tailwind CSS v4
- Creates all necessary files
- Updates configuration

## 📦 What Happens Behind the Scenes

### During `rynex dev`:
1. CSS is compiled from `src/styles/main.css`
2. Output is written to `dist/styles.css`
3. CSS watcher monitors for changes
4. Browser auto-reloads on CSS updates

### During `rynex build`:
1. CSS is compiled and minified
2. Unused styles are automatically purged
3. Output is optimized for production
4. Source maps are generated (if enabled)

## 🎯 Best Practices

### 1. Use Utility Classes
```typescript
import { hbox } from 'rynex/helpers';

// ✅ Good
hbox()
  .class('flex items-center gap-4')
  .build()

// ❌ Avoid
hbox()
  .style('display', 'flex')
  .style('alignItems', 'center')
  .style('gap', '1rem')
  .build()
```

### 2. Static Class Names
```typescript
import { vbox } from 'rynex/helpers';

// ✅ Good - Tailwind can detect these
vbox().class('bg-blue-500').build()
vbox().class(isActive ? 'bg-blue-500' : 'bg-gray-500').build()

// ❌ Bad - Dynamic strings won't be detected
const color = 'blue';
vbox().class(`bg-${color}-500`).build()
```

### 3. Custom Components in CSS
```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600;
  }
}
```

### 4. Organize Your Styles
```
src/
  styles/
    main.css          # Entry point with @import "tailwindcss"
    components.css    # Custom component styles
    utilities.css     # Custom utility classes
```

## 🐛 Troubleshooting

### CSS Not Compiling?

**Check dependencies:**
```bash
pnpm list tailwindcss @tailwindcss/postcss postcss postcss-cli
```

**Verify config:**
```bash
cat postcss.config.mjs
cat rynex.config.js
```

### Classes Not Working?

**Ensure CSS is linked in HTML:**
```html
<link rel="stylesheet" href="styles.css">
```

**Check browser console** for CSS loading errors.

### Build Errors?

**Clear dist folder:**
```bash
rynex clean
```

**Rebuild:**
```bash
rynex build
```

## 📚 Learn More

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [Full Integration Guide](./TAILWIND_INTEGRATION_GUIDE.md)
- [Rynex Documentation](../README.md)

## 🎉 Next Steps

1. **Customize your theme** in `src/styles/main.css`
2. **Create components** using Tailwind classes
3. **Build something amazing!**

---

**Need help?** Check out the [full integration guide](./TAILWIND_INTEGRATION_GUIDE.md) for advanced features and troubleshooting.
