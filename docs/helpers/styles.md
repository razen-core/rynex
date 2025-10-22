# Styles

Dynamic styling and theme management. Apply styles programmatically and manage application themes.

## Functions

### styled

Create styled components.

**Usage**:
```typescript
import { styled } from 'rynex';

const StyledButton = styled('button', {
  background: '#007bff',
  color: 'white',
  padding: '10px 20px'
});
```

### classNames

Conditionally combine class names.

**Usage**:
```typescript
import { classNames, div } from 'rynex';

div({
  class: classNames(
    'base',
    { 'active': isActive },
    { 'disabled': isDisabled }
  )
})
```

### mergeStyles

Merge multiple style objects.

**Usage**:
```typescript
import { mergeStyles } from 'rynex';

const merged = mergeStyles(
  { color: 'red' },
  { fontSize: '16px' }
);
```

### setTheme

Set application theme.

**Usage**:
```typescript
import { setTheme } from 'rynex';

setTheme({
  primary: '#007bff',
  secondary: '#6c757d'
});
```

### getTheme

Get current theme.

**Usage**:
```typescript
import { getTheme } from 'rynex';

const theme = getTheme();
```

### useTheme

Use theme with reactive updates.

**Usage**:
```typescript
import { useTheme } from 'rynex';

useTheme((theme) => {
  console.log('Theme:', theme);
});
```

### createCSSVariables

Generate CSS variables from theme.

**Usage**:
```typescript
import { createCSSVariables } from 'rynex';

const css = createCSSVariables({
  primary: '#007bff'
});
```

### applyThemeVariables

Apply theme as CSS variables.

**Usage**:
```typescript
import { applyThemeVariables } from 'rynex';

applyThemeVariables({
  primary: '#007bff',
  secondary: '#6c757d'
});
```

### getCSSVariable

Get CSS variable value.

**Usage**:
```typescript
import { getCSSVariable } from 'rynex';

const primary = getCSSVariable('--theme-primary');
```

### setCSSVariable

Set CSS variable value.

**Usage**:
```typescript
import { setCSSVariable } from 'rynex';

setCSSVariable('--theme-primary', '#007bff');
```

## Common Patterns

### Theme Switcher

```typescript
import { setTheme, button, text } from 'rynex';

button(
  { onClick: () => setTheme({ primary: '#007bff' }) },
  text('Light Theme')
)
```

### Conditional Styling

```typescript
import { classNames, div } from 'rynex';

div({
  class: classNames(
    'card',
    { 'card-active': isActive },
    { 'card-error': hasError }
  )
})
```

### Dynamic Styles

```typescript
import { styled } from 'rynex';

const Button = styled('button', (props) => ({
  background: props.primary ? '#007bff' : '#6c757d',
  color: 'white'
}));
```

## Tips

- Use classNames for conditional classes
- Use styled for component styling
- Use themes for consistent design
- Use CSS variables for dynamic values
- Test theme switching
- Keep styles organized

## Next Steps

- Learn about [Components](./components.md)
- Explore [Utilities](./utilities.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Components](./components.md)
- [Utilities](./utilities.md)
- [Layout Helpers](./layout.md)
