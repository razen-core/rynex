# Components Builder API - Implementation TODO

## Status: In Progress

The components.ts file contains 14 UI components that need Builder API implementation.

## Components List

### Completed
1. **badge()** - BadgeBuilder with variant() method

### Remaining (13 components)
2. **card()** - Needs CardBuilder
3. **avatar()** - Needs AvatarBuilder with size() method
4. **icon()** - Needs IconBuilder with size() method
5. **tooltip()** - Needs TooltipBuilder with text() method
6. **modal()** - Needs ModalBuilder with open() and onClose() methods
7. **dropdown()** - Needs DropdownBuilder with items() method
8. **toggle()** - Needs ToggleBuilder with checked() and onChange() methods
9. **slider()** - Needs SliderBuilder with min(), max(), value(), onChange() methods
10. **progressBar()** - Needs ProgressBarBuilder with value() and max() methods
11. **spinner()** - Needs SpinnerBuilder with size() method
12. **tabs()** - Needs TabsBuilder with tabs(), defaultIndex(), onChange() methods
13. **accordion()** - Needs AccordionBuilder with items(), allowMultiple(), defaultOpen() methods

## Implementation Pattern

Each component should follow this pattern:

```typescript
export class ComponentBuilder extends ElementBuilder<HTMLElement> {
  constructor() {
    super('element-tag');
    this.applyDefaultStyles();
  }

  // Custom methods for component-specific properties
  customMethod(value: any): this {
    // Apply the property
    return this;
  }

  private applyDefaultStyles(): void {
    // Set default styles
  }
}

export function component(): ComponentBuilder {
  return new ComponentBuilder();
}

// Legacy support
export function componentLegacy(props: DOMProps, ...args): HTMLElement {
  // Old implementation
}
```

## Estimated Time

- Each component: 20-30 minutes
- Total for 13 components: 4-6 hours
- Testing and validation: 1-2 hours
- **Total**: 5-8 hours

## Priority

HIGH - These are commonly used UI components that developers will want to use with the Builder API.

## Next Steps

1. Complete badge() implementation (DONE)
2. Implement card() - simple container
3. Implement avatar() - image with size
4. Implement icon() - SVG wrapper
5. Implement tooltip() - hover component
6. Implement modal() - overlay dialog
7. Implement dropdown() - menu component
8. Implement toggle() - switch component
9. Implement slider() - range input
10. Implement progressBar() - progress indicator
11. Implement spinner() - loading indicator
12. Implement tabs() - tabbed interface
13. Implement accordion() - collapsible panels

## Notes

- All legacy functions preserved with `Legacy` suffix
- Builder API is opt-in, old syntax still works
- Each builder extends ElementBuilder for common methods
- Custom methods added for component-specific features
