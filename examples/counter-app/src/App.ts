import { state } from '../../../dist/runtime/index.js';
import { vbox, hbox, text, button, input } from '../../../dist/runtime/index.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

export default function App() {
  const [count, setCount] = state(0);
  const [name, setName] = state('');

  view {
    vbox({ class: 'app-container' }, [
      Header({ title: 'Welcome to ZenWeb 2' }),
      
      vbox({ class: 'main-content' }, [
        text({ class: 'greeting' }, `Hello, ${name() || 'Guest'}!`),
        
        input({
          placeholder: 'Enter your name',
          value: name(),
          onInput: (e: Event) => setName((e.target as HTMLInputElement).value)
        }),
        
        hbox({ class: 'counter-section' }, [
          button({ onClick: () => setCount(count() - 1) }, 'Decrement'),
          text({ class: 'count-display' }, `Count: ${count()}`),
          button({ onClick: () => setCount(count() + 1) }, 'Increment')
        ]),
        
        button({
          class: 'reset-btn',
          onClick: () => {
            setCount(0);
            setName('');
          }
        }, 'Reset All')
      ]),
      
      Footer()
    ])
  }

  style {
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .main-content {
      flex: 1;
      padding: 2rem;
      gap: 1.5rem;
      align-items: center;
      justify-content: center;
    }
    
    .greeting {
      font-size: 2rem;
      color: white;
      font-weight: bold;
    }
    
    .counter-section {
      gap: 1rem;
      align-items: center;
    }
    
    .count-display {
      font-size: 1.5rem;
      color: white;
      min-width: 120px;
      text-align: center;
    }
    
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      background: white;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    button:hover {
      transform: scale(1.05);
    }
    
    input {
      padding: 0.75rem;
      border-radius: 8px;
      border: 2px solid white;
      font-size: 1rem;
      width: 300px;
    }
  }
}
