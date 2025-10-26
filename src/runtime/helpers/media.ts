/**
 * Rynex Media Elements
 * Media and embedded content elements with Rust-style Builder API
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';
import { ElementBuilder } from './builder.js';

/**
 * Video player - Builder API
 */
export class VideoBuilder extends ElementBuilder<HTMLVideoElement> {
  constructor() {
    super('video');
  }

  src(value: string): this {
    this.element.src = value;
    return this;
  }

  controls(value: boolean = true): this {
    this.element.controls = value;
    return this;
  }

  autoplay(value: boolean = true): this {
    this.element.autoplay = value;
    return this;
  }

  loop(value: boolean = true): this {
    this.element.loop = value;
    return this;
  }

  muted(value: boolean = true): this {
    this.element.muted = value;
    return this;
  }

  poster(value: string): this {
    this.element.poster = value;
    return this;
  }
}

export function video(): VideoBuilder {
  return new VideoBuilder();
}

/**
 * Audio player - Builder API
 */
export class AudioBuilder extends ElementBuilder<HTMLAudioElement> {
  constructor() {
    super('audio');
  }

  src(value: string): this {
    this.element.src = value;
    return this;
  }

  controls(value: boolean = true): this {
    this.element.controls = value;
    return this;
  }

  autoplay(value: boolean = true): this {
    this.element.autoplay = value;
    return this;
  }

  loop(value: boolean = true): this {
    this.element.loop = value;
    return this;
  }

  muted(value: boolean = true): this {
    this.element.muted = value;
    return this;
  }
}

export function audio(): AudioBuilder {
  return new AudioBuilder();
}

/**
 * Canvas element - Builder API
 */
export class CanvasBuilder extends ElementBuilder<HTMLCanvasElement> {
  constructor() {
    super('canvas');
  }

  getContext(contextId: '2d' | 'webgl' | 'webgl2'): CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext | null {
    return this.element.getContext(contextId) as any;
  }
}

export function canvas(): CanvasBuilder {
  return new CanvasBuilder();
}

// Legacy support
export function videoLegacy(props: DOMProps & { src?: string; controls?: boolean }, ...children: DOMChildren[]): HTMLVideoElement {
  return createElement('video', props, ...children) as HTMLVideoElement;
}

export function audioLegacy(props: DOMProps & { src?: string; controls?: boolean }, ...children: DOMChildren[]): HTMLAudioElement {
  return createElement('audio', props, ...children) as HTMLAudioElement;
}

export function canvasLegacy(props: DOMProps & { width?: number; height?: number }): HTMLCanvasElement {
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
 * Iframe element - Builder API
 */
export class IframeBuilder extends ElementBuilder<HTMLIFrameElement> {
  constructor() {
    super('iframe');
  }

  src(value: string): this {
    this.element.src = value;
    return this;
  }

  sandbox(value: string): this {
    this.element.sandbox.value = value;
    return this;
  }

  allow(value: string): this {
    this.element.allow = value;
    return this;
  }
}

export function iframe(): IframeBuilder {
  return new IframeBuilder();
}

/**
 * Picture element - Builder API
 */
export function picture(): ElementBuilder<HTMLPictureElement> {
  return new ElementBuilder<HTMLPictureElement>('picture');
}

/**
 * Media source - Builder API
 */
export class SourceBuilder extends ElementBuilder<HTMLSourceElement> {
  constructor() {
    super('source');
  }

  src(value: string): this {
    this.element.src = value;
    return this;
  }

  type(value: string): this {
    this.element.type = value;
    return this;
  }

  media(value: string): this {
    this.element.media = value;
    return this;
  }
}

export function source(): SourceBuilder {
  return new SourceBuilder();
}

/**
 * Media track - Builder API
 */
export class TrackBuilder extends ElementBuilder<HTMLTrackElement> {
  constructor() {
    super('track');
  }

  src(value: string): this {
    this.element.src = value;
    return this;
  }

  kind(value: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata'): this {
    this.element.kind = value;
    return this;
  }

  srclang(value: string): this {
    this.element.srclang = value;
    return this;
  }

  label(value: string): this {
    this.element.label = value;
    return this;
  }
}

export function track(): TrackBuilder {
  return new TrackBuilder();
}

// Legacy support
export function iframeLegacy(props: DOMProps & { src: string }): HTMLIFrameElement {
  return createElement('iframe', props) as HTMLIFrameElement;
}

export function pictureLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLPictureElement {
  return createElement('picture', props, ...children) as HTMLPictureElement;
}

export function sourceLegacy(props: DOMProps & { src: string; type?: string }): HTMLSourceElement {
  return createElement('source', props) as HTMLSourceElement;
}

export function trackLegacy(props: DOMProps & { src: string; kind?: string; srclang?: string }): HTMLTrackElement {
  return createElement('track', props) as HTMLTrackElement;
}
