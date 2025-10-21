/**
 * Rynex Performance Utilities Test Suite
 * Tests for performance functions: debounce, throttle, preload
 */

import { 
  debounce,
  throttle,
  preload,
  getPreloaded,
  div,
  text,
  input,
  button
} from '../dist/runtime/index.js';

export default function PerformanceTest() {
  let debounceCount = 0;
  let throttleCount = 0;
  let normalCount = 0;

  const container = div({ class: 'test-container', style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' } }, [
    
    // Test Header
    div({ style: { marginBottom: '2rem' } }, [
      text({ style: { fontSize: '2rem', fontWeight: 'bold' } }, 'Performance Utilities Test Suite'),
      text({ style: { display: 'block', color: '#666', marginTop: '0.5rem' } }, 'Testing debounce, throttle, and preload')
    ]),

    // Test 1: Debounce
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 1: Debounce'),
      text({ style: { display: 'block', marginBottom: '0.5rem' } }, 'Type in the input - debounced function will execute 500ms after you stop typing'),
      (() => {
        const debounceResult = div({ id: 'debounce-result', style: { marginTop: '1rem', color: 'blue' } });
        
        const debouncedFn = debounce((value: string) => {
          debounceCount++;
          debounceResult.textContent = `Debounced called ${debounceCount} times. Value: ${value}`;
        }, 500);
        
        return div({}, [
          input({
            type: 'text',
            placeholder: 'Type here...',
            style: { padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' },
            onInput: (e) => {
              const target = e.target as HTMLInputElement;
              normalCount++;
              debouncedFn(target.value);
              document.getElementById('normal-count')!.textContent = `Normal input events: ${normalCount}`;
            }
          }),
          div({ id: 'normal-count', style: { marginTop: '0.5rem', color: '#666' } }, 'Normal input events: 0'),
          debounceResult
        ]);
      })()
    ]),

    // Test 2: Throttle
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 2: Throttle'),
      text({ style: { display: 'block', marginBottom: '0.5rem' } }, 'Click rapidly - throttled function will execute at most once per 1000ms'),
      (() => {
        const throttleResult = div({ id: 'throttle-result', style: { marginTop: '1rem', color: 'green' } });
        let clickCount = 0;
        
        const throttledFn = throttle(() => {
          throttleCount++;
          throttleResult.textContent = `Throttled called ${throttleCount} times`;
        }, 1000);
        
        return div({}, [
          button({
            style: { padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => {
              clickCount++;
              throttledFn();
              document.getElementById('click-count')!.textContent = `Total clicks: ${clickCount}`;
            }
          }, 'Click Me Rapidly!'),
          div({ id: 'click-count', style: { marginTop: '0.5rem', color: '#666' } }, 'Total clicks: 0'),
          throttleResult
        ]);
      })()
    ]),

    // Test 3: Preload
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 3: Preload'),
      (() => {
        const preloadResult = div({ id: 'preload-result', style: { marginTop: '1rem' } });
        
        const dataLoader = () => new Promise<string>(resolve => {
          setTimeout(() => resolve('Preloaded data!'), 1000);
        });
        
        return div({}, [
          button({
            style: { padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
            onClick: async () => {
              preloadResult.textContent = 'Preloading...';
              const startTime = Date.now();
              await preload(dataLoader);
              const elapsed = Date.now() - startTime;
              preloadResult.textContent = `Preloaded in ${elapsed}ms`;
            }
          }, 'Preload Data'),
          button({
            style: { padding: '0.5rem 1rem', background: '#4CAF50', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: async () => {
              const cached = getPreloaded(dataLoader);
              if (cached) {
                preloadResult.textContent = 'Retrieved from cache instantly!';
              } else {
                preloadResult.textContent = 'Not in cache, loading...';
                const data = await dataLoader();
                preloadResult.textContent = `Loaded: ${data}`;
              }
            }
          }, 'Get Preloaded'),
          preloadResult
        ]);
      })()
    ]),

    // Test Results Summary
    div({ style: { padding: '1rem', background: '#f0f0f0', borderRadius: '8px' } }, [
      text({ style: { fontWeight: 'bold' } }, 'All performance tests initialized successfully!')
    ])
  ]);

  return container;
}
