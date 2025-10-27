/**
 * Rynex Basic Elements
 * Basic HTML elements and components with Rust-style Builder API
 */

import { createElement, DOMProps, DOMChildren } from "../dom.js";
import { effect } from "../state.js";
import {
  ElementBuilder,
  TextBuilder,
  ButtonBuilder,
  InputBuilder,
  ImageBuilder,
} from "./builder.js";

/**
 * Div element (generic container) - Builder API
 */
export function div(): ElementBuilder {
  return new ElementBuilder("div");
}

// Legacy support
export function divLegacy(
  props: DOMProps,
  ...children: DOMChildren[]
): HTMLElement {
  return createElement("div", props, ...children);
}

/**
 * Span element (inline container) - Builder API
 */
export function span(): ElementBuilder<HTMLSpanElement> {
  return new ElementBuilder<HTMLSpanElement>("span");
}

// Legacy support
export function spanLegacy(
  props: DOMProps,
  ...children: DOMChildren[]
): HTMLElement {
  return createElement("span", props, ...children);
}

/**
 * Text element with reactive getter support - Builder API
 * Usage: text('static').build() or text(() => `Count: ${state.count}`).build()
 */
export function text(content?: string | (() => string)): TextBuilder {
  return new TextBuilder(content);
}

// Legacy support
export function textLegacy(
  props: DOMProps | string | (() => string),
  content?: string | (() => string),
): HTMLElement {
  // Case 1: text('static string')
  if (typeof props === "string") {
    return createElement("span", {}, props);
  }

  // Case 2: text(() => reactive)
  if (typeof props === "function") {
    const el = createElement("span", {});
    effect(() => {
      el.textContent = props();
    });
    return el;
  }

  // Case 3: text({ props }, 'static') or text({ props }, () => reactive)
  const el = createElement("span", props);

  if (typeof content === "function") {
    // Reactive content
    effect(() => {
      el.textContent = content();
    });
  } else if (content) {
    // Static content
    el.textContent = content;
  }

  return el;
}

/**
 * Button element with reactive text support - Builder API
 * Usage: button('Click').click(() => ...).build()
 */
export function button(content?: string | (() => string)): ButtonBuilder {
  return new ButtonBuilder(content);
}

// Legacy support
export function buttonLegacy(
  props: DOMProps,
  content?: string | (() => string) | DOMChildren[],
): HTMLElement {
  const el = createElement("button", props);

  if (typeof content === "function") {
    // Reactive text content
    effect(() => {
      el.textContent = content();
    });
  } else if (typeof content === "string") {
    // Static text content
    el.textContent = content;
  } else if (content) {
    // Children elements
    const children = Array.isArray(content) ? content : [content];
    children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        el.appendChild(child);
      }
    });
  }

  return el;
}

/**
 * Input element - Builder API
 */
export function input(): InputBuilder {
  return new InputBuilder();
}

// Legacy support
export function inputLegacy(props: DOMProps): HTMLInputElement {
  return createElement("input", props) as HTMLInputElement;
}

/**
 * Image element - Builder API
 */
export function image(src?: string): ImageBuilder {
  return new ImageBuilder(src);
}

// Legacy support
export function imageLegacy(
  props: DOMProps & { src: string; alt?: string; lazy?: boolean },
): HTMLImageElement {
  const imgProps = { ...props };
  if (props.lazy) {
    imgProps.loading = "lazy";
    delete imgProps.lazy;
  }
  return createElement("img", imgProps) as HTMLImageElement;
}

/**
 * Link/anchor element - Builder API
 */
export class LinkBuilder extends ElementBuilder<HTMLAnchorElement> {
  constructor(href?: string) {
    super("a");
    if (href) {
      this.element.href = href;
    }
  }

  href(value: string): this {
    this.element.href = value;
    return this;
  }

  target(value: string): this {
    this.element.target = value;
    return this;
  }

  rel(value: string): this {
    this.element.rel = value;
    return this;
  }
}

export function link(href?: string): LinkBuilder {
  return new LinkBuilder(href);
}

// Legacy support
export function linkLegacy(
  props: DOMProps & { href: string },
  ...children: DOMChildren[]
): HTMLAnchorElement {
  return createElement("a", props, ...children) as HTMLAnchorElement;
}

/**
 * Label element - Builder API
 */
export class LabelBuilder extends ElementBuilder<HTMLLabelElement> {
  constructor() {
    super("label");
  }

  htmlFor(value: string): this {
    this.element.htmlFor = value;
    return this;
  }
}

export function label(): LabelBuilder {
  return new LabelBuilder();
}

// Legacy support
export function labelLegacy(
  props: DOMProps & { htmlFor?: string },
  ...content: DOMChildren[]
): HTMLLabelElement {
  return createElement("label", props, ...content) as HTMLLabelElement;
}

/**
 * Paragraph element - Builder API
 */
export function p(): ElementBuilder<HTMLParagraphElement> {
  return new ElementBuilder<HTMLParagraphElement>("p");
}

// Legacy support
export function pLegacy(
  props: DOMProps,
  ...content: DOMChildren[]
): HTMLParagraphElement {
  return createElement("p", props, ...content) as HTMLParagraphElement;
}

/**
 * List element with optimized rendering
 */
export function list<T>(
  props: DOMProps & {
    items: T[];
    renderItem: (item: T, index: number) => HTMLElement;
    keyExtractor?: (item: T, index: number) => string | number;
  },
): HTMLElement {
  const { items, renderItem, keyExtractor, ...restProps } = props;
  const children = items.map((item, index) => {
    const child = renderItem(item, index);
    if (keyExtractor) {
      child.dataset.key = String(keyExtractor(item, index));
    }
    return child;
  });
  return createElement("div", restProps, ...children);
}

/**
 * Unordered list - Builder API
 */
export function ul(): ElementBuilder<HTMLUListElement> {
  return new ElementBuilder<HTMLUListElement>("ul");
}

/**
 * Ordered list - Builder API
 */
export function ol(): ElementBuilder<HTMLOListElement> {
  return new ElementBuilder<HTMLOListElement>("ol");
}

/**
 * List item - Builder API
 */
export function li(): ElementBuilder<HTMLLIElement> {
  return new ElementBuilder<HTMLLIElement>("li");
}

// Legacy support
export function ulLegacy(
  props: DOMProps,
  ...children: DOMChildren[]
): HTMLUListElement {
  return createElement("ul", props, ...children) as HTMLUListElement;
}

export function olLegacy(
  props: DOMProps,
  ...children: DOMChildren[]
): HTMLOListElement {
  return createElement("ol", props, ...children) as HTMLOListElement;
}

export function liLegacy(
  props: DOMProps,
  ...content: DOMChildren[]
): HTMLLIElement {
  return createElement("li", props, ...content) as HTMLLIElement;
}

/**
 * Horizontal rule - Builder API
 */
export function hr(): ElementBuilder<HTMLHRElement> {
  return new ElementBuilder<HTMLHRElement>("hr");
}

/**
 * Line break - Builder API
 */
export function br(): ElementBuilder<HTMLBRElement> {
  return new ElementBuilder<HTMLBRElement>("br");
}

// Legacy support
export function hrLegacy(props: DOMProps = {}): HTMLHRElement {
  return createElement("hr", props) as HTMLHRElement;
}

export function brLegacy(props: DOMProps = {}): HTMLBRElement {
  return createElement("br", props) as HTMLBRElement;
}

/**
 * Description list - Builder API
 */
export function dl(): ElementBuilder<HTMLDListElement> {
  return new ElementBuilder<HTMLDListElement>("dl");
}

/**
 * Description term - Builder API
 */
export function dt(): ElementBuilder {
  return new ElementBuilder("dt");
}

/**
 * Description definition - Builder API
 */
export function dd(): ElementBuilder {
  return new ElementBuilder("dd");
}

// Legacy support
export function dlLegacy(
  props: DOMProps,
  ...children: DOMChildren[]
): HTMLDListElement {
  return createElement("dl", props, ...children) as HTMLDListElement;
}

export function dtLegacy(
  props: DOMProps,
  ...content: DOMChildren[]
): HTMLElement {
  return createElement("dt", props, ...content);
}

export function ddLegacy(
  props: DOMProps,
  ...content: DOMChildren[]
): HTMLElement {
  return createElement("dd", props, ...content);
}
