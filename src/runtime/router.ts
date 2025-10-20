/**
 * ZenWeb Router
 * Client-side routing with dynamic routes, middleware, and lazy loading
 * Inspired by Express.js and Next.js routing patterns
 */

import { state } from './state.js';

export interface RouteParams {
  [key: string]: string;
}

export interface RouteQuery {
  [key: string]: string | string[];
}

export interface RouteContext {
  path: string;
  params: RouteParams;
  query: RouteQuery;
  hash: string;
  data?: any;
}

export type RouteComponent = (ctx: RouteContext) => HTMLElement | Promise<HTMLElement>;
export type RouteMiddleware = (ctx: RouteContext, next: () => void | Promise<void>) => void | Promise<void>;
export type RouteGuard = (ctx: RouteContext) => boolean | Promise<boolean>;

export interface RouteConfig {
  path: string;
  component?: RouteComponent;
  lazy?: () => Promise<{ default: RouteComponent }>;
  children?: RouteConfig[];
  middleware?: RouteMiddleware[];
  guards?: RouteGuard[];
  meta?: Record<string, any>;
  name?: string;
}

export interface NavigationOptions {
  replace?: boolean;
  state?: any;
  scroll?: boolean;
}

interface CompiledRoute {
  pattern: RegExp;
  keys: string[];
  config: RouteConfig;
}

/**
 * Router class - manages client-side routing
 */
export class Router {
  private routes: CompiledRoute[] = [];
  private currentRoute: RouteContext | null = null;
  private container: HTMLElement | null = null;
  private globalMiddleware: RouteMiddleware[] = [];
  private notFoundHandler: RouteComponent | null = null;
  private errorHandler: ((error: Error, ctx: RouteContext) => void) | null = null;
  
  // Reactive state for current route
  public routeState = state<RouteContext>({
    path: window.location.pathname,
    params: {},
    query: this.parseQuery(window.location.search),
    hash: window.location.hash
  });

  constructor() {
    // Listen to popstate for browser back/forward
    window.addEventListener('popstate', () => {
      this.handleNavigation(window.location.pathname + window.location.search + window.location.hash);
    });

    // Intercept link clicks
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href && target.origin === window.location.origin) {
        const href = target.getAttribute('href');
        if (href && !href.startsWith('http') && !target.hasAttribute('data-external')) {
          e.preventDefault();
          this.push(href);
        }
      }
    });
  }

  /**
   * Add a route to the router
   */
  addRoute(config: RouteConfig): void {
    const compiled = this.compileRoute(config);
    this.routes.push(compiled);
  }

  /**
   * Add multiple routes
   */
  addRoutes(configs: RouteConfig[]): void {
    configs.forEach(config => this.addRoute(config));
  }

  /**
   * Add global middleware
   */
  use(middleware: RouteMiddleware): void {
    this.globalMiddleware.push(middleware);
  }

  /**
   * Set 404 handler
   */
  setNotFound(handler: RouteComponent): void {
    this.notFoundHandler = handler;
  }

  /**
   * Set error handler
   */
  setErrorHandler(handler: (error: Error, ctx: RouteContext) => void): void {
    this.errorHandler = handler;
  }

  /**
   * Mount router to a container element
   */
  mount(container: HTMLElement): void {
    this.container = container;
    this.handleNavigation(window.location.pathname + window.location.search + window.location.hash);
  }

  /**
   * Navigate to a new route (push state)
   */
  async push(path: string, options: NavigationOptions = {}): Promise<void> {
    if (!options.replace) {
      window.history.pushState(options.state || {}, '', path);
    } else {
      window.history.replaceState(options.state || {}, '', path);
    }
    
    await this.handleNavigation(path, options.scroll !== false);
  }

  /**
   * Replace current route
   */
  async replace(path: string, options: NavigationOptions = {}): Promise<void> {
    return this.push(path, { ...options, replace: true });
  }

  /**
   * Go back in history
   */
  back(): void {
    window.history.back();
  }

  /**
   * Go forward in history
   */
  forward(): void {
    window.history.forward();
  }

  /**
   * Go to specific history entry
   */
  go(delta: number): void {
    window.history.go(delta);
  }

  /**
   * Get current route context
   */
  getCurrentRoute(): RouteContext | null {
    return this.currentRoute;
  }

  /**
   * Compile route pattern to regex
   */
  private compileRoute(config: RouteConfig): CompiledRoute {
    const keys: string[] = [];
    let pattern = config.path;

    // Handle dynamic segments: /user/:id -> /user/([^/]+)
    pattern = pattern.replace(/:(\w+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    });

    // Handle wildcard: /docs/* -> /docs/(.*)
    pattern = pattern.replace(/\*/g, '(.*)');

    // Handle optional segments: /user/:id? -> /user(?:/([^/]+))?
    pattern = pattern.replace(/\/:(\w+)\?/g, (_, key) => {
      keys.push(key);
      return '(?:/([^/]+))?';
    });

    // Exact match
    const regex = new RegExp(`^${pattern}$`);

    return { pattern: regex, keys, config };
  }

  /**
   * Match a path against routes
   */
  private matchRoute(path: string): { route: CompiledRoute; params: RouteParams } | null {
    for (const route of this.routes) {
      const match = path.match(route.pattern);
      if (match) {
        const params: RouteParams = {};
        route.keys.forEach((key, index) => {
          params[key] = match[index + 1];
        });
        return { route, params };
      }
    }
    return null;
  }

  /**
   * Parse query string
   */
  private parseQuery(search: string): RouteQuery {
    const query: RouteQuery = {};
    const params = new URLSearchParams(search);
    
    params.forEach((value, key) => {
      if (query[key]) {
        if (Array.isArray(query[key])) {
          (query[key] as string[]).push(value);
        } else {
          query[key] = [query[key] as string, value];
        }
      } else {
        query[key] = value;
      }
    });
    
    return query;
  }

  /**
   * Handle navigation
   */
  private async handleNavigation(fullPath: string, scroll: boolean = true): Promise<void> {
    try {
      // Parse URL
      const [pathWithQuery, hash = ''] = fullPath.split('#');
      const [path, search = ''] = pathWithQuery.split('?');
      
      // Create route context
      const ctx: RouteContext = {
        path,
        params: {},
        query: this.parseQuery(search ? `?${search}` : ''),
        hash: hash ? `#${hash}` : ''
      };

      // Match route
      const matched = this.matchRoute(path);
      
      if (!matched) {
        // No route matched - show 404
        if (this.notFoundHandler) {
          ctx.params = {};
          await this.renderRoute(ctx, this.notFoundHandler);
        } else {
          console.error(`No route matched for path: ${path}`);
        }
        return;
      }

      // Update context with params
      ctx.params = matched.params;
      this.currentRoute = ctx;

      // Update reactive state
      Object.assign(this.routeState, ctx);

      // Run guards
      if (matched.route.config.guards) {
        for (const guard of matched.route.config.guards) {
          const canActivate = await guard(ctx);
          if (!canActivate) {
            console.warn(`Route guard blocked navigation to ${path}`);
            return;
          }
        }
      }

      // Run middleware
      const allMiddleware = [...this.globalMiddleware, ...(matched.route.config.middleware || [])];
      await this.runMiddleware(ctx, allMiddleware);

      // Load component
      let component: RouteComponent;
      
      if (matched.route.config.lazy) {
        // Lazy load component
        const module = await matched.route.config.lazy();
        component = module.default;
      } else if (matched.route.config.component) {
        component = matched.route.config.component;
      } else {
        console.error(`No component defined for route: ${path}`);
        return;
      }

      // Render component
      await this.renderRoute(ctx, component);

      // Scroll to top or hash
      if (scroll) {
        if (ctx.hash) {
          const element = document.querySelector(ctx.hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }

    } catch (error) {
      console.error('Navigation error:', error);
      if (this.errorHandler && this.currentRoute) {
        this.errorHandler(error as Error, this.currentRoute);
      }
    }
  }

  /**
   * Run middleware chain
   */
  private async runMiddleware(ctx: RouteContext, middleware: RouteMiddleware[]): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index >= middleware.length) return;
      
      const mw = middleware[index++];
      await mw(ctx, next);
    };

    await next();
  }

  /**
   * Render route component
   */
  private async renderRoute(ctx: RouteContext, component: RouteComponent): Promise<void> {
    if (!this.container) {
      console.error('Router not mounted to a container');
      return;
    }

    // Clear container
    this.container.innerHTML = '';

    // Render component
    const element = await component(ctx);
    this.container.appendChild(element);
  }
}

/**
 * Create a new router instance
 */
export function createRouter(routes?: RouteConfig[]): Router {
  const router = new Router();
  if (routes) {
    router.addRoutes(routes);
  }
  return router;
}

/**
 * Link component helper
 */
export function createLink(
  href: string,
  text: string,
  options: { class?: string; style?: Partial<CSSStyleDeclaration> } = {}
): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  
  if (options.class) {
    link.className = options.class;
  }
  
  if (options.style) {
    Object.assign(link.style, options.style);
  }
  
  return link;
}

/**
 * Route params hook
 */
export function useParams(router: Router): RouteParams {
  return router.routeState.params;
}

/**
 * Route query hook
 */
export function useQuery(router: Router): RouteQuery {
  return router.routeState.query;
}

/**
 * Navigation hook
 */
export function useNavigate(router: Router) {
  return {
    push: (path: string, options?: NavigationOptions) => router.push(path, options),
    replace: (path: string, options?: NavigationOptions) => router.replace(path, options),
    back: () => router.back(),
    forward: () => router.forward(),
    go: (delta: number) => router.go(delta)
  };
}
