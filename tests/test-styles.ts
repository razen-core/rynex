/**
 * Rynex Style Utilities Test Suite
 * Tests for style functions: styled, classNames, mergeStyles, theme
 */

import { 
  styled,
  classNames,
  mergeStyles,
  setTheme,
  getTheme,
  useTheme,
  div,
  text,
  button,
  state
} from '../dist/runtime/index.js';

export default function StylesTest() {
  const testState = state({
    isActive: false,
    isDanger: false
  });

  const container = div({ class: 'test-container', style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' } }, [
    
    // Test Header
    div({ style: { marginBottom: '2rem' } }, [
      text({ style: { fontSize: '2rem', fontWeight: 'bold' } }, 'Style Utilities Test Suite'),
      text({ style: { display: 'block', color: '#666', marginTop: '0.5rem' } }, 'Testing styled, classNames, mergeStyles, and theme')
    ]),

    // Test 1: Styled Components
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 1: Styled Components'),
      (() => {
        const StyledButton = styled('button', {
          padding: '0.75rem 1.5rem',
          background: '#00ff88',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s'
        });
        
        const DynamicStyledDiv = styled<{ variant: 'primary' | 'secondary' }>('div', (props) => ({
          padding: '1rem',
          borderRadius: '4px',
          background: props.variant === 'primary' ? '#00ff88' : '#666',
          color: props.variant === 'primary' ? '#000' : '#fff'
        }));
        
        return div({}, [
          StyledButton({}, 'Styled Button'),
          div({ style: { marginTop: '1rem' } }, [
            DynamicStyledDiv({ variant: 'primary' }, [text({}, 'Primary variant')]),
            div({ style: { height: '0.5rem' } }),
            DynamicStyledDiv({ variant: 'secondary' }, [text({}, 'Secondary variant')])
          ])
        ]);
      })()
    ]),

    // Test 2: classNames
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 2: classNames'),
      (() => {
        const resultDiv = div({
          class: classNames(
            'base-class',
            { 'active': testState.isActive },
            { 'danger': testState.isDanger },
            testState.isActive && 'highlighted'
          ),
          style: { padding: '1rem', background: '#f0f0f0', borderRadius: '4px', marginTop: '1rem' }
        }, [text({}, () => `Classes: ${classNames('base-class', { 'active': testState.isActive }, { 'danger': testState.isDanger })}`)]);
        
        return div({}, [
          button({
            style: { padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
            onClick: () => { testState.isActive = !testState.isActive; }
          }, 'Toggle Active'),
          button({
            style: { padding: '0.5rem 1rem', background: '#ff5555', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => { testState.isDanger = !testState.isDanger; }
          }, 'Toggle Danger'),
          resultDiv
        ]);
      })()
    ]),

    // Test 3: mergeStyles
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 3: mergeStyles'),
      (() => {
        const baseStyles = {
          padding: '1rem',
          background: '#f0f0f0',
          borderRadius: '4px'
        };
        
        const activeStyles = {
          background: '#00ff88',
          color: '#000',
          fontWeight: 'bold'
        };
        
        const merged = mergeStyles(baseStyles, testState.isActive ? activeStyles : {});
        
        return div({}, [
          div({ style: merged }, [
            text({}, () => testState.isActive ? 'Active styles merged!' : 'Base styles only')
          ]),
          button({
            style: { marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => { testState.isActive = !testState.isActive; }
          }, 'Toggle Merge')
        ]);
      })()
    ]),

    // Test 4: Theme
    div({ style: { marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' } }, [
      text({ style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' } }, 'Test 4: Theme'),
      (() => {
        const themeResult = div({ id: 'theme-result', style: { marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' } });
        
        useTheme((theme) => {
          themeResult.textContent = `Current theme: ${JSON.stringify(theme)}`;
        });
        
        return div({}, [
          button({
            style: { padding: '0.5rem 1rem', background: '#00ff88', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
            onClick: () => {
              setTheme({ mode: 'dark', primary: '#00ff88', secondary: '#666' });
            }
          }, 'Set Dark Theme'),
          button({
            style: { padding: '0.5rem 1rem', background: '#4CAF50', border: 'none', borderRadius: '4px', cursor: 'pointer' },
            onClick: () => {
              setTheme({ mode: 'light', primary: '#007bff', secondary: '#ccc' });
            }
          }, 'Set Light Theme'),
          themeResult
        ]);
      })()
    ]),

    // Test Results Summary
    div({ style: { padding: '1rem', background: '#f0f0f0', borderRadius: '8px' } }, [
      text({ style: { fontWeight: 'bold' } }, 'All style tests initialized successfully!')
    ])
  ]);

  return container;
}
