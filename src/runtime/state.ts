/**
 * ZenWeb State Management
 * Vanilla JavaScript Proxy-based reactive state (no React hooks)
 */

import { debugLog, debugWarn } from './debug.js';

type Listener = () => void;
type EffectFunction = () => void;

// Track current effect being executed for dependency tracking
let currentEffect: EffectFunction | null = null;
const effectDependencies = new WeakMap<EffectFunction, Set<any>>();

/**
 * Create a reactive state object using Proxy
 * Any property access is tracked, any property change triggers updates
 */
export function state<T extends object>(initialState: T): T {
  const listeners = new Set<Listener>();
  const dependencies = new Map<string | symbol, Set<EffectFunction>>();

  const handler: ProxyHandler<T> = {
    get(target, prop, receiver) {
      // Track dependency if we're inside an effect
      if (currentEffect) {
        if (!dependencies.has(prop)) {
          dependencies.set(prop, new Set());
        }
        dependencies.get(prop)!.add(currentEffect);
        
        // Track reverse dependency
        if (!effectDependencies.has(currentEffect)) {
          effectDependencies.set(currentEffect, new Set());
        }
        effectDependencies.get(currentEffect)!.add(target);
        
        debugLog('State', `Tracking dependency: ${String(prop)}`);
      }
      
      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
      const oldValue = Reflect.get(target, prop, receiver);
      
      // Only update if value changed
      if (Object.is(oldValue, value)) {
        return true;
      }

      const result = Reflect.set(target, prop, value, receiver);
      
      if (result) {
        debugLog('State', `Property ${String(prop)} changed from ${oldValue} to ${value}`);
        
        // Notify property-specific effects
        const propEffects = dependencies.get(prop);
        if (propEffects) {
          propEffects.forEach(effect => {
            queueMicrotask(() => {
              try {
                effect();
              } catch (error) {
                console.error('Error in effect:', error);
              }
            });
          });
        }
        
        // Notify global listeners
        listeners.forEach(listener => {
          queueMicrotask(() => {
            try {
              listener();
            } catch (error) {
              console.error('Error in listener:', error);
            }
          });
        });
      }
      
      return result;
    }
  };

  const proxy = new Proxy(initialState, handler);
  
  // Store listeners reference for manual subscription
  (proxy as any).__listeners = listeners;
  
  return proxy;
}

/**
 * Create a computed value that automatically updates when dependencies change
 */
export function computed<T>(computeFn: () => T): { value: T } {
  let cachedValue: T;
  let isInitialized = false;

  const effectFn: EffectFunction = () => {
    const oldEffect = currentEffect;
    currentEffect = effectFn;
    try {
      cachedValue = computeFn();
      isInitialized = true;
      debugLog('Computed', 'Recomputed value:', cachedValue);
    } finally {
      currentEffect = oldEffect;
    }
  };

  // Run once to establish dependencies and get initial value
  effectFn();

  return {
    get value() {
      if (!isInitialized) {
        effectFn();
      }
      return cachedValue;
    }
  };
}

/**
 * Run an effect when reactive dependencies change
 */
export function effect(effectFn: EffectFunction): () => void {
  const wrappedEffect: EffectFunction = () => {
    const oldEffect = currentEffect;
    currentEffect = wrappedEffect;
    try {
      effectFn();
    } finally {
      currentEffect = oldEffect;
    }
  };

  // Run immediately to establish dependencies
  wrappedEffect();
  
  // Return cleanup function
  return () => {
    const deps = effectDependencies.get(wrappedEffect);
    if (deps) {
      deps.clear();
      effectDependencies.delete(wrappedEffect);
    }
  };
}

/**
 * Subscribe to state changes manually
 */
export function subscribe(stateObj: any, listener: Listener): () => void {
  if (stateObj.__listeners) {
    stateObj.__listeners.add(listener);
    debugLog('State', 'Added listener to state');
    
    return () => {
      stateObj.__listeners.delete(listener);
      debugLog('State', 'Removed listener from state');
    };
  }
  
  debugWarn('State', 'Object is not a reactive state');
  return () => {};
}

/**
 * Batch multiple state updates together
 */
let batchDepth = 0;
const pendingEffects = new Set<EffectFunction>();

export function batch(fn: () => void): void {
  batchDepth++;
  try {
    fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      // Execute all pending effects
      pendingEffects.forEach(effect => {
        queueMicrotask(() => {
          try {
            effect();
          } catch (error) {
            console.error('Error in batched effect:', error);
          }
        });
      });
      pendingEffects.clear();
    }
  }
}
