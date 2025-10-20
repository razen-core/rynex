/**
 * Rynex UI Components
 * Pre-built UI components with common patterns
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';
import { vbox, hbox } from './layout.js';
import { text } from './basic_elements.js';
import { svg } from './media.js';

/**
 * Badge/Tag component
 */
export function badge(props: DOMProps & { variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' }, content: DOMChildren): HTMLElement {
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
 * Card component
 */
export function card(props: DOMProps, ...children: DOMChildren[]): HTMLElement {
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
 * Avatar component
 */
export function avatar(props: DOMProps & { src: string; alt?: string; size?: string | number }): HTMLElement {
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
 * Icon wrapper component - for SVG icons
 */
export function icon(props: DOMProps & { size?: string | number }, svgContent: string): HTMLElement {
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
 * Tooltip component (simple implementation)
 */
export function tooltip(props: DOMProps & { text: string }, ...children: DOMChildren[]): HTMLElement {
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
 * Modal/Dialog component
 */
export function modal(props: DOMProps & { open?: boolean; onClose?: () => void }, ...children: DOMChildren[]): HTMLElement {
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
 * Dropdown menu component
 */
export function dropdown(props: DOMProps & { items: Array<{ label: string; onClick: () => void }> }, trigger: DOMChildren): HTMLElement {
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
 * Toggle/Switch component
 */
export function toggle(props: DOMProps & { checked?: boolean; onChange?: (checked: boolean) => void }): HTMLElement {
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
 * Slider/Range component
 */
export function slider(props: DOMProps & { min?: number; max?: number; value?: number; onChange?: (value: number) => void }): HTMLElement {
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
 * Progress bar component
 */
export function progressBar(props: DOMProps & { value: number; max?: number }): HTMLElement {
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
 * Spinner/Loading component
 */
export function spinner(props: DOMProps & { size?: string | number }): HTMLElement {
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
