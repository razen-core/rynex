# Routing

Navigation and routing components for building single-page applications with client-side routing.

## Functions

### Link

Create a navigation link.

**Usage**:
```typescript
import { Link, text } from 'rynex';

Link({ to: '/about' }, text('About'))
```

**Properties**: to, class, style, activeClass, exact

### NavLink

Navigation link with active state styling.

**Usage**:
```typescript
import { NavLink, text } from 'rynex';

NavLink({ to: '/home', activeClass: 'active' }, text('Home'))
```

### RouterOutlet

Render matched route content.

**Usage**:
```typescript
import { RouterOutlet } from 'rynex';

RouterOutlet(router)
```

### RouteGuard

Conditionally render based on route.

**Usage**:
```typescript
import { RouteGuard } from 'rynex';

RouteGuard((ctx) => ctx.user.isAdmin, AdminPanel)
```

### Breadcrumb

Display breadcrumb navigation.

**Usage**:
```typescript
import { Breadcrumb } from 'rynex';

Breadcrumb({ separator: '/' })
```

### BackButton

Create a back navigation button.

**Usage**:
```typescript
import { BackButton } from 'rynex';

BackButton({ text: 'Go Back' })
```

### RouteParamsDebug

Debug route parameters.

**Usage**:
```typescript
import { RouteParamsDebug } from 'rynex';

RouteParamsDebug(router)
```

### RouteLoading

Show loading state during route transition.

**Usage**:
```typescript
import { RouteLoading } from 'rynex';

RouteLoading({ text: 'Loading...' })
```

### NotFound

Display 404 not found page.

**Usage**:
```typescript
import { NotFound } from 'rynex';

NotFound({ title: '404', message: 'Page not found' })
```

## Common Patterns

### Navigation Menu

```typescript
import { nav, NavLink, text } from 'rynex';

nav(
  {},
  NavLink({ to: '/' }, text('Home')),
  NavLink({ to: '/about' }, text('About')),
  NavLink({ to: '/contact' }, text('Contact'))
)
```

### Route with Guard

```typescript
import { RouteGuard } from 'rynex';

RouteGuard(
  (ctx) => ctx.user.isAuthenticated,
  ProtectedPage,
  LoginPage
)
```

## Tips

- Use NavLink for active state styling
- Use RouteGuard for protected routes
- Use Breadcrumb for navigation context
- Use BackButton for easy navigation
- Test routing on different devices

## Next Steps

- Learn about [Components](./components.md)
- Explore [Lifecycle Hooks](./lifecycle.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Components](./components.md)
- [Utilities](./utilities.md)
- [Lifecycle Hooks](./lifecycle.md)
