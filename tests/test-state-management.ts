/**
 * Rynex State Management Test Suite
 * Tests: createStore, useStore, createContext, useContext, provider
 */

import { 
  div, 
  button, 
  text,
  input,
  h2, 
  h3,
  vbox,
  hbox,
  state,
  createStore,
  useStore,
  createContext,
  useContext,
  provider,
  getStores,
  removeStore,
  clearStores
} from '../dist/runtime/index.js';

export default function StateManagementTest() {
  const testState = state({
    status: 'Ready to test state management',
    testsPassed: 0,
    testsFailed: 0
  });

  // Test 1: Create and Use Store
  function testCreateStore() {
    // Create a counter store
    const counterStore = createStore(
      'counter',
      { count: 0, step: 1 },
      (state) => ({
        increment: () => { state.count += state.step; },
        decrement: () => { state.count -= state.step; },
        reset: () => { state.count = 0; },
        setStep: (newStep: number) => { state.step = newStep; }
      })
    );

    const updateStatus = () => {
      testState.status = `Counter: ${counterStore.state.count}, Step: ${counterStore.state.step}`;
    };

    // Subscribe to changes
    counterStore.subscribe(() => {
      updateStatus();
      testState.testsPassed++;
    });

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '1. Create Store Test'),
      text({ style: { color: '#666' } }, 'Create a global reactive store with actions'),
      
      div({
        style: {
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderRadius: '12px',
          textAlign: 'center'
        }
      }, [
        div({ style: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' } }, [
          text(() => String(counterStore.state.count))
        ]),
        div({ style: { fontSize: '1rem', opacity: '0.9' } }, [
          text(() => `Step: ${counterStore.state.step}`)
        ])
      ]),

      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: () => counterStore.actions.increment(),
          style: {
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, '+ Increment'),
        button({
          onclick: () => counterStore.actions.decrement(),
          style: {
            padding: '0.75rem 1.5rem',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, '- Decrement'),
        button({
          onclick: () => counterStore.actions.reset(),
          style: {
            padding: '0.75rem 1.5rem',
            background: '#8b5cf6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Reset'),
        button({
          onclick: () => counterStore.actions.setStep(5),
          style: {
            padding: '0.75rem 1.5rem',
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Step = 5'),
        button({
          onclick: () => counterStore.actions.setStep(1),
          style: {
            padding: '0.75rem 1.5rem',
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Step = 1')
      ])
    ]);
  }

  // Test 2: Use Store (retrieve existing store)
  function testUseStore() {
    const retrievedStore = useStore<{ count: number; step: number }, any>('counter');
    
    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '2. Use Store Test'),
      text({ style: { color: '#666' } }, 'Retrieve and use an existing store'),
      
      div({
        style: {
          padding: '1.5rem',
          background: '#1f2937',
          color: '#fff',
          borderRadius: '12px'
        }
      }, [
        div({ style: { marginBottom: '0.5rem' } }, [
          text({ style: { fontWeight: 'bold', color: '#00ff88' } }, 'Store Retrieved: '),
          text(retrievedStore ? 'Success ✓' : 'Failed ✗')
        ]),
        div({ style: { marginBottom: '0.5rem' } }, [
          text({ style: { fontWeight: 'bold', color: '#00ff88' } }, 'Current Count: '),
          text(() => retrievedStore ? String(retrievedStore.state.count) : 'N/A')
        ]),
        div({}, [
          text({ style: { fontWeight: 'bold', color: '#00ff88' } }, 'Current Step: '),
          text(() => retrievedStore ? String(retrievedStore.state.step) : 'N/A')
        ])
      ]),

      button({
        onclick: () => {
          if (retrievedStore) {
            retrievedStore.actions.increment();
            testState.status = 'Used retrieved store to increment!';
            testState.testsPassed++;
          }
        },
        style: {
          padding: '0.75rem 1.5rem',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600'
        }
      }, 'Increment via Retrieved Store')
    ]);
  }

  // Test 3: Context API
  function testContext() {
    // Create context
    const ThemeContext = createContext({ theme: 'dark', primary: '#667eea' });
    
    const contextState = state({
      currentTheme: 'dark',
      currentColor: '#667eea'
    });

    // Component that uses context
    function ThemedBox() {
      try {
        const theme = useContext(ThemeContext);
        contextState.currentTheme = theme.theme;
        contextState.currentColor = theme.primary;
        
        return div({
          style: {
            padding: '1.5rem',
            background: () => contextState.currentColor,
            color: '#fff',
            borderRadius: '12px',
            textAlign: 'center',
            marginTop: '1rem'
          }
        }, [
          div({ style: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' } }, [
            text(() => `Theme: ${contextState.currentTheme}`)
          ]),
          div({}, [
            text(() => `Color: ${contextState.currentColor}`)
          ])
        ]);
      } catch (error) {
        return div({
          style: {
            padding: '1rem',
            background: '#ef4444',
            color: '#fff',
            borderRadius: '8px'
          }
        }, text('Context not available (expected outside Provider)'));
      }
    }

    // Provider wrapper
    const themeValue = { theme: 'dark', primary: '#667eea' };
    const wrappedContent = ThemeContext.Provider({
      value: themeValue,
      children: ThemedBox()
    });

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '3. Context API Test'),
      text({ style: { color: '#666' } }, 'Create and use context for component tree'),
      
      wrappedContent,

      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' } }, [
        button({
          onclick: () => {
            themeValue.theme = 'light';
            themeValue.primary = '#f59e0b';
            contextState.currentTheme = 'light';
            contextState.currentColor = '#f59e0b';
            testState.status = 'Context updated to light theme';
            testState.testsPassed++;
          },
          style: {
            padding: '0.75rem 1.5rem',
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Light Theme'),
        button({
          onclick: () => {
            themeValue.theme = 'dark';
            themeValue.primary = '#667eea';
            contextState.currentTheme = 'dark';
            contextState.currentColor = '#667eea';
            testState.status = 'Context updated to dark theme';
            testState.testsPassed++;
          },
          style: {
            padding: '0.75rem 1.5rem',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Dark Theme'),
        button({
          onclick: () => {
            themeValue.theme = 'ocean';
            themeValue.primary = '#06b6d4';
            contextState.currentTheme = 'ocean';
            contextState.currentColor = '#06b6d4';
            testState.status = 'Context updated to ocean theme';
            testState.testsPassed++;
          },
          style: {
            padding: '0.75rem 1.5rem',
            background: '#06b6d4',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Ocean Theme')
      ])
    ]);
  }

  // Test 4: Store Management
  function testStoreManagement() {
    const managementState = state({
      storeList: getStores(),
      message: 'No action yet'
    });

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '4. Store Management Test'),
      text({ style: { color: '#666' } }, 'Manage stores: list, create, remove'),
      
      div({
        style: {
          padding: '1.5rem',
          background: '#f3f4f6',
          borderRadius: '12px'
        }
      }, [
        div({ style: { marginBottom: '1rem' } }, [
          text({ style: { fontWeight: 'bold', color: '#000' } }, 'Registered Stores: '),
          text(() => managementState.storeList.join(', ') || 'None')
        ]),
        div({}, [
          text({ style: { fontWeight: 'bold', color: '#000' } }, 'Message: '),
          text(() => managementState.message)
        ])
      ]),

      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: () => {
            createStore('testStore', { value: 42 }, (state) => ({
              increment: () => state.value++
            }));
            managementState.storeList = getStores();
            managementState.message = 'Created testStore';
            testState.status = 'New store created';
            testState.testsPassed++;
          },
          style: {
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Create Store'),
        button({
          onclick: () => {
            managementState.storeList = getStores();
            managementState.message = `Found ${managementState.storeList.length} stores`;
            testState.status = 'Store list refreshed';
            testState.testsPassed++;
          },
          style: {
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'List Stores'),
        button({
          onclick: () => {
            const removed = removeStore('testStore');
            managementState.storeList = getStores();
            managementState.message = removed ? 'Removed testStore' : 'Store not found';
            testState.status = removed ? 'Store removed' : 'Remove failed';
            testState.testsPassed++;
          },
          style: {
            padding: '0.75rem 1.5rem',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Remove Store')
      ])
    ]);
  }

  // Status Display
  const statusDisplay = div({
    style: {
      position: 'sticky',
      top: '0',
      background: '#000',
      color: '#00ff88',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: '100'
    }
  }, [
    div({ style: { marginBottom: '0.5rem' } }, [
      text({ style: { fontWeight: 'bold', color: '#fff' } }, 'Status: '),
      text(() => testState.status)
    ]),
    div({ style: { marginBottom: '0.5rem' } }, [
      text({ style: { fontWeight: 'bold', color: '#fff' } }, 'Tests Passed: '),
      text(() => String(testState.testsPassed))
    ]),
    div({}, [
      text({ style: { fontWeight: 'bold', color: '#fff' } }, 'Tests Failed: '),
      text(() => String(testState.testsFailed))
    ])
  ]);

  return div({ 
    style: { 
      padding: '2rem',
      maxWidth: '1000px',
      margin: '0 auto'
    } 
  }, [
    h2({ style: { marginBottom: '1rem', color: '#000' } }, text('State Management Test Suite')),
    text({ 
      style: { 
        color: '#666', 
        marginBottom: '2rem', 
        display: 'block',
        fontSize: '1.1rem'
      } 
    }, 'Testing 5 state management functions: createStore, useStore, createContext, useContext, provider'),
    
    statusDisplay,
    
    vbox({ style: { gap: '3rem' } }, [
      testCreateStore(),
      testUseStore(),
      testContext(),
      testStoreManagement()
    ])
  ]);
}
