# Rynex New Features Guide

## 🎯 Quick Start

This guide covers the new features added to Rynex CLI for enhanced developer experience and better build performance.

## 1. Path Aliases

### What are Path Aliases?

Path aliases let you import modules using clean, absolute-style paths instead of messy relative paths.

### Before vs After

```typescript
// ❌ Before: Messy relative imports
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../../hooks/useAuth';
import { formatDate } from '../../../utils/date';

// ✅ After: Clean alias imports
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@utils/date';
```

### Default Aliases

Rynex provides these aliases out of the box:

| Alias | Path | Usage |
|-------|------|-------|
| `@app/*` | `src/app/*` | App-level code |
| `@components/*` | `src/components/*` | UI components |
| `@pages/*` | `src/pages/*` | Page components |
| `@hooks/*` | `src/hooks/*` | Custom hooks |
| `@services/*` | `src/services/*` | API services |
| `@utils/*` | `src/utils/*` | Utility functions |
| `@styles/*` | `src/styles/*` | Style files |
| `@assets/*` | `src/assets/*` | Static assets |

### Custom Aliases

Add custom aliases in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@lib/*": ["src/library/*"],
      "@types/*": ["src/types/*"],
      "@config/*": ["src/config/*"]
    }
  }
}
```

Or in `rynex.config.js`:

```javascript
export default {
  resolve: {
    alias: {
      '@lib': 'src/library',
      '@types': 'src/types'
    }
  }
}
```

## 2. Build Progress

### Visual Progress Tracking

Rynex now shows detailed progress during builds:

```bash
⏳ Initializing build...
✓ Initializing build (52ms)
⏳ Building components...
✓ Building components (1.45s)
⏳ Building pages...
✓ Building pages (2.78s)
```

### Build Summary

After each build, see a detailed breakdown:

```bash
📊 Build Summary:
──────────────────────────────────────────────────
  Initializing build: 52ms (0.6%)
  Building components: 1.45s (17.8%)
  Building pages: 2.78s (34.1%)
  Building main entry: 3.21s (39.4%)
  Compressing assets: 312ms (3.8%)
──────────────────────────────────────────────────
✨ Total build time: 8.15s
```

This helps you:
- **Identify slow build steps**
- **Optimize build performance**
- **Track build time improvements**

## 3. Asset Compression

### Automatic Compression

In production builds, Rynex automatically compresses your assets:

```bash
🗜️  Compression Summary:
──────────────────────────────────────────────────
  entry.a2f9c1d4.js: 245.67KB → gzip: 78.23KB (68.2%)
  styles.css: 45.12KB → gzip: 12.34KB (72.6%)
──────────────────────────────────────────────────
  Total: 290.79KB
  Gzipped: 90.57KB (68.9% reduction)
  Brotli: 75.68KB (74.0% reduction)
```

### Configuration

Control compression in `rynex.config.js`:

```javascript
export default {
  build: {
    compression: {
      gzip: true,      // Enable gzip compression
      brotli: true,    // Enable brotli compression
      threshold: 1024  // Only compress files > 1KB
    }
  }
}
```

### Disable Compression

```javascript
export default {
  build: {
    compression: {
      gzip: false,
      brotli: false
    }
  }
}
```

### Benefits

- **Faster page loads** (60-80% smaller files)
- **Reduced bandwidth** costs
- **Better SEO** (faster sites rank higher)
- **Improved UX** (quicker load times)

## 4. Enhanced Error Messages

### Before vs After

**Before:**
```
Error: Unexpected token }
    at Parser.parseExprAtom
    at Parser.parseExpr
```

**After:**
```
❌ SyntaxError: Unexpected token '}'

📁 File: src/components/Button.ts
📍 Line: 45, Column: 12

💻 Code:
  43 |   return (
  44 |     <button onClick={handleClick}>
> 45 |       {label}}
     |            ^
  46 |     </button>
  47 |   );

💡 Suggestion: Check for syntax errors like missing commas, brackets, or quotes.
```

### Smart Suggestions

Rynex provides helpful suggestions for common errors:

| Error Type | Suggestion |
|------------|------------|
| Module not found | Run `npm install <module>` |
| Syntax error | Check for typos, missing brackets |
| Type error | Verify data types |
| Permission denied | Check file permissions |
| File not found | Verify file path |

### Debug Mode

Get full stack traces with `--debug`:

```bash
rynex build --debug
```

## 5. Configuration Enhancements

### New Config Options

```javascript
// rynex.config.js
export default {
  // Entry and output
  entry: 'src/main.ts',
  output: 'dist/bundle.js',
  
  // Build settings
  minify: true,
  sourceMaps: true,
  
  // NEW: Compression
  build: {
    compression: {
      gzip: true,
      brotli: true,
      threshold: 1024
    },
    splitting: true,
    chunkSize: 500
  },
  
  // NEW: Path resolution
  resolve: {
    alias: {
      '@lib': 'src/library',
      '@types': 'src/types'
    }
  },
  
  // Routing
  routing: {
    mode: 'history',
    fileBasedRouting: true,
    pagesDir: 'src/pages'
  },
  
  // HTML generation
  html: {
    title: 'My App',
    description: 'My awesome app',
    favicon: 'favicon.svg'
  }
}
```

## 📚 Best Practices

### 1. Use Path Aliases

```typescript
// ✅ Good
import { Button } from '@components/Button';
import { api } from '@services/api';

// ❌ Avoid
import { Button } from '../../../components/Button';
import { api } from '../../../../services/api';
```

### 2. Enable Compression in Production

```javascript
export default {
  build: {
    compression: {
      gzip: true,
      brotli: true
    }
  }
}
```

### 3. Monitor Build Times

Use the build summary to identify slow steps and optimize accordingly.

### 4. Use Debug Mode for Errors

```bash
rynex build --debug
```

### 5. Organize with Aliases

Structure your project to take advantage of aliases:

```
src/
├── app/          # @app/*
├── components/   # @components/*
├── pages/        # @pages/*
├── hooks/        # @hooks/*
├── services/     # @services/*
├── utils/        # @utils/*
├── styles/       # @styles/*
└── assets/       # @assets/*
```

## 🎓 Examples

### Example 1: Component with Aliases

```typescript
// src/components/UserCard.ts
import { formatDate } from '@utils/date';
import { Avatar } from '@components/Avatar';
import { useUser } from '@hooks/useUser';
import '@styles/card.css';

export function UserCard() {
  const user = useUser();
  
  return {
    view: `
      <div class="user-card">
        ${Avatar({ src: user.avatar })}
        <h3>${user.name}</h3>
        <p>Joined: ${formatDate(user.joinedAt)}</p>
      </div>
    `
  };
}
```

### Example 2: Service with Error Handling

```typescript
// src/services/api.ts
export async function fetchUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    // Rynex will show enhanced error with context
    throw error;
  }
}
```

### Example 3: Optimized Build Config

```javascript
// rynex.config.js
export default {
  entry: 'src/main.ts',
  output: 'dist/bundle.js',
  minify: true,
  sourceMaps: true,
  
  build: {
    compression: {
      gzip: true,
      brotli: true,
      threshold: 2048  // Only compress files > 2KB
    }
  },
  
  resolve: {
    alias: {
      '@': 'src',  // Shorthand for src/*
    }
  }
}
```

## 🚀 Migration Guide

### Migrating to Path Aliases

1. **Update imports** in your files:
   ```typescript
   // Before
   import { Button } from '../components/Button';
   
   // After
   import { Button } from '@components/Button';
   ```

2. **Update tsconfig.json** (optional for custom aliases):
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@custom/*": ["src/custom/*"]
       }
     }
   }
   ```

3. **Rebuild** your project:
   ```bash
   rynex build
   ```

### Enabling Compression

Just rebuild with minify enabled:

```bash
rynex build  # Compression is automatic in production
```

Or configure in `rynex.config.js`:

```javascript
export default {
  minify: true,  // Enables compression
  build: {
    compression: {
      gzip: true,
      brotli: true
    }
  }
}
```

## 📊 Performance Impact

### Build Times

- **Progress tracking**: ~0ms overhead
- **Path aliases**: ~10-50ms (one-time resolution)
- **Compression**: ~200-500ms (production only)

### Bundle Sizes

With compression enabled:
- **Gzip**: 60-70% reduction
- **Brotli**: 70-80% reduction

### Example Savings

| File | Original | Gzipped | Brotli | Savings |
|------|----------|---------|--------|---------|
| bundle.js | 245KB | 78KB | 65KB | 73% |
| styles.css | 45KB | 12KB | 10KB | 78% |
| **Total** | **290KB** | **90KB** | **75KB** | **74%** |

## 🎉 Summary

Rynex now includes:

- ✅ **Path aliases** for cleaner imports
- ✅ **Build progress** with detailed timing
- ✅ **Asset compression** (gzip + brotli)
- ✅ **Enhanced errors** with context
- ✅ **Better config** options

All features work seamlessly together to provide a better developer experience and improved build performance!
