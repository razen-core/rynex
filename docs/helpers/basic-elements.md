# Basic Elements

Basic elements are the fundamental building blocks for creating web interfaces. These functions create standard HTML elements with support for properties, children, and reactive updates.

## Functions

### div

Create a generic container element. Use it to group and organize other elements.

**Usage**:
```typescript
import { div, text } from 'rynex';

div(
  { class: 'container' },
  text('Content here')
);
```

**Properties**:
- `class`: CSS class names
- `style`: CSS styles object
- `id`: Element ID

### span

Create an inline container element. Use it for inline content that needs styling or grouping.

**Usage**:
```typescript
import { span, text } from 'rynex';

span(
  { class: 'highlight' },
  text('Important text')
);
```

**Properties**:
- `class`: CSS class names
- `style`: CSS styles object

### text

Display text with support for static and reactive content. Text automatically updates when reactive values change.

**Usage - Static Text**:
```typescript
import { text } from 'rynex';

text('Hello, World!')
```

**Usage - Reactive Text**:
```typescript
import { text, state } from 'rynex';

const count = state(0);
text(() => `Count: ${count.value}`)
```

**Usage - With Properties**:
```typescript
import { text } from 'rynex';

text(
  { class: 'label' },
  'Static text'
)
```

**Usage - Reactive with Properties**:
```typescript
import { text, state } from 'rynex';

const name = state('John');
text(
  { class: 'greeting' },
  () => `Hello, ${name.value}!`
)
```

### button

Create a clickable button element. Buttons can have static or reactive text content.

**Usage - Simple Button**:
```typescript
import { button } from 'rynex';

button(
  { onClick: () => console.log('Clicked!') },
  'Click Me'
)
```

**Usage - Reactive Button Text**:
```typescript
import { button, state } from 'rynex';

const isActive = state(false);

button(
  { onClick: () => isActive.value = !isActive.value },
  () => isActive.value ? 'Active' : 'Inactive'
)
```

**Properties**:
- `onClick`: Click handler function
- `disabled`: Disable the button
- `type`: Button type (button, submit, reset)
- `class`: CSS class names
- `style`: CSS styles object

### input

Create an input field for user text entry.

**Usage**:
```typescript
import { input } from 'rynex';

input({
  type: 'text',
  placeholder: 'Enter your name',
  value: 'John'
})
```

**Properties**:
- `type`: Input type (text, email, password, number, etc.)
- `placeholder`: Placeholder text
- `value`: Initial value
- `disabled`: Disable the input
- `onChange`: Change handler
- `onInput`: Input handler

### image

Display an image with optional lazy loading support.

**Usage - Basic Image**:
```typescript
import { image } from 'rynex';

image({
  src: '/images/photo.jpg',
  alt: 'A photo'
})
```

**Usage - With Lazy Loading**:
```typescript
import { image } from 'rynex';

image({
  src: '/images/photo.jpg',
  alt: 'A photo',
  lazy: true
})
```

**Properties**:
- `src`: Image URL (required)
- `alt`: Alternative text for accessibility
- `lazy`: Enable lazy loading
- `width`: Image width
- `height`: Image height

### link

Create a hyperlink element for navigation.

**Usage**:
```typescript
import { link, text } from 'rynex';

link(
  { href: '/about' },
  text('About Us')
)
```

**Usage - External Link**:
```typescript
import { link, text } from 'rynex';

link(
  { href: 'https://example.com', target: '_blank' },
  text('Visit Example')
)
```

**Properties**:
- `href`: Link URL (required)
- `target`: Link target (_blank, _self, etc.)
- `rel`: Link relationship (noopener, noreferrer, etc.)
- `title`: Link title

### label

Create a label element for form inputs.

**Usage**:
```typescript
import { label, input } from 'rynex';

label(
  { htmlFor: 'email-input' },
  'Email Address'
)
```

**Properties**:
- `htmlFor`: ID of associated input
- `class`: CSS class names

### p

Create a paragraph element for text content.

**Usage**:
```typescript
import { p, text } from 'rynex';

p(
  { class: 'description' },
  text('This is a paragraph of text.')
)
```

**Properties**:
- `class`: CSS class names
- `style`: CSS styles object

### list

Render a list of items dynamically. Perfect for displaying arrays of data.

**Usage**:
```typescript
import { list, li } from 'rynex';

const items = ['Apple', 'Banana', 'Orange'];

list({
  items,
  renderItem: (item) => li({}, item)
})
```

**Usage - With Key Extractor**:
```typescript
import { list, li } from 'rynex';

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

list({
  items: users,
  renderItem: (user) => li({}, user.name),
  keyExtractor: (user) => user.id
})
```

**Properties**:
- `items`: Array of items to render
- `renderItem`: Function to render each item
- `keyExtractor`: Optional function to extract unique key for each item

### ul

Create an unordered list element.

**Usage**:
```typescript
import { ul, li, text } from 'rynex';

ul(
  {},
  li({}, text('Item 1')),
  li({}, text('Item 2')),
  li({}, text('Item 3'))
)
```

### ol

Create an ordered list element.

**Usage**:
```typescript
import { ol, li, text } from 'rynex';

ol(
  {},
  li({}, text('First')),
  li({}, text('Second')),
  li({}, text('Third'))
)
```

### li

Create a list item element.

**Usage**:
```typescript
import { li, text } from 'rynex';

li(
  { class: 'item' },
  text('List item')
)
```

### hr

Create a horizontal rule element for visual separation.

**Usage**:
```typescript
import { hr } from 'rynex';

hr({ class: 'divider' })
```

### br

Create a line break element.

**Usage**:
```typescript
import { br, text } from 'rynex';

text('Line 1'),
br(),
text('Line 2')
```

### dl

Create a description list element.

**Usage**:
```typescript
import { dl, dt, dd, text } from 'rynex';

dl(
  {},
  dt({}, text('Term')),
  dd({}, text('Definition'))
)
```

### dt

Create a description term element.

**Usage**:
```typescript
import { dt, text } from 'rynex';

dt({}, text('HTML'))
```

### dd

Create a description definition element.

**Usage**:
```typescript
import { dd, text } from 'rynex';

dd({}, text('HyperText Markup Language'))
```

## Common Patterns

### Form with Input and Label

```typescript
import { div, label, input, button } from 'rynex';

div(
  { class: 'form-group' },
  label({ htmlFor: 'name' }, 'Name'),
  input({ id: 'name', type: 'text', placeholder: 'Enter name' }),
  button({ type: 'submit' }, 'Submit')
)
```

### Dynamic List

```typescript
import { list, li, text } from 'rynex';

const items = state(['Apple', 'Banana', 'Orange']);

list({
  items: items.value,
  renderItem: (item) => li({}, text(item))
})
```

### Reactive Counter Display

```typescript
import { div, text, button } from 'rynex';

const count = state(0);

div(
  { class: 'counter' },
  text(() => `Count: ${count.value}`),
  button(
    { onClick: () => count.value++ },
    'Increment'
  )
)
```

### Image Gallery

```typescript
import { list, image } from 'rynex';

const photos = [
  { src: '/photo1.jpg', alt: 'Photo 1' },
  { src: '/photo2.jpg', alt: 'Photo 2' }
];

list({
  items: photos,
  renderItem: (photo) => image(photo)
})
```

## Tips

- Use `div` for block-level containers
- Use `span` for inline content
- Use `text` for dynamic content that needs to update
- Use `list` for rendering arrays of data
- Use `button` for user interactions
- Use `input` for form fields
- Use `image` with `lazy: true` for better performance
- Combine elements to build complex interfaces

## Next Steps

- Learn about [Layout Helpers](./layout.md) to arrange elements
- Explore [Forms](./forms.md) for advanced form elements
- Check [Components](./components.md) for pre-built UI components
- Read [Best Practices](../best-practices.md) for tips

## Related

- [Layout Helpers](./layout.md)
- [Typography](./typography.md)
- [Forms](./forms.md)
- [Components](./components.md)
