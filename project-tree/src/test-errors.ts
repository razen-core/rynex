/**
 * Test file to verify error system catches errors
 * This file intentionally contains errors to test validation
 */

import { 
  div, 
  h1, 
  h2,
  button, 
  vbox, 
  image, 
  link,
  createElement 
} from '../../dist/runtime/index.js';

export function TestErrorCases() {
  console.log('=== Rynex Error System Loaded ===');
  console.log('Click buttons below to test error handling');
  
  // This should be caught at build time - image without src
  const badImage = image({ alt: 'test' });
  
  // This should be caught at build time - empty tag name
  const badElement = createElement('', {}, 'test');
  
  const container = vbox(
    { style: { padding: '40px', maxWidth: '800px', margin: '0 auto' } },
    
    h1({}, '🔥 Rynex Error System Test'),
    h2({ style: { color: '#666', marginTop: '10px' } }, 'Click buttons to trigger errors and see panic-overlay in action'),
    
    vbox(
      { style: { gap: '15px', marginTop: '30px' } },
      
      button({
        style: {
          padding: '12px 24px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        },
        onClick: () => {
          // Test 1: Empty tag name - this will throw error
          createElement('', {}, 'content');
        }
      }, test('❌ Test 1: Empty Tag Name')),
      
      button({
        style: {
          padding: '12px 24px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        },
        onClick: () => {
          // Test 2: Type error - intentional for build-time check
          const x: number = "this is wrong type"; // This should be caught at build time
          console.log(x);
        }
      }, '❌ Test 2: Type Error (Build Time)'),
      
      button({
        style: {
          padding: '12px 24px',
          background: '#ff6644',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        },
        onClick: () => {
          // Test 2: Invalid props
          div(['invalid', 'props'] as any);
        }
      }, '❌ Test 2: Invalid Props Type'),
      
      button({
        style: {
          padding: '12px 24px',
          background: '#ff8844',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        },
        onClick: () => {
          // Test 3: Image without src
          image({ alt: 'test' } as any);
        }
      }, '❌ Test 3: Image Without Src'),
      
      button({
        style: {
          padding: '12px 24px',
          background: '#ffaa44',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        },
        onClick: () => {
          // Test 4: Link without href
          link({ class: 'link' } as any, 'Click me');
        }
      }, '❌ Test 4: Link Without Href'),
      
      button({
        style: {
          padding: '12px 24px',
          background: '#44ff44',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        },
        onClick: () => {
          // Test 5: Valid code (should work)
          const validDiv = div(
            { class: 'container' },
            h1({}, 'Success!'),
            button({ onClick: () => alert('Clicked!') }, 'Click me')
          );
          alert('✅ Valid code executed successfully!');
        }
      }, '✅ Test 5: Valid Code (Should Work)')
    )
  );
  
  return container;
}

