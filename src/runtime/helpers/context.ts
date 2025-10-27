/**
 * Rynex Context & State Management Utilities
 * Provides context API similar to React's Context and global store management
 */

import { state as createReactiveState, effect } from "../state.js";
import { createElement } from "../dom.js";
import { debugLog, debugWarn } from "../debug.js";

/**
 * Context storage - maps context keys to their values
 */
const contextMap = new Map<symbol | string, any>();
const contextStack: Array<{ key: symbol | string; value: any }> = [];

/**
 * Store registry - global stores
 */
const storeRegistry = new Map<string, any>();

/**
 * Create a context
 * Returns a unique key for the context
 */
export function createContext<T>(defaultValue?: T): {
  key: symbol;
  Provider: (props: { value: T; children: HTMLElement }) => HTMLElement;
  defaultValue?: T;
} {
  const key = Symbol("context");

  const Provider = (props: {
    value: T;
    children: HTMLElement;
  }): HTMLElement => {
    if (!props.children) {
      debugWarn("Context", "Provider requires children");
      return createElement("div", { "data-context-provider": "true" });
    }

    // Store context value
    contextStack.push({ key, value: props.value });
    contextMap.set(key, props.value);
    debugLog("Context", "Provider created with value");

    // Create container
    const container = createElement("div", { "data-context-provider": "true" });
    container.appendChild(props.children);

    // Cleanup when removed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === container) {
            const index = contextStack.findIndex((c) => c.key === key);
            if (index !== -1) {
              contextStack.splice(index, 1);
            }
            contextMap.delete(key);
            observer.disconnect();
          }
        });
      });
    });

    if (container.parentNode) {
      observer.observe(container.parentNode, { childList: true });
    }

    return container;
  };

  return {
    key,
    Provider,
    defaultValue,
  };
}

/**
 * Use context value
 * Retrieves the nearest context value from the context stack
 */
export function useContext<T>(context: { key: symbol; defaultValue?: T }): T {
  if (!context || !context.key) {
    debugWarn("Context", "Invalid context provided to useContext");
    throw new Error("Invalid context object");
  }

  const value = contextMap.get(context.key);

  if (value === undefined) {
    if (context.defaultValue !== undefined) {
      debugLog("Context", "Using default context value");
      return context.defaultValue;
    }
    debugWarn("Context", "Context value not found");
    throw new Error(
      "Context value not found. Make sure you are using the context within a Provider.",
    );
  }

  debugLog("Context", "Context value retrieved");
  return value as T;
}

/**
 * Provider component - wraps children with context value
 * This is a generic provider that can be used with any context
 */
export function provider<T>(
  contextKey: symbol,
  value: T,
  children: HTMLElement,
): HTMLElement {
  if (!contextKey) {
    debugWarn("Context", "Invalid context key provided to provider");
    return createElement("div", { "data-provider": "true" });
  }

  if (!children) {
    debugWarn("Context", "Provider requires children");
    return createElement("div", { "data-provider": "true" });
  }

  contextStack.push({ key: contextKey, value });
  contextMap.set(contextKey, value);
  debugLog("Context", "Generic provider created");

  const container = createElement("div", { "data-provider": "true" });
  container.appendChild(children);

  // Cleanup when removed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === container) {
          const index = contextStack.findIndex((c) => c.key === contextKey);
          if (index !== -1) {
            contextStack.splice(index, 1);
          }
          contextMap.delete(contextKey);
          observer.disconnect();
        }
      });
    });
  });

  if (container.parentNode) {
    observer.observe(container.parentNode, { childList: true });
  }

  return container;
}

/**
 * Create a global store
 * Returns a reactive store with actions
 */
export function createStore<
  T extends object,
  A extends Record<string, Function>,
>(
  name: string,
  initialState: T,
  actions?: (state: T) => A,
): {
  state: T;
  actions: A;
  subscribe: (listener: () => void) => () => void;
  getState: () => T;
} {
  if (!name || typeof name !== "string") {
    debugWarn("Store", "Store name must be a non-empty string");
    throw new Error("Invalid store name");
  }

  if (!initialState || typeof initialState !== "object") {
    debugWarn("Store", "Initial state must be an object");
    throw new Error("Invalid initial state");
  }

  // Check if store already exists
  if (storeRegistry.has(name)) {
    debugWarn(
      "Store",
      `Store "${name}" already exists. Returning existing store.`,
    );
    return storeRegistry.get(name);
  }

  debugLog("Store", `Creating store: ${name}`);

  // Create reactive state
  const reactiveState = createReactiveState(initialState);

  // Create actions bound to state
  const boundActions = actions ? actions(reactiveState) : ({} as A);

  // Subscription management
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    if (typeof listener !== "function") {
      debugWarn("Store", "Listener must be a function");
      return () => {};
    }

    listeners.add(listener);
    debugLog("Store", `Listener added to store: ${name}`);

    // Set up effect to call listener on state changes
    const cleanup = effect(() => {
      // Access all properties to track them
      Object.keys(reactiveState).forEach((key) => {
        (reactiveState as any)[key];
      });
      listener();
    });

    return () => {
      listeners.delete(listener);
      cleanup();
      debugLog("Store", `Listener removed from store: ${name}`);
    };
  };

  const getState = () => {
    return { ...reactiveState };
  };

  const store = {
    state: reactiveState,
    actions: boundActions,
    subscribe,
    getState,
  };

  // Register store
  storeRegistry.set(name, store);

  return store;
}

/**
 * Use store hook
 * Retrieves a store by name and optionally subscribes to updates
 */
export function useStore<T extends object, A extends Record<string, Function>>(
  name: string,
): {
  state: T;
  actions: A;
  subscribe: (listener: () => void) => () => void;
  getState: () => T;
} | null {
  if (!name || typeof name !== "string") {
    debugWarn("Store", "Store name must be a non-empty string");
    return null;
  }

  const store = storeRegistry.get(name);

  if (!store) {
    debugWarn(
      "Store",
      `Store "${name}" not found. Make sure to create it first with createStore.`,
    );
    return null;
  }

  debugLog("Store", `Store retrieved: ${name}`);
  return store;
}

/**
 * Get all registered stores
 */
export function getStores(): string[] {
  return Array.from(storeRegistry.keys());
}

/**
 * Remove a store from registry
 */
export function removeStore(name: string): boolean {
  if (!name || typeof name !== "string") {
    debugWarn("Store", "Store name must be a non-empty string");
    return false;
  }

  const deleted = storeRegistry.delete(name);
  if (deleted) {
    debugLog("Store", `Store removed: ${name}`);
  } else {
    debugWarn("Store", `Store not found: ${name}`);
  }
  return deleted;
}

/**
 * Clear all stores
 */
export function clearStores(): void {
  const count = storeRegistry.size;
  storeRegistry.clear();
  debugLog("Store", `Cleared ${count} stores`);
}
