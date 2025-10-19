/**
 * ZenWeb Semantic Elements
 * Semantic HTML5 elements
 */

import { h } from '../vdom.js';
import type { VNode, VNodeProps, VNodeChild } from '../types.js';

/**
 * Header section
 */
export function header(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('header', props, ...children);
}

/**
 * Footer section
 */
export function footer(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('footer', props, ...children);
}

/**
 * Navigation
 */
export function nav(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('nav', props, ...children);
}

/**
 * Main content
 */
export function main(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('main', props, ...children);
}

/**
 * Section
 */
export function section(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('section', props, ...children);
}

/**
 * Article
 */
export function article(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('article', props, ...children);
}

/**
 * Aside/Sidebar
 */
export function aside(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('aside', props, ...children);
}

/**
 * Figure with caption
 */
export function figure(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('figure', props, ...children);
}

/**
 * Figure caption
 */
export function figcaption(props: VNodeProps, content: VNodeChild): VNode {
  return h('figcaption', props, content);
}

/**
 * Time element
 */
export function time(props: VNodeProps & { datetime?: string }, content: VNodeChild): VNode {
  return h('time', props, content);
}

/**
 * Address element
 */
export function address(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('address', props, ...children);
}

/**
 * Details disclosure
 */
export function details(props: VNodeProps & { open?: boolean }, children: VNodeChild[]): VNode {
  return h('details', props, ...children);
}

/**
 * Details summary
 */
export function summary(props: VNodeProps, content: VNodeChild): VNode {
  return h('summary', props, content);
}

/**
 * Dialog element
 */
export function dialog(props: VNodeProps & { open?: boolean }, children: VNodeChild[]): VNode {
  return h('dialog', props, ...children);
}
