/**
 * ZenWeb Typography Helpers
 * Text and typography elements
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';

/**
 * Heading elements
 */
export function h1(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h1', props, ...content) as HTMLHeadingElement;
}

export function h2(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h2', props, ...content) as HTMLHeadingElement;
}

export function h3(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h3', props, ...content) as HTMLHeadingElement;
}

export function h4(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h4', props, ...content) as HTMLHeadingElement;
}

export function h5(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h5', props, ...content) as HTMLHeadingElement;
}

export function h6(props: DOMProps, ...content: DOMChildren[]): HTMLHeadingElement {
  return createElement('h6', props, ...content) as HTMLHeadingElement;
}

/**
 * Bold text
 */
export function strong(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('strong', props, ...content);
}

/**
 * Italic text
 */
export function em(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('em', props, ...content);
}

/**
 * Inline code
 */
export function code(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('code', props, ...content);
}

/**
 * Preformatted text
 */
export function pre(props: DOMProps, ...content: DOMChildren[]): HTMLPreElement {
  return createElement('pre', props, ...content) as HTMLPreElement;
}

/**
 * Blockquote
 */
export function blockquote(props: DOMProps, ...children: DOMChildren[]): HTMLQuoteElement {
  return createElement('blockquote', props, ...children) as HTMLQuoteElement;
}

/**
 * Highlighted text
 */
export function mark(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('mark', props, ...content);
}

/**
 * Small text
 */
export function small(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('small', props, ...content);
}

/**
 * Deleted text
 */
export function del(props: DOMProps, ...content: DOMChildren[]): HTMLModElement {
  return createElement('del', props, ...content) as HTMLModElement;
}

/**
 * Inserted text
 */
export function ins(props: DOMProps, ...content: DOMChildren[]): HTMLModElement {
  return createElement('ins', props, ...content) as HTMLModElement;
}

/**
 * Subscript
 */
export function sub(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('sub', props, ...content);
}

/**
 * Superscript
 */
export function sup(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('sup', props, ...content);
}

/**
 * Abbreviation
 */
export function abbr(props: DOMProps & { title: string }, ...content: DOMChildren[]): HTMLElement {
  return createElement('abbr', props, ...content);
}

/**
 * Citation
 */
export function cite(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('cite', props, ...content);
}

/**
 * Keyboard input
 */
export function kbd(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('kbd', props, ...content);
}

/**
 * Sample output
 */
export function samp(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('samp', props, ...content);
}

/**
 * Variable
 */
export function varElement(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('var', props, ...content);
}
