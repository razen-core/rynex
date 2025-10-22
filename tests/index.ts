/**
 * Rynex Test Suite - Main Entry Point
 * Runs all test suites for new functions
 */

// Import CSS for Tailwind processing
import './public/styles.css';

import { render, div, text, tabs } from '../dist/runtime/index.js';
import UtilitiesTest from './test-utilities.js';
import LifecycleTest from './test-lifecycle.js';
import PerformanceTest from './test-performance.js';
import RefsTest from './test-refs.js';
import StylesTest from './test-styles.js';
import ComponentsTest from './test-components.js';
import TailwindTest from './test-tailwind.js';
import AnimationsTest from './test-animations.js';
import DevToolsTest from './test-devtools.js';
import StateManagementTest from './test-state-management.js';

function TestRunner() {
  return div({ 
    class: 'test-runner',
    style: { 
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }
  }, [
    // Header
    div({ 
      style: { 
        background: '#000',
        color: '#fff',
        padding: '2rem',
        textAlign: 'center',
        borderBottom: '4px solid #00ff88'
      }
    }, [
      text({ style: { fontSize: '2.5rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' } }, 'Rynex Test Suite'),
      text({ style: { fontSize: '1.1rem', color: '#00ff88' } }, '44 New Functions - Comprehensive Testing')
    ]),

    // Test Tabs
    div({ style: { padding: '2rem 0' } }, [
      tabs({
        tabs: [
          {
            label: 'Utilities',
            content: UtilitiesTest()
          },
          {
            label: 'Lifecycle',
            content: LifecycleTest()
          },
          {
            label: 'Performance',
            content: PerformanceTest()
          },
          {
            label: 'Refs',
            content: RefsTest()
          },
          {
            label: 'Styles',
            content: StylesTest()
          },
          {
            label: 'Components',
            content: ComponentsTest()
          },
          {
            label: 'Tailwind CSS',
            content: TailwindTest()
          },
          {
            label: 'Animation',
            content: AnimationsTest()
          },
          {
            label: 'DevTools',
            content: DevToolsTest()
          },
          /* {
            label: 'State Management',
            content: StateManagementTest()
          } */
        ],
        defaultIndex: 6,
        style: { 
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          margin: '0 auto',
          maxWidth: '1200px'
        }
      })
    ]),

    // Footer
    div({ 
      style: { 
        background: '#000',
        color: '#fff',
        padding: '1.5rem',
        textAlign: 'center',
        marginTop: '2rem'
      }
    }, [
      text({ style: { color: '#666' } }, 'Rynex Framework - Production Ready Testing Suite')
    ])
  ]);
}

const root = document.getElementById('root');
if (root) {
  render(TestRunner, root);
}
