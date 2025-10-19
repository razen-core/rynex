# ZenWeb Vanilla JavaScript Migration

## Overview

ZenWeb has been successfully refactored from a React-like Virtual DOM approach to a **pure vanilla JavaScript** framework with direct DOM manipulation.

## What Changed

### ✅ Removed (React-like patterns)
- ❌ Virtual DOM (VDOM)
- ❌ React-style hooks (`useState` pattern)
- ❌ VNode diffing and patching
- ❌ Component lifecycle with hooks
- ❌ `h()` function for creating virtual nodes

### ✅ Added (Vanilla JavaScript patterns)
- ✅ **Proxy-based reactive state** (no hooks needed)
- ✅ **Direct DOM manipulation** (real HTMLElements)
- ✅ **Helper functions return real DOM elements**
- ✅ **Simple, predictable rendering**
- ✅ **Lightweight and fast**

---

## New Architecture

### 1. State Management (Proxy-based)

**Before (React-like hooks):**
```javascript
const [count, setCount] = state(0);
const value = count(); // getter
setCount(5); // setter
```

**After (Vanilla JS Proxy):**
```javascript
const appState = state({ count: 0 });
const value = appState.count; // direct access
appState.count = 5; // direct assignment
```

**Features:**
- Automatic dependency tracking
- No getter/setter functions
- Works like regular JavaScript objects
- Reactive updates via Proxy

### 2. DOM Elements (Real, not Virtual)

**Before (Virtual DOM):**
```javascript
import { h } from 'zenweb/runtime';
const element = h('div', { class: 'container' }, 'Hello');
// Returns VNode, needs to be mounted
```

**After (Real DOM):**
```javascript
import { div } from 'zenweb/runtime';
const element = div({ class: 'container' }, 'Hello');
// Returns HTMLElement, ready to use
```

**All helper functions now return real DOM elements:**
- `div()` → `HTMLElement`
- `button()` → `HTMLButtonElement`
- `input()` → `HTMLInputElement`
- etc.

### 3. Component Pattern

**Before:**
```javascript
function Counter() {
  const [count, setCount] = state(0);
  
  return vbox({}, [
    text(`Count: ${count()}`),
    button({ onClick: () => setCount(count() + 1) }, 'Increment')
  ]);
}
```

**After:**
```javascript
function Counter() {
  const appState = state({ count: 0 });
  
  // Create reactive component
  const container = vbox({},
    text(`Count: ${appState.count}`),
    button({ 
      onClick: () => appState.count++ 
    }, 'Increment')
  );
  
  // Subscribe to state changes
  subscribe(appState, () => {
    // Re-render on state change
    render(Counter, document.getElementById('app'));
  });
  
  return container;
}
```

### 4. Rendering

**Before:**
```javascript
import { render } from 'zenweb/runtime';
render(App, document.getElementById('app'));
```

**After (same API, different implementation):**
```javascript
import { render } from 'zenweb/runtime';
render(App, document.getElementById('app'));
// Now uses direct DOM manipulation, no VDOM diffing
```

---

## API Reference

### State Management

#### `state<T>(initialState: T): T`
Creates a reactive state object using Proxy.

```javascript
const appState = state({
  count: 0,
  name: 'John',
  todos: []
});

// Direct access
console.log(appState.count); // 0

// Direct mutation (triggers reactivity)
appState.count++;
appState.todos.push('New todo');
```

#### `computed<T>(fn: () => T): { value: T }`
Creates a computed value that updates when dependencies change.

```javascript
const appState = state({ count: 0 });

const doubled = computed(() => appState.count * 2);

console.log(doubled.value); // 0
appState.count = 5;
console.log(doubled.value); // 10
```

#### `effect(fn: () => void): () => void`
Runs a function when reactive dependencies change.

```javascript
const appState = state({ count: 0 });

const cleanup = effect(() => {
  console.log('Count changed:', appState.count);
});

appState.count++; // Logs: "Count changed: 1"

// Cleanup when done
cleanup();
```

#### `subscribe(stateObj, listener): () => void`
Manually subscribe to state changes.

```javascript
const appState = state({ count: 0 });

const unsubscribe = subscribe(appState, () => {
  console.log('State changed!');
});

// Later...
unsubscribe();
```

#### `batch(fn: () => void): void`
Batch multiple state updates together.

```javascript
const appState = state({ x: 0, y: 0 });

batch(() => {
  appState.x = 10;
  appState.y = 20;
  // Only triggers one update
});
```

### DOM Manipulation

#### `createElement(tag, props, ...children): HTMLElement`
Create a real DOM element.

```javascript
const div = createElement('div', 
  { class: 'container', id: 'main' },
  'Hello',
  createElement('span', {}, 'World')
);
```

#### Direct DOM Helpers

```javascript
import { $, $$, addClass, removeClass, setStyle, on } from 'zenweb/runtime';

// Query selectors
const el = $('.my-class');
const all = $$('.my-class');

// Class manipulation
addClass(el, 'active', 'visible');
removeClass(el, 'hidden');

// Styles
setStyle(el, { color: 'red', fontSize: '16px' });

// Events
const cleanup = on(el, 'click', (e) => console.log('Clicked!'));
```

#### `createRef<T>(): { current: T | null }`
Create a ref to access DOM elements.

```javascript
const inputRef = createRef<HTMLInputElement>();

const myInput = input({ ref: inputRef, type: 'text' });

// Later...
inputRef.current?.focus();
```

### Helper Functions

All helper functions now return **real DOM elements**:

**Layout:**
- `vbox(props, ...children)` → Vertical flex container
- `hbox(props, ...children)` → Horizontal flex container
- `grid(props, ...children)` → Grid layout
- `center(props, ...children)` → Centered content
- `scroll(props, ...children)` → Scrollable container

**Elements:**
- `div(props, ...children)` → Generic container
- `button(props, ...children)` → Button
- `input(props)` → Input field
- `text(content)` → Text span
- `link(props, ...children)` → Anchor link

**Typography:**
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` → Headings
- `p(props, ...children)` → Paragraph
- `strong`, `em`, `code` → Text formatting

**Forms:**
- `form(props, ...children)` → Form
- `textarea(props, content)` → Textarea
- `select(props, ...children)` → Select dropdown
- `checkbox(props)` → Checkbox
- `radio(props)` → Radio button

**Semantic:**
- `header`, `footer`, `nav`, `main` → Semantic sections
- `section`, `article`, `aside` → Content sections

**Tables:**
- `table`, `thead`, `tbody`, `tr`, `th`, `td` → Table elements

**Media:**
- `video`, `audio`, `canvas`, `svg` → Media elements

**Utilities:**
- `when(condition, fn)` → Conditional rendering
- `each(items, renderFn)` → List rendering
- `fragment(...children)` → Fragment (no wrapper)

---

## Migration Examples

### Example 1: Counter App

```javascript
import { state, render, vbox, text, button, subscribe } from 'zenweb/runtime';

function Counter() {
  // Reactive state
  const appState = state({ count: 0 });
  
  // Create UI
  const counterText = text(`Count: ${appState.count}`);
  const incrementBtn = button({ 
    onClick: () => appState.count++ 
  }, 'Increment');
  
  const container = vbox({}, counterText, incrementBtn);
  
  // Auto-update on state change
  subscribe(appState, () => {
    counterText.textContent = `Count: ${appState.count}`;
  });
  
  return container;
}

// Render
render(Counter, document.getElementById('app'));
```

### Example 2: Todo List

```javascript
import { state, vbox, input, button, ul, li, each } from 'zenweb/runtime';

function TodoApp() {
  const appState = state({
    todos: [],
    inputValue: ''
  });
  
  const todoInput = input({ 
    type: 'text',
    value: appState.inputValue,
    onInput: (e) => appState.inputValue = e.target.value
  });
  
  const addButton = button({
    onClick: () => {
      if (appState.inputValue.trim()) {
        appState.todos.push(appState.inputValue);
        appState.inputValue = '';
        todoInput.value = '';
      }
    }
  }, 'Add Todo');
  
  const todoList = ul({},
    ...each(appState.todos, (todo, index) =>
      li({}, todo)
    )
  );
  
  return vbox({},
    todoInput,
    addButton,
    todoList
  );
}
```

---

## Benefits of Vanilla JS Approach

1. **Simpler Mental Model**: No virtual DOM diffing, just regular JavaScript
2. **Better Performance**: Direct DOM manipulation, no reconciliation overhead
3. **Smaller Bundle Size**: No VDOM library code
4. **Easier Debugging**: Real DOM elements in DevTools
5. **More Predictable**: What you write is what you get
6. **Framework Agnostic**: Can integrate with any other library
7. **TypeScript Friendly**: Real DOM types, better autocomplete

---

## Best Practices

1. **Use Proxy state for reactivity**
   ```javascript
   const state = state({ count: 0 });
   state.count++; // Reactive!
   ```

2. **Subscribe to state changes for UI updates**
   ```javascript
   subscribe(state, () => updateUI());
   ```

3. **Use refs for direct DOM access**
   ```javascript
   const ref = createRef();
   const el = input({ ref });
   ref.current.focus();
   ```

4. **Batch updates for performance**
   ```javascript
   batch(() => {
     state.x = 1;
     state.y = 2;
   });
   ```

5. **Use helper functions for cleaner code**
   ```javascript
   vbox({}, h1({}, 'Title'), p({}, 'Content'));
   ```

---

## Summary

ZenWeb is now a **pure vanilla JavaScript framework** that:
- ✅ Uses Proxy-based reactive state (no hooks)
- ✅ Returns real DOM elements (no virtual DOM)
- ✅ Provides direct DOM manipulation
- ✅ Offers simple, predictable behavior
- ✅ Works great for HTML + CSS + JS websites

**The framework is production-ready and follows modern vanilla JavaScript best practices!**
