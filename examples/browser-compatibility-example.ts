/**
 * Rynex Browser Compatibility Example
 * Demonstrates how to use cross-browser features in your Rynex application
 */

import { 
  createElement, 
  render, 
  state,
  initializeBrowserSupport,
  detectBrowser,
  browserDOM,
  getLenisInstance
} from 'rynex';

/**
 * Example 1: Basic Browser Detection
 */
function BrowserDetectionExample() {
  const browser = detectBrowser();
  
  return createElement('div', { 
    class: 'p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-8'
  },
    createElement('h2', { class: 'text-2xl font-bold mb-4' }, '🌐 Browser Detection'),
    createElement('div', { class: 'space-y-2' },
      createElement('p', {}, `Browser: ${browser.name} ${browser.version}`),
      createElement('p', {}, `Platform: ${browser.platform}`),
      createElement('p', {}, `Engine: ${browser.engine}`),
      createElement('p', {}, `Mobile: ${browser.isMobile ? 'Yes' : 'No'}`),
      createElement('div', { class: 'mt-4 p-4 bg-gray-100 rounded' },
        createElement('h3', { class: 'font-semibold mb-2' }, 'Feature Support:'),
        createElement('ul', { class: 'list-disc list-inside space-y-1' },
          createElement('li', {}, `Proxy: ${browser.supportsProxy ? '✅' : '❌'}`),
          createElement('li', {}, `IntersectionObserver: ${browser.supportsIntersectionObserver ? '✅' : '❌'}`),
          createElement('li', {}, `ResizeObserver: ${browser.supportsResizeObserver ? '✅' : '❌'}`),
          createElement('li', {}, `Smooth Scroll: ${browser.supportsSmoothScroll ? '✅' : '❌'}`),
          createElement('li', {}, `Fetch API: ${browser.supportsFetch ? '✅' : '❌'}`)
        )
      )
    )
  );
}

/**
 * Example 2: Smooth Scrolling Demo
 */
function SmoothScrollExample() {
  const sections = ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
  
  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      browserDOM.scrollToElement(element, { behavior: 'smooth', block: 'start' });
    }
  };
  
  return createElement('div', { class: 'p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-8' },
    createElement('h2', { class: 'text-2xl font-bold mb-4' }, '📜 Smooth Scrolling'),
    createElement('div', { class: 'flex gap-2 mb-6 flex-wrap' },
      ...sections.map((_, index) => 
        createElement('button', {
          class: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition',
          onClick: () => scrollToSection(index)
        }, `Go to ${sections[index]}`)
      )
    ),
    createElement('div', { class: 'space-y-4' },
      ...sections.map((section, index) => 
        createElement('div', {
          id: `section-${index}`,
          class: 'p-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg text-white'
        },
          createElement('h3', { class: 'text-xl font-bold mb-2' }, section),
          createElement('p', {}, `This is ${section}. Smooth scrolling works across all browsers!`)
        )
      )
    )
  );
}

/**
 * Example 3: Viewport Detection with IntersectionObserver
 */
function ViewportDetectionExample() {
  const appState = state({
    visibleSections: new Set<number>()
  });
  
  const sections = Array.from({ length: 5 }, (_, i) => i);
  
  // Setup intersection observer after mount
  setTimeout(() => {
    sections.forEach(index => {
      const element = document.getElementById(`viewport-section-${index}`);
      if (element && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              appState.visibleSections.add(index);
            } else {
              appState.visibleSections.delete(index);
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(element);
      }
    });
  }, 100);
  
  return createElement('div', { class: 'p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-8' },
    createElement('h2', { class: 'text-2xl font-bold mb-4' }, '👁️ Viewport Detection'),
    createElement('p', { class: 'mb-4 text-gray-600' }, 
      'Scroll down to see which sections are visible (using IntersectionObserver)'
    ),
    createElement('div', { class: 'space-y-4' },
      ...sections.map(index => 
        createElement('div', {
          id: `viewport-section-${index}`,
          class: `p-6 rounded-lg transition-all duration-300 ${
            appState.visibleSections.has(index) 
              ? 'bg-green-500 text-white scale-105' 
              : 'bg-gray-200 text-gray-700'
          }`
        },
          createElement('h3', { class: 'text-xl font-bold' }, `Section ${index + 1}`),
          createElement('p', {}, 
            appState.visibleSections.has(index) 
              ? '✅ Visible in viewport' 
              : '⏳ Scroll to view'
          )
        )
      )
    )
  );
}

/**
 * Example 4: Mobile-Responsive Layout
 */
function MobileResponsiveExample() {
  const browser = detectBrowser();
  const viewport = browserDOM.getViewportSize();
  
  return createElement('div', { class: 'p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-8' },
    createElement('h2', { class: 'text-2xl font-bold mb-4' }, '📱 Mobile Responsive'),
    createElement('div', { class: 'space-y-4' },
      createElement('div', { class: 'p-4 bg-blue-100 rounded' },
        createElement('h3', { class: 'font-semibold mb-2' }, 'Device Info:'),
        createElement('p', {}, `Platform: ${browser.platform}`),
        createElement('p', {}, `Mobile: ${browser.isMobile ? 'Yes' : 'No'}`),
        createElement('p', {}, `Viewport: ${viewport.width}x${viewport.height}`)
      ),
      createElement('div', { 
        class: 'p-6 rounded-lg',
        style: {
          height: 'calc(var(--vh, 1vh) * 50)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }
      }, '50vh Container (Mobile-Fixed)')
    )
  );
}

/**
 * Example 5: Browser-Specific Features
 */
function BrowserSpecificExample() {
  const browser = detectBrowser();
  
  const getBrowserTips = () => {
    if (browser.isFirefox) {
      return [
        '🦊 Firefox detected!',
        '✅ Scrollbar width normalized',
        '✅ Flexbox rendering fixed',
        '✅ Wheel events normalized'
      ];
    } else if (browser.isSafari) {
      return [
        '🧭 Safari detected!',
        '✅ Date parsing fixed',
        '✅ Flexbox bugs resolved',
        '✅ Scroll momentum optimized',
        '✅ Backdrop-filter supported'
      ];
    } else if (browser.isChrome) {
      return [
        '🌐 Chrome detected!',
        '✅ All features natively supported',
        '✅ Best performance'
      ];
    } else if (browser.isEdge) {
      return [
        '🌊 Edge detected!',
        '✅ Chromium-based features',
        '✅ Full compatibility'
      ];
    }
    return ['✅ Browser detected and supported'];
  };
  
  return createElement('div', { class: 'p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-8' },
    createElement('h2', { class: 'text-2xl font-bold mb-4' }, '🔧 Browser-Specific Features'),
    createElement('ul', { class: 'space-y-2' },
      ...getBrowserTips().map(tip => 
        createElement('li', { class: 'flex items-center gap-2 p-3 bg-gray-100 rounded' }, tip)
      )
    )
  );
}

/**
 * Example 6: Advanced Lenis Smooth Scrolling
 */
function LenisExample() {
  // Initialize with Lenis enabled
  initializeBrowserSupport({
    enableLenis: true,
    lenisOptions: {
      duration: 1.5,
      smoothWheel: true
    }
  });
  
  const lenis = getLenisInstance();
  const appState = state({
    scrollPosition: 0,
    scrollVelocity: 0
  });
  
  if (lenis) {
    lenis.on('scroll', (e: any) => {
      appState.scrollPosition = Math.round(e.scroll);
      appState.scrollVelocity = Math.round(e.velocity * 100) / 100;
    });
  }
  
  return createElement('div', { class: 'p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-8' },
    createElement('h2', { class: 'text-2xl font-bold mb-4' }, '🚀 Lenis Smooth Scrolling'),
    createElement('div', { class: 'p-4 bg-purple-100 rounded mb-4' },
      createElement('p', {}, `Scroll Position: ${appState.scrollPosition}px`),
      createElement('p', {}, `Scroll Velocity: ${appState.scrollVelocity}`)
    ),
    createElement('p', { class: 'text-gray-600' }, 
      lenis 
        ? '✅ Lenis is active - enjoy buttery smooth scrolling!' 
        : '❌ Lenis not initialized'
    )
  );
}

/**
 * Main App Component
 */
function App() {
  // Initialize browser support with verbose logging
  const capabilities = initializeBrowserSupport({ 
    verbose: true,
    enableSmoothScroll: true 
  });
  
  return createElement('div', { 
    class: 'min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12'
  },
    createElement('div', { class: 'container mx-auto px-4' },
      createElement('h1', { 
        class: 'text-4xl font-bold text-center mb-8 text-gray-800'
      }, '🌐 Rynex Browser Compatibility Examples'),
      
      createElement('div', { class: 'text-center mb-8 p-4 bg-green-100 rounded-lg' },
        createElement('p', { class: 'text-lg font-semibold text-green-800' },
          `✅ Running on ${capabilities.name} ${capabilities.version}`
        )
      ),
      
      BrowserDetectionExample(),
      BrowserSpecificExample(),
      SmoothScrollExample(),
      ViewportDetectionExample(),
      MobileResponsiveExample(),
      // Uncomment to test Lenis:
      // LenisExample()
    )
  );
}

// Mount the app
const root = document.getElementById('root');
if (root) {
  render(App, root);
}

export default App;
