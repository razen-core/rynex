# Tailwind CSS Integration Guide for Rynex

## Overview

This guide explains how to properly integrate Tailwind CSS with Rynex framework using Rolldown bundler.

## Architecture

Rynex uses a **dual-process approach** for CSS handling:

1. **CSS Build Process**: Separate PostCSS pipeline for Tailwind processing
2. **JS Build Process**: Rolldown for JavaScript bundling
3. **Watch Mode**: Parallel watching of both CSS and JS files

This approach is similar to how Vite and other modern frameworks handle CSS, providing:
- ✅ Fast incremental builds
- ✅ Proper Tailwind CSS v4 support
- ✅ PostCSS plugin ecosystem compatibility
- ✅ Production optimization

## Installation

### Step 1: Install Dependencies

```bash
# Install Tailwind CSS v4 and PostCSS
pnpm add -D tailwindcss @tailwindcss/postcss postcss postcss-cli autoprefixer

# Or with npm
npm install --save-dev tailwindcss @tailwindcss/postcss postcss postcss-cli autoprefixer
```

### Step 2: Create PostCSS Configuration

Create `postcss.config.mjs` in your project root:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### Step 3: Create CSS Entry File

Create `src/styles/main.css`:

```css
@import "tailwindcss";

/* Optional: CSS-first configuration (Tailwind v4) */
@theme {
  /* Custom colors */
  --color-primary: oklch(0.5 0.2 250);
  --color-secondary: oklch(0.7 0.15 180);
  
  /* Custom fonts */
  --font-display: "Inter", sans-serif;
  
  /* Custom breakpoints */
  --breakpoint-3xl: 1920px;
  
  /* Custom spacing */
  --spacing-18: 4.5rem;
}

/* Your custom CSS */
@layer components {
  .btn-primary {
    @apply bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Step 4: Update Rynex Configuration

Update your `rynex.config.js`:

```javascript
export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  minify: false,
  sourceMaps: true,
  port: 3000,
  hotReload: true,
  
  // Tailwind CSS configuration
  css: {
    enabled: true,
    entry: 'src/styles/main.css',
    output: 'dist/styles.css',
    minify: false, // Set to true for production
  },
  
  // HTML configuration
  html: {
    title: 'My Rynex App',
    description: 'Built with Rynex and Tailwind CSS',
  }
};
```

### Step 5: Update package.json Scripts

Add CSS build scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "rynex dev",
    "build": "rynex build",
    "css:build": "postcss src/styles/main.css -o dist/styles.css",
    "css:watch": "postcss src/styles/main.css -o dist/styles.css --watch",
    "dev:full": "concurrently \"npm run css:watch\" \"npm run dev\"",
    "build:full": "npm run css:build && npm run build"
  }
}
```

## Usage Patterns

### Basic Component with Tailwind

```typescript
import { vbox, text, button } from 'rynex/helpers';

export function Card() {
  return vbox()
    .class('bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow')
    .gap(1.5)
    .add([
      text('Card Title')
        .class('text-2xl font-bold text-gray-800')
        .build(),
      
      text('Card description goes here')
        .class('text-gray-600')
        .build(),
      
      button('Click Me')
        .class('bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors')
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
    // Grid items
  ])
  .build()
```

### Dark Mode Support

```typescript
import { vbox } from 'rynex/helpers';

vbox()
  .class('bg-white dark:bg-gray-800 text-gray-900 dark:text-white')
  .add([
    // Content
  ])
  .build()
```

### Custom Theme Values

```typescript
import { vbox, text } from 'rynex/helpers';

// Using custom theme variables defined in @theme
vbox()
  .class('bg-primary text-white font-display')
  .add([
    text('Using custom theme values').build()
  ])
  .build()
```

## Advanced Configuration

### Content Detection (Tailwind v4)

Tailwind v4 automatically detects content files, but you can customize:

```css
/* src/styles/main.css */
@import "tailwindcss";

/* Add custom source paths */
@source "../components/**/*.ts";
@source "../pages/**/*.tsx";
```

### Custom Utilities

```css
@layer utilities {
  .text-shadow-sm {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### Custom Components

```css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
  
  .card-hover {
    @apply card hover:shadow-xl transition-shadow duration-300;
  }
  
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold transition-colors;
  }
  
  .btn-primary {
    @apply btn bg-blue-500 text-white hover:bg-blue-600;
  }
  
  .btn-secondary {
    @apply btn bg-gray-200 text-gray-800 hover:bg-gray-300;
  }
}
```

## Production Build

### Optimization Checklist

1. **Enable minification** in `rynex.config.js`:
```javascript
{
  minify: true,
  css: {
    minify: true
  }
}
```

2. **Purge unused CSS**: Tailwind v4 does this automatically

3. **Enable compression**:
```javascript
{
  build: {
    compression: {
      gzip: true,
      brotli: true,
      threshold: 1024
    }
  }
}
```

4. **Build command**:
```bash
pnpm build:full
```

## Performance Tips

### 1. Use Tailwind's JIT Mode (Default in v4)
- Only generates CSS for classes you use
- Instant build times
- No purge configuration needed

### 2. Optimize Class Usage
```typescript
import { vbox } from 'rynex/helpers';

// ❌ Bad: Dynamic class generation
const color = 'blue';
vbox().class(`bg-${color}-500`).build() // Won't be detected

// ✅ Good: Static classes
vbox().class('bg-blue-500').build()

// ✅ Good: Conditional classes
vbox()
  .class(isActive ? 'bg-blue-500' : 'bg-gray-500')
  .build()
```

### 3. Use CSS Variables for Dynamic Values
```css
@theme {
  --color-brand: oklch(0.5 0.2 250);
}
```

```typescript
import { vbox } from 'rynex/helpers';

// Use in components
vbox()
  .class('bg-brand')
  .style('--color-brand', 'oklch(0.6 0.2 180)')
  .build()
```

### 4. Leverage @layer for Specificity
```css
@layer components {
  .my-component {
    /* Component styles */
  }
}

@layer utilities {
  .my-utility {
    /* Utility styles */
  }
}
```

## Troubleshooting

### Classes Not Being Generated

**Problem**: Tailwind classes in your components aren't being styled.

**Solutions**:
1. Check that PostCSS is running: `npm run css:watch`
2. Verify `dist/styles.css` is being generated
3. Check HTML includes the stylesheet: `<link rel="stylesheet" href="styles.css">`
4. Clear browser cache

### Build Performance Issues

**Problem**: CSS builds are slow.

**Solutions**:
1. Upgrade to Tailwind CSS v4 (3.5x faster)
2. Use `@source` directive to limit scanning
3. Exclude `node_modules` (automatic in v4)

### Styles Not Updating in Dev Mode

**Problem**: Changes to Tailwind classes don't reflect immediately.

**Solutions**:
1. Use `concurrently` to run both watchers: `npm run dev:full`
2. Check both processes are running
3. Enable hot reload in `rynex.config.js`

### Production Bundle Too Large

**Problem**: CSS file is too large in production.

**Solutions**:
1. Enable minification: `css: { minify: true }`
2. Remove unused custom CSS
3. Use Tailwind's built-in utilities instead of custom CSS
4. Enable compression: `build: { compression: { brotli: true } }`

## Migration from v3 to v4

If you're upgrading from Tailwind CSS v3:

### 1. Update Dependencies
```bash
pnpm add -D tailwindcss@latest @tailwindcss/postcss
```

### 2. Remove Old Config
- Delete `tailwind.config.js`
- Remove `content` array configuration

### 3. Update CSS File
```css
/* Old (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* New (v4) */
@import "tailwindcss";
```

### 4. Move Config to CSS
```css
/* tailwind.config.js theme → @theme in CSS */
@theme {
  --color-primary: oklch(0.5 0.2 250);
}
```

### 5. Update PostCSS Config
```javascript
// Old
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}

// New
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  }
}
```

## Best Practices

### 1. Organize Styles
```
src/
  styles/
    main.css          # Entry point
    base.css          # Base styles
    components.css    # Component styles
    utilities.css     # Custom utilities
```

### 2. Use Semantic Class Names
```typescript
import { vbox, hbox } from 'rynex/helpers';

// ❌ Avoid
vbox().class('mt-4 mb-2 p-6 bg-blue-500 rounded').build()

// ✅ Better
vbox().class('card-container').build() // Define in CSS

// ✅ Best (for utilities)
hbox().class('flex items-center gap-4').build()
```

### 3. Component Patterns
```typescript
import { button } from 'rynex/helpers';

// Create reusable component functions
export function Button({ 
  variant = 'primary', 
  text,
  onClick
}: {
  variant?: 'primary' | 'secondary' | 'danger';
  text: string;
  onClick?: () => void;
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };
  
  return button(text)
    .class(variants[variant])
    .click(onClick)
    .build();
}
```

### 4. Type Safety
```typescript
// Define allowed class names
type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  variant?: ButtonVariant;
  class?: string;
  onclick?: () => void;
}
```

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [PostCSS Documentation](https://postcss.org/)
- [Rynex Documentation](../README.md)

## Examples

See the `/examples` directory for complete working examples:
- `examples/tailwind-basic` - Basic Tailwind setup
- `examples/tailwind-advanced` - Advanced features and custom theme
- `examples/tailwind-components` - Reusable component library

---

**Last Updated**: 2024
**Tailwind CSS Version**: v4.0+
**Rynex Version**: v0.1.0-alpha.67+
