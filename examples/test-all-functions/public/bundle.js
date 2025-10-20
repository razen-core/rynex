// ../../dist/runtime/debug.js
var debugEnabled = false;
function enableDebug() {
  debugEnabled = true;
  console.log("[Rynex Debug] Debugging enabled");
}
function debugLog(category, message, data) {
  if (debugEnabled) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[1].split(".")[0];
    console.log(`[${timestamp}] [DEBUG:${category}] ${message}`, data || "");
  }
}
if (typeof window !== "undefined") {
  const urlParams = new URLSearchParams(window.location.search);
  const hasDebugParam = urlParams.get("debug") === "true";
  const hasDebugStorage = localStorage.getItem("rynex-debug") === "true";
  if (hasDebugParam || hasDebugStorage) {
    enableDebug();
  }
}

// ../../dist/runtime/state.js
var currentEffect = null;
var effectDependencies = /* @__PURE__ */ new WeakMap();
function state(initialState) {
  const listeners = /* @__PURE__ */ new Set();
  const dependencies = /* @__PURE__ */ new Map();
  const handler = {
    get(target, prop, receiver) {
      if (currentEffect) {
        if (!dependencies.has(prop)) {
          dependencies.set(prop, /* @__PURE__ */ new Set());
        }
        dependencies.get(prop).add(currentEffect);
        if (!effectDependencies.has(currentEffect)) {
          effectDependencies.set(currentEffect, /* @__PURE__ */ new Set());
        }
        effectDependencies.get(currentEffect).add(target);
        debugLog("State", `Tracking dependency: ${String(prop)}`);
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const oldValue = Reflect.get(target, prop, receiver);
      if (Object.is(oldValue, value)) {
        return true;
      }
      const result = Reflect.set(target, prop, value, receiver);
      if (result) {
        debugLog("State", `Property ${String(prop)} changed from ${oldValue} to ${value}`);
        const propEffects = dependencies.get(prop);
        if (propEffects) {
          propEffects.forEach((effect2) => {
            queueMicrotask(() => {
              try {
                effect2();
              } catch (error) {
                console.error("Error in effect:", error);
              }
            });
          });
        }
        listeners.forEach((listener) => {
          queueMicrotask(() => {
            try {
              listener();
            } catch (error) {
              console.error("Error in listener:", error);
            }
          });
        });
      }
      return result;
    }
  };
  const proxy = new Proxy(initialState, handler);
  proxy.__listeners = listeners;
  return proxy;
}
function effect(effectFn) {
  const wrappedEffect = () => {
    const oldEffect = currentEffect;
    currentEffect = wrappedEffect;
    try {
      effectFn();
    } finally {
      currentEffect = oldEffect;
    }
  };
  wrappedEffect();
  return () => {
    const deps = effectDependencies.get(wrappedEffect);
    if (deps) {
      deps.clear();
      effectDependencies.delete(wrappedEffect);
    }
  };
}

// ../../dist/runtime/dom.js
function createElement(tag, props = null, ...children) {
  const element = document.createElement(tag);
  if (props) {
    applyProps(element, props);
  }
  appendChildren(element, children);
  debugLog("DOM", `Created element: ${tag}`);
  return element;
}
function createTextNode(text2) {
  return document.createTextNode(String(text2));
}
function applyProps(element, props) {
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === void 0) {
      continue;
    }
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
      debugLog("DOM", `Added event listener: ${eventName}`);
    } else if (key === "class" || key === "className") {
      element.className = value;
    } else if (key === "style") {
      if (typeof value === "string") {
        element.setAttribute("style", value);
      } else if (typeof value === "object") {
        Object.assign(element.style, value);
      }
    } else if (key === "ref" && typeof value === "object" && "current" in value) {
      value.current = element;
    } else if (key === "value") {
      element.value = value;
    } else if (key === "checked") {
      element.checked = value;
    } else if (key.startsWith("data-")) {
      element.setAttribute(key, String(value));
    } else if (key.startsWith("aria-")) {
      element.setAttribute(key, String(value));
    } else {
      element.setAttribute(key, String(value));
    }
  }
}
function appendChildren(parent, children) {
  const flatChildren = children.flat(Infinity);
  for (const child of flatChildren) {
    if (child === null || child === void 0 || child === false || child === true) {
      continue;
    }
    if (typeof child === "string" || typeof child === "number") {
      parent.appendChild(createTextNode(child));
    } else if (child instanceof HTMLElement || child instanceof Text) {
      parent.appendChild(child);
    }
  }
}
function mount(element, container3) {
  container3.appendChild(element);
  debugLog("DOM", "Mounted element to container");
}
function unmount(element) {
  if (element.parentElement) {
    element.parentElement.removeChild(element);
    debugLog("DOM", "Unmounted element");
  }
}

// ../../dist/runtime/renderer.js
var componentInstances = /* @__PURE__ */ new WeakMap();
var renderCounter = 0;
function render(component, container3, props = {}) {
  const instance = {
    element: null,
    container: container3,
    update: () => {
    },
    unmount: () => {
    }
  };
  const update = () => {
    const renderId = ++renderCounter;
    debugLog("Renderer", `Render #${renderId} starting`);
    try {
      const newElement = component(props);
      debugLog("Renderer", `Render #${renderId} component executed`);
      if (!instance.element) {
        debugLog("Renderer", `Render #${renderId} initial mount`);
        mount(newElement, container3);
        instance.element = newElement;
      } else {
        debugLog("Renderer", `Render #${renderId} updating DOM`);
        if (instance.element.parentElement) {
          instance.element.parentElement.replaceChild(newElement, instance.element);
        }
        instance.element = newElement;
      }
      debugLog("Renderer", `Render #${renderId} complete`);
    } catch (error) {
      console.error("Error rendering component:", error);
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
  update();
  componentInstances.set(component, instance);
  return instance;
}

// ../../dist/runtime/helpers/layout.js
function vbox(props, ...children) {
  const style = {
    display: "flex",
    flexDirection: "column",
    ...typeof props.style === "object" ? props.style : {}
  };
  return createElement("div", { ...props, style }, ...children);
}
function hbox(props, ...children) {
  const style = {
    display: "flex",
    flexDirection: "row",
    ...typeof props.style === "object" ? props.style : {}
  };
  return createElement("div", { ...props, style }, ...children);
}
function grid(props, ...children) {
  const { columns = 1, gap = "1rem", ...restProps } = props;
  const style = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    ...typeof restProps.style === "object" ? restProps.style : {}
  };
  return createElement("div", { ...restProps, style }, ...children);
}
function center(props, ...children) {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...typeof props.style === "object" ? props.style : {}
  };
  return createElement("div", { ...props, style }, ...children);
}
function scroll(props, ...children) {
  const style = {
    overflow: "auto",
    ...typeof props.style === "object" ? props.style : {}
  };
  return createElement("div", { ...props, style }, ...children);
}

// ../../dist/runtime/helpers/basic_elements.js
function text(props, content) {
  if (typeof props === "string") {
    return createElement("span", {}, props);
  }
  return createElement("span", props, content || "");
}
function button(props, ...content) {
  return createElement("button", props, ...content);
}
function input(props) {
  return createElement("input", props);
}

// ../../dist/runtime/helpers/typography.js
function h1(props, ...content) {
  return createElement("h1", props, ...content);
}
function h2(props, ...content) {
  return createElement("h2", props, ...content);
}
function h3(props, ...content) {
  return createElement("h3", props, ...content);
}
function strong(props, ...content) {
  return createElement("strong", props, ...content);
}
function em(props, ...content) {
  return createElement("em", props, ...content);
}
function code(props, ...content) {
  return createElement("code", props, ...content);
}

// ../../dist/runtime/helpers/forms.js
function form(props, ...children) {
  return createElement("form", props, ...children);
}
function textarea(props, content) {
  return createElement("textarea", props, content || "");
}
function select(props, ...children) {
  return createElement("select", props, ...children);
}
function option(props, ...content) {
  return createElement("option", props, ...content);
}
function checkbox(props) {
  return createElement("input", { ...props, type: "checkbox" });
}

// ../../dist/runtime/helpers/semantic.js
function header(props, ...children) {
  return createElement("header", props, ...children);
}
function footer(props, ...children) {
  return createElement("footer", props, ...children);
}
function section(props, ...children) {
  return createElement("section", props, ...children);
}

// ../../dist/runtime/helpers/table.js
function table(props, ...children) {
  return createElement("table", props, ...children);
}
function thead(props, ...children) {
  return createElement("thead", props, ...children);
}
function tbody(props, ...children) {
  return createElement("tbody", props, ...children);
}
function tr(props, ...children) {
  return createElement("tr", props, ...children);
}
function th(props, ...content) {
  return createElement("th", props, ...content);
}
function td(props, ...content) {
  return createElement("td", props, ...content);
}

// src/App.ts
function App() {
  const appState = state({
    count: 0,
    name: "",
    checked: false,
    selected: "option1",
    showSection: true
  });
  const countDisplay = text(`Count: ${appState.count}`);
  const nameDisplay = text(`Hello, ${appState.name || "Guest"}!`);
  const checkedDisplay = text(`Checked: ${appState.checked}`);
  const selectedDisplay = text(`Selected: ${appState.selected}`);
  const countInConditional = text(`Current count: ${appState.count}`);
  const toggleButton = button({
    onClick: () => appState.showSection = !appState.showSection
  }, appState.showSection ? "Hide Section" : "Show Section");
  const conditionalContent = vbox(
    { class: "conditional-content", style: { display: appState.showSection ? "" : "none" } },
    text("This content is conditionally rendered!"),
    countInConditional
  );
  effect(() => {
    countDisplay.textContent = `Count: ${appState.count}`;
    nameDisplay.textContent = `Hello, ${appState.name || "Guest"}!`;
    checkedDisplay.textContent = `Checked: ${appState.checked}`;
    selectedDisplay.textContent = `Selected: ${appState.selected}`;
    countInConditional.textContent = `Current count: ${appState.count}`;
    toggleButton.textContent = appState.showSection ? "Hide Section" : "Show Section";
    conditionalContent.style.display = appState.showSection ? "" : "none";
  });
  return vbox(
    { class: "app" },
    header({ class: "header" }, [
      h1({}, "Rynex - All Functions Test")
    ]),
    scroll({ class: "content" }, [
      // State Management Test
      section({ class: "test-section" }, [
        h2({}, "State Management"),
        vbox({ class: "test-box" }, [
          countDisplay,
          hbox({ class: "button-group" }, [
            button({ onClick: () => appState.count-- }, "Decrement"),
            button({ onClick: () => appState.count++ }, "Increment"),
            button({ onClick: () => appState.count = 0 }, "Reset")
          ])
        ])
      ]),
      // Layout Helpers Test
      section({ class: "test-section" }, [
        h2({ class: "name", id: "name" }, "Layout Helpers"),
        vbox({ class: "test-box" }, [
          h3({}, "VBox (Vertical)"),
          hbox(
            { class: "demo-vbox" },
            text("Item 1"),
            text("Item 2"),
            text("Item 3")
          ),
          h3({}, "HBox (Horizontal)"),
          hbox(
            { class: "demo-hbox" },
            text("Item 1"),
            text("Item 2"),
            text("Item 3")
          ),
          h3({}, "Grid"),
          grid(
            { columns: 3, gap: "1rem", class: "demo-grid" },
            text("Cell 1"),
            text("Cell 2"),
            text("Cell 3"),
            text("Cell 4"),
            text("Cell 5"),
            text("Cell 6")
          ),
          h3({}, "Center"),
          center(
            { class: "demo-center" },
            text("Centered Content")
          )
        ])
      ]),
      // Form Elements Test
      section({ class: "test-section" }, [
        h2({}, "Form Elements"),
        form(
          { class: "test-box", onSubmit: (e) => {
            e.preventDefault();
          } },
          vbox(
            { class: "form-group" },
            text("Name:"),
            input({
              type: "text",
              value: appState.name,
              onInput: (e) => appState.name = e.target.value,
              placeholder: "Enter your name"
            }),
            nameDisplay
          ),
          vbox(
            { class: "form-group" },
            text("Checkbox:"),
            checkbox({
              checked: appState.checked,
              onChange: (e) => appState.checked = e.target.checked
            }),
            checkedDisplay
          ),
          vbox(
            { class: "form-group" },
            text("Select:"),
            select(
              {
                value: appState.selected,
                onChange: (e) => appState.selected = e.target.value
              },
              option({ value: "option1" }, "Option 1"),
              option({ value: "option2" }, "Option 2"),
              option({ value: "option3" }, "Option 3")
            ),
            selectedDisplay
          ),
          vbox(
            { class: "form-group" },
            text("Textarea:"),
            textarea({ placeholder: "Enter text...", rows: 4 })
          )
        )
      ]),
      // Typography Test
      section({ class: "test-section" }, [
        h2({}, "Typography"),
        vbox(
          { class: "test-box" },
          h1({}, "Heading 1"),
          h2({}, "Heading 2"),
          h3({}, "Heading 3"),
          text("Regular text"),
          strong({}, "Bold text"),
          em({}, "Italic text"),
          code({}, "Code text"),
          text("Text with "),
          strong({}, "bold"),
          text(" and "),
          em({}, "italic")
        )
      ]),
      // Table Test
      section({ class: "test-section" }, [
        h2({}, "Table"),
        table(
          { class: "test-table" },
          thead(
            {},
            tr(
              {},
              th({}, "Name"),
              th({}, "Age"),
              th({}, "City")
            )
          ),
          tbody(
            {},
            tr(
              {},
              td({}, "John"),
              td({}, "25"),
              td({}, "New York")
            ),
            tr(
              {},
              td({}, "Jane"),
              td({}, "30"),
              td({}, "London")
            ),
            tr(
              {},
              td({}, "Bob"),
              td({}, "35"),
              td({}, "Paris")
            )
          )
        )
      ]),
      // Conditional Rendering Test
      section({ class: "test-section" }, [
        h2({}, "Conditional Rendering"),
        vbox(
          { class: "test-box" },
          toggleButton,
          conditionalContent
        )
      ])
    ]),
    footer(
      { class: "footer" },
      text("Rynex Framework - Vanilla JS - All Functions Working!")
    )
  );
}

// src/index.ts
var root = document.getElementById("root");
if (root) {
  render(App, root);
}
//# sourceMappingURL=bundle.js.map
