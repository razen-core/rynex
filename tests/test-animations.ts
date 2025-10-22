/**
 * Rynex Animation & Transitions Test Suite
 * Tests: transition, animate, fade, slide, scale, rotate
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
  transition,
  animate,
  fade,
  slide,
  scale,
  rotate
} from '../dist/runtime/index.js';

export default function AnimationsTest() {
  const testState = state({
    status: 'Ready to test animations',
    lastAnimation: 'None',
    animationCount: 0
  });

  // Test Box Component
  function createTestBox(label: string) {
    return div({
      class: 'test-box',
      style: {
        padding: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: '12px',
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        margin: '1rem 0',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, text(label));
  }

  // Test 1: Transition
  function testTransition() {
    const box = createTestBox('Transition Test Box');
    
    const applyTransition = () => {
      transition(box, {
        duration: 500,
        easing: 'ease-in-out',
        onStart: () => {
          testState.status = 'Transition started...';
          testState.lastAnimation = 'transition';
        },
        onEnd: () => {
          testState.status = 'Transition completed!';
          testState.animationCount++;
        }
      });
      
      // Change style to see transition
      box.style.transform = box.style.transform === 'scale(1.1)' ? 'scale(1)' : 'scale(1.1)';
      box.style.background = box.style.background.includes('667eea') 
        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, '1. Transition Test'),
      text({ style: { color: '#666' } }, 'Apply CSS transitions to elements'),
      box,
      button({
        onclick: applyTransition,
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
      }, 'Apply Transition')
    ]);
  }

  // Test 2: Fade
  function testFade() {
    const box = createTestBox('Fade Animation Box');
    
    const fadeIn = () => {
      testState.status = 'Fading in...';
      testState.lastAnimation = 'fade in';
      fade(box, 'in', {
        duration: 600,
        onEnd: () => {
          testState.status = 'Fade in complete!';
          testState.animationCount++;
        }
      });
    };

    const fadeOut = () => {
      testState.status = 'Fading out...';
      testState.lastAnimation = 'fade out';
      fade(box, 'out', {
        duration: 600,
        onEnd: () => {
          testState.status = 'Fade out complete!';
          testState.animationCount++;
        }
      });
    };

    const fadeToggle = () => {
      testState.status = 'Toggling fade...';
      testState.lastAnimation = 'fade toggle';
      fade(box, 'toggle', {
        duration: 600,
        onEnd: () => {
          testState.status = 'Fade toggle complete!';
          testState.animationCount++;
        }
      });
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, text('2. Fade Animation Test')),
      text({ style: { color: '#666' } }, 'Fade in, out, and toggle'),
      box,
      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: fadeIn,
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
        }, 'Fade In'),
        button({
          onclick: fadeOut,
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
        }, 'Fade Out'),
        button({
          onclick: fadeToggle,
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
        }, 'Toggle')
      ])
    ]);
  }

  // Test 3: Slide
  function testSlide() {
    const box = createTestBox('Slide Animation Box');
    
    const slideDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
      testState.status = `Sliding ${dir}...`;
      testState.lastAnimation = `slide ${dir}`;
      slide(box, dir, {
        duration: 500,
        onEnd: () => {
          testState.status = `Slide ${dir} complete!`;
          testState.animationCount++;
        }
      });
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, text('3. Slide Animation Test')),
      text({ style: { color: '#666' } }, 'Slide from different directions'),
      box,
      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: () => slideDirection('up'),
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
        }, '↑ Up'),
        button({
          onclick: () => slideDirection('down'),
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
        }, '↓ Down'),
        button({
          onclick: () => slideDirection('left'),
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
        }, '← Left'),
        button({
          onclick: () => slideDirection('right'),
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
        }, '→ Right')
      ])
    ]);
  }

  // Test 4: Scale
  function testScale() {
    const box = createTestBox('Scale Animation Box');
    
    const scaleIn = () => {
      testState.status = 'Scaling in...';
      testState.lastAnimation = 'scale in';
      scale(box, 'in', {
        duration: 500,
        onEnd: () => {
          testState.status = 'Scale in complete!';
          testState.animationCount++;
        }
      });
    };

    const scaleOut = () => {
      testState.status = 'Scaling out...';
      testState.lastAnimation = 'scale out';
      scale(box, 'out', {
        duration: 500,
        onEnd: () => {
          testState.status = 'Scale out complete!';
          testState.animationCount++;
        }
      });
    };

    const scaleToggle = () => {
      testState.status = 'Toggling scale...';
      testState.lastAnimation = 'scale toggle';
      scale(box, 'toggle', {
        duration: 500,
        onEnd: () => {
          testState.status = 'Scale toggle complete!';
          testState.animationCount++;
        }
      });
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, text('4. Scale Animation Test')),
      text({ style: { color: '#666' } }, 'Scale in, out, and toggle'),
      box,
      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: scaleIn,
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
        }, 'Scale In'),
        button({
          onclick: scaleOut,
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
        }, 'Scale Out'),
        button({
          onclick: scaleToggle,
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
        }, 'Toggle')
      ])
    ]);
  }

  // Test 5: Rotate
  function testRotate() {
    const box = createTestBox('Rotate Animation Box');
    
    const rotate360 = () => {
      testState.status = 'Rotating 360°...';
      testState.lastAnimation = 'rotate 360';
      rotate(box, 360, {
        duration: 1000,
        onEnd: () => {
          testState.status = 'Rotation complete!';
          testState.animationCount++;
        }
      });
    };

    const rotate180 = () => {
      testState.status = 'Rotating 180°...';
      testState.lastAnimation = 'rotate 180';
      rotate(box, 180, {
        duration: 500,
        onEnd: () => {
          testState.status = 'Rotation complete!';
          testState.animationCount++;
        }
      });
    };

    const rotateNegative = () => {
      testState.status = 'Rotating -360°...';
      testState.lastAnimation = 'rotate -360';
      rotate(box, -360, {
        duration: 1000,
        onEnd: () => {
          testState.status = 'Rotation complete!';
          testState.animationCount++;
        }
      });
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, text('5. Rotate Animation Test')),
      text({ style: { color: '#666' } }, 'Rotate by different degrees'),
      box,
      hbox({ style: { gap: '0.5rem', flexWrap: 'wrap' } }, [
        button({
          onclick: rotate360,
          style: {
            padding: '0.75rem 1.5rem',
            background: '#ec4899',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, '360°'),
        button({
          onclick: rotate180,
          style: {
            padding: '0.75rem 1.5rem',
            background: '#ec4899',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, '180°'),
        button({
          onclick: rotateNegative,
          style: {
            padding: '0.75rem 1.5rem',
            background: '#ec4899',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }
        }, '-360°')
      ])
    ]);
  }

  // Test 6: Custom Animation
  function testCustomAnimation() {
    const box = createTestBox('Custom Animation Box');
    
    const customAnim = () => {
      testState.status = 'Running custom animation...';
      testState.lastAnimation = 'custom keyframes';
      
      animate(box, {
        keyframes: [
          { transform: 'translateX(0) rotate(0deg)', background: '#667eea' },
          { transform: 'translateX(50px) rotate(180deg)', background: '#f093fb' },
          { transform: 'translateX(0) rotate(360deg)', background: '#667eea' }
        ],
        duration: 1500,
        easing: 'ease-in-out',
        onEnd: () => {
          testState.status = 'Custom animation complete!';
          testState.animationCount++;
        }
      });
    };

    return vbox({ style: { gap: '1rem' } }, [
      h3({}, text('6. Custom Animation Test')),
      text({ style: { color: '#666' } }, 'Complex keyframe animation'),
      box,
      button({
        onclick: customAnim,
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
      }, 'Run Custom Animation')
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
      text({ style: { fontWeight: 'bold', color: '#fff' } }, 'Last Animation: '),
      text(() => testState.lastAnimation)
    ]),
    div({}, [
      text({ style: { fontWeight: 'bold', color: '#fff' } }, 'Animations Run: '),
      text(() => String(testState.animationCount))
    ])
  ]);

  return div({ 
    style: { 
      padding: '2rem',
      maxWidth: '1000px',
      margin: '0 auto'
    } 
  }, [
    h2({ style: { marginBottom: '1rem', color: '#000' } }, text('Animation & Transitions Test Suite')),
    text({ 
      style: { 
        color: '#666', 
        marginBottom: '2rem', 
        display: 'block',
        fontSize: '1.1rem'
      } 
    }, 'Testing 6 animation functions: transition, animate, fade, slide, scale, rotate'),
    
    statusDisplay,
    
    vbox({ style: { gap: '3rem' } }, [
      testTransition(),
      testFade(),
      testSlide(),
      testScale(),
      testRotate(),
      testCustomAnimation()
    ])
  ]);
}
