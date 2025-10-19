/**
 * ZenWeb Form Helpers
 * Form elements and inputs
 */

import { h } from '../vdom.js';
import type { VNode, VNodeProps, VNodeChild } from '../types.js';

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

/**
 * Checkbox input
 */
export function checkbox(props: VNodeProps & { checked?: boolean }): VNode {
  return h('input', { ...props, type: 'checkbox' });
}

/**
 * Radio input
 */
export function radio(props: VNodeProps & { checked?: boolean; name?: string }): VNode {
  return h('input', { ...props, type: 'radio' });
}

/**
 * Fieldset element
 */
export function fieldset(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('fieldset', props, ...children);
}

/**
 * Legend element
 */
export function legend(props: VNodeProps, content: VNodeChild): VNode {
  return h('legend', props, content);
}

/**
 * Datalist element
 */
export function datalist(props: VNodeProps & { id: string }, children: VNodeChild[]): VNode {
  return h('datalist', props, ...children);
}

/**
 * Meter element
 */
export function meter(props: VNodeProps & { value: number; min?: number; max?: number }): VNode {
  return h('meter', props);
}

/**
 * Progress element
 */
export function progress(props: VNodeProps & { value?: number; max?: number }): VNode {
  return h('progress', props);
}

/**
 * Output element
 */
export function output(props: VNodeProps & { htmlFor?: string }, content: VNodeChild): VNode {
  return h('output', props, content);
}
