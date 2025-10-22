# Helper Functions

Rynex provides a comprehensive collection of helper functions organized by category. Each function is designed to make building web applications faster and easier.

## Layout Helpers

**Functions**: vbox, hbox, grid, container, stack, center, spacer, wrap, scroll, sticky, fixed, absolute, relative

Use layout helpers to arrange elements on your page. Create flexible layouts with vertical and horizontal flexbox, responsive grids, and positioned elements. Whether you need a simple column layout or a complex multi-column grid, these helpers handle the CSS for you.

[Learn more about Layout Helpers](./layout.md)

## Basic Elements

**Functions**: div, span, text, button, input, image, link, label, p, list, ul, ol, li, hr, br, dl, dt, dd

Create fundamental HTML elements with reactive support. Build buttons that respond to clicks, text that updates automatically, images with lazy loading, and lists that render dynamically. These are the building blocks for any web interface.

[Learn more about Basic Elements](./basic-elements.md)

## Typography

**Functions**: h1, h2, h3, h4, h5, h6, strong, em, code, pre, blockquote, mark, small, del, ins, sub, sup, abbr, cite, kbd, samp, varElement

Format text with semantic HTML elements. Create headings, emphasized text, code snippets, quotes, and other text styles. Semantic elements improve accessibility and help search engines understand your content better.

[Learn more about Typography](./typography.md)

## Forms

**Functions**: form, textarea, select, option, checkbox, radio, fieldset, legend, datalist, meter, progress, output

Build interactive forms to collect user input. Create text inputs, dropdowns, checkboxes, radio buttons, and more. Forms are essential for user interaction and data collection in web applications.

[Learn more about Forms](./forms.md)

## Semantic Elements

**Functions**: header, footer, nav, main, section, article, aside, figure, figcaption, time, address, details, summary, dialog

Use semantic HTML for better document structure and accessibility. Organize your page with headers, navigation, main content, sidebars, and footers. Semantic elements make your code more meaningful and improve SEO.

[Learn more about Semantic Elements](./semantic.md)

## Media Elements

**Functions**: video, audio, canvas, svg, svgPath, iframe, picture, source, track

Embed and display multimedia content. Add videos, audio players, SVG graphics, iframes, and responsive images. Media elements let you create rich, interactive experiences.

[Learn more about Media Elements](./media.md)

## Table Elements

**Functions**: table, thead, tbody, tfoot, tr, th, td, caption, colgroup, col

Create structured data tables. Display tabular data with headers, body rows, and footers. Tables are perfect for presenting organized information and data.

[Learn more about Table Elements](./table.md)

## Components

**Functions**: badge, card, avatar, icon, tooltip, modal, dropdown, toggle, slider, progressBar, spinner, tabs, accordion

Use pre-built UI components for common patterns. Badges for labels, cards for content containers, modals for dialogs, tabs for navigation, and more. Components speed up development by providing ready-made solutions.

[Learn more about Components](./components.md)

## Utilities

**Functions**: fragment, when, show, each, switchCase, dynamic, portal, css, lazy, suspense, errorBoundary, memo

Handle conditional rendering and advanced patterns. Show or hide elements based on conditions, render lists dynamically, lazy load components, and handle errors gracefully. Utilities provide powerful tools for complex logic.

[Learn more about Utilities](./utilities.md)

## Routing

**Functions**: Link, NavLink, RouterOutlet, RouteGuard, Breadcrumb, BackButton, RouteParamsDebug, RouteLoading, NotFound

Build single-page applications with client-side routing. Create navigation links, route guards, breadcrumbs, and 404 pages. Routing lets you build multi-page experiences without full page reloads.

[Learn more about Routing](./routing.md)

## Lifecycle Hooks

**Functions**: onMount, onUnmount, onUpdate, watch, watchEffect, onError

Manage component lifecycle events. Run code when components mount or unmount, watch for state changes, and handle errors. Lifecycle hooks let you control what happens at different stages of a component's life.

[Learn more about Lifecycle Hooks](./lifecycle.md)

## Performance Utilities

**Functions**: debounce, throttle, preload, getPreloaded, onIdle, cancelIdle

Optimize application performance. Debounce rapid function calls, throttle event handlers, preload resources, and run code during idle time. Performance utilities help your app run smoothly even with heavy usage.

[Learn more about Performance](./performance.md)

## Refs and DOM Access

**Functions**: ref, useRef, forwardRef, callbackRef, mergeRefs

Access DOM elements directly when needed. Get references to elements, forward refs to child components, and merge multiple refs. Use refs carefully for direct DOM manipulation.

[Learn more about Refs](./refs.md)

## Style Utilities

**Functions**: styled, classNames, mergeStyles, setTheme, getTheme, useTheme, createCSSVariables, applyThemeVariables, getCSSVariable, setCSSVariable

Apply styles dynamically and manage themes. Create styled components, conditionally apply classes, merge styles, and switch themes at runtime. Style utilities make it easy to build themeable applications.

[Learn more about Styles](./styles.md)

## Animation and Transitions

**Functions**: transition, animate, fade, slide, scale, rotate

Create smooth animations and transitions. Add fade effects, slide animations, scale transformations, and rotations. Animations make your application feel polished and responsive.

[Learn more about Animations](./animations.md)

## State Management

**Functions**: createStore, useStore, createContext, useContext, provider, getStores, removeStore, clearStores

Manage application state and share data across components. Create global stores for shared state, use context for component trees, and manage multiple stores. State management keeps your data organized and accessible.

[Learn more about State Management](./state-management.md)

## Developer Tools

**Functions**: devtools, logger, profiler, log, profile, LogLevel

Debug and profile your application. Log messages at different levels, measure performance, and inspect elements. Developer tools help you understand what's happening in your app.

[Learn more about Developer Tools](./devtools.md)

## Quick Start Examples

### Display Text

```typescript
import { text } from 'rynex';

text('Hello, World!')
```

### Create a Button

```typescript
import { button } from 'rynex';

button(
  { onClick: () => console.log('Clicked!') },
  'Click Me'
)
```

### Build a Layout

```typescript
import { vbox, hbox, div, text } from 'rynex';

vbox(
  { style: { height: '100vh' } },
  hbox({ class: 'header' }, text('Header')),
  div({ class: 'content', style: { flex: 1 } }, text('Content')),
  hbox({ class: 'footer' }, text('Footer'))
)
```

### Manage State

```typescript
import { state } from 'rynex';
import { div, text, button } from 'rynex';

const count = state(0);

div(
  text(() => `Count: ${count.value}`),
  button({ onClick: () => count.value++ }, 'Increment')
)
```

## Tips for Success

- Start with basic elements to build simple components
- Use layout helpers to structure your page
- Combine components for faster development
- Use state management for complex applications
- Check individual helper documentation for detailed examples
- Review best practices for common patterns

## Need Help?

- Check individual helper documentation for detailed guides
- Review [Examples](../examples.md) for code samples
- Read [Best Practices](../best-practices.md) for tips
- See [FAQ](../faq.md) for common questions
- Visit [Getting Started](../getting-started.md) for core concepts
