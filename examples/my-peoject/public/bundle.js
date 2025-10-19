// ../../dist/runtime/debug.js
var debugEnabled = false;
function enableDebug() {
  debugEnabled = true;
  console.log("[ZenWeb Debug] Debugging enabled");
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
  const hasDebugStorage = localStorage.getItem("zenweb-debug") === "true";
  if (hasDebugParam || hasDebugStorage) {
    enableDebug();
  }
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
function createTextNode(text3) {
  return document.createTextNode(String(text3));
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
function mount(element, container2) {
  container2.appendChild(element);
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
function render(component, container2, props = {}) {
  const instance = {
    element: null,
    container: container2,
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
        mount(newElement, container2);
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
function container(props, ...children) {
  return createElement("div", props, ...children);
}
function scroll(props, ...children) {
  const style = {
    overflow: "auto",
    ...typeof props.style === "object" ? props.style : {}
  };
  return createElement("div", { ...props, style }, ...children);
}

// ../../dist/runtime/helpers/basic_elements.js
function p(props, ...content) {
  return createElement("p", props, ...content);
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

// ../../dist/runtime/helpers/semantic.js
function header(props, ...children) {
  return createElement("header", props, ...children);
}
function section(props, ...children) {
  return createElement("section", props, ...children);
}

// src/App.ts
function App() {
  return container(
    { class: "name" },
    header({ className: "hello" }, [
      h1({}, "Prathmesh"),
      h2({}, "barot")
    ]),
    scroll({}, [
      section({}, [
        grid({}, [
          h3({}, "The Owner"),
          p({}, "I am the ower of this store")
        ])
      ])
    ])
  );
}

// src/index.ts
var root = document.getElementById("root");
if (root) {
  render(App, root);
}
//# sourceMappingURL=bundle.js.map
