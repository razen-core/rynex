/**
 * Rynex Builder API Demo
 * Comprehensive example showcasing the new Rust-style Builder pattern
 * with full reactivity and re-rendering
 */

import { state, effect } from '../../../dist/runtime/index.js';
import { vbox, hbox, grid } from '../../../dist/runtime/index.js';
import { h1, h2, text, button, input } from '../../../dist/runtime/index.js';

export default function App() {
  // Reactive state using Proxy-based reactivity
  const appState = state({
    count: 0,
    todos: [] as string[],
    newTodo: ''
  });

  // Counter Section with Builder API
  const counterSection = vbox()
    .pad(2)
    .gap(1.5)
    .bg('#ffffff')
    .radius(1)
    .shadow('lg')
    .border(1, 'solid', '#e5e7eb')
    .mobile({ pad: 1, gap: 1 })
    .add([
      // Title
      h2()
        .add([text('Interactive Counte 2').build()])
        .color('#1f2937')
        .style('fontSize', '1.5rem')
        .style('fontWeight', 'bold')
        .style('marginTop', '0')
        .style('marginBottom', '0')
        .build(),

      // Counter Display - Reactive text
      text(() => `Count: ${appState.count}`)
        .size(2)
        .weight('bold')
        .color('#3b82f6')
        .textAlign('center')
        .build(),

      // Button Group
      hbox()
        .gap(0.5)
        .justify('center')
        .add([
          button('−')
            .click(() => appState.count--)
            .bg('#ef4444')
            .color('#fff')
            .pad(0.75)
            .radius(0.5)
            .cursor('pointer')
            .hoverStyle({ backgroundColor: '#dc2626' })
            .size(1.25)
            .weight('bold')
            .minWidth(50)
            .build(),

          button('Reset')
            .click(() => appState.count = 0)
            .bg('#6b7280')
            .color('#fff')
            .pad(0.75)
            .radius(0.5)
            .cursor('pointer')
            .hoverStyle({ backgroundColor: '#4b5563' })
            .build(),

          button('+')
            .click(() => appState.count++)
            .bg('#22c55e')
            .color('#fff')
            .pad(0.75)
            .radius(0.5)
            .cursor('pointer')
            .hoverStyle({ backgroundColor: '#16a34a' })
            .size(1.25)
            .weight('bold')
            .minWidth(50)
            .build()
        ])
        .build(),

      // Status Message - Reactive
      text(() => {
        if (appState.count === 0) return 'Start counting!';
        if (appState.count > 0) return `Positive: ${appState.count}`;
        return `Negative: ${appState.count}`;
      })
        .color('#6b7280')
        .textAlign('center')
        .build()
    ])
    .build();

  // Todo List Section with Builder API
  const todoListContainer = vbox().gap(0.5).build();

  // Reactive todo list rendering
  effect(() => {
    // Clear existing todos
    while (todoListContainer.firstChild) {
      todoListContainer.removeChild(todoListContainer.firstChild);
    }

    // Render todos
    if (appState.todos.length === 0) {
      const emptyMsg = text('No todos yet. Add one above!')
        .color('#9ca3af')
        .textAlign('center')
        .pad(1)
        .build();
      todoListContainer.appendChild(emptyMsg);
    } else {
      appState.todos.forEach((todo, index) => {
        const todoItem = hbox()
          .gap(0.5)
          .align('center')
          .pad(0.75)
          .bg('#f9fafb')
          .radius(0.5)
          .border(1, 'solid', '#e5e7eb')
          .add([
            text(todo)
              .flex(1)
              .color('#374151')
              .build(),

            button('✓')
              .click(() => {
                appState.todos = appState.todos.filter((_, i) => i !== index);
              })
              .bg('#22c55e')
              .color('#fff')
              .pad(0.5)
              .radius(0.25)
              .cursor('pointer')
              .hoverStyle({ backgroundColor: '#16a34a' })
              .minWidth(30)
              .build(),

            button('✕')
              .click(() => {
                appState.todos = appState.todos.filter((_, i) => i !== index);
              })
              .bg('#ef4444')
              .color('#fff')
              .pad(0.5)
              .radius(0.25)
              .cursor('pointer')
              .hoverStyle({ backgroundColor: '#dc2626' })
              .minWidth(30)
              .build()
          ])
          .build();
        
        todoListContainer.appendChild(todoItem);
      });
    }
  });

  const inputElement = input()
    .type('text')
    .placeholder('Add a new todo...')
    .value(appState.newTodo)
    .input((e) => {
      appState.newTodo = (e.target as HTMLInputElement).value;
    })
    .flex(1)
    .pad(0.75)
    .radius(0.5)
    .border(1, 'solid', '#d1d5db')
    .build();

  const todoSection = vbox()
    .pad(2)
    .gap(1)
    .bg('#ffffff')
    .radius(1)
    .shadow('lg')
    .border(1, 'solid', '#e5e7eb')
    .mobile({ pad: 1 })
    .add([
      // Title
      h2()
        .add([text('Todo List').build()])
        .color('#1f2937')
        .style('fontSize', '1.5rem')
        .style('fontWeight', 'bold')
        .style('marginTop', '0')
        .style('marginBottom', '0')
        .build(),

      // Input Form
      hbox()
        .gap(0.5)
        .add([
          inputElement,

          button('Add')
            .click(() => {
              if (appState.newTodo.trim()) {
                appState.todos = [...appState.todos, appState.newTodo.trim()];
                appState.newTodo = '';
                inputElement.value = '';
              }
            })
            .bg('#3b82f6')
            .color('#fff')
            .pad(0.75)
            .radius(0.5)
            .cursor('pointer')
            .hoverStyle({ backgroundColor: '#2563eb' })
            .build()
        ])
        .build(),

      // Todo List Container (reactive)
      todoListContainer,

      // Todo Count - Reactive
      text(() => `Total: ${appState.todos.length} todo${appState.todos.length !== 1 ? 's' : ''}`)
        .color('#6b7280')
        .size(0.875)
        .textAlign('center')
        .build()
    ])
    .build();

  // Grid Layout Demo
  const gridDemo = vbox()
    .pad(2)
    .gap(1.5)
    .bg('#ffffff')
    .radius(1)
    .shadow('lg')
    .border(1, 'solid', '#e5e7eb')
    .add([
      h2()
        .add([text('Responsive Grid').build()])
        .color('#1f2937')
        .style('fontSize', '1.5rem')
        .style('fontWeight', 'bold')
        .style('marginTop', '0')
        .style('marginBottom', '0')
        .build(),

      grid()
        .columns(3)
        .gap(1)
        .mobile({ gridTemplateColumns: '1fr' })
        .tablet({ gridTemplateColumns: 'repeat(2, 1fr)' })
        .add([
          ...Array.from({ length: 6 }, (_, i) =>
            vbox()
              .pad(1.5)
              .bg('#f3f4f6')
              .radius(0.5)
              .border(2, 'solid', '#e5e7eb')
              .align('center')
              .justify('center')
              .minHeight(100)
              .hoverStyle({ 
                backgroundColor: '#e5e7eb',
                borderColor: '#3b82f6'
              })
              .add([
                text(`Card ${i + 1}`)
                  .weight('bold')
                  .color('#374151')
                  .build()
              ])
              .build()
          )
        ])
        .build()
    ])
    .build();

  // Main App Layout
  return vbox()
    .pad(2)
    .gap(2)
    .minHeight('100vh')
    .bg('#f3f4f6')
    .mobile({ pad: 1, gap: 1 })
    .add([
      // Header
      vbox()
        .pad(2)
        .bg('white')
        .radius(1)
        .shadow('xl')
        .add([
          h1()
            .add([text('Rynex Builder API').build()])
            .color('black')
            .style('fontSize', '2.5rem')
            .style('fontWeight', 'bold')
            .style('textAlign', 'center')
            .style('marginTop', '0')
            .style('marginBottom', '0')
            .build(),

          text('Rust-style chainable methods for modern UI')
            .color('black')
            .textAlign('center')
            .size(1.125)
            .build()
        ])
        .build(),

      // Counter Section
      counterSection,

      // Todo Section
      todoSection,

      // Grid Demo
      gridDemo,

      // Footer
      text('Built with Rynex Builder API')
        .textAlign('center')
        .color('#6b7280')
        .pad(1)
        .build()
    ])
    .build();
}
