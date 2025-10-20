/**
 * ZenWeb Development Server
 * Hot-reload development server
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { watch } from 'chokidar';
import { logger } from './logger.js';
import { RouteConfig, ZenWebConfig } from './config.js';
import { scanRoutes, RouteManifest } from './route-scanner.js';

export interface DevServerOptions {
  port: number;
  root: string;
  hotReload: boolean;
  routes?: RouteConfig[];
  config?: ZenWebConfig;
}

type Middleware = (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void;

/**
 * Start development server
 */
export async function startDevServer(options: DevServerOptions): Promise<void> {
  const { port, root, hotReload, routes, config } = options;
  
  // Middleware stack
  const middlewareStack: Middleware[] = [];
  
  // Scan routes if file-based routing is enabled
  let routeManifest: RouteManifest | null = null;
  if (config?.routing?.fileBasedRouting) {
    const pagesDir = path.join(process.cwd(), config.routing.pagesDir || 'src/pages');
    routeManifest = scanRoutes(pagesDir);
    logger.info(`File-based routing enabled with ${routeManifest.routes.length} routes`);
  }
  
  const clients: http.ServerResponse[] = [];

  // Add CORS middleware
  middlewareStack.push((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    next();
  });

  // Add logging middleware
  middlewareStack.push((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.debug(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // Create HTTP server
  const server = http.createServer((req, res) => {
    // Run middleware stack
    let middlewareIndex = 0;
    const runMiddleware = () => {
      if (middlewareIndex >= middlewareStack.length) {
        handleRequest(req, res);
        return;
      }
      const middleware = middlewareStack[middlewareIndex++];
      middleware(req, res, runMiddleware);
    };
    runMiddleware();
  });

  // Request handler
  function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const url = req.url || '/';

    // Handle SSE for hot reload
    if (hotReload && url === '/__zenweb_hmr') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      
      clients.push(res);
      
      req.on('close', () => {
        const index = clients.indexOf(res);
        if (index !== -1) {
          clients.splice(index, 1);
        }
      });
      
      return;
    }

    // Parse URL and query params
    const [pathname, queryString] = url.split('?');
    
    // Check if URL matches a route
    let filePath = path.join(root, pathname === '/' ? 'index.html' : pathname);
    
    // Match against file-based routes first
    if (routeManifest && routeManifest.routes.length > 0) {
      const matchedRoute = matchRoute(pathname, routeManifest.routes);
      if (matchedRoute) {
        // For SPA, serve index.html and let client-side router handle it
        filePath = path.join(root, 'index.html');
        logger.debug(`Matched file-based route ${pathname}`);
      }
    } else if (routes && routes.length > 0) {
      const matchedRoute = routes.find(route => route.path === pathname);
      if (matchedRoute && matchedRoute.component) {
        // Serve the component HTML file for this route
        filePath = path.join(root, matchedRoute.component);
        logger.debug(`Matched route ${pathname} to ${matchedRoute.component}`);
      }
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Try adding .html
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else {
        res.writeHead(404);
        res.end('404 Not Found');
        return;
      }
    }

    // Determine content type
    const ext = path.extname(filePath);
    const contentTypes: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    const contentType = contentTypes[ext] || 'text/plain';

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('500 Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      
      // Inject HMR script into HTML
      if (hotReload && ext === '.html') {
        const html = data.toString();
        const hmrScript = `
          <script>
            const eventSource = new EventSource('/__zenweb_hmr');
            eventSource.onmessage = (event) => {
              if (event.data === 'reload') {
                console.log('[ZenWeb] Reloading...');
                window.location.reload();
              }
            };
          </script>
        `;
        const modifiedHtml = html.replace('</body>', `${hmrScript}</body>`);
        res.end(modifiedHtml);
      } else {
        res.end(data);
      }
    });
  }

  // Helper function to match routes
  function matchRoute(pathname: string, routes: any[]): any {
    for (const route of routes) {
      const pattern = routePathToRegex(route.path);
      if (pattern.test(pathname)) {
        return route;
      }
    }
    return null;
  }

  // Convert route path to regex
  function routePathToRegex(routePath: string): RegExp {
    let pattern = routePath;
    // Dynamic segments: :id -> ([^/]+)
    pattern = pattern.replace(/:([^/]+)/g, '([^/]+)');
    // Wildcards: * -> (.*)
    pattern = pattern.replace(/\*/g, '(.*)');
    return new RegExp(`^${pattern}$`);
  }

  // Watch for file changes
  if (hotReload) {
    const watcher = watch(root, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    watcher.on('change', (filePath) => {
      logger.info(`File changed: ${filePath}`);
      
      // Notify all connected clients
      clients.forEach(client => {
        client.write('data: reload\n\n');
      });
    });
  }

  // Start server
  server.listen(port, () => {
    logger.success(`Dev server running at http://localhost:${port}`);
    logger.info(`Serving files from: ${root}`);
    if (hotReload) {
      logger.info('Hot reload enabled');
    }
  });
}
