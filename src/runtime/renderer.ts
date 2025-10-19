/**
 * ZenWeb Renderer
 * Main rendering engine that connects components to the DOM
 */

import { mount, patch, unmount } from './vdom.js';
import { setCurrentComponent, cleanupComponent } from './state.js';
import { debugLog } from './debug.js';
import type { VNode, ComponentInstance } from './types.js';

const componentInstances = new WeakMap<any, ComponentInstance>();
let renderCounter = 0;

/**
 * Render a component to a container element
 */
export function render(component: Function, container: HTMLElement): ComponentInstance {
  const instance: ComponentInstance = {
    vnode: null,
    el: null,
    update: () => {},
    unmount: () => {}
  };

  const update = () => {
    const renderId = ++renderCounter;
    debugLog('Renderer', `Render #${renderId} starting`);
    
    setCurrentComponent(instance);
    
    try {
      const newVNode = component({}) as VNode;
      debugLog('Renderer', `Render #${renderId} component executed`);

      if (!instance.vnode) {
        // Initial mount
        debugLog('Renderer', `Render #${renderId} initial mount`);
        mount(newVNode, container);
        instance.vnode = newVNode;
        instance.el = newVNode.el as HTMLElement;
      } else {
        // Update
        debugLog('Renderer', `Render #${renderId} patching DOM`);
        patch(instance.vnode, newVNode);
        instance.vnode = newVNode;
      }
      debugLog('Renderer', `Render #${renderId} complete`);
    } catch (error) {
      console.error('Error rendering component:', error);
    } finally {
      setCurrentComponent(null);
    }
  };

  const unmountFn = () => {
    if (instance.vnode) {
      unmount(instance.vnode);
      cleanupComponent(instance);
      instance.vnode = null;
      instance.el = null;
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
 * Create a component instance
 */
export function createComponent(component: Function, props: any = {}): VNode {
  setCurrentComponent(component);
  
  try {
    return component(props) as VNode;
  } finally {
    setCurrentComponent(null);
  }
}
