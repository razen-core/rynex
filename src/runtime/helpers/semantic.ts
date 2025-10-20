/**
 * Rynex Semantic Elements
 * Semantic HTML5 elements
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';

/**
 * Header section
 */
export function header(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('header', props, ...children);
}

/**
 * Footer section
 */
export function footer(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('footer', props, ...children);
}

/**
 * Navigation
 */
export function nav(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('nav', props, ...children);
}

/**
 * Main content
 */
export function main(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('main', props, ...children);
}

/**
 * Section
 */
export function section(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('section', props, ...children);
}

/**
 * Article
 */
export function article(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('article', props, ...children);
}

/**
 * Aside/Sidebar
 */
export function aside(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('aside', props, ...children);
}

/**
 * Figure with caption
 */
export function figure(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('figure', props, ...children);
}

/**
 * Figure caption
 */
export function figcaption(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('figcaption', props, ...content);
}

/**
 * Time element
 */
export function time(props: DOMProps & { datetime?: string }, ...content: DOMChildren[]): HTMLTimeElement {
  return createElement('time', props, ...content) as HTMLTimeElement;
}

/**
 * Address element
 */
export function address(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('address', props, ...children);
}

/**
 * Details disclosure
 */
export function details(props: DOMProps & { open?: boolean }, ...children: DOMChildren[]): HTMLDetailsElement {
  return createElement('details', props, ...children) as HTMLDetailsElement;
}

/**
 * Details summary
 */
export function summary(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('summary', props, ...content);
}

/**
 * Dialog element
 */
export function dialog(props: DOMProps & { open?: boolean }, ...children: DOMChildren[]): HTMLDialogElement {
  return createElement('dialog', props, ...children) as HTMLDialogElement;
}
