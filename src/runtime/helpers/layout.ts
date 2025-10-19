/**
 * ZenWeb Layout Helpers
 * Layout and positioning components
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';

/**
 * Vertical box layout (flex column)
 */
export function vbox(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Horizontal box layout (flex row)
 */
export function hbox(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Grid layout container
 */
export function grid(
  props: DOMProps & { columns?: number; gap?: string },
  ...children: DOMChildren[]
): HTMLElement {
  const { columns = 1, gap = '1rem', ...restProps } = props;
  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    ...(typeof restProps.style === 'object' ? restProps.style : {})
  };
  return createElement('div', { ...restProps, style }, ...children);
}

/**
 * Plain container (div without flex)
 */
export function container(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('div', props, ...children);
}

/**
 * Stack layout with z-index management
 */
export function stack(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    position: 'relative',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Center content (both axes)
 */
export function center(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Flexible spacer
 */
export function spacer(props: DOMProps = {}): HTMLElement {
  const style = {
    flex: '1',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style });
}

/**
 * Flex wrap container
 */
export function wrap(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    display: 'flex',
    flexWrap: 'wrap',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Scrollable container
 */
export function scroll(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    overflow: 'auto',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Sticky positioned container
 */
export function sticky(props: DOMProps & { top?: string }, ...children: DOMChildren[]): HTMLElement {
  const { top = '0', ...restProps } = props;
  const style = {
    position: 'sticky',
    top,
    ...(typeof restProps.style === 'object' ? restProps.style : {})
  };
  return createElement('div', { ...restProps, style }, ...children);
}

/**
 * Fixed positioned container
 */
export function fixed(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    position: 'fixed',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Absolute positioned container
 */
export function absolute(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    position: 'absolute',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Relative positioned container
 */
export function relative(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    position: 'relative',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}
