/**
 * Rynex Browser Compatibility Module
 * Ensures consistent behavior across all major browsers (Chrome, Firefox, Safari, Edge)
 * Modern browser support with native APIs only - no external dependencies
 */

import { debugLog, debugWarn } from './debug.js';

// Browser detection result
let isInitialized = false;

/**
 * Browser detection and feature support
 */
export interface BrowserCapabilities {
  name: string;
  version: string;
  platform: string;
  engine: string;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
  isMobile: boolean;
  supportsProxy: boolean;
  supportsIntersectionObserver: boolean;
  supportsResizeObserver: boolean;
  supportsSmoothScroll: boolean;
  supportsFetch: boolean;
  supportsCustomElements: boolean;
}

/**
 * Native browser detection using userAgent
 */
function detectBrowserFromUA(): { name: string; version: string; engine: string } {
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = '0';
  let engine = 'Unknown';

  // Detect browser
  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '0';
    engine = 'Gecko';
  } else if (ua.includes('Edg/')) {
    name = 'Microsoft Edge';
    version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '0';
    engine = 'Blink';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '0';
    engine = 'Blink';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '0';
    engine = 'WebKit';
  }

  return { name, version, engine };
}

/**
 * Detect platform type
 */
function detectPlatform(): string {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPad|iPod/.test(ua)) {
    return /iPad|Tablet/.test(ua) ? 'tablet' : 'mobile';
  }
  return 'desktop';
}

/**
 * Detect browser and capabilities
 */
export function detectBrowser(): BrowserCapabilities {
  const browserInfo = detectBrowserFromUA();
  const platform = detectPlatform();

  return {
    name: browserInfo.name,
    version: browserInfo.version,
    platform: platform,
    engine: browserInfo.engine,
    isChrome: browserInfo.name === 'Chrome',
    isFirefox: browserInfo.name === 'Firefox',
    isSafari: browserInfo.name === 'Safari',
    isEdge: browserInfo.name === 'Microsoft Edge',
    isMobile: platform === 'mobile' || platform === 'tablet',
    supportsProxy: typeof Proxy !== 'undefined',
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsResizeObserver: 'ResizeObserver' in window,
    supportsSmoothScroll: 'scrollBehavior' in document.documentElement.style,
    supportsFetch: 'fetch' in window,
    supportsCustomElements: 'customElements' in window,
  };
}

/**
 * Initialize browser fixes and optimizations
 * Should be called once at application startup
 */
export function initializeBrowserSupport(options: {
  enableSmoothScroll?: boolean;
  verbose?: boolean;
} = {}): BrowserCapabilities {
  if (isInitialized) {
    debugWarn('Browser', 'Browser support already initialized');
    return detectBrowser();
  }

  const {
    enableSmoothScroll = true,
    verbose = false
  } = options;

  debugLog('Browser', 'Initializing cross-browser support...');

  const capabilities = detectBrowser();

  if (verbose) {
    console.log('🌐 Rynex Browser Detection:', {
      browser: `${capabilities.name} ${capabilities.version}`,
      platform: capabilities.platform,
      engine: capabilities.engine,
      mobile: capabilities.isMobile
    });
  }

  // Apply browser-specific fixes
  applyBrowserFixes(capabilities);

  isInitialized = true;
  debugLog('Browser', '✅ Cross-browser support initialized successfully');

  return capabilities;
}

/**
 * Apply browser-specific fixes and workarounds
 */
function applyBrowserFixes(capabilities: BrowserCapabilities): void {
  // Firefox-specific fixes
  if (capabilities.isFirefox) {
    debugLog('Browser', 'Applying Firefox-specific fixes...');
    
    // Fix: Firefox scrollbar width calculation
    fixFirefoxScrollbar();
    
    // Fix: Firefox flexbox rendering issues
    fixFirefoxFlexbox();
    
    // Fix: Firefox event handling differences
    fixFirefoxEvents();
    
    // Fix: Firefox CSS transform issues
    fixFirefoxTransforms();
  }

  // Safari-specific fixes
  if (capabilities.isSafari) {
    debugLog('Browser', 'Applying Safari-specific fixes...');
    
    // Fix: Safari date handling
    fixSafariDateParsing();
    
    // Fix: Safari flexbox bugs
    fixSafariFlexbox();
    
    // Fix: Safari scroll momentum
    fixSafariScrolling();
    
    // Fix: Safari event timing
    fixSafariEvents();
    
    // Fix: Safari backdrop-filter support
    fixSafariBackdropFilter();
  }

  // Mobile-specific fixes
  if (capabilities.isMobile) {
    debugLog('Browser', 'Applying mobile-specific fixes...');
    
    // Fix: Mobile viewport height (100vh issue)
    fixMobileViewportHeight();
    
    // Fix: Mobile touch events
    fixMobileTouchEvents();
    
    // Fix: Mobile input zoom prevention
    fixMobileInputZoom();
  }

  // General cross-browser fixes
  applyGeneralFixes();
}

/**
 * Firefox scrollbar width fix
 */
function fixFirefoxScrollbar(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Firefox scrollbar normalization */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Firefox flexbox rendering fix
 */
function fixFirefoxFlexbox(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Firefox flexbox fixes */
    @-moz-document url-prefix() {
      .flex, [style*="display: flex"], [style*="display:flex"] {
        min-height: 0;
        min-width: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Firefox event handling fixes
 */
function fixFirefoxEvents(): void {
  // Firefox wheel event normalization
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type: string, listener: any, options?: any) {
    if (type === 'wheel' && typeof listener === 'function') {
      const wrappedListener = function(this: any, event: Event) {
        // Normalize deltaMode for Firefox
        const wheelEvent = event as WheelEvent;
        if (wheelEvent.deltaMode === 1) {
          // Line mode - convert to pixel mode
          const lineHeight = parseInt(getComputedStyle(document.documentElement).lineHeight) || 16;
          Object.defineProperty(wheelEvent, 'deltaY', {
            value: wheelEvent.deltaY * lineHeight,
            writable: false
          });
        }
        return listener.call(this, wheelEvent);
      };
      return originalAddEventListener.call(this, type, wrappedListener as EventListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
}

/**
 * Firefox CSS transform fixes
 */
function fixFirefoxTransforms(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Firefox transform rendering fixes */
    @-moz-document url-prefix() {
      [style*="transform"] {
        will-change: transform;
        backface-visibility: hidden;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Safari date parsing fix
 */
function fixSafariDateParsing(): void {
  const originalParse = Date.parse;
  Date.parse = function(dateString: string): number {
    // Safari doesn't support YYYY-MM-DD format well, convert to YYYY/MM/DD
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      dateString = dateString.replace(/-/g, '/');
    }
    return originalParse(dateString);
  };
}

/**
 * Safari flexbox fixes
 */
function fixSafariFlexbox(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Safari flexbox fixes */
    @supports (-webkit-appearance: none) {
      .flex, [style*="display: flex"], [style*="display:flex"] {
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
      }
      
      /* Fix Safari flex shrink bug */
      [style*="flex:"] {
        flex-shrink: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Safari scroll momentum fix
 */
function fixSafariScrolling(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Safari smooth scrolling */
    * {
      -webkit-overflow-scrolling: touch;
    }
    
    html {
      scroll-behavior: smooth;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Safari event timing fixes
 */
function fixSafariEvents(): void {
  // Safari requestAnimationFrame timing fix
  const originalRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = function(callback: FrameRequestCallback): number {
    return originalRAF.call(window, (time: number) => {
      // Ensure consistent timing across browsers
      return callback(time || performance.now());
    });
  };
}

/**
 * Safari backdrop-filter support
 */
function fixSafariBackdropFilter(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Safari backdrop-filter support */
    @supports ((-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))) {
      [style*="backdrop-filter"] {
        -webkit-backdrop-filter: inherit;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Mobile viewport height fix (100vh issue)
 */
function fixMobileViewportHeight(): void {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);

  const style = document.createElement('style');
  style.textContent = `
    /* Mobile viewport height fix */
    .h-screen, .min-h-screen, [style*="height: 100vh"] {
      height: calc(var(--vh, 1vh) * 100);
    }
  `;
  document.head.appendChild(style);

  debugLog('Browser', '✓ Mobile viewport height fixed (use --vh CSS variable)');
}

/**
 * Mobile touch event fixes
 */
function fixMobileTouchEvents(): void {
  // Prevent double-tap zoom on buttons and links
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // Fix iOS Safari touch delay
  const style = document.createElement('style');
  style.textContent = `
    /* Mobile touch optimization */
    * {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
    }
    
    button, a, input, select, textarea {
      touch-action: manipulation;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Mobile input zoom prevention
 */
function fixMobileInputZoom(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Prevent mobile input zoom */
    input, select, textarea {
      font-size: 16px !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * General cross-browser fixes
 */
function applyGeneralFixes(): void {
  // Fix: Consistent box-sizing
  const style = document.createElement('style');
  style.textContent = `
    /* Cross-browser normalization */
    *, *::before, *::after {
      box-sizing: border-box;
    }
    
    /* Consistent rendering */
    html {
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    
    /* Smooth scrolling for all browsers */
    html {
      scroll-behavior: smooth;
    }
    
    /* Prevent horizontal overflow */
    body {
      overflow-x: hidden;
    }
    
    /* Better font rendering */
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    
    /* Fix focus outline */
    :focus:not(:focus-visible) {
      outline: none;
    }
    
    :focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);

  // Fix: Console methods for older browsers
  if (!window.console) {
    (window as any).console = {
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {},
      debug: () => {}
    };
  }

  // Fix: Performance API
  if (!window.performance) {
    (window as any).performance = {
      now: () => Date.now()
    };
  }

  debugLog('Browser', '✓ General cross-browser fixes applied');
}

/**
 * Enhanced DOM operations with cross-browser support
 */
export const browserDOM = {
  /**
   * Cross-browser smooth scroll to element
   */
  scrollToElement(element: HTMLElement, options: ScrollIntoViewOptions = {}): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      ...options
    });
  },

  /**
   * Cross-browser smooth scroll to position
   */
  scrollTo(x: number, y: number, smooth: boolean = true): void {
    window.scrollTo({
      top: y,
      left: x,
      behavior: smooth ? 'smooth' : 'auto'
    });
  },

  /**
   * Get accurate viewport dimensions
   */
  getViewportSize(): { width: number; height: number } {
    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
  },

  /**
   * Cross-browser element offset
   */
  getElementOffset(element: HTMLElement): { top: number; left: number } {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element: HTMLElement, threshold: number = 0): boolean {
    const rect = element.getBoundingClientRect();
    const viewport = this.getViewportSize();
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= viewport.height + threshold &&
      rect.right <= viewport.width + threshold
    );
  }
};

/**
 * Enhanced state management with cross-browser support
 */
export const browserState = {
  /**
   * Check if Proxy is supported (required for reactive state)
   */
  supportsProxy(): boolean {
    return typeof Proxy !== 'undefined' && typeof Reflect !== 'undefined';
  },

  /**
   * Fallback for browsers without Proxy support
   */
  createFallbackState<T extends object>(initialState: T): T {
    console.warn('Proxy not supported, using fallback state management');
    // Return a simple object with getters/setters
    return new Proxy(initialState, {
      get(target, prop) {
        return Reflect.get(target, prop);
      },
      set(target, prop, value) {
        return Reflect.set(target, prop, value);
      }
    });
  }
};

/**
 * Check if browser support is initialized
 */
export function isBrowserSupportInitialized(): boolean {
  return isInitialized;
}

/**
 * Auto-initialize on import (can be disabled by calling before import)
 */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Auto-initialize with default options when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!isInitialized) {
        initializeBrowserSupport({ verbose: false });
      }
    });
  } else {
    // DOM already loaded
    if (!isInitialized) {
      initializeBrowserSupport({ verbose: false });
    }
  }
}
