# Refs & DOM Access API

Reference management for direct DOM element access and manipulation.

## ref

Creates a reference object to hold a DOM element.

**Signature:**
```typescript
function ref<T = HTMLElement>(initialValue?: T | null): Ref<T>

interface Ref<T> {
  current: T | null;
}
```

**Example:**
```typescript
import { ref, input, button, div } from 'rynex';

const inputRef = ref<HTMLInputElement>();

const myInput = input({ type: 'text', placeholder: 'Enter text' });
inputRef.current = myInput;

button({
  onClick: () => {
    if (inputRef.current) {
      console.log('Input value:', inputRef.current.value);
      inputRef.current.focus();
    }
  }
}, 'Focus Input');
```

**Use Cases:**
- Focus management
- Scroll to element
- Measure element dimensions
- Integrate with third-party libraries

## useRef

Hook-style ref creation (alias for ref).

**Signature:**
```typescript
function useRef<T = HTMLElement>(initialValue?: T | null): Ref<T>
```

**Example:**
```typescript
import { useRef, div, button } from 'rynex';

const divRef = useRef<HTMLDivElement>();

const myDiv = div({ class: 'container' }, 'Content');
divRef.current = myDiv;

button({
  onClick: () => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
}, 'Scroll to Div');
```

## forwardRef

Forwards a ref to a child component.

**Signature:**
```typescript
function forwardRef<P extends Record<string, any>>(
  component: (props: P, ref: Ref) => HTMLElement
): (props: P & { ref?: Ref }) => HTMLElement
```

**Example:**
```typescript
import { forwardRef, input, ref } from 'rynex';

const CustomInput = forwardRef<{ placeholder: string }>((props, ref) => {
  const inputEl = input({
    type: 'text',
    placeholder: props.placeholder,
    class: 'custom-input'
  });
  
  ref.current = inputEl;
  return inputEl;
});

// Usage
const myRef = ref<HTMLInputElement>();
const customInput = CustomInput({ 
  placeholder: 'Enter text',
  ref: myRef 
});

// Access the input element
myRef.current?.focus();
```

**Use Cases:**
- Reusable components with ref access
- Component libraries
- Form field wrappers
- Custom input components

## callbackRef

Creates a callback-based ref.

**Signature:**
```typescript
function callbackRef<T = HTMLElement>(
  callback: (element: T | null) => void
): (element: T | null) => void
```

**Example:**
```typescript
import { callbackRef, div } from 'rynex';

const myCallbackRef = callbackRef<HTMLDivElement>((element) => {
  if (element) {
    console.log('Element attached:', element);
    // Initialize
  } else {
    console.log('Element detached');
    // Cleanup
  }
});

const myDiv = div({}, 'Content');
myCallbackRef(myDiv);
```

**Use Cases:**
- Dynamic ref handling
- Lifecycle-aware refs
- Third-party library integration
- Measurement and observation

## mergeRefs

Combines multiple refs into one.

**Signature:**
```typescript
function mergeRefs<T = HTMLElement>(
  ...refs: (Ref<T> | ((element: T | null) => void) | null)[]
): (element: T | null) => void
```

**Example:**
```typescript
import { mergeRefs, ref, div } from 'rynex';

const ref1 = ref<HTMLDivElement>();
const ref2 = ref<HTMLDivElement>();

const callbackRef = (el: HTMLDivElement | null) => {
  console.log('Element:', el);
};

const merged = mergeRefs(ref1, ref2, callbackRef);

const myDiv = div({}, 'Content');
merged(myDiv);

// Now both ref1 and ref2 point to myDiv
console.log(ref1.current === ref2.current); // true
```

**Use Cases:**
- Multiple ref consumers
- Parent and child refs
- Library integration with custom refs
- Ref forwarding chains

## Practical Examples

### Focus Management
```typescript
import { ref, input, button, div, state } from 'rynex';

function FocusExample() {
  const inputRef = ref<HTMLInputElement>();
  const appState = state({ value: '' });
  
  return div({}, [
    input({
      type: 'text',
      value: appState.value,
      onInput: (e) => {
        appState.value = (e.target as HTMLInputElement).value;
        inputRef.current = e.target as HTMLInputElement;
      }
    }),
    button({
      onClick: () => inputRef.current?.focus()
    }, 'Focus Input'),
    button({
      onClick: () => {
        if (inputRef.current) {
          inputRef.current.value = '';
          appState.value = '';
        }
      }
    }, 'Clear')
  ]);
}
```

### Scroll to Element
```typescript
import { useRef, div, button } from 'rynex';

function ScrollExample() {
  const sectionRef = useRef<HTMLDivElement>();
  
  return div({}, [
    button({
      onClick: () => {
        sectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 'Scroll to Section'),
    
    div({ style: { height: '100vh' } }, 'Spacer'),
    
    (() => {
      const section = div({ class: 'target-section' }, 'Target Section');
      sectionRef.current = section;
      return section;
    })()
  ]);
}
```

### Measure Element
```typescript
import { ref, div, button, state } from 'rynex';

function MeasureExample() {
  const boxRef = ref<HTMLDivElement>();
  const measurements = state({ width: 0, height: 0 });
  
  return div({}, [
    (() => {
      const box = div({
        style: { 
          width: '200px', 
          height: '100px', 
          background: '#f0f0f0' 
        }
      }, 'Measure me');
      boxRef.current = box;
      return box;
    })(),
    
    button({
      onClick: () => {
        if (boxRef.current) {
          const rect = boxRef.current.getBoundingClientRect();
          measurements.width = rect.width;
          measurements.height = rect.height;
        }
      }
    }, 'Measure'),
    
    div({}, () => `Width: ${measurements.width}px, Height: ${measurements.height}px`)
  ]);
}
```

### Third-Party Library Integration
```typescript
import { ref, div, onMount, onUnmount } from 'rynex';

function ChartComponent({ data }: { data: number[] }) {
  const chartRef = ref<HTMLDivElement>();
  let chartInstance: any;
  
  const container = div({ class: 'chart-container' });
  chartRef.current = container;
  
  onMount(container, () => {
    if (chartRef.current) {
      // Initialize chart library
      chartInstance = new ThirdPartyChart(chartRef.current, {
        data: data
      });
    }
    
    return () => {
      // Cleanup
      chartInstance?.destroy();
    };
  });
  
  return container;
}
```

### Form Field Wrapper
```typescript
import { forwardRef, ref, div, label, input } from 'rynex';

const FormField = forwardRef<{
  label: string;
  type: string;
  placeholder: string;
}>((props, ref) => {
  const inputEl = input({
    type: props.type,
    placeholder: props.placeholder,
    class: 'form-input'
  });
  
  ref.current = inputEl;
  
  return div({ class: 'form-field' }, [
    label({}, props.label),
    inputEl
  ]);
});

// Usage
const emailRef = ref<HTMLInputElement>();
const emailField = FormField({
  label: 'Email',
  type: 'email',
  placeholder: 'Enter your email',
  ref: emailRef
});

// Validate
button({
  onClick: () => {
    if (emailRef.current) {
      const isValid = emailRef.current.checkValidity();
      console.log('Valid:', isValid);
    }
  }
}, 'Validate');
```

### Multiple Refs Pattern
```typescript
import { mergeRefs, ref, div } from 'rynex';

function MultiRefExample() {
  const parentRef = ref<HTMLDivElement>();
  const observerRef = ref<HTMLDivElement>();
  
  const handleElement = (el: HTMLDivElement | null) => {
    if (el) {
      console.log('Element dimensions:', el.offsetWidth, el.offsetHeight);
    }
  };
  
  const merged = mergeRefs(parentRef, observerRef, handleElement);
  
  const myDiv = div({ class: 'multi-ref' }, 'Content');
  merged(myDiv);
  
  return myDiv;
}
```

## Best Practices

### 1. Check for null Before Access
```typescript
const myRef = ref<HTMLInputElement>();

// Good
if (myRef.current) {
  myRef.current.focus();
}

// Bad - might throw error
myRef.current.focus();
```

### 2. Use forwardRef for Reusable Components
```typescript
// Good - allows parent to access DOM
const CustomButton = forwardRef((props, ref) => {
  const btn = button(props, props.children);
  ref.current = btn;
  return btn;
});

// Bad - parent cannot access DOM
const CustomButton = (props) => button(props, props.children);
```

### 3. Clean Up in Callback Refs
```typescript
const myRef = callbackRef((element) => {
  if (element) {
    // Setup
    const observer = new ResizeObserver(() => {});
    observer.observe(element);
  } else {
    // Cleanup
    observer?.disconnect();
  }
});
```

### 4. Use mergeRefs for Multiple Consumers
```typescript
// When both parent and component need ref access
const ParentComponent = () => {
  const parentRef = ref();
  
  return ChildComponent({ 
    ref: mergeRefs(parentRef, internalRef) 
  });
};
```
