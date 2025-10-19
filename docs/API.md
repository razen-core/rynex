# ZenWeb API Reference

Complete API documentation for the ZenWeb framework.

## Table of Contents

- [State Management](#state-management)
- [Helper Functions](#helper-functions)
- [Virtual DOM](#virtual-dom)
- [Renderer](#renderer)
- [Types](#types)

---

## State Management

### `state<T>(initialValue: T)`

Create a reactive state value.

**Parameters:**
- `initialValue`: Initial value of the state

**Returns:** `[getter, setter]`
- `getter()`: Function to get current value
- `setter(value)`: Function to update value

**Example:**
```typescript
const [count, setCount] = state(0);

// Get value
console.log(count()); // 0

// Set value
setCount(5);
setCount(prev => prev + 1); // Functional update
```

### `computed<T>(computeFn: () => T)`

Create a computed value that automatically updates when dependencies change.

**Parameters:**
- `computeFn`: Function that computes the value

**Returns:** `getter()` - Function to get computed value

**Example:**
```typescript
const [count, setCount] = state(0);
const doubled = computed(() => count() * 2);

console.log(doubled()); // 0
setCount(5);
console.log(doubled()); // 10
```

### `effect(effectFn: () => void)`

Run a side effect when dependencies change.

**Parameters:**
- `effectFn`: Effect function to run

**Example:**
```typescript
const [count, setCount] = state(0);

effect(() => {
  console.log('Count changed:', count());
});
```

---

## Helper Functions

### Layout Helpers

#### `vbox(props, children)`

Vertical box layout (flex column).

**Parameters:**
- `props`: VNodeProps - Element properties
- `children`: VNodeChild[] - Child elements

**Example:**
```typescript
vbox({ class: 'container' }, [
  text({}, 'Item 1'),
  text({}, 'Item 2')
])
```

#### `hbox(props, children)`

Horizontal box layout (flex row).

**Parameters:**
- `props`: VNodeProps - Element properties
- `children`: VNodeChild[] - Child elements

**Example:**
```typescript
hbox({ class: 'row' }, [
  button({}, 'Left'),
  button({}, 'Right')
])
```

#### `grid(props, children)`

Grid layout container.

**Parameters:**
- `props`: VNodeProps & { columns?: number, gap?: string }
- `children`: VNodeChild[]

**Example:**
```typescript
grid({ columns: 3, gap: '1rem' }, [
  div({}, 'Cell 1'),
  div({}, 'Cell 2'),
  div({}, 'Cell 3')
])
```

### Element Helpers

#### `text(props, content)`

Text element.

**Parameters:**
- `props`: VNodeProps | string
- `content?`: string

**Example:**
```typescript
text({}, 'Hello World')
text({ class: 'title' }, 'Title')
text('Simple text') // Shorthand
```

#### `button(props, content)`

Button element.

**Parameters:**
- `props`: VNodeProps
- `content`: VNodeChild

**Example:**
```typescript
button({ 
  onClick: () => console.log('clicked') 
}, 'Click Me')
```

#### `input(props)`

Input element.

**Parameters:**
- `props`: VNodeProps

**Example:**
```typescript
input({
  type: 'text',
  placeholder: 'Enter text',
  value: inputValue(),
  onInput: (e) => setInputValue(e.target.value)
})
```

#### `image(props)`

Image element with lazy loading support.

**Parameters:**
- `props`: VNodeProps & { src: string, alt?: string, lazy?: boolean }

**Example:**
```typescript
image({ 
  src: '/path/to/image.jpg',
  alt: 'Description',
  lazy: true
})
```

#### `link(props, children)`

Link/anchor element.

**Parameters:**
- `props`: VNodeProps & { href: string }
- `children`: VNodeChild[]

**Example:**
```typescript
link({ href: '/about' }, [
  text({}, 'About Us')
])
```

### List Helper

#### `list(props)`

Optimized list rendering.

**Parameters:**
- `props`: Object with:
  - `items`: T[] - Array of items
  - `renderItem`: (item: T, index: number) => VNode
  - `keyExtractor?`: (item: T, index: number) => string | number

**Example:**
```typescript
list({
  items: todos(),
  renderItem: (todo) => 
    div({ class: 'todo' }, [
      text({}, todo.text)
    ]),
  keyExtractor: (todo) => todo.id
})
```

### HTML Helpers

#### Headings

```typescript
h1(props, content)
h2(props, content)
h3(props, content)
h4(props, content)
h5(props, content)
h6(props, content)
```

#### Other Elements

```typescript
div(props, children)
span(props, children)
p(props, content)
form(props, children)
textarea(props, content?)
select(props, children)
option(props, content)
```

---

## Virtual DOM

### `h(type, props, ...children)`

Create a virtual node.

**Parameters:**
- `type`: string | Function - Element type or component
- `props`: VNodeProps | null - Element properties
- `children`: VNodeChild[] - Child elements

**Example:**
```typescript
h('div', { class: 'container' }, 
  h('span', {}, 'Hello')
)
```

### `mount(vnode, container)`

Mount a virtual node to the DOM.

**Parameters:**
- `vnode`: VNode - Virtual node to mount
- `container`: HTMLElement - Container element

### `patch(oldVNode, newVNode)`

Update a virtual node.

**Parameters:**
- `oldVNode`: VNode - Old virtual node
- `newVNode`: VNode - New virtual node

### `unmount(vnode)`

Unmount a virtual node from the DOM.

**Parameters:**
- `vnode`: VNode - Virtual node to unmount

---

## Renderer

### `render(component, container)`

Render a component to a container element.

**Parameters:**
- `component`: Function - Component function
- `container`: HTMLElement - Container element

**Returns:** ComponentInstance

**Example:**
```typescript
import { render } from 'zenweb/runtime';
import App from './App';

render(App, document.getElementById('root'));
```

### `createComponent(component, props)`

Create a component instance.

**Parameters:**
- `component`: Function - Component function
- `props`: any - Component props

**Returns:** VNode

---

## Types

### `VNodeProps`

Element properties interface.

```typescript
interface VNodeProps {
  [key: string]: any;
  class?: string;
  id?: string;
  style?: string | Record<string, string>;
  onClick?: (event: MouseEvent) => void;
  onInput?: (event: Event) => void;
  onChange?: (event: Event) => void;
  // ... other event handlers
}
```

### `VNode`

Virtual node interface.

```typescript
interface VNode {
  type: VNodeType;
  props: VNodeProps;
  children: VNodeChild[];
  key?: string | number;
  el?: HTMLElement | Text;
}
```

### `VNodeChild`

Valid child types.

```typescript
type VNodeChild = VNode | string | number | boolean | null | undefined;
```

### `ComponentInstance`

Component instance interface.

```typescript
interface ComponentInstance {
  vnode: VNode | null;
  el: HTMLElement | null;
  update: () => void;
  unmount: () => void;
}
```

---

## Event Handlers

All standard DOM events are supported with camelCase naming:

- `onClick`, `onDoubleClick`
- `onInput`, `onChange`, `onSubmit`
- `onFocus`, `onBlur`
- `onKeyDown`, `onKeyUp`, `onKeyPress`
- `onMouseEnter`, `onMouseLeave`, `onMouseMove`
- `onScroll`
- And more...

**Example:**
```typescript
button({
  onClick: (e: MouseEvent) => {
    console.log('Button clicked', e);
  }
}, 'Click Me')
```

---

## View & Style Keywords

### `view` Keyword

Declares component template structure.

**Syntax:**
```typescript
view {
  // Return a virtual node tree
  vbox({}, [
    text({}, 'Hello')
  ])
}
```

The `view` block is transformed to:
```typescript
return (
  vbox({}, [
    text({}, 'Hello')
  ])
);
```

### `style` Keyword

Defines scoped component styling.

**Syntax:**
```typescript
style {
  .container {
    padding: 1rem;
    background: white;
  }
  
  button {
    color: blue;
  }
}
```

Styles are automatically scoped to the component and compiled to CSS.

---

## Best Practices

1. **State Management**
   - Keep state close to where it's used
   - Use computed values for derived state
   - Avoid unnecessary state

2. **Components**
   - Keep components small and focused
   - Use props for configuration
   - Extract reusable components

3. **Performance**
   - Use `keyExtractor` in lists
   - Avoid creating functions in render
   - Use computed values instead of recalculating

4. **Styling**
   - Use the `style` keyword for component styles
   - Keep styles scoped to components
   - Use CSS variables for theming

---

For more examples and tutorials, visit the [ZenWeb documentation](https://github.com/zenweb/docs).
