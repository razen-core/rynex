# Rolldown & Rollup Plugin Recommendations

This document outlines recommended Rollup/Rolldown plugins that can be used with Rynex for various use cases.

## Current Setup

Rynex uses **Rolldown 1.0.0-beta.44** - a Rust-based bundler that is Rollup-compatible.

### Built-in Rolldown Features (No Plugin Needed)

✅ **TypeScript** - Native support via Oxc transformer  
✅ **JSX/TSX** - Built-in transformation  
✅ **CommonJS** - Mixed ESM/CJS support out of the box  
✅ **Module Resolution** - Enhanced resolve (webpack-like)  
✅ **CSS Bundling** - Experimental, imports CSS from JS  
✅ **Minification** - Built-in via oxc-minifier (experimental)  
✅ **Tree Shaking** - Advanced dead code elimination  
✅ **Define** - Global constant replacement  
✅ **Inject** - Shim global variables  
✅ **Platform Presets** - Browser/Node/Neutral targets  

## Recommended Plugins

### 1. **PostCSS / Tailwind CSS**
**When to use**: If you need Tailwind CSS, Autoprefixer, or other PostCSS plugins

```bash
pnpm add -D rollup-plugin-postcss postcss tailwindcss autoprefixer
```

```typescript
import postcss from 'rollup-plugin-postcss';

export default {
  plugins: [
    postcss({
      config: {
        path: './postcss.config.js'
      },
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top'
      }
    })
  ]
};
```

**Status**: ⚠️ Recommended for production Tailwind support

---

### 2. **Image Optimization**
**When to use**: Optimize images during build

```bash
pnpm add -D @rollup/plugin-image
```

```typescript
import image from '@rollup/plugin-image';

export default {
  plugins: [
    image()
  ]
};
```

**Status**: ✅ Useful for production builds

---

### 3. **SVG as Components**
**When to use**: Import SVG files as React/JSX components

```bash
pnpm add -D rollup-plugin-svg-import
```

```typescript
import svgImport from 'rollup-plugin-svg-import';

export default {
  plugins: [
    svgImport({
      // Options
    })
  ]
};
```

**Status**: ⚠️ Optional, depends on use case

---

### 4. **Environment Variables**
**When to use**: Load .env files

```bash
pnpm add -D @rollup/plugin-replace
```

```typescript
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

dotenv.config();

export default {
  plugins: [
    replace({
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      preventAssignment: true
    })
  ]
};
```

**Status**: ✅ Recommended for environment-specific builds  
**Note**: Rolldown has built-in `define` which can replace this

---

### 5. **Bundle Analyzer**
**When to use**: Analyze bundle size and composition

```bash
pnpm add -D rollup-plugin-visualizer
```

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
};
```

**Status**: ✅ Highly recommended for optimization

---

### 6. **Alternative Minifiers**
**When to use**: If Rolldown's built-in minifier has issues

#### Option A: esbuild
```bash
pnpm add -D rollup-plugin-esbuild
```

```typescript
import { minify } from 'rollup-plugin-esbuild';

export default {
  plugins: [
    minify()
  ]
};
```

#### Option B: SWC
```bash
pnpm add -D rollup-plugin-swc3
```

```typescript
import { minify } from 'rollup-plugin-swc3';

export default {
  plugins: [
    minify({
      module: true,
      mangle: {},
      compress: {}
    })
  ]
};
```

**Status**: ⚠️ Use only if built-in minifier has issues

---

### 7. **Node Polyfills**
**When to use**: Using Node.js APIs in browser

```bash
pnpm add -D rolldown-plugin-node-polyfills
```

```typescript
import nodePolyfills from 'rolldown-plugin-node-polyfills';

export default {
  plugins: [
    nodePolyfills()
  ]
};
```

**Status**: ⚠️ Only if needed (adds bundle size)

---

### 8. **JSON Import**
**When to use**: Import JSON files as modules

**Status**: ✅ Built into Rolldown (no plugin needed)

```typescript
import data from './data.json';
```

---

### 9. **WebAssembly**
**When to use**: Import .wasm files

```bash
pnpm add -D @rollup/plugin-wasm
```

```typescript
import wasm from '@rollup/plugin-wasm';

export default {
  plugins: [
    wasm()
  ]
};
```

**Status**: ⚠️ Advanced use case

---

### 10. **License Comments**
**When to use**: Extract license comments to separate file

**Status**: ✅ Built into Rolldown via `output.legalComments`

```typescript
export default {
  output: {
    legalComments: 'inline' // or 'external'
  }
};
```

---

## NOT Needed (Built into Rolldown)

❌ **@rollup/plugin-typescript** - Use Rolldown's built-in TS support  
❌ **@rollup/plugin-commonjs** - Built-in CJS support  
❌ **@rollup/plugin-node-resolve** - Built-in enhanced resolve  
❌ **@rollup/plugin-terser** - Use Rolldown's built-in minifier  
❌ **@rollup/plugin-babel** - Use Rolldown's built-in transforms  

## Future Considerations

### When Rolldown Stabilizes

1. **CSS Modules** - Currently experimental in Rolldown
2. **Advanced Chunks** - Experimental code splitting features
3. **Module Types** - Custom loaders for file types

### Potential Additions

```bash
# For PWA support
pnpm add -D rollup-plugin-workbox

# For HTML generation (if not using custom solution)
pnpm add -D @rollup/plugin-html

# For copying static assets
pnpm add -D rollup-plugin-copy

# For compression
pnpm add -D rollup-plugin-gzip
```

## Integration with Rynex

To add plugins to Rynex builder, modify `src/cli/builder.ts`:

```typescript
import { rolldown } from 'rolldown';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';

const build = await rolldown({
  input: 'src/main.ts',
  plugins: [
    rynexPlugin, // Keep Rynex plugin first
    postcss({
      // PostCSS config
    }),
    visualizer({
      // Analyzer config
    })
  ],
  // ... other options
});
```

## Performance Tips

1. **Use built-in features first** - Rolldown's native features are faster
2. **Minimize plugin usage** - Each plugin adds overhead
3. **Enable treeshaking** - Set `treeshake: true` for production
4. **Use platform presets** - Set `platform: 'browser'` for web apps
5. **Leverage caching** - Rolldown caches by default

## Compatibility Notes

- **Rolldown is Rollup-compatible** - Most Rollup plugins work
- **Some plugins may need updates** - Check plugin compatibility
- **Vite plugins** - Some Vite plugins work, but not all
- **Unplugin** - Supports unplugin-based plugins

## Recommended Package.json

```json
{
  "devDependencies": {
    "rolldown": "1.0.0-beta.44",
    "rollup-plugin-postcss": "^4.0.2",
    "rollup-plugin-visualizer": "^5.12.0",
    "@rollup/plugin-image": "^3.0.3"
  }
}
```

## Summary

**Currently Needed**: None (Rolldown has everything built-in)

**Recommended for Production**:
- `rollup-plugin-postcss` (for Tailwind CSS)
- `rollup-plugin-visualizer` (for bundle analysis)

**Optional Based on Needs**:
- Image optimization
- SVG imports
- Environment variables (or use built-in `define`)
- Alternative minifiers (if issues with built-in)

The Rynex framework is designed to work with Rolldown's built-in features, minimizing the need for external plugins while maintaining full compatibility with the Rollup ecosystem when needed.
