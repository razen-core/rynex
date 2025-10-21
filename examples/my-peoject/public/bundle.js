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
function container(props, ...children) {
  return createElement("div", props, ...children);
}

// ../../dist/runtime/helpers/basic_elements.js
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

// ../../dist/runtime/helpers/typography.js
function h1(props, ...content) {
  return createElement("h1", props, ...content);
}

// ../../dist/runtime/helpers/semantic.js
function footer(props, ...children) {
  return createElement("footer", props, ...children);
}

// ../../dist/runtime/helpers/media.js
function svg(props, innerHTML) {
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === void 0)
        continue;
      if (key === "style" && typeof value === "object") {
        Object.assign(svgElement.style, value);
      } else if (key === "class" || key === "className") {
        svgElement.setAttribute("class", value);
      } else if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        svgElement.addEventListener(eventName, value);
      } else {
        svgElement.setAttribute(key, String(value));
      }
    }
  }
  if (innerHTML) {
    svgElement.innerHTML = innerHTML;
  }
  return svgElement;
}

// ../../dist/runtime/helpers/components.js
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

// src/App.ts
function App() {
  const appState = state({
    hoveredButton: null
  });
  return container({
    class: "app",
    style: {
      minHeight: "100vh",
      background: "#000000",
      color: "#ffffff",
      fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }
  }, [
    // Main Content Container
    vbox({
      class: "container",
      style: {
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "2.5rem"
      }
    }, [
      // Hero Section
      vbox({
        class: "hero",
        style: {
          textAlign: "center",
          gap: "1.5rem",
          maxWidth: "800px"
        }
      }, [
        // Logo/Badge
        container({
          style: {
            display: "inline-block",
            padding: "0.5rem 1.25rem",
            background: "#0a0a0a",
            border: "1px solid #333333",
            borderRadius: "9999px",
            marginBottom: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 255, 136, 0.1)"
          }
        }, [
          text({
            style: {
              fontSize: "0.875rem",
              color: "#00ff88",
              fontWeight: "600",
              letterSpacing: "0.05em"
            }
          }, "Rynex")
        ]),
        // Main Title
        h1({
          style: {
            fontSize: "4rem",
            fontWeight: "800",
            lineHeight: "1.1",
            margin: "0",
            fontFamily: '"Montserrat", sans-serif',
            background: "linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)",
            webkitBackgroundClip: "text",
            webkitTextFillColor: "transparent",
            backgroundClip: "text"
          }
        }, "Welcome to Rynex"),
        // Subtitle
        text({
          style: {
            fontSize: "1.25rem",
            color: "#b0b0b0",
            lineHeight: "1.6",
            maxWidth: "600px",
            margin: "0 auto"
          }
        }, "A modern, reactive web framework with elegant syntax and powerful features. Build beautiful applications with minimal code and maximum performance."),
        // Button Group
        hbox({
          class: "button-group",
          style: {
            gap: "1rem",
            justifyContent: "center",
            marginTop: "1rem",
            flexWrap: "wrap"
          }
        }, [
          // Documentation Button
          hbox({
            onClick: () => {
              window.open("https://github.com/your-repo/rynex/docs", "_blank");
            },
            style: {
              padding: "0.875rem 2rem",
              background: "#00ff88",
              color: "#000000",
              border: "none",
              borderRadius: "9999px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              boxShadow: "0 4px 6px -1px rgba(0, 255, 136, 0.1)",
              gap: "0.5rem",
              alignItems: "center",
              display: "inline-flex"
            },
            onHover: {
              transform: "translateY(-2px)",
              background: "#00cc6a"
            }
          }, [
            svg({
              viewBox: "0 0 24 24",
              width: "20",
              height: "20",
              fill: "currentColor",
              style: { display: "block" }
            }, '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 10h10v2H7zm0 4h7v2H7z"/>'),
            text({}, "Documentation")
          ]),
          // GitHub Button
          hbox({
            onClick: () => {
              window.open("https://github.com/your-repo/rynex", "_blank");
            },
            style: {
              padding: "0.875rem 2rem",
              background: "#0a0a0a",
              color: "#ffffff",
              border: "1px solid #333333",
              borderRadius: "9999px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              boxShadow: "0 1px 2px rgba(0, 255, 136, 0.1)",
              gap: "0.5rem",
              alignItems: "center",
              display: "inline-flex"
            },
            onHover: {
              transform: "translateY(-2px)",
              borderColor: "#00ff88"
            }
          }, [
            svg({
              viewBox: "0 0 24 24",
              width: "20",
              height: "20",
              fill: "currentColor",
              style: { display: "block" }
            }, '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>'),
            text({}, "GitHub")
          ])
        ])
      ]),
      // Features Grid
      vbox({
        class: "features",
        style: {
          gap: "1.5rem",
          maxWidth: "900px",
          width: "100%"
        }
      }, [
        text({
          style: {
            fontSize: "1.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "1rem",
            fontFamily: '"Montserrat", sans-serif'
          }
        }, "Quick Start Guide"),
        hbox({
          style: {
            gap: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center"
          }
        }, [
          // Feature Card 1
          vbox({
            style: {
              flex: "1",
              minWidth: "250px",
              padding: "1.5rem",
              background: "#0a0a0a",
              border: "1px solid #333333",
              borderRadius: "0.5rem",
              gap: "0.75rem",
              boxShadow: "0 1px 2px rgba(0, 255, 136, 0.1)",
              transition: "all 0.2s ease-in-out"
            }
          }, [
            svg({
              viewBox: "0 0 24 24",
              width: "48",
              height: "48",
              fill: "#00ff88",
              style: { display: "block" }
            }, '<path d="M7 2v11h3v9l7-12h-4l4-8z"/>'),
            text({
              style: {
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#00ff88"
              }
            }, "Reactive by Default"),
            text({
              style: {
                fontSize: "0.875rem",
                color: "#b0b0b0",
                lineHeight: "1.5"
              }
            }, "Built-in reactivity with automatic UI updates. No manual subscriptions needed.")
          ]),
          // Feature Card 2
          vbox({
            style: {
              flex: "1",
              minWidth: "250px",
              padding: "1.5rem",
              background: "#0a0a0a",
              border: "1px solid #333333",
              borderRadius: "0.5rem",
              gap: "0.75rem",
              boxShadow: "0 1px 2px rgba(0, 255, 136, 0.1)",
              transition: "all 0.2s ease-in-out"
            }
          }, [
            svg({
              viewBox: "0 0 24 24",
              width: "48",
              height: "48",
              fill: "#00ff88",
              style: { display: "block" }
            }, '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1 0-.26-.1-.51-.26-.7-.16-.18-.26-.43-.26-.7 0-.55.45-1 1-1h1.18c3.03 0 5.5-2.47 5.5-5.5C20.16 5.79 16.63 2 12 2zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>'),
            text({
              style: {
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#00ff88"
              }
            }, "Clean Syntax"),
            text({
              style: {
                fontSize: "0.875rem",
                color: "#b0b0b0",
                lineHeight: "1.5"
              }
            }, "Elegant API design with TypeScript support for better developer experience.")
          ]),
          // Feature Card 3
          vbox({
            style: {
              flex: "1",
              minWidth: "250px",
              padding: "1.5rem",
              background: "#0a0a0a",
              border: "1px solid #333333",
              borderRadius: "0.5rem",
              gap: "0.75rem",
              boxShadow: "0 1px 2px rgba(0, 255, 136, 0.1)",
              transition: "all 0.2s ease-in-out"
            }
          }, [
            svg({
              viewBox: "0 0 24 24",
              width: "48",
              height: "48",
              fill: "#00ff88",
              style: { display: "block" }
            }, '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>'),
            text({
              style: {
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#00ff88"
              }
            }, "Zero Config"),
            text({
              style: {
                fontSize: "0.875rem",
                color: "#b0b0b0",
                lineHeight: "1.5"
              }
            }, "Start building immediately with sensible defaults and minimal setup.")
          ])
        ])
      ])
    ]),
    // Footer
    footer({
      style: {
        padding: "2rem",
        textAlign: "center",
        borderTop: "1px solid #333333",
        background: "#0a0a0a"
      }
    }, [
      text({
        style: {
          fontSize: "0.875rem",
          color: "#b0b0b0"
        }
      }, "\xA9 2025 Razen Core. Built with \u2764\uFE0F and modern web technologies.")
    ])
  ]);
}

// src/index.ts
var root = document.getElementById("root");
if (root) {
  render(App, root);
}
//# sourceMappingURL=bundle.js.map
