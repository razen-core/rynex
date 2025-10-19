/**
 * ZenWeb Media Elements
 * Media and embedded content elements
 */

import { h } from '../vdom.js';
import type { VNode, VNodeProps, VNodeChild } from '../types.js';

/**
 * Video player
 */
export function video(props: VNodeProps & { src?: string; controls?: boolean }, children?: VNodeChild[]): VNode {
  return h('video', props, ...(children || []));
}

/**
 * Audio player
 */
export function audio(props: VNodeProps & { src?: string; controls?: boolean }, children?: VNodeChild[]): VNode {
  return h('audio', props, ...(children || []));
}

/**
 * Canvas element
 */
export function canvas(props: VNodeProps & { width?: number; height?: number }): VNode {
  return h('canvas', props);
}

/**
 * SVG container
 */
export function svg(props: VNodeProps & { viewBox?: string }, children: VNodeChild[]): VNode {
  return h('svg', props, ...children);
}

/**
 * Iframe element
 */
export function iframe(props: VNodeProps & { src: string }): VNode {
  return h('iframe', props);
}

/**
 * Picture element
 */
export function picture(props: VNodeProps, children: VNodeChild[]): VNode {
  return h('picture', props, ...children);
}

/**
 * Media source
 */
export function source(props: VNodeProps & { src: string; type?: string }): VNode {
  return h('source', props);
}

/**
 * Media track
 */
export function track(props: VNodeProps & { src: string; kind?: string; srclang?: string }): VNode {
  return h('track', props);
}
