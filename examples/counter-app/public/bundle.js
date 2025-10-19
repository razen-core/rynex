// ../../dist/runtime/state.js
var currentComponent = null;
var currentEffect = null;
var componentStates = /* @__PURE__ */ new WeakMap();
var ReactiveState = class {
  constructor(initialValue) {
    this._value = initialValue;
    this._subscribers = /* @__PURE__ */ new Set();
  }
  get value() {
    if (currentEffect) {
      this._subscribers.add(currentEffect);
    }
    return this._value;
  }
  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notify();
    }
  }
  _notify() {
    const subscribers = Array.from(this._subscribers);
    queueMicrotask(() => {
      subscribers.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.error("Error in state subscriber:", error);
        }
      });
    });
  }
  cleanup() {
    this._subscribers.clear();
  }
};
function state(initialValue) {
  const reactiveState = new ReactiveState(initialValue);
  const getter = () => reactiveState.value;
  const setter = (newValue) => {
    reactiveState.value = typeof newValue === "function" ? newValue(reactiveState.value) : newValue;
  };
  if (currentComponent) {
    if (!componentStates.has(currentComponent)) {
      componentStates.set(currentComponent, []);
    }
    componentStates.get(currentComponent).push(reactiveState);
  }
  return [getter, setter];
}
function setCurrentComponent(component) {
  currentComponent = component;
}
function cleanupComponent(component) {
  const states = componentStates.get(component);
  if (states) {
    states.forEach((state2) => state2.cleanup());
    componentStates.delete(component);
  }
}

// ../../dist/runtime/vdom.js
function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: normalizeChildren(children),
    key: props?.key
  };
}
function normalizeChildren(children) {
  return children.flat(Infinity).filter((child) => {
    return child !== null && child !== void 0 && child !== false && child !== true;
  });
}
function mount(vnode, container) {
  const el = createElement(vnode);
  vnode.el = el;
  container.appendChild(el);
}
function createElement(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }
  if (typeof vnode.type === "function") {
    const componentVNode = vnode.type(vnode.props);
    return createElement(componentVNode);
  }
  const el = document.createElement(vnode.type);
  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      setAttribute(el, key, value);
    }
  }
  if (vnode.children) {
    vnode.children.forEach((child) => {
      if (child) {
        const childEl = createElement(child);
        el.appendChild(childEl);
      }
    });
  }
  return el;
}
function setAttribute(el, key, value) {
  if (key.startsWith("on") && typeof value === "function") {
    const eventName = key.slice(2).toLowerCase();
    el.addEventListener(eventName, value);
  } else if (key === "class" || key === "className") {
    el.className = value;
  } else if (key === "style") {
    if (typeof value === "string") {
      el.setAttribute("style", value);
    } else if (typeof value === "object") {
      Object.assign(el.style, value);
    }
  } else if (key === "value") {
    el.value = value;
  } else if (key === "checked") {
    el.checked = value;
  } else if (key !== "key") {
    el.setAttribute(key, value);
  }
}
function removeAttribute(el, key, oldValue) {
  if (key.startsWith("on") && typeof oldValue === "function") {
    const eventName = key.slice(2).toLowerCase();
    el.removeEventListener(eventName, oldValue);
  } else if (key === "class" || key === "className") {
    el.className = "";
  } else if (key === "style") {
    el.removeAttribute("style");
  } else if (key !== "key") {
    el.removeAttribute(key);
  }
}
function patch(oldVNode, newVNode) {
  if (!oldVNode.el)
    return;
  if (oldVNode.type !== newVNode.type) {
    const parent = oldVNode.el.parentElement;
    if (parent) {
      const newEl = createElement(newVNode);
      newVNode.el = newEl;
      parent.replaceChild(newEl, oldVNode.el);
    }
    return;
  }
  newVNode.el = oldVNode.el;
  const oldProps = oldVNode.props || {};
  const newProps = newVNode.props || {};
  for (const key in oldProps) {
    if (!(key in newProps)) {
      removeAttribute(oldVNode.el, key, oldProps[key]);
    }
  }
  for (const key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      setAttribute(oldVNode.el, key, newProps[key]);
    }
  }
  patchChildren(oldVNode, newVNode);
}
function patchChildren(oldVNode, newVNode) {
  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const el = oldVNode.el;
  const commonLength = Math.min(oldChildren.length, newChildren.length);
  for (let i = 0; i < commonLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    if (typeof oldChild === "string" || typeof oldChild === "number") {
      if (typeof newChild === "string" || typeof newChild === "number") {
        if (oldChild !== newChild) {
          el.childNodes[i].textContent = String(newChild);
        }
      } else {
        const newEl = createElement(newChild);
        el.replaceChild(newEl, el.childNodes[i]);
      }
    } else if (typeof newChild === "string" || typeof newChild === "number") {
      const textNode = document.createTextNode(String(newChild));
      el.replaceChild(textNode, el.childNodes[i]);
    } else {
      patch(oldChild, newChild);
    }
  }
  if (newChildren.length > oldChildren.length) {
    for (let i = commonLength; i < newChildren.length; i++) {
      const child = newChildren[i];
      if (child) {
        const childEl = createElement(child);
        el.appendChild(childEl);
      }
    }
  }
  if (oldChildren.length > newChildren.length) {
    for (let i = oldChildren.length - 1; i >= commonLength; i--) {
      el.removeChild(el.childNodes[i]);
    }
  }
}
function unmount(vnode) {
  if (vnode.el && vnode.el.parentElement) {
    vnode.el.parentElement.removeChild(vnode.el);
  }
}

// ../../dist/runtime/renderer.js
var componentInstances = /* @__PURE__ */ new WeakMap();
function render(component, container) {
  const instance = {
    vnode: null,
    el: null,
    update: () => {
    },
    unmount: () => {
    }
  };
  const update = () => {
    setCurrentComponent(instance);
    try {
      const newVNode = component({});
      if (!instance.vnode) {
        mount(newVNode, container);
        instance.vnode = newVNode;
        instance.el = newVNode.el;
      } else {
        patch(instance.vnode, newVNode);
        instance.vnode = newVNode;
      }
    } catch (error) {
      console.error("Error rendering component:", error);
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
  update();
  componentInstances.set(component, instance);
  return instance;
}

// ../../dist/runtime/helpers.js
function vbox(props, children) {
  const style = {
    display: "flex",
    flexDirection: "column",
    ...typeof props.style === "object" ? props.style : {}
  };
  return h("div", { ...props, style }, ...children);
}
function hbox(props, children) {
  const style = {
    display: "flex",
    flexDirection: "row",
    ...typeof props.style === "object" ? props.style : {}
  };
  return h("div", { ...props, style }, ...children);
}
function text(props, content) {
  if (typeof props === "string") {
    return h("span", {}, props);
  }
  return h("span", props, content || "");
}
function button(props, content) {
  return h("button", props, content);
}
function input(props) {
  return h("input", props);
}

// src/components/Header.ts
function Header(props) {
  return hbox({ class: "header" }, [
    text({ class: "title" }, props.title)
  ]);
}

// src/components/Footer.ts
function Footer() {
  return hbox({ class: "footer" }, [
    text({}, "Built with ZenWeb \u{1F9D8}")
  ]);
}

// src/App.ts
function App() {
  const [count, setCount] = state(0);
  const [name, setName] = state("");
  return vbox({ class: "app-container" }, [
    Header({ title: "Welcome to ZenWeb 2" }),
    vbox({ class: "main-content" }, [
      text({ class: "greeting" }, `Hello, ${name() || "Guest"}!`),
      input({
        placeholder: "Enter your name",
        value: name(),
        onInput: (e) => setName(e.target.value)
      }),
      hbox({ class: "counter-section" }, [
        button({ onClick: () => setCount(count() - 1) }, "Decrement"),
        text({ class: "count-display" }, `Count: ${count()}`),
        button({ onClick: () => setCount(count() + 1) }, "Increment")
      ]),
      button({
        class: "reset-btn",
        onClick: () => {
          setCount(0);
          setName("");
        }
      }, "Reset All")
    ]),
    Footer()
  ]);
}

// src/index.ts
var root = document.getElementById("root");
if (root) {
  render(App, root);
}
//# sourceMappingURL=bundle.js.map
