/**
 * Route Scanner
 * Scans file system for routes (Next.js style file-based routing)
 */

import * as fs from "fs";
import * as path from "path";
import { logger } from "./logger.js";

export interface ScannedRoute {
  path: string;
  filePath: string;
  dynamic: boolean;
  params: string[];
  layout?: string;
  loading?: string;
  error?: string;
  notFound?: string;
  middleware?: string[];
}

export interface RouteManifest {
  routes: ScannedRoute[];
  layouts: Map<string, string>;
  middleware: Map<string, string>;
}

/**
 * Scan pages directory for routes
 */
export function scanRoutes(pagesDir: string): RouteManifest {
  const routes: ScannedRoute[] = [];
  const layouts = new Map<string, string>();
  const middleware = new Map<string, string>();

  if (!fs.existsSync(pagesDir)) {
    logger.warning(`Pages directory not found: ${pagesDir}`);
    return { routes, layouts, middleware };
  }

  // Scan directory recursively
  scanDirectory(pagesDir, "", routes, layouts, middleware);

  // Sort routes by specificity (static routes first, then dynamic, then catch-all)
  routes.sort((a, b) => {
    const aScore = getRouteSpecificity(a.path);
    const bScore = getRouteSpecificity(b.path);
    return bScore - aScore;
  });

  logger.info(`Found ${routes.length} routes`);

  return { routes, layouts, middleware };
}

/**
 * Scan directory recursively
 */
function scanDirectory(
  dir: string,
  routePath: string,
  routes: ScannedRoute[],
  layouts: Map<string, string>,
  middleware: Map<string, string>,
): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Handle directory-based routes
      let segmentPath = entry.name;

      // Dynamic route: [id] -> :id
      if (segmentPath.startsWith("[") && segmentPath.endsWith("]")) {
        segmentPath = ":" + segmentPath.slice(1, -1);
      }

      // Catch-all route: [...slug] -> *
      if (segmentPath.startsWith("[...") && segmentPath.endsWith("]")) {
        segmentPath = "*";
      }

      // Optional catch-all: [[...slug]] -> :slug?
      if (segmentPath.startsWith("[[...") && segmentPath.endsWith("]]")) {
        const param = segmentPath.slice(5, -2);
        segmentPath = `:${param}?`;
      }

      const newRoutePath = routePath + "/" + segmentPath;
      scanDirectory(fullPath, newRoutePath, routes, layouts, middleware);
    } else if (entry.isFile()) {
      // Handle file-based routes
      const ext = path.extname(entry.name);
      const baseName = path.basename(entry.name, ext);

      // Only process TypeScript/JavaScript files
      if (![".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
        continue;
      }

      // Special files
      if (baseName === "layout") {
        layouts.set(routePath || "/", fullPath);
        continue;
      }

      if (baseName === "middleware") {
        middleware.set(routePath || "/", fullPath);
        continue;
      }

      // Page files
      if (baseName === "page" || baseName === "index") {
        const route = createRoute(routePath || "/", fullPath);
        routes.push(route);

        // Check for special files in the same directory
        checkSpecialFiles(dir, route);
      }
    }
  }
}

/**
 * Create route object
 */
function createRoute(routePath: string, filePath: string): ScannedRoute {
  const params: string[] = [];
  let dynamic = false;

  // Extract dynamic params
  const segments = routePath.split("/").filter(Boolean);
  for (const segment of segments) {
    if (segment.startsWith(":")) {
      dynamic = true;
      const param = segment.slice(1).replace("?", "");
      params.push(param);
    } else if (segment === "*") {
      dynamic = true;
      params.push("slug");
    }
  }

  return {
    path: routePath || "/",
    filePath,
    dynamic,
    params,
  };
}

/**
 * Check for special files (loading, error, not-found)
 */
function checkSpecialFiles(dir: string, route: ScannedRoute): void {
  const loadingPath = path.join(dir, "loading.ts");
  if (fs.existsSync(loadingPath)) {
    route.loading = loadingPath;
  }

  const errorPath = path.join(dir, "error.ts");
  if (fs.existsSync(errorPath)) {
    route.error = errorPath;
  }

  const notFoundPath = path.join(dir, "not-found.ts");
  if (fs.existsSync(notFoundPath)) {
    route.notFound = notFoundPath;
  }
}

/**
 * Calculate route specificity for sorting
 */
function getRouteSpecificity(routePath: string): number {
  let score = 0;
  const segments = routePath.split("/").filter(Boolean);

  for (const segment of segments) {
    if (segment === "*") {
      score += 1; // Catch-all has lowest priority
    } else if (segment.startsWith(":")) {
      score += 10; // Dynamic segments
    } else {
      score += 100; // Static segments have highest priority
    }
  }

  return score;
}

/**
 * Generate route manifest file
 */
export function generateRouteManifest(
  manifest: RouteManifest,
  outputPath: string,
): void {
  const code = `/**
 * Auto-generated route manifest
 * Do not edit manually
 */

export const routes = ${JSON.stringify(manifest.routes, null, 2)};

export const layouts = new Map(${JSON.stringify(Array.from(manifest.layouts.entries()))});

export const middleware = new Map(${JSON.stringify(Array.from(manifest.middleware.entries()))});
`;

  fs.writeFileSync(outputPath, code, "utf8");
  logger.success(`Generated route manifest: ${outputPath}`);
}

/**
 * Generate router configuration from manifest
 */
export function generateRouterConfig(
  manifest: RouteManifest,
  outputPath: string,
): void {
  const imports: string[] = [];
  const routeConfigs: string[] = [];

  manifest.routes.forEach((route, index) => {
    const importName = `Page${index}`;
    const relativePath = route.filePath.replace(/\\/g, "/");

    imports.push(`import ${importName} from '${relativePath}';`);

    const config = `{
    path: '${route.path}',
    component: ${importName},
    meta: {
      dynamic: ${route.dynamic},
      params: ${JSON.stringify(route.params)}
    }
  }`;

    routeConfigs.push(config);
  });

  const code = `/**
 * Auto-generated router configuration
 * Do not edit manually
 */

${imports.join("\n")}

export const routerConfig = [
  ${routeConfigs.join(",\n  ")}
];
`;

  fs.writeFileSync(outputPath, code, "utf8");
  logger.success(`Generated router config: ${outputPath}`);
}

/**
 * Watch pages directory for changes
 */
export function watchRoutes(
  pagesDir: string,
  onChange: (manifest: RouteManifest) => void,
): void {
  const chokidar = require("chokidar");

  const watcher = chokidar.watch(pagesDir, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  });

  watcher.on("all", (event: string, filePath: string) => {
    if (["add", "unlink", "addDir", "unlinkDir"].includes(event)) {
      logger.info(`Route change detected: ${event} ${filePath}`);
      const manifest = scanRoutes(pagesDir);
      onChange(manifest);
    }
  });

  logger.info("Watching for route changes...");
}
