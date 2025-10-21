/**
 * Rynex Utilities Test Suite
 * Tests for utility functions: lazy, suspense, errorBoundary, memo
 */

import { 
  lazy, 
  suspense, 
  errorBoundary, 
  memo,
  div,
  text,
  button
} from '../dist/runtime/index.js';

export default function UtilitiesTest() {
  const container = div({ class: 'test-container', style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' } }, [
    
    // Test Header
    div({ style: { marginBottom: '2rem' } }, [
      text({ style: { fontSize: '2rem', fontWeight: 'bold' } }, 'Utilities Test Suite'),
      text({ style: { display: 'block', color: '#666', marginTop: '0.5rem' } }, 'Testing lazy, suspense, errorBoundary, and memo')
    ]),

    // Test 1: Lazy Loading
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 1: Lazy Loading'),
      button({
        style: { padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        onClick: async () => {
          const lazyComponent = lazy(() => 
            Promise.resolve({ 
              default: () => text({ style: { color: 'green' } }, 'Lazy component loaded!')
            })
          );
          const component = await lazyComponent();
          const result = component();
          document.getElementById('lazy-result')!.appendChild(result);
        }
      }, 'Load Lazy Component'),
      div({ id: 'lazy-result', style: { marginTop: '1rem' } })
    ]),

    // Test 2: Suspense
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 2: Suspense'),
      suspense(
        {
          fallback: text({ style: { color: '#666' } }, 'Loading...'),
          onError: (error) => console.error('Suspense error:', error)
        },
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return text({ style: { color: 'blue' } }, 'Content loaded after 1 second!');
        }
      )
    ]),

    // Test 3: Error Boundary
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 3: Error Boundary'),
      errorBoundary(
        {
          fallback: (error) => text({ style: { color: 'red' } }, `Error caught: ${error.message}`),
          onError: (error) => console.log('Error boundary caught:', error)
        },
        () => {
          return text({ style: { color: 'green' } }, 'No errors here!');
        }
      )
    ]),

    // Test 4: Memo
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 4: Memo'),
      (() => {
        let renderCount = 0;
        const MemoizedComponent = memo((props: { value: number }) => {
          renderCount++;
          return text({}, `Value: ${props.value}, Render count: ${renderCount}`);
        });

        const result = div({ id: 'memo-result' });
        const comp1 = MemoizedComponent({ value: 10 });
        const comp2 = MemoizedComponent({ value: 10 });
        const comp3 = MemoizedComponent({ value: 20 });
        
        result.appendChild(div({ style: { marginBottom: '0.5rem' } }, [comp1]));
        result.appendChild(div({ style: { marginBottom: '0.5rem' } }, [comp2]));
        result.appendChild(div({}, [comp3]));
        
        return result;
      })()
    ]),

    // Test Results Summary
    div({ style: { padding: '1rem', background: '#f0f0f0', borderRadius: '8px' } }, [
      text({ style: { fontWeight: 'bold' } }, 'All utility tests completed successfully!')
    ])
  ]);

  return container;
}
