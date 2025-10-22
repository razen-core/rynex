# Semantic Elements

Semantic HTML elements provide meaning to your content structure. Use these elements to create well-organized, accessible pages that search engines and assistive technologies can understand.

## Functions

### header

Create a header section at the top of a page or section.

**Usage**:
```typescript
import { header, h1, nav, text } from 'rynex';

header(
  {},
  h1({}, text('My Website')),
  nav({}, text('Navigation'))
)
```

**When to Use**:
- Page header with logo and branding
- Section header with title
- Top navigation area

### footer

Create a footer section at the bottom of a page or section.

**Usage**:
```typescript
import { footer, text } from 'rynex';

footer(
  {},
  text('Copyright 2025 My Company')
)
```

**When to Use**:
- Page footer with copyright
- Contact information
- Links to policies
- Social media links

### nav

Create a navigation section with links.

**Usage**:
```typescript
import { nav, link, text } from 'rynex';

nav(
  {},
  link({ href: '/' }, text('Home')),
  link({ href: '/about' }, text('About')),
  link({ href: '/contact' }, text('Contact'))
)
```

**When to Use**:
- Main navigation menu
- Breadcrumb navigation
- Pagination links
- Related links

### main

Define the main content area of a page.

**Usage**:
```typescript
import { main, article, text } from 'rynex';

main(
  {},
  article({}, text('Main article content'))
)
```

**When to Use**:
- Primary page content
- Only one per page
- Skipped by screen readers when navigating

### section

Group related content into a section.

**Usage**:
```typescript
import { section, h2, p, text } from 'rynex';

section(
  {},
  h2({}, text('Features')),
  p({}, text('Our amazing features...'))
)
```

**When to Use**:
- Thematic grouping of content
- Chapters in a book
- Tabbed content sections
- Different topics on a page

### article

Mark standalone, self-contained content.

**Usage**:
```typescript
import { article, h2, p, text } from 'rynex';

article(
  {},
  h2({}, text('Blog Post Title')),
  p({}, text('Article content...'))
)
```

**When to Use**:
- Blog posts
- News articles
- Forum posts
- User comments
- Product reviews

### aside

Create a sidebar or supplementary content area.

**Usage**:
```typescript
import { aside, h3, ul, li, text } from 'rynex';

aside(
  {},
  h3({}, text('Related Links')),
  ul(
    {},
    li({}, link({ href: '#' }, text('Link 1'))),
    li({}, link({ href: '#' }, text('Link 2')))
  )
)
```

**When to Use**:
- Sidebars
- Related content
- Advertisements
- Call-to-action boxes
- Additional information

### figure

Display illustrations, diagrams, photos, or code examples.

**Usage**:
```typescript
import { figure, figcaption, image, text } from 'rynex';

figure(
  {},
  image({ src: '/photo.jpg', alt: 'A photo' }),
  figcaption({}, text('Photo caption'))
)
```

**When to Use**:
- Images with captions
- Diagrams and charts
- Code examples
- Illustrations

### figcaption

Provide a caption for a figure element.

**Usage**:
```typescript
import { figcaption, text } from 'rynex';

figcaption({}, text('Figure 1: Example diagram'))
```

**Properties**:
- `class`: CSS class names

### time

Mark a specific date or time.

**Usage**:
```typescript
import { time, text } from 'rynex';

text('Published on '),
time({ datetime: '2025-10-22' }, text('October 22, 2025'))
```

**Properties**:
- `datetime`: Machine-readable date/time (required for clarity)

**Datetime Format**:
- Date: `2025-10-22`
- Time: `14:30`
- Combined: `2025-10-22T14:30:00Z`

### address

Provide contact information for a person or organization.

**Usage**:
```typescript
import { address, text } from 'rynex';

address(
  {},
  text('Contact us at: '),
  link({ href: 'mailto:info@example.com' }, text('info@example.com'))
)
```

**When to Use**:
- Contact information
- Author details
- Business address
- Email addresses

### details

Create a disclosure widget with expandable content.

**Usage**:
```typescript
import { details, summary, text } from 'rynex';

details(
  { open: false },
  summary({}, text('Click to expand')),
  text('Hidden content that appears when expanded')
)
```

**Properties**:
- `open`: Show details expanded by default

### summary

Provide a summary or label for a details element.

**Usage**:
```typescript
import { summary, text } from 'rynex';

summary({}, text('Frequently Asked Questions'))
```

**Properties**:
- `class`: CSS class names

### dialog

Create a modal dialog box.

**Usage**:
```typescript
import { dialog, h2, p, button, text } from 'rynex';

dialog(
  { open: true },
  h2({}, text('Confirm Action')),
  p({}, text('Are you sure?')),
  button({}, text('Yes')),
  button({}, text('No'))
)
```

**Properties**:
- `open`: Show dialog open
- `onClose`: Close handler

## Common Patterns

### Basic Page Layout

```typescript
import { header, nav, main, article, aside, footer, h1, text, link } from 'rynex';

div(
  {},
  header(
    {},
    h1({}, text('My Site')),
    nav({}, link({ href: '/' }, text('Home')))
  ),
  main(
    {},
    article({}, text('Main content')),
    aside({}, text('Sidebar'))
  ),
  footer({}, text('Footer'))
)
```

### Blog Post

```typescript
import { article, h1, time, p, text } from 'rynex';

article(
  {},
  h1({}, text('Blog Post Title')),
  time({ datetime: '2025-10-22' }, text('October 22, 2025')),
  p({}, text('Post content...'))
)
```

### FAQ Section

```typescript
import { section, h2, details, summary, text } from 'rynex';

section(
  {},
  h2({}, text('Frequently Asked Questions')),
  details(
    {},
    summary({}, text('Question 1')),
    text('Answer 1')
  ),
  details(
    {},
    summary({}, text('Question 2')),
    text('Answer 2')
  )
)
```

### Product Page

```typescript
import { article, h1, figure, figcaption, image, aside, text } from 'rynex';

article(
  {},
  h1({}, text('Product Name')),
  figure(
    {},
    image({ src: '/product.jpg', alt: 'Product' }),
    figcaption({}, text('Product image'))
  ),
  aside({}, text('Price: $99'))
)
```

### Contact Information

```typescript
import { address, link, text } from 'rynex';

address(
  {},
  text('123 Main St, City, State 12345'),
  link({ href: 'tel:+1234567890' }, text('(123) 456-7890')),
  link({ href: 'mailto:info@example.com' }, text('info@example.com'))
)
```

## Semantic HTML Benefits

- **Better SEO**: Search engines understand page structure
- **Accessibility**: Screen readers navigate more effectively
- **Maintainability**: Code is more readable and organized
- **Styling**: CSS can target semantic elements
- **Standards**: Follows HTML5 best practices

## Page Structure Best Practices

```
<header>
  <h1>Site Title</h1>
  <nav>Navigation</nav>
</header>

<main>
  <article>Main content</article>
  <aside>Sidebar</aside>
</main>

<footer>
  <address>Contact info</address>
</footer>
```

## Accessibility Tips

- Use semantic elements for proper document structure
- One `<main>` element per page
- Use `<header>` and `<footer>` for page sections
- Use `<nav>` for navigation links
- Use `<article>` for independent content
- Use `<section>` for thematic grouping
- Use `<aside>` for supplementary content
- Provide `datetime` attribute for `<time>` elements
- Use `<address>` for contact information

## Tips

- Use semantic elements to structure your page
- Combine semantic elements for complex layouts
- Use CSS to style semantic elements
- Keep heading hierarchy logical
- Use `<section>` to group related content
- Use `<article>` for independent content
- Use `<aside>` for supplementary information
- Always include `<header>` and `<footer>`

## Next Steps

- Learn about [Basic Elements](./basic-elements.md) for content
- Explore [Layout Helpers](./layout.md) for positioning
- Check [Best Practices](../best-practices.md) for structure tips

## Related

- [Basic Elements](./basic-elements.md)
- [Layout Helpers](./layout.md)
- [Typography](./typography.md)
