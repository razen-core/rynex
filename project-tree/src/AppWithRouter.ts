/**
 * Rynex App with Router
 * Demonstrates routing, dynamic routes, and navigation
 */

import { state, createRouter, RouteContext } from '../../dist/runtime/index.js';
import * as UI from '../../dist/runtime/index.js';
import HomePage from './pages/home/page.js';
import AboutPage from './pages/about/page.js';

export default function AppWithRouter() {
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
      path: '/user/:id',
      lazy: () => import('./pages/user/[id]/page.js'),
      name: 'user'
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
        background: '#2c3e50',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }
    }, [
      UI.h2({
        style: { 
          color: 'white',
          margin: 0,
          fontSize: '1.5rem'
        }
      }, 'Rynex Router'),
      
      UI.hbox({
        style: { 
          gap: '1rem',
          flex: 1
        }
      }, [
        UI.link({
          href: '/',
          class: 'nav-link',
          style: {
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background 0.3s'
          }
        }, 'Home'),
        UI.link({
          href: '/about',
          class: 'nav-link',
          style: {
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px'
          }
        }, 'About'),
        UI.link({
          href: '/blog',
          class: 'nav-link',
          style: {
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px'
          }
        }, 'Blog'),
        UI.link({
          href: '/user/123',
          class: 'nav-link',
          style: {
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px'
          }
        }, 'User Demo')
      ])
    ]);
  };

  // Main app layout
  const app = UI.vbox({
    style: {
      minHeight: '100vh',
      background: '#ecf0f1'
    }
  }, [
    Navigation(),
    
    // Router outlet - where pages are rendered
    UI.RouterOutlet(router)
  ]);

  // Add active link styles
  const style = document.createElement('style');
  style.textContent = `
    .active {
      background: rgba(255, 255, 255, 0.2) !important;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);

  return app;
}
