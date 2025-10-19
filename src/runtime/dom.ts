/**
 * ZenWeb DOM Manipulation
 * Direct DOM element creation and manipulation (vanilla JavaScript)
 * No Virtual DOM - just real DOM elements
 */

import { debugLog } from './debug.js';

export type DOMChild = HTMLElement | SVGElement | Text | string | number | boolean | null | undefined;
export type DOMChildren = DOMChild | DOMChild[];

export interface DOMProps {
  [key: string]: any;
  class?: string;
  className?: string;
  id?: string;
  style?: string | Partial<CSSStyleDeclaration> | Record<string, any>;
  onHover?: Partial<CSSStyleDeclaration> | Record<string, any>;
  onClick?: (event: MouseEvent) => void;
  onInput?: (event: Event) => void;
  onChange?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onDoubleClick?: (event: MouseEvent) => void;
  onContextMenu?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onScroll?: (event: Event) => void;
  onDrag?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  ref?: { current: HTMLElement | null };
}

/**
 * Create a real DOM element (vanilla JavaScript)
 * This is the core function that replaces the h() virtual DOM function
 */
export function createElement(
  tag: string,
  props: DOMProps | null = null,
  ...children: DOMChildren[]
): HTMLElement {
  const element = document.createElement(tag);
  
  // Apply props
  if (props) {
    applyProps(element, props);
  }
  
  // Append children
  appendChildren(element, children);
  
  debugLog('DOM', `Created element: ${tag}`);
  return element;
}

/**
 * Create a text node
 */
export function createTextNode(text: string | number): Text {
  return document.createTextNode(String(text));
}

/**
 * Apply properties to a DOM element
 */
export function applyProps(element: HTMLElement, props: DOMProps): void {
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) {
      continue;
    }
    
    // Handle event listeners
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value as EventListener);
      debugLog('DOM', `Added event listener: ${eventName}`);
    }
    // Handle class/className
    else if (key === 'class' || key === 'className') {
      element.className = value;
    }
    // Handle style
    else if (key === 'style') {
      if (typeof value === 'string') {
        element.setAttribute('style', value);
      } else if (typeof value === 'object') {
        // Apply styles with proper camelCase to kebab-case conversion
        for (const [styleKey, styleValue] of Object.entries(value)) {
          if (styleValue !== null && styleValue !== undefined) {
            // Convert camelCase to kebab-case for CSS properties
            const cssKey = styleKey.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
            (element.style as any)[styleKey] = styleValue;
          }
        }
      }
    }
    // Handle hover styles
    else if (key === 'onHover' && typeof value === 'object') {
      const hoverStyles = value;
      element.addEventListener('mouseenter', () => {
        for (const [styleKey, styleValue] of Object.entries(hoverStyles)) {
          if (styleValue !== null && styleValue !== undefined) {
            (element.style as any)[styleKey] = styleValue;
          }
        }
      });
      // Store original styles to restore on mouse leave
      const originalStyles: Record<string, any> = {};
      for (const styleKey of Object.keys(hoverStyles)) {
        originalStyles[styleKey] = (element.style as any)[styleKey];
      }
      element.addEventListener('mouseleave', () => {
        for (const [styleKey, styleValue] of Object.entries(originalStyles)) {
          (element.style as any)[styleKey] = styleValue;
        }
      });
    }
    // Handle ref
    else if (key === 'ref' && typeof value === 'object' && 'current' in value) {
      value.current = element;
    }
    // Handle special properties
    else if (key === 'value') {
      (element as any).value = value;
    }
    else if (key === 'checked') {
      (element as any).checked = value;
    }
    // Handle data attributes
    else if (key.startsWith('data-')) {
      element.setAttribute(key, String(value));
    }
    // Handle aria attributes
    else if (key.startsWith('aria-')) {
      element.setAttribute(key, String(value));
    }
    // Handle other attributes
    else {
      element.setAttribute(key, String(value));
    }
  }
}

/**
 * Update properties on a DOM element
 */
export function updateProps(element: HTMLElement, oldProps: DOMProps, newProps: DOMProps): void {
  // Remove old props
  for (const key in oldProps) {
    if (!(key in newProps)) {
      removeProp(element, key, oldProps[key]);
    }
  }
  
  // Add/update new props
  for (const key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      // Remove old event listener if it's an event
      if (key.startsWith('on') && typeof oldProps[key] === 'function') {
        const eventName = key.slice(2).toLowerCase();
        element.removeEventListener(eventName, oldProps[key] as EventListener);
      }
      
      // Apply new prop
      applyProps(element, { [key]: newProps[key] });
    }
  }
}

/**
 * Remove a property from a DOM element
 */
export function removeProp(element: HTMLElement, key: string, value: any): void {
  if (key.startsWith('on') && typeof value === 'function') {
    const eventName = key.slice(2).toLowerCase();
    element.removeEventListener(eventName, value as EventListener);
  } else if (key === 'class' || key === 'className') {
    element.className = '';
  } else if (key === 'style') {
    element.removeAttribute('style');
  } else if (key !== 'ref') {
    element.removeAttribute(key);
  }
}

/**
 * Append children to a DOM element
 */
export function appendChildren(parent: HTMLElement | SVGElement, children: DOMChildren[]): void {
  const flatChildren = children.flat(Infinity) as DOMChild[];
  
  for (const child of flatChildren) {
    if (child === null || child === undefined || child === false || child === true) {
      continue;
    }
    
    if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(createTextNode(child));
    } else if (child instanceof HTMLElement || child instanceof SVGElement || child instanceof Text) {
      parent.appendChild(child);
    }
  }
}

/**
 * Replace all children of an element
 */
export function replaceChildren(parent: HTMLElement, children: DOMChildren[]): void {
  // Clear existing children
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  
  // Append new children
  appendChildren(parent, children);
}

/**
 * Mount an element to a container
 */
export function mount(element: HTMLElement, container: HTMLElement): void {
  container.appendChild(element);
  debugLog('DOM', 'Mounted element to container');
}

/**
 * Unmount an element from its parent
 */
export function unmount(element: HTMLElement): void {
  if (element.parentElement) {
    element.parentElement.removeChild(element);
    debugLog('DOM', 'Unmounted element');
  }
}

/**
 * Create a ref object for accessing DOM elements
 */
export function createRef<T extends HTMLElement = HTMLElement>(): { current: T | null } {
  return { current: null };
}

/**
 * Query selector helper
 */
export function $(selector: string, parent: HTMLElement | Document = document): HTMLElement | null {
  return parent.querySelector(selector);
}

/**
 * Query selector all helper
 */
export function $$(selector: string, parent: HTMLElement | Document = document): HTMLElement[] {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Add class to element
 */
export function addClass(element: HTMLElement, ...classNames: string[]): void {
  element.classList.add(...classNames);
}

/**
 * Remove class from element
 */
export function removeClass(element: HTMLElement, ...classNames: string[]): void {
  element.classList.remove(...classNames);
}

/**
 * Toggle class on element
 */
export function toggleClass(element: HTMLElement, className: string, force?: boolean): void {
  element.classList.toggle(className, force);
}

/**
 * Set styles on element
 */
export function setStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
  Object.assign(element.style, styles);
}

/**
 * Set attributes on element
 */
export function setAttributes(element: HTMLElement, attrs: Record<string, string>): void {
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }
}

/**
 * Add event listener helper
 */
export function on<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler as EventListener, options);
  return () => element.removeEventListener(event, handler as EventListener, options);
}

/**
 * Remove event listener helper
 */
export function off<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void
): void {
  element.removeEventListener(event, handler as EventListener);
}
