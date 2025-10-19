/**
 * ZenWeb Utility Helpers
 * Utility functions for conditional rendering, fragments, etc.
 */

import { h } from '../vdom.js';
import type { VNode, VNodeChild } from '../types.js';

/**
 * Fragment - render children without wrapper
 */
export function fragment(children: VNodeChild[]): VNode[] {
  return children.filter(child => child !== null && child !== undefined) as VNode[];
}

/**
 * Conditional rendering - show content when condition is true
 */
export function when(condition: boolean, content: () => VNode | VNodeChild): VNode | null {
  return condition ? (content() as VNode) : null;
}

/**
 * Show/hide based on condition
 */
export function show(condition: boolean, content: VNode): VNode | null {
  return condition ? content : null;
}

/**
 * Iterate over array and render items
 */
export function each<T>(
  items: T[],
  renderFn: (item: T, index: number) => VNode,
  keyFn?: (item: T, index: number) => string | number
): VNode[] {
  return items.map((item, index) => {
    const vnode = renderFn(item, index);
    if (keyFn) {
      vnode.key = keyFn(item, index);
    }
    return vnode;
  });
}

/**
 * Switch case rendering
 */
export function switchCase<T>(
  value: T,
  cases: Record<string, () => VNode>,
  defaultCase?: () => VNode
): VNode | null {
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
  children?: VNodeChild[]
): VNode {
  if (typeof component === 'function') {
    return component(props) as VNode;
  }
  return h(component, props, ...(children || []));
}

/**
 * Portal - render content in a different DOM location
 * Note: This is a placeholder for future implementation
 */
export function portal(children: VNodeChild[], target: string | HTMLElement): VNode {
  // TODO: Implement portal functionality
  return h('div', { 'data-portal': true }, ...children);
}
