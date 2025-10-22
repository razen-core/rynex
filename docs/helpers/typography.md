# Typography

Typography helpers provide semantic HTML elements for formatting and displaying text. Use these functions to create well-structured, accessible text content.

## Functions

### Headings

Create heading elements for page structure and hierarchy.

**h1 - Main Heading**:
```typescript
import { h1, text } from 'rynex';

h1({}, text('Welcome to My Website'))
```

**h2 - Section Heading**:
```typescript
import { h2, text } from 'rynex';

h2({}, text('About Us'))
```

**h3 - Subsection Heading**:
```typescript
import { h3, text } from 'rynex';

h3({}, text('Our Team'))
```

**h4, h5, h6 - Lower Level Headings**:
```typescript
import { h4, h5, h6, text } from 'rynex';

h4({}, text('Heading 4'))
h5({}, text('Heading 5'))
h6({}, text('Heading 6'))
```

**Properties**:
- `class`: CSS class names
- `style`: CSS styles object
- `id`: Element ID

### strong

Create bold text with semantic meaning. Use for important content.

**Usage**:
```typescript
import { strong, text } from 'rynex';

text('This is ', strong({}, text('very important')), ' information.')
```

**When to Use**:
- Important warnings or alerts
- Key terms or concepts
- Emphasis on critical information

### em

Create italic text with semantic meaning. Use for emphasis.

**Usage**:
```typescript
import { em, text } from 'rynex';

text('This is ', em({}, text('emphasized')), ' text.')
```

**When to Use**:
- Stressed or emphasized words
- Foreign language phrases
- Titles of works

### code

Display inline code snippets.

**Usage**:
```typescript
import { code, text } from 'rynex';

text('Use the ', code({}, text('map()')), ' function to transform arrays.')
```

**Properties**:
- `class`: CSS class names (use for syntax highlighting)

### pre

Display preformatted text, usually code blocks.

**Usage**:
```typescript
import { pre, code, text } from 'rynex';

pre(
  { class: 'code-block' },
  code({}, text('const x = 10;\nconsole.log(x);'))
)
```

**Properties**:
- `class`: CSS class names

### blockquote

Display a block quotation.

**Usage**:
```typescript
import { blockquote, text } from 'rynex';

blockquote(
  { cite: 'https://example.com' },
  text('This is a famous quote.')
)
```

**Properties**:
- `cite`: URL of the source
- `class`: CSS class names

### mark

Highlight text with a background color.

**Usage**:
```typescript
import { mark, text } from 'rynex';

text('This text is ', mark({}, text('highlighted')), '.')
```

**Properties**:
- `class`: CSS class names
- `style`: CSS styles object

### small

Display smaller text, often for fine print.

**Usage**:
```typescript
import { small, text } from 'rynex';

small({}, text('Terms and conditions apply'))
```

**When to Use**:
- Disclaimers
- Fine print
- Secondary information

### del

Show deleted or removed text with strikethrough.

**Usage**:
```typescript
import { del, text } from 'rynex';

text('Price: ', del({}, text('$100')), ' $50')
```

**Properties**:
- `datetime`: When the text was deleted
- `cite`: URL explaining the deletion

### ins

Show inserted or added text with underline.

**Usage**:
```typescript
import { ins, text } from 'rynex';

text('New feature: ', ins({}, text('Dark mode support')))
```

**Properties**:
- `datetime`: When the text was inserted
- `cite`: URL explaining the insertion

### sub

Display subscript text (below the baseline).

**Usage**:
```typescript
import { sub, text } from 'rynex';

text('H', sub({}, text('2')), 'O')
```

### sup

Display superscript text (above the baseline).

**Usage**:
```typescript
import { sup, text } from 'rynex';

text('E=mc', sup({}, text('2')))
```

### abbr

Display an abbreviation with full text on hover.

**Usage**:
```typescript
import { abbr, text } from 'rynex';

abbr(
  { title: 'HyperText Markup Language' },
  text('HTML')
)
```

**Properties**:
- `title`: Full text of abbreviation (required)

### cite

Display a citation or reference.

**Usage**:
```typescript
import { cite, text } from 'rynex';

text('According to ', cite({}, text('The Great Gatsby')), ', ...')
```

### kbd

Display keyboard input or shortcut.

**Usage**:
```typescript
import { kbd, text } from 'rynex';

text('Press ', kbd({}, text('Ctrl+S')), ' to save.')
```

### samp

Display sample output from a program.

**Usage**:
```typescript
import { samp, text } from 'rynex';

text('Output: ', samp({}, text('Hello, World!')))
```

### varElement

Display a variable or placeholder.

**Usage**:
```typescript
import { varElement, text } from 'rynex';

text('The variable ', varElement({}, text('x')), ' contains the value.')
```

## Common Patterns

### Article with Headings

```typescript
import { h1, h2, p, text } from 'rynex';

div(
  {},
  h1({}, text('Main Article')),
  p({}, text('Introduction paragraph...')),
  h2({}, text('Section 1')),
  p({}, text('Section content...')),
  h2({}, text('Section 2')),
  p({}, text('More content...'))
)
```

### Code Documentation

```typescript
import { p, code, pre, text } from 'rynex';

div(
  {},
  p({}, text('Use the ', code({}, text('map()')), ' function:')),
  pre(
    { class: 'code-block' },
    code({}, text('array.map(item => item * 2)'))
  )
)
```

### Formatted Quote

```typescript
import { blockquote, text, small } from 'rynex';

blockquote(
  { cite: 'https://example.com' },
  text('This is a meaningful quote.'),
  small({}, text(' — Author Name'))
)
```

### Price Display with Discount

```typescript
import { del, text } from 'rynex';

div(
  {},
  text('Price: '),
  del({}, text('$100')),
  text(' $50 (50% off)')
)
```

### Scientific Formula

```typescript
import { p, text, sup, sub } from 'rynex';

p(
  {},
  text('The formula is: E=mc'),
  sup({}, text('2'))
)
```

### Abbreviation List

```typescript
import { abbr, text, ul, li } from 'rynex';

ul(
  {},
  li({}, abbr({ title: 'HyperText Markup Language' }, text('HTML'))),
  li({}, abbr({ title: 'Cascading Style Sheets' }, text('CSS'))),
  li({}, abbr({ title: 'JavaScript' }, text('JS')))
)
```

## Semantic HTML Best Practices

- Use `h1` for main page title (only one per page)
- Use `h2-h6` for section headings in order
- Use `strong` for important content, not just bold
- Use `em` for emphasis, not just italic
- Use `code` for inline code snippets
- Use `pre` for code blocks
- Use `blockquote` for quotations
- Use `abbr` with title for abbreviations
- Use `mark` for highlighting search results
- Use `del` and `ins` for tracked changes

## Accessibility Tips

- Always use proper heading hierarchy
- Use semantic elements for meaning, not just styling
- Provide `title` attribute for abbreviations
- Use `cite` attribute for blockquotes
- Ensure sufficient color contrast for marked text
- Use `datetime` for tracking changes

## Styling Typography

```typescript
import { h1, text } from 'rynex';

h1(
  {
    style: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '1rem'
    }
  },
  text('Styled Heading')
)
```

## Tips

- Use semantic elements for better SEO
- Combine typography elements for complex formatting
- Use CSS classes for consistent styling
- Keep heading hierarchy logical
- Use `code` and `pre` for technical content
- Mark important information with `strong`
- Use abbreviations with titles for clarity

## Next Steps

- Learn about [Basic Elements](./basic-elements.md) for text display
- Explore [Semantic Elements](./semantic.md) for page structure
- Check [Styles](./styles.md) for typography styling
- Read [Best Practices](../best-practices.md) for content tips

## Related

- [Basic Elements](./basic-elements.md)
- [Semantic Elements](./semantic.md)
- [Styles](./styles.md)
