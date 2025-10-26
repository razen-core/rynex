# Rynex Project Architecture & Compilation Flow

## Overview
This document explains the complete architecture of Rynex projects, compilation process, and file paths for both simple and routed applications.

---

## Project Type 1: Simple SPA (builder-api-demo)

### Project Structure
```
builder-api-demo/
├── src/
│   ├── index.ts          # Entry point - imports App and renders
│   └── App.ts            # Main application component
├── public/
│   ├── index.html        # HTML template (source)
│   └── styles.css        # Global styles (optional)
├── dist/                 # BUILD OUTPUT (generated)
│   ├── bundel.[hash].js  # Compiled bundle (production)
│   ├── bundel.js         # Compiled bundle (development)
│   ├── bundel.*.js.map   # Source maps
│   ├── index.html        # Processed HTML with bundle reference
│   ├── styles.css        # Copied from public/
│   └── build-manifest.json  # Build metadata
├── rynex.config.js       # Configuration
├── package.json
└── tsconfig.json
```

### Configuration
```javascript
// rynex.config.js
export default {
  entry: "src/index.ts",        // Entry point
  output: "dist/bundel.js",     // Output bundle path
  minify: false,                // Dev mode (true for production)
  sourceMaps: true,
  port: 3000,
  hotReload: true
};
```

### Compilation Flow

#### Development Mode (`pnpm dev`)
```
1. Validation Phase
   ├── Run Rynex validation (src/**/*.ts)
   └── Run TypeScript type checking

2. Build Phase
   ├── Read: src/index.ts
   ├── Transform: Rynex syntax → Standard JS
   ├── Bundle: All imports with Rolldown
   ├── Output: dist/bundel.js (NO HASH in dev)
   └── Generate: dist/bundel.js.map

3. Public Files Copy
   ├── Copy: public/index.html → dist/index.html
   ├── Copy: public/styles.css → dist/styles.css
   └── Update: dist/index.html (add cache headers)

4. HTML Validation
   ├── Check: Script references
   ├── Check: Meta tags
   └── Auto-fix: If user confirms

5. Watch Mode
   ├── Monitor: src/**/*.ts changes
   ├── Rebuild: dist/bundel.js (overwrite)
   └── Trigger: Hot reload via SSE

6. Dev Server
   ├── Serve: dist/ directory
   ├── Port: 3000
   └── HMR: /__rynex_hmr endpoint
```

#### Production Mode (`pnpm build`)
```
1. Validation Phase (same as dev)

2. Build Phase
   ├── Read: src/index.ts
   ├── Transform: Rynex syntax → Standard JS
   ├── Bundle: All imports with Rolldown
   ├── Minify: Code optimization
   ├── Output: dist/bundel.js
   └── Generate: dist/bundel.js.map

3. Hashing Phase (PRODUCTION ONLY)
   ├── Calculate: Content hash of bundel.js
   ├── Rename: bundel.js → bundel.[hash].js
   ├── Rename: bundel.js.map → bundel.[hash].js.map
   └── Clean: Old bundel.[oldhash].js files

4. Public Files Copy
   ├── Copy: public/index.html → dist/index.html
   ├── Copy: public/styles.css → dist/styles.css
   └── Update: dist/index.html

5. HTML Update
   ├── Inject: Cache control headers
   ├── Replace: src="bundel.js" → src="bundel.[hash].js"
   └── Add: build-version meta tag

6. HTML Validation
   └── Auto-fix: Always in production

7. Build Manifest
   └── Create: dist/build-manifest.json
       {
         "buildHash": "abc123",
         "timestamp": 1234567890,
         "files": { "main": "bundel.abc123.js" }
       }
```

### File Paths Mapping
```
SOURCE                    →  COMPILED (DEV)           →  COMPILED (PROD)
─────────────────────────────────────────────────────────────────────────
src/index.ts              →  dist/bundel.js           →  dist/bundel.[hash].js
src/App.ts                →  (bundled in bundel.js)   →  (bundled in bundel.[hash].js)
public/index.html         →  dist/index.html          →  dist/index.html (updated)
public/styles.css         →  dist/styles.css          →  dist/styles.css
```

---

## Project Type 2: File-Based Routing (project-tree)

### Project Structure
```
project-tree/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── App.ts                      # Root app component
│   ├── components/
│   │   ├── Header.ts               # Shared component
│   │   └── Sidebar.ts              # Shared component
│   └── pages/                      # File-based routes
│       ├── home/
│       │   └── page.ts             # Route: /
│       ├── about/
│       │   └── page.ts             # Route: /about
│       └── blog/
│           ├── page.ts             # Route: /blog
│           └── [slug]/
│               └── page.ts         # Route: /blog/:slug (dynamic)
├── public/
│   └── index.html
├── dist/                           # BUILD OUTPUT
│   ├── index.js                    # Main bundle
│   ├── bundle.js                   # Alternative main bundle
│   ├── pages/
│   │   ├── home/
│   │   │   ├── page.html           # Page HTML
│   │   │   └── bundel.js           # Page-specific bundle
│   │   ├── about/
│   │   │   ├── page.html
│   │   │   └── bundel.js
│   │   └── blog/
│   │       ├── page.html
│   │       └── bundel.js
│   ├── components/
│   │   ├── Header.bundel.js        # Component bundle
│   │   └── Sidebar.bundel.js       # Component bundle
│   ├── route-manifest.js           # Generated route config
│   ├── router-config.js            # Router initialization
│   ├── index.html                  # Main HTML
│   └── styles.css
├── rynex.config.js
├── package.json
└── tsconfig.json
```

### Configuration
```javascript
// rynex.config.js
export default {
  entry: 'src/index.ts',
  output: 'dist/index.js',
  minify: false,
  sourceMaps: true,
  port: 3000,
  hotReload: true,
  
  // Routing Configuration
  routing: {
    mode: 'history',              // 'history' or 'hash'
    base: '/',
    fileBasedRouting: true,       // Enable file-based routing
    pagesDir: 'src/pages',        // Pages directory
    scrollBehavior: 'smooth',
    trailingSlash: false
  },
  
  // Manual routes (optional, merged with file-based)
  routes: [
    { path: '/', component: 'dist/pages/home/page.html' },
    { path: '/about', component: 'dist/pages/about/page.html' }
  ]
};
```

### Compilation Flow (with Routing)

#### Build Phase
```
1. Validation Phase (same as simple SPA)

2. Route Scanning Phase
   ├── Scan: src/pages/**/*.ts
   ├── Detect: File-based routes
   │   ├── src/pages/home/page.ts → Route: /
   │   ├── src/pages/about/page.ts → Route: /about
   │   ├── src/pages/blog/page.ts → Route: /blog
   │   └── src/pages/blog/[slug]/page.ts → Route: /blog/:slug
   ├── Generate: dist/route-manifest.js
   └── Generate: dist/router-config.js

3. Component Building Phase
   ├── Scan: src/components/**/*.ts
   ├── Build: src/components/Header.ts → dist/components/Header.bundel.js
   └── Build: src/components/Sidebar.ts → dist/components/Sidebar.bundel.js

4. Page Building Phase
   For each page in src/pages/:
   ├── Build: page.ts → dist/pages/[route]/bundel.js
   ├── Generate: dist/pages/[route]/page.html
   └── Include: Route metadata

5. Main Entry Building
   ├── Build: src/index.ts → dist/index.js
   ├── Include: Router initialization
   └── Include: Route manifest

6. Public Files & HTML Processing (same as simple SPA)

7. Build Manifest Creation
```

### File Paths Mapping (Routing)
```
SOURCE                              →  COMPILED
────────────────────────────────────────────────────────────────────
src/index.ts                        →  dist/index.js (main entry)
src/App.ts                          →  (bundled in index.js)

src/pages/home/page.ts              →  dist/pages/home/bundel.js
                                    →  dist/pages/home/page.html

src/pages/about/page.ts             →  dist/pages/about/bundel.js
                                    →  dist/pages/about/page.html

src/pages/blog/page.ts              →  dist/pages/blog/bundel.js
                                    →  dist/pages/blog/page.html

src/pages/blog/[slug]/page.ts       →  dist/pages/blog/[slug]/bundel.js
                                    →  dist/pages/blog/[slug]/page.html

src/components/Header.ts            →  dist/components/Header.bundel.js
src/components/Sidebar.ts           →  dist/components/Sidebar.bundel.js

(Generated files)
                                    →  dist/route-manifest.js
                                    →  dist/router-config.js
                                    →  dist/bundle.js (alternative)
```

---

## Build System Architecture

### Core Build Pipeline
```
┌─────────────────────────────────────────────────────────────┐
│                     RYNEX CLI ENTRY                         │
│                  (src/cli/bin/rynex.ts)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─→ init    (Project initialization)
                     ├─→ dev     (Development mode)
                     ├─→ build   (Production build)
                     ├─→ start   (Production server)
                     └─→ add     (Add integrations)
                     
┌─────────────────────────────────────────────────────────────┐
│                    BUILD COMMAND FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. Load Config (src/cli/config.ts)
   └─→ Read rynex.config.js

2. Validation (src/cli/rynex-validator.ts)
   └─→ Check Rynex syntax errors

3. Type Checking (src/cli/type-checker.ts)
   └─→ Run TypeScript compiler

4. Build Process (src/cli/builder.ts)
   ├─→ Route Scanning (if routing enabled)
   │   └─→ src/cli/route-scanner.ts
   │       ├─→ Scan pages directory
   │       ├─→ Generate route manifest
   │       └─→ Generate router config
   │
   ├─→ Component Building
   │   └─→ Build each component separately
   │
   ├─→ Page Building
   │   └─→ Build each page with its bundle
   │
   ├─→ Main Entry Building
   │   └─→ Rolldown bundler
   │       ├─→ Transform imports
   │       ├─→ Parse Rynex syntax
   │       ├─→ Bundle dependencies
   │       └─→ Output bundle
   │
   ├─→ Hashing (production only)
   │   └─→ src/cli/hash-utils.ts
   │       ├─→ Generate content hash
   │       ├─→ Rename bundles
   │       └─→ Clean old bundles
   │
   ├─→ Public Files Copy
   │   └─→ Copy public/ → dist/
   │
   ├─→ HTML Processing
   │   ├─→ Inject cache headers
   │   └─→ Update bundle references
   │
   └─→ HTML Validation (src/cli/html-validator.ts)
       ├─→ Check meta tags
       ├─→ Check script references
       ├─→ Check accessibility
       └─→ Auto-fix issues

5. Build Manifest (src/cli/hash-utils.ts)
   └─→ Create build-manifest.json
```

### Key Components

#### 1. Builder (src/cli/builder.ts)
- Main build orchestrator
- Handles both simple and routed projects
- Manages compilation pipeline
- Integrates with Rolldown

#### 2. Route Scanner (src/cli/route-scanner.ts)
- Scans `src/pages/` directory
- Generates route manifest
- Creates router configuration
- Handles dynamic routes `[param]`

#### 3. Hash Utils (src/cli/hash-utils.ts)
- Content-based hashing
- Bundle renaming
- Old file cleanup
- Build manifest creation

#### 4. HTML Validator (src/cli/html-validator.ts)
- 9+ validation checks
- Auto-fix capabilities
- Bundle reference validation
- Accessibility checks

#### 5. Dev Server (src/cli/dev-server.ts)
- Serves dist/ directory
- Hot module reload (HMR)
- Route handling
- Build info endpoint

---

## Common Issues & Solutions

### Issue 1: Bundle Not Found
**Problem:** HTML references `bundel.js` but file is `bundel.[hash].js`

**Cause:** 
- Production build creates hashed bundles
- Dev mode uses non-hashed bundles
- HTML not updated correctly

**Solution:**
- Dev mode: Keep `bundel.js` (no hashing)
- Production: Hash to `bundel.[hash].js` and update HTML
- HTML validator recognizes both patterns

### Issue 2: Watch Mode Conflicts
**Problem:** Watch rebuilds to `bundel.js` but HTML has `bundel.[hash].js`

**Solution:**
- Watch mode only runs in dev
- Dev mode doesn't hash bundles
- Both use `bundel.js`

### Issue 3: Route Manifest Not Found
**Problem:** Router can't find route-manifest.js

**Cause:**
- Route scanning not enabled
- Pages directory wrong
- Build didn't complete

**Solution:**
- Enable `fileBasedRouting: true` in config
- Ensure `pagesDir` points to correct location
- Check build logs for errors

---

## Path Resolution Rules

### Import Paths
```typescript
// In source files (src/)
import { render } from 'rynex';                    // Package import
import App from './App.js';                        // Relative import
import { Header } from '../components/Header.js';  // Relative import

// After compilation (dist/)
// All imports are bundled into single file
```

### Asset Paths
```html
<!-- In public/index.html -->
<script type="module" src="bundel.js"></script>

<!-- After build (dist/index.html) -->
<!-- Dev mode -->
<script type="module" src="bundel.js"></script>

<!-- Production mode -->
<script type="module" src="bundel.abc123.js"></script>
```

### Route Paths
```javascript
// File-based routing
src/pages/home/page.ts          → Route: /
src/pages/about/page.ts         → Route: /about
src/pages/blog/page.ts          → Route: /blog
src/pages/blog/[slug]/page.ts   → Route: /blog/:slug
src/pages/user/[id]/edit.ts     → Route: /user/:id/edit
```

---

## Build Output Comparison

### Simple SPA (builder-api-demo)
```
dist/
├── bundel.js (dev) or bundel.[hash].js (prod)
├── bundel.*.js.map
├── index.html
├── styles.css
└── build-manifest.json

Total files: ~5
Bundle size: ~170KB (unminified)
```

### Routed App (project-tree)
```
dist/
├── index.js                    # Main entry
├── bundle.js                   # Alternative main
├── pages/
│   ├── home/
│   │   ├── bundel.js          # Page bundle
│   │   └── page.html          # Page HTML
│   ├── about/
│   │   ├── bundel.js
│   │   └── page.html
│   └── blog/
│       ├── bundel.js
│       └── page.html
├── components/
│   ├── Header.bundel.js       # Component bundle
│   └── Sidebar.bundel.js      # Component bundle
├── route-manifest.js          # Generated routes
├── router-config.js           # Router setup
├── index.html
├── styles.css
└── build-manifest.json

Total files: ~15+
Bundle size: Varies by page
```

---

## Performance Considerations

### Bundle Splitting
- **Simple SPA:** Single bundle (all code)
- **Routed App:** Multiple bundles (code splitting)
  - Main bundle: Core app + router
  - Page bundles: Page-specific code
  - Component bundles: Shared components

### Caching Strategy
- **Dev mode:** No hashing, no caching
- **Production:** Content-based hashing
  - Bundle changes → New hash → Cache invalidation
  - Bundle same → Same hash → Cache hit

### Load Performance
- **Simple SPA:** 
  - Initial load: Full bundle
  - Navigation: Client-side only
  
- **Routed App:**
  - Initial load: Main bundle + current page
  - Navigation: Load page bundle on demand
  - Shared components: Cached after first load

---

## Next Steps for Improvement

1. **Path Consistency**
   - Standardize bundle naming (bundel vs bundle)
   - Consistent output directory structure
   - Clear separation of dev/prod outputs

2. **Build Optimization**
   - Implement tree-shaking
   - Optimize bundle splitting
   - Add compression (gzip/brotli)

3. **Developer Experience**
   - Better error messages
   - Build progress indicators
   - Clearer validation feedback

4. **Documentation**
   - API reference
   - Migration guides
   - Best practices

---

## Summary

**Simple SPA (builder-api-demo):**
- Single entry point
- One bundle output
- No routing complexity
- Fast builds
- Best for: Small apps, demos, prototypes

**Routed App (project-tree):**
- Multiple entry points (pages)
- Multiple bundle outputs
- File-based routing
- Slower builds (more files)
- Best for: Large apps, multi-page sites, complex navigation

Both architectures share the same core build system but differ in complexity and output structure.
