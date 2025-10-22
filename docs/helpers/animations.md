# Animation and Transitions

Create smooth animations and transitions to make your application feel polished and responsive. Rynex provides simple, performant animation helpers using the Web Animations API.

## Functions

### transition

Apply CSS transitions to elements for smooth property changes.

**Usage**:
```typescript
import { transition, div } from 'rynex';

const element = div({ style: { background: 'blue', width: '100px' } });

transition(element, {
  duration: 300,
  easing: 'ease-in-out'
});

// Change style to trigger transition
element.style.background = 'red';
element.style.width = '200px';
```

**Configuration**:
- `duration`: Animation duration in milliseconds (default: 300)
- `easing`: Easing function (ease, ease-in, ease-out, ease-in-out, linear)
- `delay`: Delay before animation starts in milliseconds (default: 0)
- `onStart`: Callback when animation starts
- `onEnd`: Callback when animation ends

**Example with Callbacks**:
```typescript
import { transition, div } from 'rynex';

const element = div();

transition(element, {
  duration: 500,
  easing: 'ease',
  onStart: () => console.log('Animation started'),
  onEnd: () => console.log('Animation finished')
});
```

### animate

Create custom animations using the Web Animations API with keyframes.

**Usage - Simple Fade**:
```typescript
import { animate, div } from 'rynex';

const element = div();

animate(element, {
  keyframes: [
    { opacity: 0 },
    { opacity: 1 }
  ],
  duration: 500
});
```

**Usage - Complex Animation**:
```typescript
import { animate, div } from 'rynex';

const element = div();

animate(element, {
  keyframes: [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: 'translateX(100px)', opacity: 0.5 },
    { transform: 'translateX(200px)', opacity: 1 }
  ],
  duration: 1000,
  easing: 'ease-in-out',
  iterations: 2,
  direction: 'alternate'
});
```

**Configuration**:
- `keyframes`: Array of animation frames
- `duration`: Animation duration in milliseconds (default: 300)
- `easing`: Easing function (default: ease)
- `delay`: Delay before animation starts (default: 0)
- `iterations`: Number of times to repeat (default: 1)
- `direction`: Animation direction (normal, reverse, alternate, alternate-reverse)
- `fill`: How to apply styles (none, forwards, backwards, both)
- `onStart`: Callback when animation starts
- `onEnd`: Callback when animation ends

**Returns**: Animation object or null if failed

### fade

Create fade in and fade out animations.

**Usage - Fade In**:
```typescript
import { fade, div } from 'rynex';

const element = div({ style: { opacity: 0 } });

fade(element, 'in', { duration: 500 });
```

**Usage - Fade Out**:
```typescript
import { fade, div } from 'rynex';

const element = div({ style: { opacity: 1 } });

fade(element, 'out', { duration: 500 });
```

**Usage - Toggle Fade**:
```typescript
import { fade, div } from 'rynex';

const element = div();

fade(element, 'toggle', { duration: 300 });
```

**Parameters**:
- `element`: HTML element to animate
- `direction`: 'in', 'out', or 'toggle' (default: 'in')
- `config`: Animation configuration

### slide

Create slide animations in different directions.

**Usage - Slide Down**:
```typescript
import { slide, div } from 'rynex';

const element = div();

slide(element, 'down', { duration: 400 });
```

**Usage - Slide Left**:
```typescript
import { slide, div } from 'rynex';

const element = div();

slide(element, 'left', { duration: 400 });
```

**Directions**:
- `up`: Slide from bottom to top
- `down`: Slide from top to bottom
- `left`: Slide from right to left
- `right`: Slide from left to right

**Parameters**:
- `element`: HTML element to animate
- `direction`: Slide direction (default: 'down')
- `config`: Animation configuration

### scale

Create scale animations for zoom effects.

**Usage - Scale In**:
```typescript
import { scale, div } from 'rynex';

const element = div();

scale(element, 'in', { duration: 300 });
```

**Usage - Scale Out**:
```typescript
import { scale, div } from 'rynex';

const element = div();

scale(element, 'out', { duration: 300 });
```

**Usage - Toggle Scale**:
```typescript
import { scale, div } from 'rynex';

const element = div();

scale(element, 'toggle', { duration: 300 });
```

**Parameters**:
- `element`: HTML element to animate
- `direction`: 'in', 'out', or 'toggle' (default: 'in')
- `config`: Animation configuration

### rotate

Create rotation animations.

**Usage - Rotate 360 Degrees**:
```typescript
import { rotate, div } from 'rynex';

const element = div();

rotate(element, 360, { duration: 1000 });
```

**Usage - Rotate 180 Degrees**:
```typescript
import { rotate, div } from 'rynex';

const element = div();

rotate(element, 180, { duration: 500 });
```

**Usage - Continuous Rotation**:
```typescript
import { rotate, div } from 'rynex';

const element = div();

rotate(element, 360, {
  duration: 2000,
  iterations: Infinity
});
```

**Parameters**:
- `element`: HTML element to animate
- `degrees`: Rotation angle in degrees (default: 360)
- `config`: Animation configuration

## Common Patterns

### Fade In on Mount

```typescript
import { fade, div, onMount } from 'rynex';

const element = div({ style: { opacity: 0 } });

onMount(element, () => {
  fade(element, 'in', { duration: 500 });
});
```

### Slide and Fade Combined

```typescript
import { animate, div } from 'rynex';

const element = div();

animate(element, {
  keyframes: [
    { transform: 'translateY(20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  duration: 600,
  easing: 'ease-out'
});
```

### Bounce Animation

```typescript
import { animate, div } from 'rynex';

const element = div();

animate(element, {
  keyframes: [
    { transform: 'translateY(0)' },
    { transform: 'translateY(-20px)' },
    { transform: 'translateY(0)' }
  ],
  duration: 600,
  easing: 'ease-in-out'
});
```

### Pulse Animation

```typescript
import { animate, div } from 'rynex';

const element = div();

animate(element, {
  keyframes: [
    { opacity: 1 },
    { opacity: 0.5 },
    { opacity: 1 }
  ],
  duration: 1000,
  iterations: Infinity
});
```

### Color Change Animation

```typescript
import { animate, div } from 'rynex';

const element = div({ style: { background: 'red' } });

animate(element, {
  keyframes: [
    { background: 'red' },
    { background: 'yellow' },
    { background: 'green' },
    { background: 'blue' },
    { background: 'red' }
  ],
  duration: 2000,
  iterations: Infinity
});
```

### Staggered Animations

```typescript
import { animate, div, list, li } from 'rynex';

const items = ['Item 1', 'Item 2', 'Item 3'];

list({
  items,
  renderItem: (item, index) => {
    const element = li({}, item);
    
    setTimeout(() => {
      animate(element, {
        keyframes: [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        duration: 400
      });
    }, index * 100);
    
    return element;
  }
});
```

## Easing Functions

Common easing functions for smooth animations:

- `linear`: Constant speed
- `ease`: Slow start and end
- `ease-in`: Slow start
- `ease-out`: Slow end
- `ease-in-out`: Slow start and end
- `cubic-bezier(x1, y1, x2, y2)`: Custom bezier curve

## Tips

- Use `transition` for simple property changes
- Use `animate` for complex keyframe animations
- Use preset animations (fade, slide, scale, rotate) for common effects
- Keep animations short (200-500ms) for responsive feel
- Use `ease-out` for entering animations
- Use `ease-in` for exiting animations
- Avoid animating too many elements at once
- Test animations on different devices for performance

## Performance Considerations

- Web Animations API is hardware-accelerated
- Animate `transform` and `opacity` for best performance
- Avoid animating `width`, `height`, or `position` properties
- Use `will-change` CSS property for frequently animated elements
- Limit simultaneous animations on low-end devices

## Browser Support

All animation functions are supported in modern browsers:
- Chrome 43+
- Firefox 48+
- Safari 13+
- Edge 79+

## Next Steps

- Learn about [Lifecycle Hooks](./lifecycle.md) for animation timing
- Explore [Components](./components.md) for animated components
- Check [Best Practices](../best-practices.md) for animation tips

## Related

- [Lifecycle Hooks](./lifecycle.md)
- [Components](./components.md)
- [Utilities](./utilities.md)
