//#region ../../dist/runtime/debug.js
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
//#region ../../dist/runtime/state.js
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
//#region ../../dist/runtime/dom.js
/**
* Create a text node
*/
function createTextNode(text$1) {
	return document.createTextNode(String(text$1));
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
//#region ../../dist/runtime/errors.js
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
//#region ../../dist/runtime/renderer.js
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
//#region ../../dist/runtime/helpers/builder.js
/**
* Base Builder class for all UI components
* Provides chainable methods for styling and configuration
*/
var ElementBuilder = class {
	constructor(tag) {
		this.children = [];
		this.element = document.createElement(tag);
	}
	/**
	* Add children to the element
	*/
	add(children) {
		const childArray = Array.isArray(children) ? children : [children];
		this.children.push(...childArray);
		return this;
	}
	/**
	* Set padding (in rem units)
	*/
	pad(value) {
		const padding = typeof value === "number" ? `${value}rem` : value;
		this.element.style.padding = padding;
		return this;
	}
	/**
	* Set padding for specific sides
	*/
	padX(value) {
		const padding = typeof value === "number" ? `${value}rem` : value;
		this.element.style.paddingLeft = padding;
		this.element.style.paddingRight = padding;
		return this;
	}
	padY(value) {
		const padding = typeof value === "number" ? `${value}rem` : value;
		this.element.style.paddingTop = padding;
		this.element.style.paddingBottom = padding;
		return this;
	}
	/**
	* Set margin (in rem units)
	*/
	margin(value) {
		const margin = typeof value === "number" ? `${value}rem` : value;
		this.element.style.margin = margin;
		return this;
	}
	marginX(value) {
		const margin = typeof value === "number" ? `${value}rem` : value;
		this.element.style.marginLeft = margin;
		this.element.style.marginRight = margin;
		return this;
	}
	marginY(value) {
		const margin = typeof value === "number" ? `${value}rem` : value;
		this.element.style.marginTop = margin;
		this.element.style.marginBottom = margin;
		return this;
	}
	/**
	* Set gap between children (for flex/grid)
	*/
	gap(value) {
		const gap = typeof value === "number" ? `${value}rem` : value;
		this.element.style.gap = gap;
		return this;
	}
	/**
	* Set background color
	*/
	bg(color) {
		this.element.style.backgroundColor = color;
		return this;
	}
	/**
	* Set text color
	*/
	color(color) {
		this.element.style.color = color;
		return this;
	}
	/**
	* Set border radius (in rem units)
	*/
	radius(value) {
		const radius = typeof value === "number" ? `${value}rem` : value;
		this.element.style.borderRadius = radius;
		return this;
	}
	/**
	* Set border
	*/
	border(width, style = "solid", color) {
		const borderWidth = typeof width === "number" ? `${width}px` : width;
		this.element.style.borderWidth = borderWidth;
		this.element.style.borderStyle = style;
		if (color) this.element.style.borderColor = color;
		return this;
	}
	/**
	* Set box shadow
	*/
	shadow(size) {
		const shadows = {
			sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
			md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
			lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
			xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
		};
		this.element.style.boxShadow = shadows[size] || size;
		return this;
	}
	/**
	* Set width
	*/
	width(value) {
		const width = typeof value === "number" ? `${value}px` : value;
		this.element.style.width = width;
		return this;
	}
	/**
	* Set height
	*/
	height(value) {
		const h = typeof value === "number" ? `${value}px` : value;
		this.element.style.height = h;
		return this;
	}
	/**
	* Set max width
	*/
	maxWidth(value) {
		const maxWidth = typeof value === "number" ? `${value}px` : value;
		this.element.style.maxWidth = maxWidth;
		return this;
	}
	/**
	* Set max height
	*/
	maxHeight(value) {
		const maxHeight = typeof value === "number" ? `${value}px` : value;
		this.element.style.maxHeight = maxHeight;
		return this;
	}
	/**
	* Set min width
	*/
	minWidth(value) {
		const minWidth = typeof value === "number" ? `${value}px` : value;
		this.element.style.minWidth = minWidth;
		return this;
	}
	/**
	* Set min height
	*/
	minHeight(value) {
		const minHeight = typeof value === "number" ? `${value}px` : value;
		this.element.style.minHeight = minHeight;
		return this;
	}
	/**
	* Set opacity
	*/
	opacity(value) {
		this.element.style.opacity = String(value);
		return this;
	}
	/**
	* Set cursor style
	*/
	cursor(value) {
		this.element.style.cursor = value;
		return this;
	}
	/**
	* Set overflow
	*/
	overflow(value) {
		this.element.style.overflow = value;
		return this;
	}
	/**
	* Set position
	*/
	position(value) {
		this.element.style.position = value;
		return this;
	}
	/**
	* Set z-index
	*/
	zIndex(value) {
		this.element.style.zIndex = String(value);
		return this;
	}
	/**
	* Set display
	*/
	display(value) {
		this.element.style.display = value;
		return this;
	}
	/**
	* Set flex properties
	*/
	flex(value) {
		this.element.style.flex = typeof value === "number" ? String(value) : value;
		return this;
	}
	/**
	* Set align items
	*/
	align(value) {
		this.element.style.alignItems = value;
		return this;
	}
	/**
	* Set justify content
	*/
	justify(value) {
		this.element.style.justifyContent = value;
		return this;
	}
	/**
	* Set CSS class
	*/
	class(className) {
		this.element.className = className;
		return this;
	}
	/**
	* Add CSS class
	*/
	addClass(className) {
		this.element.classList.add(className);
		return this;
	}
	/**
	* Set ID
	*/
	id(id) {
		this.element.id = id;
		return this;
	}
	/**
	* Set custom style property
	*/
	style(property, value) {
		this.element.style[property] = value;
		return this;
	}
	/**
	* Set multiple styles at once
	*/
	styles(styles) {
		Object.assign(this.element.style, styles);
		return this;
	}
	/**
	* Set attribute
	*/
	attr(name, value) {
		this.element.setAttribute(name, value);
		return this;
	}
	/**
	* Set data attribute
	*/
	data(key, value) {
		this.element.setAttribute(`data-${key}`, value);
		return this;
	}
	/**
	* Add event listener
	*/
	on(event, handler) {
		this.element.addEventListener(event, handler);
		return this;
	}
	/**
	* Add click event listener
	*/
	click(handler) {
		this.element.addEventListener("click", handler);
		return this;
	}
	/**
	* Add hover event listeners
	*/
	hover(onEnter, onLeave) {
		this.element.addEventListener("mouseenter", onEnter);
		if (onLeave) this.element.addEventListener("mouseleave", onLeave);
		return this;
	}
	/**
	* Set hover styles
	*/
	hoverStyle(styles) {
		const originalStyles = {};
		this.element.addEventListener("mouseenter", () => {
			Object.keys(styles).forEach((key) => {
				originalStyles[key] = this.element.style[key];
				this.element.style[key] = styles[key];
			});
		});
		this.element.addEventListener("mouseleave", () => {
			Object.keys(originalStyles).forEach((key) => {
				this.element.style[key] = originalStyles[key];
			});
		});
		return this;
	}
	/**
	* Set ref
	*/
	ref(ref) {
		ref.current = this.element;
		return this;
	}
	/**
	* Mobile responsive configuration (< 768px)
	*/
	mobile(config) {
		this.mobileConfig = config;
		this.applyResponsive();
		return this;
	}
	/**
	* Tablet responsive configuration (768px - 1024px)
	*/
	tablet(config) {
		this.tabletConfig = config;
		this.applyResponsive();
		return this;
	}
	/**
	* Desktop responsive configuration (> 1024px)
	*/
	desktop(config) {
		this.desktopConfig = config;
		this.applyResponsive();
		return this;
	}
	/**
	* Apply responsive styles based on screen size
	*/
	applyResponsive() {
		const applyConfig = () => {
			const width = window.innerWidth;
			let config;
			if (width < 768 && this.mobileConfig) config = this.mobileConfig;
			else if (width >= 768 && width < 1024 && this.tabletConfig) config = this.tabletConfig;
			else if (width >= 1024 && this.desktopConfig) config = this.desktopConfig;
			if (config) Object.entries(config).forEach(([key, value]) => {
				if (key === "pad") {
					const padding = typeof value === "number" ? `${value}rem` : value;
					this.element.style.padding = padding;
				} else if (key === "gap") {
					const gap = typeof value === "number" ? `${value}rem` : value;
					this.element.style.gap = gap;
				} else if (key === "size") {
					const size = typeof value === "number" ? `${value}rem` : value;
					this.element.style.fontSize = size;
				} else this.element.style[key] = value;
			});
		};
		applyConfig();
		window.addEventListener("resize", applyConfig);
	}
	/**
	* Build and return the final element
	*/
	build() {
		if (this.children.length > 0) appendChildren(this.element, this.children);
		return this.element;
	}
};
/**
* Text Builder with reactive content support
*/
var TextBuilder = class extends ElementBuilder {
	constructor(content) {
		super("span");
		this.content = content;
	}
	/**
	* Set font size (in rem units)
	*/
	size(value) {
		const size = typeof value === "number" ? `${value}rem` : value;
		this.element.style.fontSize = size;
		return this;
	}
	/**
	* Set font weight
	*/
	weight(value) {
		this.element.style.fontWeight = String(value);
		return this;
	}
	/**
	* Set text alignment
	*/
	textAlign(value) {
		this.element.style.textAlign = value;
		return this;
	}
	/**
	* Set line height
	*/
	lineHeight(value) {
		this.element.style.lineHeight = typeof value === "number" ? String(value) : value;
		return this;
	}
	/**
	* Set letter spacing
	*/
	letterSpacing(value) {
		this.element.style.letterSpacing = value;
		return this;
	}
	/**
	* Set text transform
	*/
	transform(value) {
		this.element.style.textTransform = value;
		return this;
	}
	/**
	* Set text decoration
	*/
	decoration(value) {
		this.element.style.textDecoration = value;
		return this;
	}
	build() {
		if (this.content) if (typeof this.content === "function") {
			const contentFn = this.content;
			effect(() => {
				this.element.textContent = contentFn();
			});
		} else this.element.textContent = this.content;
		return super.build();
	}
};
/**
* Button Builder
*/
var ButtonBuilder = class extends ElementBuilder {
	constructor(content) {
		super("button");
		this.content = content;
	}
	/**
	* Set font size (in rem units)
	*/
	size(value) {
		const size = typeof value === "number" ? `${value}rem` : value;
		this.element.style.fontSize = size;
		return this;
	}
	/**
	* Set font weight
	*/
	weight(value) {
		this.element.style.fontWeight = String(value);
		return this;
	}
	/**
	* Set button type
	*/
	type(value) {
		this.element.type = value;
		return this;
	}
	/**
	* Set disabled state
	*/
	disabled(value = true) {
		this.element.disabled = value;
		return this;
	}
	build() {
		if (this.content) if (typeof this.content === "function") {
			const contentFn = this.content;
			effect(() => {
				this.element.textContent = contentFn();
			});
		} else this.element.textContent = this.content;
		return super.build();
	}
};
/**
* Input Builder
*/
var InputBuilder = class extends ElementBuilder {
	constructor() {
		super("input");
	}
	/**
	* Set input type
	*/
	type(value) {
		this.element.type = value;
		return this;
	}
	/**
	* Set placeholder
	*/
	placeholder(value) {
		this.element.placeholder = value;
		return this;
	}
	/**
	* Set value
	*/
	value(value) {
		this.element.value = value;
		return this;
	}
	/**
	* Set name
	*/
	name(value) {
		this.element.name = value;
		return this;
	}
	/**
	* Set required
	*/
	required(value = true) {
		this.element.required = value;
		return this;
	}
	/**
	* Set disabled
	*/
	disabled(value = true) {
		this.element.disabled = value;
		return this;
	}
	/**
	* Add input event listener
	*/
	input(handler) {
		this.element.addEventListener("input", handler);
		return this;
	}
	/**
	* Add change event listener
	*/
	change(handler) {
		this.element.addEventListener("change", handler);
		return this;
	}
};

//#endregion
//#region ../../dist/runtime/helpers/layout.js
/**
* Vertical box layout (flex column) - Builder API
*/
var VBoxBuilder = class extends ElementBuilder {
	constructor() {
		super("div");
		this.element.style.display = "flex";
		this.element.style.flexDirection = "column";
	}
};
function vbox() {
	return new VBoxBuilder();
}
/**
* Horizontal box layout (flex row) - Builder API
*/
var HBoxBuilder = class extends ElementBuilder {
	constructor() {
		super("div");
		this.element.style.display = "flex";
		this.element.style.flexDirection = "row";
	}
};
function hbox() {
	return new HBoxBuilder();
}
/**
* Grid layout container - Builder API
*/
var GridBuilder = class extends ElementBuilder {
	constructor() {
		super("div");
		this.element.style.display = "grid";
	}
	/**
	* Set number of columns
	*/
	columns(count) {
		this.element.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
		return this;
	}
	/**
	* Set number of rows
	*/
	rows(count) {
		this.element.style.gridTemplateRows = `repeat(${count}, 1fr)`;
		return this;
	}
	/**
	* Set grid template areas
	*/
	areas(template) {
		this.element.style.gridTemplateAreas = template;
		return this;
	}
	/**
	* Set grid auto flow
	*/
	autoFlow(value) {
		this.element.style.gridAutoFlow = value;
		return this;
	}
};
function grid() {
	return new GridBuilder();
}

//#endregion
//#region ../../dist/runtime/helpers/basic_elements.js
/**
* Text element with reactive getter support - Builder API
* Usage: text('static').build() or text(() => `Count: ${state.count}`).build()
*/
function text(content) {
	return new TextBuilder(content);
}
/**
* Button element with reactive text support - Builder API
* Usage: button('Click').click(() => ...).build()
*/
function button(content) {
	return new ButtonBuilder(content);
}
/**
* Input element - Builder API
*/
function input() {
	return new InputBuilder();
}

//#endregion
//#region ../../dist/runtime/helpers/typography.js
/**
* Heading elements - Builder API
*/
function h1() {
	return new ElementBuilder("h1");
}
function h2() {
	return new ElementBuilder("h2");
}

//#endregion
//#region ../../dist/runtime/helpers/components.js
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
//#region ../../dist/runtime/helpers/devtools.js
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

//#endregion
//#region ../../dist/runtime/browsers.js
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
//#region src/App.ts
function App() {
	const appState = state({
		count: 0,
		todos: [],
		newTodo: ""
	});
	const counterSection = vbox().pad(2).gap(1.5).bg("#ffffff").radius(1).shadow("lg").border(1, "solid", "#e5e7eb").mobile({
		pad: 1,
		gap: 1
	}).add([
		h2().add([text("Interactive Counter").build()]).color("#1f2937").style("fontSize", "1.5rem").style("fontWeight", "bold").style("marginTop", "0").style("marginBottom", "0").build(),
		text(() => `Count: ${appState.count}`).size(2).weight("bold").color("#3b82f6").textAlign("center").build(),
		hbox().gap(.5).justify("center").add([
			button("−").click(() => appState.count--).bg("#ef4444").color("#fff").pad(.75).radius(.5).cursor("pointer").hoverStyle({ backgroundColor: "#dc2626" }).size(1.25).weight("bold").minWidth(50).build(),
			button("Reset").click(() => appState.count = 0).bg("#6b7280").color("#fff").pad(.75).radius(.5).cursor("pointer").hoverStyle({ backgroundColor: "#4b5563" }).build(),
			button("+").click(() => appState.count++).bg("#22c55e").color("#fff").pad(.75).radius(.5).cursor("pointer").hoverStyle({ backgroundColor: "#16a34a" }).size(1.25).weight("bold").minWidth(50).build()
		]).build(),
		text(() => {
			if (appState.count === 0) return "Start counting!";
			if (appState.count > 0) return `Positive: ${appState.count}`;
			return `Negative: ${appState.count}`;
		}).color("#6b7280").textAlign("center").build()
	]).build();
	const todoListContainer = vbox().gap(.5).build();
	effect(() => {
		while (todoListContainer.firstChild) todoListContainer.removeChild(todoListContainer.firstChild);
		if (appState.todos.length === 0) {
			const emptyMsg = text("No todos yet. Add one above!").color("#9ca3af").textAlign("center").pad(1).build();
			todoListContainer.appendChild(emptyMsg);
		} else appState.todos.forEach((todo, index) => {
			const todoItem = hbox().gap(.5).align("center").pad(.75).bg("#f9fafb").radius(.5).border(1, "solid", "#e5e7eb").add([
				text(todo).flex(1).color("#374151").build(),
				button("✓").click(() => {
					appState.todos = appState.todos.filter((_, i) => i !== index);
				}).bg("#22c55e").color("#fff").pad(.5).radius(.25).cursor("pointer").hoverStyle({ backgroundColor: "#16a34a" }).minWidth(30).build(),
				button("✕").click(() => {
					appState.todos = appState.todos.filter((_, i) => i !== index);
				}).bg("#ef4444").color("#fff").pad(.5).radius(.25).cursor("pointer").hoverStyle({ backgroundColor: "#dc2626" }).minWidth(30).build()
			]).build();
			todoListContainer.appendChild(todoItem);
		});
	});
	const inputElement = input().type("text").placeholder("Add a new todo...").value(appState.newTodo).input((e) => {
		appState.newTodo = e.target.value;
	}).flex(1).pad(.75).radius(.5).border(1, "solid", "#d1d5db").build();
	const todoSection = vbox().pad(2).gap(1).bg("#ffffff").radius(1).shadow("lg").border(1, "solid", "#e5e7eb").mobile({ pad: 1 }).add([
		h2().add([text("Todo List").build()]).color("#1f2937").style("fontSize", "1.5rem").style("fontWeight", "bold").style("marginTop", "0").style("marginBottom", "0").build(),
		hbox().gap(.5).add([inputElement, button("Add").click(() => {
			if (appState.newTodo.trim()) {
				appState.todos = [...appState.todos, appState.newTodo.trim()];
				appState.newTodo = "";
				inputElement.value = "";
			}
		}).bg("#3b82f6").color("#fff").pad(.75).radius(.5).cursor("pointer").hoverStyle({ backgroundColor: "#2563eb" }).build()]).build(),
		todoListContainer,
		text(() => `Total: ${appState.todos.length} todo${appState.todos.length !== 1 ? "s" : ""}`).color("#6b7280").size(.875).textAlign("center").build()
	]).build();
	const gridDemo = vbox().pad(2).gap(1.5).bg("#ffffff").radius(1).shadow("lg").border(1, "solid", "#e5e7eb").add([h2().add([text("Responsive Grid").build()]).color("#1f2937").style("fontSize", "1.5rem").style("fontWeight", "bold").style("marginTop", "0").style("marginBottom", "0").build(), grid().columns(3).gap(1).mobile({ gridTemplateColumns: "1fr" }).tablet({ gridTemplateColumns: "repeat(2, 1fr)" }).add([...Array.from({ length: 6 }, (_, i) => vbox().pad(1.5).bg("#f3f4f6").radius(.5).border(2, "solid", "#e5e7eb").align("center").justify("center").minHeight(100).hoverStyle({
		backgroundColor: "#e5e7eb",
		borderColor: "#3b82f6"
	}).add([text(`Card ${i + 1}`).weight("bold").color("#374151").build()]).build())]).build()]).build();
	return vbox().pad(2).gap(2).minHeight("100vh").bg("#f3f4f6").mobile({
		pad: 1,
		gap: 1
	}).add([
		vbox().pad(2).bg("white").radius(1).shadow("xl").add([h1().add([text("Rynex Builder API").build()]).color("black").style("fontSize", "2.5rem").style("fontWeight", "bold").style("textAlign", "center").style("marginTop", "0").style("marginBottom", "0").build(), text("Rust-style chainable methods for modern UI").color("black").textAlign("center").size(1.125).build()]).build(),
		counterSection,
		todoSection,
		gridDemo,
		text("Built with Rynex Builder API").textAlign("center").color("#6b7280").pad(1).build()
	]).build();
}

//#endregion
//#region src/index.ts
const root = document.getElementById("app");
if (root) render(App, root);

//#endregion
//# sourceMappingURL=bundle.js.map