/**
 * Rynex Renderer
 * Main rendering engine using vanilla JavaScript (no VDOM)
 */

import { mount, unmount, replaceChildren } from './dom.js';
import { subscribe } from './state.js';
import { debugLog } from './debug.js';

export interface ComponentInstance {
  element: HTMLElement | null;
  container: HTMLElement | null;
  update: () => void;
  unmount: () => void;
  unsubscribe?: () => void;
}

const componentInstances = new WeakMap<Function, ComponentInstance>();
let renderCounter = 0;

/**
 * Render a component to a container element
 * Component should return an HTMLElement
 */
export function render(component: Function, container: HTMLElement, props: any = {}): ComponentInstance {
  const instance: ComponentInstance = {
    element: null,
    container,
    update: () => {},
    unmount: () => {}
  };

  const update = () => {
    const renderId = ++renderCounter;
    debugLog('Renderer', `Render #${renderId} starting`);
    
    try {
      // Execute component function to get DOM element
      const newElement = component(props) as HTMLElement;
      debugLog('Renderer', `Render #${renderId} component executed`);

      if (!instance.element) {
        // Initial mount
        debugLog('Renderer', `Render #${renderId} initial mount`);
        mount(newElement, container);
        instance.element = newElement;
      } else {
        // Update - replace old element with new one
        debugLog('Renderer', `Render #${renderId} updating DOM`);
        if (instance.element.parentElement) {
          instance.element.parentElement.replaceChild(newElement, instance.element);
        }
        instance.element = newElement;
      }
      debugLog('Renderer', `Render #${renderId} complete`);
    } catch (error) {
      console.error('Error rendering component:', error);
    }
  };

  const unmountFn = () => {
    if (instance.element) {
      unmount(instance.element);
      instance.element = null;
    }
    if (instance.unsubscribe) {
      instance.unsubscribe();
    }
  };

  instance.update = update;
  instance.unmount = unmountFn;

  // Initial render
  update();

  componentInstances.set(component, instance);
  return instance;
}

/**
 * Create a component that auto-updates when state changes
 */
export function createComponent(component: Function, stateObj?: any, props: any = {}): HTMLElement {
  const element = component(props) as HTMLElement;
  
  // If state object provided, subscribe to changes and re-render
  if (stateObj && stateObj.__listeners) {
    const container = document.createElement('div');
    container.appendChild(element);
    
    subscribe(stateObj, () => {
      const newElement = component(props) as HTMLElement;
      replaceChildren(container, [newElement]);
    });
    
    return container;
  }
  
  return element;
}

/**
 * Mount a component and return cleanup function
 */
export function mountComponent(component: Function, container: HTMLElement, props: any = {}): () => void {
  const instance = render(component, container, props);
  return () => instance.unmount();
}
