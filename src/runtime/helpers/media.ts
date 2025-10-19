/**
 * ZenWeb Media Elements
 * Media and embedded content elements
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';

/**
 * Video player
 */
export function video(props: DOMProps & { src?: string; controls?: boolean }, ...children: DOMChildren[]): HTMLVideoElement {
  return createElement('video', props, ...children) as HTMLVideoElement;
}

/**
 * Audio player
 */
export function audio(props: DOMProps & { src?: string; controls?: boolean }, ...children: DOMChildren[]): HTMLAudioElement {
  return createElement('audio', props, ...children) as HTMLAudioElement;
}

/**
 * Canvas element
 */
export function canvas(props: DOMProps & { width?: number; height?: number }): HTMLCanvasElement {
  return createElement('canvas', props) as HTMLCanvasElement;
}

/**
 * SVG container
 */
export function svg(props: DOMProps & { viewBox?: string }, ...children: DOMChildren[]): SVGSVGElement {
  return createElement('svg', props, ...children) as any as SVGSVGElement;
}

/**
 * Iframe element
 */
export function iframe(props: DOMProps & { src: string }): HTMLIFrameElement {
  return createElement('iframe', props) as HTMLIFrameElement;
}

/**
 * Picture element
 */
export function picture(props: DOMProps, ...children: DOMChildren[]): HTMLPictureElement {
  return createElement('picture', props, ...children) as HTMLPictureElement;
}

/**
 * Media source
 */
export function source(props: DOMProps & { src: string; type?: string }): HTMLSourceElement {
  return createElement('source', props) as HTMLSourceElement;
}

/**
 * Media track
 */
export function track(props: DOMProps & { src: string; kind?: string; srclang?: string }): HTMLTrackElement {
  return createElement('track', props) as HTMLTrackElement;
}
