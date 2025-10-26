/**
 * Hash Utilities for Cache Busting
 * Generates content-based hashes for proper cache invalidation
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate an 8-character hash from content
 */
export function generateContentHash(content: string | Buffer): string {
  return crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
    .substring(0, 8);
}

/**
 * Generate hash from file content
 */
export function generateFileHash(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath);
  return generateContentHash(content);
}

/**
 * Generate a unique build hash based on timestamp
 */
export function generateBuildHash(): string {
  const timestamp = Date.now().toString();
  return crypto
    .createHash('md5')
    .update(timestamp)
    .digest('hex')
    .substring(0, 8);
}

/**
 * Clean old bundle files with different hashes
 */
export function cleanOldBundles(
  directory: string,
  baseName: string,
  currentHash: string
): void {
  if (!fs.existsSync(directory)) {
    return;
  }

  const files = fs.readdirSync(directory);
  const pattern = new RegExp(`^${escapeRegex(baseName)}\\.[a-f0-9]{8}\\.js$`);

  for (const file of files) {
    if (pattern.test(file)) {
      const fileHash = file.match(/\.([a-f0-9]{8})\.js$/)?.[1];
      if (fileHash && fileHash !== currentHash) {
        const filePath = path.join(directory, file);
        fs.unlinkSync(filePath);
        
        // Also remove source map if exists
        const mapPath = `${filePath}.map`;
        if (fs.existsSync(mapPath)) {
          fs.unlinkSync(mapPath);
        }
      }
    }
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build manifest interface
 */
export interface BuildManifest {
  buildHash: string;
  timestamp: number;
  files: {
    [key: string]: {
      hash: string;
      path: string;
      size: number;
    };
  };
}

/**
 * Create or update build manifest
 */
export function createBuildManifest(
  distDir: string,
  buildHash: string,
  files: Map<string, string>
): void {
  const manifest: BuildManifest = {
    buildHash,
    timestamp: Date.now(),
    files: {}
  };

  for (const [key, filePath] of files.entries()) {
    const fullPath = path.join(distDir, filePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const hash = generateFileHash(fullPath);
      manifest.files[key] = {
        hash,
        path: filePath,
        size: stats.size
      };
    }
  }

  const manifestPath = path.join(distDir, 'build-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
}

/**
 * Read build manifest
 */
export function readBuildManifest(distDir: string): BuildManifest | null {
  const manifestPath = path.join(distDir, 'build-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Clean all old build artifacts based on manifest
 */
export function cleanOldBuildArtifacts(distDir: string): void {
  const manifest = readBuildManifest(distDir);
  if (!manifest) {
    return;
  }

  // Clean old bundles in components directory
  const componentsDir = path.join(distDir, 'components');
  if (fs.existsSync(componentsDir)) {
    const files = fs.readdirSync(componentsDir);
    for (const file of files) {
      if (file.match(/\.[a-f0-9]{8}\.js$/)) {
        const filePath = path.join(componentsDir, file);
        const fileHash = generateFileHash(filePath);
        
        // Check if this file is in the current manifest
        const isInManifest = Object.values(manifest.files).some(
          f => f.hash === fileHash
        );
        
        if (!isInManifest) {
          fs.unlinkSync(filePath);
          const mapPath = `${filePath}.map`;
          if (fs.existsSync(mapPath)) {
            fs.unlinkSync(mapPath);
          }
        }
      }
    }
  }

  // Clean old bundles in pages directories
  const pagesDir = path.join(distDir, 'pages');
  if (fs.existsSync(pagesDir)) {
    const pageDirectories = fs.readdirSync(pagesDir).filter(f => {
      const fullPath = path.join(pagesDir, f);
      return fs.statSync(fullPath).isDirectory();
    });

    for (const pageDir of pageDirectories) {
      const pagePath = path.join(pagesDir, pageDir);
      const files = fs.readdirSync(pagePath);
      
      for (const file of files) {
        if (file.match(/^bundel\.[a-f0-9]{8}\.js$/)) {
          const filePath = path.join(pagePath, file);
          const fileHash = generateFileHash(filePath);
          
          const isInManifest = Object.values(manifest.files).some(
            f => f.hash === fileHash
          );
          
          if (!isInManifest) {
            fs.unlinkSync(filePath);
            const mapPath = `${filePath}.map`;
            if (fs.existsSync(mapPath)) {
              fs.unlinkSync(mapPath);
            }
          }
        }
      }
    }
  }
}
