/**
 * ZenWeb Development Server
 * Hot-reload development server
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { watch } from 'chokidar';
import { logger } from './logger.js';

export interface DevServerOptions {
  port: number;
  root: string;
  hotReload: boolean;
}

/**
 * Start development server
 */
export async function startDevServer(options: DevServerOptions): Promise<void> {
  const { port, root, hotReload } = options;
  
  const clients: http.ServerResponse[] = [];

  // Create HTTP server
  const server = http.createServer((req, res) => {
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

    // Serve files
    let filePath = path.join(root, url === '/' ? 'index.html' : url);
    
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
  });

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
