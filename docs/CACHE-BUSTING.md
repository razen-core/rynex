# Cache-Busting Implementation in Rynex

## Overview

Rynex now includes comprehensive cache-busting mechanisms to ensure that when you deploy updates to your website, users always receive the latest version of your assets instead of cached versions.

## Problem Solved

Previously, when deploying updates:
- Browsers would cache HTML, CSS, and JavaScript files
- Users would see old content even after deployment
- Manual cache clearing was required
- Updates wouldn't appear immediately

## Solution Implemented

### 1. HTML Cache Prevention

**Meta Tags Added to All HTML Files:**
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

These tags instruct browsers to:
- Never cache HTML files
- Always fetch fresh HTML from the server
- Ensure HTML updates are immediately visible

### 2. Asset Versioning with Build Hash

**Automatic Version Query Parameters:**

During build, Rynex generates a unique hash (e.g., `a3f8b2c1`) and appends it to all asset references:

```html
<!-- Before -->
<link rel="stylesheet" href="styles.css">
<script type="module" src="bundle.js"></script>

<!-- After Build -->
<link rel="stylesheet" href="styles.css?v=a3f8b2c1">
<script type="module" src="bundle.js?v=a3f8b2c1">
<meta name="build-version" content="a3f8b2c1">
```

**Benefits:**
- Each build gets a unique version identifier
- Browsers treat versioned URLs as new resources
- Old cached assets are automatically bypassed
- No manual cache invalidation needed

### 3. Production Server Headers

**Express Server (if available):**
```javascript
// HTML files: No caching
if (filePath.endsWith('.html')) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

// Static assets (JS/CSS): 1 day cache with ETag
// These can be cached because they use version query params
```

**Native HTTP Server:**
```javascript
const isHTML = ext === '.html';
const cacheControl = isHTML 
  ? 'no-cache, no-store, must-revalidate' 
  : 'public, max-age=86400';
```

## How It Works

### Build Process

1. **Generate Build Hash**
   ```typescript
   function generateBuildHash(): string {
     const timestamp = Date.now().toString();
     return crypto.createHash('md5').update(timestamp).digest('hex').substring(0, 8);
   }
   ```

2. **Update HTML Files**
   - Add cache-control meta tags
   - Append `?v={buildHash}` to all JS/CSS references
   - Add build-version meta tag for tracking

3. **Generate Page HTML**
   ```typescript
   function generatePageHTML(pageName: string, distPageDir: string, buildHash: string) {
     // Includes cache-busting meta tags and versioned asset URLs
   }
   ```

### Deployment Flow

```
1. Developer runs: npm run build
   ↓
2. Build hash generated: a3f8b2c1
   ↓
3. HTML files updated with:
   - Cache-control meta tags
   - Versioned asset URLs (bundle.js?v=a3f8b2c1)
   ↓
4. Deploy to hosting (Netlify, Vercel, etc.)
   ↓
5. User visits site:
   - HTML fetched fresh (no cache)
   - Assets fetched with new version (bypasses cache)
   ↓
6. User sees latest version immediately!
```

## Files Modified

### Core Files
- **`src/cli/builder.ts`**: Added build hash generation and HTML updating
- **`src/cli/prod-server.ts`**: Updated cache headers for HTML vs assets
- **`src/cli/templates.ts`**: Added cache-busting meta tags to templates
- **`src/cli/init.ts`**: Updated initial project HTML template

### Key Functions Added
- `generateBuildHash()`: Creates unique version identifier
- `generatePageHTML()`: Now accepts buildHash parameter
- Updated `build()`: Orchestrates cache-busting during build

## Usage

### For New Projects
Cache-busting is automatically enabled. Just build and deploy:

```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### For Existing Projects

If you have an existing Rynex project, add these meta tags to your `public/index.html`:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Add these cache-busting meta tags -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  
  <title>Your App</title>
  <!-- rest of your head content -->
</head>
```

Then rebuild your project:
```bash
npm run build
```

The builder will automatically add version query parameters to your assets.

## Verification

### Check Build Output

After running `npm run build`, check your `dist/index.html`:

```html
<!-- You should see: -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta name="build-version" content="a3f8b2c1">
<link rel="stylesheet" href="styles.css?v=a3f8b2c1">
<script type="module" src="bundle.js?v=a3f8b2c1"></script>
```

### Check Browser Network Tab

1. Open DevTools → Network tab
2. Refresh your deployed site
3. Look at the HTML request:
   - Should show `200` (not `304 Not Modified`)
   - Response headers should include `Cache-Control: no-cache`
4. Look at JS/CSS requests:
   - URLs should include `?v=` query parameter
   - Each new build will have a different version

### Verify Updates Work

1. Make a change to your app
2. Run `npm run build`
3. Deploy the new build
4. Visit your site (no hard refresh needed)
5. Changes should appear immediately

## Best Practices

### 1. Always Build Before Deploy
```bash
npm run build
# Then deploy dist/ folder
```

### 2. Don't Manually Edit dist/ Files
The build process manages cache-busting automatically.

### 3. Use Production Server in Production
The production server (`rynex serve`) includes proper cache headers.

### 4. Monitor Build Hash
Each build logs the hash:
```
[Rynex] Build hash: a3f8b2c1
```

Use this to verify which version is deployed.

## Hosting Platform Compatibility

### Netlify
✅ Works automatically - Netlify respects cache-control headers

### Vercel
✅ Works automatically - Vercel respects cache-control headers

### GitHub Pages
✅ Works automatically - Version query params bypass cache

### AWS S3 + CloudFront
✅ Works with invalidation - May need to invalidate `index.html` after deploy

### Custom Server
✅ Use `rynex serve` or ensure your server respects cache-control headers

## Troubleshooting

### Issue: Changes Not Appearing

**Solution 1: Hard Refresh**
- Chrome/Firefox: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- This forces bypass of all caches

**Solution 2: Check Build Hash**
```bash
# In your built index.html, check:
<meta name="build-version" content="...">
```
Compare with your build logs.

**Solution 3: Verify Deployment**
Ensure you deployed the latest `dist/` folder contents.

### Issue: Assets Still Cached

**Check Asset URLs:**
```html
<!-- Should have version parameter -->
<script src="bundle.js?v=a3f8b2c1"></script>

<!-- Not just -->
<script src="bundle.js"></script>
```

If missing, rebuild the project.

### Issue: Server Not Respecting Headers

If using a custom server, ensure it:
1. Serves HTML with no-cache headers
2. Doesn't strip query parameters from asset URLs
3. Serves versioned assets correctly

## Technical Details

### Why MD5 Hash of Timestamp?

```typescript
crypto.createHash('md5').update(Date.now().toString()).digest('hex').substring(0, 8)
```

- **Timestamp**: Ensures uniqueness per build
- **MD5 Hash**: Creates consistent 8-character identifier
- **Short**: Keeps URLs clean and manageable
- **Unique**: Virtually impossible to have collisions

### Why Not Content Hash?

Content hashing (hashing file contents) is more complex:
- Requires reading all files
- Slower build times
- Timestamp-based is sufficient for cache-busting

Future versions may add content hashing as an option.

### Cache Strategy Summary

| File Type | Cache Strategy | Duration | Reason |
|-----------|---------------|----------|---------|
| HTML | No cache | 0 | Always fetch latest structure |
| JS/CSS | Cache with version | 1 day | Version param ensures freshness |
| Images | Cache with ETag | 1 day | ETags handle updates |

## Future Enhancements

Planned improvements:
- [ ] Content-based hashing option
- [ ] Service Worker integration
- [ ] Cache manifest generation
- [ ] CDN purge integration
- [ ] Build comparison reports

## Summary

Rynex's cache-busting implementation ensures:

✅ **Immediate Updates**: Users see changes without manual cache clearing  
✅ **Automatic**: No configuration needed  
✅ **Reliable**: Works across all major hosting platforms  
✅ **Performant**: Assets still cached, just with smart versioning  
✅ **Simple**: Just build and deploy as usual  

Your users will always see the latest version of your site!
