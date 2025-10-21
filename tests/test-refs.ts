/**
 * Rynex Refs and DOM Access Test Suite
 * Tests for ref functions: ref, useRef, forwardRef, mergeRefs
 */

import { 
  ref,
  useRef,
  forwardRef,
  mergeRefs,
  div,
  text,
  button,
  input
} from '../dist/runtime/index.js';

export default function RefsTest() {
  const container = div({ class: 'test-container', style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' } }, [
    
    // Test Header
    div({ style: { marginBottom: '2rem' } }, [
      text({ style: { fontSize: '2rem', fontWeight: 'bold' } }, 'Refs and DOM Access Test Suite'),
      text({ style: { display: 'block', color: '#666', marginTop: '0.5rem' } }, 'Testing ref, useRef, forwardRef, and mergeRefs')
    ]),

    // Test 1: Basic Ref
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 1: Basic Ref'),
      (() => {
        const inputRef = ref<HTMLInputElement>();
        const resultDiv = div({ id: 'ref-result', style: { marginTop: '1rem', color: 'blue' } });
        
        const inputEl = input({
          type: 'text',
          placeholder: 'Type something...',
          style: { padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }
        });
        
        inputRef.current = inputEl;
        
        return div({}, [
          inputEl,
          button({
            style: { marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => {
              if (inputRef.current) {
                resultDiv.textContent = `Input value via ref: ${inputRef.current.value}`;
                inputRef.current.focus();
              }
            }
          }, 'Get Value & Focus'),
          resultDiv
        ]);
      })()
    ]),

    // Test 2: useRef
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 2: useRef'),
      (() => {
        const divRef = useRef<HTMLDivElement>();
        const resultDiv = div({ id: 'useref-result', style: { marginTop: '1rem' } });
        
        const targetDiv = div({
          style: { padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }
        }, [text({}, 'Target div for useRef')]);
        
        divRef.current = targetDiv;
        
        return div({}, [
          targetDiv,
          button({
            style: { marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => {
              if (divRef.current) {
                divRef.current.style.background = '#' + Math.floor(Math.random()*16777215).toString(16);
                resultDiv.textContent = `Background color changed via useRef`;
              }
            }
          }, 'Change Background Color'),
          resultDiv
        ]);
      })()
    ]),

    // Test 3: forwardRef
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 3: forwardRef'),
      (() => {
        const CustomInput = forwardRef<{ placeholder: string }>((props, ref) => {
          const inputEl = input({
            type: 'text',
            placeholder: props.placeholder,
            style: { padding: '0.5rem', width: '100%', border: '2px solid #00ff88', borderRadius: '4px' }
          });
          ref.current = inputEl;
          return inputEl;
        });
        
        const forwardedRef = ref<HTMLInputElement>();
        const resultDiv = div({ id: 'forward-result', style: { marginTop: '1rem', color: 'green' } });
        
        return div({}, [
          CustomInput({ placeholder: 'Custom input with forwarded ref', ref: forwardedRef }),
          button({
            style: { marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => {
              if (forwardedRef.current) {
                resultDiv.textContent = `Value from forwarded ref: ${forwardedRef.current.value}`;
              }
            }
          }, 'Get Value'),
          resultDiv
        ]);
      })()
    ]),

    // Test 4: mergeRefs
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 4: mergeRefs'),
      (() => {
        const ref1 = ref<HTMLDivElement>();
        const ref2 = ref<HTMLDivElement>();
        const resultDiv = div({ id: 'merge-result', style: { marginTop: '1rem' } });
        
        const targetDiv = div({
          style: { padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }
        }, [text({}, 'Target div with merged refs')]);
        
        const merged = mergeRefs(ref1, ref2);
        merged(targetDiv);
        
        return div({}, [
          targetDiv,
          button({
            style: { marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
            onClick: () => {
              if (ref1.current) {
                ref1.current.style.borderLeft = '4px solid blue';
                resultDiv.textContent = 'Ref1 accessed successfully';
              }
            }
          }, 'Use Ref1'),
          button({
            style: { padding: '0.5rem 1rem', background: '#4CAF50', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => {
              if (ref2.current) {
                ref2.current.style.borderRight = '4px solid red';
                resultDiv.textContent = 'Ref2 accessed successfully';
              }
            }
          }, 'Use Ref2'),
          resultDiv
        ]);
      })()
    ]),

    // Test Results Summary
    div({ style: { padding: '1rem', background: '#f0f0f0', borderRadius: '8px' } }, [
      text({ style: { fontWeight: 'bold' } }, 'All refs tests initialized successfully!')
    ])
  ]);

  return container;
}
