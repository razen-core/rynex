/**
 * Rynex Refs and DOM Access
 * Reference management for DOM elements
 */

export interface Ref<T = HTMLElement> {
  current: T | null;
}

/**
 * Create a ref object
 * Used to hold reference to DOM element
 */
export function ref<T = HTMLElement>(initialValue: T | null = null): Ref<T> {
  return {
    current: initialValue,
  };
}

/**
 * Use ref hook
 * Creates and returns a ref object
 */
export function useRef<T = HTMLElement>(initialValue: T | null = null): Ref<T> {
  return ref(initialValue);
}

/**
 * Forward ref to child component
 * Allows parent to access child's DOM element
 */
export function forwardRef<P extends Record<string, any>>(
  component: (props: P, ref: Ref) => HTMLElement,
): (props: P & { ref?: Ref }) => HTMLElement {
  return (props: P & { ref?: Ref }) => {
    const internalRef = props.ref || ref();
    const element = component(props, internalRef);

    if (internalRef) {
      internalRef.current = element;
    }

    return element;
  };
}

/**
 * Create callback ref
 * Executes callback when ref is set
 */
export function callbackRef<T = HTMLElement>(
  callback: (element: T | null) => void,
): (element: T | null) => void {
  return (element: T | null) => {
    callback(element);
  };
}

/**
 * Merge multiple refs into one
 * Useful when you need to forward ref and use it internally
 */
export function mergeRefs<T = HTMLElement>(
  ...refs: (Ref<T> | ((element: T | null) => void) | null)[]
): (element: T | null) => void {
  return (element: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(element);
      } else {
        ref.current = element;
      }
    });
  };
}
