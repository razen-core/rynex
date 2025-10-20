/**
 * Rynex Runtime
 * Main entry point for the runtime library
 * Vanilla JavaScript approach - no Virtual DOM
 */

// State management (Proxy-based reactivity)
export { state, computed, effect, subscribe, batch } from './state.js';

// DOM manipulation (direct, no VDOM)
export {
  createElement,
  createTextNode,
  mount,
  unmount,
  createRef,
  applyProps,
  updateProps,
  appendChildren,
  replaceChildren,
  $,
  $$,
  addClass,
  removeClass,
  toggleClass,
  setStyle,
  setAttributes,
  on,
  off
} from './dom.js';

// Renderer
export { render, createComponent, mountComponent } from './renderer.js';
export type { ComponentInstance } from './renderer.js';

// Debug utilities
export { enableDebug, disableDebug, isDebugEnabled } from './debug.js';

// All Helper functions (organized by category)
export * from './helpers/index.js';

// Router
export {
  Router,
  createRouter,
  createLink,
  useParams,
  useQuery,
  useNavigate
} from './router.js';
export type {
  RouteConfig,
  RouteContext,
  RouteComponent,
  RouteMiddleware,
  RouteGuard,
  RouteParams,
  RouteQuery,
  NavigationOptions
} from './router.js';

// Types
export type { DOMProps, DOMChildren, DOMChild } from './dom.js';
