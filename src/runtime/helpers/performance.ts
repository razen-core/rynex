/**
 * Rynex Performance Utilities
 * Performance optimization helpers
 */

/**
 * Debounce function execution
 * Delays execution until after wait time has elapsed since last call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  };
}

/**
 * Throttle function execution
 * Ensures function is called at most once per specified time period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      lastResult = func.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }

    return lastResult;
  };
}

/**
 * Preload component or resource
 * Loads resource in advance for better performance
 */
export function preload<T>(loader: () => Promise<T>): Promise<T> {
  const promise = loader();
  
  // Store in cache for later use
  if (typeof window !== 'undefined') {
    (window as any).__rynexPreloadCache = (window as any).__rynexPreloadCache || new Map();
    (window as any).__rynexPreloadCache.set(loader, promise);
  }

  return promise;
}

/**
 * Get preloaded resource
 * Retrieves previously preloaded resource
 */
export function getPreloaded<T>(loader: () => Promise<T>): Promise<T> | null {
  if (typeof window !== 'undefined' && (window as any).__rynexPreloadCache) {
    return (window as any).__rynexPreloadCache.get(loader) || null;
  }
  return null;
}

/**
 * Request idle callback wrapper
 * Executes callback during browser idle time
 */
export function onIdle(callback: () => void, options?: { timeout?: number }): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, options);
  }
  
  // Fallback to setTimeout
  return setTimeout(callback, 1) as any;
}

/**
 * Cancel idle callback
 */
export function cancelIdle(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
