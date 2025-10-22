# Developer Tools

Debugging and development utilities. Debug, log, and profile your application.

## Functions

### devtools

Initialize developer tools.

**Usage**:
```typescript
import { devtools } from 'rynex';

devtools({ enabled: true });
```

### logger

Create or get logger instance.

**Usage**:
```typescript
import { logger } from 'rynex';

const log = logger();
log.info('Application started');
```

### profiler

Get profiler instance.

**Usage**:
```typescript
import { profiler } from 'rynex';

const prof = profiler();
prof.start('operation');
// ... do something ...
prof.end('operation');
```

### log

Quick logging functions.

**Usage**:
```typescript
import { log } from 'rynex';

log.info('Info message');
log.warn('Warning message');
log.error('Error message');
log.debug('Debug message');
```

### profile

Quick profiling functions.

**Usage**:
```typescript
import { profile } from 'rynex';

profile.start('render');
// ... render code ...
profile.end('render');
```

### LogLevel

Log level enumeration.

**Usage**:
```typescript
import { LogLevel, logger } from 'rynex';

const log = logger({ level: LogLevel.DEBUG });
```

## Common Patterns

### Logging

```typescript
import { log } from 'rynex';

log.info('User logged in');
log.warn('Deprecated API used');
log.error('Failed to fetch data');
log.debug('Debug information');
```

### Performance Profiling

```typescript
import { profile } from 'rynex';

profile.start('fetch');
fetch('/api/data');
profile.end('fetch');

const report = profile.report();
```

### Logger Configuration

```typescript
import { logger, LogLevel } from 'rynex';

const log = logger({
  level: LogLevel.INFO,
  prefix: '[MyApp]',
  timestamp: true,
  colors: true
});

log.info('Application started');
```

## Log Levels

- DEBUG: Detailed debugging information
- INFO: General informational messages
- WARN: Warning messages
- ERROR: Error messages
- NONE: No logging

## Tips

- Use appropriate log levels
- Log important events
- Profile performance-critical code
- Use devtools for debugging
- Check browser console for logs
- Monitor performance metrics

## Next Steps

- Learn about [Lifecycle Hooks](./lifecycle.md)
- Explore [Performance](./performance.md)
- Check [Best Practices](../best-practices.md)

## Related

- [Lifecycle Hooks](./lifecycle.md)
- [Performance](./performance.md)
- [Utilities](./utilities.md)
