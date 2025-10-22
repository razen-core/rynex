# Components

Pre-built UI components for common patterns. Use these ready-made components to speed up development and maintain consistency across your application.

## Functions

### badge

Display a small label or tag with different variants.

**Usage**:
```typescript
import { badge, text } from 'rynex';

badge({ variant: 'primary' }, text('New'))
badge({ variant: 'success' }, text('Active'))
badge({ variant: 'danger' }, text('Error'))
```

**Variants**: primary, secondary, success, warning, danger

### card

Create a container for grouped content with styling.

**Usage**:
```typescript
import { card, h3, p, text } from 'rynex';

card(
  {},
  h3({}, text('Card Title')),
  p({}, text('Card content goes here'))
)
```

### avatar

Display a circular profile image.

**Usage**:
```typescript
import { avatar } from 'rynex';

avatar({
  src: '/profile.jpg',
  alt: 'User',
  size: '48px'
})
```

**Properties**: src, alt, size

### icon

Render SVG icons with consistent sizing.

**Usage**:
```typescript
import { icon } from 'rynex';

icon({ size: '24px' }, '<path d="..." />')
```

### tooltip

Show helpful text on hover.

**Usage**:
```typescript
import { tooltip, button, text } from 'rynex';

tooltip(
  { text: 'Click to save' },
  button({}, text('Save'))
)
```

### modal

Display a modal dialog box.

**Usage**:
```typescript
import { modal, h2, p, button, text } from 'rynex';

modal(
  { open: true, onClose: () => {} },
  h2({}, text('Confirm')),
  p({}, text('Are you sure?')),
  button({}, text('Yes'))
)
```

**Properties**: open, onClose

### dropdown

Create a dropdown menu.

**Usage**:
```typescript
import { dropdown, button, text } from 'rynex';

dropdown(
  {
    items: [
      { label: 'Option 1', onClick: () => {} },
      { label: 'Option 2', onClick: () => {} }
    ]
  },
  button({}, text('Menu'))
)
```

### toggle

Create a switch/toggle button.

**Usage**:
```typescript
import { toggle } from 'rynex';

toggle({
  checked: false,
  onChange: (checked) => console.log(checked)
})
```

### slider

Create a range input slider.

**Usage**:
```typescript
import { slider } from 'rynex';

slider({
  min: 0,
  max: 100,
  value: 50,
  onChange: (value) => console.log(value)
})
```

### progressBar

Display a progress indicator.

**Usage**:
```typescript
import { progressBar } from 'rynex';

progressBar({ value: 65, max: 100 })
```

### spinner

Show a loading spinner.

**Usage**:
```typescript
import { spinner } from 'rynex';

spinner({ size: '40px' })
```

### tabs

Create tabbed content sections.

**Usage**:
```typescript
import { tabs, div, text } from 'rynex';

tabs({
  tabs: [
    { label: 'Tab 1', content: div({}, text('Content 1')) },
    { label: 'Tab 2', content: div({}, text('Content 2')) }
  ],
  defaultIndex: 0,
  onChange: (index) => console.log(index)
})
```

### accordion

Create expandable accordion sections.

**Usage**:
```typescript
import { accordion, div, text } from 'rynex';

accordion({
  items: [
    { title: 'Section 1', content: div({}, text('Content 1')) },
    { title: 'Section 2', content: div({}, text('Content 2')) }
  ],
  allowMultiple: false,
  defaultOpen: [0]
})
```

## Common Patterns

### User Card

```typescript
import { card, avatar, h3, p, text, hbox } from 'rynex';

card(
  {},
  hbox(
    { gap: '1rem' },
    avatar({ src: '/user.jpg', size: '60px' }),
    div(
      {},
      h3({}, text('John Doe')),
      p({}, text('Developer'))
    )
  )
)
```

### Settings Panel

```typescript
import { div, h2, label, toggle, text } from 'rynex';

div(
  { class: 'settings' },
  h2({}, text('Settings')),
  label({}, toggle({ checked: true }), ' Enable notifications'),
  label({}, toggle({ checked: false }), ' Dark mode')
)
```

### Loading State

```typescript
import { div, spinner, text } from 'rynex';

div(
  { style: { textAlign: 'center' } },
  spinner({ size: '40px' }),
  text('Loading...')
)
```

## Tips

- Use badges for status indicators
- Use cards to group related content
- Use tooltips for helpful hints
- Use modals for important confirmations
- Use tabs for organizing content
- Use accordions for FAQs
- Keep component styling consistent
- Combine components for complex UIs

## Next Steps

- Learn about [Basic Elements](./basic-elements.md)
- Explore [Layout Helpers](./layout.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Basic Elements](./basic-elements.md)
- [Layout Helpers](./layout.md)
- [Utilities](./utilities.md)
