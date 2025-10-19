/**
 * ZenWeb App - New Syntax Test
 * Uses namespaced imports and reactive getters for auto-updates
 * No manual effect() needed - reactivity is built into UI functions
 */

import { state } from '../../../dist/runtime/index.js';
import * as UI from '../../../dist/runtime/index.js';

export default function App() {
  // Reactive state
  const appState = state({
    count: 0,
    name: '',
    showSection: true
  });

  return UI.vbox({
    class: 'app',
    style: {
      minHeight: '100vh',
      background: 'white'
    }
  }, [
    UI.header({
      class: 'header',
      style: {
        padding: '2rem',
        textAlign: 'center',
        color: 'black'
      }
    }, [
      UI.h1({}, 'ZenWeb - New Syntax Test')
    ]),
    
    UI.vbox({
      class: 'content',
      style: {
        flex: '1',
        padding: '2rem',
        gap: '1.5rem',
        alignItems: 'center'
      }
    }, [
      // Reactive text with getter
      UI.text({
        class: 'greeting',
        style: {
          fontSize: '2rem',
          color: 'white',
          fontWeight: 'bold'
        }
      }, () => `Hello, ${appState.name || 'Guest'}!`),
      
      // Input with state binding
      UI.input({
        placeholder: 'Enter your name',
        value: appState.name,
        onInput: (e: Event) => { appState.name = (e.target as HTMLInputElement).value; },
        style: {
          padding: '0.75rem',
          borderRadius: '8px',
          border: '2px solid black',
          borderStartEndRadius: '20px',
          fontSize: '1rem',
          width: '300px'
        }
      }),
      
      // Counter section
      UI.hbox({
        class: 'counter',
        style: {
          gap: '1rem',
          alignItems: 'center'
        }
      }, [
        UI.button({
          onClick: () => { appState.count--; },
          style: {
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: 'white',
            color: '#667eea',
            fontWeight: '600',
            cursor: 'pointer'
          }
        }, 'Decrement'),
        
        // Reactive count display
        UI.text({
          style: {
            fontSize: '1.5rem',
            color: 'white',
            minWidth: '120px',
            textAlign: 'center'
          }
        }, () => `Count: ${appState.count}`),
        
        UI.button({
          onClick: () => { appState.count++; },
          style: {
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: 'white',
            color: '#667eea',
            fontWeight: '600',
            cursor: 'pointer'
          }
        }, 'Increment')
      ]),
      
      // Reactive button with dynamic text
      UI.button({
        onClick: () => { appState.showSection = !appState.showSection; },
        style: {
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer'
        }
      }, () => appState.showSection ? 'Hide Section' : 'Show Section'),
      
      // Conditional rendering with show()
      UI.show(() => appState.showSection,
        UI.vbox({
          class: 'conditional',
          style: {
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white'
          }
        }, [
          UI.text({}, 'This content is conditionally rendered!'),
          UI.text({}, () => `Current count: ${appState.count}`)
        ])
      )
    ]),
    
    UI.footer({
      class: 'footer',
      style: {
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        color: 'white'
      }
    }, [
      UI.text({}, 'ZenWeb - New Syntax with Reactive Getters! 🧘')
    ])
  ]);
}
