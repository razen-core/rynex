/**
 * Rynex Lifecycle Hooks Test Suite
 * Tests for lifecycle functions: onMount, onUnmount, onUpdate, watch, watchEffect
 */

import { 
  onMount,
  onUnmount,
  onUpdate,
  watch,
  watchEffect,
  div,
  text,
  button,
  state
} from '../dist/runtime/index.js';

export default function LifecycleTest() {
  const testState = state({
    count: 0,
    message: 'Initial message',
    mountLog: [] as string[],
    updateLog: [] as string[]
  });

  const container = div({ class: 'test-container', style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' } }, [
    
    // Test Header
    div({ style: { marginBottom: '2rem' } }, [
      text({ style: { fontSize: '2rem', fontWeight: 'bold' } }, 'Lifecycle Hooks Test Suite'),
      text({ style: { display: 'block', color: '#666', marginTop: '0.5rem' } }, 'Testing onMount, onUnmount, onUpdate, watch, watchEffect')
    ]),

    // Test 1: onMount
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 1: onMount'),
      (() => {
        const mountTest = div({ id: 'mount-test', style: { padding: '0.5rem', background: '#f0f0f0' } }, [
          text({}, 'This element will log when mounted')
        ]);
        
        onMount(mountTest, () => {
          testState.mountLog.push('Element mounted at ' + new Date().toLocaleTimeString());
          console.log('onMount triggered');
        });
        
        return mountTest;
      })(),
      div({ id: 'mount-log', style: { marginTop: '1rem', color: 'green' } })
    ]),

    // Test 2: onUpdate
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 2: onUpdate'),
      (() => {
        const updateTest = div({ id: 'update-test', style: { padding: '0.5rem', background: '#f0f0f0' } }, [
          text({}, 'Click button to update this element')
        ]);
        
        onUpdate(updateTest, (mutations) => {
          testState.updateLog.push(`Updated: ${mutations.length} mutations`);
          console.log('onUpdate triggered:', mutations);
        });
        
        return div({}, [
          updateTest,
          button({
            style: { marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => {
              updateTest.appendChild(text({ style: { display: 'block' } }, 'Updated at ' + new Date().toLocaleTimeString()));
            }
          }, 'Trigger Update')
        ]);
      })()
    ]),

    // Test 3: watch
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 3: watch'),
      (() => {
        const watchResult = div({ id: 'watch-result' });
        
        watch(
          () => testState.count,
          (newVal, oldVal) => {
            watchResult.appendChild(
              text({ style: { display: 'block', color: 'blue' } }, `Count changed from ${oldVal} to ${newVal}`)
            );
          }
        );
        
        return div({}, [
          button({
            style: { padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => { testState.count++; }
          }, 'Increment Count'),
          text({ style: { marginLeft: '1rem' } }, () => `Current: ${testState.count}`),
          watchResult
        ]);
      })()
    ]),

    // Test 4: watchEffect
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 4: watchEffect'),
      (() => {
        const effectResult = div({ id: 'effect-result' });
        
        watchEffect(() => {
          effectResult.textContent = `Message: ${testState.message} (Count: ${testState.count})`;
        });
        
        return div({}, [
          button({
            style: { padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
            onClick: () => { testState.message = 'Updated at ' + new Date().toLocaleTimeString(); }
          }, 'Update Message'),
          button({
            style: { padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => { testState.count++; }
          }, 'Increment'),
          div({ style: { marginTop: '1rem', padding: '0.5rem', background: '#f0f0f0' } }, [effectResult])
        ]);
      })()
    ]),

    // Test Results Summary
    div({ style: { padding: '1rem', background: '#f0f0f0', borderRadius: '8px' } }, [
      text({ style: { fontWeight: 'bold' } }, 'All lifecycle tests initialized successfully!')
    ])
  ]);

  return container;
}
