/**
 * Rynex Builder API
 * Rust-style Builder pattern for creating UI components with chainable methods
 */

import {
  createElement,
  DOMChildren,
  applyProps,
  appendChildren,
} from "../dom.js";
import { effect } from "../state.js";

/**
 * Responsive breakpoint configuration
 */
export interface ResponsiveConfig {
  pad?: number | string;
  gap?: number | string;
  size?: number | string;
  width?: string;
  height?: string;
  display?: string;
  [key: string]: any;
}

/**
 * Base Builder class for all UI components
 * Provides chainable methods for styling and configuration
 */
export class ElementBuilder<T extends HTMLElement = HTMLElement> {
  protected element: T;
  protected children: DOMChildren[] = [];
  protected mobileConfig?: ResponsiveConfig;
  protected tabletConfig?: ResponsiveConfig;
  protected desktopConfig?: ResponsiveConfig;

  constructor(tag: string) {
    this.element = document.createElement(tag) as T;
  }

  /**
   * Add children to the element
   */
  add(children: DOMChildren | DOMChildren[]): this {
    const childArray = Array.isArray(children) ? children : [children];
    this.children.push(...childArray);
    return this;
  }

  /**
   * Set padding (in rem units)
   */
  pad(value: number | string): this {
    const padding = typeof value === "number" ? `${value}rem` : value;
    this.element.style.padding = padding;
    return this;
  }

  /**
   * Set padding for specific sides
   */
  padX(value: number | string): this {
    const padding = typeof value === "number" ? `${value}rem` : value;
    this.element.style.paddingLeft = padding;
    this.element.style.paddingRight = padding;
    return this;
  }

  padY(value: number | string): this {
    const padding = typeof value === "number" ? `${value}rem` : value;
    this.element.style.paddingTop = padding;
    this.element.style.paddingBottom = padding;
    return this;
  }

  /**
   * Set margin (in rem units)
   */
  margin(value: number | string): this {
    const margin = typeof value === "number" ? `${value}rem` : value;
    this.element.style.margin = margin;
    return this;
  }

  marginX(value: number | string): this {
    const margin = typeof value === "number" ? `${value}rem` : value;
    this.element.style.marginLeft = margin;
    this.element.style.marginRight = margin;
    return this;
  }

  marginY(value: number | string): this {
    const margin = typeof value === "number" ? `${value}rem` : value;
    this.element.style.marginTop = margin;
    this.element.style.marginBottom = margin;
    return this;
  }

  /**
   * Set gap between children (for flex/grid)
   */
  gap(value: number | string): this {
    const gap = typeof value === "number" ? `${value}rem` : value;
    this.element.style.gap = gap;
    return this;
  }

  /**
   * Set background color
   */
  bg(color: string): this {
    this.element.style.backgroundColor = color;
    return this;
  }

  /**
   * Set text color
   */
  color(color: string): this {
    this.element.style.color = color;
    return this;
  }

  /**
   * Set border radius (in rem units)
   */
  radius(value: number | string): this {
    const radius = typeof value === "number" ? `${value}rem` : value;
    this.element.style.borderRadius = radius;
    return this;
  }

  /**
   * Set border
   */
  border(
    width: number | string,
    style: string = "solid",
    color?: string,
  ): this {
    const borderWidth = typeof width === "number" ? `${width}px` : width;
    this.element.style.borderWidth = borderWidth;
    this.element.style.borderStyle = style;
    if (color) {
      this.element.style.borderColor = color;
    }
    return this;
  }

  /**
   * Set box shadow
   */
  shadow(size: "sm" | "md" | "lg" | "xl" | string): this {
    const shadows = {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    };
    this.element.style.boxShadow =
      shadows[size as keyof typeof shadows] || size;
    return this;
  }

  /**
   * Set width
   */
  width(value: number | string): this {
    const width = typeof value === "number" ? `${value}px` : value;
    this.element.style.width = width;
    return this;
  }

  /**
   * Set height
   */
  height(value: number | string): this {
    const h = typeof value === "number" ? `${value}px` : value;
    this.element.style.height = h;
    return this;
  }

  /**
   * Set max width
   */
  maxWidth(value: number | string): this {
    const maxWidth = typeof value === "number" ? `${value}px` : value;
    this.element.style.maxWidth = maxWidth;
    return this;
  }

  /**
   * Set max height
   */
  maxHeight(value: number | string): this {
    const maxHeight = typeof value === "number" ? `${value}px` : value;
    this.element.style.maxHeight = maxHeight;
    return this;
  }

  /**
   * Set min width
   */
  minWidth(value: number | string): this {
    const minWidth = typeof value === "number" ? `${value}px` : value;
    this.element.style.minWidth = minWidth;
    return this;
  }

  /**
   * Set min height
   */
  minHeight(value: number | string): this {
    const minHeight = typeof value === "number" ? `${value}px` : value;
    this.element.style.minHeight = minHeight;
    return this;
  }

  /**
   * Set opacity
   */
  opacity(value: number): this {
    this.element.style.opacity = String(value);
    return this;
  }

  /**
   * Set cursor style
   */
  cursor(value: string): this {
    this.element.style.cursor = value;
    return this;
  }

  /**
   * Set overflow
   */
  overflow(value: string): this {
    this.element.style.overflow = value;
    return this;
  }

  /**
   * Set position
   */
  position(
    value: "static" | "relative" | "absolute" | "fixed" | "sticky",
  ): this {
    this.element.style.position = value;
    return this;
  }

  /**
   * Set z-index
   */
  zIndex(value: number): this {
    this.element.style.zIndex = String(value);
    return this;
  }

  /**
   * Set display
   */
  display(value: string): this {
    this.element.style.display = value;
    return this;
  }

  /**
   * Set flex properties
   */
  flex(value: number | string): this {
    this.element.style.flex = typeof value === "number" ? String(value) : value;
    return this;
  }

  /**
   * Set align items
   */
  align(value: string): this {
    this.element.style.alignItems = value;
    return this;
  }

  /**
   * Set justify content
   */
  justify(value: string): this {
    this.element.style.justifyContent = value;
    return this;
  }

  /**
   * Set CSS class
   */
  class(className: string): this {
    this.element.className = className;
    return this;
  }

  /**
   * Add CSS class
   */
  addClass(className: string): this {
    this.element.classList.add(className);
    return this;
  }

  /**
   * Set ID
   */
  id(id: string): this {
    this.element.id = id;
    return this;
  }

  /**
   * Set custom style property
   */
  style(property: string, value: string): this {
    (this.element.style as any)[property] = value;
    return this;
  }

  /**
   * Set multiple styles at once
   */
  styles(styles: Partial<CSSStyleDeclaration>): this {
    Object.assign(this.element.style, styles);
    return this;
  }

  /**
   * Set attribute
   */
  attr(name: string, value: string): this {
    this.element.setAttribute(name, value);
    return this;
  }

  /**
   * Set data attribute
   */
  data(key: string, value: string): this {
    this.element.setAttribute(`data-${key}`, value);
    return this;
  }

  /**
   * Add event listener
   */
  on<K extends keyof HTMLElementEventMap>(
    event: K,
    handler: (event: HTMLElementEventMap[K]) => void,
  ): this {
    this.element.addEventListener(event, handler as EventListener);
    return this;
  }

  /**
   * Add click event listener
   */
  click(handler: (event: MouseEvent) => void): this {
    this.element.addEventListener("click", handler);
    return this;
  }

  /**
   * Add hover event listeners
   */
  hover(
    onEnter: (event: MouseEvent) => void,
    onLeave?: (event: MouseEvent) => void,
  ): this {
    this.element.addEventListener("mouseenter", onEnter);
    if (onLeave) {
      this.element.addEventListener("mouseleave", onLeave);
    }
    return this;
  }

  /**
   * Set hover styles
   */
  hoverStyle(styles: Partial<CSSStyleDeclaration>): this {
    const originalStyles: Partial<CSSStyleDeclaration> = {};

    this.element.addEventListener("mouseenter", () => {
      Object.keys(styles).forEach((key) => {
        originalStyles[key as any] = (this.element.style as any)[key];
        (this.element.style as any)[key] = (styles as any)[key];
      });
    });

    this.element.addEventListener("mouseleave", () => {
      Object.keys(originalStyles).forEach((key) => {
        (this.element.style as any)[key] = (originalStyles as any)[key];
      });
    });

    return this;
  }

  /**
   * Set ref
   */
  ref(ref: { current: T | null }): this {
    ref.current = this.element;
    return this;
  }

  /**
   * Mobile responsive configuration (< 768px)
   */
  mobile(config: ResponsiveConfig): this {
    this.mobileConfig = config;
    this.applyResponsive();
    return this;
  }

  /**
   * Tablet responsive configuration (768px - 1024px)
   */
  tablet(config: ResponsiveConfig): this {
    this.tabletConfig = config;
    this.applyResponsive();
    return this;
  }

  /**
   * Desktop responsive configuration (> 1024px)
   */
  desktop(config: ResponsiveConfig): this {
    this.desktopConfig = config;
    this.applyResponsive();
    return this;
  }

  /**
   * Apply responsive styles based on screen size
   */
  protected applyResponsive(): void {
    const applyConfig = () => {
      const width = window.innerWidth;
      let config: ResponsiveConfig | undefined;

      if (width < 768 && this.mobileConfig) {
        config = this.mobileConfig;
      } else if (width >= 768 && width < 1024 && this.tabletConfig) {
        config = this.tabletConfig;
      } else if (width >= 1024 && this.desktopConfig) {
        config = this.desktopConfig;
      }

      if (config) {
        Object.entries(config).forEach(([key, value]) => {
          if (key === "pad") {
            const padding = typeof value === "number" ? `${value}rem` : value;
            this.element.style.padding = padding;
          } else if (key === "gap") {
            const gap = typeof value === "number" ? `${value}rem` : value;
            this.element.style.gap = gap;
          } else if (key === "size") {
            const size = typeof value === "number" ? `${value}rem` : value;
            this.element.style.fontSize = size;
          } else {
            (this.element.style as any)[key] = value;
          }
        });
      }
    };

    applyConfig();
    window.addEventListener("resize", applyConfig);
  }

  /**
   * Build and return the final element
   */
  build(): T {
    if (this.children.length > 0) {
      appendChildren(this.element, this.children);
    }
    return this.element;
  }
}

/**
 * Text Builder with reactive content support
 */
export class TextBuilder extends ElementBuilder<HTMLSpanElement> {
  private content?: string | (() => string);

  constructor(content?: string | (() => string)) {
    super("span");
    this.content = content;
  }

  /**
   * Set font size (in rem units)
   */
  size(value: number | string): this {
    const size = typeof value === "number" ? `${value}rem` : value;
    this.element.style.fontSize = size;
    return this;
  }

  /**
   * Set font weight
   */
  weight(value: number | string): this {
    this.element.style.fontWeight = String(value);
    return this;
  }

  /**
   * Set text alignment
   */
  textAlign(value: string): this {
    this.element.style.textAlign = value;
    return this;
  }

  /**
   * Set line height
   */
  lineHeight(value: number | string): this {
    this.element.style.lineHeight =
      typeof value === "number" ? String(value) : value;
    return this;
  }

  /**
   * Set letter spacing
   */
  letterSpacing(value: string): this {
    this.element.style.letterSpacing = value;
    return this;
  }

  /**
   * Set text transform
   */
  transform(value: "none" | "uppercase" | "lowercase" | "capitalize"): this {
    this.element.style.textTransform = value;
    return this;
  }

  /**
   * Set text decoration
   */
  decoration(value: string): this {
    this.element.style.textDecoration = value;
    return this;
  }

  build(): HTMLSpanElement {
    if (this.content) {
      if (typeof this.content === "function") {
        // Reactive content
        const contentFn = this.content;
        effect(() => {
          this.element.textContent = contentFn();
        });
      } else {
        // Static content
        this.element.textContent = this.content;
      }
    }
    return super.build();
  }
}

/**
 * Button Builder
 */
export class ButtonBuilder extends ElementBuilder<HTMLButtonElement> {
  private content?: string | (() => string);

  constructor(content?: string | (() => string)) {
    super("button");
    this.content = content;
  }

  /**
   * Set font size (in rem units)
   */
  size(value: number | string): this {
    const size = typeof value === "number" ? `${value}rem` : value;
    this.element.style.fontSize = size;
    return this;
  }

  /**
   * Set font weight
   */
  weight(value: number | string): this {
    this.element.style.fontWeight = String(value);
    return this;
  }

  /**
   * Set button type
   */
  type(value: "button" | "submit" | "reset"): this {
    this.element.type = value;
    return this;
  }

  /**
   * Set disabled state
   */
  disabled(value: boolean = true): this {
    this.element.disabled = value;
    return this;
  }

  build(): HTMLButtonElement {
    if (this.content) {
      if (typeof this.content === "function") {
        // Reactive content
        const contentFn = this.content;
        effect(() => {
          this.element.textContent = contentFn();
        });
      } else {
        // Static content
        this.element.textContent = this.content;
      }
    }
    return super.build();
  }
}

/**
 * Input Builder
 */
export class InputBuilder extends ElementBuilder<HTMLInputElement> {
  constructor() {
    super("input");
  }

  /**
   * Set input type
   */
  type(value: string): this {
    this.element.type = value;
    return this;
  }

  /**
   * Set placeholder
   */
  placeholder(value: string): this {
    this.element.placeholder = value;
    return this;
  }

  /**
   * Set value
   */
  value(value: string): this {
    this.element.value = value;
    return this;
  }

  /**
   * Set name
   */
  name(value: string): this {
    this.element.name = value;
    return this;
  }

  /**
   * Set required
   */
  required(value: boolean = true): this {
    this.element.required = value;
    return this;
  }

  /**
   * Set disabled
   */
  disabled(value: boolean = true): this {
    this.element.disabled = value;
    return this;
  }

  /**
   * Add input event listener
   */
  input(handler: (event: Event) => void): this {
    this.element.addEventListener("input", handler);
    return this;
  }

  /**
   * Add change event listener
   */
  change(handler: (event: Event) => void): this {
    this.element.addEventListener("change", handler);
    return this;
  }
}

/**
 * Image Builder
 */
export class ImageBuilder extends ElementBuilder<HTMLImageElement> {
  constructor(src?: string) {
    super("img");
    if (src) {
      this.element.src = src;
    }
  }

  /**
   * Set image source
   */
  src(value: string): this {
    this.element.src = value;
    return this;
  }

  /**
   * Set alt text
   */
  alt(value: string): this {
    this.element.alt = value;
    return this;
  }

  /**
   * Enable lazy loading
   */
  lazy(): this {
    this.element.loading = "lazy";
    return this;
  }

  /**
   * Set object fit
   */
  fit(value: "contain" | "cover" | "fill" | "none" | "scale-down"): this {
    this.element.style.objectFit = value;
    return this;
  }
}
