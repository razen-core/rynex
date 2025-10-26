/**
 * Rynex Layout Helpers
 * Layout and positioning components with Rust-style Builder API
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';
import { ElementBuilder } from './builder.js';

/**
 * Vertical box layout (flex column) - Builder API
 */
export class VBoxBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'column';
  }
}

export function vbox(): VBoxBuilder {
  return new VBoxBuilder();
}

// Legacy support
export function vboxLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Horizontal box layout (flex row) - Builder API
 */
export class HBoxBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'row';
  }
}

export function hbox(): HBoxBuilder {
  return new HBoxBuilder();
}

// Legacy support
export function hboxLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Grid layout container - Builder API
 */
export class GridBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.display = 'grid';
  }

  /**
   * Set number of columns
   */
  columns(count: number): this {
    this.element.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
    return this;
  }

  /**
   * Set number of rows
   */
  rows(count: number): this {
    this.element.style.gridTemplateRows = `repeat(${count}, 1fr)`;
    return this;
  }

  /**
   * Set grid template areas
   */
  areas(template: string): this {
    this.element.style.gridTemplateAreas = template;
    return this;
  }

  /**
   * Set grid auto flow
   */
  autoFlow(value: 'row' | 'column' | 'dense' | 'row dense' | 'column dense'): this {
    this.element.style.gridAutoFlow = value;
    return this;
  }
}

export function grid(): GridBuilder {
  return new GridBuilder();
}

// Legacy support
export function gridLegacy(
  props: DOMProps & { columns?: number; gap?: string },
  ...children: DOMChildren[]
): HTMLElement {
  const { columns = 1, gap = '1rem', ...restProps } = props;
  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    ...(typeof restProps.style === 'object' ? restProps.style : {})
  };
  return createElement('div', { ...restProps, style }, ...children);
}

/**
 * Plain container (div without flex) - Builder API
 */
export function container(): ElementBuilder {
  return new ElementBuilder('div');
}

// Legacy support
export function containerLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  return createElement('div', props, ...children);
}

/**
 * Stack layout with z-index management - Builder API
 */
export class StackBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.position = 'relative';
  }
}

export function stack(): StackBuilder {
  return new StackBuilder();
}

// Legacy support
export function stackLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    position: 'relative',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Center content (both axes) - Builder API
 */
export class CenterBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.display = 'flex';
    this.element.style.alignItems = 'center';
    this.element.style.justifyContent = 'center';
  }
}

export function center(): CenterBuilder {
  return new CenterBuilder();
}

// Legacy support
export function centerLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Flexible spacer - Builder API
 */
export class SpacerBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.flex = '1';
  }
}

export function spacer(): SpacerBuilder {
  return new SpacerBuilder();
}

// Legacy support
export function spacerLegacy(props: DOMProps = {}): HTMLElement {
  const style = {
    flex: '1',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style });
}

/**
 * Flex wrap container - Builder API
 */
export class WrapBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.display = 'flex';
    this.element.style.flexWrap = 'wrap';
  }
}

export function wrap(): WrapBuilder {
  return new WrapBuilder();
}

// Legacy support
export function wrapLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    display: 'flex',
    flexWrap: 'wrap',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Scrollable container - Builder API
 */
export class ScrollBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.overflow = 'auto';
  }

  /**
   * Set scroll behavior
   */
  smooth(): this {
    this.element.style.scrollBehavior = 'smooth';
    return this;
  }

  /**
   * Hide scrollbar
   */
  hideScrollbar(): this {
    this.element.style.scrollbarWidth = 'none';
    (this.element.style as any).msOverflowStyle = 'none';
    return this;
  }
}

export function scroll(): ScrollBuilder {
  return new ScrollBuilder();
}

// Legacy support
export function scrollLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    overflow: 'auto',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

/**
 * Sticky positioned container - Builder API
 */
export class StickyBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.position = 'sticky';
    this.element.style.top = '0';
  }

  /**
   * Set top position
   */
  top(value: string | number): this {
    this.element.style.top = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  /**
   * Set bottom position
   */
  bottom(value: string | number): this {
    this.element.style.bottom = typeof value === 'number' ? `${value}px` : value;
    return this;
  }
}

export function sticky(): StickyBuilder {
  return new StickyBuilder();
}

// Legacy support
export function stickyLegacy(props: DOMProps & { top?: string }, ...children: DOMChildren[]): HTMLElement {
  const { top = '0', ...restProps } = props;
  const style = {
    position: 'sticky',
    top,
    ...(typeof restProps.style === 'object' ? restProps.style : {})
  };
  return createElement('div', { ...restProps, style }, ...children);
}

/**
 * Fixed positioned container - Builder API
 */
export class FixedBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.position = 'fixed';
  }

  top(value: string | number): this {
    this.element.style.top = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  bottom(value: string | number): this {
    this.element.style.bottom = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  left(value: string | number): this {
    this.element.style.left = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  right(value: string | number): this {
    this.element.style.right = typeof value === 'number' ? `${value}px` : value;
    return this;
  }
}

export function fixed(): FixedBuilder {
  return new FixedBuilder();
}

/**
 * Absolute positioned container - Builder API
 */
export class AbsoluteBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.position = 'absolute';
  }

  top(value: string | number): this {
    this.element.style.top = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  bottom(value: string | number): this {
    this.element.style.bottom = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  left(value: string | number): this {
    this.element.style.left = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  right(value: string | number): this {
    this.element.style.right = typeof value === 'number' ? `${value}px` : value;
    return this;
  }
}

export function absolute(): AbsoluteBuilder {
  return new AbsoluteBuilder();
}

/**
 * Relative positioned container - Builder API
 */
export class RelativeBuilder extends ElementBuilder {
  constructor() {
    super('div');
    this.element.style.position = 'relative';
  }
}

export function relative(): RelativeBuilder {
  return new RelativeBuilder();
}

// Legacy support
export function fixedLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    position: 'fixed',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

export function absoluteLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    position: 'absolute',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}

export function relativeLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const style = {
    position: 'relative',
    ...(typeof props.style === 'object' ? props.style : {})
  };
  return createElement('div', { ...props, style }, ...children);
}
