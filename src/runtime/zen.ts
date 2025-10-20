/**
 * Rynex Global Namespace
 * Import everything with: import * as Zen from 'rynex/runtime'
 * Then use: Zen.vbox(), Zen.state(), etc.
 */

// Re-export everything from the main runtime
export * from './index.js';

// Create a default export with all functions
import * as state from './state.js';
import * as dom from './dom.js';
import * as renderer from './renderer.js';
import * as helpers from './helpers/index.js';

export default {
  // State management
  ...state,
  
  // DOM manipulation
  ...dom,
  
  // Renderer
  ...renderer,
  
  // All helpers
  ...helpers
};
