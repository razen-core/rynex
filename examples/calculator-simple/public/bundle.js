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
function vbox(props, ...children) {
  const style2 = {
    display: "flex",
    flexDirection: "column",
    ...typeof props.style === "object" ? props.style : {}
  };
  return createElement("div", { ...props, style: style2 }, ...children);
}
function hbox(props, ...children) {
  const style2 = {
    display: "flex",
    flexDirection: "row",
    ...typeof props.style === "object" ? props.style : {}
  };
  return createElement("div", { ...props, style: style2 }, ...children);
}
function center(props, ...children) {
  const style2 = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...typeof props.style === "object" ? props.style : {}
  };
  return createElement("div", { ...props, style: style2 }, ...children);
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

// src/App.ts
function Calculator() {
  const $2 = state({
    display: "0",
    current: "",
    operator: "",
    previous: ""
  });
  const clear = () => {
    $2.display = "0";
    $2.current = "";
    $2.operator = "";
    $2.previous = "";
  };
  const appendNumber = (num) => {
    if ($2.display === "0")
      $2.display = num;
    else
      $2.display += num;
    $2.current = $2.display;
  };
  const setOperator = (op) => {
    $2.operator = op;
    $2.previous = $2.current;
    $2.display = "0";
    $2.current = "";
  };
  const calculate = () => {
    const prev = parseFloat($2.previous);
    const curr = parseFloat($2.current);
    let result = 0;
    if ($2.operator === "+")
      result = prev + curr;
    if ($2.operator === "-")
      result = prev - curr;
    if ($2.operator === "\xD7")
      result = prev * curr;
    if ($2.operator === "\xF7")
      result = prev / curr;
    $2.display = String(result);
    $2.current = String(result);
    $2.operator = "";
  };
  const display = text($2.display);
  effect(() => {
    display.textContent = $2.display;
  });
  return center(
    { style: { height: "100vh", background: "#1a1a2e" } },
    vbox(
      { class: "calculator" },
      display,
      hbox(
        { class: "row" },
        button({ onClick: clear }, "C"),
        button({ onClick: () => appendNumber("0") }, "0"),
        button({ onClick: () => $2.display = $2.display.slice(0, -1) || "0" }, "\u232B"),
        button({ onClick: () => setOperator("\xF7") }, "\xF7")
      ),
      hbox(
        { class: "row" },
        button({ onClick: () => appendNumber("7") }, "7"),
        button({ onClick: () => appendNumber("8") }, "8"),
        button({ onClick: () => appendNumber("9") }, "9"),
        button({ onClick: () => setOperator("\xD7") }, "\xD7")
      ),
      hbox(
        { class: "row" },
        button({ onClick: () => appendNumber("4") }, "4"),
        button({ onClick: () => appendNumber("5") }, "5"),
        button({ onClick: () => appendNumber("6") }, "6"),
        button({ onClick: () => setOperator("-") }, "-")
      ),
      hbox(
        { class: "row" },
        button({ onClick: () => appendNumber("1") }, "1"),
        button({ onClick: () => appendNumber("2") }, "2"),
        button({ onClick: () => appendNumber("3") }, "3"),
        button({ onClick: () => setOperator("+") }, "+")
      ),
      hbox(
        { class: "row" },
        button({ onClick: () => appendNumber(".") }, "."),
        button({ onClick: calculate, class: "equals" }, "=")
      )
    )
  );
}
var style = document.createElement("style");
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  .calculator {
    background: #16213e;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    gap: 10px;
    width: 320px;
  }
  
  .calculator > span:first-child {
    background: #0f3460;
    color: #fff;
    font-size: 2.5rem;
    padding: 20px;
    text-align: right;
    border-radius: 10px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: 'Courier New', monospace;
  }
  
  .row {
    gap: 10px;
  }
  
  .row button {
    flex: 1;
    padding: 25px;
    font-size: 1.5rem;
    border: none;
    border-radius: 10px;
    background: #533483;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }
  
  .row button:hover {
    background: #6c4a9e;
    transform: scale(1.05);
  }
  
  .row button:active {
    transform: scale(0.95);
  }
  
  .equals {
    flex: 2 !important;
    background: #e94560 !important;
  }
  
  .equals:hover {
    background: #ff5577 !important;
  }
`;
document.head.appendChild(style);

// src/index.ts
render(Calculator, document.getElementById("root"));
//# sourceMappingURL=bundle.js.map
