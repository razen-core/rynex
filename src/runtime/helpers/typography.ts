/**
 * ZenWeb Typography Helpers
 * Text and typography elements
 */

import { h } from '../vdom.js';
import type { VNode, VNodeProps, VNodeChild } from '../types.js';

/**
 * Heading elements
 */
export function h1(props: VNodeProps, content: VNodeChild): VNode {
  return h('h1', props, content);
}

export function h2(props: VNodeProps, content: VNodeChild): VNode {
  return h('h2', props, content);
}

export function h3(props: VNodeProps, content: VNodeChild): VNode {
  return h('h3', props, content);
}

export function h4(props: VNodeProps, content: VNodeChild): VNode {
  return h('h4', props, content);
}

export function h5(props: VNodeProps, content: VNodeChild): VNode {
  return h('h5', props, content);
}

export function h6(props: VNodeProps, content: VNodeChild): VNode {
  return h('h6', props, content);
}

/**
 * Bold text
 */
export function strong(props: VNodeProps, content: VNodeChild): VNode {
  return h('strong', props, content);
}

/**
 * Italic text
 */
export function em(props: VNodeProps, content: VNodeChild): VNode {
  return h('em', props, content);
}

/**
 * Inline code
 */
export function code(props: VNodeProps, content: VNodeChild): VNode {
  return h('code', props, content);
}

/**
 * Preformatted text
 */
export function pre(props: VNodeProps, content: VNodeChild): VNode {
  return h('pre', props, content);
}

/**
 * Blockquote
 */
export function blockquote(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('blockquote', props, ...children);
}

/**
 * Highlighted text
 */
export function mark(props: VNodeProps, content: VNodeChild): VNode {
  return h('mark', props, content);
}

/**
 * Small text
 */
export function small(props: VNodeProps, content: VNodeChild): VNode {
  return h('small', props, content);
}

/**
 * Deleted text
 */
export function del(props: VNodeProps, content: VNodeChild): VNode {
  return h('del', props, content);
}

/**
 * Inserted text
 */
export function ins(props: VNodeProps, content: VNodeChild): VNode {
  return h('ins', props, content);
}

/**
 * Subscript
 */
export function sub(props: VNodeProps, content: VNodeChild): VNode {
  return h('sub', props, content);
}

/**
 * Superscript
 */
export function sup(props: VNodeProps, content: VNodeChild): VNode {
  return h('sup', props, content);
}

/**
 * Abbreviation
 */
export function abbr(props: VNodeProps & { title: string }, content: VNodeChild): VNode {
  return h('abbr', props, content);
}

/**
 * Citation
 */
export function cite(props: VNodeProps, content: VNodeChild): VNode {
  return h('cite', props, content);
}

/**
 * Keyboard input
 */
export function kbd(props: VNodeProps, content: VNodeChild): VNode {
  return h('kbd', props, content);
}

/**
 * Sample output
 */
export function samp(props: VNodeProps, content: VNodeChild): VNode {
  return h('samp', props, content);
}

/**
 * Variable
 */
export function varElement(props: VNodeProps, content: VNodeChild): VNode {
  return h('var', props, content);
}
