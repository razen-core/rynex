import * as UI from 'rynex';

export default function AboutPage() {
  return UI.vbox({
    style: {
      padding: '3rem 2rem',
      maxWidth: '900px',
      margin: '0 auto',
      gap: '2.5rem'
    }
  }, [
    // Header
    UI.vbox({
      style: {
        gap: '1rem'
      }
    }, [
      UI.h1({
        style: {
          fontSize: '2.5rem',
          fontWeight: '800',
          color: '#00ff88',
          margin: 0,
          fontFamily: '"Montserrat", sans-serif'
        }
      }, 'About Rynex'),
      
      UI.text({
        style: {
          fontSize: '1.125rem',
          color: '#b0b0b0',
          lineHeight: '1.8'
        }
      }, 'A minimalist TypeScript framework for building reactive web applications with no Virtual DOM.')
    ]),

    // Mission
    UI.vbox({
      style: {
        padding: '2rem',
        background: '#0a0a0a',
        border: '1px solid #333333',
        borderRadius: '0.5rem',
        gap: '1rem'
      }
    }, [
      UI.h2({
        style: {
          fontSize: '1.5rem',
          color: '#ffffff',
          margin: 0,
          fontFamily: '"Montserrat", sans-serif'
        }
      }, 'Our Mission'),
      UI.text({
        style: {
          fontSize: '1rem',
          color: '#b0b0b0',
          lineHeight: '1.8'
        }
      }, 'Rynex aims to provide developers with a powerful yet simple framework that prioritizes performance and developer experience. We believe in direct DOM manipulation, reactive state management, and minimal abstraction.')
    ]),

    // Features
    UI.vbox({
      style: {
        gap: '1.5rem'
      }
    }, [
      UI.h2({
        style: {
          fontSize: '1.75rem',
          color: '#ffffff',
          margin: 0,
          fontFamily: '"Montserrat", sans-serif'
        }
      }, 'Core Features'),

      UI.vbox({
        style: {
          gap: '1rem'
        }
      }, [
        // Feature 1
        UI.vbox({
          style: {
            padding: '1.5rem',
            background: '#0a0a0a',
            border: '1px solid #333333',
            borderRadius: '0.5rem',
            gap: '0.5rem'
          }
        }, [
          UI.h3({
            style: {
              fontSize: '1.25rem',
              color: '#00ff88',
              margin: 0,
              fontFamily: '"Montserrat", sans-serif'
            }
          }, 'No Virtual DOM'),
          UI.text({
            style: {
              color: '#b0b0b0',
              lineHeight: '1.6'
            }
          }, 'Direct DOM manipulation for maximum performance. No diffing algorithms, no reconciliation overhead.')
        ]),

        // Feature 2
        UI.vbox({
          style: {
            padding: '1.5rem',
            background: '#0a0a0a',
            border: '1px solid #333333',
            borderRadius: '0.5rem',
            gap: '0.5rem'
          }
        }, [
          UI.h3({
            style: {
              fontSize: '1.25rem',
              color: '#00ff88',
              margin: 0,
              fontFamily: '"Montserrat", sans-serif'
            }
          }, 'Reactive State'),
          UI.text({
            style: {
              color: '#b0b0b0',
              lineHeight: '1.6'
            }
          }, 'Proxy-based reactivity with automatic UI updates. Write reactive code naturally without hooks or subscriptions.')
        ]),

        // Feature 3
        UI.vbox({
          style: {
            padding: '1.5rem',
            background: '#0a0a0a',
            border: '1px solid #333333',
            borderRadius: '0.5rem',
            gap: '0.5rem'
          }
        }, [
          UI.h3({
            style: {
              fontSize: '1.25rem',
              color: '#00ff88',
              margin: 0,
              fontFamily: '"Montserrat", sans-serif'
            }
          }, 'TypeScript First'),
          UI.text({
            style: {
              color: '#b0b0b0',
              lineHeight: '1.6'
            }
          }, 'Full type safety out of the box. Comprehensive type definitions for better IDE support and fewer runtime errors.')
        ]),

        // Feature 4
        UI.vbox({
          style: {
            padding: '1.5rem',
            background: '#0a0a0a',
            border: '1px solid #333333',
            borderRadius: '0.5rem',
            gap: '0.5rem'
          }
        }, [
          UI.h3({
            style: {
              fontSize: '1.25rem',
              color: '#00ff88',
              margin: 0,
              fontFamily: '"Montserrat", sans-serif'
            }
          }, 'File-Based Routing'),
          UI.text({
            style: {
              color: '#b0b0b0',
              lineHeight: '1.6'
            }
          }, 'Next.js style routing with dynamic routes, lazy loading, and middleware support. Build complex applications with ease.')
        ])
      ])
    ]),

    // Stats
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
          minWidth: '200px',
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '0.5rem',
          textAlign: 'center',
          gap: '0.5rem'
        }
      }, [
        UI.text({
          style: {
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#00ff88',
            fontFamily: '"Montserrat", sans-serif'
          }
        }, '150+'),
        UI.text({
          style: {
            color: '#b0b0b0'
          }
        }, 'Functions')
      ]),

      UI.vbox({
        style: {
          flex: '1',
          minWidth: '200px',
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '0.5rem',
          textAlign: 'center',
          gap: '0.5rem'
        }
      }, [
        UI.text({
          style: {
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#00ff88',
            fontFamily: '"Montserrat", sans-serif'
          }
        }, '15KB'),
        UI.text({
          style: {
            color: '#b0b0b0'
          }
        }, 'Gzipped')
      ]),

      UI.vbox({
        style: {
          flex: '1',
          minWidth: '200px',
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '0.5rem',
          textAlign: 'center',
          gap: '0.5rem'
        }
      }, [
        UI.text({
          style: {
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#00ff88',
            fontFamily: '"Montserrat", sans-serif'
          }
        }, '88%'),
        UI.text({
          style: {
            color: '#b0b0b0'
          }
        }, 'Complete')
      ])
    ])
  ]);
}
