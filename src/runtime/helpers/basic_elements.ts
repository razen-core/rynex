/**
 * ZenWeb Basic Elements
 * Basic HTML elements and components
 */

import { h } from '../vdom.js';
import type { VNode, VNodeProps, VNodeChild } from '../types.js';

/**
 * Div element (generic container)
 */
export function div(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('div', props, ...children);
}

/**
 * Span element (inline container)
 */
export function span(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('span', props, ...children);
}

/**
 * Text element
 */
export function text(props: VNodeProps | string, content?: string): VNode {
  if (typeof props === 'string') {
    return h('span', {}, props);
  }
  return h('span', props, content || '');
}

/**
 * Button element
 */
export function button(props: VNodeProps, content: VNodeChild): VNode {
  return h('button', props, content);
}

/**
 * Input element
 */
export function input(props: VNodeProps): VNode {
  return h('input', props);
}

/**
 * Image element
 */
export function image(props: VNodeProps & { src: string; alt?: string; lazy?: boolean }): VNode {
  const imgProps = { ...props };
  if (props.lazy) {
    imgProps.loading = 'lazy';
    delete imgProps.lazy;
  }
  return h('img', imgProps);
}

/**
 * Link/anchor element
 */
export function link(props: VNodeProps & { href: string }, children: VNodeChild[]): VNode {
  return h('a', props, ...children);
}

/**
 * Label element
 */
export function label(props: VNodeProps & { htmlFor?: string }, content: VNodeChild): VNode {
  return h('label', props, content);
}

/**
 * Paragraph element
 */
export function p(props: VNodeProps, content: VNodeChild): VNode {
  return h('p', props, content);
}

/**
 * List element with optimized rendering
 */
export function list<T>(
  props: VNodeProps & {
    items: T[];
    renderItem: (item: T, index: number) => VNode;
    keyExtractor?: (item: T, index: number) => string | number;
  }
): VNode {
  const { items, renderItem, keyExtractor, ...restProps } = props;
  const children = items.map((item, index) => {
    const child = renderItem(item, index);
    if (keyExtractor) {
      child.key = keyExtractor(item, index);
    }
    return child;
  });
  return h('div', restProps, ...children);
}

/**
 * Unordered list
 */
export function ul(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('ul', props, ...children);
}

/**
 * Ordered list
 */
export function ol(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('ol', props, ...children);
}

/**
 * List item
 */
export function li(props: VNodeProps, content: VNodeChild): VNode {
  return h('li', props, content);
}

/**
 * Horizontal rule
 */
export function hr(props: VNodeProps = {}): VNode {
  return h('hr', props);
}

/**
 * Line break
 */
export function br(props: VNodeProps = {}): VNode {
  return h('br', props);
}
