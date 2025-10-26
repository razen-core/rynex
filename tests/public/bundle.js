//#region ../dist/runtime/debug.js
/**
* Rynex Runtime Debugging
* Debug utilities for development
*/
let debugEnabled = false;
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
	const hasDebugParam = new URLSearchParams(window.location.search).get("debug") === "true";
	const hasDebugStorage = localStorage.getItem("rynex-debug") === "true";
	if (hasDebugParam || hasDebugStorage) enableDebug();
}

//#endregion
//#region ../dist/runtime/state.js
let currentEffect = null;
const effectDependencies = /* @__PURE__ */ new WeakMap();
/**
* Create a reactive state object using Proxy
* Any property access is tracked, any property change triggers updates
*/
function state(initialState) {
	const listeners = /* @__PURE__ */ new Set();
	const dependencies = /* @__PURE__ */ new Map();
	const proxy = new Proxy(initialState, {
		get(target, prop, receiver) {
			if (currentEffect) {
				if (!dependencies.has(prop)) dependencies.set(prop, /* @__PURE__ */ new Set());
				dependencies.get(prop).add(currentEffect);
				if (!effectDependencies.has(currentEffect)) effectDependencies.set(currentEffect, /* @__PURE__ */ new Set());
				effectDependencies.get(currentEffect).add(target);
				debugLog("State", `Tracking dependency: ${String(prop)}`);
			}
			return Reflect.get(target, prop, receiver);
		},
		set(target, prop, value, receiver) {
			const oldValue = Reflect.get(target, prop, receiver);
			if (Object.is(oldValue, value)) return true;
			const result = Reflect.set(target, prop, value, receiver);
			if (result) {
				debugLog("State", `Property ${String(prop)} changed from ${oldValue} to ${value}`);
				const propEffects = dependencies.get(prop);
				if (propEffects) propEffects.forEach((effect$1) => {
					queueMicrotask(() => {
						try {
							effect$1();
						} catch (error) {
							console.error("Error in effect:", error);
						}
					});
				});
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
	});
	proxy.__listeners = listeners;
	return proxy;
}
/**
* Run an effect when reactive dependencies change
*/
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

//#endregion
//#region ../dist/runtime/dom.js
/**
* Create a real DOM element (vanilla JavaScript)
* This is the core function that replaces the h() virtual DOM function
*/
function createElement(tag, props = null, ...children) {
	const element = document.createElement(tag);
	if (props) applyProps(element, props);
	appendChildren(element, children);
	debugLog("DOM", `Created element: ${tag}`);
	return element;
}
/**
* Create a text node
*/
function createTextNode(text$1) {
	return document.createTextNode(String(text$1));
}
/**
* Apply properties to a DOM element
*/
function applyProps(element, props) {
	for (const [key, value] of Object.entries(props)) {
		if (value === null || value === void 0) continue;
		if (key.startsWith("on") && typeof value === "function") {
			const eventName = key.slice(2).toLowerCase();
			element.addEventListener(eventName, value);
			debugLog("DOM", `Added event listener: ${eventName}`);
		} else if (key === "class" || key === "className") element.className = value;
		else if (key === "style") {
			if (typeof value === "string") element.setAttribute("style", value);
			else if (typeof value === "object") {
				for (const [styleKey, styleValue] of Object.entries(value)) if (styleValue !== null && styleValue !== void 0) {
					styleKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
					element.style[styleKey] = styleValue;
				}
			}
		} else if (key === "onHover" && typeof value === "object") {
			const hoverStyles = value;
			element.addEventListener("mouseenter", () => {
				for (const [styleKey, styleValue] of Object.entries(hoverStyles)) if (styleValue !== null && styleValue !== void 0) element.style[styleKey] = styleValue;
			});
			const originalStyles = {};
			for (const styleKey of Object.keys(hoverStyles)) originalStyles[styleKey] = element.style[styleKey];
			element.addEventListener("mouseleave", () => {
				for (const [styleKey, styleValue] of Object.entries(originalStyles)) element.style[styleKey] = styleValue;
			});
		} else if (key === "ref" && typeof value === "object" && "current" in value) value.current = element;
		else if (key === "value") element.value = value;
		else if (key === "checked") element.checked = value;
		else if (key.startsWith("data-")) element.setAttribute(key, String(value));
		else if (key.startsWith("aria-")) element.setAttribute(key, String(value));
		else element.setAttribute(key, String(value));
	}
}
/**
* Append children to a DOM element
*/
function appendChildren(parent, children) {
	const flatChildren = children.flat(Infinity);
	for (const child of flatChildren) {
		if (child === null || child === void 0 || child === false || child === true) continue;
		if (typeof child === "string" || typeof child === "number") parent.appendChild(createTextNode(child));
		else if (child instanceof HTMLElement || child instanceof SVGElement || child instanceof Text) parent.appendChild(child);
	}
}
/**
* Mount an element to a container
*/
function mount(element, container$1) {
	container$1.appendChild(element);
	debugLog("DOM", "Mounted element to container");
}
/**
* Unmount an element from its parent
*/
function unmount(element) {
	if (element.parentElement) {
		element.parentElement.removeChild(element);
		debugLog("DOM", "Unmounted element");
	}
}

//#endregion
//#region ../dist/runtime/errors.js
/**
* Rynex Error System
* Comprehensive error handling and validation for the framework
*/
var ErrorSeverity;
(function(ErrorSeverity$1) {
	ErrorSeverity$1["WARNING"] = "warning";
	ErrorSeverity$1["ERROR"] = "error";
	ErrorSeverity$1["CRITICAL"] = "critical";
})(ErrorSeverity || (ErrorSeverity = {}));
var ErrorCategory;
(function(ErrorCategory$1) {
	ErrorCategory$1["VALIDATION"] = "validation";
	ErrorCategory$1["RUNTIME"] = "runtime";
	ErrorCategory$1["DOM"] = "dom";
	ErrorCategory$1["STATE"] = "state";
	ErrorCategory$1["COMPONENT"] = "component";
	ErrorCategory$1["ROUTER"] = "router";
	ErrorCategory$1["LIFECYCLE"] = "lifecycle";
	ErrorCategory$1["PROPS"] = "props";
	ErrorCategory$1["CHILDREN"] = "children";
})(ErrorCategory || (ErrorCategory = {}));
var ErrorHandler = class {
	constructor() {
		this.config = {
			throwOnError: true,
			logErrors: true,
			captureStackTrace: true
		};
		this.errorLog = [];
		this.maxLogSize = 100;
	}
	configure(config) {
		this.config = {
			...this.config,
			...config
		};
	}
	handle(error) {
		this.errorLog.push(error);
		if (this.errorLog.length > this.maxLogSize) this.errorLog.shift();
		if (this.config.logErrors) {
			const style = this.getConsoleStyle(error.severity);
			console.error(`%c${error.toString()}`, style, error.context ? `\nContext:` : "", error.context || "");
			if (this.config.captureStackTrace && error.stack) console.error(error.stack);
		}
		if (this.config.onError) this.config.onError(error);
		if (this.config.throwOnError && error.severity === ErrorSeverity.CRITICAL) throw error;
	}
	getConsoleStyle(severity) {
		switch (severity) {
			case ErrorSeverity.WARNING: return "color: #ffc107; font-weight: bold;";
			case ErrorSeverity.ERROR: return "color: #dc3545; font-weight: bold;";
			case ErrorSeverity.CRITICAL: return "color: #ff0000; font-weight: bold; font-size: 14px;";
			default: return "";
		}
	}
	getErrors() {
		return [...this.errorLog];
	}
	clearErrors() {
		this.errorLog = [];
	}
	getErrorsByCategory(category) {
		return this.errorLog.filter((err) => err.category === category);
	}
	getErrorsBySeverity(severity) {
		return this.errorLog.filter((err) => err.severity === severity);
	}
};
const errorHandler = new ErrorHandler();

//#endregion
//#region ../dist/runtime/renderer.js
const componentInstances = /* @__PURE__ */ new WeakMap();
let renderCounter = 0;
/**
* Render a component to a container element
* Component should return an HTMLElement
*/
function render(component, container$1, props = {}) {
	const instance = {
		element: null,
		container: container$1,
		update: () => {},
		unmount: () => {}
	};
	const update = () => {
		const renderId = ++renderCounter;
		debugLog("Renderer", `Render #${renderId} starting`);
		try {
			const newElement = component(props);
			debugLog("Renderer", `Render #${renderId} component executed`);
			if (!instance.element) {
				debugLog("Renderer", `Render #${renderId} initial mount`);
				mount(newElement, container$1);
				instance.element = newElement;
			} else {
				debugLog("Renderer", `Render #${renderId} updating DOM`);
				if (instance.element.parentElement) instance.element.parentElement.replaceChild(newElement, instance.element);
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
		if (instance.unsubscribe) instance.unsubscribe();
	};
	instance.update = update;
	instance.unmount = unmountFn;
	update();
	componentInstances.set(component, instance);
	return instance;
}

//#endregion
//#region ../dist/runtime/helpers/layout.js
/**
* Vertical box layout (flex column)
*/
function vbox(props, ...children) {
	const style = {
		display: "flex",
		flexDirection: "column",
		...typeof props.style === "object" ? props.style : {}
	};
	return createElement("div", {
		...props,
		style
	}, ...children);
}
/**
* Horizontal box layout (flex row)
*/
function hbox(props, ...children) {
	const style = {
		display: "flex",
		flexDirection: "row",
		...typeof props.style === "object" ? props.style : {}
	};
	return createElement("div", {
		...props,
		style
	}, ...children);
}

//#endregion
//#region ../dist/runtime/helpers/basic_elements.js
/**
* Div element (generic container)
*/
function div(props, ...children) {
	return createElement("div", props, ...children);
}
/**
* Text element with reactive getter support
* Usage: text('static') or text(() => `Count: ${state.count}`) or text({ class: 'foo' }, 'static') or text({ class: 'foo' }, () => `Count: ${state.count}`)
*/
function text(props, content) {
	if (typeof props === "string") return createElement("span", {}, props);
	if (typeof props === "function") {
		const el$1 = createElement("span", {});
		effect(() => {
			el$1.textContent = props();
		});
		return el$1;
	}
	const el = createElement("span", props);
	if (typeof content === "function") effect(() => {
		el.textContent = content();
	});
	else if (content) el.textContent = content;
	return el;
}
/**
* Button element with reactive text support
* Usage: button({ onClick: ... }, 'Click') or button({ onClick: ... }, () => state.show ? 'Hide' : 'Show')
*/
function button(props, content) {
	const el = createElement("button", props);
	if (typeof content === "function") effect(() => {
		el.textContent = content();
	});
	else if (typeof content === "string") el.textContent = content;
	else if (content) (Array.isArray(content) ? content : [content]).forEach((child) => {
		if (typeof child === "string") el.appendChild(document.createTextNode(child));
		else if (child instanceof HTMLElement) el.appendChild(child);
	});
	return el;
}
/**
* Input element
*/
function input(props) {
	return createElement("input", props);
}

//#endregion
//#region ../dist/runtime/helpers/typography.js
function h2(props, ...content) {
	return createElement("h2", props, ...content);
}
function h3(props, ...content) {
	return createElement("h3", props, ...content);
}

//#endregion
//#region ../dist/runtime/helpers/utilities.js
/**
* Lazy load component
* Loads component dynamically when needed
*/
function lazy(loader) {
	let cached = null;
	let loading = null;
	return async () => {
		if (cached) return cached;
		if (loading) return loading.then(() => cached);
		loading = loader().then((module) => {
			cached = module.default;
			loading = null;
			return cached;
		});
		return loading;
	};
}
/**
* Suspense boundary for async components
* Shows fallback while loading
*/
function suspense(props, children) {
	const container$1 = createElement("div", { "data-suspense": "true" });
	container$1.appendChild(props.fallback);
	const loadContent = async () => {
		try {
			const content = await Promise.resolve(children());
			container$1.innerHTML = "";
			container$1.appendChild(content);
		} catch (error) {
			if (props.onError) props.onError(error);
			else console.error("Suspense error:", error);
		}
	};
	loadContent();
	return container$1;
}
/**
* Error boundary component
* Catches errors in child components
*/
function errorBoundary(props, children) {
	const container$1 = createElement("div", { "data-error-boundary": "true" });
	try {
		const content = typeof children === "function" ? children() : children;
		container$1.appendChild(content);
		window.addEventListener("error", (event) => {
			if (container$1.contains(event.target)) {
				event.preventDefault();
				const error = event.error || new Error(event.message);
				if (props.onError) props.onError(error);
				container$1.innerHTML = "";
				container$1.appendChild(props.fallback(error));
			}
		});
	} catch (error) {
		if (props.onError) props.onError(error);
		container$1.appendChild(props.fallback(error));
	}
	return container$1;
}
/**
* Memoize component to prevent unnecessary re-renders
* Caches result based on props equality
*/
function memo(component, areEqual) {
	let lastProps = null;
	let lastResult = null;
	return (props) => {
		if (!lastProps || (areEqual ? !areEqual(lastProps, props) : !shallowEqual(lastProps, props))) {
			lastProps = { ...props };
			lastResult = component(props);
		}
		return lastResult;
	};
}
/**
* Shallow equality check for objects
*/
function shallowEqual(obj1, obj2) {
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);
	if (keys1.length !== keys2.length) return false;
	for (const key of keys1) if (obj1[key] !== obj2[key]) return false;
	return true;
}

//#endregion
//#region ../dist/runtime/helpers/components.js
/**
* Tabs component
*/
function tabs(props) {
	const { tabs: tabsData, defaultIndex = 0, onChange,...restProps } = props;
	let activeIndex = defaultIndex;
	const container$1 = createElement("div", {
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
		style: { padding: "1rem" }
	});
	const updateActiveTab = (index) => {
		activeIndex = index;
		tabContent.innerHTML = "";
		tabContent.appendChild(tabsData[index].content);
		Array.from(tabHeaders.children).forEach((header, i) => {
			const headerEl = header;
			if (i === index) {
				headerEl.style.borderBottom = "2px solid #00ff88";
				headerEl.style.color = "#00ff88";
			} else {
				headerEl.style.borderBottom = "2px solid transparent";
				headerEl.style.color = "#b0b0b0";
			}
		});
		if (onChange) onChange(index);
	};
	tabsData.forEach((tab, index) => {
		const header = createElement("button", {
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
				if (index !== activeIndex) e.target.style.color = "#ffffff";
			},
			onMouseLeave: (e) => {
				if (index !== activeIndex) e.target.style.color = "#b0b0b0";
			}
		});
		header.textContent = tab.label;
		tabHeaders.appendChild(header);
	});
	tabContent.appendChild(tabsData[activeIndex].content);
	container$1.appendChild(tabHeaders);
	container$1.appendChild(tabContent);
	return container$1;
}
/**
* Accordion component
*/
function accordion(props) {
	const { items, allowMultiple = false, defaultOpen = [],...restProps } = props;
	const openIndices = new Set(defaultOpen);
	const container$1 = createElement("div", {
		...restProps,
		class: `accordion ${restProps.class || ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "0.5rem",
			...restProps.style || {}
		}
	});
	const toggleItem = (index, itemContent, icon$1) => {
		if (openIndices.has(index)) {
			openIndices.delete(index);
			itemContent.style.display = "none";
			icon$1.style.transform = "rotate(0deg)";
		} else {
			if (!allowMultiple) {
				openIndices.clear();
				Array.from(container$1.children).forEach((child, i) => {
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
			icon$1.style.transform = "rotate(180deg)";
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
		const icon$1 = createElement("span", {
			class: "accordion-icon",
			style: {
				transition: "transform 0.2s",
				transform: openIndices.has(index) ? "rotate(180deg)" : "rotate(0deg)"
			}
		});
		icon$1.textContent = "▼";
		const header = createElement("button", {
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
		header.appendChild(title);
		header.appendChild(icon$1);
		const content = createElement("div", {
			class: "accordion-content",
			style: {
				padding: "1rem",
				display: openIndices.has(index) ? "block" : "none",
				background: "#000000"
			}
		});
		content.appendChild(item.content);
		header.addEventListener("click", () => toggleItem(index, content, icon$1));
		itemContainer.appendChild(header);
		itemContainer.appendChild(content);
		container$1.appendChild(itemContainer);
	});
	return container$1;
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

//#endregion
//#region ../dist/runtime/helpers/lifecycle.js
/**
* Component mount lifecycle hook
* Executes callback when element is mounted to DOM
*/
function onMount(element, callback) {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) if (mutation.type === "childList") mutation.addedNodes.forEach((node) => {
			if (node === element || node.contains?.(element)) {
				const cleanup = callback();
				if (cleanup && typeof cleanup === "function") {
					element.dataset.cleanup = "registered";
					element.__cleanup = cleanup;
				}
				observer.disconnect();
			}
		});
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
/**
* Component update lifecycle hook
* Executes callback when element attributes or children change
*/
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
/**
* Watch a reactive value and execute callback when it changes
* Returns cleanup function
*/
function watch(getter, callback, options) {
	let oldValue = getter();
	if (options?.immediate) callback(oldValue, oldValue);
	return effect(() => {
		const newValue = getter();
		if (newValue !== oldValue) {
			callback(newValue, oldValue);
			oldValue = newValue;
		}
	});
}
/**
* Watch effect - runs effect immediately and re-runs when dependencies change
* Similar to effect but with explicit cleanup handling
*/
function watchEffect(effectFn) {
	let cleanup;
	const wrappedEffect = () => {
		if (cleanup) cleanup();
		cleanup = effectFn();
	};
	const stopEffect = effect(wrappedEffect);
	return () => {
		if (cleanup) cleanup();
		stopEffect();
	};
}

//#endregion
//#region ../dist/runtime/helpers/performance.js
/**
* Rynex Performance Utilities
* Performance optimization helpers
*/
/**
* Debounce function execution
* Delays execution until after wait time has elapsed since last call
*/
function debounce(func, wait) {
	let timeout = null;
	return function(...args) {
		const context = this;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
			timeout = null;
		}, wait);
	};
}
/**
* Throttle function execution
* Ensures function is called at most once per specified time period
*/
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
/**
* Preload component or resource
* Loads resource in advance for better performance
*/
function preload(loader) {
	const promise = loader();
	if (typeof window !== "undefined") {
		window.__rynexPreloadCache = window.__rynexPreloadCache || /* @__PURE__ */ new Map();
		window.__rynexPreloadCache.set(loader, promise);
	}
	return promise;
}
/**
* Get preloaded resource
* Retrieves previously preloaded resource
*/
function getPreloaded(loader) {
	if (typeof window !== "undefined" && window.__rynexPreloadCache) return window.__rynexPreloadCache.get(loader) || null;
	return null;
}

//#endregion
//#region ../dist/runtime/helpers/refs.js
/**
* Rynex Refs and DOM Access
* Reference management for DOM elements
*/
/**
* Create a ref object
* Used to hold reference to DOM element
*/
function ref(initialValue = null) {
	return { current: initialValue };
}
/**
* Use ref hook
* Creates and returns a ref object
*/
function useRef(initialValue = null) {
	return ref(initialValue);
}
/**
* Forward ref to child component
* Allows parent to access child's DOM element
*/
function forwardRef(component) {
	return (props) => {
		const internalRef = props.ref || ref();
		const element = component(props, internalRef);
		if (internalRef) internalRef.current = element;
		return element;
	};
}
/**
* Merge multiple refs into one
* Useful when you need to forward ref and use it internally
*/
function mergeRefs(...refs) {
	return (element) => {
		refs.forEach((ref$1) => {
			if (!ref$1) return;
			if (typeof ref$1 === "function") ref$1(element);
			else ref$1.current = element;
		});
	};
}

//#endregion
//#region ../dist/runtime/helpers/styles.js
let currentTheme = {};
const themeListeners = /* @__PURE__ */ new Set();
/**
* Set application theme
*/
function setTheme(theme) {
	currentTheme = {
		...currentTheme,
		...theme
	};
	themeListeners.forEach((listener) => listener(currentTheme));
}
/**
* Use theme hook
* Returns current theme and updates when theme changes
*/
function useTheme(callback) {
	callback(currentTheme);
	themeListeners.add(callback);
	return () => {
		themeListeners.delete(callback);
	};
}
/**
* Styled component creator
* Creates a component with predefined styles
*/
function styled(tag, styles) {
	return (props, ...children) => {
		const computedStyles = typeof styles === "function" ? styles(props) : styles;
		return createElement(tag, {
			...props,
			style: {
				...typeof props.style === "object" ? props.style : {},
				...computedStyles
			}
		}, ...children);
	};
}
/**
* Conditional class names helper
* Combines class names based on conditions
*/
function classNames(...args) {
	const classes = [];
	args.forEach((arg) => {
		if (!arg) return;
		if (typeof arg === "string") classes.push(arg);
		else if (typeof arg === "object") Object.entries(arg).forEach(([key, value]) => {
			if (value) classes.push(key);
		});
	});
	return classes.join(" ");
}
/**
* Merge style objects
* Deep merges multiple style objects
*/
function mergeStyles(...styles) {
	const merged = {};
	styles.forEach((style) => {
		if (!style) return;
		Object.entries(style).forEach(([key, value]) => {
			if (value !== null && value !== void 0) merged[key] = value;
		});
	});
	return merged;
}

//#endregion
//#region ../dist/runtime/helpers/animations.js
/**
* Transition wrapper - applies CSS transitions to elements
* Usage: transition(element, { duration: 300, easing: 'ease-in-out' })
*/
function transition(element, config = {}) {
	if (!element || !(element instanceof HTMLElement)) {
		debugWarn("Animation", "Invalid element provided to transition");
		return element;
	}
	const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
	try {
		element.style.transition = `all ${duration}ms ${easing} ${delay}ms`;
		debugLog("Animation", `Transition applied: ${duration}ms ${easing}`);
		if (onStart) onStart();
		if (onEnd) element.addEventListener("transitionend", () => onEnd(), { once: true });
	} catch (error) {
		debugWarn("Animation", "Error applying transition:", error);
	}
	return element;
}
/**
* Animate - Web Animations API wrapper
* Usage: animate(element, { keyframes: [{ opacity: 0 }, { opacity: 1 }], duration: 300 })
*/
function animate(element, config) {
	if (!element || !(element instanceof HTMLElement)) {
		debugWarn("Animation", "Invalid element provided to animate");
		return null;
	}
	const { keyframes, duration = 300, easing = "ease", delay = 0, iterations = 1, direction = "normal", fill = "both", onStart, onEnd } = config;
	try {
		if (onStart) onStart();
		const animation = element.animate(keyframes, {
			duration,
			easing,
			delay,
			iterations,
			direction,
			fill
		});
		debugLog("Animation", `Animation started: ${duration}ms`);
		if (onEnd) animation.onfinish = () => onEnd();
		return animation;
	} catch (error) {
		debugWarn("Animation", "Error creating animation:", error);
		return null;
	}
}
/**
* Fade transition - fade in/out
* Usage: fade(element, 'in', { duration: 300 })
*/
function fade(element, direction = "in", config = {}) {
	if (!element || !(element instanceof HTMLElement)) {
		debugWarn("Animation", "Invalid element provided to fade");
		return null;
	}
	const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
	const currentOpacity = window.getComputedStyle(element).opacity;
	let keyframes;
	if (direction === "toggle") direction = parseFloat(currentOpacity) > .5 ? "out" : "in";
	if (direction === "in") keyframes = [{ opacity: 0 }, { opacity: 1 }];
	else keyframes = [{ opacity: 1 }, { opacity: 0 }];
	return animate(element, {
		keyframes,
		duration,
		easing,
		delay,
		onStart,
		onEnd
	});
}
/**
* Slide transition - slide in/out
* Usage: slide(element, 'down', { duration: 300 })
*/
function slide(element, direction = "down", config = {}) {
	if (!element || !(element instanceof HTMLElement)) {
		debugWarn("Animation", "Invalid element provided to slide");
		return null;
	}
	const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
	let keyframes;
	switch (direction) {
		case "up":
			keyframes = [{
				transform: "translateY(100%)",
				opacity: 0
			}, {
				transform: "translateY(0)",
				opacity: 1
			}];
			break;
		case "down":
			keyframes = [{
				transform: "translateY(-100%)",
				opacity: 0
			}, {
				transform: "translateY(0)",
				opacity: 1
			}];
			break;
		case "left":
			keyframes = [{
				transform: "translateX(100%)",
				opacity: 0
			}, {
				transform: "translateX(0)",
				opacity: 1
			}];
			break;
		case "right":
			keyframes = [{
				transform: "translateX(-100%)",
				opacity: 0
			}, {
				transform: "translateX(0)",
				opacity: 1
			}];
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
/**
* Scale transition - scale in/out
* Usage: scale(element, 'in', { duration: 300 })
*/
function scale(element, direction = "in", config = {}) {
	if (!element || !(element instanceof HTMLElement)) {
		debugWarn("Animation", "Invalid element provided to scale");
		return null;
	}
	const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
	const currentTransform = window.getComputedStyle(element).transform;
	let keyframes;
	if (direction === "toggle") direction = currentTransform !== "none" && currentTransform.includes("scale") ? "out" : "in";
	if (direction === "in") keyframes = [{
		transform: "scale(0)",
		opacity: 0
	}, {
		transform: "scale(1)",
		opacity: 1
	}];
	else keyframes = [{
		transform: "scale(1)",
		opacity: 1
	}, {
		transform: "scale(0)",
		opacity: 0
	}];
	return animate(element, {
		keyframes,
		duration,
		easing,
		delay,
		onStart,
		onEnd
	});
}
/**
* Rotate transition - rotate element
* Usage: rotate(element, 360, { duration: 300 })
*/
function rotate(element, degrees = 360, config = {}) {
	if (!element || !(element instanceof HTMLElement)) {
		debugWarn("Animation", "Invalid element provided to rotate");
		return null;
	}
	const { duration = 300, easing = "ease", delay = 0, onStart, onEnd } = config;
	return animate(element, {
		keyframes: [{ transform: "rotate(0deg)" }, { transform: `rotate(${degrees}deg)` }],
		duration,
		easing,
		delay,
		onStart,
		onEnd
	});
}

//#endregion
//#region ../dist/runtime/helpers/devtools.js
/**
* Rynex Developer Tools
* Debugging, logging, and performance profiling utilities
*/
/**
* Logger levels
*/
var LogLevel;
(function(LogLevel$1) {
	LogLevel$1[LogLevel$1["DEBUG"] = 0] = "DEBUG";
	LogLevel$1[LogLevel$1["INFO"] = 1] = "INFO";
	LogLevel$1[LogLevel$1["WARN"] = 2] = "WARN";
	LogLevel$1[LogLevel$1["ERROR"] = 3] = "ERROR";
	LogLevel$1[LogLevel$1["NONE"] = 4] = "NONE";
})(LogLevel || (LogLevel = {}));
/**
* Logger class for structured logging
*/
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
		if (this.config.prefix) parts.push(this.config.prefix);
		if (this.config.timestamp) parts.push(`[${(/* @__PURE__ */ new Date()).toISOString()}]`);
		parts.push(`[${level}]`);
		parts.push(message);
		return parts.join(" ");
	}
	logToConsole(level, message, data, color) {
		try {
			const formatted = this.formatMessage(level, message, data);
			if (this.config.colors && color) console.log(`%c${formatted}`, `color: ${color}`, data || "");
			else console.log(formatted, data || "");
		} catch (error) {
			console.error("Logger error:", error);
		}
	}
	debug(message, data) {
		if (!message) return;
		if (this.shouldLog(LogLevel.DEBUG)) {
			this.logToConsole("DEBUG", message, data, "#888");
			this.logs.push({
				level: "DEBUG",
				message,
				timestamp: Date.now(),
				data
			});
		}
	}
	info(message, data) {
		if (!message) return;
		if (this.shouldLog(LogLevel.INFO)) {
			this.logToConsole("INFO", message, data, "#2196F3");
			this.logs.push({
				level: "INFO",
				message,
				timestamp: Date.now(),
				data
			});
		}
	}
	warn(message, data) {
		if (!message) return;
		if (this.shouldLog(LogLevel.WARN)) {
			this.logToConsole("WARN", message, data, "#FF9800");
			this.logs.push({
				level: "WARN",
				message,
				timestamp: Date.now(),
				data
			});
		}
	}
	error(message, data) {
		if (!message) return;
		if (this.shouldLog(LogLevel.ERROR)) {
			this.logToConsole("ERROR", message, data, "#F44336");
			this.logs.push({
				level: "ERROR",
				message,
				timestamp: Date.now(),
				data
			});
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
/**
* Global logger instance
*/
let globalLogger = null;
/**
* Create or get logger instance
*/
function logger(config) {
	if (!globalLogger || config) globalLogger = new Logger(config);
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
			if (globalLogger) globalLogger.debug(`Profile started: ${name}`, metadata);
		} catch (error) {
			console.error("Error starting profile:", error);
		}
	}
	end(name) {
		if (!name || typeof name !== "string") {
			console.warn("Profile name must be a non-empty string");
			return;
		}
		const entry = this.profiles.get(name);
		if (!entry) {
			console.warn(`Profile "${name}" not found`);
			return;
		}
		try {
			entry.endTime = performance.now();
			entry.duration = entry.endTime - entry.startTime;
			this.completed.push(entry);
			this.profiles.delete(name);
			if (globalLogger) globalLogger.debug(`Profile ended: ${name}`, {
				duration: `${entry.duration.toFixed(2)}ms`,
				...entry.metadata
			});
			return entry.duration;
		} catch (error) {
			console.error("Error ending profile:", error);
			return;
		}
	}
	measure(name, fn, metadata) {
		if (!name || typeof name !== "string") {
			console.warn("Profile name must be a non-empty string");
			return;
		}
		if (typeof fn !== "function") {
			console.warn("Second argument must be a function");
			return;
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
			return;
		}
		if (typeof fn !== "function") {
			console.warn("Second argument must be a function");
			return;
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
		return this.completed.find((p$1) => p$1.name === name);
	}
	getAllProfiles() {
		return [...this.completed];
	}
	getAverageDuration(name) {
		const profiles = this.completed.filter((p$1) => p$1.name === name);
		if (profiles.length === 0) return 0;
		return profiles.reduce((sum, p$1) => sum + (p$1.duration || 0), 0) / profiles.length;
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
		const names = new Set(this.completed.map((p$1) => p$1.name));
		const summary = {};
		names.forEach((name) => {
			const profiles = this.completed.filter((p$1) => p$1.name === name);
			const durations = profiles.map((p$1) => p$1.duration || 0);
			summary[name] = {
				count: profiles.length,
				total: durations.reduce((a, b) => a + b, 0).toFixed(2) + "ms",
				average: (durations.reduce((a, b) => a + b, 0) / profiles.length).toFixed(2) + "ms",
				min: Math.min(...durations).toFixed(2) + "ms",
				max: Math.max(...durations).toFixed(2) + "ms"
			};
		});
		return summary;
	}
};
/**
* Global profiler instance
*/
let globalProfiler = null;
/**
* Get profiler instance
*/
function profiler() {
	if (!globalProfiler) globalProfiler = new Profiler();
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
		if (this.config.enabled) this.attachToWindow();
	}
	attachToWindow() {
		if (typeof window !== "undefined") {
			window.__RYNEX_DEVTOOLS__ = {
				logger: this.logger,
				profiler: this.profiler,
				version: "0.1.55",
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
		return { message: "State inspection not yet implemented" };
	}
	enable() {
		this.config.enabled = true;
		this.attachToWindow();
	}
	disable() {
		this.config.enabled = false;
		if (typeof window !== "undefined") delete window.__RYNEX_DEVTOOLS__;
	}
};
/**
* Global devtools instance
*/
let globalDevTools = null;
/**
* Initialize or get devtools
*/
function devtools(config) {
	if (!globalDevTools || config) globalDevTools = new DevTools(config);
	return globalDevTools;
}
/**
* Quick access functions
*/
const log = {
	debug: (msg, data) => logger().debug(msg, data),
	info: (msg, data) => logger().info(msg, data),
	warn: (msg, data) => logger().warn(msg, data),
	error: (msg, data) => logger().error(msg, data)
};
const profile = {
	start: (name, metadata) => profiler().start(name, metadata),
	end: (name) => profiler().end(name),
	measure: (name, fn, metadata) => profiler().measure(name, fn, metadata),
	measureAsync: (name, fn, metadata) => profiler().measureAsync(name, fn, metadata),
	report: () => profiler().report()
};

//#endregion
//#region ../dist/runtime/browsers.js
let isInitialized = false;
/**
* Native browser detection using userAgent
*/
function detectBrowserFromUA() {
	const ua = navigator.userAgent;
	let name = "Unknown";
	let version = "0";
	let engine = "Unknown";
	if (ua.includes("Firefox/")) {
		name = "Firefox";
		version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || "0";
		engine = "Gecko";
	} else if (ua.includes("Edg/")) {
		name = "Microsoft Edge";
		version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || "0";
		engine = "Blink";
	} else if (ua.includes("Chrome/")) {
		name = "Chrome";
		version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || "0";
		engine = "Blink";
	} else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
		name = "Safari";
		version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || "0";
		engine = "WebKit";
	}
	return {
		name,
		version,
		engine
	};
}
/**
* Detect platform type
*/
function detectPlatform() {
	const ua = navigator.userAgent;
	if (/Mobile|Android|iPhone|iPad|iPod/.test(ua)) return /iPad|Tablet/.test(ua) ? "tablet" : "mobile";
	return "desktop";
}
/**
* Detect browser and capabilities
*/
function detectBrowser() {
	const browserInfo = detectBrowserFromUA();
	const platform = detectPlatform();
	return {
		name: browserInfo.name,
		version: browserInfo.version,
		platform,
		engine: browserInfo.engine,
		isChrome: browserInfo.name === "Chrome",
		isFirefox: browserInfo.name === "Firefox",
		isSafari: browserInfo.name === "Safari",
		isEdge: browserInfo.name === "Microsoft Edge",
		isMobile: platform === "mobile" || platform === "tablet",
		supportsProxy: typeof Proxy !== "undefined",
		supportsIntersectionObserver: "IntersectionObserver" in window,
		supportsResizeObserver: "ResizeObserver" in window,
		supportsSmoothScroll: "scrollBehavior" in document.documentElement.style,
		supportsFetch: "fetch" in window,
		supportsCustomElements: "customElements" in window
	};
}
/**
* Initialize browser fixes and optimizations
* Should be called once at application startup
*/
function initializeBrowserSupport(options = {}) {
	if (isInitialized) {
		debugWarn("Browser", "Browser support already initialized");
		return detectBrowser();
	}
	const { enableSmoothScroll = true, verbose = false } = options;
	debugLog("Browser", "Initializing cross-browser support...");
	const capabilities = detectBrowser();
	if (verbose) console.log("🌐 Rynex Browser Detection:", {
		browser: `${capabilities.name} ${capabilities.version}`,
		platform: capabilities.platform,
		engine: capabilities.engine,
		mobile: capabilities.isMobile
	});
	applyBrowserFixes(capabilities);
	isInitialized = true;
	debugLog("Browser", "✅ Cross-browser support initialized successfully");
	return capabilities;
}
/**
* Apply browser-specific fixes and workarounds
*/
function applyBrowserFixes(capabilities) {
	if (capabilities.isFirefox) {
		debugLog("Browser", "Applying Firefox-specific fixes...");
		fixFirefoxScrollbar();
		fixFirefoxFlexbox();
		fixFirefoxEvents();
		fixFirefoxTransforms();
	}
	if (capabilities.isSafari) {
		debugLog("Browser", "Applying Safari-specific fixes...");
		fixSafariDateParsing();
		fixSafariFlexbox();
		fixSafariScrolling();
		fixSafariEvents();
		fixSafariBackdropFilter();
	}
	if (capabilities.isMobile) {
		debugLog("Browser", "Applying mobile-specific fixes...");
		fixMobileViewportHeight();
		fixMobileTouchEvents();
		fixMobileInputZoom();
	}
	applyGeneralFixes();
}
/**
* Firefox scrollbar width fix
*/
function fixFirefoxScrollbar() {
	const style = document.createElement("style");
	style.textContent = `
    /* Firefox scrollbar normalization */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
    }
  `;
	document.head.appendChild(style);
}
/**
* Firefox flexbox rendering fix
*/
function fixFirefoxFlexbox() {
	const style = document.createElement("style");
	style.textContent = `
    /* Firefox flexbox fixes */
    @-moz-document url-prefix() {
      .flex, [style*="display: flex"], [style*="display:flex"] {
        min-height: 0;
        min-width: 0;
      }
    }
  `;
	document.head.appendChild(style);
}
/**
* Firefox event handling fixes
*/
function fixFirefoxEvents() {
	const originalAddEventListener = EventTarget.prototype.addEventListener;
	EventTarget.prototype.addEventListener = function(type, listener, options) {
		if (type === "wheel" && typeof listener === "function") {
			const wrappedListener = function(event) {
				const wheelEvent = event;
				if (wheelEvent.deltaMode === 1) {
					const lineHeight = parseInt(getComputedStyle(document.documentElement).lineHeight) || 16;
					Object.defineProperty(wheelEvent, "deltaY", {
						value: wheelEvent.deltaY * lineHeight,
						writable: false
					});
				}
				return listener.call(this, wheelEvent);
			};
			return originalAddEventListener.call(this, type, wrappedListener, options);
		}
		return originalAddEventListener.call(this, type, listener, options);
	};
}
/**
* Firefox CSS transform fixes
*/
function fixFirefoxTransforms() {
	const style = document.createElement("style");
	style.textContent = `
    /* Firefox transform rendering fixes */
    @-moz-document url-prefix() {
      [style*="transform"] {
        will-change: transform;
        backface-visibility: hidden;
      }
    }
  `;
	document.head.appendChild(style);
}
/**
* Safari date parsing fix
*/
function fixSafariDateParsing() {
	const originalParse = Date.parse;
	Date.parse = function(dateString) {
		if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateString)) dateString = dateString.replace(/-/g, "/");
		return originalParse(dateString);
	};
}
/**
* Safari flexbox fixes
*/
function fixSafariFlexbox() {
	const style = document.createElement("style");
	style.textContent = `
    /* Safari flexbox fixes */
    @supports (-webkit-appearance: none) {
      .flex, [style*="display: flex"], [style*="display:flex"] {
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
      }
      
      /* Fix Safari flex shrink bug */
      [style*="flex:"] {
        flex-shrink: 1;
      }
    }
  `;
	document.head.appendChild(style);
}
/**
* Safari scroll momentum fix
*/
function fixSafariScrolling() {
	const style = document.createElement("style");
	style.textContent = `
    /* Safari smooth scrolling */
    * {
      -webkit-overflow-scrolling: touch;
    }
    
    html {
      scroll-behavior: smooth;
    }
  `;
	document.head.appendChild(style);
}
/**
* Safari event timing fixes
*/
function fixSafariEvents() {
	const originalRAF = window.requestAnimationFrame;
	window.requestAnimationFrame = function(callback) {
		return originalRAF.call(window, (time) => {
			return callback(time || performance.now());
		});
	};
}
/**
* Safari backdrop-filter support
*/
function fixSafariBackdropFilter() {
	const style = document.createElement("style");
	style.textContent = `
    /* Safari backdrop-filter support */
    @supports ((-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))) {
      [style*="backdrop-filter"] {
        -webkit-backdrop-filter: inherit;
      }
    }
  `;
	document.head.appendChild(style);
}
/**
* Mobile viewport height fix (100vh issue)
*/
function fixMobileViewportHeight() {
	const setVH = () => {
		const vh = window.innerHeight * .01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	};
	setVH();
	window.addEventListener("resize", setVH);
	window.addEventListener("orientationchange", setVH);
	const style = document.createElement("style");
	style.textContent = `
    /* Mobile viewport height fix */
    .h-screen, .min-h-screen, [style*="height: 100vh"] {
      height: calc(var(--vh, 1vh) * 100);
    }
  `;
	document.head.appendChild(style);
	debugLog("Browser", "✓ Mobile viewport height fixed (use --vh CSS variable)");
}
/**
* Mobile touch event fixes
*/
function fixMobileTouchEvents() {
	let lastTouchEnd = 0;
	document.addEventListener("touchend", (event) => {
		const now = Date.now();
		if (now - lastTouchEnd <= 300) event.preventDefault();
		lastTouchEnd = now;
	}, { passive: false });
	const style = document.createElement("style");
	style.textContent = `
    /* Mobile touch optimization */
    * {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
    }
    
    button, a, input, select, textarea {
      touch-action: manipulation;
    }
  `;
	document.head.appendChild(style);
}
/**
* Mobile input zoom prevention
*/
function fixMobileInputZoom() {
	const style = document.createElement("style");
	style.textContent = `
    /* Prevent mobile input zoom */
    input, select, textarea {
      font-size: 16px !important;
    }
  `;
	document.head.appendChild(style);
}
/**
* General cross-browser fixes
*/
function applyGeneralFixes() {
	const style = document.createElement("style");
	style.textContent = `
    /* Cross-browser normalization */
    *, *::before, *::after {
      box-sizing: border-box;
    }
    
    /* Consistent rendering */
    html {
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    
    /* Smooth scrolling for all browsers */
    html {
      scroll-behavior: smooth;
    }
    
    /* Prevent horizontal overflow */
    body {
      overflow-x: hidden;
    }
    
    /* Better font rendering */
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    
    /* Fix focus outline */
    :focus:not(:focus-visible) {
      outline: none;
    }
    
    :focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  `;
	document.head.appendChild(style);
	if (!window.console) window.console = {
		log: () => {},
		warn: () => {},
		error: () => {},
		info: () => {},
		debug: () => {}
	};
	if (!window.performance) window.performance = { now: () => Date.now() };
	debugLog("Browser", "✓ General cross-browser fixes applied");
}
/**
* Auto-initialize on import (can be disabled by calling before import)
*/
if (typeof window !== "undefined" && typeof document !== "undefined") {
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => {
		if (!isInitialized) initializeBrowserSupport({ verbose: false });
	});
	else if (!isInitialized) initializeBrowserSupport({ verbose: false });
}

//#endregion
//#region test-utilities.ts
function UtilitiesTest() {
	return div({
		class: "test-container",
		style: {
			padding: "2rem",
			maxWidth: "800px",
			margin: "0 auto"
		}
	}, [
		div({ style: { marginBottom: "2rem" } }, [text({ style: {
			fontSize: "2rem",
			fontWeight: "bold"
		} }, "Utilities Test Suite"), text({ style: {
			display: "block",
			color: "#666",
			marginTop: "0.5rem"
		} }, "Testing lazy, suspense, errorBoundary, and memo")]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [
			text({ style: {
				fontSize: "1.25rem",
				fontWeight: "bold",
				marginBottom: "1rem",
				display: "block"
			} }, "Test 1: Lazy Loading"),
			button({
				style: {
					padding: "0.5rem 1rem",
					background: "#00ff88",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer"
				},
				onClick: async () => {
					const result = (await lazy(() => Promise.resolve({ default: () => text({ style: { color: "green" } }, "Lazy component loaded!") }))())();
					document.getElementById("lazy-result").appendChild(result);
				}
			}, "Load Lazy Component"),
			div({
				id: "lazy-result",
				style: { marginTop: "1rem" }
			})
		]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 2: Suspense"), suspense({
			fallback: text({ style: { color: "#666" } }, "Loading..."),
			onError: (error) => console.error("Suspense error:", error)
		}, async () => {
			await new Promise((resolve) => setTimeout(resolve, 1e3));
			return text({ style: { color: "blue" } }, "Content loaded after 1 second!");
		})]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 3: Error Boundary"), errorBoundary({
			fallback: (error) => text({ style: { color: "red" } }, `Error caught: ${error.message}`),
			onError: (error) => console.log("Error boundary caught:", error)
		}, () => {
			return text({ style: { color: "green" } }, "No errors here!");
		})]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 4: Memo"), (() => {
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
		})()]),
		div({ style: {
			padding: "1rem",
			background: "#f0f0f0",
			borderRadius: "8px"
		} }, [text({ style: { fontWeight: "bold" } }, "All utility tests completed successfully!")])
	]);
}

//#endregion
//#region test-lifecycle.ts
function LifecycleTest() {
	const testState = state({
		count: 0,
		message: "Initial message",
		mountLog: [],
		updateLog: []
	});
	return div({
		class: "test-container",
		style: {
			padding: "2rem",
			maxWidth: "800px",
			margin: "0 auto"
		}
	}, [
		div({ style: { marginBottom: "2rem" } }, [text({ style: {
			fontSize: "2rem",
			fontWeight: "bold"
		} }, "Lifecycle Hooks Test Suite"), text({ style: {
			display: "block",
			color: "#666",
			marginTop: "0.5rem"
		} }, "Testing onMount, onUnmount, onUpdate, watch, watchEffect")]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [
			text({ style: {
				fontSize: "1.25rem",
				fontWeight: "bold",
				marginBottom: "1rem",
				display: "block"
			} }, "Test 1: onMount"),
			(() => {
				const mountTest = div({
					id: "mount-test",
					style: {
						padding: "0.5rem",
						background: "#f0f0f0"
					}
				}, [text({}, "This element will log when mounted")]);
				onMount(mountTest, () => {
					testState.mountLog.push("Element mounted at " + (/* @__PURE__ */ new Date()).toLocaleTimeString());
					console.log("onMount triggered");
				});
				return mountTest;
			})(),
			div({
				id: "mount-log",
				style: {
					marginTop: "1rem",
					color: "green"
				}
			})
		]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 2: onUpdate"), (() => {
			const updateTest = div({
				id: "update-test",
				style: {
					padding: "0.5rem",
					background: "#f0f0f0"
				}
			}, [text({}, "Click button to update this element")]);
			onUpdate(updateTest, (mutations) => {
				testState.updateLog.push(`Updated: ${mutations.length} mutations`);
				console.log("onUpdate triggered:", mutations);
			});
			return div({}, [updateTest, button({
				style: {
					marginTop: "0.5rem",
					padding: "0.5rem 1rem",
					background: "#00ff88",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer"
				},
				onClick: () => {
					updateTest.appendChild(text({ style: { display: "block" } }, "Updated at " + (/* @__PURE__ */ new Date()).toLocaleTimeString()));
				}
			}, "Trigger Update")]);
		})()]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 3: watch"), (() => {
			const watchResult = div({ id: "watch-result" });
			watch(() => testState.count, (newVal, oldVal) => {
				watchResult.appendChild(text({ style: {
					display: "block",
					color: "blue"
				} }, `Count changed from ${oldVal} to ${newVal}`));
			});
			return div({}, [
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: () => {
						testState.count++;
					}
				}, "Increment Count"),
				text({ style: { marginLeft: "1rem" } }, () => `Current: ${testState.count}`),
				watchResult
			]);
		})()]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 4: watchEffect"), (() => {
			const effectResult = div({ id: "effect-result" });
			watchEffect(() => {
				effectResult.textContent = `Message: ${testState.message} (Count: ${testState.count})`;
			});
			return div({}, [
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						marginRight: "0.5rem"
					},
					onClick: () => {
						testState.message = "Updated at " + (/* @__PURE__ */ new Date()).toLocaleTimeString();
					}
				}, "Update Message"),
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: () => {
						testState.count++;
					}
				}, "Increment"),
				div({ style: {
					marginTop: "1rem",
					padding: "0.5rem",
					background: "#f0f0f0"
				} }, [effectResult])
			]);
		})()]),
		div({ style: {
			padding: "1rem",
			background: "#f0f0f0",
			borderRadius: "8px"
		} }, [text({ style: { fontWeight: "bold" } }, "All lifecycle tests initialized successfully!")])
	]);
}

//#endregion
//#region test-performance.ts
function PerformanceTest() {
	let debounceCount = 0;
	let throttleCount = 0;
	let normalCount = 0;
	return div({
		class: "test-container",
		style: {
			padding: "2rem",
			maxWidth: "800px",
			margin: "0 auto"
		}
	}, [
		div({ style: { marginBottom: "2rem" } }, [text({ style: {
			fontSize: "2rem",
			fontWeight: "bold"
		} }, "Performance Utilities Test Suite"), text({ style: {
			display: "block",
			color: "#666",
			marginTop: "0.5rem"
		} }, "Testing debounce, throttle, and preload")]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [
			text({ style: {
				fontSize: "1.25rem",
				fontWeight: "bold",
				marginBottom: "1rem",
				display: "block"
			} }, "Test 1: Debounce"),
			text({ style: {
				display: "block",
				marginBottom: "0.5rem"
			} }, "Type in the input - debounced function will execute 500ms after you stop typing"),
			(() => {
				const debounceResult = div({
					id: "debounce-result",
					style: {
						marginTop: "1rem",
						color: "blue"
					}
				});
				const debouncedFn = debounce((value) => {
					debounceCount++;
					debounceResult.textContent = `Debounced called ${debounceCount} times. Value: ${value}`;
				}, 500);
				return div({}, [
					input({
						type: "text",
						placeholder: "Type here...",
						style: {
							padding: "0.5rem",
							width: "100%",
							border: "1px solid #ddd",
							borderRadius: "4px"
						},
						onInput: (e) => {
							const target = e.target;
							normalCount++;
							debouncedFn(target.value);
							document.getElementById("normal-count").textContent = `Normal input events: ${normalCount}`;
						}
					}),
					div({
						id: "normal-count",
						style: {
							marginTop: "0.5rem",
							color: "#666"
						}
					}, "Normal input events: 0"),
					debounceResult
				]);
			})()
		]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [
			text({ style: {
				fontSize: "1.25rem",
				fontWeight: "bold",
				marginBottom: "1rem",
				display: "block"
			} }, "Test 2: Throttle"),
			text({ style: {
				display: "block",
				marginBottom: "0.5rem"
			} }, "Click rapidly - throttled function will execute at most once per 1000ms"),
			(() => {
				const throttleResult = div({
					id: "throttle-result",
					style: {
						marginTop: "1rem",
						color: "green"
					}
				});
				let clickCount = 0;
				const throttledFn = throttle(() => {
					throttleCount++;
					throttleResult.textContent = `Throttled called ${throttleCount} times`;
				}, 1e3);
				return div({}, [
					button({
						style: {
							padding: "0.5rem 1rem",
							background: "#00ff88",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer"
						},
						onClick: () => {
							clickCount++;
							throttledFn();
							document.getElementById("click-count").textContent = `Total clicks: ${clickCount}`;
						}
					}, "Click Me Rapidly!"),
					div({
						id: "click-count",
						style: {
							marginTop: "0.5rem",
							color: "#666"
						}
					}, "Total clicks: 0"),
					throttleResult
				]);
			})()
		]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 3: Preload"), (() => {
			const preloadResult = div({
				id: "preload-result",
				style: { marginTop: "1rem" }
			});
			const dataLoader = () => new Promise((resolve) => {
				setTimeout(() => resolve("Preloaded data!"), 1e3);
			});
			return div({}, [
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						marginRight: "0.5rem"
					},
					onClick: async () => {
						preloadResult.textContent = "Preloading...";
						const startTime = Date.now();
						await preload(dataLoader);
						preloadResult.textContent = `Preloaded in ${Date.now() - startTime}ms`;
					}
				}, "Preload Data"),
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#4CAF50",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: async () => {
						if (getPreloaded(dataLoader)) preloadResult.textContent = "Retrieved from cache instantly!";
						else {
							preloadResult.textContent = "Not in cache, loading...";
							preloadResult.textContent = `Loaded: ${await dataLoader()}`;
						}
					}
				}, "Get Preloaded"),
				preloadResult
			]);
		})()]),
		div({ style: {
			padding: "1rem",
			background: "#f0f0f0",
			borderRadius: "8px"
		} }, [text({ style: { fontWeight: "bold" } }, "All performance tests initialized successfully!")])
	]);
}

//#endregion
//#region test-refs.ts
function RefsTest() {
	return div({
		class: "test-container",
		style: {
			padding: "2rem",
			maxWidth: "800px",
			margin: "0 auto"
		}
	}, [
		div({ style: { marginBottom: "2rem" } }, [text({ style: {
			fontSize: "2rem",
			fontWeight: "bold"
		} }, "Refs and DOM Access Test Suite"), text({ style: {
			display: "block",
			color: "#666",
			marginTop: "0.5rem"
		} }, "Testing ref, useRef, forwardRef, and mergeRefs")]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 1: Basic Ref"), (() => {
			const inputRef = ref();
			const resultDiv = div({
				id: "ref-result",
				style: {
					marginTop: "1rem",
					color: "blue"
				}
			});
			const inputEl = input({
				type: "text",
				placeholder: "Type something...",
				style: {
					padding: "0.5rem",
					width: "100%",
					border: "1px solid #ddd",
					borderRadius: "4px"
				}
			});
			inputRef.current = inputEl;
			return div({}, [
				inputEl,
				button({
					style: {
						marginTop: "0.5rem",
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: () => {
						if (inputRef.current) {
							resultDiv.textContent = `Input value via ref: ${inputRef.current.value}`;
							inputRef.current.focus();
						}
					}
				}, "Get Value & Focus"),
				resultDiv
			]);
		})()]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 2: useRef"), (() => {
			const divRef = useRef();
			const resultDiv = div({
				id: "useref-result",
				style: { marginTop: "1rem" }
			});
			const targetDiv = div({ style: {
				padding: "1rem",
				background: "#f0f0f0",
				borderRadius: "4px"
			} }, [text({}, "Target div for useRef")]);
			divRef.current = targetDiv;
			return div({}, [
				targetDiv,
				button({
					style: {
						marginTop: "0.5rem",
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: () => {
						if (divRef.current) {
							divRef.current.style.background = "#" + Math.floor(Math.random() * 16777215).toString(16);
							resultDiv.textContent = `Background color changed via useRef`;
						}
					}
				}, "Change Background Color"),
				resultDiv
			]);
		})()]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 3: forwardRef"), (() => {
			const CustomInput = forwardRef((props, ref$1) => {
				const inputEl = input({
					type: "text",
					placeholder: props.placeholder,
					style: {
						padding: "0.5rem",
						width: "100%",
						border: "2px solid #00ff88",
						borderRadius: "4px"
					}
				});
				ref$1.current = inputEl;
				return inputEl;
			});
			const forwardedRef = ref();
			const resultDiv = div({
				id: "forward-result",
				style: {
					marginTop: "1rem",
					color: "green"
				}
			});
			return div({}, [
				CustomInput({
					placeholder: "Custom input with forwarded ref",
					ref: forwardedRef
				}),
				button({
					style: {
						marginTop: "0.5rem",
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: () => {
						if (forwardedRef.current) resultDiv.textContent = `Value from forwarded ref: ${forwardedRef.current.value}`;
					}
				}, "Get Value"),
				resultDiv
			]);
		})()]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 4: mergeRefs"), (() => {
			const ref1 = ref();
			const ref2 = ref();
			const resultDiv = div({
				id: "merge-result",
				style: { marginTop: "1rem" }
			});
			const targetDiv = div({ style: {
				padding: "1rem",
				background: "#f0f0f0",
				borderRadius: "4px"
			} }, [text({}, "Target div with merged refs")]);
			mergeRefs(ref1, ref2)(targetDiv);
			return div({}, [
				targetDiv,
				button({
					style: {
						marginTop: "0.5rem",
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						marginRight: "0.5rem"
					},
					onClick: () => {
						if (ref1.current) {
							ref1.current.style.borderLeft = "4px solid blue";
							resultDiv.textContent = "Ref1 accessed successfully";
						}
					}
				}, "Use Ref1"),
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#4CAF50",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: () => {
						if (ref2.current) {
							ref2.current.style.borderRight = "4px solid red";
							resultDiv.textContent = "Ref2 accessed successfully";
						}
					}
				}, "Use Ref2"),
				resultDiv
			]);
		})()]),
		div({ style: {
			padding: "1rem",
			background: "#f0f0f0",
			borderRadius: "8px"
		} }, [text({ style: { fontWeight: "bold" } }, "All refs tests initialized successfully!")])
	]);
}

//#endregion
//#region test-styles.ts
function StylesTest() {
	const testState = state({
		isActive: false,
		isDanger: false
	});
	return div({
		class: "test-container",
		style: {
			padding: "2rem",
			maxWidth: "800px",
			margin: "0 auto"
		}
	}, [
		div({ style: { marginBottom: "2rem" } }, [text({ style: {
			fontSize: "2rem",
			fontWeight: "bold"
		} }, "Style Utilities Test Suite"), text({ style: {
			display: "block",
			color: "#666",
			marginTop: "0.5rem"
		} }, "Testing styled, classNames, mergeStyles, and theme")]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 1: Styled Components"), (() => {
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
			return div({}, [StyledButton({}, "Styled Button"), div({ style: { marginTop: "1rem" } }, [
				DynamicStyledDiv({ variant: "primary" }, [text({}, "Primary variant")]),
				div({ style: { height: "0.5rem" } }),
				DynamicStyledDiv({ variant: "secondary" }, [text({}, "Secondary variant")])
			])]);
		})()]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 2: classNames"), (() => {
			const resultDiv = div({
				class: classNames("base-class", { "active": testState.isActive }, { "danger": testState.isDanger }, testState.isActive && "highlighted"),
				style: {
					padding: "1rem",
					background: "#f0f0f0",
					borderRadius: "4px",
					marginTop: "1rem"
				}
			}, [text({}, () => `Classes: ${classNames("base-class", { "active": testState.isActive }, { "danger": testState.isDanger })}`)]);
			return div({}, [
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						marginRight: "0.5rem"
					},
					onClick: () => {
						testState.isActive = !testState.isActive;
					}
				}, "Toggle Active"),
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#ff5555",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: () => {
						testState.isDanger = !testState.isDanger;
					}
				}, "Toggle Danger"),
				resultDiv
			]);
		})()]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 3: mergeStyles"), (() => {
			return div({}, [div({ style: mergeStyles({
				padding: "1rem",
				background: "#f0f0f0",
				borderRadius: "4px"
			}, testState.isActive ? {
				background: "#00ff88",
				color: "#000",
				fontWeight: "bold"
			} : {}) }, [text({}, () => testState.isActive ? "Active styles merged!" : "Base styles only")]), button({
				style: {
					marginTop: "0.5rem",
					padding: "0.5rem 1rem",
					background: "#00ff88",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer"
				},
				onClick: () => {
					testState.isActive = !testState.isActive;
				}
			}, "Toggle Merge")]);
		})()]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [text({ style: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			marginBottom: "1rem",
			display: "block"
		} }, "Test 4: Theme"), (() => {
			const themeResult = div({
				id: "theme-result",
				style: {
					marginTop: "1rem",
					padding: "1rem",
					background: "#f0f0f0",
					borderRadius: "4px"
				}
			});
			useTheme((theme) => {
				themeResult.textContent = `Current theme: ${JSON.stringify(theme)}`;
			});
			return div({}, [
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#00ff88",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						marginRight: "0.5rem"
					},
					onClick: () => {
						setTheme({
							mode: "dark",
							primary: "#00ff88",
							secondary: "#666"
						});
					}
				}, "Set Dark Theme"),
				button({
					style: {
						padding: "0.5rem 1rem",
						background: "#4CAF50",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					onClick: () => {
						setTheme({
							mode: "light",
							primary: "#007bff",
							secondary: "#ccc"
						});
					}
				}, "Set Light Theme"),
				themeResult
			]);
		})()]),
		div({ style: {
			padding: "1rem",
			background: "#f0f0f0",
			borderRadius: "8px"
		} }, [text({ style: { fontWeight: "bold" } }, "All style tests initialized successfully!")])
	]);
}

//#endregion
//#region test-components.ts
function ComponentsTest() {
	const testState = state({
		activeTab: 0,
		tabChangeCount: 0
	});
	return div({
		class: "test-container",
		style: {
			padding: "2rem",
			maxWidth: "800px",
			margin: "0 auto"
		}
	}, [
		div({ style: { marginBottom: "2rem" } }, [text({ style: {
			fontSize: "2rem",
			fontWeight: "bold"
		} }, "UI Components Test Suite"), text({ style: {
			display: "block",
			color: "#666",
			marginTop: "0.5rem"
		} }, "Testing tabs and accordion components")]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [
			text({ style: {
				fontSize: "1.25rem",
				fontWeight: "bold",
				marginBottom: "1rem",
				display: "block"
			} }, "Test 1: Tabs Component"),
			tabs({
				tabs: [
					{
						label: "Overview",
						content: div({ style: { padding: "1rem" } }, [text({ style: {
							fontSize: "1.1rem",
							fontWeight: "bold",
							display: "block",
							marginBottom: "0.5rem"
						} }, "Overview Tab"), text({ style: {
							display: "block",
							color: "#666"
						} }, "This is the overview content. Tabs allow you to organize content into separate views.")])
					},
					{
						label: "Features",
						content: div({ style: { padding: "1rem" } }, [text({ style: {
							fontSize: "1.1rem",
							fontWeight: "bold",
							display: "block",
							marginBottom: "0.5rem"
						} }, "Features Tab"), div({}, [
							text({ style: {
								display: "block",
								marginBottom: "0.25rem"
							} }, "- Easy to use API"),
							text({ style: {
								display: "block",
								marginBottom: "0.25rem"
							} }, "- Customizable styling"),
							text({ style: {
								display: "block",
								marginBottom: "0.25rem"
							} }, "- Keyboard navigation"),
							text({ style: { display: "block" } }, "- onChange callback support")
						])])
					},
					{
						label: "Settings",
						content: div({ style: { padding: "1rem" } }, [text({ style: {
							fontSize: "1.1rem",
							fontWeight: "bold",
							display: "block",
							marginBottom: "0.5rem"
						} }, "Settings Tab"), text({ style: {
							display: "block",
							color: "#666"
						} }, "Configure your preferences here. This tab demonstrates dynamic content loading.")])
					}
				],
				defaultIndex: 0,
				onChange: (index) => {
					testState.activeTab = index;
					testState.tabChangeCount++;
				},
				style: {
					background: "#fff",
					borderRadius: "8px"
				}
			}),
			div({ style: {
				marginTop: "1rem",
				padding: "0.5rem",
				background: "#f0f0f0",
				borderRadius: "4px"
			} }, [text({}, () => `Active tab: ${testState.activeTab}, Changes: ${testState.tabChangeCount}`)])
		]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [
			text({ style: {
				fontSize: "1.25rem",
				fontWeight: "bold",
				marginBottom: "1rem",
				display: "block"
			} }, "Test 2: Accordion Component"),
			text({ style: {
				display: "block",
				marginBottom: "1rem",
				color: "#666"
			} }, "Single item open at a time:"),
			accordion({
				items: [
					{
						title: "What is Rynex?",
						content: div({ style: { color: "#666" } }, [text({}, "Rynex is a modern, reactive web framework that provides a clean API for building user interfaces without the complexity of virtual DOM.")])
					},
					{
						title: "How does reactivity work?",
						content: div({ style: { color: "#666" } }, [text({}, "Rynex uses JavaScript Proxies to track state changes and automatically update the DOM when state changes occur.")])
					},
					{
						title: "Is it production ready?",
						content: div({ style: { color: "#666" } }, [text({}, "Yes! Rynex is production-ready with comprehensive TypeScript support and a growing ecosystem of components.")])
					}
				],
				allowMultiple: false,
				defaultOpen: [0]
			})
		]),
		div({ style: {
			marginBottom: "2rem",
			padding: "1rem",
			border: "1px solid #ddd",
			borderRadius: "8px"
		} }, [
			text({ style: {
				fontSize: "1.25rem",
				fontWeight: "bold",
				marginBottom: "1rem",
				display: "block"
			} }, "Test 3: Accordion (Multiple Open)"),
			text({ style: {
				display: "block",
				marginBottom: "1rem",
				color: "#666"
			} }, "Multiple items can be open simultaneously:"),
			accordion({
				items: [
					{
						title: "Installation",
						content: div({ style: { color: "#666" } }, [text({ style: {
							display: "block",
							fontFamily: "monospace",
							background: "#f0f0f0",
							padding: "0.5rem",
							borderRadius: "4px"
						} }, "npm install rynex")])
					},
					{
						title: "Quick Start",
						content: div({ style: { color: "#666" } }, [
							text({ style: {
								display: "block",
								marginBottom: "0.25rem"
							} }, "1. Import Rynex functions"),
							text({ style: {
								display: "block",
								marginBottom: "0.25rem"
							} }, "2. Create your component"),
							text({ style: { display: "block" } }, "3. Render to DOM")
						])
					},
					{
						title: "Documentation",
						content: div({ style: { color: "#666" } }, [text({}, "Visit our comprehensive documentation at docs.rynex.dev for detailed guides and API references.")])
					}
				],
				allowMultiple: true,
				defaultOpen: [0, 1]
			})
		]),
		div({ style: {
			padding: "1rem",
			background: "#f0f0f0",
			borderRadius: "8px"
		} }, [text({ style: { fontWeight: "bold" } }, "All component tests initialized successfully!")])
	]);
}

//#endregion
//#region test-tailwind.ts
function TailwindTest() {
	return div({ class: "min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8" }, [vbox({ class: "bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full space-y-6" }, [
		text({ class: "text-4xl font-bold text-gray-800 text-center mb-4" }, "🎨 Tailwind CSS Test"),
		text({
			class: "text-lg text-gray-600 text-center mb-8",
			text: "Testing class detection: class: \"flex items-center\""
		}),
		hbox({ class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
			div({ class: "bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow" }, [text({
				class: "text-xl font-semibold text-blue-700 mb-2",
				text: "Flexbox"
			}), text({
				class: "text-gray-600",
				text: "flex, items-center, justify-between"
			})]),
			div({ class: "bg-purple-50 border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow" }, [text({
				class: "text-xl font-semibold text-purple-700 mb-2",
				text: "Colors"
			}), text({
				class: "text-gray-600",
				text: "bg-blue-500, text-white, border-gray-300"
			})]),
			div({ class: "bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow" }, [text({
				class: "text-xl font-semibold text-green-700 mb-2",
				text: "Spacing"
			}), text({
				class: "text-gray-600",
				text: "p-4, m-2, gap-4, space-y-2"
			})]),
			div({ class: "bg-red-50 border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition-shadow" }, [text({
				class: "text-xl font-semibold text-red-700 mb-2",
				text: "Responsive"
			}), text({
				class: "text-gray-600",
				text: "sm:text-sm, md:text-base, lg:text-lg"
			})])
		]),
		hbox({ class: "flex gap-4 justify-center mt-8" }, [button({
			class: "bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105",
			text: "Primary Button",
			onclick: () => console.log("Primary clicked!")
		}), button({
			class: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors",
			text: "Secondary Button",
			onclick: () => console.log("Secondary clicked!")
		})]),
		div({ class: "mt-8 p-4 bg-green-100 border-l-4 border-green-500 rounded" }, [text({
			class: "text-green-800 font-semibold",
			text: "✅ If you see styled content, Tailwind CSS is working!"
		})])
	])]);
}

//#endregion
//#region test-animations.ts
function AnimationsTest() {
	const testState = state({
		status: "Ready to test animations",
		lastAnimation: "None",
		animationCount: 0
	});
	function createTestBox(label$1) {
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
		}, text(label$1));
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
			hbox({ style: {
				gap: "0.5rem",
				flexWrap: "wrap"
			} }, [
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
			hbox({ style: {
				gap: "0.5rem",
				flexWrap: "wrap"
			} }, [
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
				}, "↑ Up"),
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
				}, "↓ Down"),
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
				}, "← Left"),
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
				}, "→ Right")
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
			hbox({ style: {
				gap: "0.5rem",
				flexWrap: "wrap"
			} }, [
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
			testState.status = "Rotating 360°...";
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
			testState.status = "Rotating 180°...";
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
			testState.status = "Rotating -360°...";
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
			hbox({ style: {
				gap: "0.5rem",
				flexWrap: "wrap"
			} }, [
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
				}, "360°"),
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
				}, "180°"),
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
				}, "-360°")
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
					{
						transform: "translateX(0) rotate(0deg)",
						background: "#667eea"
					},
					{
						transform: "translateX(50px) rotate(180deg)",
						background: "#f093fb"
					},
					{
						transform: "translateX(0) rotate(360deg)",
						background: "#667eea"
					}
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
	const statusDisplay = div({ style: {
		position: "sticky",
		top: "0",
		background: "#000",
		color: "#00ff88",
		padding: "1rem",
		borderRadius: "8px",
		marginBottom: "2rem",
		boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
		zIndex: "100"
	} }, [
		div({ style: { marginBottom: "0.5rem" } }, [text({ style: {
			fontWeight: "bold",
			color: "#fff"
		} }, "Status: "), text(() => testState.status)]),
		div({ style: { marginBottom: "0.5rem" } }, [text({ style: {
			fontWeight: "bold",
			color: "#fff"
		} }, "Last Animation: "), text(() => testState.lastAnimation)]),
		div({}, [text({ style: {
			fontWeight: "bold",
			color: "#fff"
		} }, "Animations Run: "), text(() => String(testState.animationCount))])
	]);
	return div({ style: {
		padding: "2rem",
		maxWidth: "1000px",
		margin: "0 auto"
	} }, [
		h2({ style: {
			marginBottom: "1rem",
			color: "#000"
		} }, text("Animation & Transitions Test Suite")),
		text({ style: {
			color: "#666",
			marginBottom: "2rem",
			display: "block",
			fontSize: "1.1rem"
		} }, "Testing 6 animation functions: transition, animate, fade, slide, scale, rotate"),
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

//#endregion
//#region test-devtools.ts
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
	devtools({ enabled: true });
	function testLogger() {
		const logOutput = state({ logs: [] });
		const addLog = (level, message) => {
			logOutput.logs = [...logOutput.logs, `[${level}] ${message}`];
			if (logOutput.logs.length > 10) logOutput.logs = logOutput.logs.slice(-10);
		};
		return vbox({ style: { gap: "1rem" } }, [
			h3({}, "1. Logger Test"),
			text({ style: { color: "#666" } }, "Test different log levels and structured logging"),
			div({ style: {
				padding: "1.5rem",
				background: "#1f2937",
				color: "#00ff88",
				borderRadius: "12px",
				fontFamily: "monospace",
				fontSize: "0.9rem",
				maxHeight: "200px",
				overflowY: "auto"
			} }, [(() => {
				if (logOutput.logs.length === 0) return div({}, text("No logs yet..."));
				return vbox({ style: { gap: "0.25rem" } }, logOutput.logs.map((logMsg) => div({}, text(logMsg))));
			})()]),
			hbox({ style: {
				gap: "0.5rem",
				flexWrap: "wrap"
			} }, [
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
		const profileResults = state({ results: [] });
		const runHeavyTask = (iterations) => {
			let sum = 0;
			for (let i = 0; i < iterations; i++) sum += Math.sqrt(i) * Math.random();
			return sum;
		};
		return vbox({ style: { gap: "1rem" } }, [
			h3({}, "2. Profiler Test"),
			text({ style: { color: "#666" } }, "Measure performance of operations"),
			div({ style: {
				padding: "1.5rem",
				background: "#f3f4f6",
				borderRadius: "12px"
			} }, [div({ style: { marginBottom: "1rem" } }, [text({ style: {
				fontWeight: "bold",
				color: "#000"
			} }, "Last Duration: "), text(() => `${testState.lastProfileDuration.toFixed(2)}ms`)]), div({ style: {
				background: "#fff",
				padding: "1rem",
				borderRadius: "8px",
				maxHeight: "150px",
				overflowY: "auto"
			} }, [(() => {
				if (profileResults.results.length === 0) return div({}, text("No profiles yet..."));
				return vbox({ style: { gap: "0.5rem" } }, profileResults.results.map((result) => div({ style: {
					display: "flex",
					justifyContent: "space-between"
				} }, [text({ style: {
					fontWeight: "600",
					color: "#667eea"
				} }, result.name), text({ style: { color: "#10b981" } }, result.duration)])));
			})()])]),
			hbox({ style: {
				gap: "0.5rem",
				flexWrap: "wrap"
			} }, [
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
			for (let i = 0; i < 5e5; i++) sum += i;
			return sum;
		};
		const asyncTask = async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return "Async task completed!";
		};
		return vbox({ style: { gap: "1rem" } }, [
			h3({}, "3. Measure Function Test"),
			text({ style: { color: "#666" } }, "Measure synchronous and asynchronous functions"),
			div({ style: {
				padding: "1.5rem",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				color: "#fff",
				borderRadius: "12px"
			} }, [
				div({ style: { marginBottom: "0.5rem" } }, [text({ style: { fontWeight: "bold" } }, "Sync Result: "), text(() => String(measureResults.syncResult))]),
				div({ style: { marginBottom: "0.5rem" } }, [text({ style: { fontWeight: "bold" } }, "Sync Duration: "), text(() => `${measureResults.syncDuration.toFixed(2)}ms`)]),
				div({ style: { marginBottom: "0.5rem" } }, [text({ style: { fontWeight: "bold" } }, "Async Result: "), text(() => measureResults.asyncResult || "Not run yet")]),
				div({}, [text({ style: { fontWeight: "bold" } }, "Async Duration: "), text(() => `${measureResults.asyncDuration.toFixed(2)}ms`)])
			]),
			hbox({ style: {
				gap: "0.5rem",
				flexWrap: "wrap"
			} }, [button({
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
			}, "Measure Sync"), button({
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
			}, "Measure Async")])
		]);
	}
	function testDevToolsIntegration() {
		const devtoolsState = state({
			attached: typeof window !== "undefined" && !!window.__RYNEX_DEVTOOLS__,
			version: "0.1.55"
		});
		return vbox({ style: { gap: "1rem" } }, [
			h3({}, "4. DevTools Integration Test"),
			text({ style: { color: "#666" } }, "Test browser console integration"),
			div({ style: {
				padding: "1.5rem",
				background: "#000",
				color: "#00ff88",
				borderRadius: "12px",
				fontFamily: "monospace"
			} }, [
				div({ style: { marginBottom: "0.5rem" } }, [text({ style: { color: "#fff" } }, "> window.__RYNEX_DEVTOOLS__")]),
				div({ style: { marginBottom: "0.5rem" } }, [text({ style: { color: "#666" } }, "  Attached: "), text(() => devtoolsState.attached ? "Yes ✓" : "No ✗")]),
				div({ style: { marginBottom: "0.5rem" } }, [text({ style: { color: "#666" } }, "  Version: "), text(() => devtoolsState.version)]),
				div({}, [text({ style: { color: "#666" } }, "  Available: logger, profiler, inspect, getState")])
			]),
			hbox({ style: {
				gap: "0.5rem",
				flexWrap: "wrap"
			} }, [
				button({
					onclick: () => {
						if (window.__RYNEX_DEVTOOLS__) {
							window.__RYNEX_DEVTOOLS__.logger.info("DevTools test from UI");
							testState.status = "DevTools logger called (check console)";
						} else testState.status = "DevTools not attached";
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
						} else testState.status = "DevTools not attached";
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
	const statusDisplay = div({ style: {
		position: "sticky",
		top: "0",
		background: "#000",
		color: "#00ff88",
		padding: "1rem",
		borderRadius: "8px",
		marginBottom: "2rem",
		boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
		zIndex: "100"
	} }, [
		div({ style: { marginBottom: "0.5rem" } }, [text({ style: {
			fontWeight: "bold",
			color: "#fff"
		} }, "Status: "), text(() => testState.status)]),
		div({ style: { marginBottom: "0.5rem" } }, [text({ style: {
			fontWeight: "bold",
			color: "#fff"
		} }, "Logs Created: "), text(() => String(testState.logCount))]),
		div({ style: { marginBottom: "0.5rem" } }, [text({ style: {
			fontWeight: "bold",
			color: "#fff"
		} }, "Profiles Run: "), text(() => String(testState.profileCount))]),
		div({}, [text({ style: {
			fontWeight: "bold",
			color: "#fff"
		} }, "Last Log Level: "), text(() => testState.lastLogLevel)])
	]);
	return div({ style: {
		padding: "2rem",
		maxWidth: "1000px",
		margin: "0 auto"
	} }, [
		h2({ style: {
			marginBottom: "1rem",
			color: "#000"
		} }, text("Developer Tools Test Suite")),
		text({ style: {
			color: "#666",
			marginBottom: "2rem",
			display: "block",
			fontSize: "1.1rem"
		} }, "Testing 3 devtools functions: logger, profiler, devtools integration"),
		statusDisplay,
		vbox({ style: { gap: "3rem" } }, [
			testLogger(),
			testProfiler(),
			testMeasure(),
			testDevToolsIntegration()
		])
	]);
}

//#endregion
//#region index.ts
function TestRunner() {
	return div({
		class: "test-runner",
		style: {
			minHeight: "100vh",
			background: "#f5f5f5",
			fontFamily: "system-ui, -apple-system, sans-serif"
		}
	}, [
		div({ style: {
			background: "#000",
			color: "#fff",
			padding: "2rem",
			textAlign: "center",
			borderBottom: "4px solid #00ff88"
		} }, [text({ style: {
			fontSize: "2.5rem",
			fontWeight: "bold",
			display: "block",
			marginBottom: "0.5rem"
		} }, "Rynex Test Suite"), text({ style: {
			fontSize: "1.1rem",
			color: "#00ff88"
		} }, "44 New Functions - Comprehensive Testing")]),
		div({ style: { padding: "2rem 0" } }, [tabs({
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
			],
			defaultIndex: 6,
			style: {
				background: "#fff",
				boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
				margin: "0 auto",
				maxWidth: "1200px"
			}
		})]),
		div({ style: {
			background: "#000",
			color: "#fff",
			padding: "1.5rem",
			textAlign: "center",
			marginTop: "2rem"
		} }, [text({ style: { color: "#666" } }, "Rynex Framework - Production Ready Testing Suite")])
	]);
}
const root = document.getElementById("root");
if (root) render(TestRunner, root);

//#endregion
//# sourceMappingURL=bundle.js.map