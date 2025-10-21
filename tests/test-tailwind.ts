/**
 * Tailwind CSS Test
 * Tests that Tailwind classes are detected and work properly
 */

import { div, text, button, vbox, hbox } from '../dist/runtime/index.js';

export default function TailwindTest() {
  return div({
    class: 'min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8'
  }, [
    vbox({
      class: 'bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full space-y-6'
    }, [
      // Header
      text({
        class: 'text-4xl font-bold text-gray-800 text-center mb-4'
      }, '🎨 Tailwind CSS Test'),
      
      text({
        class: 'text-lg text-gray-600 text-center mb-8',
        text: 'Testing class detection: class: "flex items-center"'
      }),
      
      // Card Grid
      hbox({
        class: 'grid grid-cols-1 md:grid-cols-2 gap-4'
      }, [
        // Card 1
        div({
          class: 'bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow'
        }, [
          text({
            class: 'text-xl font-semibold text-blue-700 mb-2',
            text: 'Flexbox'
          }),
          text({
            class: 'text-gray-600',
            text: 'flex, items-center, justify-between'
          })
        ]),
        
        // Card 2
        div({
          class: 'bg-purple-50 border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow'
        }, [
          text({
            class: 'text-xl font-semibold text-purple-700 mb-2',
            text: 'Colors'
          }),
          text({
            class: 'text-gray-600',
            text: 'bg-blue-500, text-white, border-gray-300'
          })
        ]),
        
        // Card 3
        div({
          class: 'bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow'
        }, [
          text({
            class: 'text-xl font-semibold text-green-700 mb-2',
            text: 'Spacing'
          }),
          text({
            class: 'text-gray-600',
            text: 'p-4, m-2, gap-4, space-y-2'
          })
        ]),
        
        // Card 4
        div({
          class: 'bg-red-50 border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition-shadow'
        }, [
          text({
            class: 'text-xl font-semibold text-red-700 mb-2',
            text: 'Responsive'
          }),
          text({
            class: 'text-gray-600',
            text: 'sm:text-sm, md:text-base, lg:text-lg'
          })
        ])
      ]),
      
      // Buttons
      hbox({
        class: 'flex gap-4 justify-center mt-8'
      }, [
        button({
          class: 'bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105',
          text: 'Primary Button',
          onclick: () => console.log('Primary clicked!')
        }),
        button({
          class: 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors',
          text: 'Secondary Button',
          onclick: () => console.log('Secondary clicked!')
        })
      ]),
      
      // Status
      div({
        class: 'mt-8 p-4 bg-green-100 border-l-4 border-green-500 rounded'
      }, [
        text({
          class: 'text-green-800 font-semibold',
          text: '✅ If you see styled content, Tailwind CSS is working!'
        })
      ])
    ])
  ]);
}
