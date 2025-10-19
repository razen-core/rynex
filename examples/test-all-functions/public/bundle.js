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
    if (currentComponent && currentComponent.update) {
      currentComponent.update();
    }
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
function mount(vnode, container3) {
  const el = createElement(vnode);
  vnode.el = el;
  container3.appendChild(el);
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
function render(component, container3) {
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
        mount(newVNode, container3);
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

// ../../dist/runtime/helpers/layout.js
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
function grid(props, children) {
  const { columns = 1, gap = "1rem", ...restProps } = props;
  const style = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    ...typeof restProps.style === "object" ? restProps.style : {}
  };
  return h("div", { ...restProps, style }, ...children);
}
function center(props, children) {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...typeof props.style === "object" ? props.style : {}
  };
  return h("div", { ...props, style }, ...children);
}
function scroll(props, children) {
  const style = {
    overflow: "auto",
    ...typeof props.style === "object" ? props.style : {}
  };
  return h("div", { ...props, style }, ...children);
}

// ../../dist/runtime/helpers/basic_elements.js
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

// ../../dist/runtime/helpers/typography.js
function h1(props, content) {
  return h("h1", props, content);
}
function h2(props, content) {
  return h("h2", props, content);
}
function h3(props, content) {
  return h("h3", props, content);
}
function strong(props, content) {
  return h("strong", props, content);
}
function em(props, content) {
  return h("em", props, content);
}
function code(props, content) {
  return h("code", props, content);
}

// ../../dist/runtime/helpers/forms.js
function form(props, children) {
  return h("form", props, ...children);
}
function textarea(props, content) {
  return h("textarea", props, content || "");
}
function select(props, children) {
  return h("select", props, ...children);
}
function option(props, content) {
  return h("option", props, content);
}
function checkbox(props) {
  return h("input", { ...props, type: "checkbox" });
}

// ../../dist/runtime/helpers/semantic.js
function header(props, children) {
  return h("header", props, ...children);
}
function footer(props, children) {
  return h("footer", props, ...children);
}
function section(props, children) {
  return h("section", props, ...children);
}

// ../../dist/runtime/helpers/table.js
function table(props, children) {
  return h("table", props, ...children);
}
function thead(props, children) {
  return h("thead", props, ...children);
}
function tbody(props, children) {
  return h("tbody", props, ...children);
}
function tr(props, children) {
  return h("tr", props, ...children);
}
function th(props, content) {
  return h("th", props, content);
}
function td(props, content) {
  return h("td", props, content);
}

// ../../dist/runtime/helpers/utilities.js
function show(condition, content) {
  return condition ? content : null;
}

// src/App.ts
function App() {
  const [count, setCount] = state(0);
  const [name, setName] = state("");
  const [checked, setChecked] = state(false);
  const [selected, setSelected] = state("option1");
  const [showSection, setShowSection] = state(true);
  return vbox({ class: "app" }, [
    header({ class: "header" }, [
      h1({}, "ZenWeb - All Functions Test")
    ]),
    scroll({ class: "content" }, [
      // State Management Test
      section({ class: "test-section" }, [
        h2({}, "State Management"),
        vbox({ class: "test-box" }, [
          text({}, `Count: ${count()}`),
          hbox({ class: "button-group" }, [
            button({ onClick: () => setCount(count() - 1) }, "Decrement"),
            button({ onClick: () => setCount(count() + 1) }, "Increment"),
            button({ onClick: () => setCount(0) }, "Reset")
          ])
        ])
      ]),
      // Layout Helpers Test
      section({ class: "test-section" }, [
        h2({}, "Layout Helpers"),
        vbox({ class: "test-box" }, [
          h3({}, "VBox (Vertical)"),
          vbox({ class: "demo-vbox" }, [
            text({}, "Item 1"),
            text({}, "Item 2"),
            text({}, "Item 3")
          ]),
          h3({}, "HBox (Horizontal)"),
          hbox({ class: "demo-hbox" }, [
            text({}, "Item 1"),
            text({}, "Item 2"),
            text({}, "Item 3")
          ]),
          h3({}, "Grid"),
          grid({ columns: 3, gap: "1rem", class: "demo-grid" }, [
            text({}, "Cell 1"),
            text({}, "Cell 2"),
            text({}, "Cell 3"),
            text({}, "Cell 4"),
            text({}, "Cell 5"),
            text({}, "Cell 6")
          ]),
          h3({}, "Center"),
          center({ class: "demo-center" }, [
            text({}, "Centered Content")
          ])
        ])
      ]),
      // Form Elements Test
      section({ class: "test-section" }, [
        h2({}, "Form Elements"),
        form({ class: "test-box", onSubmit: (e) => {
          e.preventDefault();
        } }, [
          vbox({ class: "form-group" }, [
            text({}, "Name:"),
            input({
              type: "text",
              value: name(),
              onInput: (e) => setName(e.target.value),
              placeholder: "Enter your name"
            }),
            text({}, `Hello, ${name() || "Guest"}!`)
          ]),
          vbox({ class: "form-group" }, [
            text({}, "Checkbox:"),
            checkbox({
              checked: checked(),
              onChange: (e) => setChecked(e.target.checked)
            }),
            text({}, `Checked: ${checked()}`)
          ]),
          vbox({ class: "form-group" }, [
            text({}, "Select:"),
            select({
              value: selected(),
              onChange: (e) => setSelected(e.target.value)
            }, [
              option({ value: "option1" }, "Option 1"),
              option({ value: "option2" }, "Option 2"),
              option({ value: "option3" }, "Option 3")
            ]),
            text({}, `Selected: ${selected()}`)
          ]),
          vbox({ class: "form-group" }, [
            text({}, "Textarea:"),
            textarea({ placeholder: "Enter text...", rows: 4 })
          ])
        ])
      ]),
      // Typography Test
      section({ class: "test-section" }, [
        h2({}, "Typography"),
        vbox({ class: "test-box" }, [
          h1({}, "Heading 1"),
          h2({}, "Heading 2"),
          h3({}, "Heading 3"),
          text({}, "Regular text"),
          strong({}, "Bold text"),
          em({}, "Italic text"),
          code({}, "Code text"),
          text({}, "Text with "),
          strong({}, "bold"),
          text({}, " and "),
          em({}, "italic")
        ])
      ]),
      // Table Test
      section({ class: "test-section" }, [
        h2({}, "Table"),
        table({ class: "test-table" }, [
          thead({}, [
            tr({}, [
              th({}, "Name"),
              th({}, "Age"),
              th({}, "City")
            ])
          ]),
          tbody({}, [
            tr({}, [
              td({}, "John"),
              td({}, "25"),
              td({}, "New York")
            ]),
            tr({}, [
              td({}, "Jane"),
              td({}, "30"),
              td({}, "London")
            ]),
            tr({}, [
              td({}, "Bob"),
              td({}, "35"),
              td({}, "Paris")
            ])
          ])
        ])
      ]),
      // Conditional Rendering Test
      section({ class: "test-section" }, [
        h2({}, "Conditional Rendering"),
        vbox({ class: "test-box" }, [
          button({
            onClick: () => setShowSection(!showSection())
          }, showSection() ? "Hide Section" : "Show Section"),
          show(
            showSection(),
            vbox({ class: "conditional-content" }, [
              text({}, "This content is conditionally rendered!"),
              text({}, `Current count: ${count()}`)
            ])
          )
        ])
      ])
    ]),
    footer({ class: "footer" }, [
      text({}, "ZenWeb Framework - All Functions Working!")
    ])
  ]);
}

// src/index.ts
var root = document.getElementById("root");
if (root) {
  render(App, root);
}
//# sourceMappingURL=bundle.js.map
