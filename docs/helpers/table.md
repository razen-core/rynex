# Table Elements

Table elements allow you to display structured data in rows and columns. Create organized, accessible data tables with headers, footers, and proper semantic structure.

## Functions

### table

Create a table container for tabular data.

**Usage**:
```typescript
import { table, thead, tbody, tr, th, td, text } from 'rynex';

table(
  {},
  thead(
    {},
    tr({},
      th({}, text('Name')),
      th({}, text('Age'))
    )
  ),
  tbody(
    {},
    tr({},
      td({}, text('John')),
      td({}, text('30'))
    )
  )
)
```

**Properties**:
- `class`: CSS class names
- `style`: CSS styles object
- `border`: Border attribute

### thead

Create the header section of a table.

**Usage**:
```typescript
import { thead, tr, th, text } from 'rynex';

thead(
  {},
  tr({},
    th({}, text('Column 1')),
    th({}, text('Column 2')),
    th({}, text('Column 3'))
  )
)
```

**When to Use**:
- Column headers
- First row with labels
- Repeated on each page (print)

### tbody

Create the body section of a table with data rows.

**Usage**:
```typescript
import { tbody, tr, td, text } from 'rynex';

tbody(
  {},
  tr({},
    td({}, text('Data 1')),
    td({}, text('Data 2'))
  ),
  tr({},
    td({}, text('Data 3')),
    td({}, text('Data 4'))
  )
)
```

**When to Use**:
- Main table data
- Multiple rows of content

### tfoot

Create the footer section of a table.

**Usage**:
```typescript
import { tfoot, tr, td, text } from 'rynex';

tfoot(
  {},
  tr({},
    td({}, text('Total')),
    td({}, text('$1000'))
  )
)
```

**When to Use**:
- Summary rows
- Totals or calculations
- Footer information

### tr

Create a table row.

**Usage**:
```typescript
import { tr, td, text } from 'rynex';

tr(
  {},
  td({}, text('Cell 1')),
  td({}, text('Cell 2')),
  td({}, text('Cell 3'))
)
```

**Properties**:
- `class`: CSS class names
- `style`: CSS styles object

### th

Create a table header cell.

**Usage**:
```typescript
import { th, text } from 'rynex';

th({}, text('Header'))
```

**Properties**:
- `scope`: Scope (row, col, rowgroup, colgroup)
- `colspan`: Span multiple columns
- `rowspan`: Span multiple rows
- `class`: CSS class names

### td

Create a table data cell.

**Usage**:
```typescript
import { td, text } from 'rynex';

td({}, text('Data'))
```

**Properties**:
- `colspan`: Span multiple columns
- `rowspan`: Span multiple rows
- `headers`: Associated header IDs
- `class`: CSS class names

### caption

Add a title or description to a table.

**Usage**:
```typescript
import { caption, text } from 'rynex';

caption({}, text('Sales Data 2025'))
```

**When to Use**:
- Table title
- Table description
- Appears above the table

### colgroup

Group columns together for styling.

**Usage**:
```typescript
import { colgroup, col } from 'rynex';

colgroup(
  {},
  col({ style: { width: '100px' } }),
  col({ style: { width: '200px' } }),
  col({ style: { width: '150px' } })
)
```

**When to Use**:
- Apply styles to entire columns
- Define column widths
- Group related columns

### col

Define properties for a column or group of columns.

**Usage**:
```typescript
import { col } from 'rynex';

col({
  style: { width: '200px', background: '#f0f0f0' }
})
```

**Properties**:
- `span`: Number of columns to span
- `style`: CSS styles for the column
- `class`: CSS class names

## Common Patterns

### Basic Data Table

```typescript
import { table, thead, tbody, tr, th, td, caption, text } from 'rynex';

table(
  {},
  caption({}, text('Employee Data')),
  thead(
    {},
    tr({},
      th({}, text('Name')),
      th({}, text('Position')),
      th({}, text('Salary'))
    )
  ),
  tbody(
    {},
    tr({},
      td({}, text('John Doe')),
      td({}, text('Manager')),
      td({}, text('$80,000'))
    ),
    tr({},
      td({}, text('Jane Smith')),
      td({}, text('Developer')),
      td({}, text('$70,000'))
    )
  )
)
```

### Table with Footer

```typescript
import { table, thead, tbody, tfoot, tr, th, td, text } from 'rynex';

table(
  {},
  thead(
    {},
    tr({},
      th({}, text('Item')),
      th({}, text('Quantity')),
      th({}, text('Price'))
    )
  ),
  tbody(
    {},
    tr({},
      td({}, text('Apple')),
      td({}, text('5')),
      td({}, text('$2.50'))
    ),
    tr({},
      td({}, text('Orange')),
      td({}, text('3')),
      td({}, text('$1.50'))
    )
  ),
  tfoot(
    {},
    tr({},
      td({}, text('Total')),
      td({}, text('8')),
      td({}, text('$4.00'))
    )
  )
)
```

### Table with Column Widths

```typescript
import { table, colgroup, col, thead, tbody, tr, th, td, text } from 'rynex';

table(
  {},
  colgroup(
    {},
    col({ style: { width: '150px' } }),
    col({ style: { width: '200px' } }),
    col({ style: { width: '100px' } })
  ),
  thead(
    {},
    tr({},
      th({}, text('Name')),
      th({}, text('Description')),
      th({}, text('Price'))
    )
  ),
  tbody(
    {},
    tr({},
      td({}, text('Product')),
      td({}, text('Description')),
      td({}, text('$99'))
    )
  )
)
```

### Comparison Table

```typescript
import { table, thead, tbody, tr, th, td, text } from 'rynex';

table(
  { class: 'comparison' },
  thead(
    {},
    tr({},
      th({}, text('Feature')),
      th({}, text('Plan A')),
      th({}, text('Plan B')),
      th({}, text('Plan C'))
    )
  ),
  tbody(
    {},
    tr({},
      td({}, text('Price')),
      td({}, text('$9')),
      td({}, text('$19')),
      td({}, text('$29'))
    ),
    tr({},
      td({}, text('Storage')),
      td({}, text('10GB')),
      td({}, text('100GB')),
      td({}, text('1TB'))
    )
  )
)
```

### Merged Cells

```typescript
import { table, tr, th, td, text } from 'rynex';

table(
  {},
  tr({},
    th({ colspan: 2 }, text('Header')),
    th({}, text('Column 3'))
  ),
  tr({},
    td({}, text('Cell 1')),
    td({}, text('Cell 2')),
    td({}, text('Cell 3'))
  )
)
```

### Dynamic Data Table

```typescript
import { table, thead, tbody, tr, th, td, text, list } from 'rynex';

const data = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];

table(
  {},
  thead(
    {},
    tr({},
      th({}, text('Name')),
      th({}, text('Age'))
    )
  ),
  tbody(
    {},
    list({
      items: data,
      renderItem: (item) => tr({},
        td({}, text(item.name)),
        td({}, text(String(item.age)))
      )
    })
  )
)
```

## Table Styling

```typescript
import { table, tr, th, td, text } from 'rynex';

table(
  {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'Arial, sans-serif'
    }
  },
  tr({
    style: {
      borderBottom: '1px solid #ddd'
    }
  },
    th({
      style: {
        padding: '12px',
        textAlign: 'left',
        background: '#4CAF50',
        color: 'white'
      }
    }, text('Header'))
  )
)
```

## Accessibility Tips

- Use `<thead>`, `<tbody>`, `<tfoot>` for structure
- Use `<th>` for header cells with `scope` attribute
- Add `<caption>` to describe the table
- Use `colspan` and `rowspan` carefully
- Provide `headers` attribute for complex tables
- Ensure sufficient color contrast
- Make tables responsive on mobile
- Use semantic HTML structure

## Table Best Practices

- Keep tables simple and organized
- Use clear, descriptive headers
- Avoid nested tables
- Use proper semantic elements
- Add captions for clarity
- Make tables responsive
- Use consistent styling
- Test with screen readers

## Tips

- Always use `<thead>`, `<tbody>`, `<tfoot>`
- Use `<th>` with `scope` for headers
- Add `<caption>` for table description
- Keep data organized and logical
- Use CSS for styling, not attributes
- Make tables mobile-friendly
- Test accessibility with screen readers
- Consider alternative formats for complex data

## Next Steps

- Learn about [Basic Elements](./basic-elements.md) for content
- Explore [Semantic Elements](./semantic.md) for structure
- Check [Best Practices](../best-practices.md) for table design

## Related

- [Basic Elements](./basic-elements.md)
- [Semantic Elements](./semantic.md)
- [Utilities](./utilities.md)
