import { state, effect } from '../../../dist/runtime/index.js';
import { vbox, hbox, text, button, center } from '../../../dist/runtime/index.js';

export default function Calculator() {
  // Simple state - just one object
  const $ = state({
    display: '0',
    current: '',
    operator: '',
    previous: ''
  });

  // Helper functions
  const clear = () => {
    $.display = '0';
    $.current = '';
    $.operator = '';
    $.previous = '';
  };

  const appendNumber = (num: string) => {
    if ($.display === '0') $.display = num;
    else $.display += num;
    $.current = $.display;
  };

  const setOperator = (op: string) => {
    $.operator = op;
    $.previous = $.current;
    $.display = '0';
    $.current = '';
  };

  const calculate = () => {
    const prev = parseFloat($.previous);
    const curr = parseFloat($.current);
    let result = 0;

    if ($.operator === '+') result = prev + curr;
    if ($.operator === '-') result = prev - curr;
    if ($.operator === '×') result = prev * curr;
    if ($.operator === '÷') result = prev / curr;

    $.display = String(result);
    $.current = String(result);
    $.operator = '';
  };

  // UI Elements
  const display = text($.display);

  // Auto-update display
  effect(() => {
    display.textContent = $.display;
  });

  // Build UI - Simple and clean!
  return center({ style: { height: '100vh', background: '#1a1a2e' } },
    vbox({ class: 'calculator' },
      display,
      hbox({ class: 'row' },
        button({ onClick: clear }, 'C'),
        button({ onClick: () => appendNumber('0') }, '0'),
        button({ onClick: () => $.display = $.display.slice(0, -1) || '0' }, '⌫'),
        button({ onClick: () => setOperator('÷') }, '÷')
      ),
      hbox({ class: 'row' },
        button({ onClick: () => appendNumber('7') }, '7'),
        button({ onClick: () => appendNumber('8') }, '8'),
        button({ onClick: () => appendNumber('9') }, '9'),
        button({ onClick: () => setOperator('×') }, '×')
      ),
      hbox({ class: 'row' },
        button({ onClick: () => appendNumber('4') }, '4'),
        button({ onClick: () => appendNumber('5') }, '5'),
        button({ onClick: () => appendNumber('6') }, '6'),
        button({ onClick: () => setOperator('-') }, '-')
      ),
      hbox({ class: 'row' },
        button({ onClick: () => appendNumber('1') }, '1'),
        button({ onClick: () => appendNumber('2') }, '2'),
        button({ onClick: () => appendNumber('3') }, '3'),
        button({ onClick: () => setOperator('+') }, '+')
      ),
      hbox({ class: 'row' },
        button({ onClick: () => appendNumber('.') }, '.'),
        button({ onClick: calculate, class: 'equals' }, '=')
      )
    )
  );
}

// Inline styles - no separate CSS file needed!
const style = document.createElement('style');
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  .calculator {
    background: #16213e;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    gap: 10px;
    width: 320px;
  }
  
  .calculator > span:first-child {
    background: #0f3460;
    color: #fff;
    font-size: 2.5rem;
    padding: 20px;
    text-align: right;
    border-radius: 10px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: 'Courier New', monospace;
  }
  
  .row {
    gap: 10px;
  }
  
  .row button {
    flex: 1;
    padding: 25px;
    font-size: 1.5rem;
    border: none;
    border-radius: 10px;
    background: #533483;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }
  
  .row button:hover {
    background: #6c4a9e;
    transform: scale(1.05);
  }
  
  .row button:active {
    transform: scale(0.95);
  }
  
  .equals {
    flex: 2 !important;
    background: #e94560 !important;
  }
  
  .equals:hover {
    background: #ff5577 !important;
  }
`;
document.head.appendChild(style);
