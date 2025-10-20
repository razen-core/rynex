# Routing Guide

Complete guide to routing in ZenWeb applications.

## Table of Contents

1. [Overview](#overview)
2. [File-Based Routing](#file-based-routing)
3. [Programmatic Routing](#programmatic-routing)
4. [Dynamic Routes](#dynamic-routes)
5. [Navigation](#navigation)
6. [Middleware](#middleware)
7. [Route Guards](#route-guards)
8. [Lazy Loading](#lazy-loading)
9. [Advanced Patterns](#advanced-patterns)

---

## Overview

ZenWeb provides two routing approaches:

1. **File-Based Routing**: Automatic route generation from file structure (Next.js style)
2. **Programmatic Routing**: Manual route configuration with full control

Both approaches can be used together in the same application.

---

## File-Based Routing

### Enable File-Based Routing

Configure in `zenweb.config.js`:

```javascript
export default {
  routing: {
    mode: 'history',
    fileBasedRouting: true,
    pagesDir: 'src/pages',
    scrollBehavior: 'smooth'
  }
};
```

### Directory Structure

```
src/pages/
├── index.ts              # Route: /
├── about.ts              # Route: /about
├── contact.ts            # Route: /contact
├── blog/
│   ├── page.ts           # Route: /blog
│   ├── [slug]/
│   │   └── page.ts       # Route: /blog/:slug
│   └── [...all]/
│       └── page.ts       # Route: /blog/* (catch-all)
└── user/
    └── [id]/
        ├── page.ts       # Route: /user/:id
        ├── loading.ts    # Loading state
        └── error.ts      # Error boundary
```

### Basic Page

Create `src/pages/about.ts`:

```typescript
import * as UI from 'zenweb';

export default function AboutPage() {
  return UI.vbox({
    style: { padding: '2rem' }
  }, [
    UI.h1({}, 'About Us'),
    UI.text({}, 'Welcome to our about page'),
    UI.link({ href: '/' }, 'Go Home')
  ]);
}
```

### Dynamic Segments

Use square brackets for dynamic segments:

**File**: `src/pages/blog/[slug]/page.ts`

```typescript
import * as UI from 'zenweb';
import { RouteContext } from 'zenweb';

export default function BlogPost(ctx: RouteContext) {
  const slug = ctx.params.slug;
  
  return UI.vbox({
    style: { padding: '2rem' }
  }, [
    UI.h1({}, `Blog Post: ${slug}`),
    UI.text({}, `Reading article: ${slug}`),
    UI.link({ href: '/blog' }, 'Back to Blog')
  ]);
}
```

### Catch-All Routes

Use `[...param]` for catch-all routes:

**File**: `src/pages/docs/[...slug]/page.ts`

```typescript
import * as UI from 'zenweb';
import { RouteContext } from 'zenweb';

export default function DocsPage(ctx: RouteContext) {
  const path = ctx.params.slug || '';
  
  return UI.vbox({
    style: { padding: '2rem' }
  }, [
    UI.h1({}, 'Documentation'),
    UI.text({}, `Path: /${path}`),
    UI.text({}, 'This catches all /docs/* routes')
  ]);
}
```

### Optional Catch-All

Use `[[...param]]` for optional catch-all:

**File**: `src/pages/shop/[[...category]]/page.ts`

```typescript
export default function ShopPage(ctx: RouteContext) {
  const category = ctx.params.category || 'all';
  
  return UI.vbox({}, [
    UI.h1({}, `Shop: ${category}`),
    UI.text({}, 'Matches /shop and /shop/electronics/phones')
  ]);
}
```

---

## Programmatic Routing

### Create Router

```typescript
import { createRouter } from 'zenweb';
import HomePage from './pages/Home.js';
import AboutPage from './pages/About.js';
import UserPage from './pages/User.js';

const router = createRouter([
  {
    path: '/',
    component: HomePage,
    name: 'home'
  },
  {
    path: '/about',
    component: AboutPage,
    name: 'about'
  },
  {
    path: '/user/:id',
    component: UserPage,
    name: 'user'
  }
]);
```

### Mount Router

```typescript
import * as UI from 'zenweb';

export default function App() {
  return UI.vbox({}, [
    UI.nav({}, [
      UI.link({ href: '/' }, 'Home'),
      UI.link({ href: '/about' }, 'About')
    ]),
    UI.RouterOutlet(router)
  ]);
}
```

### Add Routes Dynamically

```typescript
router.addRoute({
  path: '/settings',
  component: SettingsPage,
  name: 'settings'
});

// Add multiple routes
router.addRoutes([
  { path: '/profile', component: ProfilePage },
  { path: '/dashboard', component: DashboardPage }
]);
```

---

## Dynamic Routes

### Route Parameters

Access route parameters using the context:

```typescript
import { RouteContext } from 'zenweb';

export default function ProductPage(ctx: RouteContext) {
  const productId = ctx.params.id;
  const category = ctx.params.category;
  
  return UI.vbox({}, [
    UI.h1({}, `Product ${productId}`),
    UI.text({}, `Category: ${category}`)
  ]);
}
```

### Query Parameters

Access query parameters from the URL:

```typescript
export default function SearchPage(ctx: RouteContext) {
  const query = ctx.query.q || '';
  const page = ctx.query.page || '1';
  const filters = ctx.query.filter; // Can be array
  
  return UI.vbox({}, [
    UI.h1({}, 'Search Results'),
    UI.text({}, `Query: ${query}`),
    UI.text({}, `Page: ${page}`)
  ]);
}
```

### Hash Fragments

Access hash fragments:

```typescript
export default function DocumentPage(ctx: RouteContext) {
  const section = ctx.hash; // e.g., "#introduction"
  
  return UI.vbox({}, [
    UI.h1({}, 'Documentation'),
    UI.text({}, `Section: ${section}`)
  ]);
}
```

---

## Navigation

### Using Links

```typescript
import * as UI from 'zenweb';

// Basic link
UI.link({ href: '/about' }, 'About Us')

// Link with styling
UI.link({
  href: '/contact',
  style: {
    color: '#3498db',
    textDecoration: 'none',
    padding: '0.5rem 1rem'
  }
}, 'Contact')

// External link (won't use router)
UI.link({
  href: 'https://example.com',
  target: '_blank',
  rel: 'noopener noreferrer'
}, 'External Link')
```

### Programmatic Navigation

```typescript
import { useNavigate } from 'zenweb';

export default function MyComponent() {
  const navigate = useNavigate(router);
  
  const goToAbout = () => {
    navigate.push('/about');
  };
  
  const goBack = () => {
    navigate.back();
  };
  
  return UI.vbox({}, [
    UI.button({ onClick: goToAbout }, 'Go to About'),
    UI.button({ onClick: goBack }, 'Go Back')
  ]);
}
```

### Navigation Options

```typescript
// Push new route
navigate.push('/about');

// Replace current route (no history entry)
navigate.replace('/login');

// Navigate with state
navigate.push('/user/123', {
  state: { from: 'search' }
});

// Navigate without scrolling
navigate.push('/blog', {
  scroll: false
});

// Browser history
navigate.back();      // Go back
navigate.forward();   // Go forward
navigate.go(-2);      // Go back 2 pages
```

---

## Middleware

### Global Middleware

Add middleware that runs on every route:

```typescript
router.use((ctx, next) => {
  console.log(`Navigating to: ${ctx.path}`);
  console.log('Params:', ctx.params);
  console.log('Query:', ctx.query);
  next();
});
```

### Route-Specific Middleware

Add middleware to specific routes:

```typescript
// Authentication middleware
const authMiddleware = (ctx, next) => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  next();
};

// Add to route
router.addRoute({
  path: '/dashboard',
  component: DashboardPage,
  middleware: [authMiddleware]
});
```

### Logging Middleware

```typescript
const loggingMiddleware = (ctx, next) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  console.log(`Route ${ctx.path} took ${duration}ms`);
};

router.use(loggingMiddleware);
```

### Data Loading Middleware

```typescript
const loadUserMiddleware = async (ctx, next) => {
  const userId = ctx.params.id;
  const user = await fetchUser(userId);
  ctx.data = { user };
  next();
};

router.addRoute({
  path: '/user/:id',
  component: (ctx) => {
    const user = ctx.data.user;
    return UI.vbox({}, [
      UI.h1({}, user.name),
      UI.text({}, user.email)
    ]);
  },
  middleware: [loadUserMiddleware]
});
```

---

## Route Guards

### Authentication Guard

```typescript
const isAuthenticated = (ctx) => {
  return !!localStorage.getItem('token');
};

router.addRoute({
  path: '/admin',
  component: AdminPage,
  guards: [isAuthenticated]
});
```

### Role-Based Guard

```typescript
const isAdmin = async (ctx) => {
  const user = await getCurrentUser();
  return user?.role === 'admin';
};

router.addRoute({
  path: '/admin/users',
  component: UserManagementPage,
  guards: [isAuthenticated, isAdmin]
});
```

### Multiple Guards

```typescript
const hasSubscription = (ctx) => {
  return checkSubscription();
};

router.addRoute({
  path: '/premium',
  component: PremiumPage,
  guards: [
    isAuthenticated,
    hasSubscription
  ]
});
```

---

## Lazy Loading

### Lazy Load Routes

```typescript
router.addRoute({
  path: '/dashboard',
  lazy: () => import('./pages/Dashboard.js'),
  name: 'dashboard'
});
```

### Code Splitting

Lazy loading automatically creates separate bundles:

```typescript
const router = createRouter([
  {
    path: '/',
    component: HomePage  // Included in main bundle
  },
  {
    path: '/admin',
    lazy: () => import('./pages/Admin.js')  // Separate bundle
  },
  {
    path: '/reports',
    lazy: () => import('./pages/Reports.js')  // Separate bundle
  }
]);
```

### Loading States

Show loading indicator while lazy loading:

```typescript
router.setLoadingHandler(() => {
  return UI.RouteLoading({
    text: 'Loading page...'
  });
});
```

---

## Advanced Patterns

### Nested Routes

```typescript
router.addRoute({
  path: '/admin',
  component: AdminLayout,
  children: [
    {
      path: '',
      component: AdminDashboard
    },
    {
      path: 'users',
      component: AdminUsers
    },
    {
      path: 'settings',
      component: AdminSettings
    }
  ]
});
```

### 404 Not Found

```typescript
router.setNotFound((ctx) => {
  return UI.NotFound({
    title: '404',
    message: `Page "${ctx.path}" not found`,
    homeLink: true
  });
});
```

### Error Handling

```typescript
router.setErrorHandler((error, ctx) => {
  console.error('Route error:', error);
  
  return UI.vbox({
    style: { padding: '2rem', textAlign: 'center' }
  }, [
    UI.h1({}, 'Something went wrong'),
    UI.text({}, error.message),
    UI.link({ href: '/' }, 'Go Home')
  ]);
});
```

### Route Transitions

```typescript
const fadeTransition = (ctx, next) => {
  const container = document.querySelector('.router-outlet');
  container.style.opacity = '0';
  
  setTimeout(() => {
    next();
    container.style.opacity = '1';
  }, 200);
};

router.use(fadeTransition);
```

### Breadcrumbs

```typescript
export default function PageWithBreadcrumbs() {
  return UI.vbox({}, [
    UI.Breadcrumb({
      separator: '>',
      class: 'breadcrumb-nav'
    }),
    UI.h1({}, 'Page Content')
  ]);
}
```

### Back Button

```typescript
UI.BackButton({
  text: 'Go Back',
  style: {
    padding: '0.5rem 1rem',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
})
```

---

## Configuration

### Router Configuration

```javascript
// zenweb.config.js
export default {
  routing: {
    mode: 'history',              // 'history' or 'hash'
    base: '/',                    // Base URL path
    fileBasedRouting: true,       // Enable file-based routing
    pagesDir: 'src/pages',        // Pages directory
    scrollBehavior: 'smooth',     // 'auto' | 'smooth' | 'instant'
    trailingSlash: false          // Add trailing slash to URLs
  }
};
```

### Hash Mode

Use hash mode for static hosting without server configuration:

```javascript
export default {
  routing: {
    mode: 'hash'  // URLs will be /#/about
  }
};
```

### Base Path

Deploy to a subdirectory:

```javascript
export default {
  routing: {
    base: '/my-app/'  // URLs will be /my-app/about
  }
};
```

---

## Best Practices

1. **Use File-Based Routing**: For most applications, file-based routing is simpler
2. **Lazy Load Heavy Pages**: Use lazy loading for admin panels, reports, etc.
3. **Implement Guards**: Protect sensitive routes with authentication guards
4. **Handle Errors**: Always implement error boundaries and 404 pages
5. **Use Middleware**: Extract common logic into reusable middleware
6. **Type Safety**: Use TypeScript and RouteContext type for parameters
7. **SEO**: Use history mode and proper meta tags for better SEO

---

## Summary

ZenWeb routing provides:
- File-based routing for automatic route generation
- Programmatic routing for full control
- Dynamic routes with parameters
- Middleware and guards for route protection
- Lazy loading for code splitting
- Comprehensive navigation API

Choose the approach that best fits your application needs.
