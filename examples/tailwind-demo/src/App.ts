/**
 * Rynex + Tailwind CSS v4 Demo
 * Comprehensive example showcasing Builder API with Tailwind CSS v4
 */

import { state, effect } from '../../../dist/runtime/index.js';
import { vbox, hbox, grid } from '../../../dist/runtime/index.js';
import { h1, h2, h3, text, button, input } from '../../../dist/runtime/index.js';

export default function App() {
  // Reactive state
  const appState = state({
    count: 0,
    todos: [] as Array<{ id: number; text: string; completed: boolean }>,
    newTodo: '',
    theme: 'light' as 'light' | 'dark',
    activeTab: 'counter' as 'counter' | 'todos' | 'cards' | 'forms'
  });

  let todoIdCounter = 0;

  // Counter Section with Tailwind
  const counterSection = vbox()
    .class('card-hover')
    .gap(1.5)
    .add([
      h2()
        .add([text('Interactive Counter').build()])
        .class('text-2xl font-bold text-gray-800 mb-2')
        .build(),

      // Counter Display - Reactive with gradient
      text(() => `${appState.count}`)
        .class('text-6xl font-bold gradient-text text-center py-4')
        .build(),

      // Button Group with Tailwind classes
      hbox()
        .class('flex gap-3 justify-center flex-wrap')
        .add([
          button('−')
            .click(() => appState.count--)
            .class('btn-danger w-16 h-16 text-2xl')
            .build(),

          button('Reset')
            .click(() => appState.count = 0)
            .class('btn bg-gray-500 text-white hover:bg-gray-600 px-6')
            .build(),

          button('+')
            .click(() => appState.count++)
            .class('btn-success w-16 h-16 text-2xl')
            .build()
        ])
        .build(),

      // Status Message with badges
      (() => {
        const badgeEl = text(() => {
          if (appState.count === 0) return 'Start counting!';
          if (appState.count > 0) return `Positive`;
          return `Negative`;
        }).build();
        
        effect(() => {
          if (appState.count === 0) {
            badgeEl.className = 'badge badge-primary';
          } else if (appState.count > 0) {
            badgeEl.className = 'badge badge-success';
          } else {
            badgeEl.className = 'badge badge-danger';
          }
        });
        
        return vbox()
          .class('flex items-center justify-center gap-2')
          .add([badgeEl])
          .build();
      })()
    ])
    .build();

  // Todo List Section with Tailwind
  const todoListContainer = vbox()
    .class('space-y-2')
    .build();

  // Reactive todo list rendering with Tailwind
  effect(() => {
    while (todoListContainer.firstChild) {
      todoListContainer.removeChild(todoListContainer.firstChild);
    }

    if (appState.todos.length === 0) {
      const emptyMsg = vbox()
        .class('text-center py-8 text-gray-400')
        .add([
          text('📝')
            .class('text-4xl mb-2')
            .build(),
          text('No todos yet. Add one above!')
            .class('text-sm')
            .build()
        ])
        .build();
      todoListContainer.appendChild(emptyMsg);
    } else {
      appState.todos.forEach((todo) => {
        const todoItem = hbox()
          .class(`group flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            todo.completed 
              ? 'bg-green-50 border-green-200' 
              : 'bg-white border-gray-200 hover:border-primary hover:shadow-md'
          }`)
          .add([
            // Checkbox
            button(todo.completed ? '✓' : '○')
              .click(() => {
                const todoIndex = appState.todos.findIndex(t => t.id === todo.id);
                if (todoIndex !== -1) {
                  appState.todos[todoIndex].completed = !appState.todos[todoIndex].completed;
                  appState.todos = [...appState.todos];
                }
              })
              .class(`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                todo.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-primary hover:text-white'
              }`)
              .build(),

            // Todo Text
            text(todo.text)
              .class(`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`)
              .build(),

            // Delete Button
            button('✕')
              .click(() => {
                appState.todos = appState.todos.filter(t => t.id !== todo.id);
              })
              .class('w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100')
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
    .class('input-field flex-1')
    .build();

  const todoSection = vbox()
    .class('card-hover')
    .gap(1.5)
    .add([
      h2()
        .add([text('Todo List').build()])
        .class('text-2xl font-bold text-gray-800')
        .build(),

      // Input Form with Tailwind
      hbox()
        .class('flex gap-2')
        .add([
          inputElement,

          button('Add')
            .click(() => {
              if (appState.newTodo.trim()) {
                appState.todos = [
                  ...appState.todos,
                  { id: todoIdCounter++, text: appState.newTodo.trim(), completed: false }
                ];
                appState.newTodo = '';
                inputElement.value = '';
              }
            })
            .class('btn-primary px-8')
            .build()
        ])
        .build(),

      // Todo List Container
      todoListContainer,

      // Stats with Tailwind badges
      hbox()
        .class('flex gap-4 justify-center text-sm')
        .add([
          text(() => `Total: ${appState.todos.length}`)
            .class('badge badge-primary')
            .build(),
          text(() => `Active: ${appState.todos.filter(t => !t.completed).length}`)
            .class('badge badge-warning')
            .build(),
          text(() => `Completed: ${appState.todos.filter(t => t.completed).length}`)
            .class('badge badge-success')
            .build()
        ])
        .build()
    ])
    .build();

  // Responsive Grid with Tailwind
  const gridDemo = vbox()
    .class('card-hover')
    .gap(1.5)
    .add([
      h2()
        .add([text('Responsive Grid').build()])
        .class('text-2xl font-bold text-gray-800')
        .build(),

      text('Resize your browser to see the responsive grid in action')
        .class('text-sm text-gray-600')
        .build(),

      grid()
        .class('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4')
        .add([
          ...Array.from({ length: 8 }, (_, i) =>
            vbox()
              .class(`card-hover bg-gradient-to-br ${
                ['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 
                 'from-pink-400 to-pink-600', 'from-green-400 to-green-600',
                 'from-yellow-400 to-yellow-600', 'from-red-400 to-red-600',
                 'from-indigo-400 to-indigo-600', 'from-teal-400 to-teal-600'][i]
              } text-white min-h-32 justify-center items-center`)
              .add([
                text(`Card ${i + 1}`)
                  .class('text-2xl font-bold')
                  .build(),
                text('Hover me!')
                  .class('text-sm opacity-75')
                  .build()
              ])
              .build()
          )
        ])
        .build()
    ])
    .build();

  // Form Demo with Tailwind
  const formDemo = vbox()
    .class('card-hover')
    .gap(1.5)
    .add([
      h2()
        .add([text('Form Elements').build()])
        .class('text-2xl font-bold text-gray-800')
        .build(),

      vbox()
        .class('space-y-4')
        .add([
          // Text Input
          vbox()
            .class('space-y-2')
            .add([
              text('Name')
                .class('text-sm font-medium text-gray-700')
                .build(),
              input()
                .type('text')
                .placeholder('Enter your name')
                .class('input-field w-full')
                .build()
            ])
            .build(),

          // Email Input
          vbox()
            .class('space-y-2')
            .add([
              text('Email')
                .class('text-sm font-medium text-gray-700')
                .build(),
              input()
                .type('email')
                .placeholder('your@email.com')
                .class('input-field w-full')
                .build()
            ])
            .build(),

          // Buttons Row
          hbox()
            .class('flex gap-3 flex-wrap')
            .add([
              button('Submit')
                .class('btn-primary')
                .build(),
              button('Cancel')
                .class('btn bg-gray-200 text-gray-700 hover:bg-gray-300')
                .build(),
              button('Delete')
                .class('btn-danger')
                .build()
            ])
            .build()
        ])
        .build()
    ])
    .build();

  // Tab Navigation
  const counterBtn = button('Counter')
    .click(() => appState.activeTab = 'counter')
    .class('px-6 py-2 rounded-md font-medium transition-all')
    .build();
  
  const todosBtn = button('Todos')
    .click(() => appState.activeTab = 'todos')
    .class('px-6 py-2 rounded-md font-medium transition-all')
    .build();
  
  const cardsBtn = button('Cards')
    .click(() => appState.activeTab = 'cards')
    .class('px-6 py-2 rounded-md font-medium transition-all')
    .build();
  
  const formsBtn = button('Forms')
    .click(() => appState.activeTab = 'forms')
    .class('px-6 py-2 rounded-md font-medium transition-all')
    .build();
  
  // Update tab button styles reactively
  effect(() => {
    counterBtn.className = `px-6 py-2 rounded-md font-medium transition-all ${
      appState.activeTab === 'counter'
        ? 'bg-white text-primary shadow-md'
        : 'text-gray-600 hover:text-gray-900'
    }`;
    
    todosBtn.className = `px-6 py-2 rounded-md font-medium transition-all ${
      appState.activeTab === 'todos'
        ? 'bg-white text-primary shadow-md'
        : 'text-gray-600 hover:text-gray-900'
    }`;
    
    cardsBtn.className = `px-6 py-2 rounded-md font-medium transition-all ${
      appState.activeTab === 'cards'
        ? 'bg-white text-primary shadow-md'
        : 'text-gray-600 hover:text-gray-900'
    }`;
    
    formsBtn.className = `px-6 py-2 rounded-md font-medium transition-all ${
      appState.activeTab === 'forms'
        ? 'bg-white text-primary shadow-md'
        : 'text-gray-600 hover:text-gray-900'
    }`;
  });
  
  const tabNav = hbox()
    .class('flex gap-2 p-1 bg-gray-100 rounded-lg')
    .add([counterBtn, todosBtn, cardsBtn, formsBtn])
    .build();

  // Tab Content Container
  const tabContent = vbox().class('min-h-96').build();

  effect(() => {
    while (tabContent.firstChild) {
      tabContent.removeChild(tabContent.firstChild);
    }

    switch (appState.activeTab) {
      case 'counter':
        tabContent.appendChild(counterSection);
        break;
      case 'todos':
        tabContent.appendChild(todoSection);
        break;
      case 'cards':
        tabContent.appendChild(gridDemo);
        break;
      case 'forms':
        tabContent.appendChild(formDemo);
        break;
    }
  });

  // Main App Layout with Tailwind
  return vbox()
    .class('min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8')
    .gap(2)
    .add([
      // Header with gradient
      vbox()
        .class('card bg-gradient-to-r from-primary to-secondary text-white')
        .add([
          h1()
            .add([text('Rynex + Tailwind CSS v4').build()])
            .class('text-3xl sm:text-4xl lg:text-5xl font-bold text-center')
            .build(),

          text('Builder API meets modern CSS framework')
            .class('text-center text-white/90 text-lg mt-2')
            .build(),

          // Feature badges
          hbox()
            .class('flex gap-2 justify-center flex-wrap mt-4')
            .add([
              text('🚀 3.5x Faster')
                .class('badge bg-white/20 text-white border border-white/30')
                .build(),
              text('⚡ Zero Config')
                .class('badge bg-white/20 text-white border border-white/30')
                .build(),
              text('🎨 CSS-First')
                .class('badge bg-white/20 text-white border border-white/30')
                .build(),
              text('📱 Responsive')
                .class('badge bg-white/20 text-white border border-white/30')
                .build()
            ])
            .build()
        ])
        .build(),

      // Tab Navigation
      vbox()
        .class('card')
        .add([tabNav])
        .build(),

      // Tab Content
      tabContent,

      // Footer
      vbox()
        .class('card bg-gray-50 text-center')
        .add([
          text('Built with ❤️ using Rynex Builder API + Tailwind CSS v4')
            .class('text-gray-600 text-sm')
            .build(),
          hbox()
            .class('flex gap-4 justify-center mt-2 text-xs text-gray-500')
            .add([
              text('Reactive State ✓').build(),
              text('Hot Reload ✓').build(),
              text('Type Safe ✓').build()
            ])
            .build()
        ])
        .build()
    ])
    .build();
}
