/**
 * Asset Loader Helper
 * Dynamically loads hashed assets (components, modules) with cache busting
 */

/**
 * Load a component dynamically with hash support
 * Automatically finds the correct hashed filename
 */
export async function loadComponent(componentName: string, basePath: string = '/components'): Promise<any> {
  try {
    // Try to load build manifest first
    const manifest = await loadBuildManifest();
    
    if (manifest && manifest.files) {
      // Look for the component in the manifest
      const componentKey = `component:${componentName}`;
      const componentInfo = manifest.files[componentKey];
      
      if (componentInfo && componentInfo.path) {
        const module = await import(`${basePath}/${componentInfo.path}`);
        return module;
      }
    }
    
    // Fallback: try to find the component by pattern matching
    // This works by attempting to load with a wildcard pattern
    const response = await fetch(`${basePath}/`);
    if (response.ok) {
      const html = await response.text();
      const regex = new RegExp(`${componentName}\\.[a-f0-9]{8}\\.js`, 'g');
      const match = html.match(regex);
      
      if (match && match[0]) {
        const module = await import(`${basePath}/${match[0]}`);
        return module;
      }
    }
    
    // Last resort: try direct import (for non-hashed builds)
    const module = await import(`${basePath}/${componentName}.js`);
    return module;
  } catch (error) {
    console.error(`Failed to load component: ${componentName}`, error);
    throw error;
  }
}

/**
 * Load build manifest
 */
async function loadBuildManifest(): Promise<any> {
  try {
    const response = await fetch('/build-manifest.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // Manifest not available, this is okay
  }
  return null;
}

/**
 * Preload a hashed asset for better performance
 */
export function preloadAsset(assetPath: string, type: 'script' | 'style' = 'script'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = assetPath;
  link.as = type;
  
  if (type === 'script') {
    link.setAttribute('crossorigin', 'anonymous');
  }
  
  document.head.appendChild(link);
}

/**
 * Get the current build version
 */
export function getBuildVersion(): string | null {
  const meta = document.querySelector('meta[name="build-version"]');
  return meta ? meta.getAttribute('content') : null;
}

/**
 * Check if a new build is available
 */
export async function checkForUpdates(): Promise<boolean> {
  const currentVersion = getBuildVersion();
  if (!currentVersion) return false;
  
  try {
    const manifest = await loadBuildManifest();
    if (manifest && manifest.buildHash && manifest.buildHash !== currentVersion) {
      return true;
    }
  } catch (error) {
    // Ignore errors
  }
  
  return false;
}

/**
 * Force reload if new build is available
 */
export async function reloadIfUpdated(): Promise<void> {
  const hasUpdate = await checkForUpdates();
  if (hasUpdate) {
    console.log('[Rynex] New build detected, reloading...');
    window.location.reload();
  }
}
