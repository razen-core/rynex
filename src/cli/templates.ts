/**
 * Rynex Project Templates
 * Template generators for different project types
 */

export interface TemplateConfig {
  projectName: string;
  useTypeScript: boolean;
  template: 'empty' | 'minimal' | 'routed';
}

const ext = (config: TemplateConfig) => config.useTypeScript ? 'ts' : 'js';

/**
 * Package.json template
 */
export const packageJson = (config: TemplateConfig) => `{
  "name": "${config.projectName}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "rynex dev",
    "build": "rynex build"
  },
  "dependencies": {
    "rynex": "^0.1.3"
  }${config.useTypeScript ? `,
  "devDependencies": {
    "typescript": "^5.3.0"
  }` : ''}
}`;

/**
 * Rynex config
 */
export const rynexConfig = (config: TemplateConfig) => `export default {
  entry: 'src/index.${ext(config)}',
  output: 'public/bundle.js',
  minify: false,
  sourceMaps: true,
  port: 3000,
  hotReload: true
};`;

/**
 * TypeScript config
 */
export const tsConfig = () => `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "public"]
}`;

/**
 * README template
 */
export const readme = (config: TemplateConfig) => `# ${config.projectName}

A Rynex application${config.template !== 'empty' ? ` built with the ${config.template} template` : ''}.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
${config.projectName}/
├── src/
│   ├── index.${ext(config)}           # Entry point
│   ├── App.${ext(config)}             # Root component${config.template === 'routed' ? `
│   ├── components/        # Reusable components
│   └── pages/            # Route pages` : ''}
├── public/
│   ├── index.html        # HTML shell
│   └── styles.css        # Global styles
└── rynex.config.js      # Configuration
\`\`\`

## Learn More

Visit [Rynex Documentation](https://github.com/razen-core/rynex) to learn more.
`;

/**
 * HTML template
 */
export const html = (config: TemplateConfig) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.projectName}</title>
  ${config.template !== 'empty' ? `
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ` : ''}
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="bundle.js"></script>
</body>
</html>`;

/**
 * CSS template
 */
export const css = (config: TemplateConfig) => {
  if (config.template === 'empty') {
    return `/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}`;
  }
  
  return `/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #000000;
  color: #ffffff;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
}

#root {
  min-height: 100vh;
}

/* Navigation styles */
.nav-link {
  transition: all 0.2s ease-in-out;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88 !important;
  font-weight: 600;
}`;
};

/**
 * Entry point template
 */
export const indexFile = (config: TemplateConfig) => `import { render } from 'rynex';
import App from './App.${ext(config) === 'ts' ? 'js' : ext(config)}';

const root = document.getElementById('root');
if (root) {
  render(App, root);
}`;

/**
 * Empty App template
 */
export const emptyApp = (config: TemplateConfig) => `import { div, text } from 'rynex';

export default function App() {
  return div({
    style: {
      padding: '2rem',
      textAlign: 'center'
    }
  }, [
    text('Hello, Rynex!')
  ]);
}`;

/**
 * Minimal App template (single page with styling)
 */
export const minimalApp = (config: TemplateConfig) => `import { state, vbox, hbox, container, h1, text, button, svg } from 'rynex';

export default function App() {
  const appState = state({
    count: 0
  });

  return vbox({
    style: {
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '2rem'
    }
  }, [
    // Logo Badge
    container({
      style: {
        padding: '0.5rem 1.25rem',
        background: '#0a0a0a',
        border: '1px solid #333333',
        borderRadius: '9999px',
        boxShadow: '0 4px 6px -1px rgba(0, 255, 136, 0.1)'
      }
    }, [
      text({
        style: {
          fontSize: '0.875rem',
          color: '#00ff88',
          fontWeight: '600',
          letterSpacing: '0.05em'
        }
      }, 'Rynex')
    ]),

    // Title
    h1({
      style: {
        fontSize: '3rem',
        fontWeight: '800',
        margin: '0',
        background: 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)',
        webkitBackgroundClip: 'text',
        webkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }
    }, 'Welcome to Rynex'),

    // Counter
    vbox({
      style: {
        gap: '1rem',
        alignItems: 'center',
        padding: '2rem',
        background: '#0a0a0a',
        border: '1px solid #333333',
        borderRadius: '1rem',
        minWidth: '300px'
      }
    }, [
      text({
        style: {
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#00ff88'
        }
      }, () => \`\${appState.count}\`),
      
      hbox({
        style: { gap: '1rem' }
      }, [
        button({
          onClick: () => appState.count--,
          style: {
            padding: '0.75rem 1.5rem',
            background: '#333333',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          },
          onHover: {
            background: '#444444'
          }
        }, '-'),
        
        button({
          onClick: () => appState.count++,
          style: {
            padding: '0.75rem 1.5rem',
            background: '#00ff88',
            color: '#000000',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          },
          onHover: {
            background: '#00cc6a'
          }
        }, '+')
      ])
    ]),

    // Footer
    text({
      style: {
        fontSize: '0.875rem',
        color: '#666666',
        marginTop: '2rem'
      }
    }, 'Edit src/App.${ext(config)} to get started')
  ]);
}`;

/**
 * Routed App template
 */
export const routedApp = (config: TemplateConfig) => `import { state, createRouter, vbox, nav, hbox, h2, NavLink, RouterOutlet, NotFound } from 'rynex';
import HomePage from './pages/home/page.${ext(config) === 'ts' ? 'js' : ext(config)}';
import AboutPage from './pages/about/page.${ext(config) === 'ts' ? 'js' : ext(config)}';
import BlogPage from './pages/blog/page.${ext(config) === 'ts' ? 'js' : ext(config)}';

export default function App() {
  // Create router
  const router = createRouter([
    {
      path: '/',
      component: () => HomePage(),
      name: 'home'
    },
    {
      path: '/about',
      component: () => AboutPage(),
      name: 'about'
    },
    {
      path: '/blog',
      component: () => BlogPage(),
      name: 'blog'
    }
  ]);

  // 404 handler
  router.setNotFound((ctx) => {
    return NotFound({
      title: '404',
      message: \`Page "\${ctx.path}" not found\`,
      homeLink: true
    });
  });

  // Navigation component
  const Navigation = () => {
    return nav({
      style: {
        padding: '1rem 2rem',
        background: '#0a0a0a',
        borderBottom: '1px solid #333333',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }
    }, [
      h2({
        style: {
          color: '#00ff88',
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: '800'
        }
      }, 'Rynex'),

      hbox({
        style: {
          gap: '1rem',
          flex: 1
        }
      }, [
        NavLink({
          href: '/',
          activeClass: 'active',
          class: 'nav-link',
          style: {
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem'
          }
        }, 'Home'),
        
        NavLink({
          href: '/about',
          activeClass: 'active',
          class: 'nav-link',
          style: {
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem'
          }
        }, 'About'),
        
        NavLink({
          href: '/blog',
          activeClass: 'active',
          class: 'nav-link',
          style: {
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem'
          }
        }, 'Blog')
      ])
    ]);
  };

  // Main layout
  return vbox({
    style: {
      minHeight: '100vh',
      background: '#000000'
    }
  }, [
    Navigation(),
    RouterOutlet(router)
  ]);
}`;

/**
 * Home page template
 */
export const homePage = (config: TemplateConfig) => `import { vbox, h1, text, hbox, button } from 'rynex';

export default function HomePage() {
  return vbox({
    style: {
      padding: '3rem 2rem',
      maxWidth: '800px',
      margin: '0 auto',
      gap: '2rem'
    }
  }, [
    vbox({
      style: {
        textAlign: 'center',
        gap: '1rem'
      }
    }, [
      h1({
        style: {
          fontSize: '3rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)',
          webkitBackgroundClip: 'text',
          webkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }
      }, 'Welcome Home'),
      
      text({
        style: {
          fontSize: '1.25rem',
          color: '#b0b0b0',
          lineHeight: '1.6'
        }
      }, 'A modern, reactive web framework with elegant syntax and powerful features.')
    ]),

    hbox({
      style: {
        gap: '1rem',
        justifyContent: 'center',
        marginTop: '2rem'
      }
    }, [
      button({
        onClick: () => window.open('https://github.com/razen-core/rynex', '_blank'),
        style: {
          padding: '0.875rem 2rem',
          background: '#00ff88',
          color: '#000000',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer'
        }
      }, 'Get Started'),
      
      button({
        onClick: () => window.location.href = '/about',
        style: {
          padding: '0.875rem 2rem',
          background: '#333333',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          cursor: 'pointer'
        }
      }, 'Learn More')
    ])
  ]);
}`;

/**
 * About page template
 */
export const aboutPage = (config: TemplateConfig) => `import { vbox, h1, h2, text } from 'rynex';

export default function AboutPage() {
  return vbox({
    style: {
      padding: '3rem 2rem',
      maxWidth: '800px',
      margin: '0 auto',
      gap: '2rem'
    }
  }, [
    h1({
      style: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#00ff88',
        margin: 0
      }
    }, 'About Rynex'),

    vbox({
      style: { gap: '1rem' }
    }, [
      text({
        style: {
          fontSize: '1.125rem',
          color: '#b0b0b0',
          lineHeight: '1.8'
        }
      }, 'Rynex is a minimalist TypeScript framework for building reactive web applications with no Virtual DOM.'),
      
      text({
        style: {
          fontSize: '1.125rem',
          color: '#b0b0b0',
          lineHeight: '1.8'
        }
      }, 'Built with modern web standards, Rynex provides a clean and intuitive API for creating fast, reactive user interfaces.')
    ]),

    vbox({
      style: {
        gap: '1.5rem',
        marginTop: '2rem'
      }
    }, [
      vbox({
        style: {
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '0.5rem',
          gap: '0.5rem'
        }
      }, [
        h2({
          style: {
            fontSize: '1.25rem',
            color: '#00ff88',
            margin: 0
          }
        }, 'No Virtual DOM'),
        text({
          style: {
            color: '#b0b0b0'
          }
        }, 'Direct DOM manipulation for maximum performance')
      ]),

      vbox({
        style: {
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '0.5rem',
          gap: '0.5rem'
        }
      }, [
        h2({
          style: {
            fontSize: '1.25rem',
            color: '#00ff88',
            margin: 0
          }
        }, 'Reactive State'),
        text({
          style: {
            color: '#b0b0b0'
          }
        }, 'Proxy-based reactivity with automatic UI updates')
      ]),

      vbox({
        style: {
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '0.5rem',
          gap: '0.5rem'
        }
      }, [
        h2({
          style: {
            fontSize: '1.25rem',
            color: '#00ff88',
            margin: 0
          }
        }, 'TypeScript First'),
        text({
          style: {
            color: '#b0b0b0'
          }
        }, 'Full type safety out of the box')
      ])
    ])
  ]);
}`;

/**
 * Blog page template
 */
export const blogPage = (config: TemplateConfig) => `import { state, vbox, h1, h2, text, hbox } from 'rynex';

export default function BlogPage() {
  const blogState = state({
    posts: [
      {
        id: 1,
        title: 'Getting Started with Rynex',
        excerpt: 'Learn how to build your first Rynex application',
        date: '2024-10-21'
      },
      {
        id: 2,
        title: 'Understanding Reactive State',
        excerpt: 'Deep dive into Rynex reactive state management',
        date: '2024-10-20'
      },
      {
        id: 3,
        title: 'Building with Components',
        excerpt: 'Best practices for component architecture',
        date: '2024-10-19'
      }
    ]
  });

  return vbox({
    style: {
      padding: '3rem 2rem',
      maxWidth: '800px',
      margin: '0 auto',
      gap: '2rem'
    }
  }, [
    h1({
      style: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#00ff88',
        margin: 0
      }
    }, 'Blog'),

    vbox({
      style: { gap: '1.5rem' }
    }, blogState.posts.map(post => 
      vbox({
        style: {
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '0.5rem',
          gap: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s'
        },
        onHover: {
          borderColor: '#00ff88',
          transform: 'translateY(-2px)'
        }
      }, [
        h2({
          style: {
            fontSize: '1.5rem',
            color: '#ffffff',
            margin: 0
          }
        }, post.title),
        
        text({
          style: {
            color: '#b0b0b0',
            lineHeight: '1.6'
          }
        }, post.excerpt),
        
        text({
          style: {
            fontSize: '0.875rem',
            color: '#666666'
          }
        }, post.date)
      ])
    ))
  ]);
}`;
