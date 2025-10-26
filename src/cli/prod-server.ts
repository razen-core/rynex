/**
 * Production Server
 * Uses Express if available, falls back to native HTTP
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger.js';
import { RynexConfig } from './config.js';
import { scanRoutes, RouteManifest } from './route-scanner.js';

export interface ServerOptions {
  port: number;
  root: string;
  config?: RynexConfig;
}

/**
 * Try to load Express, return null if not available
 */
async function tryLoadExpress(): Promise<any> {
  try {
    const express = await import('express' as any);
    return express.default;
  } catch (error) {
    return null;
  }
}

/**
 * Start production server with Express
 */
function startWithExpress(express: any, options: ServerOptions, routeManifest: RouteManifest | null): void {
  const app = express();
  const { port, root } = options;

  // Logging middleware
  app.use((req: any, res: any, next: any) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
      logger.debug(`${req.method} ${req.url} ${color}${status}\x1b[0m - ${duration}ms`);
    });
    next();
  });

  // Compression (if available)
  tryLoadExpress().then(async () => {
    try {
      const compression = await import('compression' as any);
      app.use(compression.default());
      logger.info('Compression enabled');
    } catch (e) {
      logger.debug('Compression not available');
    }
  });

  // Static files with proper headers
  app.use(express.static(root, {
    maxAge: 0, // Don't set default maxAge, we'll handle it per file type
    etag: true,
    setHeaders: (res: any, filePath: string) => {
      // Set proper content types
      if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
      
      // Prevent HTML caching to ensure updates are always fetched
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } 
      // Cache hashed JS/CSS files for 1 year (they have content hash in filename)
      else if (filePath.match(/\.[a-f0-9]{8}\.(js|css)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // Cache other static assets for 1 day
      else if (!filePath.endsWith('.js') && !filePath.endsWith('.css') && !filePath.endsWith('.mjs')) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
      // Non-hashed JS/CSS files - short cache
      else {
        res.setHeader('Cache-Control', 'public, max-age=300');
      }
    }
  }));

  // SPA fallback for file-based routing
  if (routeManifest && routeManifest.routes.length > 0) {
    app.get('*', (req: any, res: any) => {
      const indexPath = path.join(root, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('404 Not Found');
      }
    });
  }

  app.listen(port, () => {
    logger.success(`Production server running at http://localhost:${port}`);
    logger.info(`Serving files from: ${root}`);
    logger.info('Using Express server');
  });
}

/**
 * Start production server with native HTTP
 */
function startWithNativeHTTP(options: ServerOptions, routeManifest: RouteManifest | null): void {
  const { port, root } = options;

  const server = http.createServer((req, res) => {
    const url = req.url || '/';
    const [pathname] = url.split('?');

    // Determine file path
    let filePath = path.join(root, pathname === '/' ? 'index.html' : pathname);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Try adding .html
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (routeManifest && routeManifest.routes.length > 0) {
        // SPA fallback
        filePath = path.join(root, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }

    // Check if it's a directory
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }

    // Determine content type
    const ext = path.extname(filePath);
    const contentTypes: Record<string, string> = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.mjs': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.webp': 'image/webp',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.map': 'application/json'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      // Set caching headers
      const isHTML = ext === '.html';
      const fileName = path.basename(filePath);
      const isHashedAsset = fileName.match(/\.[a-f0-9]{8}\.(js|css)$/);
      
      let cacheControl: string;
      if (isHTML) {
        cacheControl = 'no-cache, no-store, must-revalidate';
      } else if (isHashedAsset) {
        // Hashed assets can be cached forever
        cacheControl = 'public, max-age=31536000, immutable';
      } else if (ext === '.js' || ext === '.mjs' || ext === '.css') {
        // Non-hashed JS/CSS - short cache
        cacheControl = 'public, max-age=300';
      } else {
        // Other assets - 1 day cache
        cacheControl = 'public, max-age=86400';
      }
      
      const headers: Record<string, string> = {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'ETag': `"${data.length}-${fs.statSync(filePath).mtime.getTime()}"`
      };
      
      if (isHTML) {
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
      }
      
      res.writeHead(200, headers);
      res.end(data);
    });
  });

  server.listen(port, () => {
    logger.success(`Production server running at http://localhost:${port}`);
    logger.info(`Serving files from: ${root}`);
    logger.info('Using native HTTP server');
  });
}

/**
 * Start production server
 */
export async function startProductionServer(options: ServerOptions): Promise<void> {
  const { root, config } = options;

  // Scan routes if file-based routing is enabled
  let routeManifest: RouteManifest | null = null;
  if (config?.routing?.fileBasedRouting) {
    const pagesDir = path.join(process.cwd(), config.routing.pagesDir || 'src/pages');
    if (fs.existsSync(pagesDir)) {
      routeManifest = scanRoutes(pagesDir);
      logger.info(`File-based routing enabled with ${routeManifest.routes.length} routes`);
    }
  }

  // Try to use Express
  const express = await tryLoadExpress();
  
  if (express) {
    startWithExpress(express, options, routeManifest);
  } else {
    logger.warning('Express not found, using native HTTP server');
    logger.info('Install Express for better performance: pnpm add express');
    startWithNativeHTTP(options, routeManifest);
  }
}
