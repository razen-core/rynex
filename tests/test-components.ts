/**
 * Rynex UI Components Test Suite
 * Tests for new UI components: tabs and accordion
 */

import { 
  tabs,
  accordion,
  div,
  text,
  state
} from '../dist/runtime/index.js';

export default function ComponentsTest() {
  const testState = state({
    activeTab: 0,
    tabChangeCount: 0
  });

  const container = div({ class: 'test-container', style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' } }, [
    
    // Test Header
    div({ style: { marginBottom: '2rem' } }, [
      text({ style: { fontSize: '2rem', fontWeight: 'bold' } }, 'UI Components Test Suite'),
      text({ style: { display: 'block', color: '#666', marginTop: '0.5rem' } }, 'Testing tabs and accordion components')
    ]),

    // Test 1: Tabs Component
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 1: Tabs Component'),
      tabs({
        tabs: [
          {
            label: 'Overview',
            content: div({ style: { padding: '1rem' } }, [
              text({ style: { fontSize: '1.1rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' } }, 'Overview Tab'),
              text({ style: { display: 'block', color: '#666' } }, 'This is the overview content. Tabs allow you to organize content into separate views.')
            ])
          },
          {
            label: 'Features',
            content: div({ style: { padding: '1rem' } }, [
              text({ style: { fontSize: '1.1rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' } }, 'Features Tab'),
              div({}, [
                text({ style: { display: 'block', marginBottom: '0.25rem' } }, '- Easy to use API'),
                text({ style: { display: 'block', marginBottom: '0.25rem' } }, '- Customizable styling'),
                text({ style: { display: 'block', marginBottom: '0.25rem' } }, '- Keyboard navigation'),
                text({ style: { display: 'block' } }, '- onChange callback support')
              ])
            ])
          },
          {
            label: 'Settings',
            content: div({ style: { padding: '1rem' } }, [
              text({ style: { fontSize: '1.1rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' } }, 'Settings Tab'),
              text({ style: { display: 'block', color: '#666' } }, 'Configure your preferences here. This tab demonstrates dynamic content loading.')
            ])
          }
        ],
        defaultIndex: 0,
        onChange: (index) => {
          testState.activeTab = index;
          testState.tabChangeCount++;
        },
        style: { background: '#fff', borderRadius: '8px' }
      }),
      div({ style: { marginTop: '1rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '4px' } }, [
        text({}, () => `Active tab: ${testState.activeTab}, Changes: ${testState.tabChangeCount}`)
      ])
    ]),

    // Test 2: Accordion Component
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 2: Accordion Component'),
      text({ style: { display: 'block', marginBottom: '1rem', color: '#666' } }, 'Single item open at a time:'),
      accordion({
        items: [
          {
            title: 'What is Rynex?',
            content: div({ style: { color: '#666' } }, [
              text({}, 'Rynex is a modern, reactive web framework that provides a clean API for building user interfaces without the complexity of virtual DOM.')
            ])
          },
          {
            title: 'How does reactivity work?',
            content: div({ style: { color: '#666' } }, [
              text({}, 'Rynex uses JavaScript Proxies to track state changes and automatically update the DOM when state changes occur.')
            ])
          },
          {
            title: 'Is it production ready?',
            content: div({ style: { color: '#666' } }, [
              text({}, 'Yes! Rynex is production-ready with comprehensive TypeScript support and a growing ecosystem of components.')
            ])
          }
        ],
        allowMultiple: false,
        defaultOpen: [0]
      })
    ]),

    // Test 3: Accordion with Multiple Open
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 3: Accordion (Multiple Open)'),
      text({ style: { display: 'block', marginBottom: '1rem', color: '#666' } }, 'Multiple items can be open simultaneously:'),
      accordion({
        items: [
          {
            title: 'Installation',
            content: div({ style: { color: '#666' } }, [
              text({ style: { display: 'block', fontFamily: 'monospace', background: '#f0f0f0', padding: '0.5rem', borderRadius: '4px' } }, 'npm install rynex')
            ])
          },
          {
            title: 'Quick Start',
            content: div({ style: { color: '#666' } }, [
              text({ style: { display: 'block', marginBottom: '0.25rem' } }, '1. Import Rynex functions'),
              text({ style: { display: 'block', marginBottom: '0.25rem' } }, '2. Create your component'),
              text({ style: { display: 'block' } }, '3. Render to DOM')
            ])
          },
          {
            title: 'Documentation',
            content: div({ style: { color: '#666' } }, [
              text({}, 'Visit our comprehensive documentation at docs.rynex.dev for detailed guides and API references.')
            ])
          }
        ],
        allowMultiple: true,
        defaultOpen: [0, 1]
      })
    ]),

    // Test Results Summary
    div({ style: { padding: '1rem', background: '#f0f0f0', borderRadius: '8px' } }, [
      text({ style: { fontWeight: 'bold' } }, 'All component tests initialized successfully!')
    ])
  ]);

  return container;
}
