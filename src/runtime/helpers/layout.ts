/**
 * ZenWeb Layout Helpers
 * Layout and positioning components
 */

import { h } from '../vdom.js';
import type { VNode, VNodeProps, VNodeChild } from '../types.js';

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
 * Plain container (div without flex)
 */
export function container(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('div', props, ...children);
}

/**
 * Stack layout with z-index management
 */
export function stack(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    position: 'relative',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return h('div', { ...props, style }, ...children);
}

/**
 * Center content (both axes)
 */
export function center(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return h('div', { ...props, style }, ...children);
}

/**
 * Flexible spacer
 */
export function spacer(props: VNodeProps = {}): VNode {
  const style = {
    flex: '1',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return h('div', { ...props, style });
}

/**
 * Flex wrap container
 */
export function wrap(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    display: 'flex',
    flexWrap: 'wrap',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return h('div', { ...props, style }, ...children);
}

/**
 * Scrollable container
 */
export function scroll(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    overflow: 'auto',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return h('div', { ...props, style }, ...children);
}

/**
 * Sticky positioned container
 */
export function sticky(props: VNodeProps & { top?: string }, children: VNodeChild[]): VNode {
  const { top = '0', ...restProps } = props;
  const style = {
    position: 'sticky',
    top,
    ...(typeof restProps.style === 'object' ? restProps.style : {})
  };
  return h('div', { ...restProps, style }, ...children);
}

/**
 * Fixed positioned container
 */
export function fixed(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    position: 'fixed',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return h('div', { ...props, style }, ...children);
}

/**
 * Absolute positioned container
 */
export function absolute(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    position: 'absolute',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return h('div', { ...props, style }, ...children);
}

/**
 * Relative positioned container
 */
export function relative(props: VNodeProps, children: VNodeChild[]): VNode {
  const style = {
    position: 'relative',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return h('div', { ...props, style }, ...children);
}
