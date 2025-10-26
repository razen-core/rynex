# Rynex 2.0 Modernization Plan

## Overview
Modernize Rynex to match Next.js, React, and Vue best practices while maintaining the "HTML as shell, content from JS" principle.

## Architecture Changes

### 1. New Project Structure
```
my-rynex-app/
├── src/
│   ├── app/                   # Root app logic (Next.js App Router style)
│   │   ├── layout.ts          # Shared layout
│   │   ├── app.ts             # App initialization
│   │   └── router.ts          # Router bootstrap
│   ├── components/            # Shared UI components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature-specific components
│   ├── pages/                 # File-based routes
│   │   ├── home/
│   │   │   ├── page.ts        # Route: /
│   │   │   └── layout.ts      # Optional nested layout
│   │   ├── about/
│   │   │   └── page.ts        # Route: /about
│   │   └── blog/
│   │       ├── page.ts        # Route: /blog
│   │       └── [slug]/
│   │           └── page.ts    # Route: /blog/:slug
│   ├── hooks/                 # Custom hooks / composables
│   ├── services/              # API / data logic
│   ├── utils/                 # Internal utilities
│   ├── styles/                # Global + module CSS
│   ├── assets/                # Static resources
│   └── main.ts                # Unified entry point
├── public/
│   ├── index.html             # App shell
│   └── favicon.svg
├── dist/                      # Build output
│   ├── entry.[hash].js        # Main entry bundle
│   ├── assets/                # Static assets
│   ├── pages/                 # Page bundles
│   │   └── home/
│   │       └── entry.[hash].js
│   ├── manifest.json          # Build manifest
│   └── routes.json            # Route manifest
├── rynex.config.js
├── package.json
└── tsconfig.json
```

### 2. File Naming Standardization

#### Current Issues
- `bundel.js` vs `bundle.js` inconsistency
- `build-manifest.json` vs `manifest.json`
- `route-manifest.js` vs `routes.json`

#### New Standard
```
bundel.js          → bundle.js
bundel.[hash].js   → entry.[hash].js
build-manifest.json → manifest.json
route-manifest.js  → routes.json
router-config.js   → router.js
```

### 3. Path Aliases
```typescript
// tsconfig.json paths
{
  "@app/*": ["src/app/*"],
  "@components/*": ["src/components/*"],
  "@pages/*": ["src/pages/*"],
  "@hooks/*": ["src/hooks/*"],
  "@services/*": ["src/services/*"],
  "@utils/*": ["src/utils/*"],
  "@styles/*": ["src/styles/*"],
  "@assets/*": ["src/assets/*"]
}
```

### 4. Build Output Structure

#### Development Mode
```
dist/
├── bundle.js              # Main bundle (no hash)
├── bundle.js.map
├── pages/
│   └── home/
│       ├── bundle.js
│       └── bundle.js.map
├── components/
│   └── Header.js
├── routes.json
├── router.js
└── index.html
```

#### Production Mode
```
dist/
├── entry.[hash].js        # Main bundle (hashed)
├── entry.[hash].js.map
├── pages/
│   └── home/
│       └── entry.[hash].js
├── components/
│   └── Header.[hash].js
├── assets/
│   └── [name].[hash].[ext]
├── manifest.json          # Build metadata
├── routes.json            # Route configuration
├── router.js              # Router initialization
└── index.html
```

### 5. Manifest Format
```json
{
  "version": "1.0.0",
  "hash": "a2f9c1",
  "timestamp": "2025-10-26T19:20:00Z",
  "chunks": {
    "main": "entry.a2f9c1.js",
    "pages": {
      "home": "pages/home/entry.a2f9c1.js",
      "about": "pages/about/entry.a2f9c1.js"
    },
    "components": {
      "Header": "components/Header.a2f9c1.js"
    }
  },
  "assets": {
    "logo.svg": "assets/logo.abc123.svg"
  }
}
```

## CLI Improvements

### 1. Remove Deprecated Files
- ❌ Remove: `src/cli/init.ts` (replaced by `init-new.ts`)
- ✅ Keep: `src/cli/init-new.ts` (rename to `init.ts`)

### 2. Builder Enhancements
- Implement lazy imports for routes
- Add code-splitting by route
- Tree-shaking optimization
- Compression (gzip/brotli)

### 3. Developer Experience
- Progress bar for builds
- Build timing diagnostics
- Granular HMR (page-level)
- Better error messages

### 4. New CLI Commands
```bash
rynex init [name]          # Create new project
rynex dev                  # Development server
rynex build                # Production build
rynex start                # Production server
rynex add <integration>    # Add integrations
rynex generate <type>      # Generate components/pages
rynex clean                # Clean build artifacts
```

## Implementation Steps

### Phase 1: File Naming & Structure
1. Rename `bundel` → `bundle`
2. Standardize manifest names
3. Update all references in codebase
4. Update HTML templates

### Phase 2: Path Aliases
1. Add path resolution to builder
2. Update TypeScript config
3. Add alias support in Rolldown

### Phase 3: Build System
1. Implement new manifest format
2. Add code-splitting logic
3. Optimize bundle naming
4. Add compression support

### Phase 4: CLI Modernization
1. Remove `init.ts`
2. Rename `init-new.ts` → `init.ts`
3. Add progress indicators
4. Improve error handling

### Phase 5: Documentation
1. Update all docs
2. Migration guide
3. API reference
4. Best practices

## Breaking Changes

### For Users
1. Bundle naming changes
2. Manifest format changes
3. Config structure updates
4. Import path changes (if using aliases)

### Migration Guide
```javascript
// Old config
export default {
  entry: 'src/index.ts',
  output: 'dist/bundel.js',  // ❌ Old
  // ...
}

// New config
export default {
  entry: 'src/main.ts',       // ✅ New unified entry
  output: 'dist/bundle.js',   // ✅ New naming
  // ...
}
```

## Benefits

### Developer Experience
- Familiar structure (Next.js/React/Vue)
- Better organization
- Clearer naming
- Path aliases for clean imports

### Performance
- Code-splitting by route
- Lazy loading
- Tree-shaking
- Smaller bundles

### Maintainability
- Consistent naming
- Modular architecture
- Clear separation of concerns
- Better scalability

## Timeline

- **Week 1:** File naming & structure
- **Week 2:** Path aliases & build system
- **Week 3:** CLI modernization
- **Week 4:** Documentation & testing
- **Week 5:** Migration tools & release

## Success Metrics

1. Build time reduction: 20%+
2. Bundle size reduction: 30%+
3. Developer satisfaction: 90%+
4. Migration completion: 95%+

---

This modernization will position Rynex as a competitive, modern framework with best-in-class developer experience.
