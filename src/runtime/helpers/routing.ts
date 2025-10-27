/**
 * Routing Helper Functions
 * UI components and utilities for routing
 * Now with Builder API support
 */

import { createElement } from "../dom.js";
import {
  Router,
  RouteContext,
  createLink as createRouterLink,
} from "../router.js";
import { ElementBuilder } from "./builder.js";

/**
 * Link component - Builder API
 */
export class LinkBuilder extends ElementBuilder<HTMLAnchorElement> {
  private toPath: string = "/";
  private activeClassName: string = "";
  private isExact: boolean = false;

  constructor(to?: string) {
    super("a");
    if (to) this.toPath = to;
    this.element.href = this.toPath;
  }

  to(path: string): this {
    this.toPath = path;
    this.element.href = path;
    return this;
  }

  activeClass(className: string): this {
    this.activeClassName = className;
    return this;
  }

  exact(value: boolean = true): this {
    this.isExact = value;
    return this;
  }

  build(): HTMLAnchorElement {
    if (this.activeClassName) {
      const updateActiveClass = () => {
        const currentPath = window.location.pathname;
        const isActive = this.isExact
          ? currentPath === this.toPath
          : currentPath.startsWith(this.toPath);

        if (isActive) {
          this.element.classList.add(this.activeClassName);
        } else {
          this.element.classList.remove(this.activeClassName);
        }
      };

      updateActiveClass();
      window.addEventListener("popstate", updateActiveClass);
    }

    return super.build();
  }
}

export function link(to?: string): LinkBuilder {
  return new LinkBuilder(to);
}

// Legacy support
export function Link(
  props: {
    to: string;
    class?: string;
    style?: Partial<CSSStyleDeclaration>;
    activeClass?: string;
    exact?: boolean;
  },
  children: string | HTMLElement | (string | HTMLElement)[],
): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = props.to;

  if (props.class) {
    link.className = props.class;
  }

  if (props.style) {
    Object.assign(link.style, props.style);
  }

  // Add children
  const childArray = Array.isArray(children) ? children : [children];
  childArray.forEach((child) => {
    if (typeof child === "string") {
      link.appendChild(document.createTextNode(child));
    } else {
      link.appendChild(child);
    }
  });

  // Handle active class
  if (props.activeClass) {
    const updateActiveClass = () => {
      const currentPath = window.location.pathname;
      const isActive = props.exact
        ? currentPath === props.to
        : currentPath.startsWith(props.to);

      if (isActive) {
        link.classList.add(props.activeClass!);
      } else {
        link.classList.remove(props.activeClass!);
      }
    };

    updateActiveClass();
    window.addEventListener("popstate", updateActiveClass);
  }

  return link;
}

/**
 * NavLink component - Builder API
 */
export function navLink(to?: string): LinkBuilder {
  return new LinkBuilder(to).activeClass("active");
}

// Legacy support
export function NavLink(
  props: {
    to: string;
    class?: string;
    activeClass?: string;
    style?: Partial<CSSStyleDeclaration>;
    exact?: boolean;
  },
  children: string | HTMLElement | (string | HTMLElement)[],
): HTMLAnchorElement {
  return Link(
    {
      ...props,
      activeClass: props.activeClass || "active",
    },
    children,
  );
}

/**
 * Router outlet component - renders matched route
 */
export function RouterOutlet(router: Router): HTMLDivElement {
  const outlet = createElement("div", {
    class: "router-outlet",
  }) as HTMLDivElement;
  router.mount(outlet);
  return outlet;
}

/**
 * Route guard component - conditionally render based on route
 */
export function RouteGuard(
  condition: (ctx: RouteContext) => boolean,
  children: HTMLElement,
  fallback?: HTMLElement,
): HTMLElement {
  const container = createElement("div", {
    class: "route-guard",
  }) as HTMLDivElement;

  // This would need to be integrated with the router to work properly
  // For now, return the children
  container.appendChild(children);

  return container;
}

/**
 * Breadcrumb component - Builder API
 */
export class BreadcrumbBuilder extends ElementBuilder<HTMLElement> {
  private separator: string = "/";

  constructor() {
    super("nav");
    this.element.className = "breadcrumb";
  }

  setSeparator(value: string): this {
    this.separator = value;
    return this;
  }

  build(): HTMLElement {
    const updateBreadcrumb = () => {
      this.element.innerHTML = "";
      const paths = window.location.pathname.split("/").filter(Boolean);

      // Home link
      const homeLink = Link({ to: "/", class: "breadcrumb-item" }, "Home");
      this.element.appendChild(homeLink);

      // Path segments
      let currentPath = "";
      paths.forEach((segment, index) => {
        currentPath += "/" + segment;

        if (this.separator) {
          const sep = document.createTextNode(` ${this.separator} `);
          this.element.appendChild(sep);
        }

        const isLast = index === paths.length - 1;
        if (isLast) {
          const span = document.createElement("span");
          span.className = "breadcrumb-item active";
          span.textContent = segment;
          this.element.appendChild(span);
        } else {
          const linkEl = Link(
            { to: currentPath, class: "breadcrumb-item" },
            segment,
          );
          this.element.appendChild(linkEl);
        }
      });
    };

    updateBreadcrumb();
    window.addEventListener("popstate", updateBreadcrumb);

    return super.build();
  }
}

export function breadcrumb(): BreadcrumbBuilder {
  return new BreadcrumbBuilder();
}

// Legacy support
export function Breadcrumb(
  props: {
    separator?: string;
    class?: string;
    style?: Partial<CSSStyleDeclaration>;
  } = {},
): HTMLElement {
  const nav = createElement("nav", {
    class: props.class || "breadcrumb",
    style: props.style,
  }) as HTMLElement;

  const updateBreadcrumb = () => {
    nav.innerHTML = "";
    const paths = window.location.pathname.split("/").filter(Boolean);

    // Home link
    const homeLink = Link({ to: "/", class: "breadcrumb-item" }, "Home");
    nav.appendChild(homeLink);

    // Path segments
    let currentPath = "";
    paths.forEach((segment, index) => {
      currentPath += "/" + segment;

      if (props.separator) {
        const separator = document.createTextNode(` ${props.separator} `);
        nav.appendChild(separator);
      }

      const isLast = index === paths.length - 1;
      if (isLast) {
        const span = createElement("span", {
          class: "breadcrumb-item active",
        }) as HTMLSpanElement;
        span.textContent = segment;
        nav.appendChild(span);
      } else {
        const link = Link(
          { to: currentPath, class: "breadcrumb-item" },
          segment,
        );
        nav.appendChild(link);
      }
    });
  };

  updateBreadcrumb();
  window.addEventListener("popstate", updateBreadcrumb);

  return nav;
}

/**
 * Back button component - Builder API
 */
export class BackButtonBuilder extends ElementBuilder<HTMLButtonElement> {
  constructor(text?: string) {
    super("button");
    this.element.className = "back-button";
    this.element.textContent = text || "← Back";
    this.element.onclick = () => window.history.back();
  }

  text(value: string): this {
    this.element.textContent = value;
    return this;
  }
}

export function backButton(text?: string): BackButtonBuilder {
  return new BackButtonBuilder(text);
}

// Legacy support
export function BackButton(
  props: {
    text?: string;
    class?: string;
    style?: Partial<CSSStyleDeclaration>;
  } = {},
): HTMLButtonElement {
  const button = createElement("button", {
    class: props.class || "back-button",
    style: props.style,
  }) as HTMLButtonElement;

  button.textContent = props.text || "← Back";
  button.onclick = () => window.history.back();

  return button;
}

/**
 * Route params display (for debugging)
 */
export function RouteParamsDebug(router: Router): HTMLElement {
  const container = createElement("div", {
    class: "route-params-debug",
    style: {
      padding: "1rem",
      background: "#f0f0f0",
      borderRadius: "4px",
      fontFamily: "monospace",
      fontSize: "0.875rem",
    },
  }) as HTMLDivElement;

  const update = () => {
    const route = router.getCurrentRoute();
    if (route) {
      container.innerHTML = `
        <strong>Route Debug:</strong><br>
        Path: ${route.path}<br>
        Params: ${JSON.stringify(route.params)}<br>
        Query: ${JSON.stringify(route.query)}<br>
        Hash: ${route.hash}
      `;
    }
  };

  update();

  return container;
}

/**
 * Loading component for lazy routes
 */
export function RouteLoading(
  props: {
    text?: string;
    class?: string;
    style?: Partial<CSSStyleDeclaration>;
  } = {},
): HTMLElement {
  const container = createElement("div", {
    class: props.class || "route-loading",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      ...props.style,
    },
  }) as HTMLDivElement;

  const spinner = createElement("div", {
    class: "spinner",
    style: {
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #3498db",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  }) as HTMLDivElement;

  container.appendChild(spinner);

  if (props.text) {
    const text = createElement("span", {
      style: { marginLeft: "1rem" },
    }) as HTMLSpanElement;
    text.textContent = props.text;
    container.appendChild(text);
  }

  // Add keyframes for spinner animation
  if (!document.querySelector("#route-loading-styles")) {
    const style = document.createElement("style");
    style.id = "route-loading-styles";
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return container;
}

/**
 * 404 Not Found component - Builder API
 */
export class NotFoundBuilder extends ElementBuilder<HTMLDivElement> {
  private titleText: string = "404";
  private messageText: string = "Page not found";
  private showHomeLink: boolean = true;

  constructor() {
    super("div");
    this.applyDefaultStyles();
  }

  title(value: string): this {
    this.titleText = value;
    return this;
  }

  message(value: string): this {
    this.messageText = value;
    return this;
  }

  homeLink(show: boolean = true): this {
    this.showHomeLink = show;
    return this;
  }

  build(): HTMLDivElement {
    const titleEl = document.createElement("h1");
    Object.assign(titleEl.style, {
      fontSize: "4rem",
      margin: "0 0 1rem 0",
      color: "#333",
    });
    titleEl.textContent = this.titleText;

    const messageEl = document.createElement("p");
    Object.assign(messageEl.style, {
      fontSize: "1.25rem",
      margin: "0 0 2rem 0",
      color: "#666",
    });
    messageEl.textContent = this.messageText;

    this.element.appendChild(titleEl);
    this.element.appendChild(messageEl);

    if (this.showHomeLink) {
      const homeLink = Link(
        {
          to: "/",
          style: {
            padding: "0.75rem 1.5rem",
            background: "#3498db",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "1rem",
          },
        },
        "Go Home",
      );
      this.element.appendChild(homeLink);
    }

    return super.build();
  }

  private applyDefaultStyles(): void {
    this.element.className = "not-found";
    Object.assign(this.element.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      textAlign: "center",
    });
  }
}

export function notFound(): NotFoundBuilder {
  return new NotFoundBuilder();
}

// Legacy support
export function NotFound(
  props: {
    title?: string;
    message?: string;
    homeLink?: boolean;
    class?: string;
    style?: Partial<CSSStyleDeclaration>;
  } = {},
): HTMLElement {
  const container = createElement("div", {
    class: props.class || "not-found",
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      textAlign: "center",
      ...props.style,
    },
  }) as HTMLDivElement;

  const title = createElement("h1", {
    style: {
      fontSize: "4rem",
      margin: "0 0 1rem 0",
      color: "#333",
    },
  }) as HTMLHeadingElement;
  title.textContent = props.title || "404";

  const message = createElement("p", {
    style: {
      fontSize: "1.25rem",
      margin: "0 0 2rem 0",
      color: "#666",
    },
  }) as HTMLParagraphElement;
  message.textContent = props.message || "Page not found";

  container.appendChild(title);
  container.appendChild(message);

  if (props.homeLink !== false) {
    const homeLink = Link(
      {
        to: "/",
        style: {
          padding: "0.75rem 1.5rem",
          background: "#3498db",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontSize: "1rem",
        },
      },
      "Go Home",
    );
    container.appendChild(homeLink);
  }

  return container;
}
