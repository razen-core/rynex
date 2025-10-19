/**
 * ZenWeb Helper Functions
 * UI component helpers for building layouts
 */

import { h } from './vdom.js';
import type { VNode, VNodeProps, VNodeChild } from './types.js';

/**
 * Vertical box layout (flex column)
 */
export function vbox(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    ...(typeof props.style === 'object' ? props.style : {})
  };

  return h('div', { ...props, style }, ...children);
}

/**
 * Horizontal box layout (flex row)
 */
export function hbox(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    ...(typeof props.style === 'object' ? props.style : {})
  };

  return h('div', { ...props, style }, ...children);
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
 * Grid layout container
 */
export function grid(
  props: VNodeProps & { columns?: number; gap?: string },
  children: VNodeChild[]
): VNode {
  const { columns = 1, gap = '1rem', ...restProps } = props;
  
  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    ...(typeof restProps.style === 'object' ? restProps.style : {})
  };

  return h('div', { ...restProps, style }, ...children);
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
 * Paragraph element
 */
export function p(props: VNodeProps, content: VNodeChild): VNode {
  return h('p', props, content);
}

/**
 * Form element
 */
export function form(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('form', props, ...children);
}

/**
 * Textarea element
 */
export function textarea(props: VNodeProps, content?: string): VNode {
  return h('textarea', props, content || '');
}

/**
 * Select element
 */
export function select(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('select', props, ...children);
}

/**
 * Option element
 */
export function option(props: VNodeProps & { value: string }, content: VNodeChild): VNode {
  return h('option', props, content);
}
