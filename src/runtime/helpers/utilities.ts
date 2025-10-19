/**
 * ZenWeb Utility Helpers
 * Utility functions for conditional rendering, fragments, etc.
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';

/**
 * Fragment - render children without wrapper
 */
export function fragment(...children: DOMChildren[]): HTMLElement[] {
  const flat = children.flat(Infinity).filter(child => child !== null && child !== undefined) as any[];
  return flat.filter(child => child instanceof HTMLElement) as HTMLElement[];
}

/**
 * Conditional rendering - show content when condition is true
 */
export function when(condition: boolean, content: () => HTMLElement | DOMChildren): HTMLElement | null {
  return condition ? (content() as HTMLElement) : null;
}

/**
 * Show/hide based on condition
 */
export function show(condition: boolean, content: HTMLElement): HTMLElement | null {
  if (condition) {
    content.style.display = '';
    return content;
  } else {
    content.style.display = 'none';
    return null;
  }
}

/**
 * Iterate over array and render items
 */
export function each<T>(
  items: T[],
  renderFn: (item: T, index: number) => HTMLElement,
  keyFn?: (item: T, index: number) => string | number
): HTMLElement[] {
  return items.map((item, index) => {
    const element = renderFn(item, index);
    if (keyFn) {
      element.dataset.key = String(keyFn(item, index));
    }
    return element;
  });
}

/**
 * Switch case rendering
 */
export function switchCase<T>(
  value: T,
  cases: Record<string, () => HTMLElement>,
  defaultCase?: () => HTMLElement
): HTMLElement | null {
  const key = String(value);
  if (cases[key]) {
    return cases[key]();
  }
  return defaultCase ? defaultCase() : null;
}

/**
 * Dynamic component - render component based on type
 */
export function dynamic(
  component: Function | string,
  props: any,
  ...children: DOMChildren[]
): HTMLElement {
  if (typeof component === 'function') {
    return component(props) as HTMLElement;
  }
  return createElement(component, props, ...children);
}

/**
 * Portal - render content in a different DOM location
 */
export function portal(children: DOMChildren[], target: string | HTMLElement): HTMLElement {
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (container) {
    const flat = children.flat(Infinity);
    flat.forEach(child => {
      if (child instanceof HTMLElement) {
        container.appendChild(child);
      } else if (typeof child === 'string' || typeof child === 'number') {
        container.appendChild(document.createTextNode(String(child)));
      }
    });
  }
  return createElement('div', { 'data-portal': true });
}
