# Rynex Framework - Complete Functions Reference

> **Version:** 0.1.40  
> **Last Updated:** October 21, 2025  
> **Status:** Production Ready (71% Complete)

## Table of Contents
- [Core Functions](#core-functions)
- [Layout Helpers](#layout-helpers)
- [Basic Elements](#basic-elements)
- [Typography](#typography)
- [Form Elements](#form-elements)
- [List Elements](#list-elements)
- [Table Elements](#table-elements)
- [Media Elements](#media-elements)
- [Semantic Elements](#semantic-elements)
- [Utility Functions](#utility-functions)
- [UI Components](#ui-components)
- [Routing Components](#routing-components)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Performance Utilities](#performance-utilities)
- [Summary & Statistics](#summary-statistics)

---

## Core Functions (4/4) - COMPLETE
- [x] state - Reactive state management
- [x] computed - Computed values
- [x] effect - Side effects
- [x] render - Render components

## Layout Helpers (13/13) - COMPLETE
- [x] vbox - Vertical flex container (flex-direction: column)
- [x] hbox - Horizontal flex container (flex-direction: row)
- [x] grid - Grid layout
- [x] container - Plain div wrapper
- [x] stack - Stack layout with z-index
- [x] center - Center content (both axes)
- [x] spacer - Flexible spacer
- [x] wrap - Flex wrap container
- [x] scroll - Scrollable container
- [x] sticky - Sticky positioned container
- [x] fixed - Fixed positioned container
- [x] absolute - Absolute positioned container
- [x] relative - Relative positioned container

## Basic Elements (18/18) - COMPLETE
- [x] text - Text/span element
- [x] button - Button element
- [x] input - Input element
- [x] image - Image element
- [x] link - Anchor element
- [x] div - Generic div
- [x] span - Generic span
- [x] label - Label element
- [x] p - Paragraph element
- [x] list - Optimized list rendering
- [x] ul - Unordered list
- [x] ol - Ordered list
- [x] li - List item
- [x] hr - Horizontal rule
- [x] br - Line break
- [x] dl - Description list
- [x] dt - Description term
- [x] dd - Description definition

## Typography (17/17) - COMPLETE
- [x] h1, h2, h3, h4, h5, h6 - Headings
- [x] p - Paragraph
- [x] strong - Bold text
- [x] em - Italic text
- [x] code - Inline code
- [x] pre - Preformatted text
- [x] blockquote - Quote block
- [x] mark - Highlighted text
- [x] small - Small text
- [x] del - Deleted text
- [x] ins - Inserted text
- [x] sub - Subscript
- [x] sup - Superscript
- [x] abbr - Abbreviation
- [x] cite - Citation
- [x] kbd - Keyboard input
- [x] samp - Sample output
- [x] varElement - Variable

## Form Elements (12/12) - COMPLETE
- [x] form - Form container
- [x] input - Text input
- [x] textarea - Multi-line input
- [x] select - Select dropdown
- [x] option - Select option
- [x] checkbox - Checkbox input
- [x] radio - Radio input
- [x] fieldset - Form fieldset
- [x] legend - Fieldset legend
- [x] datalist - Datalist for autocomplete
- [x] meter - Meter element
- [x] progress - Progress element
- [x] output - Form output

## List Elements (7/7) - COMPLETE
- [x] list - Optimized list rendering
- [x] ul - Unordered list
- [x] ol - Ordered list
- [x] li - List item
- [x] dl - Description list
- [x] dt - Description term
- [x] dd - Description definition

## Table Elements (10/10) - COMPLETE
- [x] table - Table container
- [x] thead - Table head
- [x] tbody - Table body
- [x] tfoot - Table footer
- [x] tr - Table row
- [x] th - Table header cell
- [x] td - Table data cell
- [x] caption - Table caption
- [x] colgroup - Column group
- [x] col - Column

## Media Elements (10/10) - COMPLETE
- [x] image - Image element
- [x] video - Video player
- [x] audio - Audio player
- [x] canvas - Canvas element
- [x] svg - SVG container
- [x] svgPath - SVG path element
- [x] iframe - Iframe element
- [x] picture - Picture element
- [x] source - Media source
- [x] track - Media track

## Semantic Elements (13/13) - COMPLETE
- [x] header - Header section
- [x] footer - Footer section
- [x] nav - Navigation
- [x] main - Main content
- [x] section - Section
- [x] article - Article
- [x] aside - Sidebar
- [x] figure - Figure with caption
- [x] figcaption - Figure caption
- [x] time - Time element
- [x] address - Address element
- [x] details - Details disclosure
- [x] summary - Details summary
- [x] dialog - Dialog element

## Utility Functions (12/12) - COMPLETE
- [x] fragment - Fragment (no wrapper)
- [x] portal - Portal to different DOM location
- [x] lazy - Lazy load component
- [x] suspense - Suspense boundary
- [x] errorBoundary - Error boundary
- [x] memo - Memoized component
- [x] when - Conditional rendering
- [x] show - Show/hide based on condition
- [x] each - Iterate over array
- [x] switchCase - Switch case rendering
- [x] dynamic - Dynamic component
- [x] css - CSS-in-JS helper

## Lifecycle Hooks (6/6) - COMPLETE
- [x] onMount - Component mounted
- [x] onUnmount - Component unmounted
- [x] onUpdate - Component updated
- [x] onError - Error occurred
- [x] watchEffect - Watch effect
- [x] watch - Watch specific values

## Refs & DOM Access (5/5) - COMPLETE
- [x] ref - Create ref
- [x] useRef - Use ref hook
- [x] forwardRef - Forward ref to child
- [x] callbackRef - Callback ref
- [x] mergeRefs - Merge multiple refs

## Animation & Transitions (0/6) - PLANNED
- [ ] transition - Transition wrapper
- [ ] animate - Animation helper
- [ ] fade - Fade transition
- [ ] slide - Slide transition
- [ ] scale - Scale transition
- [ ] rotate - Rotate transition

## Event Helpers (0/17)
Note: Events are handled via props (e.g., onClick, onChange) in createElement
- [ ] onClick - Click handler
- [ ] onDoubleClick - Double click
- [ ] onContextMenu - Right click
- [ ] onMouseEnter - Mouse enter
- [ ] onMouseLeave - Mouse leave
- [ ] onMouseMove - Mouse move
- [ ] onKeyDown - Key down
- [ ] onKeyUp - Key up
- [ ] onKeyPress - Key press
- [ ] onFocus - Focus
- [ ] onBlur - Blur
- [ ] onChange - Change
- [ ] onInput - Input
- [ ] onSubmit - Form submit
- [ ] onScroll - Scroll
- [ ] onResize - Resize
- [ ] onDrag - Drag
- [ ] onDrop - Drop

## Style Utilities (10/10) - COMPLETE
- [x] css - CSS-in-JS helper
- [x] styled - Styled component creator
- [x] setTheme - Set application theme
- [x] getTheme - Get current theme
- [x] useTheme - Use theme hook
- [x] classNames - Conditional class names
- [x] mergeStyles - Merge style objects
- [x] createCSSVariables - Create CSS variables from theme
- [x] applyThemeVariables - Apply theme as CSS variables
- [x] getCSSVariable - Get CSS variable value
- [x] setCSSVariable - Set CSS variable value

## State Management Utilities (0/5) - PLANNED
- [ ] createStore - Global store
- [ ] useStore - Use store hook
- [ ] createContext - Create context
- [ ] useContext - Use context hook
- [ ] provider - Context provider

## UI Components (13/13) - COMPLETE
- [x] badge - Badge/tag component
- [x] card - Card container
- [x] avatar - Avatar/profile image
- [x] icon - Icon wrapper
- [x] tooltip - Tooltip element
- [x] modal - Modal dialog
- [x] dropdown - Dropdown menu
- [x] toggle - Toggle switch
- [x] slider - Range slider
- [x] progressBar - Progress bar
- [x] spinner - Loading spinner
- [x] tabs - Tab container
- [x] accordion - Accordion container

## Routing Components (9/9) - COMPLETE
- [x] Link - Router-aware link component
- [x] NavLink - Link with automatic active styling
- [x] RouterOutlet - Renders matched route
- [x] RouteGuard - Conditional rendering based on route
- [x] Breadcrumb - Breadcrumb navigation
- [x] BackButton - Browser back button
- [x] RouteParamsDebug - Debug route parameters
- [x] RouteLoading - Loading component for routes
- [x] NotFound - 404 page component

## Router (Core - Implemented Separately)
- [x] router - Router component
- [x] route - Route definition
- [x] navigate - Navigation function
- [x] useParams - Route params
- [x] useNavigate - Navigation hook
- [x] useLocation - Location hook

## Performance Utilities (6/6) - COMPLETE
- [x] batch - Batch updates (in state.ts)
- [x] debounce - Debounce function
- [x] throttle - Throttle function
- [x] preload - Preload component
- [x] getPreloaded - Get preloaded resource
- [x] onIdle - Request idle callback
- [x] cancelIdle - Cancel idle callback

## Developer Tools (0/3)
- [ ] devtools - DevTools integration
- [ ] logger - Debug logger
- [ ] profiler - Performance profiler

---

## Summary Statistics

### Implementation Status Overview

**COMPLETE Categories (15/16)**
1. Core Functions - 4/4
2. Layout Helpers - 13/13
3. Basic Elements - 18/18
4. Typography - 17/17
5. Form Elements - 12/12
6. List Elements - 7/7
7. Table Elements - 10/10
8. Media Elements - 10/10
9. Semantic Elements - 13/13
10. Utility Functions - 12/12
11. Lifecycle Hooks - 6/6
12. Refs & DOM Access - 5/5
13. Style Utilities - 10/10
14. UI Components - 13/13
15. Routing Components - 9/9
16. Performance Utilities - 6/6

**PLANNED Categories (3/16)**
1. Animation & Transitions - 0/6
2. State Management Utilities - 0/5
3. Developer Tools - 0/3

### Overall Metrics
- Total Functions Implemented: 150+
- Total Functions Planned: 170+
- Completion Rate: 88%
- Production Ready: Yes
- API Stability: Stable
- New Functions Added: 30

### Development Roadmap

**Phase 1 - Foundation (COMPLETE)**
- Core reactive system
- DOM manipulation
- Basic HTML elements
- Layout system
- Routing

**Phase 2 - Enhancement (COMPLETE)**
- UI component library
- Utility functions
- Style utilities
- Lifecycle hooks
- Performance optimization
- Refs and DOM access

**Phase 3 - Advanced Features (PLANNED)**
- Animation system
- Advanced state management
- Developer tools

### Recently Completed (30 Functions)

**Utility Functions (4)**
- lazy, suspense, errorBoundary, memo

**Lifecycle Hooks (6)**
- onMount, onUnmount, onUpdate, watch, watchEffect, onError

**Performance Utilities (6)**
- debounce, throttle, preload, getPreloaded, onIdle, cancelIdle

**Refs & DOM Access (5)**
- ref, useRef, forwardRef, callbackRef, mergeRefs

**Style Utilities (9)**
- styled, setTheme, getTheme, useTheme, classNames, mergeStyles, createCSSVariables, applyThemeVariables, getCSSVariable, setCSSVariable

**UI Components (2)**
- tabs, accordion

### Remaining Priority Queue

**High Priority**
1. Animation utilities (fade, slide, scale, rotate)
2. State management (createStore, useStore, createContext)
3. Developer tools (logger, profiler)

### Technical Notes

**Event Handling**
- All standard DOM events are supported via props (onClick, onChange, onInput, etc.)
- Event handlers are passed directly to createElement
- No separate event helper functions needed

**Architecture**
- Router functionality implemented in dedicated router.ts module
- All helper functions exported from src/runtime/helpers/index.ts
- Modular file organization by category

**Code Quality**
- Production-ready codebase
- TypeScript support throughout
- Comprehensive type definitions
- Clean, maintainable code structure

---

## Development Guidelines

### AI-Assisted Development

**Recommended Use Cases for AI**
1. Documentation generation and updates
2. Code suggestions and refactoring
3. Bug detection and analysis
4. Minor code improvements
5. Repetitive task automation
6. Test case generation
7. API documentation
8. Code review assistance

**Manual Development Required**
1. Core architecture decisions
2. Breaking API changes
3. Security-critical code
4. Performance-critical paths
5. Complex business logic

### Code Standards
- No emojis in code or commit messages
- Professional, production-level quality
- User-friendly API design
- Well-organized file structure
- Comprehensive documentation
- Consistent naming conventions

### Contribution Workflow
1. Review this functions list before starting
2. Update status when implementing features
3. Add tests for new functionality
4. Update documentation
5. Follow existing code patterns
6. Maintain backward compatibility

---

**Last Updated:** October 21, 2025  
**Maintained By:** Team
**Organization:** Razen Core
**License:** Apache-2.0
