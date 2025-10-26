/**
 * Rynex Typography Helpers
 * Text and typography elements with Rust-style Builder API
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';
import { ElementBuilder } from './builder.js';

/**
 * Heading elements - Builder API
 */
export function h1(): ElementBuilder<HTMLHeadingElement> {
  return new ElementBuilder<HTMLHeadingElement>('h1');
}

export function h2(): ElementBuilder<HTMLHeadingElement> {
  return new ElementBuilder<HTMLHeadingElement>('h2');
}

export function h3(): ElementBuilder<HTMLHeadingElement> {
  return new ElementBuilder<HTMLHeadingElement>('h3');
}

export function h4(): ElementBuilder<HTMLHeadingElement> {
  return new ElementBuilder<HTMLHeadingElement>('h4');
}

export function h5(): ElementBuilder<HTMLHeadingElement> {
  return new ElementBuilder<HTMLHeadingElement>('h5');
}

export function h6(): ElementBuilder<HTMLHeadingElement> {
  return new ElementBuilder<HTMLHeadingElement>('h6');
}

// Legacy support
export function h1Legacy(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h1', props, ...content) as HTMLHeadingElement;
}

export function h2Legacy(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h2', props, ...content) as HTMLHeadingElement;
}

export function h3Legacy(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h3', props, ...content) as HTMLHeadingElement;
}

export function h4Legacy(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h4', props, ...content) as HTMLHeadingElement;
}

export function h5Legacy(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h5', props, ...content) as HTMLHeadingElement;
}

export function h6Legacy(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h6', props, ...content) as HTMLHeadingElement;
}

/**
 * Bold text - Builder API
 */
export function strong(): ElementBuilder {
  return new ElementBuilder('strong');
}

/**
 * Italic text - Builder API
 */
export function em(): ElementBuilder {
  return new ElementBuilder('em');
}

/**
 * Inline code - Builder API
 */
export function code(): ElementBuilder {
  return new ElementBuilder('code');
}

/**
 * Preformatted text - Builder API
 */
export function pre(): ElementBuilder<HTMLPreElement> {
  return new ElementBuilder<HTMLPreElement>('pre');
}

/**
 * Blockquote - Builder API
 */
export function blockquote(): ElementBuilder<HTMLQuoteElement> {
  return new ElementBuilder<HTMLQuoteElement>('blockquote');
}

/**
 * Highlighted text - Builder API
 */
export function mark(): ElementBuilder {
  return new ElementBuilder('mark');
}

/**
 * Small text - Builder API
 */
export function small(): ElementBuilder {
  return new ElementBuilder('small');
}

/**
 * Deleted text - Builder API
 */
export function del(): ElementBuilder<HTMLModElement> {
  return new ElementBuilder<HTMLModElement>('del');
}

/**
 * Inserted text - Builder API
 */
export function ins(): ElementBuilder<HTMLModElement> {
  return new ElementBuilder<HTMLModElement>('ins');
}

/**
 * Subscript - Builder API
 */
export function sub(): ElementBuilder {
  return new ElementBuilder('sub');
}

/**
 * Superscript - Builder API
 */
export function sup(): ElementBuilder {
  return new ElementBuilder('sup');
}

/**
 * Abbreviation - Builder API
 */
export class AbbrBuilder extends ElementBuilder {
  constructor() {
    super('abbr');
  }

  title(value: string): this {
    this.element.title = value;
    return this;
  }
}

export function abbr(): AbbrBuilder {
  return new AbbrBuilder();
}

/**
 * Citation - Builder API
 */
export function cite(): ElementBuilder {
  return new ElementBuilder('cite');
}

/**
 * Keyboard input - Builder API
 */
export function kbd(): ElementBuilder {
  return new ElementBuilder('kbd');
}

/**
 * Sample output - Builder API
 */
export function samp(): ElementBuilder {
  return new ElementBuilder('samp');
}

/**
 * Variable - Builder API
 */
export function varElement(): ElementBuilder {
  return new ElementBuilder('var');
}

// Legacy support
export function strongLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('strong', props, ...content);
}

export function emLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('em', props, ...content);
}

export function codeLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('code', props, ...content);
}

export function preLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLPreElement {
  return createElement('pre', props, ...content) as HTMLPreElement;
}

export function blockquoteLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLQuoteElement {
  return createElement('blockquote', props, ...children) as HTMLQuoteElement;
}

export function markLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('mark', props, ...content);
}

export function smallLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('small', props, ...content);
}

export function delLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLModElement {
  return createElement('del', props, ...content) as HTMLModElement;
}

export function insLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLModElement {
  return createElement('ins', props, ...content) as HTMLModElement;
}

export function subLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('sub', props, ...content);
}

export function supLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('sup', props, ...content);
}

export function abbrLegacy(props: DOMProps & { title: string }, ...content: DOMChildren[]): HTMLElement {
  return createElement('abbr', props, ...content);
}

export function citeLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('cite', props, ...content);
}

export function kbdLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('kbd', props, ...content);
}

export function sampLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('samp', props, ...content);
}

export function varElementLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('var', props, ...content);
}
