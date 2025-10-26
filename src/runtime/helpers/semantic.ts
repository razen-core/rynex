/**
 * Rynex Semantic Elements
 * Semantic HTML5 elements with Rust-style Builder API
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';
import { ElementBuilder } from './builder.js';

/**
 * Header section - Builder API
 */
export function header(): ElementBuilder {
  return new ElementBuilder('header');
}

/**
 * Footer section - Builder API
 */
export function footer(): ElementBuilder {
  return new ElementBuilder('footer');
}

/**
 * Navigation - Builder API
 */
export function nav(): ElementBuilder {
  return new ElementBuilder('nav');
}

/**
 * Main content - Builder API
 */
export function main(): ElementBuilder {
  return new ElementBuilder('main');
}

/**
 * Section - Builder API
 */
export function section(): ElementBuilder {
  return new ElementBuilder('section');
}

/**
 * Article - Builder API
 */
export function article(): ElementBuilder {
  return new ElementBuilder('article');
}

/**
 * Aside/Sidebar - Builder API
 */
export function aside(): ElementBuilder {
  return new ElementBuilder('aside');
}

/**
 * Figure with caption - Builder API
 */
export function figure(): ElementBuilder {
  return new ElementBuilder('figure');
}

/**
 * Figure caption - Builder API
 */
export function figcaption(): ElementBuilder {
  return new ElementBuilder('figcaption');
}

/**
 * Time element - Builder API
 */
export class TimeBuilder extends ElementBuilder<HTMLTimeElement> {
  constructor() {
    super('time');
  }

  datetime(value: string): this {
    this.element.dateTime = value;
    return this;
  }
}

export function time(): TimeBuilder {
  return new TimeBuilder();
}

/**
 * Address element - Builder API
 */
export function address(): ElementBuilder {
  return new ElementBuilder('address');
}

/**
 * Details disclosure - Builder API
 */
export class DetailsBuilder extends ElementBuilder<HTMLDetailsElement> {
  constructor() {
    super('details');
  }

  open(value: boolean = true): this {
    this.element.open = value;
    return this;
  }
}

export function details(): DetailsBuilder {
  return new DetailsBuilder();
}

/**
 * Details summary - Builder API
 */
export function summary(): ElementBuilder {
  return new ElementBuilder('summary');
}

/**
 * Dialog element - Builder API
 */
export class DialogBuilder extends ElementBuilder<HTMLDialogElement> {
  constructor() {
    super('dialog');
  }

  open(value: boolean = true): this {
    this.element.open = value;
    return this;
  }

  showModal(): this {
    this.element.showModal();
    return this;
  }

  close(): this {
    this.element.close();
    return this;
  }
}

export function dialog(): DialogBuilder {
  return new DialogBuilder();
}

// Legacy support
export function headerLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('header', props, ...children);
}

export function footerLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('footer', props, ...children);
}

export function navLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('nav', props, ...children);
}

export function mainLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('main', props, ...children);
}

export function sectionLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('section', props, ...children);
}

export function articleLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('article', props, ...children);
}

export function asideLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('aside', props, ...children);
}

export function figureLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('figure', props, ...children);
}

export function figcaptionLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('figcaption', props, ...content);
}

export function timeLegacy(props: DOMProps & { datetime?: string }, ...content: DOMChildren[]): HTMLTimeElement {
  return createElement('time', props, ...content) as HTMLTimeElement;
}

export function addressLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('address', props, ...children);
}

export function detailsLegacy(props: DOMProps & { open?: boolean }, ...children: DOMChildren[]): HTMLDetailsElement {
  return createElement('details', props, ...children) as HTMLDetailsElement;
}

export function summaryLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('summary', props, ...content);
}

export function dialogLegacy(props: DOMProps & { open?: boolean }, ...children: DOMChildren[]): HTMLDialogElement {
  return createElement('dialog', props, ...children) as HTMLDialogElement;
}
