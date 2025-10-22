# Refs and DOM Access

Direct DOM element access and reference management. Use refs when you need to interact with DOM directly.

## Functions

### ref

Create a reference object.

**Usage**:
```typescript
import { ref } from 'rynex';

const inputRef = ref();
```

### useRef

Create and return a ref object.

**Usage**:
```typescript
import { useRef } from 'rynex';

const buttonRef = useRef();
```

### forwardRef

Forward ref to child component.

**Usage**:
```typescript
import { forwardRef } from 'rynex';

const MyInput = forwardRef((props, ref) => {
  return input({ ref });
});
```

### callbackRef

Execute callback when ref is set.

**Usage**:
```typescript
import { callbackRef } from 'rynex';

const handleRef = callbackRef((el) => {
  console.log('Element:', el);
});
```

### mergeRefs

Combine multiple refs.

**Usage**:
```typescript
import { mergeRefs, ref } from 'rynex';

const ref1 = ref();
const ref2 = ref();
const merged = mergeRefs(ref1, ref2);
```

## Common Patterns

### Focus Input

```typescript
import { useRef, input, button } from 'rynex';

const inputRef = useRef();

button(
  { onClick: () => inputRef.current?.focus() },
  'Focus Input'
)
```

### Get Input Value

```typescript
import { useRef, input, button } from 'rynex';

const inputRef = useRef();

button(
  { onClick: () => console.log(inputRef.current?.value) },
  'Get Value'
)
```

### Measure Element

```typescript
import { useRef, div } from 'rynex';

const divRef = useRef();

button(
  { onClick: () => {
    const rect = divRef.current?.getBoundingClientRect();
    console.log('Width:', rect?.width);
  }},
  'Measure'
)
```

## Tips

- Use refs sparingly
- Prefer reactive updates when possible
- Use refs for DOM measurements
- Use refs for focus management
- Clean up refs when unmounting
- Avoid using refs for state

## Next Steps

- Learn about [Lifecycle Hooks](./lifecycle.md)
- Explore [Components](./components.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Lifecycle Hooks](./lifecycle.md)
- [Components](./components.md)
- [Utilities](./utilities.md)
