/**
 * ZenWeb Basic Elements
 * Basic HTML elements and components
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';

/**
 * Div element (generic container)
 */
export function div(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('div', props, ...children);
}

/**
 * Span element (inline container)
 */
export function span(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('span', props, ...children);
}

/**
 * Text element
 */
export function text(props: DOMProps | string, content?: string): HTMLElement {
  if (typeof props === 'string') {
    return createElement('span', {}, props);
  }
  return createElement('span', props, content || '');
}

/**
 * Button element
 */
export function button(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('button', props, ...content);
}

/**
 * Input element
 */
export function input(props: DOMProps): HTMLInputElement {
  return createElement('input', props) as HTMLInputElement;
}

/**
 * Image element
 */
export function image(props: DOMProps & { src: string; alt?: string; lazy?: boolean }): HTMLImageElement {
  const imgProps = { ...props };
  if (props.lazy) {
    imgProps.loading = 'lazy';
    delete imgProps.lazy;
  }
  return createElement('img', imgProps) as HTMLImageElement;
}

/**
 * Link/anchor element
 */
export function link(props: DOMProps & { href: string }, ...children: DOMChildren[]): HTMLAnchorElement {
  return createElement('a', props, ...children) as HTMLAnchorElement;
}

/**
 * Label element
 */
export function label(props: DOMProps & { htmlFor?: string }, ...content: DOMChildren[]): HTMLLabelElement {
  return createElement('label', props, ...content) as HTMLLabelElement;
}

/**
 * Paragraph element
 */
export function p(props: DOMProps, ...content: DOMChildren[]): HTMLParagraphElement {
  return createElement('p', props, ...content) as HTMLParagraphElement;
}

/**
 * List element with optimized rendering
 */
export function list<T>(
  props: DOMProps & {
    items: T[];
    renderItem: (item: T, index: number) => HTMLElement;
    keyExtractor?: (item: T, index: number) => string | number;
  }
): HTMLElement {
  const { items, renderItem, keyExtractor, ...restProps } = props;
  const children = items.map((item, index) => {
    const child = renderItem(item, index);
    if (keyExtractor) {
      child.dataset.key = String(keyExtractor(item, index));
    }
    return child;
  });
  return createElement('div', restProps, ...children);
}

/**
 * Unordered list
 */
export function ul(props: DOMProps, ...children: DOMChildren[]): HTMLUListElement {
  return createElement('ul', props, ...children) as HTMLUListElement;
}

/**
 * Ordered list
 */
export function ol(props: DOMProps, ...children: DOMChildren[]): HTMLOListElement {
  return createElement('ol', props, ...children) as HTMLOListElement;
}

/**
 * List item
 */
export function li(props: DOMProps, ...content: DOMChildren[]): HTMLLIElement {
  return createElement('li', props, ...content) as HTMLLIElement;
}

/**
 * Horizontal rule
 */
export function hr(props: DOMProps = {}): HTMLHRElement {
  return createElement('hr', props) as HTMLHRElement;
}

/**
 * Line break
 */
export function br(props: DOMProps = {}): HTMLBRElement {
  return createElement('br', props) as HTMLBRElement;
}

/**
 * Description list
 */
export function dl(props: DOMProps, ...children: DOMChildren[]): HTMLDListElement {
  return createElement('dl', props, ...children) as HTMLDListElement;
}

/**
 * Description term
 */
export function dt(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('dt', props, ...content);
}

/**
 * Description definition
 */
export function dd(props: DOMProps, ...content: DOMChildren[]): HTMLElement {
  return createElement('dd', props, ...content);
}
