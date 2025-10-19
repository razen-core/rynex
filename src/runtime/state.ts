/**
 * ZenWeb State Management
 * Reactive state tracking with automatic dependency collection
 */

import { debugLog, debugWarn } from './debug.js';

type EffectFunction = () => void;
type StateGetter<T> = () => T;
type StateSetter<T> = (value: T | ((prev: T) => T)) => void;

let currentComponent: any = null;
let currentEffect: EffectFunction | null = null;
const componentStates = new WeakMap<any, ReactiveState<any>[]>();
let stateIdCounter = 0;

class ReactiveState<T> {
  private _value: T;
  private _subscribers: Set<EffectFunction>;
  private _id: number;

  constructor(initialValue: T) {
    this._value = initialValue;
    this._subscribers = new Set();
    this._id = stateIdCounter++;
    debugLog('State', `Created state #${this._id}`, initialValue);
  }

  get value(): T {
    // Track dependency if we're inside a component or effect
    if (currentEffect) {
      this._subscribers.add(currentEffect);
      debugLog('State', `State #${this._id} tracked by effect`);
    }
    debugLog('State', `State #${this._id} read`, this._value);
    return this._value;
  }

  set value(newValue: T) {
    const oldValue = this._value;
    if (this._value !== newValue) {
      this._value = newValue;
      debugLog('State', `State #${this._id} changed from ${oldValue} to ${newValue}`);
      this._notify();
    } else {
      debugWarn('State', `State #${this._id} set to same value, skipping update`);
    }
  }

  private _notify(): void {
    // Batch updates for performance
    const subscribers = Array.from(this._subscribers);
    debugLog('State', `Notifying ${subscribers.length} subscribers for state #${this._id}`);
    
    queueMicrotask(() => {
      subscribers.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in state subscriber:', error);
        }
      });
    });
  }

  cleanup(): void {
    debugLog('State', `Cleaning up state #${this._id}`);
    this._subscribers.clear();
  }
}

/**
 * Create a reactive state value
 * @param initialValue - Initial state value
 * @returns Tuple of getter and setter
 */
export function state<T>(initialValue: T): [StateGetter<T>, StateSetter<T>] {
  const reactiveState = new ReactiveState<T>(initialValue);

  const getter: StateGetter<T> = () => reactiveState.value;
  const setter: StateSetter<T> = (newValue) => {
    const finalValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(reactiveState.value) 
      : newValue;
    
    debugLog('State', `Setter called with value`, finalValue);
    reactiveState.value = finalValue;
    
    // Trigger component update if we have a current component
    if (currentComponent && (currentComponent as any).update) {
      debugLog('State', `Triggering component update`);
      (currentComponent as any).update();
    } else {
      debugWarn('State', `No current component to update`);
    }
  };

  // Store reference for cleanup
  if (currentComponent) {
    if (!componentStates.has(currentComponent)) {
      componentStates.set(currentComponent, []);
    }
    componentStates.get(currentComponent)!.push(reactiveState);
    debugLog('State', `State registered to component`);
  } else {
    debugWarn('State', `State created outside component context`);
  }

  return [getter, setter];
}

/**
 * Create a computed value that automatically updates when dependencies change
 * @param computeFn - Function that computes the value
 * @returns Getter function for computed value
 */
export function computed<T>(computeFn: () => T): StateGetter<T> {
  const [value, setValue] = state<T>(null as T);
  
  const effectFn: EffectFunction = () => {
    const oldEffect = currentEffect;
    currentEffect = effectFn;
    try {
      const newValue = computeFn();
      setValue(newValue);
    } finally {
      currentEffect = oldEffect;
    }
  };

  effectFn(); // Run once to establish dependencies
  return value;
}

/**
 * Run an effect when dependencies change
 * @param effectFn - Effect function to run
 */
export function effect(effectFn: EffectFunction): void {
  const wrappedEffect: EffectFunction = () => {
    const oldEffect = currentEffect;
    currentEffect = wrappedEffect;
    try {
      effectFn();
    } finally {
      currentEffect = oldEffect;
    }
  };

  wrappedEffect();
}

/**
 * Set the current component context for state tracking
 * @param component - Component instance
 */
export function setCurrentComponent(component: any): void {
  currentComponent = component;
}

/**
 * Cleanup all states associated with a component
 * @param component - Component instance
 */
export function cleanupComponent(component: any): void {
  const states = componentStates.get(component);
  if (states) {
    states.forEach(state => state.cleanup());
    componentStates.delete(component);
  }
}
