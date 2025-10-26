# Cache Busting & Hash System

This document explains the cache busting and hash system implemented in Rynex.

## Overview

The framework now implements a **content-based hash system** with automatic bundle cleaning to ensure:
1. **No stale cache issues** - Every build generates unique hashed filenames
2. **Automatic old bundle cleanup** - Previous builds are automatically removed
3. **Proper cache headers** - HTML is never cached, hashed assets are cached forever
4. **Build manifest tracking** - All builds are tracked with metadata

## How It Works

### 1. Content-Based Hashing

Every JavaScript bundle is hashed based on its **content**, not timestamp:

```
bundel.js → bundel.a1b2c3d4.js
MyComponent.js → MyComponent.e5f6g7h8.js
```

- **8-character MD5 hash** derived from file content
- Hash changes **only when content changes**
- Same content = same hash (deterministic)

### 2. Build Process

When you run `rynex build`:

1. **Clean old artifacts** - Removes bundles from previous builds
2. **Build to temp files** - Creates temporary `.temp.js` files
3. **Generate content hash** - Hashes the built file content
4. **Rename with hash** - Renames to `filename.{hash}.js`
5. **Update HTML references** - Updates all script/link tags
6. **Create manifest** - Generates `build-manifest.json`

### 3. File Structure

After build:
```
dist/
├── build-manifest.json          # Build metadata
├── bundel.a1b2c3d4.js          # Main bundle (hashed)
├── bundel.a1b2c3d4.js.map      # Source map
├── index.html                   # Updated with hashed references
├── components/
│   ├── Button.e5f6g7h8.js      # Component bundle (hashed)
│   └── Card.i9j0k1l2.js
└── pages/
    └── home/
        ├── bundel.m3n4o5p6.js  # Page bundle (hashed)
        └── page.html            # Updated with hashed reference
```

### 4. Cache Headers

#### Development Server (`rynex dev`)
- **HTML/JS/CSS**: `Cache-Control: no-cache, no-store, must-revalidate`
- **Images/Assets**: `Cache-Control: public, max-age=3600`
- **Hot Module Reload**: Automatic reload on file changes
- **Build version checking**: Reloads on new builds

#### Production Server (`rynex start`)
- **HTML**: `Cache-Control: no-cache, no-store, must-revalidate`
- **Hashed JS/CSS**: `Cache-Control: public, max-age=31536000, immutable` (1 year)
- **Non-hashed JS/CSS**: `Cache-Control: public, max-age=300` (5 minutes)
- **Other assets**: `Cache-Control: public, max-age=86400` (1 day)

## Build Manifest

The `build-manifest.json` tracks all built files:

```json
{
  "buildHash": "a1b2c3d4",
  "timestamp": 1234567890,
  "files": {
    "main": {
      "hash": "a1b2c3d4",
      "path": "bundel.a1b2c3d4.js",
      "size": 12345
    }
  }
}
```

## Usage

### Basic Build
```bash
rynex build
```

### Development with Hot Reload
```bash
rynex dev
```

### Production Server
```bash
rynex start
```

## Runtime Helpers

### Load Components Dynamically

```typescript
import { loadComponent } from 'rynex/helpers';

// Automatically finds the correct hashed filename
const MyComponent = await loadComponent('MyComponent');
```

### Check for Updates

```typescript
import { checkForUpdates, reloadIfUpdated } from 'rynex/helpers';

// Check if new build is available
const hasUpdate = await checkForUpdates();

// Auto-reload if updated
await reloadIfUpdated();
```

### Get Build Version

```typescript
import { getBuildVersion } from 'rynex/helpers';

const version = getBuildVersion(); // Returns build hash
```

### Preload Assets

```typescript
import { preloadAsset } from 'rynex/helpers';

// Preload a script for better performance
preloadAsset('/components/HeavyComponent.a1b2c3d4.js', 'script');
```

## Automatic Features

### 1. Hot Module Reload (Dev)
- Watches for file changes
- Automatically reloads browser
- Checks build version on window focus
- Forces hard reload to bypass cache

### 2. Old Bundle Cleanup
- Removes bundles with different hashes
- Cleans source maps automatically
- Runs before each build
- Keeps only current build files

### 3. Cache Invalidation
- HTML never cached (always fresh)
- Hashed assets cached forever (immutable)
- New builds get new hashes
- Browser automatically fetches new files

## Troubleshooting

### Issue: Changes not showing up

**Solution**: The new system prevents this, but if it happens:
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check `build-manifest.json` for correct hashes
4. Verify HTML references match actual filenames

### Issue: Old bundles not cleaned

**Solution**: 
```bash
# Clean dist directory and rebuild
rm -rf dist
rynex build
```

### Issue: 404 errors for bundles

**Solution**: 
1. Check that build completed successfully
2. Verify `dist/` contains hashed files
3. Check HTML references match actual filenames
4. Ensure server is serving from correct directory

## Benefits

✅ **No more cache issues** - Every build is unique  
✅ **Automatic cleanup** - Old files removed automatically  
✅ **Optimal caching** - Hashed files cached forever  
✅ **Fast updates** - HTML never cached, always fresh  
✅ **Production ready** - Proper cache headers for CDN  
✅ **Developer friendly** - Works automatically, no config needed  

## Technical Details

### Hash Generation
- **Algorithm**: MD5 (fast, sufficient for cache busting)
- **Length**: 8 characters (collision probability negligible)
- **Input**: Built file content (not source)
- **Deterministic**: Same content = same hash

### Cleaning Strategy
- **Pattern matching**: Finds files matching `name.[hash].js`
- **Hash comparison**: Keeps only current hash
- **Source maps**: Cleaned alongside bundles
- **Safe**: Only removes recognized patterns

### Server Implementation
- **Express**: Custom static middleware with cache headers
- **Native HTTP**: Manual cache header implementation
- **ETags**: Generated for all responses
- **Compression**: Enabled when available

## Migration Guide

If upgrading from a version without hash system:

1. **Clean old builds**: `rm -rf dist`
2. **Rebuild**: `rynex build`
3. **Update imports**: Use runtime helpers for dynamic imports
4. **Test**: Verify all assets load correctly
5. **Deploy**: New builds will have proper cache headers

## Performance Impact

- **Build time**: +5-10% (hash generation)
- **Bundle size**: No change
- **Runtime**: No overhead
- **Cache hit rate**: Significantly improved
- **Update speed**: Faster (only changed files re-downloaded)
