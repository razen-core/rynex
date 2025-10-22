/**
 * Rynex Developer Tools Test Suite
 * Tests: logger, profiler, devtools
 */

import { 
  div, 
  button, 
  text,
  h2, 
  h3,
  vbox,
  hbox,
  state,
  logger,
  profiler,
  devtools,
  log,
  profile,
  LogLevel
} from '../dist/runtime/index.js';

export default function DevToolsTest() {
  const testState = state({
    status: 'Ready to test developer tools',
    logCount: 0,
    profileCount: 0,
    lastLogLevel: 'None',
    lastProfileDuration: 0
  });

  // Create logger instance
  const appLogger = logger({
    level: LogLevel.DEBUG,
    prefix: '[TestApp]',
    timestamp: true,
    colors: true
  });

  // Create profiler instance
  const appProfiler = profiler();

  // Initialize devtools
  const tools = devtools({ enabled: true });

  // Test 1: Logger Levels
  function testLogger() {
    const logOutput = state({
      logs: [] as string[]
    });

    const addLog = (level: string, message: string) => {
      logOutput.logs = [...logOutput.logs, `[${level}] ${message}`];
      if (logOutput.logs.length > 10) {
        logOutput.logs = logOutput.logs.slice(-10);
      }
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '1. Logger Test'),
      text({ style: { color: '#666' } }, 'Test different log levels and structured logging'),
      
      div({
        style: {
          padding: '1.5rem',
          background: '#1f2937',
          color: '#00ff88',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          maxHeight: '200px',
          overflowY: 'auto'
        }
      }, [
        (() => {
          if (logOutput.logs.length === 0) {
            return div({}, text('No logs yet...'));
          }
          return vbox({ style: { gap: '0.25rem' } }, 
            logOutput.logs.map(logMsg => 
              div({}, text(logMsg))
            )
          );
        })()
      ]),

      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: () => {
            log.debug('Debug message', { timestamp: Date.now() });
            appLogger.debug('This is a debug message');
            addLog('DEBUG', 'Debug message logged');
            testState.lastLogLevel = 'DEBUG';
            testState.logCount++;
            testState.status = 'Debug log created';
          },
          style: {
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Debug'),
        button({
          onclick: () => {
            log.info('Info message', { status: 'ok' });
            appLogger.info('This is an info message');
            addLog('INFO', 'Info message logged');
            testState.lastLogLevel = 'INFO';
            testState.logCount++;
            testState.status = 'Info log created';
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
        }, 'Info'),
        button({
          onclick: () => {
            log.warn('Warning message', { level: 'medium' });
            appLogger.warn('This is a warning message');
            addLog('WARN', 'Warning message logged');
            testState.lastLogLevel = 'WARN';
            testState.logCount++;
            testState.status = 'Warning log created';
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
        }, 'Warn'),
        button({
          onclick: () => {
            log.error('Error message', { code: 500 });
            appLogger.error('This is an error message');
            addLog('ERROR', 'Error message logged');
            testState.lastLogLevel = 'ERROR';
            testState.logCount++;
            testState.status = 'Error log created';
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
        }, 'Error'),
        button({
          onclick: () => {
            logOutput.logs = [];
            testState.status = 'Logs cleared';
          },
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
        }, 'Clear')
      ])
    ]);
  }

  // Test 2: Profiler
  function testProfiler() {
    const profileResults = state({
      results: [] as Array<{ name: string; duration: string }>
    });

    const runHeavyTask = (iterations: number) => {
      let sum = 0;
      for (let i = 0; i < iterations; i++) {
        sum += Math.sqrt(i) * Math.random();
      }
      return sum;
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '2. Profiler Test'),
      text({ style: { color: '#666' } }, 'Measure performance of operations'),
      
      div({
        style: {
          padding: '1.5rem',
          background: '#f3f4f6',
          borderRadius: '12px'
        }
      }, [
        div({ style: { marginBottom: '1rem' } }, [
          text({ style: { fontWeight: 'bold', color: '#000' } }, 'Last Duration: '),
          text(() => `${testState.lastProfileDuration.toFixed(2)}ms`)
        ]),
        div({
          style: {
            background: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            maxHeight: '150px',
            overflowY: 'auto'
          }
        }, [
          (() => {
            if (profileResults.results.length === 0) {
              return div({}, text('No profiles yet...'));
            }
            return vbox({ style: { gap: '0.5rem' } },
              profileResults.results.map(result =>
                div({ style: { display: 'flex', justifyContent: 'space-between' } }, [
                  text({ style: { fontWeight: '600', color: '#667eea' } }, result.name),
                  text({ style: { color: '#10b981' } }, result.duration)
                ])
              )
            );
          })()
        ])
      ]),

      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: () => {
            profile.start('light-task');
            runHeavyTask(10000);
            const duration = profile.end('light-task') || 0;
            testState.lastProfileDuration = duration;
            profileResults.results = [...profileResults.results, { 
              name: 'Light Task (10k)', 
              duration: `${duration.toFixed(2)}ms` 
            }];
            testState.profileCount++;
            testState.status = `Light task: ${duration.toFixed(2)}ms`;
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
        }, 'Light Task'),
        button({
          onclick: () => {
            profile.start('medium-task');
            runHeavyTask(100000);
            const duration = profile.end('medium-task') || 0;
            testState.lastProfileDuration = duration;
            profileResults.results = [...profileResults.results, { 
              name: 'Medium Task (100k)', 
              duration: `${duration.toFixed(2)}ms` 
            }];
            testState.profileCount++;
            testState.status = `Medium task: ${duration.toFixed(2)}ms`;
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
        }, 'Medium Task'),
        button({
          onclick: () => {
            profile.start('heavy-task');
            runHeavyTask(1000000);
            const duration = profile.end('heavy-task') || 0;
            testState.lastProfileDuration = duration;
            profileResults.results = [...profileResults.results, { 
              name: 'Heavy Task (1M)', 
              duration: `${duration.toFixed(2)}ms` 
            }];
            testState.profileCount++;
            testState.status = `Heavy task: ${duration.toFixed(2)}ms`;
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
        }, 'Heavy Task'),
        button({
          onclick: () => {
            const report = profile.report();
            console.log('Profile Report:', report);
            testState.status = 'Report generated (check console)';
          },
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
        }, 'Show Report'),
        button({
          onclick: () => {
            profileResults.results = [];
            testState.status = 'Profile results cleared';
          },
          style: {
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, 'Clear')
      ])
    ]);
  }

  // Test 3: Measure Function
  function testMeasure() {
    const measureResults = state({
      syncResult: 0,
      asyncResult: '',
      syncDuration: 0,
      asyncDuration: 0
    });

    const syncTask = () => {
      let sum = 0;
      for (let i = 0; i < 500000; i++) {
        sum += i;
      }
      return sum;
    };

    const asyncTask = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return 'Async task completed!';
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '3. Measure Function Test'),
      text({ style: { color: '#666' } }, 'Measure synchronous and asynchronous functions'),
      
      div({
        style: {
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderRadius: '12px'
        }
      }, [
        div({ style: { marginBottom: '0.5rem' } }, [
          text({ style: { fontWeight: 'bold' } }, 'Sync Result: '),
          text(() => String(measureResults.syncResult))
        ]),
        div({ style: { marginBottom: '0.5rem' } }, [
          text({ style: { fontWeight: 'bold' } }, 'Sync Duration: '),
          text(() => `${measureResults.syncDuration.toFixed(2)}ms`)
        ]),
        div({ style: { marginBottom: '0.5rem' } }, [
          text({ style: { fontWeight: 'bold' } }, 'Async Result: '),
          text(() => measureResults.asyncResult || 'Not run yet')
        ]),
        div({}, [
          text({ style: { fontWeight: 'bold' } }, 'Async Duration: '),
          text(() => `${measureResults.asyncDuration.toFixed(2)}ms`)
        ])
      ]),

      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: () => {
            const result = profile.measure('sync-measure', syncTask);
            const duration = appProfiler.getProfile('sync-measure')?.duration || 0;
            measureResults.syncResult = result;
            measureResults.syncDuration = duration;
            testState.status = `Sync measured: ${duration.toFixed(2)}ms`;
            testState.profileCount++;
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
        }, 'Measure Sync'),
        button({
          onclick: async () => {
            testState.status = 'Running async task...';
            const result = await profile.measureAsync('async-measure', asyncTask);
            const duration = appProfiler.getProfile('async-measure')?.duration || 0;
            measureResults.asyncResult = result;
            measureResults.asyncDuration = duration;
            testState.status = `Async measured: ${duration.toFixed(2)}ms`;
            testState.profileCount++;
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
        }, 'Measure Async')
      ])
    ]);
  }

  // Test 4: DevTools Integration
  function testDevToolsIntegration() {
    const devtoolsState = state({
      attached: typeof window !== 'undefined' && !!(window as any).__RYNEX_DEVTOOLS__,
      version: '0.1.41'
    });

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '4. DevTools Integration Test'),
      text({ style: { color: '#666' } }, 'Test browser console integration'),
      
      div({
        style: {
          padding: '1.5rem',
          background: '#000',
          color: '#00ff88',
          borderRadius: '12px',
          fontFamily: 'monospace'
        }
      }, [
        div({ style: { marginBottom: '0.5rem' } }, [
          text({ style: { color: '#fff' } }, '> window.__RYNEX_DEVTOOLS__')
        ]),
        div({ style: { marginBottom: '0.5rem' } }, [
          text({ style: { color: '#666' } }, '  Attached: '),
          text(() => devtoolsState.attached ? 'Yes ✓' : 'No ✗')
        ]),
        div({ style: { marginBottom: '0.5rem' } }, [
          text({ style: { color: '#666' } }, '  Version: '),
          text(() => devtoolsState.version)
        ]),
        div({}, [
          text({ style: { color: '#666' } }, '  Available: logger, profiler, inspect, getState')
        ])
      ]),

      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: () => {
            if ((window as any).__RYNEX_DEVTOOLS__) {
              (window as any).__RYNEX_DEVTOOLS__.logger.info('DevTools test from UI');
              testState.status = 'DevTools logger called (check console)';
            } else {
              testState.status = 'DevTools not attached';
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
        }, 'Test Logger'),
        button({
          onclick: () => {
            if ((window as any).__RYNEX_DEVTOOLS__) {
              const report = (window as any).__RYNEX_DEVTOOLS__.profiler.report();
              console.log('DevTools Profiler Report:', report);
              testState.status = 'Profiler report shown (check console)';
            } else {
              testState.status = 'DevTools not attached';
            }
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
        }, 'Test Profiler'),
        button({
          onclick: () => {
            console.log('Open browser console and type: window.__RYNEX_DEVTOOLS__');
            testState.status = 'Check browser console for DevTools API';
          },
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
        }, 'Show in Console')
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
      text({ style: { fontWeight: 'bold', color: '#fff' } }, 'Logs Created: '),
      text(() => String(testState.logCount))
    ]),
    div({ style: { marginBottom: '0.5rem' } }, [
      text({ style: { fontWeight: 'bold', color: '#fff' } }, 'Profiles Run: '),
      text(() => String(testState.profileCount))
    ]),
    div({}, [
      text({ style: { fontWeight: 'bold', color: '#fff' } }, 'Last Log Level: '),
      text(() => testState.lastLogLevel)
    ])
  ]);

  return div({ 
    style: { 
      padding: '2rem',
      maxWidth: '1000px',
      margin: '0 auto'
    } 
  }, [
    h2({ style: { marginBottom: '1rem', color: '#000' } }, text('Developer Tools Test Suite')),
    text({ 
      style: { 
        color: '#666', 
        marginBottom: '2rem', 
        display: 'block',
        fontSize: '1.1rem'
      } 
    }, 'Testing 3 devtools functions: logger, profiler, devtools integration'),
    
    statusDisplay,
    
    vbox({ style: { gap: '3rem' } }, [
      testLogger(),
      testProfiler(),
      testMeasure(),
      testDevToolsIntegration()
    ])
  ]);
}
