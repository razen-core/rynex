# Beta Release Quick Reference

## Key Tasks Priority Order

### Immediate (This Week)
1. Remove all emojis from CLI
2. Polish CLI messages and help text
3. Run linter and fix warnings
4. Update version to 0.1.0-beta.1

### Short Term (Next Week)
5. Complete unit tests
6. Complete integration tests
7. Update README and documentation
8. Test on all templates

### Before Release
9. Final security audit
10. Browser compatibility testing
11. Final git commit and tag
12. Publish to NPM

---

## Files to Modify (Emoji Removal)

### CLI Files
```
src/cli/logger.ts          - Remove success/error/warning emojis
src/cli/progress.ts        - Remove progress emojis
src/cli/prompts.ts         - Remove prompt emojis
src/cli/error-handler.ts   - Remove error emojis
src/cli/builder.ts         - Remove build status emojis
src/cli/clean-command.ts   - Remove clean status emojis
src/cli/dev-server.ts      - Remove server emojis
src/cli/prod-server.ts     - Remove server emojis
```

### Documentation Files
```
README.md                  - Remove feature emojis
CONTRIBUTING.md            - Remove instruction emojis
templates/*/README.md      - Remove template emojis
```

---

## Commands to Run

### Build & Test
```bash
# Build framework
pnpm build:framework

# Run tests
pnpm test

# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check
pnpm type-check
```

### Testing
```bash
# Test on example
cd examples/builder-api-demo
pnpm build

# Test clean command
node ../../dist/cli/bin/rynex.js clean --force

# Test init
cd /tmp
node /path/to/dist/cli/bin/rynex.js init test-app
```

### Release
```bash
# Update version
# Edit package.json: "version": "0.1.0-beta.1"

# Commit
git add .
git commit -m "Prepare v0.1.0-beta.1 release"

# Tag
git tag v0.1.0-beta.1

# Push
git push origin main
git push origin v0.1.0-beta.1

# Publish
npm publish --tag beta
```

---

## Emoji Removal Pattern

### Before
```typescript
logger.success('Build complete');
logger.error('Build failed');
logger.warning('Warning message');
```

### After
```typescript
logger.success('Build complete');
logger.error('Build failed');
logger.warning('Warning message');
```

(Remove any emoji characters from messages)

---

## Documentation Checklist

### README.md Should Include
- [ ] Project description
- [ ] Features list
- [ ] Installation instructions
- [ ] Quick start guide
- [ ] CLI commands reference
- [ ] Project structure
- [ ] Examples
- [ ] Contributing guidelines
- [ ] License

### API Documentation Should Include
- [ ] Builder API with examples
- [ ] State management guide
- [ ] Routing documentation
- [ ] Component helpers
- [ ] TypeScript types
- [ ] Common patterns

### CLI Documentation Should Include
- [ ] All commands listed
- [ ] All options explained
- [ ] Examples for each command
- [ ] Troubleshooting section
- [ ] FAQ

---

## Testing Checklist

### Build Testing
- [ ] Empty template builds
- [ ] Minimal template builds
- [ ] Routed template builds
- [ ] Hash changes on content change
- [ ] Compression works (gzip, brotli)
- [ ] Source maps generated

### CLI Testing
- [ ] `rynex init` works
- [ ] `rynex build` works
- [ ] `rynex dev` works
- [ ] `rynex clean` works
- [ ] `rynex add` works
- [ ] `rynex init:css` works
- [ ] Error messages are clear

### Browser Testing
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Version Update Locations

Update all these files to 0.1.0-beta.1:
```
package.json
templates/empty/typescript/package.json
templates/minimal/typescript/package.json
templates/routed/typescript/package.json
```

---

## Files to Review

### High Priority
- src/cli/logger.ts
- src/cli/builder.ts
- src/cli/bin/rynex.ts
- README.md

### Medium Priority
- src/cli/clean-command.ts
- src/cli/dev-server.ts
- src/cli/prod-server.ts
- All template files

### Low Priority
- src/cli/parser.ts
- src/cli/config.ts
- src/cli/hash-utils.ts

---

## Success Criteria

Beta release is ready when:
- [ ] All emojis removed
- [ ] All tests passing
- [ ] No linting errors
- [ ] Documentation complete
- [ ] All commands tested
- [ ] Browser compatibility verified
- [ ] Security audit passed
- [ ] Version updated
- [ ] Git tagged
- [ ] Published to NPM

---

## Rollback Plan

If issues found after beta release:
1. Unpublish from NPM: `npm unpublish rynex@0.1.0-beta.1 --tag beta`
2. Fix issues
3. Increment beta: `0.1.0-beta.2`
4. Re-publish

---

## Contact & Support

- Issues: https://github.com/razen-core/rynex/issues
- Discussions: https://github.com/razen-core/rynex/discussions
- Email: support@rynex.dev (if applicable)

---

**Last Updated**: October 27, 2025
**Status**: Ready to Start Phase 1
