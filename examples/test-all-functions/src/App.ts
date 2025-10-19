import { state } from '../../../dist/runtime/index.js';
import {
  vbox, hbox, container, center, scroll, grid,
  text, button, input, checkbox, radio,
  h1, h2, h3, strong, em, code,
  header, footer, section, article,
  table, thead, tbody, tr, th, td,
  form, textarea, select, option,
  when, show
} from '../../../dist/runtime/index.js';

export default function App() {
  const [count, setCount] = state(0);
  const [name, setName] = state('');
  const [checked, setChecked] = state(false);
  const [selected, setSelected] = state('option1');
  const [showSection, setShowSection] = state(true);

  view {
    vbox({ class: 'app' }, [
      header({ class: 'header' }, [
        h1({}, 'ZenWeb - All Functions Test')
      ]),
      
      scroll({ class: 'content' }, [
        // State Management Test
        section({ class: 'test-section' }, [
          h2({}, 'State Management'),
          vbox({ class: 'test-box' }, [
            text({}, `Count: ${count()}`),
            hbox({ class: 'button-group' }, [
              button({ onClick: () => setCount(count() - 1) }, 'Decrement'),
              button({ onClick: () => setCount(count() + 1) }, 'Increment'),
              button({ onClick: () => setCount(0) }, 'Reset')
            ])
          ])
        ]),

        // Layout Helpers Test
        section({ class: 'test-section' }, [
          h2({}, 'Layout Helpers'),
          vbox({ class: 'test-box' }, [
            h3({}, 'VBox (Vertical)'),
            vbox({ class: 'demo-vbox' }, [
              text({}, 'Item 1'),
              text({}, 'Item 2'),
              text({}, 'Item 3')
            ]),
            
            h3({}, 'HBox (Horizontal)'),
            hbox({ class: 'demo-hbox' }, [
              text({}, 'Item 1'),
              text({}, 'Item 2'),
              text({}, 'Item 3')
            ]),
            
            h3({}, 'Grid'),
            grid({ columns: 3, gap: '1rem', class: 'demo-grid' }, [
              text({}, 'Cell 1'),
              text({}, 'Cell 2'),
              text({}, 'Cell 3'),
              text({}, 'Cell 4'),
              text({}, 'Cell 5'),
              text({}, 'Cell 6')
            ]),
            
            h3({}, 'Center'),
            center({ class: 'demo-center' }, [
              text({}, 'Centered Content')
            ])
          ])
        ]),

        // Form Elements Test
        section({ class: 'test-section' }, [
          h2({}, 'Form Elements'),
          form({ class: 'test-box', onSubmit: (e: Event) => { e.preventDefault(); } }, [
            vbox({ class: 'form-group' }, [
              text({}, 'Name:'),
              input({
                type: 'text',
                value: name(),
                onInput: (e: Event) => setName((e.target as HTMLInputElement).value),
                placeholder: 'Enter your name'
              }),
              text({}, `Hello, ${name() || 'Guest'}!`)
            ]),
            
            vbox({ class: 'form-group' }, [
              text({}, 'Checkbox:'),
              checkbox({
                checked: checked(),
                onChange: (e: Event) => setChecked((e.target as HTMLInputElement).checked)
              }),
              text({}, `Checked: ${checked()}`)
            ]),
            
            vbox({ class: 'form-group' }, [
              text({}, 'Select:'),
              select({
                value: selected(),
                onChange: (e: Event) => setSelected((e.target as HTMLSelectElement).value)
              }, [
                option({ value: 'option1' }, 'Option 1'),
                option({ value: 'option2' }, 'Option 2'),
                option({ value: 'option3' }, 'Option 3')
              ]),
              text({}, `Selected: ${selected()}`)
            ]),
            
            vbox({ class: 'form-group' }, [
              text({}, 'Textarea:'),
              textarea({ placeholder: 'Enter text...', rows: 4 })
            ])
          ])
        ]),

        // Typography Test
        section({ class: 'test-section' }, [
          h2({}, 'Typography'),
          vbox({ class: 'test-box' }, [
            h1({}, 'Heading 1'),
            h2({}, 'Heading 2'),
            h3({}, 'Heading 3'),
            text({}, 'Regular text'),
            strong({}, 'Bold text'),
            em({}, 'Italic text'),
            code({}, 'Code text'),
            text({}, 'Text with '),
            strong({}, 'bold'),
            text({}, ' and '),
            em({}, 'italic')
          ])
        ]),

        // Table Test
        section({ class: 'test-section' }, [
          h2({}, 'Table'),
          table({ class: 'test-table' }, [
            thead({}, [
              tr({}, [
                th({}, 'Name'),
                th({}, 'Age'),
                th({}, 'City')
              ])
            ]),
            tbody({}, [
              tr({}, [
                td({}, 'John'),
                td({}, '25'),
                td({}, 'New York')
              ]),
              tr({}, [
                td({}, 'Jane'),
                td({}, '30'),
                td({}, 'London')
              ]),
              tr({}, [
                td({}, 'Bob'),
                td({}, '35'),
                td({}, 'Paris')
              ])
            ])
          ])
        ]),

        // Conditional Rendering Test
        section({ class: 'test-section' }, [
          h2({}, 'Conditional Rendering'),
          vbox({ class: 'test-box' }, [
            button({ 
              onClick: () => setShowSection(!showSection()) 
            }, showSection() ? 'Hide Section' : 'Show Section'),
            
            show(showSection(), 
              vbox({ class: 'conditional-content' }, [
                text({}, 'This content is conditionally rendered!'),
                text({}, `Current count: ${count()}`)
              ])
            )
          ])
        ])
      ]),
      
      footer({ class: 'footer' }, [
        text({}, 'ZenWeb Framework - All Functions Working!')
      ])
    ])
  }

  style {
    .app {
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    .content {
      flex: 1;
      padding: 2rem;
      max-height: calc(100vh - 200px);
    }
    
    .test-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .test-box {
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 4px;
      gap: 1rem;
    }
    
    .button-group {
      gap: 0.5rem;
    }
    
    button {
      padding: 0.5rem 1rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    
    button:hover {
      background: #5568d3;
    }
    
    input, textarea, select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .demo-vbox, .demo-hbox, .demo-grid {
      padding: 1rem;
      background: #e0e7ff;
      border-radius: 4px;
      gap: 0.5rem;
    }
    
    .demo-center {
      height: 100px;
      background: #e0e7ff;
      border-radius: 4px;
    }
    
    .test-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .test-table th,
    .test-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .test-table th {
      background: #667eea;
      color: white;
      font-weight: 600;
    }
    
    .form-group {
      gap: 0.5rem;
    }
    
    .conditional-content {
      padding: 1rem;
      background: #d1fae5;
      border-radius: 4px;
      margin-top: 1rem;
    }
    
    .footer {
      background: #333;
      color: white;
      padding: 1rem;
      text-align: center;
    }
  }
}
