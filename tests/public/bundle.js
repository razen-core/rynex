// ../dist/runtime/debug.js
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
function debugWarn(category, message, data) {
  if (debugEnabled) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[1].split(".")[0];
    console.warn(`[${timestamp}] [WARN:${category}] ${message}`, data || "");
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

// ../dist/runtime/state.js
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

// ../dist/runtime/dom.js
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
        for (const [styleKey, styleValue] of Object.entries(value)) {
          if (styleValue !== null && styleValue !== void 0) {
            const cssKey = styleKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            element.style[styleKey] = styleValue;
          }
        }
      }
    } else if (key === "onHover" && typeof value === "object") {
      const hoverStyles = value;
      element.addEventListener("mouseenter", () => {
        for (const [styleKey, styleValue] of Object.entries(hoverStyles)) {
          if (styleValue !== null && styleValue !== void 0) {
            element.style[styleKey] = styleValue;
          }
        }
      });
      const originalStyles = {};
      for (const styleKey of Object.keys(hoverStyles)) {
        originalStyles[styleKey] = element.style[styleKey];
      }
      element.addEventListener("mouseleave", () => {
        for (const [styleKey, styleValue] of Object.entries(originalStyles)) {
          element.style[styleKey] = styleValue;
        }
      });
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
    } else if (child instanceof HTMLElement || child instanceof SVGElement || child instanceof Text) {
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

// ../dist/runtime/renderer.js
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

// ../dist/runtime/helpers/layout.js
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

// ../dist/runtime/helpers/basic_elements.js
function div(props, ...children) {
  return createElement("div", props, ...children);
}
function text(props, content) {
  if (typeof props === "string") {
    return createElement("span", {}, props);
  }
  if (typeof props === "function") {
    const el2 = createElement("span", {});
    effect(() => {
      el2.textContent = props();
    });
    return el2;
  }
  const el = createElement("span", props);
  if (typeof content === "function") {
    effect(() => {
      el.textContent = content();
    });
  } else if (content) {
    el.textContent = content;
  }
  return el;
}
function button(props, content) {
  const el = createElement("button", props);
  if (typeof content === "function") {
    effect(() => {
      el.textContent = content();
    });
  } else if (typeof content === "string") {
    el.textContent = content;
  } else if (content) {
    const children = Array.isArray(content) ? content : [content];
    children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        el.appendChild(child);
      }
    });
  }
  return el;
}
function input(props) {
  return createElement("input", props);
}

// ../dist/runtime/helpers/typography.js
function h2(props, ...content) {
  return createElement("h2", props, ...content);
}
function h3(props, ...content) {
  return createElement("h3", props, ...content);
}

// ../dist/runtime/helpers/utilities.js
function lazy(loader) {
  let cached = null;
  let loading = null;
  return async () => {
    if (cached) {
      return cached;
    }
    if (loading) {
      return loading.then(() => cached);
    }
    loading = loader().then((module) => {
      cached = module.default;
      loading = null;
      return cached;
    });
    return loading;
  };
}
function suspense(props, children) {
  const container2 = createElement("div", { "data-suspense": "true" });
  container2.appendChild(props.fallback);
  const loadContent = async () => {
    try {
      const content = await Promise.resolve(children());
      container2.innerHTML = "";
      container2.appendChild(content);
    } catch (error) {
      if (props.onError) {
        props.onError(error);
      } else {
        console.error("Suspense error:", error);
      }
    }
  };
  loadContent();
  return container2;
}
function errorBoundary(props, children) {
  const container2 = createElement("div", { "data-error-boundary": "true" });
  try {
    const content = typeof children === "function" ? children() : children;
    container2.appendChild(content);
    window.addEventListener("error", (event) => {
      if (container2.contains(event.target)) {
        event.preventDefault();
        const error = event.error || new Error(event.message);
        if (props.onError) {
          props.onError(error);
        }
        container2.innerHTML = "";
        container2.appendChild(props.fallback(error));
      }
    });
  } catch (error) {
    if (props.onError) {
      props.onError(error);
    }
    container2.appendChild(props.fallback(error));
  }
  return container2;
}
function memo(component, areEqual) {
  let lastProps = null;
  let lastResult = null;
  return (props) => {
    const shouldUpdate = !lastProps || (areEqual ? !areEqual(lastProps, props) : !shallowEqual(lastProps, props));
    if (shouldUpdate) {
      lastProps = { ...props };
      lastResult = component(props);
    }
    return lastResult;
  };
}
function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

// ../dist/runtime/helpers/components.js
function tabs(props) {
  const { tabs: tabsData, defaultIndex = 0, onChange, ...restProps } = props;
  let activeIndex = defaultIndex;
  const container2 = createElement("div", {
    ...restProps,
    class: `tabs ${restProps.class || ""}`,
    style: {
      display: "flex",
      flexDirection: "column",
      ...restProps.style || {}
    }
  });
  const tabHeaders = createElement("div", {
    class: "tab-headers",
    style: {
      display: "flex",
      borderBottom: "1px solid #333333",
      gap: "0.5rem"
    }
  });
  const tabContent = createElement("div", {
    class: "tab-content",
    style: {
      padding: "1rem"
    }
  });
  const updateActiveTab = (index) => {
    activeIndex = index;
    tabContent.innerHTML = "";
    tabContent.appendChild(tabsData[index].content);
    Array.from(tabHeaders.children).forEach((header2, i) => {
      const headerEl = header2;
      if (i === index) {
        headerEl.style.borderBottom = "2px solid #00ff88";
        headerEl.style.color = "#00ff88";
      } else {
        headerEl.style.borderBottom = "2px solid transparent";
        headerEl.style.color = "#b0b0b0";
      }
    });
    if (onChange) {
      onChange(index);
    }
  };
  tabsData.forEach((tab, index) => {
    const header2 = createElement("button", {
      class: "tab-header",
      style: {
        padding: "0.75rem 1rem",
        background: "transparent",
        border: "none",
        borderBottom: index === activeIndex ? "2px solid #00ff88" : "2px solid transparent",
        color: index === activeIndex ? "#00ff88" : "#b0b0b0",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "all 0.2s"
      },
      onClick: () => updateActiveTab(index),
      onMouseEnter: (e) => {
        if (index !== activeIndex) {
          e.target.style.color = "#ffffff";
        }
      },
      onMouseLeave: (e) => {
        if (index !== activeIndex) {
          e.target.style.color = "#b0b0b0";
        }
      }
    });
    header2.textContent = tab.label;
    tabHeaders.appendChild(header2);
  });
  tabContent.appendChild(tabsData[activeIndex].content);
  container2.appendChild(tabHeaders);
  container2.appendChild(tabContent);
  return container2;
}
function accordion(props) {
  const { items, allowMultiple = false, defaultOpen = [], ...restProps } = props;
  const openIndices = new Set(defaultOpen);
  const container2 = createElement("div", {
    ...restProps,
    class: `accordion ${restProps.class || ""}`,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      ...restProps.style || {}
    }
  });
  const toggleItem = (index, itemContent, icon2) => {
    const isOpen = openIndices.has(index);
    if (isOpen) {
      openIndices.delete(index);
      itemContent.style.display = "none";
      icon2.style.transform = "rotate(0deg)";
    } else {
      if (!allowMultiple) {
        openIndices.clear();
        Array.from(container2.children).forEach((child, i) => {
          const content = child.querySelector(".accordion-content");
          const itemIcon = child.querySelector(".accordion-icon");
          if (content && itemIcon) {
            content.style.display = "none";
            itemIcon.style.transform = "rotate(0deg)";
          }
        });
      }
      openIndices.add(index);
      itemContent.style.display = "block";
      icon2.style.transform = "rotate(180deg)";
    }
  };
  items.forEach((item, index) => {
    const itemContainer = createElement("div", {
      class: "accordion-item",
      style: {
        border: "1px solid #333333",
        borderRadius: "0.5rem",
        overflow: "hidden"
      }
    });
    const icon2 = createElement("span", {
      class: "accordion-icon",
      style: {
        transition: "transform 0.2s",
        transform: openIndices.has(index) ? "rotate(180deg)" : "rotate(0deg)"
      }
    });
    icon2.textContent = "\u25BC";
    const header2 = createElement("button", {
      class: "accordion-header",
      style: {
        width: "100%",
        padding: "1rem",
        background: "#0a0a0a",
        border: "none",
        color: "#ffffff",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "1rem",
        textAlign: "left"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "#1a1a1a";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "#0a0a0a";
      }
    });
    const title = createElement("span");
    title.textContent = item.title;
    header2.appendChild(title);
    header2.appendChild(icon2);
    const content = createElement("div", {
      class: "accordion-content",
      style: {
        padding: "1rem",
        display: openIndices.has(index) ? "block" : "none",
        background: "#000000"
      }
    });
    content.appendChild(item.content);
    header2.addEventListener("click", () => toggleItem(index, content, icon2));
    itemContainer.appendChild(header2);
    itemContainer.appendChild(content);
    container2.appendChild(itemContainer);
  });
  return container2;
}
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// ../dist/runtime/helpers/lifecycle.js
function onMount(element, callback) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node === element || node.contains?.(element)) {
            const cleanup = callback();
            if (cleanup && typeof cleanup === "function") {
              element.dataset.cleanup = "registered";
              element.__cleanup = cleanup;
            }
            observer.disconnect();
          }
        });
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  if (document.body.contains(element)) {
    const cleanup = callback();
    if (cleanup && typeof cleanup === "function") {
      element.dataset.cleanup = "registered";
      element.__cleanup = cleanup;
    }
    observer.disconnect();
  }
}
function onUpdate(element, callback) {
  const observer = new MutationObserver((mutations) => {
    callback(mutations);
  });
  observer.observe(element, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  });
  return () => observer.disconnect();
}
function watch(getter, callback, options) {
  let oldValue = getter();
  if (options?.immediate) {
    callback(oldValue, oldValue);
  }
  const cleanup = effect(() => {
    const newValue = getter();
    if (newValue !== oldValue) {
      callback(newValue, oldValue);
      oldValue = newValue;
    }
  });
  return cleanup;
}
function watchEffect(effectFn) {
  let cleanup;
  const wrappedEffect = () => {
    if (cleanup) {
      cleanup();
    }
    cleanup = effectFn();
  };
  const stopEffect = effect(wrappedEffect);
  return () => {
    if (cleanup) {
      cleanup();
    }
    stopEffect();
  };
}

// ../dist/runtime/helpers/performance.js
function debounce(func, wait) {
  let timeout = null;
  return function(...args) {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  };
}
function throttle(func, limit) {
  let inThrottle = false;
  let lastResult;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      lastResult = func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}
function preload(loader) {
  const promise = loader();
  if (typeof window !== "undefined") {
    window.__rynexPreloadCache = window.__rynexPreloadCache || /* @__PURE__ */ new Map();
    window.__rynexPreloadCache.set(loader, promise);
  }
  return promise;
}
function getPreloaded(loader) {
  if (typeof window !== "undefined" && window.__rynexPreloadCache) {
    return window.__rynexPreloadCache.get(loader) || null;
  }
  return null;
}

// ../dist/runtime/helpers/refs.js
function ref(initialValue = null) {
  return {
    current: initialValue
  };
}
function useRef(initialValue = null) {
  return ref(initialValue);
}
function forwardRef(component) {
  return (props) => {
    const internalRef = props.ref || ref();
    const element = component(props, internalRef);
    if (internalRef) {
      internalRef.current = element;
    }
    return element;
  };
}
function mergeRefs(...refs) {
  return (element) => {
    refs.forEach((ref2) => {
      if (!ref2)
        return;
      if (typeof ref2 === "function") {
        ref2(element);
      } else {
        ref2.current = element;
      }
    });
  };
}

// ../dist/runtime/helpers/styles.js
var currentTheme = {};
var themeListeners = /* @__PURE__ */ new Set();
function setTheme(theme) {
  currentTheme = { ...currentTheme, ...theme };
  themeListeners.forEach((listener) => listener(currentTheme));
}
function useTheme(callback) {
  callback(currentTheme);
  themeListeners.add(callback);
  return () => {
    themeListeners.delete(callback);
  };
}
function styled(tag, styles) {
  return (props, ...children) => {
    const computedStyles = typeof styles === "function" ? styles(props) : styles;
    const mergedProps = {
      ...props,
      style: {
        ...typeof props.style === "object" ? props.style : {},
        ...computedStyles
      }
    };
    return createElement(tag, mergedProps, ...children);
  };
}
function classNames(...args) {
  const classes = [];
  args.forEach((arg) => {
    if (!arg)
      return;
    if (typeof arg === "string") {
      classes.push(arg);
    } else if (typeof arg === "object") {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  });
  return classes.join(" ");
}
function mergeStyles(...styles) {
  const merged = {};
  styles.forEach((style) => {
    if (!style)
      return;
    Object.entries(style).forEach(([key, value]) => {
      if (value !== null && value !== void 0) {
        merged[key] = value;
      }
    });
  });
  return merged;
}

// ../dist/runtime/helpers/animations.js
function transition(element, config = {}) {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn("Animation", "Invalid element provided to transition");
    return element;
  }
  const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
  try {
    element.style.transition = `all ${duration}ms ${easing} ${delay}ms`;
    debugLog("Animation", `Transition applied: ${duration}ms ${easing}`);
    if (onStart) {
      onStart();
    }
    if (onEnd) {
      element.addEventListener("transitionend", () => onEnd(), { once: true });
    }
  } catch (error) {
    debugWarn("Animation", "Error applying transition:", error);
  }
  return element;
}
function animate(element, config) {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn("Animation", "Invalid element provided to animate");
    return null;
  }
  const { keyframes, duration = 300, easing = "ease", delay = 0, iterations = 1, direction = "normal", fill = "both", onStart, onEnd } = config;
  try {
    if (onStart) {
      onStart();
    }
    const animation = element.animate(keyframes, {
      duration,
      easing,
      delay,
      iterations,
      direction,
      fill
    });
    debugLog("Animation", `Animation started: ${duration}ms`);
    if (onEnd) {
      animation.onfinish = () => onEnd();
    }
    return animation;
  } catch (error) {
    debugWarn("Animation", "Error creating animation:", error);
    return null;
  }
}
function fade(element, direction = "in", config = {}) {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn("Animation", "Invalid element provided to fade");
    return null;
  }
  const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
  const currentOpacity = window.getComputedStyle(element).opacity;
  let keyframes;
  if (direction === "toggle") {
    direction = parseFloat(currentOpacity) > 0.5 ? "out" : "in";
  }
  if (direction === "in") {
    keyframes = [
      { opacity: 0 },
      { opacity: 1 }
    ];
  } else {
    keyframes = [
      { opacity: 1 },
      { opacity: 0 }
    ];
  }
  return animate(element, {
    keyframes,
    duration,
    easing,
    delay,
    onStart,
    onEnd
  });
}
function slide(element, direction = "down", config = {}) {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn("Animation", "Invalid element provided to slide");
    return null;
  }
  const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
  let keyframes;
  switch (direction) {
    case "up":
      keyframes = [
        { transform: "translateY(100%)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 }
      ];
      break;
    case "down":
      keyframes = [
        { transform: "translateY(-100%)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 }
      ];
      break;
    case "left":
      keyframes = [
        { transform: "translateX(100%)", opacity: 0 },
        { transform: "translateX(0)", opacity: 1 }
      ];
      break;
    case "right":
      keyframes = [
        { transform: "translateX(-100%)", opacity: 0 },
        { transform: "translateX(0)", opacity: 1 }
      ];
      break;
  }
  return animate(element, {
    keyframes,
    duration,
    easing,
    delay,
    onStart,
    onEnd
  });
}
function scale(element, direction = "in", config = {}) {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn("Animation", "Invalid element provided to scale");
    return null;
  }
  const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
  const currentTransform = window.getComputedStyle(element).transform;
  let keyframes;
  if (direction === "toggle") {
    direction = currentTransform !== "none" && currentTransform.includes("scale") ? "out" : "in";
  }
  if (direction === "in") {
    keyframes = [
      { transform: "scale(0)", opacity: 0 },
      { transform: "scale(1)", opacity: 1 }
    ];
  } else {
    keyframes = [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(0)", opacity: 0 }
    ];
  }
  return animate(element, {
    keyframes,
    duration,
    easing,
    delay,
    onStart,
    onEnd
  });
}
function rotate(element, degrees = 360, config = {}) {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn("Animation", "Invalid element provided to rotate");
    return null;
  }
  const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
  const keyframes = [
    { transform: "rotate(0deg)" },
    { transform: `rotate(${degrees}deg)` }
  ];
  return animate(element, {
    keyframes,
    duration,
    easing,
    delay,
    onStart,
    onEnd
  });
}

// ../dist/runtime/helpers/devtools.js
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["INFO"] = 1] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 2] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 3] = "ERROR";
  LogLevel2[LogLevel2["NONE"] = 4] = "NONE";
})(LogLevel || (LogLevel = {}));
var Logger = class {
  constructor(config = {}) {
    this.logs = [];
    this.config = {
      level: LogLevel.INFO,
      prefix: "[Rynex]",
      timestamp: true,
      colors: true,
      ...config
    };
  }
  shouldLog(level) {
    return level >= this.config.level;
  }
  formatMessage(level, message, data) {
    const parts = [];
    if (this.config.prefix) {
      parts.push(this.config.prefix);
    }
    if (this.config.timestamp) {
      parts.push(`[${(/* @__PURE__ */ new Date()).toISOString()}]`);
    }
    parts.push(`[${level}]`);
    parts.push(message);
    return parts.join(" ");
  }
  logToConsole(level, message, data, color) {
    try {
      const formatted = this.formatMessage(level, message, data);
      if (this.config.colors && color) {
        console.log(`%c${formatted}`, `color: ${color}`, data || "");
      } else {
        console.log(formatted, data || "");
      }
    } catch (error) {
      console.error("Logger error:", error);
    }
  }
  debug(message, data) {
    if (!message)
      return;
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.logToConsole("DEBUG", message, data, "#888");
      this.logs.push({ level: "DEBUG", message, timestamp: Date.now(), data });
    }
  }
  info(message, data) {
    if (!message)
      return;
    if (this.shouldLog(LogLevel.INFO)) {
      this.logToConsole("INFO", message, data, "#2196F3");
      this.logs.push({ level: "INFO", message, timestamp: Date.now(), data });
    }
  }
  warn(message, data) {
    if (!message)
      return;
    if (this.shouldLog(LogLevel.WARN)) {
      this.logToConsole("WARN", message, data, "#FF9800");
      this.logs.push({ level: "WARN", message, timestamp: Date.now(), data });
    }
  }
  error(message, data) {
    if (!message)
      return;
    if (this.shouldLog(LogLevel.ERROR)) {
      this.logToConsole("ERROR", message, data, "#F44336");
      this.logs.push({ level: "ERROR", message, timestamp: Date.now(), data });
    }
  }
  getLogs() {
    return [...this.logs];
  }
  clearLogs() {
    this.logs = [];
  }
  setLevel(level) {
    this.config.level = level;
  }
};
var globalLogger = null;
function logger(config) {
  if (!globalLogger || config) {
    globalLogger = new Logger(config);
  }
  return globalLogger;
}
var Profiler = class {
  constructor() {
    this.profiles = /* @__PURE__ */ new Map();
    this.completed = [];
  }
  start(name, metadata) {
    if (!name || typeof name !== "string") {
      console.warn("Profile name must be a non-empty string");
      return;
    }
    if (this.profiles.has(name)) {
      console.warn(`Profile "${name}" is already running`);
      return;
    }
    try {
      const entry = {
        name,
        startTime: performance.now(),
        metadata
      };
      this.profiles.set(name, entry);
      if (globalLogger) {
        globalLogger.debug(`Profile started: ${name}`, metadata);
      }
    } catch (error) {
      console.error("Error starting profile:", error);
    }
  }
  end(name) {
    if (!name || typeof name !== "string") {
      console.warn("Profile name must be a non-empty string");
      return void 0;
    }
    const entry = this.profiles.get(name);
    if (!entry) {
      console.warn(`Profile "${name}" not found`);
      return void 0;
    }
    try {
      entry.endTime = performance.now();
      entry.duration = entry.endTime - entry.startTime;
      this.completed.push(entry);
      this.profiles.delete(name);
      if (globalLogger) {
        globalLogger.debug(`Profile ended: ${name}`, {
          duration: `${entry.duration.toFixed(2)}ms`,
          ...entry.metadata
        });
      }
      return entry.duration;
    } catch (error) {
      console.error("Error ending profile:", error);
      return void 0;
    }
  }
  measure(name, fn, metadata) {
    if (!name || typeof name !== "string") {
      console.warn("Profile name must be a non-empty string");
      return void 0;
    }
    if (typeof fn !== "function") {
      console.warn("Second argument must be a function");
      return void 0;
    }
    this.start(name, metadata);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      console.error(`Error in measured function "${name}":`, error);
      throw error;
    }
  }
  async measureAsync(name, fn, metadata) {
    if (!name || typeof name !== "string") {
      console.warn("Profile name must be a non-empty string");
      return void 0;
    }
    if (typeof fn !== "function") {
      console.warn("Second argument must be a function");
      return void 0;
    }
    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      console.error(`Error in async measured function "${name}":`, error);
      throw error;
    }
  }
  getProfile(name) {
    return this.completed.find((p2) => p2.name === name);
  }
  getAllProfiles() {
    return [...this.completed];
  }
  getAverageDuration(name) {
    const profiles = this.completed.filter((p2) => p2.name === name);
    if (profiles.length === 0)
      return 0;
    const total = profiles.reduce((sum, p2) => sum + (p2.duration || 0), 0);
    return total / profiles.length;
  }
  clear() {
    this.profiles.clear();
    this.completed = [];
  }
  report() {
    const report = {
      active: Array.from(this.profiles.values()),
      completed: this.completed,
      summary: this.getSummary()
    };
    console.table(report.completed);
    return report;
  }
  getSummary() {
    const names = new Set(this.completed.map((p2) => p2.name));
    const summary2 = {};
    names.forEach((name) => {
      const profiles = this.completed.filter((p2) => p2.name === name);
      const durations = profiles.map((p2) => p2.duration || 0);
      summary2[name] = {
        count: profiles.length,
        total: durations.reduce((a, b) => a + b, 0).toFixed(2) + "ms",
        average: (durations.reduce((a, b) => a + b, 0) / profiles.length).toFixed(2) + "ms",
        min: Math.min(...durations).toFixed(2) + "ms",
        max: Math.max(...durations).toFixed(2) + "ms"
      };
    });
    return summary2;
  }
};
var globalProfiler = null;
function profiler() {
  if (!globalProfiler) {
    globalProfiler = new Profiler();
  }
  return globalProfiler;
}
var DevTools = class {
  constructor(config = {}) {
    this.config = {
      enabled: true,
      ...config
    };
    this.logger = config.logger || logger();
    this.profiler = config.profiler || profiler();
    if (this.config.enabled) {
      this.attachToWindow();
    }
  }
  attachToWindow() {
    if (typeof window !== "undefined") {
      window.__RYNEX_DEVTOOLS__ = {
        logger: this.logger,
        profiler: this.profiler,
        version: "0.1.40",
        inspect: this.inspect.bind(this),
        getState: this.getState.bind(this)
      };
      this.logger.info("DevTools attached to window.__RYNEX_DEVTOOLS__");
    }
  }
  inspect(element) {
    if (!element || !(element instanceof HTMLElement)) {
      this.logger.warn("Invalid element provided to inspect");
      return null;
    }
    try {
      const info = {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        attributes: Array.from(element.attributes).map((attr) => ({
          name: attr.name,
          value: attr.value
        })),
        children: element.children.length,
        dataset: { ...element.dataset }
      };
      console.log("Element Inspector:", info);
      return info;
    } catch (error) {
      this.logger.error("Error inspecting element:", error);
      return null;
    }
  }
  getState() {
    return {
      message: "State inspection not yet implemented"
    };
  }
  enable() {
    this.config.enabled = true;
    this.attachToWindow();
  }
  disable() {
    this.config.enabled = false;
    if (typeof window !== "undefined") {
      delete window.__RYNEX_DEVTOOLS__;
    }
  }
};
var globalDevTools = null;
function devtools(config) {
  if (!globalDevTools || config) {
    globalDevTools = new DevTools(config);
  }
  return globalDevTools;
}
var log = {
  debug: (msg, data) => logger().debug(msg, data),
  info: (msg, data) => logger().info(msg, data),
  warn: (msg, data) => logger().warn(msg, data),
  error: (msg, data) => logger().error(msg, data)
};
var profile = {
  start: (name, metadata) => profiler().start(name, metadata),
  end: (name) => profiler().end(name),
  measure: (name, fn, metadata) => profiler().measure(name, fn, metadata),
  measureAsync: (name, fn, metadata) => profiler().measureAsync(name, fn, metadata),
  report: () => profiler().report()
};

// test-utilities.ts
function UtilitiesTest() {
  const container2 = div({ class: "test-container", style: { padding: "2rem", maxWidth: "800px", margin: "0 auto" } }, [
    // Test Header
    div({ style: { marginBottom: "2rem" } }, [
      text({ style: { fontSize: "2rem", fontWeight: "bold" } }, "Utilities Test Suite"),
      text({ style: { display: "block", color: "#666", marginTop: "0.5rem" } }, "Testing lazy, suspense, errorBoundary, and memo")
    ]),
    // Test 1: Lazy Loading
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 1: Lazy Loading"),
      button({
        style: { padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
        onClick: async () => {
          const lazyComponent = lazy(
            () => Promise.resolve({
              default: () => text({ style: { color: "green" } }, "Lazy component loaded!")
            })
          );
          const component = await lazyComponent();
          const result = component();
          document.getElementById("lazy-result").appendChild(result);
        }
      }, "Load Lazy Component"),
      div({ id: "lazy-result", style: { marginTop: "1rem" } })
    ]),
    // Test 2: Suspense
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 2: Suspense"),
      suspense(
        {
          fallback: text({ style: { color: "#666" } }, "Loading..."),
          onError: (error) => console.error("Suspense error:", error)
        },
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 1e3));
          return text({ style: { color: "blue" } }, "Content loaded after 1 second!");
        }
      )
    ]),
    // Test 3: Error Boundary
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 3: Error Boundary"),
      errorBoundary(
        {
          fallback: (error) => text({ style: { color: "red" } }, `Error caught: ${error.message}`),
          onError: (error) => console.log("Error boundary caught:", error)
        },
        () => {
          return text({ style: { color: "green" } }, "No errors here!");
        }
      )
    ]),
    // Test 4: Memo
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 4: Memo"),
      (() => {
        let renderCount = 0;
        const MemoizedComponent = memo((props) => {
          renderCount++;
          return text({}, `Value: ${props.value}, Render count: ${renderCount}`);
        });
        const result = div({ id: "memo-result" });
        const comp1 = MemoizedComponent({ value: 10 });
        const comp2 = MemoizedComponent({ value: 10 });
        const comp3 = MemoizedComponent({ value: 20 });
        result.appendChild(div({ style: { marginBottom: "0.5rem" } }, [comp1]));
        result.appendChild(div({ style: { marginBottom: "0.5rem" } }, [comp2]));
        result.appendChild(div({}, [comp3]));
        return result;
      })()
    ]),
    // Test Results Summary
    div({ style: { padding: "1rem", background: "#f0f0f0", borderRadius: "8px" } }, [
      text({ style: { fontWeight: "bold" } }, "All utility tests completed successfully!")
    ])
  ]);
  return container2;
}

// test-lifecycle.ts
function LifecycleTest() {
  const testState = state({
    count: 0,
    message: "Initial message",
    mountLog: [],
    updateLog: []
  });
  const container2 = div({ class: "test-container", style: { padding: "2rem", maxWidth: "800px", margin: "0 auto" } }, [
    // Test Header
    div({ style: { marginBottom: "2rem" } }, [
      text({ style: { fontSize: "2rem", fontWeight: "bold" } }, "Lifecycle Hooks Test Suite"),
      text({ style: { display: "block", color: "#666", marginTop: "0.5rem" } }, "Testing onMount, onUnmount, onUpdate, watch, watchEffect")
    ]),
    // Test 1: onMount
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 1: onMount"),
      (() => {
        const mountTest = div({ id: "mount-test", style: { padding: "0.5rem", background: "#f0f0f0" } }, [
          text({}, "This element will log when mounted")
        ]);
        onMount(mountTest, () => {
          testState.mountLog.push("Element mounted at " + (/* @__PURE__ */ new Date()).toLocaleTimeString());
          console.log("onMount triggered");
        });
        return mountTest;
      })(),
      div({ id: "mount-log", style: { marginTop: "1rem", color: "green" } })
    ]),
    // Test 2: onUpdate
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 2: onUpdate"),
      (() => {
        const updateTest = div({ id: "update-test", style: { padding: "0.5rem", background: "#f0f0f0" } }, [
          text({}, "Click button to update this element")
        ]);
        onUpdate(updateTest, (mutations) => {
          testState.updateLog.push(`Updated: ${mutations.length} mutations`);
          console.log("onUpdate triggered:", mutations);
        });
        return div({}, [
          updateTest,
          button({
            style: { marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              updateTest.appendChild(text({ style: { display: "block" } }, "Updated at " + (/* @__PURE__ */ new Date()).toLocaleTimeString()));
            }
          }, "Trigger Update")
        ]);
      })()
    ]),
    // Test 3: watch
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 3: watch"),
      (() => {
        const watchResult = div({ id: "watch-result" });
        watch(
          () => testState.count,
          (newVal, oldVal) => {
            watchResult.appendChild(
              text({ style: { display: "block", color: "blue" } }, `Count changed from ${oldVal} to ${newVal}`)
            );
          }
        );
        return div({}, [
          button({
            style: { padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              testState.count++;
            }
          }, "Increment Count"),
          text({ style: { marginLeft: "1rem" } }, () => `Current: ${testState.count}`),
          watchResult
        ]);
      })()
    ]),
    // Test 4: watchEffect
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 4: watchEffect"),
      (() => {
        const effectResult = div({ id: "effect-result" });
        watchEffect(() => {
          effectResult.textContent = `Message: ${testState.message} (Count: ${testState.count})`;
        });
        return div({}, [
          button({
            style: { padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "0.5rem" },
            onClick: () => {
              testState.message = "Updated at " + (/* @__PURE__ */ new Date()).toLocaleTimeString();
            }
          }, "Update Message"),
          button({
            style: { padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              testState.count++;
            }
          }, "Increment"),
          div({ style: { marginTop: "1rem", padding: "0.5rem", background: "#f0f0f0" } }, [effectResult])
        ]);
      })()
    ]),
    // Test Results Summary
    div({ style: { padding: "1rem", background: "#f0f0f0", borderRadius: "8px" } }, [
      text({ style: { fontWeight: "bold" } }, "All lifecycle tests initialized successfully!")
    ])
  ]);
  return container2;
}

// test-performance.ts
function PerformanceTest() {
  let debounceCount = 0;
  let throttleCount = 0;
  let normalCount = 0;
  const container2 = div({ class: "test-container", style: { padding: "2rem", maxWidth: "800px", margin: "0 auto" } }, [
    // Test Header
    div({ style: { marginBottom: "2rem" } }, [
      text({ style: { fontSize: "2rem", fontWeight: "bold" } }, "Performance Utilities Test Suite"),
      text({ style: { display: "block", color: "#666", marginTop: "0.5rem" } }, "Testing debounce, throttle, and preload")
    ]),
    // Test 1: Debounce
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 1: Debounce"),
      text({ style: { display: "block", marginBottom: "0.5rem" } }, "Type in the input - debounced function will execute 500ms after you stop typing"),
      (() => {
        const debounceResult = div({ id: "debounce-result", style: { marginTop: "1rem", color: "blue" } });
        const debouncedFn = debounce((value) => {
          debounceCount++;
          debounceResult.textContent = `Debounced called ${debounceCount} times. Value: ${value}`;
        }, 500);
        return div({}, [
          input({
            type: "text",
            placeholder: "Type here...",
            style: { padding: "0.5rem", width: "100%", border: "1px solid #ddd", borderRadius: "4px" },
            onInput: (e) => {
              const target = e.target;
              normalCount++;
              debouncedFn(target.value);
              document.getElementById("normal-count").textContent = `Normal input events: ${normalCount}`;
            }
          }),
          div({ id: "normal-count", style: { marginTop: "0.5rem", color: "#666" } }, "Normal input events: 0"),
          debounceResult
        ]);
      })()
    ]),
    // Test 2: Throttle
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 2: Throttle"),
      text({ style: { display: "block", marginBottom: "0.5rem" } }, "Click rapidly - throttled function will execute at most once per 1000ms"),
      (() => {
        const throttleResult = div({ id: "throttle-result", style: { marginTop: "1rem", color: "green" } });
        let clickCount = 0;
        const throttledFn = throttle(() => {
          throttleCount++;
          throttleResult.textContent = `Throttled called ${throttleCount} times`;
        }, 1e3);
        return div({}, [
          button({
            style: { padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              clickCount++;
              throttledFn();
              document.getElementById("click-count").textContent = `Total clicks: ${clickCount}`;
            }
          }, "Click Me Rapidly!"),
          div({ id: "click-count", style: { marginTop: "0.5rem", color: "#666" } }, "Total clicks: 0"),
          throttleResult
        ]);
      })()
    ]),
    // Test 3: Preload
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 3: Preload"),
      (() => {
        const preloadResult = div({ id: "preload-result", style: { marginTop: "1rem" } });
        const dataLoader = () => new Promise((resolve) => {
          setTimeout(() => resolve("Preloaded data!"), 1e3);
        });
        return div({}, [
          button({
            style: { padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "0.5rem" },
            onClick: async () => {
              preloadResult.textContent = "Preloading...";
              const startTime = Date.now();
              await preload(dataLoader);
              const elapsed = Date.now() - startTime;
              preloadResult.textContent = `Preloaded in ${elapsed}ms`;
            }
          }, "Preload Data"),
          button({
            style: { padding: "0.5rem 1rem", background: "#4CAF50", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: async () => {
              const cached = getPreloaded(dataLoader);
              if (cached) {
                preloadResult.textContent = "Retrieved from cache instantly!";
              } else {
                preloadResult.textContent = "Not in cache, loading...";
                const data = await dataLoader();
                preloadResult.textContent = `Loaded: ${data}`;
              }
            }
          }, "Get Preloaded"),
          preloadResult
        ]);
      })()
    ]),
    // Test Results Summary
    div({ style: { padding: "1rem", background: "#f0f0f0", borderRadius: "8px" } }, [
      text({ style: { fontWeight: "bold" } }, "All performance tests initialized successfully!")
    ])
  ]);
  return container2;
}

// test-refs.ts
function RefsTest() {
  const container2 = div({ class: "test-container", style: { padding: "2rem", maxWidth: "800px", margin: "0 auto" } }, [
    // Test Header
    div({ style: { marginBottom: "2rem" } }, [
      text({ style: { fontSize: "2rem", fontWeight: "bold" } }, "Refs and DOM Access Test Suite"),
      text({ style: { display: "block", color: "#666", marginTop: "0.5rem" } }, "Testing ref, useRef, forwardRef, and mergeRefs")
    ]),
    // Test 1: Basic Ref
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 1: Basic Ref"),
      (() => {
        const inputRef = ref();
        const resultDiv = div({ id: "ref-result", style: { marginTop: "1rem", color: "blue" } });
        const inputEl = input({
          type: "text",
          placeholder: "Type something...",
          style: { padding: "0.5rem", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }
        });
        inputRef.current = inputEl;
        return div({}, [
          inputEl,
          button({
            style: { marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              if (inputRef.current) {
                resultDiv.textContent = `Input value via ref: ${inputRef.current.value}`;
                inputRef.current.focus();
              }
            }
          }, "Get Value & Focus"),
          resultDiv
        ]);
      })()
    ]),
    // Test 2: useRef
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 2: useRef"),
      (() => {
        const divRef = useRef();
        const resultDiv = div({ id: "useref-result", style: { marginTop: "1rem" } });
        const targetDiv = div({
          style: { padding: "1rem", background: "#f0f0f0", borderRadius: "4px" }
        }, [text({}, "Target div for useRef")]);
        divRef.current = targetDiv;
        return div({}, [
          targetDiv,
          button({
            style: { marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              if (divRef.current) {
                divRef.current.style.background = "#" + Math.floor(Math.random() * 16777215).toString(16);
                resultDiv.textContent = `Background color changed via useRef`;
              }
            }
          }, "Change Background Color"),
          resultDiv
        ]);
      })()
    ]),
    // Test 3: forwardRef
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 3: forwardRef"),
      (() => {
        const CustomInput = forwardRef((props, ref2) => {
          const inputEl = input({
            type: "text",
            placeholder: props.placeholder,
            style: { padding: "0.5rem", width: "100%", border: "2px solid #00ff88", borderRadius: "4px" }
          });
          ref2.current = inputEl;
          return inputEl;
        });
        const forwardedRef = ref();
        const resultDiv = div({ id: "forward-result", style: { marginTop: "1rem", color: "green" } });
        return div({}, [
          CustomInput({ placeholder: "Custom input with forwarded ref", ref: forwardedRef }),
          button({
            style: { marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              if (forwardedRef.current) {
                resultDiv.textContent = `Value from forwarded ref: ${forwardedRef.current.value}`;
              }
            }
          }, "Get Value"),
          resultDiv
        ]);
      })()
    ]),
    // Test 4: mergeRefs
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 4: mergeRefs"),
      (() => {
        const ref1 = ref();
        const ref2 = ref();
        const resultDiv = div({ id: "merge-result", style: { marginTop: "1rem" } });
        const targetDiv = div({
          style: { padding: "1rem", background: "#f0f0f0", borderRadius: "4px" }
        }, [text({}, "Target div with merged refs")]);
        const merged = mergeRefs(ref1, ref2);
        merged(targetDiv);
        return div({}, [
          targetDiv,
          button({
            style: { marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "0.5rem" },
            onClick: () => {
              if (ref1.current) {
                ref1.current.style.borderLeft = "4px solid blue";
                resultDiv.textContent = "Ref1 accessed successfully";
              }
            }
          }, "Use Ref1"),
          button({
            style: { padding: "0.5rem 1rem", background: "#4CAF50", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              if (ref2.current) {
                ref2.current.style.borderRight = "4px solid red";
                resultDiv.textContent = "Ref2 accessed successfully";
              }
            }
          }, "Use Ref2"),
          resultDiv
        ]);
      })()
    ]),
    // Test Results Summary
    div({ style: { padding: "1rem", background: "#f0f0f0", borderRadius: "8px" } }, [
      text({ style: { fontWeight: "bold" } }, "All refs tests initialized successfully!")
    ])
  ]);
  return container2;
}

// test-styles.ts
function StylesTest() {
  const testState = state({
    isActive: false,
    isDanger: false
  });
  const container2 = div({ class: "test-container", style: { padding: "2rem", maxWidth: "800px", margin: "0 auto" } }, [
    // Test Header
    div({ style: { marginBottom: "2rem" } }, [
      text({ style: { fontSize: "2rem", fontWeight: "bold" } }, "Style Utilities Test Suite"),
      text({ style: { display: "block", color: "#666", marginTop: "0.5rem" } }, "Testing styled, classNames, mergeStyles, and theme")
    ]),
    // Test 1: Styled Components
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 1: Styled Components"),
      (() => {
        const StyledButton = styled("button", {
          padding: "0.75rem 1.5rem",
          background: "#00ff88",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s"
        });
        const DynamicStyledDiv = styled("div", (props) => ({
          padding: "1rem",
          borderRadius: "4px",
          background: props.variant === "primary" ? "#00ff88" : "#666",
          color: props.variant === "primary" ? "#000" : "#fff"
        }));
        return div({}, [
          StyledButton({}, "Styled Button"),
          div({ style: { marginTop: "1rem" } }, [
            DynamicStyledDiv({ variant: "primary" }, [text({}, "Primary variant")]),
            div({ style: { height: "0.5rem" } }),
            DynamicStyledDiv({ variant: "secondary" }, [text({}, "Secondary variant")])
          ])
        ]);
      })()
    ]),
    // Test 2: classNames
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 2: classNames"),
      (() => {
        const resultDiv = div({
          class: classNames(
            "base-class",
            { "active": testState.isActive },
            { "danger": testState.isDanger },
            testState.isActive && "highlighted"
          ),
          style: { padding: "1rem", background: "#f0f0f0", borderRadius: "4px", marginTop: "1rem" }
        }, [text({}, () => `Classes: ${classNames("base-class", { "active": testState.isActive }, { "danger": testState.isDanger })}`)]);
        return div({}, [
          button({
            style: { padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "0.5rem" },
            onClick: () => {
              testState.isActive = !testState.isActive;
            }
          }, "Toggle Active"),
          button({
            style: { padding: "0.5rem 1rem", background: "#ff5555", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              testState.isDanger = !testState.isDanger;
            }
          }, "Toggle Danger"),
          resultDiv
        ]);
      })()
    ]),
    // Test 3: mergeStyles
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 3: mergeStyles"),
      (() => {
        const baseStyles = {
          padding: "1rem",
          background: "#f0f0f0",
          borderRadius: "4px"
        };
        const activeStyles = {
          background: "#00ff88",
          color: "#000",
          fontWeight: "bold"
        };
        const merged = mergeStyles(baseStyles, testState.isActive ? activeStyles : {});
        return div({}, [
          div({ style: merged }, [
            text({}, () => testState.isActive ? "Active styles merged!" : "Base styles only")
          ]),
          button({
            style: { marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              testState.isActive = !testState.isActive;
            }
          }, "Toggle Merge")
        ]);
      })()
    ]),
    // Test 4: Theme
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 4: Theme"),
      (() => {
        const themeResult = div({ id: "theme-result", style: { marginTop: "1rem", padding: "1rem", background: "#f0f0f0", borderRadius: "4px" } });
        useTheme((theme) => {
          themeResult.textContent = `Current theme: ${JSON.stringify(theme)}`;
        });
        return div({}, [
          button({
            style: { padding: "0.5rem 1rem", background: "#00ff88", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "0.5rem" },
            onClick: () => {
              setTheme({ mode: "dark", primary: "#00ff88", secondary: "#666" });
            }
          }, "Set Dark Theme"),
          button({
            style: { padding: "0.5rem 1rem", background: "#4CAF50", border: "none", borderRadius: "4px", cursor: "pointer" },
            onClick: () => {
              setTheme({ mode: "light", primary: "#007bff", secondary: "#ccc" });
            }
          }, "Set Light Theme"),
          themeResult
        ]);
      })()
    ]),
    // Test Results Summary
    div({ style: { padding: "1rem", background: "#f0f0f0", borderRadius: "8px" } }, [
      text({ style: { fontWeight: "bold" } }, "All style tests initialized successfully!")
    ])
  ]);
  return container2;
}

// test-components.ts
function ComponentsTest() {
  const testState = state({
    activeTab: 0,
    tabChangeCount: 0
  });
  const container2 = div({ class: "test-container", style: { padding: "2rem", maxWidth: "800px", margin: "0 auto" } }, [
    // Test Header
    div({ style: { marginBottom: "2rem" } }, [
      text({ style: { fontSize: "2rem", fontWeight: "bold" } }, "UI Components Test Suite"),
      text({ style: { display: "block", color: "#666", marginTop: "0.5rem" } }, "Testing tabs and accordion components")
    ]),
    // Test 1: Tabs Component
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 1: Tabs Component"),
      tabs({
        tabs: [
          {
            label: "Overview",
            content: div({ style: { padding: "1rem" } }, [
              text({ style: { fontSize: "1.1rem", fontWeight: "bold", display: "block", marginBottom: "0.5rem" } }, "Overview Tab"),
              text({ style: { display: "block", color: "#666" } }, "This is the overview content. Tabs allow you to organize content into separate views.")
            ])
          },
          {
            label: "Features",
            content: div({ style: { padding: "1rem" } }, [
              text({ style: { fontSize: "1.1rem", fontWeight: "bold", display: "block", marginBottom: "0.5rem" } }, "Features Tab"),
              div({}, [
                text({ style: { display: "block", marginBottom: "0.25rem" } }, "- Easy to use API"),
                text({ style: { display: "block", marginBottom: "0.25rem" } }, "- Customizable styling"),
                text({ style: { display: "block", marginBottom: "0.25rem" } }, "- Keyboard navigation"),
                text({ style: { display: "block" } }, "- onChange callback support")
              ])
            ])
          },
          {
            label: "Settings",
            content: div({ style: { padding: "1rem" } }, [
              text({ style: { fontSize: "1.1rem", fontWeight: "bold", display: "block", marginBottom: "0.5rem" } }, "Settings Tab"),
              text({ style: { display: "block", color: "#666" } }, "Configure your preferences here. This tab demonstrates dynamic content loading.")
            ])
          }
        ],
        defaultIndex: 0,
        onChange: (index) => {
          testState.activeTab = index;
          testState.tabChangeCount++;
        },
        style: { background: "#fff", borderRadius: "8px" }
      }),
      div({ style: { marginTop: "1rem", padding: "0.5rem", background: "#f0f0f0", borderRadius: "4px" } }, [
        text({}, () => `Active tab: ${testState.activeTab}, Changes: ${testState.tabChangeCount}`)
      ])
    ]),
    // Test 2: Accordion Component
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 2: Accordion Component"),
      text({ style: { display: "block", marginBottom: "1rem", color: "#666" } }, "Single item open at a time:"),
      accordion({
        items: [
          {
            title: "What is Rynex?",
            content: div({ style: { color: "#666" } }, [
              text({}, "Rynex is a modern, reactive web framework that provides a clean API for building user interfaces without the complexity of virtual DOM.")
            ])
          },
          {
            title: "How does reactivity work?",
            content: div({ style: { color: "#666" } }, [
              text({}, "Rynex uses JavaScript Proxies to track state changes and automatically update the DOM when state changes occur.")
            ])
          },
          {
            title: "Is it production ready?",
            content: div({ style: { color: "#666" } }, [
              text({}, "Yes! Rynex is production-ready with comprehensive TypeScript support and a growing ecosystem of components.")
            ])
          }
        ],
        allowMultiple: false,
        defaultOpen: [0]
      })
    ]),
    // Test 3: Accordion with Multiple Open
    div({ style: { marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" } }, [
      text({ style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", display: "block" } }, "Test 3: Accordion (Multiple Open)"),
      text({ style: { display: "block", marginBottom: "1rem", color: "#666" } }, "Multiple items can be open simultaneously:"),
      accordion({
        items: [
          {
            title: "Installation",
            content: div({ style: { color: "#666" } }, [
              text({ style: { display: "block", fontFamily: "monospace", background: "#f0f0f0", padding: "0.5rem", borderRadius: "4px" } }, "npm install rynex")
            ])
          },
          {
            title: "Quick Start",
            content: div({ style: { color: "#666" } }, [
              text({ style: { display: "block", marginBottom: "0.25rem" } }, "1. Import Rynex functions"),
              text({ style: { display: "block", marginBottom: "0.25rem" } }, "2. Create your component"),
              text({ style: { display: "block" } }, "3. Render to DOM")
            ])
          },
          {
            title: "Documentation",
            content: div({ style: { color: "#666" } }, [
              text({}, "Visit our comprehensive documentation at docs.rynex.dev for detailed guides and API references.")
            ])
          }
        ],
        allowMultiple: true,
        defaultOpen: [0, 1]
      })
    ]),
    // Test Results Summary
    div({ style: { padding: "1rem", background: "#f0f0f0", borderRadius: "8px" } }, [
      text({ style: { fontWeight: "bold" } }, "All component tests initialized successfully!")
    ])
  ]);
  return container2;
}

// test-tailwind.ts
function TailwindTest() {
  return div({
    class: "min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8"
  }, [
    vbox({
      class: "bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full space-y-6"
    }, [
      // Header
      text({
        class: "text-4xl font-bold text-gray-800 text-center mb-4"
      }, "\u{1F3A8} Tailwind CSS Test"),
      text({
        class: "text-lg text-gray-600 text-center mb-8",
        text: 'Testing class detection: class: "flex items-center"'
      }),
      // Card Grid
      hbox({
        class: "grid grid-cols-1 md:grid-cols-2 gap-4"
      }, [
        // Card 1
        div({
          class: "bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        }, [
          text({
            class: "text-xl font-semibold text-blue-700 mb-2",
            text: "Flexbox"
          }),
          text({
            class: "text-gray-600",
            text: "flex, items-center, justify-between"
          })
        ]),
        // Card 2
        div({
          class: "bg-purple-50 border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        }, [
          text({
            class: "text-xl font-semibold text-purple-700 mb-2",
            text: "Colors"
          }),
          text({
            class: "text-gray-600",
            text: "bg-blue-500, text-white, border-gray-300"
          })
        ]),
        // Card 3
        div({
          class: "bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        }, [
          text({
            class: "text-xl font-semibold text-green-700 mb-2",
            text: "Spacing"
          }),
          text({
            class: "text-gray-600",
            text: "p-4, m-2, gap-4, space-y-2"
          })
        ]),
        // Card 4
        div({
          class: "bg-red-50 border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        }, [
          text({
            class: "text-xl font-semibold text-red-700 mb-2",
            text: "Responsive"
          }),
          text({
            class: "text-gray-600",
            text: "sm:text-sm, md:text-base, lg:text-lg"
          })
        ])
      ]),
      // Buttons
      hbox({
        class: "flex gap-4 justify-center mt-8"
      }, [
        button({
          class: "bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105",
          text: "Primary Button",
          onclick: () => console.log("Primary clicked!")
        }),
        button({
          class: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors",
          text: "Secondary Button",
          onclick: () => console.log("Secondary clicked!")
        })
      ]),
      // Status
      div({
        class: "mt-8 p-4 bg-green-100 border-l-4 border-green-500 rounded"
      }, [
        text({
          class: "text-green-800 font-semibold",
          text: "\u2705 If you see styled content, Tailwind CSS is working!"
        })
      ])
    ])
  ]);
}

// test-animations.ts
function AnimationsTest() {
  const testState = state({
    status: "Ready to test animations",
    lastAnimation: "None",
    animationCount: 0
  });
  function createTestBox(label2) {
    return div({
      class: "test-box",
      style: {
        padding: "2rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        borderRadius: "12px",
        textAlign: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        margin: "1rem 0",
        minHeight: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, text(label2));
  }
  function testTransition() {
    const box = createTestBox("Transition Test Box");
    const applyTransition = () => {
      transition(box, {
        duration: 500,
        easing: "ease-in-out",
        onStart: () => {
          testState.status = "Transition started...";
          testState.lastAnimation = "transition";
        },
        onEnd: () => {
          testState.status = "Transition completed!";
          testState.animationCount++;
        }
      });
      box.style.transform = box.style.transform === "scale(1.1)" ? "scale(1)" : "scale(1.1)";
      box.style.background = box.style.background.includes("667eea") ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, "1. Transition Test"),
      text({ style: { color: "#666" } }, "Apply CSS transitions to elements"),
      box,
      button({
        onclick: applyTransition,
        style: {
          padding: "0.75rem 1.5rem",
          background: "#667eea",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "600"
        }
      }, "Apply Transition")
    ]);
  }
  function testFade() {
    const box = createTestBox("Fade Animation Box");
    const fadeIn = () => {
      testState.status = "Fading in...";
      testState.lastAnimation = "fade in";
      fade(box, "in", {
        duration: 600,
        onEnd: () => {
          testState.status = "Fade in complete!";
          testState.animationCount++;
        }
      });
    };
    const fadeOut = () => {
      testState.status = "Fading out...";
      testState.lastAnimation = "fade out";
      fade(box, "out", {
        duration: 600,
        onEnd: () => {
          testState.status = "Fade out complete!";
          testState.animationCount++;
        }
      });
    };
    const fadeToggle = () => {
      testState.status = "Toggling fade...";
      testState.lastAnimation = "fade toggle";
      fade(box, "toggle", {
        duration: 600,
        onEnd: () => {
          testState.status = "Fade toggle complete!";
          testState.animationCount++;
        }
      });
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, text("2. Fade Animation Test")),
      text({ style: { color: "#666" } }, "Fade in, out, and toggle"),
      box,
      hbox({ style: { gap: "0.5rem", flexWrap: "wrap" } }, [
        button({
          onclick: fadeIn,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Fade In"),
        button({
          onclick: fadeOut,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Fade Out"),
        button({
          onclick: fadeToggle,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#8b5cf6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Toggle")
      ])
    ]);
  }
  function testSlide() {
    const box = createTestBox("Slide Animation Box");
    const slideDirection = (dir) => {
      testState.status = `Sliding ${dir}...`;
      testState.lastAnimation = `slide ${dir}`;
      slide(box, dir, {
        duration: 500,
        onEnd: () => {
          testState.status = `Slide ${dir} complete!`;
          testState.animationCount++;
        }
      });
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, text("3. Slide Animation Test")),
      text({ style: { color: "#666" } }, "Slide from different directions"),
      box,
      hbox({ style: { gap: "0.5rem", flexWrap: "wrap" } }, [
        button({
          onclick: () => slideDirection("up"),
          style: {
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "\u2191 Up"),
        button({
          onclick: () => slideDirection("down"),
          style: {
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "\u2193 Down"),
        button({
          onclick: () => slideDirection("left"),
          style: {
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "\u2190 Left"),
        button({
          onclick: () => slideDirection("right"),
          style: {
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "\u2192 Right")
      ])
    ]);
  }
  function testScale() {
    const box = createTestBox("Scale Animation Box");
    const scaleIn = () => {
      testState.status = "Scaling in...";
      testState.lastAnimation = "scale in";
      scale(box, "in", {
        duration: 500,
        onEnd: () => {
          testState.status = "Scale in complete!";
          testState.animationCount++;
        }
      });
    };
    const scaleOut = () => {
      testState.status = "Scaling out...";
      testState.lastAnimation = "scale out";
      scale(box, "out", {
        duration: 500,
        onEnd: () => {
          testState.status = "Scale out complete!";
          testState.animationCount++;
        }
      });
    };
    const scaleToggle = () => {
      testState.status = "Toggling scale...";
      testState.lastAnimation = "scale toggle";
      scale(box, "toggle", {
        duration: 500,
        onEnd: () => {
          testState.status = "Scale toggle complete!";
          testState.animationCount++;
        }
      });
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, text("4. Scale Animation Test")),
      text({ style: { color: "#666" } }, "Scale in, out, and toggle"),
      box,
      hbox({ style: { gap: "0.5rem", flexWrap: "wrap" } }, [
        button({
          onclick: scaleIn,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Scale In"),
        button({
          onclick: scaleOut,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Scale Out"),
        button({
          onclick: scaleToggle,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Toggle")
      ])
    ]);
  }
  function testRotate() {
    const box = createTestBox("Rotate Animation Box");
    const rotate360 = () => {
      testState.status = "Rotating 360\xB0...";
      testState.lastAnimation = "rotate 360";
      rotate(box, 360, {
        duration: 1e3,
        onEnd: () => {
          testState.status = "Rotation complete!";
          testState.animationCount++;
        }
      });
    };
    const rotate180 = () => {
      testState.status = "Rotating 180\xB0...";
      testState.lastAnimation = "rotate 180";
      rotate(box, 180, {
        duration: 500,
        onEnd: () => {
          testState.status = "Rotation complete!";
          testState.animationCount++;
        }
      });
    };
    const rotateNegative = () => {
      testState.status = "Rotating -360\xB0...";
      testState.lastAnimation = "rotate -360";
      rotate(box, -360, {
        duration: 1e3,
        onEnd: () => {
          testState.status = "Rotation complete!";
          testState.animationCount++;
        }
      });
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, text("5. Rotate Animation Test")),
      text({ style: { color: "#666" } }, "Rotate by different degrees"),
      box,
      hbox({ style: { gap: "0.5rem", flexWrap: "wrap" } }, [
        button({
          onclick: rotate360,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#ec4899",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "360\xB0"),
        button({
          onclick: rotate180,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#ec4899",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "180\xB0"),
        button({
          onclick: rotateNegative,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#ec4899",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "-360\xB0")
      ])
    ]);
  }
  function testCustomAnimation() {
    const box = createTestBox("Custom Animation Box");
    const customAnim = () => {
      testState.status = "Running custom animation...";
      testState.lastAnimation = "custom keyframes";
      animate(box, {
        keyframes: [
          { transform: "translateX(0) rotate(0deg)", background: "#667eea" },
          { transform: "translateX(50px) rotate(180deg)", background: "#f093fb" },
          { transform: "translateX(0) rotate(360deg)", background: "#667eea" }
        ],
        duration: 1500,
        easing: "ease-in-out",
        onEnd: () => {
          testState.status = "Custom animation complete!";
          testState.animationCount++;
        }
      });
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, text("6. Custom Animation Test")),
      text({ style: { color: "#666" } }, "Complex keyframe animation"),
      box,
      button({
        onclick: customAnim,
        style: {
          padding: "0.75rem 1.5rem",
          background: "#06b6d4",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "600"
        }
      }, "Run Custom Animation")
    ]);
  }
  const statusDisplay = div({
    style: {
      position: "sticky",
      top: "0",
      background: "#000",
      color: "#00ff88",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      zIndex: "100"
    }
  }, [
    div({ style: { marginBottom: "0.5rem" } }, [
      text({ style: { fontWeight: "bold", color: "#fff" } }, "Status: "),
      text(() => testState.status)
    ]),
    div({ style: { marginBottom: "0.5rem" } }, [
      text({ style: { fontWeight: "bold", color: "#fff" } }, "Last Animation: "),
      text(() => testState.lastAnimation)
    ]),
    div({}, [
      text({ style: { fontWeight: "bold", color: "#fff" } }, "Animations Run: "),
      text(() => String(testState.animationCount))
    ])
  ]);
  return div({
    style: {
      padding: "2rem",
      maxWidth: "1000px",
      margin: "0 auto"
    }
  }, [
    h2({ style: { marginBottom: "1rem", color: "#000" } }, text("Animation & Transitions Test Suite")),
    text({
      style: {
        color: "#666",
        marginBottom: "2rem",
        display: "block",
        fontSize: "1.1rem"
      }
    }, "Testing 6 animation functions: transition, animate, fade, slide, scale, rotate"),
    statusDisplay,
    vbox({ style: { gap: "3rem" } }, [
      testTransition(),
      testFade(),
      testSlide(),
      testScale(),
      testRotate(),
      testCustomAnimation()
    ])
  ]);
}

// test-devtools.ts
function DevToolsTest() {
  const testState = state({
    status: "Ready to test developer tools",
    logCount: 0,
    profileCount: 0,
    lastLogLevel: "None",
    lastProfileDuration: 0
  });
  const appLogger = logger({
    level: LogLevel.DEBUG,
    prefix: "[TestApp]",
    timestamp: true,
    colors: true
  });
  const appProfiler = profiler();
  const tools = devtools({ enabled: true });
  function testLogger() {
    const logOutput = state({
      logs: []
    });
    const addLog = (level, message) => {
      logOutput.logs = [...logOutput.logs, `[${level}] ${message}`];
      if (logOutput.logs.length > 10) {
        logOutput.logs = logOutput.logs.slice(-10);
      }
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, "1. Logger Test"),
      text({ style: { color: "#666" } }, "Test different log levels and structured logging"),
      div({
        style: {
          padding: "1.5rem",
          background: "#1f2937",
          color: "#00ff88",
          borderRadius: "12px",
          fontFamily: "monospace",
          fontSize: "0.9rem",
          maxHeight: "200px",
          overflowY: "auto"
        }
      }, [
        (() => {
          if (logOutput.logs.length === 0) {
            return div({}, text("No logs yet..."));
          }
          return vbox(
            { style: { gap: "0.25rem" } },
            logOutput.logs.map(
              (logMsg) => div({}, text(logMsg))
            )
          );
        })()
      ]),
      hbox({ style: { gap: "0.5rem", flexWrap: "wrap" } }, [
        button({
          onclick: () => {
            log.debug("Debug message", { timestamp: Date.now() });
            appLogger.debug("This is a debug message");
            addLog("DEBUG", "Debug message logged");
            testState.lastLogLevel = "DEBUG";
            testState.logCount++;
            testState.status = "Debug log created";
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#6b7280",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Debug"),
        button({
          onclick: () => {
            log.info("Info message", { status: "ok" });
            appLogger.info("This is an info message");
            addLog("INFO", "Info message logged");
            testState.lastLogLevel = "INFO";
            testState.logCount++;
            testState.status = "Info log created";
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Info"),
        button({
          onclick: () => {
            log.warn("Warning message", { level: "medium" });
            appLogger.warn("This is a warning message");
            addLog("WARN", "Warning message logged");
            testState.lastLogLevel = "WARN";
            testState.logCount++;
            testState.status = "Warning log created";
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Warn"),
        button({
          onclick: () => {
            log.error("Error message", { code: 500 });
            appLogger.error("This is an error message");
            addLog("ERROR", "Error message logged");
            testState.lastLogLevel = "ERROR";
            testState.logCount++;
            testState.status = "Error log created";
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Error"),
        button({
          onclick: () => {
            logOutput.logs = [];
            testState.status = "Logs cleared";
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#8b5cf6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Clear")
      ])
    ]);
  }
  function testProfiler() {
    const profileResults = state({
      results: []
    });
    const runHeavyTask = (iterations) => {
      let sum = 0;
      for (let i = 0; i < iterations; i++) {
        sum += Math.sqrt(i) * Math.random();
      }
      return sum;
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, "2. Profiler Test"),
      text({ style: { color: "#666" } }, "Measure performance of operations"),
      div({
        style: {
          padding: "1.5rem",
          background: "#f3f4f6",
          borderRadius: "12px"
        }
      }, [
        div({ style: { marginBottom: "1rem" } }, [
          text({ style: { fontWeight: "bold", color: "#000" } }, "Last Duration: "),
          text(() => `${testState.lastProfileDuration.toFixed(2)}ms`)
        ]),
        div({
          style: {
            background: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            maxHeight: "150px",
            overflowY: "auto"
          }
        }, [
          (() => {
            if (profileResults.results.length === 0) {
              return div({}, text("No profiles yet..."));
            }
            return vbox(
              { style: { gap: "0.5rem" } },
              profileResults.results.map(
                (result) => div({ style: { display: "flex", justifyContent: "space-between" } }, [
                  text({ style: { fontWeight: "600", color: "#667eea" } }, result.name),
                  text({ style: { color: "#10b981" } }, result.duration)
                ])
              )
            );
          })()
        ])
      ]),
      hbox({ style: { gap: "0.5rem", flexWrap: "wrap" } }, [
        button({
          onclick: () => {
            profile.start("light-task");
            runHeavyTask(1e4);
            const duration = profile.end("light-task") || 0;
            testState.lastProfileDuration = duration;
            profileResults.results = [...profileResults.results, {
              name: "Light Task (10k)",
              duration: `${duration.toFixed(2)}ms`
            }];
            testState.profileCount++;
            testState.status = `Light task: ${duration.toFixed(2)}ms`;
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Light Task"),
        button({
          onclick: () => {
            profile.start("medium-task");
            runHeavyTask(1e5);
            const duration = profile.end("medium-task") || 0;
            testState.lastProfileDuration = duration;
            profileResults.results = [...profileResults.results, {
              name: "Medium Task (100k)",
              duration: `${duration.toFixed(2)}ms`
            }];
            testState.profileCount++;
            testState.status = `Medium task: ${duration.toFixed(2)}ms`;
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Medium Task"),
        button({
          onclick: () => {
            profile.start("heavy-task");
            runHeavyTask(1e6);
            const duration = profile.end("heavy-task") || 0;
            testState.lastProfileDuration = duration;
            profileResults.results = [...profileResults.results, {
              name: "Heavy Task (1M)",
              duration: `${duration.toFixed(2)}ms`
            }];
            testState.profileCount++;
            testState.status = `Heavy task: ${duration.toFixed(2)}ms`;
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Heavy Task"),
        button({
          onclick: () => {
            const report = profile.report();
            console.log("Profile Report:", report);
            testState.status = "Report generated (check console)";
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#8b5cf6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Show Report"),
        button({
          onclick: () => {
            profileResults.results = [];
            testState.status = "Profile results cleared";
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#6b7280",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Clear")
      ])
    ]);
  }
  function testMeasure() {
    const measureResults = state({
      syncResult: 0,
      asyncResult: "",
      syncDuration: 0,
      asyncDuration: 0
    });
    const syncTask = () => {
      let sum = 0;
      for (let i = 0; i < 5e5; i++) {
        sum += i;
      }
      return sum;
    };
    const asyncTask = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return "Async task completed!";
    };
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, "3. Measure Function Test"),
      text({ style: { color: "#666" } }, "Measure synchronous and asynchronous functions"),
      div({
        style: {
          padding: "1.5rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          borderRadius: "12px"
        }
      }, [
        div({ style: { marginBottom: "0.5rem" } }, [
          text({ style: { fontWeight: "bold" } }, "Sync Result: "),
          text(() => String(measureResults.syncResult))
        ]),
        div({ style: { marginBottom: "0.5rem" } }, [
          text({ style: { fontWeight: "bold" } }, "Sync Duration: "),
          text(() => `${measureResults.syncDuration.toFixed(2)}ms`)
        ]),
        div({ style: { marginBottom: "0.5rem" } }, [
          text({ style: { fontWeight: "bold" } }, "Async Result: "),
          text(() => measureResults.asyncResult || "Not run yet")
        ]),
        div({}, [
          text({ style: { fontWeight: "bold" } }, "Async Duration: "),
          text(() => `${measureResults.asyncDuration.toFixed(2)}ms`)
        ])
      ]),
      hbox({ style: { gap: "0.5rem", flexWrap: "wrap" } }, [
        button({
          onclick: () => {
            const result = profile.measure("sync-measure", syncTask);
            const duration = appProfiler.getProfile("sync-measure")?.duration || 0;
            measureResults.syncResult = result;
            measureResults.syncDuration = duration;
            testState.status = `Sync measured: ${duration.toFixed(2)}ms`;
            testState.profileCount++;
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Measure Sync"),
        button({
          onclick: async () => {
            testState.status = "Running async task...";
            const result = await profile.measureAsync("async-measure", asyncTask);
            const duration = appProfiler.getProfile("async-measure")?.duration || 0;
            measureResults.asyncResult = result;
            measureResults.asyncDuration = duration;
            testState.status = `Async measured: ${duration.toFixed(2)}ms`;
            testState.profileCount++;
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Measure Async")
      ])
    ]);
  }
  function testDevToolsIntegration() {
    const devtoolsState = state({
      attached: typeof window !== "undefined" && !!window.__RYNEX_DEVTOOLS__,
      version: "0.1.41"
    });
    return vbox({ style: { gap: "1rem" } }, [
      h3({}, "4. DevTools Integration Test"),
      text({ style: { color: "#666" } }, "Test browser console integration"),
      div({
        style: {
          padding: "1.5rem",
          background: "#000",
          color: "#00ff88",
          borderRadius: "12px",
          fontFamily: "monospace"
        }
      }, [
        div({ style: { marginBottom: "0.5rem" } }, [
          text({ style: { color: "#fff" } }, "> window.__RYNEX_DEVTOOLS__")
        ]),
        div({ style: { marginBottom: "0.5rem" } }, [
          text({ style: { color: "#666" } }, "  Attached: "),
          text(() => devtoolsState.attached ? "Yes \u2713" : "No \u2717")
        ]),
        div({ style: { marginBottom: "0.5rem" } }, [
          text({ style: { color: "#666" } }, "  Version: "),
          text(() => devtoolsState.version)
        ]),
        div({}, [
          text({ style: { color: "#666" } }, "  Available: logger, profiler, inspect, getState")
        ])
      ]),
      hbox({ style: { gap: "0.5rem", flexWrap: "wrap" } }, [
        button({
          onclick: () => {
            if (window.__RYNEX_DEVTOOLS__) {
              window.__RYNEX_DEVTOOLS__.logger.info("DevTools test from UI");
              testState.status = "DevTools logger called (check console)";
            } else {
              testState.status = "DevTools not attached";
            }
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Test Logger"),
        button({
          onclick: () => {
            if (window.__RYNEX_DEVTOOLS__) {
              const report = window.__RYNEX_DEVTOOLS__.profiler.report();
              console.log("DevTools Profiler Report:", report);
              testState.status = "Profiler report shown (check console)";
            } else {
              testState.status = "DevTools not attached";
            }
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Test Profiler"),
        button({
          onclick: () => {
            console.log("Open browser console and type: window.__RYNEX_DEVTOOLS__");
            testState.status = "Check browser console for DevTools API";
          },
          style: {
            padding: "0.75rem 1.5rem",
            background: "#8b5cf6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }
        }, "Show in Console")
      ])
    ]);
  }
  const statusDisplay = div({
    style: {
      position: "sticky",
      top: "0",
      background: "#000",
      color: "#00ff88",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      zIndex: "100"
    }
  }, [
    div({ style: { marginBottom: "0.5rem" } }, [
      text({ style: { fontWeight: "bold", color: "#fff" } }, "Status: "),
      text(() => testState.status)
    ]),
    div({ style: { marginBottom: "0.5rem" } }, [
      text({ style: { fontWeight: "bold", color: "#fff" } }, "Logs Created: "),
      text(() => String(testState.logCount))
    ]),
    div({ style: { marginBottom: "0.5rem" } }, [
      text({ style: { fontWeight: "bold", color: "#fff" } }, "Profiles Run: "),
      text(() => String(testState.profileCount))
    ]),
    div({}, [
      text({ style: { fontWeight: "bold", color: "#fff" } }, "Last Log Level: "),
      text(() => testState.lastLogLevel)
    ])
  ]);
  return div({
    style: {
      padding: "2rem",
      maxWidth: "1000px",
      margin: "0 auto"
    }
  }, [
    h2({ style: { marginBottom: "1rem", color: "#000" } }, text("Developer Tools Test Suite")),
    text({
      style: {
        color: "#666",
        marginBottom: "2rem",
        display: "block",
        fontSize: "1.1rem"
      }
    }, "Testing 3 devtools functions: logger, profiler, devtools integration"),
    statusDisplay,
    vbox({ style: { gap: "3rem" } }, [
      testLogger(),
      testProfiler(),
      testMeasure(),
      testDevToolsIntegration()
    ])
  ]);
}

// index.ts
function TestRunner() {
  return div({
    class: "test-runner",
    style: {
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }
  }, [
    // Header
    div({
      style: {
        background: "#000",
        color: "#fff",
        padding: "2rem",
        textAlign: "center",
        borderBottom: "4px solid #00ff88"
      }
    }, [
      text({ style: { fontSize: "2.5rem", fontWeight: "bold", display: "block", marginBottom: "0.5rem" } }, "Rynex Test Suite"),
      text({ style: { fontSize: "1.1rem", color: "#00ff88" } }, "44 New Functions - Comprehensive Testing")
    ]),
    // Test Tabs
    div({ style: { padding: "2rem 0" } }, [
      tabs({
        tabs: [
          {
            label: "Utilities",
            content: UtilitiesTest()
          },
          {
            label: "Lifecycle",
            content: LifecycleTest()
          },
          {
            label: "Performance",
            content: PerformanceTest()
          },
          {
            label: "Refs",
            content: RefsTest()
          },
          {
            label: "Styles",
            content: StylesTest()
          },
          {
            label: "Components",
            content: ComponentsTest()
          },
          {
            label: "Tailwind CSS",
            content: TailwindTest()
          },
          {
            label: "Animation",
            content: AnimationsTest()
          },
          {
            label: "DevTools",
            content: DevToolsTest()
          }
          /* {
            label: 'State Management',
            content: StateManagementTest()
          } */
        ],
        defaultIndex: 6,
        style: {
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          margin: "0 auto",
          maxWidth: "1200px"
        }
      })
    ]),
    // Footer
    div({
      style: {
        background: "#000",
        color: "#fff",
        padding: "1.5rem",
        textAlign: "center",
        marginTop: "2rem"
      }
    }, [
      text({ style: { color: "#666" } }, "Rynex Framework - Production Ready Testing Suite")
    ])
  ]);
}
var root = document.getElementById("root");
if (root) {
  render(TestRunner, root);
}
//# sourceMappingURL=bundle.js.map
