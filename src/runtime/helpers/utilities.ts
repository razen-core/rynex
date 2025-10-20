/**
 * Rynex Utility Helpers
 * Utility functions for conditional rendering, fragments, etc.
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';
import { effect } from '../state.js';

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
 * Show/hide based on condition with reactive support
 * Usage: show(state.visible, element) or show(() => state.count > 0, element)
 * Properly toggles DOM presence (not just display:none)
 */
export function show(condition: boolean | (() => boolean), content: HTMLElement): HTMLElement {
  const container = createElement('div', { 'data-conditional': 'true' });
  let isAttached = false;
  
  const updateVisibility = (visible: boolean) => {
    if (visible && !isAttached) {
      container.appendChild(content);
      isAttached = true;
    } else if (!visible && isAttached) {
      if (container.contains(content)) {
        container.removeChild(content);
      }
      isAttached = false;
    }
  };
  
  if (typeof condition === 'function') {
    // Reactive condition
    effect(() => {
      updateVisibility(condition());
    });
  } else {
    // Static condition
    updateVisibility(condition);
  }
  
  return container;
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

/**
 * CSS helper - add styles to external stylesheet
 * Usage: css('.my-class', { color: 'red', fontSize: '16px' })
 * Styles are added to a <style> tag in the document head
 */
let styleSheet: CSSStyleSheet | null = null;
let styleElement: HTMLStyleElement | null = null;

export function css(selector: string, styles: Partial<CSSStyleDeclaration> | string): void {
  // Create style element if it doesn't exist
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.setAttribute('data-rynex-styles', 'true');
    document.head.appendChild(styleElement);
    styleSheet = styleElement.sheet as CSSStyleSheet;
  }
  
  if (typeof styles === 'string') {
    // Raw CSS string
    const rule = `${selector} { ${styles} }`;
    if (styleSheet) {
      styleSheet.insertRule(rule, styleSheet.cssRules.length);
    }
  } else {
    // Style object - convert to CSS string
    const cssText = Object.entries(styles)
      .map(([key, value]) => {
        // Convert camelCase to kebab-case
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');
    
    const rule = `${selector} { ${cssText} }`;
    if (styleSheet) {
      styleSheet.insertRule(rule, styleSheet.cssRules.length);
    }
  }
}
