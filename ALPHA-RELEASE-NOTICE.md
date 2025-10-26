# Alpha Release Notice - Builder API

## Work in Progress

This is an **ALPHA RELEASE** of the new Rynex Builder API. The Builder pattern is currently under active development.

### Current Status

**Implemented (Alpha):**
- Base `ElementBuilder` class with 50+ chainable methods
- Layout helpers: `vbox()`, `hbox()`, `grid()`, `center()`, `stack()`
- Basic elements: `text()`, `button()`, `input()`, `image()`, `link()`
- Typography: `h1()` - `h6()`, `strong()`, `em()`, `code()`, `pre()`
- Forms: `form()`, `textarea()`, `select()`, `checkbox()`, `radio()`
- Semantic: `header()`, `footer()`, `nav()`, `main()`, `section()`, `article()`
- Tables: `table()`, `thead()`, `tbody()`, `tr()`, `th()`, `td()`
- Media: `video()`, `audio()`, `canvas()`, `iframe()`
- Validator updated to support Builder API

**In Development (Est. 2 days):**
- Additional specialized builders for complex components
- Enhanced type inference for chained methods
- Performance optimizations for builder pattern
- More comprehensive examples and documentation
- Full test coverage for all builder methods
- Migration guide from old syntax to Builder API

### What This Means

- **The API is functional** but may have rough edges
- **Breaking changes possible** in the next few releases
- **Legacy functions available** (suffixed with `Legacy`) for backward compatibility
- **Production use not recommended** until stable v1.0

### Usage Example

```typescript
import { vbox, text, button } from 'rynex/helpers';
import { state } from 'rynex/state';

const count = state({ value: 0 });

const app = vbox()
  .pad(2)
  .gap(1)
  .bg('#fff')
  .radius(1)
  .add([
    text(() => `Count: ${count.value}`)
      .size(2)
      .weight('bold')
      .build(),
    
    button('+')
      .click(() => count.value++)
      .bg('#22c55e')
      .color('#fff')
      .pad(0.75)
      .radius(0.5)
      .build()
  ])
  .build();
```

### Timeline

- **Alpha Release**: Now (Current)
- **Beta Release**: ~2 days (Full implementation)
- **Stable v1.0**: ~1 week (After testing and refinement)

### Feedback

We welcome feedback and bug reports! Please open an issue on GitHub if you encounter any problems.

### Migration Path

If you're using the old syntax, don't worry! Legacy functions are still available:

```typescript
// Old syntax (still works)
import { vbox } from 'rynex/helpers';
const box = vbox({ style: { padding: '2rem' } }, [children]);

// New Builder API
const box = vbox().pad(2).add([children]).build();
```

---

**Last Updated**: October 26, 2025  
**Version**: 0.1.60-alpha  
**Status**: Alpha - Active Development
