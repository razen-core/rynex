/**
 * Rynex App with Router
 * Demonstrates routing, dynamic routes, and navigation
 */

import { state, createRouter, RouteContext } from '../../dist/runtime/index.js';
import * as UI from '../../dist/runtime/index.js';
import HomePage from './pages/home/page.js';
import AboutPage from './pages/about/page.js';

export default function App() {
  // Create router with routes
  const router = createRouter([
    {
      path: '/',
      component: (ctx: RouteContext) => HomePage(),
      name: 'home'
    },
    {
      path: '/about',
      component: (ctx: RouteContext) => AboutPage(),
      name: 'about'
    },
    {
      path: '/blog',
      lazy: () => import('./pages/blog/page.js'),
      name: 'blog'
    },
    {
      path: '/blog/:slug',
      lazy: () => import('./pages/blog/[slug]/page.js'),
      name: 'blog-post'
    }
  ]);

  // Add logging middleware
  router.use((ctx: RouteContext, next: () => void) => {
    console.log(`[Router] Navigating to: ${ctx.path}`);
    console.log(`[Router] Params:`, ctx.params);
    console.log(`[Router] Query:`, ctx.query);
    next();
  });

  // Set 404 handler
  router.setNotFound((ctx: RouteContext) => {
    return UI.NotFound({
      title: '404',
      message: `Page "${ctx.path}" not found`,
      homeLink: true
    });
  });

  // App state
  const appState = state({
    currentRoute: '/'
  });

  // Navigation component
  const Navigation = () => {
    return UI.nav({
      style: {
        padding: '1rem 2rem',
        background: '#0a0a0a',
        borderBottom: '1px solid #333333',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }
    }, [
      UI.h2({
        style: { 
          color: '#00ff88',
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: '800',
          fontFamily: '"Montserrat", sans-serif'
        }
      }, 'Rynex'),
      
      UI.hbox({
        style: { 
          gap: '1rem',
          flex: 1
        }
      }, [
        UI.NavLink({
          to: '/',
          activeClass: 'active',
          class: 'nav-link',
          style: {
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease-in-out'
          }
        }, 'Home'),
        UI.NavLink({
          to: '/about',
          activeClass: 'active',
          class: 'nav-link',
          style: {
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease-in-out'
          }
        }, 'About'),
        UI.NavLink({
          to: '/blog',
          activeClass: 'active',
          class: 'nav-link',
          style: {
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease-in-out'
          }
        }, 'Blog')
      ])
    ]);
  };

  // Main app layout
  const app = UI.vbox({
    style: {
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  }, [
    Navigation(),
    
    // Router outlet - where pages are rendered
    UI.RouterOutlet(router)
  ]);

  // Add active link styles
  const style = document.createElement('style');
  style.textContent = `
    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .nav-link.active {
      background: rgba(0, 255, 136, 0.2) !important;
      color: #00ff88 !important;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);

  return app;
}
