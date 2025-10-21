# Style Utilities API

Advanced styling utilities for creating styled components, managing themes, and working with CSS.

## styled

Creates a styled component with predefined styles.

**Signature:**
```typescript
function styled<P extends DOMProps>(
  tag: string,
  styles: Partial<CSSStyleDeclaration> | ((props: P) => Partial<CSSStyleDeclaration>)
): (props: P, ...children: any[]) => HTMLElement
```

**Example:**
```typescript
import { styled, div } from 'rynex';

// Static styles
const StyledButton = styled('button', {
  padding: '0.75rem 1.5rem',
  background: '#00ff88',
  color: '#000',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
});

// Usage
StyledButton({}, 'Click Me');

// Dynamic styles based on props
const StyledBox = styled<{ variant: 'primary' | 'secondary' }>('div', (props) => ({
  padding: '1rem',
  background: props.variant === 'primary' ? '#00ff88' : '#666',
  color: props.variant === 'primary' ? '#000' : '#fff'
}));

// Usage
StyledBox({ variant: 'primary' }, 'Primary Box');
StyledBox({ variant: 'secondary' }, 'Secondary Box');
```

## classNames

Combines class names conditionally.

**Signature:**
```typescript
function classNames(
  ...args: (string | Record<string, boolean> | false | null | undefined)[]
): string
```

**Example:**
```typescript
import { classNames, div, state } from 'rynex';

const appState = state({ 
  isActive: true, 
  hasError: false 
});

div({
  class: classNames(
    'base-class',
    { 'active': appState.isActive },
    { 'error': appState.hasError },
    appState.isActive && 'highlighted'
  )
}, 'Content');

// Result: "base-class active highlighted"
```

## mergeStyles

Merges multiple style objects.

**Signature:**
```typescript
function mergeStyles(
  ...styles: (Partial<CSSStyleDeclaration> | Record<string, any> | null | undefined)[]
): Record<string, any>
```

**Example:**
```typescript
import { mergeStyles, div } from 'rynex';

const baseStyles = {
  padding: '1rem',
  background: '#f0f0f0'
};

const activeStyles = {
  background: '#00ff88',
  fontWeight: 'bold'
};

const merged = mergeStyles(baseStyles, activeStyles);

div({ style: merged }, 'Content');
// Result: { padding: '1rem', background: '#00ff88', fontWeight: 'bold' }
```

## Theme Management

### setTheme

Sets the application theme.

**Signature:**
```typescript
function setTheme(theme: Theme): void
```

**Example:**
```typescript
import { setTheme } from 'rynex';

setTheme({
  mode: 'dark',
  colors: {
    primary: '#00ff88',
    secondary: '#666',
    background: '#000',
    text: '#fff'
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem'
  }
});
```

### getTheme

Gets the current theme.

**Signature:**
```typescript
function getTheme(): Theme
```

**Example:**
```typescript
import { getTheme } from 'rynex';

const currentTheme = getTheme();
console.log('Current mode:', currentTheme.mode);
```

### useTheme

Subscribes to theme changes.

**Signature:**
```typescript
function useTheme(
  callback: (theme: Theme) => void
): () => void
```

**Example:**
```typescript
import { useTheme, div, state } from 'rynex';

const appState = state({ theme: {} });

const cleanup = useTheme((theme) => {
  appState.theme = theme;
  console.log('Theme updated:', theme);
});

// Later, cleanup
cleanup();
```

## CSS Variables

### createCSSVariables

Generates CSS variables from a theme object.

**Signature:**
```typescript
function createCSSVariables(
  theme: Theme,
  prefix?: string
): string
```

**Example:**
```typescript
import { createCSSVariables } from 'rynex';

const theme = {
  primary: '#00ff88',
  secondary: '#666',
  spacing: {
    small: '0.5rem',
    large: '2rem'
  }
};

const cssVars = createCSSVariables(theme, '--app');
// Result:
// --app-primary: #00ff88;
// --app-secondary: #666;
// --app-spacing-small: 0.5rem;
// --app-spacing-large: 2rem;
```

### applyThemeVariables

Applies theme as CSS variables to the document root.

**Signature:**
```typescript
function applyThemeVariables(
  theme: Theme,
  prefix?: string
): void
```

**Example:**
```typescript
import { applyThemeVariables } from 'rynex';

applyThemeVariables({
  primary: '#00ff88',
  background: '#000',
  text: '#fff'
}, '--theme');

// Now use in CSS:
// color: var(--theme-primary);
// background: var(--theme-background);
```

### getCSSVariable

Gets a CSS variable value.

**Signature:**
```typescript
function getCSSVariable(
  name: string,
  element?: HTMLElement
): string
```

**Example:**
```typescript
import { getCSSVariable } from 'rynex';

const primaryColor = getCSSVariable('--theme-primary');
console.log('Primary color:', primaryColor);
```

### setCSSVariable

Sets a CSS variable value.

**Signature:**
```typescript
function setCSSVariable(
  name: string,
  value: string,
  element?: HTMLElement
): void
```

**Example:**
```typescript
import { setCSSVariable } from 'rynex';

setCSSVariable('--theme-primary', '#ff0088');
```

## Practical Examples

### Theme Switcher
```typescript
import { setTheme, useTheme, button, div, state } from 'rynex';

function ThemeSwitcher() {
  const appState = state({ currentTheme: 'light' });
  
  const lightTheme = {
    mode: 'light',
    background: '#fff',
    text: '#000',
    primary: '#007bff'
  };
  
  const darkTheme = {
    mode: 'dark',
    background: '#000',
    text: '#fff',
    primary: '#00ff88'
  };
  
  useTheme((theme) => {
    appState.currentTheme = theme.mode;
  });
  
  return div({}, [
    button({
      onClick: () => setTheme(lightTheme)
    }, 'Light Theme'),
    button({
      onClick: () => setTheme(darkTheme)
    }, 'Dark Theme'),
    div({}, () => `Current: ${appState.currentTheme}`)
  ]);
}
```

### Styled Component System
```typescript
import { styled } from 'rynex';

// Button variants
const Button = styled<{ variant?: 'primary' | 'secondary' | 'danger' }>('button', (props) => {
  const variants = {
    primary: { background: '#00ff88', color: '#000' },
    secondary: { background: '#666', color: '#fff' },
    danger: { background: '#ff4444', color: '#fff' }
  };
  
  return {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    ...variants[props.variant || 'primary']
  };
});

// Usage
Button({ variant: 'primary' }, 'Primary');
Button({ variant: 'secondary' }, 'Secondary');
Button({ variant: 'danger' }, 'Delete');
```

### Conditional Styling
```typescript
import { classNames, div, state } from 'rynex';

function StatusBadge() {
  const status = state({ 
    type: 'success',
    isActive: true 
  });
  
  return div({
    class: classNames(
      'badge',
      `badge-${status.type}`,
      {
        'badge-active': status.isActive,
        'badge-inactive': !status.isActive
      }
    )
  }, () => status.type);
}
```

### Responsive Styles
```typescript
import { mergeStyles, div, state } from 'rynex';

function ResponsiveBox() {
  const viewport = state({ width: window.innerWidth });
  
  window.addEventListener('resize', () => {
    viewport.width = window.innerWidth;
  });
  
  const baseStyles = {
    padding: '1rem',
    background: '#f0f0f0'
  };
  
  const mobileStyles = viewport.width < 768 ? {
    fontSize: '14px',
    padding: '0.5rem'
  } : {};
  
  const desktopStyles = viewport.width >= 768 ? {
    fontSize: '16px',
    padding: '2rem'
  } : {};
  
  return div({
    style: mergeStyles(baseStyles, mobileStyles, desktopStyles)
  }, 'Responsive Content');
}
```

### CSS-in-JS with Theme
```typescript
import { styled, getTheme } from 'rynex';

const ThemedCard = styled('div', () => {
  const theme = getTheme();
  
  return {
    padding: '1.5rem',
    background: theme.background || '#fff',
    color: theme.text || '#000',
    border: `1px solid ${theme.primary || '#ccc'}`,
    borderRadius: '8px'
  };
});
```

### Dynamic CSS Variables
```typescript
import { setCSSVariable, getCSSVariable, button, div } from 'rynex';

function ColorPicker() {
  const colors = ['#00ff88', '#ff0088', '#0088ff'];
  
  return div({}, [
    ...colors.map(color => 
      button({
        onClick: () => {
          setCSSVariable('--theme-primary', color);
        },
        style: { background: color }
      }, 'Set Color')
    ),
    div({
      style: { 
        padding: '1rem',
        background: () => getCSSVariable('--theme-primary') || '#ccc'
      }
    }, 'Themed Box')
  ]);
}
```

## Best Practices

### 1. Use Styled Components for Reusability
```typescript
// Good - reusable styled component
const Card = styled('div', {
  padding: '1.5rem',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
});

// Use everywhere
Card({}, 'Content 1');
Card({}, 'Content 2');
```

### 2. Centralize Theme Configuration
```typescript
// theme.ts
export const lightTheme = {
  mode: 'light',
  colors: { /* ... */ },
  spacing: { /* ... */ },
  typography: { /* ... */ }
};

export const darkTheme = {
  mode: 'dark',
  colors: { /* ... */ },
  spacing: { /* ... */ },
  typography: { /* ... */ }
};
```

### 3. Use CSS Variables for Dynamic Theming
```typescript
// Apply once
applyThemeVariables(theme);

// Use in components
div({
  style: {
    color: 'var(--theme-primary)',
    background: 'var(--theme-background)'
  }
});
```

### 4. Combine classNames for Flexibility
```typescript
const classes = classNames(
  'base-class',
  props.className, // Allow override
  { 'modifier': condition }
);
```
