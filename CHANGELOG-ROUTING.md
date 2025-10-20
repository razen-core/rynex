# Rynex Routing Update - What's New

## 🎉 Major Updates

### ✅ Complete Routing System Added

#### 1. **Client-Side Router** (`src/runtime/router.ts`)
- Full-featured SPA router with History API
- Dynamic routes: `/user/:id`, `/blog/:slug`
- Catch-all routes: `/docs/*`
- Optional parameters: `/user/:id?`
- Nested routes support
- Lazy loading with code splitting
- Route guards for authentication
- Express-like middleware chain
- Query parameter parsing
- Hash navigation support

#### 2. **File-Based Routing** (`src/cli/route-scanner.ts`)
- Next.js style automatic route generation
- Scans `src/pages/` directory
- Dynamic segments: `[id].ts` → `:id`
- Catch-all: `[...slug].ts` → `*`
- Optional catch-all: `[[...slug]].ts`
- Special files: `layout.ts`, `loading.ts`, `error.ts`, `middleware.ts`
- Auto-generates route manifest
- Route specificity sorting

#### 3. **Router Components** (`src/runtime/helpers/routing.ts`)
- `Link()` - Router-aware links
- `NavLink()` - Links with active state
- `RouterOutlet()` - Route container
- `Breadcrumb()` - Auto breadcrumbs
- `BackButton()` - Browser back
- `RouteLoading()` - Loading spinner
- `NotFound()` - 404 page
- `RouteGuard()` - Conditional rendering
- `RouteParamsDebug()` - Debug info

#### 4. **Router Hooks**
- `useParams()` - Access route params
- `useQuery()` - Access query params
- `useNavigate()` - Navigation functions

### ✅ Production Server Added

#### 5. **Production Server** (`src/cli/prod-server.ts`)
- **Express integration** - Uses Express if installed
- **Native HTTP fallback** - Works without Express
- Auto-detects Express availability
- Compression support (with Express)
- Static file caching with ETags
- SPA fallback routing
- Proper MIME type detection
- Performance logging

#### 6. **New CLI Command**
```bash
rynex start  # Start production server
```

### ✅ Enhanced Configuration

#### 7. **Extended Config** (`src/cli/config.ts`)
```javascript
{
  routing: {
    mode: 'history',              // 'history' or 'hash'
    base: '/',
    fileBasedRouting: true,       // Enable file-based routing
    pagesDir: 'src/pages',
    scrollBehavior: 'smooth',
    trailingSlash: false
  },
  middleware: {
    global: [],                   // Global middleware
    routes: {}                    // Route-specific middleware
  },
  build: {
    splitting: true,              // Code splitting
    chunkSize: 500,
    publicPath: '/',
    analyze: false
  }
}
```

### ✅ Updated Dev Server

#### 8. **Enhanced Dev Server** (`src/cli/dev-server.ts`)
- Express-like middleware stack
- CORS support
- Request logging with timing
- File-based route matching
- SPA fallback for routes
- Query parameter parsing

### ✅ Updated Builder

#### 9. **Enhanced Builder** (`src/cli/builder.ts`)
- Route scanning integration
- Route manifest generation
- Router config generation
- Config passed to all build steps

### ✅ Project Tree Examples

#### 10. **New Example Files**
- `project-tree/src/pages/user/[id]/page.ts` - Dynamic route example
- `project-tree/src/pages/blog/page.ts` - Blog listing
- `project-tree/src/pages/blog/[slug]/page.ts` - Blog post with dynamic slug
- `project-tree/src/AppWithRouter.ts` - Complete router example

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "express": "^4.18.2"  // Optional, fallback to native HTTP
  }
}
```

## 🚀 Usage Examples

### Basic Router Setup
```typescript
import { createRouter } from 'rynex';

const router = createRouter([
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/user/:id', component: UserPage }
]);

router.mount(document.getElementById('app'));
```

### File-Based Routing
```
src/pages/
├── index.ts              → /
├── about.ts              → /about
├── blog/
│   ├── page.ts           → /blog
│   └── [slug]/
│       └── page.ts       → /blog/:slug
└── user/
    └── [id]/
        └── page.ts       → /user/:id
```

### Navigation
```typescript
import { useNavigate } from 'rynex';

const navigate = useNavigate(router);
navigate.push('/about');
navigate.back();
```

### Middleware
```typescript
router.use((ctx, next) => {
  console.log(`Navigating to: ${ctx.path}`);
  next();
});
```

### Route Guards
```typescript
router.addRoute({
  path: '/admin',
  component: AdminPage,
  guards: [isAuthenticated, isAdmin]
});
```

## 🎯 CLI Commands

```bash
# Development
rynex init my-app        # Create new project
rynex dev                # Dev server with HMR

# Production
rynex build              # Build for production
rynex start              # Start production server

# Utilities
rynex clean              # Clean build artifacts
rynex help               # Show help
```

## 📝 Configuration Files

### rynex.config.js
```javascript
export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  port: 3000,
  routing: {
    fileBasedRouting: true,
    pagesDir: 'src/pages'
  }
};
```

## 🔧 Build & Run

```bash
# Build framework
pnpm build:framework

# Run in project
cd project-tree
pnpm dev                  # Development mode
pnpm build                # Production build
rynex start              # Start production server
```

## 📊 What's Included

### Runtime (~15KB)
- ✅ Router system
- ✅ Route components
- ✅ Navigation hooks
- ✅ State management
- ✅ DOM helpers
- ✅ 200+ UI helpers

### CLI Tools
- ✅ Route scanner
- ✅ Dev server
- ✅ Production server
- ✅ Builder with route support
- ✅ Project initialization

### Developer Experience
- ✅ TypeScript support
- ✅ Hot reload
- ✅ Source maps
- ✅ Fast builds (ESBuild)
- ✅ File watching
- ✅ Clear logging

## 🎉 Summary

**Added 7 new major features:**
1. ✅ Client-side router with dynamic routes
2. ✅ File-based routing (Next.js style)
3. ✅ Router components and hooks
4. ✅ Production server (Express + fallback)
5. ✅ Enhanced configuration
6. ✅ Middleware system
7. ✅ Route guards and lazy loading

**Total new files:** 5
- `src/runtime/router.ts`
- `src/runtime/helpers/routing.ts`
- `src/cli/route-scanner.ts`
- `src/cli/prod-server.ts`
- Updated: `src/cli/dev-server.ts`, `src/cli/builder.ts`, `src/cli/config.ts`

**Framework is now production-ready with full routing capabilities!** 🚀
