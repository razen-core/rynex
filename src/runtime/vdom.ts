/**
 * ZenWeb Virtual DOM Implementation
 * Efficient diffing and patching algorithm
 */

import type { VNode, VNodeChild, VNodeProps } from './types.js';

/**
 * Create a virtual node
 */
export function h(
  type: string | Function,
  props: VNodeProps | null,
  ...children: VNodeChild[]
): VNode {
  return {
    type,
    props: props || {},
    children: normalizeChildren(children),
    key: props?.key
  };
}

/**
 * Normalize children to handle various input types
 */
function normalizeChildren(children: VNodeChild[]): VNodeChild[] {
  return children.flat(Infinity).filter(child => {
    return child !== null && child !== undefined && child !== false && child !== true;
  });
}

/**
 * Create a text virtual node
 */
export function createTextVNode(text: string | number): VNode {
  return {
    type: 'text',
    props: {},
    children: [],
    el: undefined
  } as any;
}

/**
 * Mount a virtual node to the DOM
 */
export function mount(vnode: VNode, container: HTMLElement): void {
  const el = createElement(vnode);
  vnode.el = el as HTMLElement;
  container.appendChild(el);
}

/**
 * Create a DOM element from a virtual node
 */
function createElement(vnode: VNode): HTMLElement | Text {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (typeof vnode.type === 'function') {
    // Component
    const componentVNode = (vnode.type as Function)(vnode.props);
    return createElement(componentVNode);
  }

  // Regular element
  const el = document.createElement(vnode.type as string);

  // Set properties
  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      setAttribute(el, key, value);
    }
  }

  // Mount children
  if (vnode.children) {
    vnode.children.forEach(child => {
      if (child) {
        const childEl = createElement(child as VNode);
        el.appendChild(childEl);
      }
    });
  }

  return el;
}

/**
 * Set an attribute on a DOM element
 */
function setAttribute(el: HTMLElement, key: string, value: any): void {
  if (key.startsWith('on') && typeof value === 'function') {
    // Event listener
    const eventName = key.slice(2).toLowerCase();
    el.addEventListener(eventName, value);
  } else if (key === 'class' || key === 'className') {
    el.className = value;
  } else if (key === 'style') {
    if (typeof value === 'string') {
      el.setAttribute('style', value);
    } else if (typeof value === 'object') {
      Object.assign(el.style, value);
    }
  } else if (key === 'value') {
    (el as any).value = value;
  } else if (key === 'checked') {
    (el as any).checked = value;
  } else if (key !== 'key') {
    el.setAttribute(key, value);
  }
}

/**
 * Remove an attribute from a DOM element
 */
function removeAttribute(el: HTMLElement, key: string, oldValue: any): void {
  if (key.startsWith('on') && typeof oldValue === 'function') {
    const eventName = key.slice(2).toLowerCase();
    el.removeEventListener(eventName, oldValue);
  } else if (key === 'class' || key === 'className') {
    el.className = '';
  } else if (key === 'style') {
    el.removeAttribute('style');
  } else if (key !== 'key') {
    el.removeAttribute(key);
  }
}

/**
 * Patch (update) a DOM element with new virtual node
 */
export function patch(oldVNode: VNode, newVNode: VNode): void {
  if (!oldVNode.el) return;

  // Different types, replace entirely
  if (oldVNode.type !== newVNode.type) {
    const parent = oldVNode.el.parentElement;
    if (parent) {
      const newEl = createElement(newVNode);
      newVNode.el = newEl as HTMLElement;
      parent.replaceChild(newEl, oldVNode.el);
    }
    return;
  }

  // Same type, update props and children
  newVNode.el = oldVNode.el;

  // Update props
  const oldProps = oldVNode.props || {};
  const newProps = newVNode.props || {};

  // Remove old props
  for (const key in oldProps) {
    if (!(key in newProps)) {
      removeAttribute(oldVNode.el as HTMLElement, key, oldProps[key]);
    }
  }

  // Add/update new props
  for (const key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      setAttribute(oldVNode.el as HTMLElement, key, newProps[key]);
    }
  }

  // Update children
  patchChildren(oldVNode, newVNode);
}

/**
 * Patch children of a virtual node
 */
function patchChildren(oldVNode: VNode, newVNode: VNode): void {
  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const el = oldVNode.el as HTMLElement;

  const commonLength = Math.min(oldChildren.length, newChildren.length);

  // Patch common children
  for (let i = 0; i < commonLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (typeof oldChild === 'string' || typeof oldChild === 'number') {
      if (typeof newChild === 'string' || typeof newChild === 'number') {
        if (oldChild !== newChild) {
          el.childNodes[i].textContent = String(newChild);
        }
      } else {
        const newEl = createElement(newChild as VNode);
        el.replaceChild(newEl, el.childNodes[i]);
      }
    } else if (typeof newChild === 'string' || typeof newChild === 'number') {
      const textNode = document.createTextNode(String(newChild));
      el.replaceChild(textNode, el.childNodes[i]);
    } else {
      patch(oldChild as VNode, newChild as VNode);
    }
  }

  // Add new children
  if (newChildren.length > oldChildren.length) {
    for (let i = commonLength; i < newChildren.length; i++) {
      const child = newChildren[i];
      if (child) {
        const childEl = createElement(child as VNode);
        el.appendChild(childEl);
      }
    }
  }

  // Remove old children
  if (oldChildren.length > newChildren.length) {
    for (let i = oldChildren.length - 1; i >= commonLength; i--) {
      el.removeChild(el.childNodes[i]);
    }
  }
}

/**
 * Unmount a virtual node from the DOM
 */
export function unmount(vnode: VNode): void {
  if (vnode.el && vnode.el.parentElement) {
    vnode.el.parentElement.removeChild(vnode.el);
  }
}
