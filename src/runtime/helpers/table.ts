/**
 * ZenWeb Table Elements
 * Table-related elements
 */

import { h } from '../vdom.js';
import type { VNode, VNodeProps, VNodeChild } from '../types.js';

/**
 * Table container
 */
export function table(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('table', props, ...children);
}

/**
 * Table head
 */
export function thead(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('thead', props, ...children);
}

/**
 * Table body
 */
export function tbody(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('tbody', props, ...children);
}

/**
 * Table footer
 */
export function tfoot(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('tfoot', props, ...children);
}

/**
 * Table row
 */
export function tr(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('tr', props, ...children);
}

/**
 * Table header cell
 */
export function th(props: VNodeProps, content: VNodeChild): VNode {
  return h('th', props, content);
}

/**
 * Table data cell
 */
export function td(props: VNodeProps, content: VNodeChild): VNode {
  return h('td', props, content);
}

/**
 * Table caption
 */
export function caption(props: VNodeProps, content: VNodeChild): VNode {
  return h('caption', props, content);
}

/**
 * Column group
 */
export function colgroup(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('colgroup', props, ...children);
}

/**
 * Column
 */
export function col(props: VNodeProps): VNode {
  return h('col', props);
}
