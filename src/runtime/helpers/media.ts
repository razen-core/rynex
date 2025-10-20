/**
 * Rynex Media Elements
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
 * SVG container - creates proper SVG element with namespace
 */
export function svg(props: DOMProps & { viewBox?: string; width?: string | number; height?: string | number }, innerHTML?: string): SVGSVGElement {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  
  // Apply props
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined) continue;
      
      if (key === 'style' && typeof value === 'object') {
        Object.assign(svgElement.style, value);
      } else if (key === 'class' || key === 'className') {
        svgElement.setAttribute('class', value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        svgElement.addEventListener(eventName, value as EventListener);
      } else {
        svgElement.setAttribute(key, String(value));
      }
    }
  }
  
  // Set innerHTML if provided (for SVG paths)
  if (innerHTML) {
    svgElement.innerHTML = innerHTML;
  }
  
  return svgElement;
}

/**
 * Create SVG path element
 */
export function svgPath(d: string, props?: DOMProps): SVGPathElement {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value !== null && value !== undefined) {
        path.setAttribute(key, String(value));
      }
    }
  }
  
  return path;
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
