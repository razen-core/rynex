/**
 * Rynex Lifecycle Hooks
 * Component lifecycle management
 */

import { effect } from "../state.js";

type CleanupFunction = () => void;
type EffectFunction = () => void | CleanupFunction;

/**
 * Component mount lifecycle hook
 * Executes callback when element is mounted to DOM
 */
export function onMount(
  element: HTMLElement,
  callback: () => void | CleanupFunction,
): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node === element || (node as HTMLElement).contains?.(element)) {
            const cleanup = callback();
            if (cleanup && typeof cleanup === "function") {
              element.dataset.cleanup = "registered";
              (element as any).__cleanup = cleanup;
            }
            observer.disconnect();
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Check if already mounted
  if (document.body.contains(element)) {
    const cleanup = callback();
    if (cleanup && typeof cleanup === "function") {
      element.dataset.cleanup = "registered";
      (element as any).__cleanup = cleanup;
    }
    observer.disconnect();
  }
}

/**
 * Component unmount lifecycle hook
 * Executes callback when element is removed from DOM
 */
export function onUnmount(
  element: HTMLElement,
  callback: CleanupFunction,
): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.removedNodes.forEach((node) => {
          if (node === element || (node as HTMLElement).contains?.(element)) {
            callback();
            observer.disconnect();
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Component update lifecycle hook
 * Executes callback when element attributes or children change
 */
export function onUpdate(
  element: HTMLElement,
  callback: (mutations: MutationRecord[]) => void,
): CleanupFunction {
  const observer = new MutationObserver((mutations) => {
    callback(mutations);
  });

  observer.observe(element, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => observer.disconnect();
}

/**
 * Watch a reactive value and execute callback when it changes
 * Returns cleanup function
 */
export function watch<T>(
  getter: () => T,
  callback: (newValue: T, oldValue: T) => void,
  options?: { immediate?: boolean },
): CleanupFunction {
  let oldValue: T = getter();

  if (options?.immediate) {
    callback(oldValue, oldValue);
  }

  const cleanup = effect(() => {
    const newValue = getter();
    if (newValue !== oldValue) {
      callback(newValue, oldValue);
      oldValue = newValue;
    }
  });

  return cleanup;
}

/**
 * Watch effect - runs effect immediately and re-runs when dependencies change
 * Similar to effect but with explicit cleanup handling
 */
export function watchEffect(effectFn: EffectFunction): CleanupFunction {
  let cleanup: CleanupFunction | void;

  const wrappedEffect = () => {
    if (cleanup) {
      cleanup();
    }
    cleanup = effectFn();
  };

  const stopEffect = effect(wrappedEffect);

  return () => {
    if (cleanup) {
      cleanup();
    }
    stopEffect();
  };
}

/**
 * On error handler for component errors
 * Catches and handles errors within a component tree
 */
export function onError(
  element: HTMLElement,
  handler: (error: Error) => void,
): void {
  const errorHandler = (event: ErrorEvent) => {
    if (element.contains(event.target as Node)) {
      event.preventDefault();
      handler(event.error || new Error(event.message));
    }
  };

  window.addEventListener("error", errorHandler);

  onUnmount(element, () => {
    window.removeEventListener("error", errorHandler);
  });
}
