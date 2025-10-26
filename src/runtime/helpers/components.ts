/**
 * Rynex UI Components
 * Pre-built UI components with common patterns
 * Now with Builder API support
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';
import { vboxLegacy as vbox, hboxLegacy as hbox } from './layout.js';
import { text } from './basic_elements.js';
import { svg } from './media.js';
import { ElementBuilder } from './builder.js';

/**
 * Badge/Tag component - Builder API
 */
export class BadgeBuilder extends ElementBuilder<HTMLSpanElement> {
  private variantValue: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';

  constructor(content?: DOMChildren) {
    super('span');
    if (content) this.add([content]);
    this.applyDefaultStyles();
  }

  variant(value: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'): this {
    this.variantValue = value;
    this.applyVariantStyles();
    return this;
  }

  private applyDefaultStyles(): void {
    this.element.style.display = 'inline-block';
    this.element.style.padding = '0.25rem 0.75rem';
    this.element.style.borderRadius = '9999px';
    this.element.style.fontSize = '0.875rem';
    this.element.style.fontWeight = '600';
    this.applyVariantStyles();
  }

  private applyVariantStyles(): void {
    const variantStyles: Record<string, { background: string; color: string }> = {
      primary: { background: '#00ff88', color: '#000000' },
      secondary: { background: '#6c757d', color: '#ffffff' },
      success: { background: '#28a745', color: '#ffffff' },
      warning: { background: '#ffc107', color: '#000000' },
      danger: { background: '#dc3545', color: '#ffffff' }
    };
    const styles = variantStyles[this.variantValue];
    this.element.style.background = styles.background;
    this.element.style.color = styles.color;
  }
}

export function badge(content?: DOMChildren): BadgeBuilder {
  return new BadgeBuilder(content);
}

// Legacy support
export function badgeLegacy(props: DOMProps & { variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' }, content: DOMChildren): HTMLElement {
  const variant = props.variant || 'primary';
  const variantStyles: Record<string, any> = {
    primary: { background: '#00ff88', color: '#000000' },
    secondary: { background: '#6c757d', color: '#ffffff' },
    success: { background: '#28a745', color: '#ffffff' },
    warning: { background: '#ffc107', color: '#000000' },
    danger: { background: '#dc3545', color: '#ffffff' }
  };

  const defaultStyle = {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    ...variantStyles[variant],
    ...(props.style as any || {})
  };

  return createElement('span', { ...props, style: defaultStyle }, content);
}

/**
 * Card component - Builder API
 */
export class CardBuilder extends ElementBuilder<HTMLDivElement> {
  constructor() {
    super('div');
    this.applyDefaultStyles();
  }

  private applyDefaultStyles(): void {
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'column';
    this.element.style.background = '#0a0a0a';
    this.element.style.border = '1px solid #333333';
    this.element.style.borderRadius = '0.5rem';
    this.element.style.padding = '1.5rem';
    this.element.style.boxShadow = '0 1px 2px rgba(0, 255, 136, 0.1)';
  }
}

export function card(): CardBuilder {
  return new CardBuilder();
}

// Legacy support
export function cardLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
  const defaultStyle = {
    background: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 1px 2px rgba(0, 255, 136, 0.1)',
    ...(props.style as any || {})
  };

  return vbox({ ...props, style: defaultStyle }, ...children);
}

/**
 * Avatar component - Builder API
 */
export class AvatarBuilder extends ElementBuilder<HTMLImageElement> {
  constructor(src?: string) {
    super('img');
    if (src) this.src(src);
    this.applyDefaultStyles();
  }

  src(value: string): this {
    this.element.src = value;
    return this;
  }

  alt(value: string): this {
    this.element.alt = value;
    return this;
  }

  size(value: string | number): this {
    const sizeStr = typeof value === 'number' ? `${value}px` : value;
    this.element.style.width = sizeStr;
    this.element.style.height = sizeStr;
    return this;
  }

  private applyDefaultStyles(): void {
    this.element.style.width = '40px';
    this.element.style.height = '40px';
    this.element.style.borderRadius = '50%';
    this.element.style.objectFit = 'cover';
  }
}

export function avatar(src?: string): AvatarBuilder {
  return new AvatarBuilder(src);
}

// Legacy support
export function avatarLegacy(props: DOMProps & { src: string; alt?: string; size?: string | number }): HTMLElement {
  const size = props.size || '40px';
  const defaultStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
    ...(props.style as any || {})
  };

  return createElement('img', { ...props, style: defaultStyle });
}

/**
 * Icon wrapper component - Builder API
 */
export class IconBuilder extends ElementBuilder<HTMLSpanElement> {
  private svgContent: string = '';
  private iconSize: string = '24px';

  constructor(svgContent?: string) {
    super('span');
    if (svgContent) this.svgContent = svgContent;
    this.applyDefaultStyles();
  }

  svg(content: string): this {
    this.svgContent = content;
    return this;
  }

  size(value: string | number): this {
    this.iconSize = typeof value === 'number' ? `${value}px` : value;
    this.element.style.width = this.iconSize;
    this.element.style.height = this.iconSize;
    return this;
  }

  build(): HTMLSpanElement {
    if (this.svgContent) {
      const svgEl = svg({ 
        viewBox: '0 0 24 24', 
        width: this.iconSize, 
        height: this.iconSize,
        fill: 'currentColor',
        style: { display: 'block' }
      }, this.svgContent);
      this.element.appendChild(svgEl);
    }
    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.style.display = 'inline-flex';
    this.element.style.alignItems = 'center';
    this.element.style.justifyContent = 'center';
    this.element.style.width = this.iconSize;
    this.element.style.height = this.iconSize;
  }
}

export function icon(svgContent?: string): IconBuilder {
  return new IconBuilder(svgContent);
}

// Legacy support
export function iconLegacy(props: DOMProps & { size?: string | number }, svgContent: string): HTMLElement {
  const size = props.size || '24px';
  const defaultStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    ...(props.style as any || {})
  };

  const container = createElement('span', { ...props, style: defaultStyle });
  const svgEl = svg({ 
    viewBox: '0 0 24 24', 
    width: size, 
    height: size,
    fill: 'currentColor',
    style: { display: 'block' }
  }, svgContent);
  
  container.appendChild(svgEl);
  return container;
}

/**
 * Tooltip component - Builder API
 */
export class TooltipBuilder extends ElementBuilder<HTMLDivElement> {
  private tooltipText: string = '';
  private tooltipEl: HTMLDivElement | null = null;

  constructor(text?: string) {
    super('div');
    if (text) this.tooltipText = text;
    this.applyDefaultStyles();
  }

  text(value: string): this {
    this.tooltipText = value;
    return this;
  }

  build(): HTMLDivElement {
    this.tooltipEl = document.createElement('div');
    Object.assign(this.tooltipEl.style, {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '0.5rem 0.75rem',
      background: '#333333',
      color: '#ffffff',
      fontSize: '0.875rem',
      borderRadius: '0.25rem',
      whiteSpace: 'nowrap',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.2s',
      marginBottom: '0.5rem',
      zIndex: '1000'
    });
    this.tooltipEl.textContent = this.tooltipText;
    this.element.appendChild(this.tooltipEl);

    this.element.addEventListener('mouseenter', () => {
      if (this.tooltipEl) this.tooltipEl.style.opacity = '1';
    });

    this.element.addEventListener('mouseleave', () => {
      if (this.tooltipEl) this.tooltipEl.style.opacity = '0';
    });

    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
  }
}

export function tooltip(text?: string): TooltipBuilder {
  return new TooltipBuilder(text);
}

// Legacy support
export function tooltipLegacy(props: DOMProps & { text: string }, ...children: DOMChildren[]): HTMLElement {
  const tooltipText = props.text;
  const container = createElement('div', {
    ...props,
    style: {
      position: 'relative',
      display: 'inline-block',
      ...(props.style as any || {})
    }
  }, ...children);

  const tooltipEl = createElement('div', {
    style: {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '0.5rem 0.75rem',
      background: '#333333',
      color: '#ffffff',
      fontSize: '0.875rem',
      borderRadius: '0.25rem',
      whiteSpace: 'nowrap',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.2s',
      marginBottom: '0.5rem',
      zIndex: '1000'
    }
  }, tooltipText);

  container.appendChild(tooltipEl);

  container.addEventListener('mouseenter', () => {
    tooltipEl.style.opacity = '1';
  });

  container.addEventListener('mouseleave', () => {
    tooltipEl.style.opacity = '0';
  });

  return container;
}

/**
 * Modal/Dialog component - Builder API
 */
export class ModalBuilder extends ElementBuilder<HTMLDivElement> {
  private isOpen: boolean = false;
  private closeCallback: (() => void) | null = null;
  private contentEl: HTMLDivElement | null = null;

  constructor() {
    super('div');
    this.applyDefaultStyles();
  }

  open(value: boolean = true): this {
    this.isOpen = value;
    this.element.style.display = value ? 'flex' : 'none';
    return this;
  }

  onClose(callback: () => void): this {
    this.closeCallback = callback;
    return this;
  }

  build(): HTMLDivElement {
    this.contentEl = document.createElement('div');
    Object.assign(this.contentEl.style, {
      background: '#0a0a0a',
      border: '1px solid #333333',
      borderRadius: '0.5rem',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    });

    // Move children to content element
    while (this.element.firstChild) {
      this.contentEl.appendChild(this.element.firstChild);
    }

    this.element.appendChild(this.contentEl);

    this.element.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.element && this.closeCallback) {
        this.closeCallback();
      }
    });

    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.style.position = 'fixed';
    this.element.style.top = '0';
    this.element.style.left = '0';
    this.element.style.right = '0';
    this.element.style.bottom = '0';
    this.element.style.background = 'rgba(0, 0, 0, 0.5)';
    this.element.style.display = this.isOpen ? 'flex' : 'none';
    this.element.style.alignItems = 'center';
    this.element.style.justifyContent = 'center';
    this.element.style.zIndex = '9999';
  }
}

export function modal(): ModalBuilder {
  return new ModalBuilder();
}

// Legacy support
export function modalLegacy(props: DOMProps & { open?: boolean; onClose?: () => void }, ...children: DOMChildren[]): HTMLElement {
  const isOpen = props.open || false;
  
  const overlay = createElement('div', {
    style: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'rgba(0, 0, 0, 0.5)',
      display: isOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '9999',
      ...(props.style as any || {})
    },
    onClick: (e: MouseEvent) => {
      if (e.target === overlay && props.onClose) {
        props.onClose();
      }
    }
  });

  const content = createElement('div', {
    style: {
      background: '#0a0a0a',
      border: '1px solid #333333',
      borderRadius: '0.5rem',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    }
  }, ...children);

  overlay.appendChild(content);
  return overlay;
}

/**
 * Dropdown menu component - Builder API
 */
export class DropdownBuilder extends ElementBuilder<HTMLDivElement> {
  private items: Array<{ label: string; onClick: () => void }> = [];
  private triggerContent: DOMChildren | null = null;
  private isOpen: boolean = false;

  constructor() {
    super('div');
    this.applyDefaultStyles();
  }

  setItems(value: Array<{ label: string; onClick: () => void }>): this {
    this.items = value;
    return this;
  }

  trigger(content: DOMChildren): this {
    this.triggerContent = content;
    return this;
  }

  build(): HTMLDivElement {
    const triggerEl = document.createElement('div');
    triggerEl.style.cursor = 'pointer';
    if (this.triggerContent) {
      if (typeof this.triggerContent === 'string') {
        triggerEl.textContent = this.triggerContent;
      } else if (this.triggerContent instanceof HTMLElement) {
        triggerEl.appendChild(this.triggerContent);
      }
    }

    const menuEl = document.createElement('div');
    Object.assign(menuEl.style, {
      position: 'absolute',
      top: '100%',
      left: '0',
      background: '#0a0a0a',
      border: '1px solid #333333',
      borderRadius: '0.5rem',
      marginTop: '0.5rem',
      minWidth: '200px',
      display: 'none',
      zIndex: '1000',
      boxShadow: '0 4px 6px -1px rgba(0, 255, 136, 0.1)'
    });

    this.items.forEach((item, index) => {
      const itemEl = document.createElement('div');
      Object.assign(itemEl.style, {
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: index < this.items.length - 1 ? '1px solid #333333' : 'none',
        transition: 'background 0.2s'
      });
      itemEl.textContent = item.label;
      itemEl.addEventListener('click', () => {
        item.onClick();
        this.isOpen = false;
        menuEl.style.display = 'none';
      });
      itemEl.addEventListener('mouseenter', () => {
        itemEl.style.background = '#1a1a1a';
      });
      itemEl.addEventListener('mouseleave', () => {
        itemEl.style.background = 'transparent';
      });
      menuEl.appendChild(itemEl);
    });

    triggerEl.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      menuEl.style.display = this.isOpen ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target as Node)) {
        this.isOpen = false;
        menuEl.style.display = 'none';
      }
    });

    this.element.appendChild(triggerEl);
    this.element.appendChild(menuEl);

    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
  }
}

export function dropdown(): DropdownBuilder {
  return new DropdownBuilder();
}

// Legacy support
export function dropdownLegacy(props: DOMProps & { items: Array<{ label: string; onClick: () => void }> }, trigger: DOMChildren): HTMLElement {
  const items = props.items || [];
  let isOpen = false;

  const container = createElement('div', {
    style: {
      position: 'relative',
      display: 'inline-block',
      ...(props.style as any || {})
    }
  });

  const triggerEl = createElement('div', {
    style: { cursor: 'pointer' },
    onClick: () => {
      isOpen = !isOpen;
      menuEl.style.display = isOpen ? 'block' : 'none';
    }
  }, trigger);

  const menuEl = createElement('div', {
    style: {
      position: 'absolute',
      top: '100%',
      left: '0',
      background: '#0a0a0a',
      border: '1px solid #333333',
      borderRadius: '0.5rem',
      marginTop: '0.5rem',
      minWidth: '200px',
      display: 'none',
      zIndex: '1000',
      boxShadow: '0 4px 6px -1px rgba(0, 255, 136, 0.1)'
    }
  });

  items.forEach((item, index) => {
    const itemEl = createElement('div', {
      style: {
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: index < items.length - 1 ? '1px solid #333333' : 'none',
        transition: 'background 0.2s'
      },
      onClick: () => {
        item.onClick();
        isOpen = false;
        menuEl.style.display = 'none';
      },
      onMouseEnter: (e: MouseEvent) => {
        (e.target as HTMLElement).style.background = '#1a1a1a';
      },
      onMouseLeave: (e: MouseEvent) => {
        (e.target as HTMLElement).style.background = 'transparent';
      }
    }, item.label);
    menuEl.appendChild(itemEl);
  });

  container.appendChild(triggerEl);
  container.appendChild(menuEl);

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      isOpen = false;
      menuEl.style.display = 'none';
    }
  });

  return container;
}

/**
 * Toggle/Switch component - Builder API
 */
export class ToggleBuilder extends ElementBuilder<HTMLLabelElement> {
  private isChecked: boolean = false;
  private changeCallback: ((checked: boolean) => void) | null = null;

  constructor() {
    super('label');
    this.applyDefaultStyles();
  }

  checked(value: boolean = true): this {
    this.isChecked = value;
    return this;
  }

  onChange(callback: (checked: boolean) => void): this {
    this.changeCallback = callback;
    return this;
  }

  build(): HTMLLabelElement {
    const track = document.createElement('div');
    Object.assign(track.style, {
      width: '48px',
      height: '24px',
      background: this.isChecked ? '#00ff88' : '#333333',
      borderRadius: '9999px',
      position: 'relative',
      transition: 'background 0.2s'
    });

    const thumb = document.createElement('div');
    Object.assign(thumb.style, {
      width: '20px',
      height: '20px',
      background: '#ffffff',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: this.isChecked ? '26px' : '2px',
      transition: 'left 0.2s'
    });

    track.appendChild(thumb);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = this.isChecked;
    input.style.display = 'none';

    this.element.appendChild(input);
    this.element.appendChild(track);

    this.element.addEventListener('click', () => {
      this.isChecked = !this.isChecked;
      input.checked = this.isChecked;
      track.style.background = this.isChecked ? '#00ff88' : '#333333';
      thumb.style.left = this.isChecked ? '26px' : '2px';
      if (this.changeCallback) {
        this.changeCallback(this.isChecked);
      }
    });

    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.style.display = 'inline-flex';
    this.element.style.alignItems = 'center';
    this.element.style.cursor = 'pointer';
  }
}

export function toggle(): ToggleBuilder {
  return new ToggleBuilder();
}

// Legacy support
export function toggleLegacy(props: DOMProps & { checked?: boolean; onChange?: (checked: boolean) => void }): HTMLElement {
  let isChecked = props.checked || false;

  const container = createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      ...(props.style as any || {})
    }
  });

  const track = createElement('div', {
    style: {
      width: '48px',
      height: '24px',
      background: isChecked ? '#00ff88' : '#333333',
      borderRadius: '9999px',
      position: 'relative',
      transition: 'background 0.2s'
    }
  });

  const thumb = createElement('div', {
    style: {
      width: '20px',
      height: '20px',
      background: '#ffffff',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: isChecked ? '26px' : '2px',
      transition: 'left 0.2s'
    }
  });

  track.appendChild(thumb);

  const input = createElement('input', {
    type: 'checkbox',
    checked: isChecked,
    style: { display: 'none' },
    onChange: (e: Event) => {
      isChecked = (e.target as HTMLInputElement).checked;
      track.style.background = isChecked ? '#00ff88' : '#333333';
      thumb.style.left = isChecked ? '26px' : '2px';
      if (props.onChange) {
        props.onChange(isChecked);
      }
    }
  });

  container.appendChild(input);
  container.appendChild(track);

  container.addEventListener('click', () => {
    isChecked = !isChecked;
    (input as HTMLInputElement).checked = isChecked;
    track.style.background = isChecked ? '#00ff88' : '#333333';
    thumb.style.left = isChecked ? '26px' : '2px';
    if (props.onChange) {
      props.onChange(isChecked);
    }
  });

  return container;
}

/**
 * Slider/Range component - Builder API
 */
export class SliderBuilder extends ElementBuilder<HTMLInputElement> {
  constructor() {
    super('input');
    this.element.type = 'range';
    this.applyDefaultStyles();
  }

  min(value: number): this {
    this.element.min = String(value);
    return this;
  }

  max(value: number): this {
    this.element.max = String(value);
    return this;
  }

  value(value: number): this {
    this.element.value = String(value);
    return this;
  }

  onChange(callback: (value: number) => void): this {
    this.element.addEventListener('input', (e: Event) => {
      callback(Number((e.target as HTMLInputElement).value));
    });
    return this;
  }

  private applyDefaultStyles(): void {
    this.element.style.width = '100%';
    this.element.style.accentColor = '#00ff88';
    this.element.min = '0';
    this.element.max = '100';
    this.element.value = '50';
  }
}

export function slider(): SliderBuilder {
  return new SliderBuilder();
}

// Legacy support
export function sliderLegacy(props: DOMProps & { min?: number; max?: number; value?: number; onChange?: (value: number) => void }): HTMLElement {
  const min = props.min || 0;
  const max = props.max || 100;
  const value = props.value || 50;

  return createElement('input', {
    type: 'range',
    min,
    max,
    value,
    ...props,
    style: {
      width: '100%',
      accentColor: '#00ff88',
      ...(props.style as any || {})
    },
    onInput: (e: Event) => {
      if (props.onChange) {
        props.onChange(Number((e.target as HTMLInputElement).value));
      }
    }
  });
}

/**
 * Progress bar component - Builder API
 */
export class ProgressBarBuilder extends ElementBuilder<HTMLDivElement> {
  private progressValue: number = 0;
  private maxValue: number = 100;
  private barEl: HTMLDivElement | null = null;

  constructor() {
    super('div');
    this.applyDefaultStyles();
  }

  value(val: number): this {
    this.progressValue = val;
    if (this.barEl) {
      const percentage = (this.progressValue / this.maxValue) * 100;
      this.barEl.style.width = `${percentage}%`;
    }
    return this;
  }

  max(val: number): this {
    this.maxValue = val;
    if (this.barEl) {
      const percentage = (this.progressValue / this.maxValue) * 100;
      this.barEl.style.width = `${percentage}%`;
    }
    return this;
  }

  build(): HTMLDivElement {
    this.barEl = document.createElement('div');
    const percentage = (this.progressValue / this.maxValue) * 100;
    Object.assign(this.barEl.style, {
      width: `${percentage}%`,
      height: '100%',
      background: '#00ff88',
      transition: 'width 0.3s ease'
    });
    this.element.appendChild(this.barEl);
    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.style.width = '100%';
    this.element.style.height = '8px';
    this.element.style.background = '#333333';
    this.element.style.borderRadius = '9999px';
    this.element.style.overflow = 'hidden';
  }
}

export function progressBar(): ProgressBarBuilder {
  return new ProgressBarBuilder();
}

// Legacy support
export function progressBarLegacy(props: DOMProps & { value: number; max?: number }): HTMLElement {
  const value = props.value || 0;
  const max = props.max || 100;
  const percentage = (value / max) * 100;

  const container = createElement('div', {
    style: {
      width: '100%',
      height: '8px',
      background: '#333333',
      borderRadius: '9999px',
      overflow: 'hidden',
      ...(props.style as any || {})
    }
  });

  const bar = createElement('div', {
    style: {
      width: `${percentage}%`,
      height: '100%',
      background: '#00ff88',
      transition: 'width 0.3s ease'
    }
  });

  container.appendChild(bar);
  return container;
}

/**
 * Spinner/Loading component - Builder API
 */
export class SpinnerBuilder extends ElementBuilder<HTMLDivElement> {
  constructor() {
    super('div');
    this.applyDefaultStyles();
  }

  size(value: string | number): this {
    const sizeStr = typeof value === 'number' ? `${value}px` : value;
    this.element.style.width = sizeStr;
    this.element.style.height = sizeStr;
    return this;
  }

  private applyDefaultStyles(): void {
    this.element.style.width = '40px';
    this.element.style.height = '40px';
    this.element.style.border = '3px solid #333333';
    this.element.style.borderTop = '3px solid #00ff88';
    this.element.style.borderRadius = '50%';
    this.element.style.animation = 'spin 1s linear infinite';
  }
}

export function spinner(): SpinnerBuilder {
  return new SpinnerBuilder();
}

// Legacy support
export function spinnerLegacy(props: DOMProps & { size?: string | number }): HTMLElement {
  const size = props.size || '40px';
  
  return createElement('div', {
    ...props,
    style: {
      width: size,
      height: size,
      border: '3px solid #333333',
      borderTop: '3px solid #00ff88',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      ...(props.style as any || {})
    }
  });
}

/**
 * Tabs component - Builder API
 */
export class TabsBuilder extends ElementBuilder<HTMLDivElement> {
  private tabsData: Array<{ label: string; content: HTMLElement }> = [];
  private activeIndex: number = 0;
  private changeCallback: ((index: number) => void) | null = null;

  constructor() {
    super('div');
    this.applyDefaultStyles();
  }

  setTabs(value: Array<{ label: string; content: HTMLElement }>): this {
    this.tabsData = value;
    return this;
  }

  defaultIndex(value: number): this {
    this.activeIndex = value;
    return this;
  }

  onChange(callback: (index: number) => void): this {
    this.changeCallback = callback;
    return this;
  }

  build(): HTMLDivElement {
    const tabHeaders = document.createElement('div');
    tabHeaders.className = 'tab-headers';
    Object.assign(tabHeaders.style, {
      display: 'flex',
      borderBottom: '1px solid #333333',
      gap: '0.5rem'
    });

    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.style.padding = '1rem';

    const updateActiveTab = (index: number) => {
      this.activeIndex = index;
      tabContent.innerHTML = '';
      tabContent.appendChild(this.tabsData[index].content);

      Array.from(tabHeaders.children).forEach((header, i) => {
        const headerEl = header as HTMLElement;
        if (i === index) {
          headerEl.style.borderBottom = '2px solid #00ff88';
          headerEl.style.color = '#00ff88';
        } else {
          headerEl.style.borderBottom = '2px solid transparent';
          headerEl.style.color = '#b0b0b0';
        }
      });

      if (this.changeCallback) {
        this.changeCallback(index);
      }
    };

    this.tabsData.forEach((tab, index) => {
      const header = document.createElement('button');
      header.className = 'tab-header';
      Object.assign(header.style, {
        padding: '0.75rem 1rem',
        background: 'transparent',
        border: 'none',
        borderBottom: index === this.activeIndex ? '2px solid #00ff88' : '2px solid transparent',
        color: index === this.activeIndex ? '#00ff88' : '#b0b0b0',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s'
      });
      header.textContent = tab.label;
      header.addEventListener('click', () => updateActiveTab(index));
      header.addEventListener('mouseenter', () => {
        if (index !== this.activeIndex) {
          header.style.color = '#ffffff';
        }
      });
      header.addEventListener('mouseleave', () => {
        if (index !== this.activeIndex) {
          header.style.color = '#b0b0b0';
        }
      });
      tabHeaders.appendChild(header);
    });

    if (this.tabsData.length > 0) {
      tabContent.appendChild(this.tabsData[this.activeIndex].content);
    }

    this.element.appendChild(tabHeaders);
    this.element.appendChild(tabContent);

    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'column';
  }
}

export function tabs(): TabsBuilder {
  return new TabsBuilder();
}

// Legacy support
export function tabsLegacy(props: DOMProps & {
  tabs: Array<{ label: string; content: HTMLElement }>;
  defaultIndex?: number;
  onChange?: (index: number) => void;
}): HTMLElement {
  const { tabs: tabsData, defaultIndex = 0, onChange, ...restProps } = props;
  let activeIndex = defaultIndex;

  const container = createElement('div', {
    ...restProps,
    class: `tabs ${restProps.class || ''}`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      ...(restProps.style as any || {})
    }
  });

  // Tab headers
  const tabHeaders = createElement('div', {
    class: 'tab-headers',
    style: {
      display: 'flex',
      borderBottom: '1px solid #333333',
      gap: '0.5rem'
    }
  });

  // Tab content container
  const tabContent = createElement('div', {
    class: 'tab-content',
    style: {
      padding: '1rem'
    }
  });

  const updateActiveTab = (index: number) => {
    activeIndex = index;
    tabContent.innerHTML = '';
    tabContent.appendChild(tabsData[index].content);

    // Update header styles
    Array.from(tabHeaders.children).forEach((header, i) => {
      const headerEl = header as HTMLElement;
      if (i === index) {
        headerEl.style.borderBottom = '2px solid #00ff88';
        headerEl.style.color = '#00ff88';
      } else {
        headerEl.style.borderBottom = '2px solid transparent';
        headerEl.style.color = '#b0b0b0';
      }
    });

    if (onChange) {
      onChange(index);
    }
  };

  // Create tab headers
  tabsData.forEach((tab, index) => {
    const header = createElement('button', {
      class: 'tab-header',
      style: {
        padding: '0.75rem 1rem',
        background: 'transparent',
        border: 'none',
        borderBottom: index === activeIndex ? '2px solid #00ff88' : '2px solid transparent',
        color: index === activeIndex ? '#00ff88' : '#b0b0b0',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s'
      },
      onClick: () => updateActiveTab(index),
      onMouseEnter: (e: MouseEvent) => {
        if (index !== activeIndex) {
          (e.target as HTMLElement).style.color = '#ffffff';
        }
      },
      onMouseLeave: (e: MouseEvent) => {
        if (index !== activeIndex) {
          (e.target as HTMLElement).style.color = '#b0b0b0';
        }
      }
    });
    header.textContent = tab.label;
    tabHeaders.appendChild(header);
  });

  // Set initial content
  tabContent.appendChild(tabsData[activeIndex].content);

  container.appendChild(tabHeaders);
  container.appendChild(tabContent);

  return container;
}

/**
 * Accordion component - Builder API
 */
export class AccordionBuilder extends ElementBuilder<HTMLDivElement> {
  private items: Array<{ title: string; content: HTMLElement }> = [];
  private allowMultiple: boolean = false;
  private openIndices: Set<number> = new Set();

  constructor() {
    super('div');
    this.applyDefaultStyles();
  }

  setItems(value: Array<{ title: string; content: HTMLElement }>): this {
    this.items = value;
    return this;
  }

  multiple(value: boolean = true): this {
    this.allowMultiple = value;
    return this;
  }

  defaultOpen(indices: number[]): this {
    this.openIndices = new Set(indices);
    return this;
  }

  build(): HTMLDivElement {
    const toggleItem = (index: number, itemContent: HTMLElement, icon: HTMLElement) => {
      const isOpen = this.openIndices.has(index);

      if (isOpen) {
        this.openIndices.delete(index);
        itemContent.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
      } else {
        if (!this.allowMultiple) {
          this.openIndices.clear();
          Array.from(this.element.children).forEach((child) => {
            const content = child.querySelector('.accordion-content') as HTMLElement;
            const itemIcon = child.querySelector('.accordion-icon') as HTMLElement;
            if (content && itemIcon) {
              content.style.display = 'none';
              itemIcon.style.transform = 'rotate(0deg)';
            }
          });
        }
        this.openIndices.add(index);
        itemContent.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
      }
    };

    this.items.forEach((item, index) => {
      const itemContainer = document.createElement('div');
      itemContainer.className = 'accordion-item';
      Object.assign(itemContainer.style, {
        border: '1px solid #333333',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      });

      const icon = document.createElement('span');
      icon.className = 'accordion-icon';
      Object.assign(icon.style, {
        transition: 'transform 0.2s',
        transform: this.openIndices.has(index) ? 'rotate(180deg)' : 'rotate(0deg)'
      });
      icon.textContent = '▼';

      const header = document.createElement('button');
      header.className = 'accordion-header';
      Object.assign(header.style, {
        width: '100%',
        padding: '1rem',
        background: '#0a0a0a',
        border: 'none',
        color: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1rem',
        textAlign: 'left'
      });
      header.addEventListener('mouseenter', () => {
        header.style.background = '#1a1a1a';
      });
      header.addEventListener('mouseleave', () => {
        header.style.background = '#0a0a0a';
      });

      const title = document.createElement('span');
      title.textContent = item.title;
      header.appendChild(title);
      header.appendChild(icon);

      const content = document.createElement('div');
      content.className = 'accordion-content';
      Object.assign(content.style, {
        padding: '1rem',
        display: this.openIndices.has(index) ? 'block' : 'none',
        background: '#000000'
      });
      content.appendChild(item.content);

      header.addEventListener('click', () => toggleItem(index, content, icon));

      itemContainer.appendChild(header);
      itemContainer.appendChild(content);
      this.element.appendChild(itemContainer);
    });

    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'column';
    this.element.style.gap = '0.5rem';
  }
}

export function accordion(): AccordionBuilder {
  return new AccordionBuilder();
}

// Legacy support
export function accordionLegacy(props: DOMProps & {
  items: Array<{ title: string; content: HTMLElement }>;
  allowMultiple?: boolean;
  defaultOpen?: number[];
}): HTMLElement {
  const { items, allowMultiple = false, defaultOpen = [], ...restProps } = props;
  const openIndices = new Set<number>(defaultOpen);

  const container = createElement('div', {
    ...restProps,
    class: `accordion ${restProps.class || ''}`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      ...(restProps.style as any || {})
    }
  });

  const toggleItem = (index: number, itemContent: HTMLElement, icon: HTMLElement) => {
    const isOpen = openIndices.has(index);

    if (isOpen) {
      openIndices.delete(index);
      itemContent.style.display = 'none';
      icon.style.transform = 'rotate(0deg)';
    } else {
      if (!allowMultiple) {
        // Close all other items
        openIndices.clear();
        Array.from(container.children).forEach((child, i) => {
          const content = child.querySelector('.accordion-content') as HTMLElement;
          const itemIcon = child.querySelector('.accordion-icon') as HTMLElement;
          if (content && itemIcon) {
            content.style.display = 'none';
            itemIcon.style.transform = 'rotate(0deg)';
          }
        });
      }
      openIndices.add(index);
      itemContent.style.display = 'block';
      icon.style.transform = 'rotate(180deg)';
    }
  };

  items.forEach((item, index) => {
    const itemContainer = createElement('div', {
      class: 'accordion-item',
      style: {
        border: '1px solid #333333',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }
    });

    const icon = createElement('span', {
      class: 'accordion-icon',
      style: {
        transition: 'transform 0.2s',
        transform: openIndices.has(index) ? 'rotate(180deg)' : 'rotate(0deg)'
      }
    });
    icon.textContent = '▼';

    const header = createElement('button', {
      class: 'accordion-header',
      style: {
        width: '100%',
        padding: '1rem',
        background: '#0a0a0a',
        border: 'none',
        color: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1rem',
        textAlign: 'left'
      },
      onMouseEnter: (e: MouseEvent) => {
        (e.currentTarget as HTMLElement).style.background = '#1a1a1a';
      },
      onMouseLeave: (e: MouseEvent) => {
        (e.currentTarget as HTMLElement).style.background = '#0a0a0a';
      }
    });

    const title = createElement('span');
    title.textContent = item.title;
    header.appendChild(title);
    header.appendChild(icon);

    const content = createElement('div', {
      class: 'accordion-content',
      style: {
        padding: '1rem',
        display: openIndices.has(index) ? 'block' : 'none',
        background: '#000000'
      }
    });
    content.appendChild(item.content);

    header.addEventListener('click', () => toggleItem(index, content, icon));

    itemContainer.appendChild(header);
    itemContainer.appendChild(content);
    container.appendChild(itemContainer);
  });

  return container;
}

// Add keyframes for spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
