# Configuration Guide

Complete guide to configuring your Rynex application.

## Table of Contents

1. [Configuration File](#configuration-file)
2. [Entry and Output](#entry-and-output)
3. [Development Server](#development-server)
4. [Routing Configuration](#routing-configuration)
5. [Build Configuration](#build-configuration)
6. [Middleware Configuration](#middleware-configuration)
7. [TypeScript Configuration](#typescript-configuration)
8. [Environment Variables](#environment-variables)

---

## Configuration File

### Basic Configuration

Create `rynex.config.js` in your project root:

```javascript
export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  port: 3000,
  minify: true,
  sourceMaps: true,
  hotReload: true
};
```

### Full Configuration

```javascript
export default {
  // Entry point
  entry: 'src/index.ts',
  
  // Output file
  output: 'dist/bundle.js',
  
  // Development server port
  port: 3000,
  
  // Build options
  minify: true,
  sourceMaps: true,
  hotReload: true,
  
  // Routing configuration
  routing: {
    mode: 'history',
    base: '/',
    fileBasedRouting: true,
    pagesDir: 'src/pages',
    scrollBehavior: 'smooth',
    trailingSlash: false
  },
  
  // Middleware configuration
  middleware: {
    global: [],
    routes: {}
  },
  
  // Build configuration
  build: {
    splitting: true,
    chunkSize: 500,
    publicPath: '/',
    analyze: false
  },
  
  // Manual routes (optional)
  routes: []
};
```

---

## Entry and Output

### Entry Point

Specify your application's entry file:

```javascript
export default {
  entry: 'src/index.ts'
};
```

Multiple entries (advanced):

```javascript
export default {
  entry: {
    main: 'src/index.ts',
    admin: 'src/admin.ts'
  }
};
```

### Output Configuration

```javascript
export default {
  output: 'dist/bundle.js'
};
```

Custom output directory:

```javascript
export default {
  output: 'build/app.js'
};
```

---

## Development Server

### Port Configuration

```javascript
export default {
  port: 3000  // Default: 3000
};
```

### Hot Module Replacement

```javascript
export default {
  hotReload: true  // Enable HMR
};
```

### Source Maps

```javascript
export default {
  sourceMaps: true  // Enable source maps for debugging
};
```

---

## Routing Configuration

### Enable File-Based Routing

```javascript
export default {
  routing: {
    fileBasedRouting: true,
    pagesDir: 'src/pages'
  }
};
```

### Routing Mode

Choose between history and hash mode:

```javascript
export default {
  routing: {
    mode: 'history'  // or 'hash'
  }
};
```

**History Mode** (recommended):
- Clean URLs: `/about`
- Requires server configuration for SPA fallback

**Hash Mode**:
- URLs with hash: `/#/about`
- Works without server configuration
- Good for static hosting

### Base Path

Deploy to a subdirectory:

```javascript
export default {
  routing: {
    base: '/my-app/'
  }
};
```

### Scroll Behavior

```javascript
export default {
  routing: {
    scrollBehavior: 'smooth'  // 'auto' | 'smooth' | 'instant'
  }
};
```

### Trailing Slash

```javascript
export default {
  routing: {
    trailingSlash: true  // /about/ instead of /about
  }
};
```

### Complete Routing Config

```javascript
export default {
  routing: {
    mode: 'history',
    base: '/',
    fileBasedRouting: true,
    pagesDir: 'src/pages',
    scrollBehavior: 'smooth',
    trailingSlash: false
  }
};
```

---

## Build Configuration

### Code Splitting

```javascript
export default {
  build: {
    splitting: true  // Enable code splitting
  }
};
```

### Chunk Size

```javascript
export default {
  build: {
    chunkSize: 500  // Max chunk size in KB
  }
};
```

### Public Path

```javascript
export default {
  build: {
    publicPath: '/assets/'  // Path for static assets
  }
};
```

### Bundle Analysis

```javascript
export default {
  build: {
    analyze: true  // Generate bundle analysis
  }
};
```

### Minification

```javascript
export default {
  minify: true  // Minify output (production)
};
```

### Complete Build Config

```javascript
export default {
  minify: true,
  sourceMaps: true,
  build: {
    splitting: true,
    chunkSize: 500,
    publicPath: '/',
    analyze: false
  }
};
```

---

## Middleware Configuration

### Global Middleware

Middleware that runs on every route:

```javascript
export default {
  middleware: {
    global: [
      './src/middleware/logger.ts',
      './src/middleware/analytics.ts'
    ]
  }
};
```

### Route-Specific Middleware

```javascript
export default {
  middleware: {
    routes: {
      '/admin/*': ['./src/middleware/auth.ts'],
      '/api/*': ['./src/middleware/cors.ts']
    }
  }
};
```

### Example Middleware File

Create `src/middleware/logger.ts`:

```typescript
export default function loggerMiddleware(ctx, next) {
  console.log(`[${new Date().toISOString()}] ${ctx.path}`);
  next();
}
```

---

## TypeScript Configuration

### Basic tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"]
    }
  }
}
```

Usage:

```typescript
import Header from '@components/Header.js';
import HomePage from '@pages/Home.js';
```

---

## Environment Variables

### Using Environment Variables

Create `.env` file:

```
API_URL=https://api.example.com
API_KEY=your-api-key
NODE_ENV=development
```

Access in code:

```typescript
const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;
```

### Environment-Specific Config

Create multiple config files:

**rynex.config.dev.js**:
```javascript
export default {
  port: 3000,
  minify: false,
  sourceMaps: true
};
```

**rynex.config.prod.js**:
```javascript
export default {
  port: 8080,
  minify: true,
  sourceMaps: false
};
```

Use based on environment:

```javascript
// rynex.config.js
const isDev = process.env.NODE_ENV === 'development';

export default {
  port: isDev ? 3000 : 8080,
  minify: !isDev,
  sourceMaps: isDev
};
```

---

## Manual Routes Configuration

### Static Routes

```javascript
export default {
  routes: [
    {
      path: '/',
      component: 'dist/pages/home/page.html'
    },
    {
      path: '/about',
      component: 'dist/pages/about/page.html'
    }
  ]
};
```

### Dynamic Routes

```javascript
export default {
  routes: [
    {
      path: '/user/:id',
      component: 'dist/pages/user/page.html',
      lazy: true
    }
  ]
};
```

### Route Metadata

```javascript
export default {
  routes: [
    {
      path: '/admin',
      component: 'dist/pages/admin/page.html',
      name: 'admin',
      meta: {
        requiresAuth: true,
        title: 'Admin Panel'
      }
    }
  ]
};
```

---

## Production Configuration

### Optimized Production Build

```javascript
export default {
  minify: true,
  sourceMaps: false,
  build: {
    splitting: true,
    chunkSize: 300,
    analyze: false
  },
  routing: {
    mode: 'history'
  }
};
```

### Development Configuration

```javascript
export default {
  minify: false,
  sourceMaps: true,
  hotReload: true,
  build: {
    splitting: false,
    analyze: true
  }
};
```

---

## Configuration Examples

### Simple SPA

```javascript
export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  port: 3000,
  routing: {
    mode: 'history',
    fileBasedRouting: true
  }
};
```

### Multi-Page Application

```javascript
export default {
  entry: {
    main: 'src/index.ts',
    admin: 'src/admin.ts'
  },
  output: 'dist/[name].js',
  routing: {
    fileBasedRouting: true,
    pagesDir: 'src/pages'
  }
};
```

### Static Site

```javascript
export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  routing: {
    mode: 'hash',  // Works without server config
    fileBasedRouting: true
  },
  build: {
    splitting: false  // Single bundle for simplicity
  }
};
```

### Large Application

```javascript
export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  port: 3000,
  routing: {
    mode: 'history',
    fileBasedRouting: true,
    pagesDir: 'src/pages'
  },
  middleware: {
    global: ['./src/middleware/logger.ts'],
    routes: {
      '/admin/*': ['./src/middleware/auth.ts'],
      '/api/*': ['./src/middleware/cors.ts']
    }
  },
  build: {
    splitting: true,
    chunkSize: 500,
    analyze: true
  }
};
```

---

## Best Practices

1. **Use Environment Variables**: Keep sensitive data in environment variables
2. **Separate Configs**: Use different configs for development and production
3. **Enable Source Maps**: In development for easier debugging
4. **Code Splitting**: Enable for large applications
5. **File-Based Routing**: Use for better organization
6. **TypeScript**: Configure strict mode for type safety
7. **Minify Production**: Always minify production builds

---

## Summary

Rynex configuration provides:
- Flexible entry and output options
- Development server with HMR
- Comprehensive routing configuration
- Build optimization options
- Middleware support
- TypeScript integration

Configure your application based on your specific needs and deployment requirements.
