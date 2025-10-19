/**
 * Counter Example - Vanilla JavaScript Approach
 * Demonstrates the new ZenWeb architecture
 */

import { 
  state, 
  effect,
  render, 
  vbox, 
  h1,
  text, 
  button,
  hbox,
  center
} from '../src/runtime/index.js';

function Counter() {
  // Create reactive state using Proxy
  const appState = state({ 
    count: 0 
  });
  
  // Create UI elements
  const title = h1({ style: { color: '#333' } }, 'Vanilla JS Counter');
  
  const countDisplay = text(`Count: ${appState.count}`);
  
  const decrementBtn = button({ 
    onClick: () => appState.count--,
    style: { 
      padding: '10px 20px',
      margin: '0 5px',
      cursor: 'pointer'
    }
  }, '- Decrement');
  
  const incrementBtn = button({ 
    onClick: () => appState.count++,
    style: { 
      padding: '10px 20px',
      margin: '0 5px',
      cursor: 'pointer'
    }
  }, '+ Increment');
  
  const resetBtn = button({ 
    onClick: () => appState.count = 0,
    style: { 
      padding: '10px 20px',
      margin: '0 5px',
      cursor: 'pointer',
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '4px'
    }
  }, 'Reset');
  
  // Create layout
  const buttonRow = hbox({ 
    style: { 
      gap: '10px',
      marginTop: '20px'
    } 
  }, decrementBtn, incrementBtn, resetBtn);
  
  const container = center({ 
    style: { 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    } 
  },
    vbox({ 
      style: { 
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      } 
    },
      title,
      countDisplay,
      buttonRow
    )
  );
  
  // Auto-update UI when state changes
  effect(() => {
    countDisplay.textContent = `Count: ${appState.count}`;
    console.log('State changed:', appState.count);
  });
  
  return container;
}

// Render to DOM
const app = document.getElementById('app');
if (app) {
  render(Counter, app);
}
