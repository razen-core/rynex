import * as UI from 'rynex';

export default function HomePage() {
  return UI.vbox({
    style: {
      padding: '3rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      gap: '3rem'
    }
  }, [
    // Hero Section
    UI.vbox({
      style: {
        textAlign: 'center',
        gap: '1.5rem',
        padding: '2rem 0'
      }
    }, [
      UI.container({
        style: {
          display: 'inline-block',
          padding: '0.5rem 1.25rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '9999px',
          marginBottom: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 255, 136, 0.1)'
        }
      }, [
        UI.text({
          style: {
            fontSize: '0.875rem',
            color: '#00ff88',
            fontWeight: '600',
            letterSpacing: '0.05em'
          }
        }, 'RYNEX FRAMEWORK')
      ]),

      UI.h1({
        style: {
          fontSize: '4rem',
          fontWeight: '800',
          lineHeight: '1.1',
          margin: '0',
          fontFamily: '"Montserrat", sans-serif',
          background: 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)',
          webkitBackgroundClip: 'text',
          webkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }
      }, 'Build Modern Web Apps'),

      UI.text({
        style: {
          fontSize: '1.25rem',
          color: '#b0b0b0',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto'
        }
      }, 'A minimalist TypeScript framework with reactive state, routing, and no virtual DOM overhead.'),

      UI.hbox({
        style: {
          gap: '1rem',
          justifyContent: 'center',
          marginTop: '1rem'
        }
      }, [
        UI.button({
          onClick: () => window.open('https://github.com/razen-core/rynex', '_blank'),
          style: {
            padding: '0.875rem 2rem',
            background: '#00ff88',
            color: '#000000',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 4px 6px -1px rgba(0, 255, 136, 0.1)'
          },
          onHover: {
            transform: 'translateY(-2px)',
            background: '#00cc6a'
          }
        }, 'Get Started'),

        UI.button({
          onClick: () => window.location.href = '/about',
          style: {
            padding: '0.875rem 2rem',
            background: '#0a0a0a',
            color: '#ffffff',
            border: '1px solid #333333',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          },
          onHover: {
            transform: 'translateY(-2px)',
            borderColor: '#00ff88'
          }
        }, 'Learn More')
      ])
    ]),

    // Features Grid
    UI.vbox({
      style: {
        gap: '1.5rem'
      }
    }, [
      UI.text({
        style: {
          fontSize: '1.5rem',
          fontWeight: '700',
          textAlign: 'center',
          fontFamily: '"Montserrat", sans-serif'
        }
      }, 'Why Choose Rynex?'),

      UI.hbox({
        style: {
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }
      }, [
        UI.vbox({
          style: {
            flex: '1',
            minWidth: '280px',
            padding: '1.5rem',
            background: '#0a0a0a',
            border: '1px solid #333333',
            borderRadius: '0.5rem',
            gap: '0.75rem',
            boxShadow: '0 1px 2px rgba(0, 255, 136, 0.1)',
            transition: 'all 0.2s ease-in-out'
          },
          onHover: {
            borderColor: '#00ff88',
            transform: 'translateY(-4px)'
          }
        }, [
          UI.svg({
            viewBox: '0 0 24 24',
            width: '48',
            height: '48',
            fill: '#00ff88',
            style: { display: 'block' }
          }, '<path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>') as any,
          UI.text({
            style: {
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#00ff88'
            }
          }, 'Reactive by Default'),
          UI.text({
            style: {
              fontSize: '0.875rem',
              color: '#b0b0b0',
              lineHeight: '1.5'
            }
          }, 'Proxy-based reactivity with automatic UI updates. No manual subscriptions needed.')
        ]),

        UI.vbox({
          style: {
            flex: '1',
            minWidth: '280px',
            padding: '1.5rem',
            background: '#0a0a0a',
            border: '1px solid #333333',
            borderRadius: '0.5rem',
            gap: '0.75rem',
            boxShadow: '0 1px 2px rgba(0, 255, 136, 0.1)',
            transition: 'all 0.2s ease-in-out'
          },
          onHover: {
            borderColor: '#00ff88',
            transform: 'translateY(-4px)'
          }
        }, [
          UI.svg({
            viewBox: '0 0 24 24',
            width: '48',
            height: '48',
            fill: '#00ff88',
            style: { display: 'block' }
          }, '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>') as any,
          UI.text({
            style: {
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#00ff88'
            }
          }, 'TypeScript First'),
          UI.text({
            style: {
              fontSize: '0.875rem',
              color: '#b0b0b0',
              lineHeight: '1.5'
            }
          }, 'Full type safety out of the box with comprehensive TypeScript support.')
        ]),

        UI.vbox({
          style: {
            flex: '1',
            minWidth: '280px',
            padding: '1.5rem',
            background: '#0a0a0a',
            border: '1px solid #333333',
            borderRadius: '0.5rem',
            gap: '0.75rem',
            boxShadow: '0 1px 2px rgba(0, 255, 136, 0.1)',
            transition: 'all 0.2s ease-in-out'
          },
          onHover: {
            borderColor: '#00ff88',
            transform: 'translateY(-4px)'
          }
        }, [
          UI.svg({
            viewBox: '0 0 24 24',
            width: '48',
            height: '48',
            fill: '#00ff88',
            style: { display: 'block' }
          }, '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>') as any,
          UI.text({
            style: {
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#00ff88'
            }
          }, 'File-Based Routing'),
          UI.text({
            style: {
              fontSize: '0.875rem',
              color: '#b0b0b0',
              lineHeight: '1.5'
            }
          }, 'Next.js style routing with dynamic routes and lazy loading support.')
        ])
      ])
    ])
  ]);
}
