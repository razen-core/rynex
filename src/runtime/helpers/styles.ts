/**
 * Rynex Style Utilities
 * Advanced styling helpers
 */

import { createElement, DOMProps } from "../dom.js";

/**
 * Theme context for managing application theme
 */
interface Theme {
  [key: string]: any;
}

let currentTheme: Theme = {};
const themeListeners = new Set<(theme: Theme) => void>();

/**
 * Set application theme
 */
export function setTheme(theme: Theme): void {
  currentTheme = { ...currentTheme, ...theme };
  themeListeners.forEach((listener) => listener(currentTheme));
}

/**
 * Get current theme
 */
export function getTheme(): Theme {
  return { ...currentTheme };
}

/**
 * Use theme hook
 * Returns current theme and updates when theme changes
 */
export function useTheme(callback: (theme: Theme) => void): () => void {
  callback(currentTheme);
  themeListeners.add(callback);

  return () => {
    themeListeners.delete(callback);
  };
}

/**
 * Styled component creator
 * Creates a component with predefined styles
 */
export function styled<P extends DOMProps>(
  tag: string,
  styles:
    | Partial<CSSStyleDeclaration>
    | ((props: P) => Partial<CSSStyleDeclaration>),
): (props: P, ...children: any[]) => HTMLElement {
  return (props: P, ...children: any[]) => {
    const computedStyles =
      typeof styles === "function" ? styles(props) : styles;

    const mergedProps = {
      ...props,
      style: {
        ...(typeof props.style === "object" ? props.style : {}),
        ...computedStyles,
      },
    };

    return createElement(tag, mergedProps, ...children);
  };
}

/**
 * Conditional class names helper
 * Combines class names based on conditions
 */
export function classNames(
  ...args: (string | Record<string, boolean> | false | null | undefined)[]
): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return;

    if (typeof arg === "string") {
      classes.push(arg);
    } else if (typeof arg === "object") {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(" ");
}

/**
 * Merge style objects
 * Deep merges multiple style objects
 */
export function mergeStyles(
  ...styles: (
    | Partial<CSSStyleDeclaration>
    | Record<string, any>
    | null
    | undefined
  )[]
): Record<string, any> {
  const merged: Record<string, any> = {};

  styles.forEach((style) => {
    if (!style) return;

    Object.entries(style).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        merged[key] = value;
      }
    });
  });

  return merged;
}

/**
 * Create CSS variables from theme
 */
export function createCSSVariables(
  theme: Theme,
  prefix: string = "--theme",
): string {
  const vars: string[] = [];

  const processObject = (obj: any, path: string = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      const varName = path ? `${path}-${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        processObject(value, varName);
      } else {
        vars.push(`${prefix}-${varName}: ${value};`);
      }
    });
  };

  processObject(theme);
  return vars.join("\n");
}

/**
 * Apply theme as CSS variables to root
 */
export function applyThemeVariables(
  theme: Theme,
  prefix: string = "--theme",
): void {
  const cssVars = createCSSVariables(theme, prefix);
  const style = document.createElement("style");
  style.setAttribute("data-theme-vars", "true");
  style.textContent = `:root {\n${cssVars}\n}`;

  // Remove old theme vars
  const oldStyle = document.querySelector('style[data-theme-vars="true"]');
  if (oldStyle) {
    oldStyle.remove();
  }

  document.head.appendChild(style);
}

/**
 * Get CSS variable value
 */
export function getCSSVariable(
  name: string,
  element: HTMLElement = document.documentElement,
): string {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

/**
 * Set CSS variable value
 */
export function setCSSVariable(
  name: string,
  value: string,
  element: HTMLElement = document.documentElement,
): void {
  element.style.setProperty(name, value);
}
