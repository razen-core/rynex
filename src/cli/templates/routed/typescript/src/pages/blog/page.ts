import * as UI from 'rynex';
import { state, Link } from 'rynex';

export default function BlogPage() {
  const blogState = state({
    posts: [
      {
        id: 1,
        slug: 'getting-started',
        title: 'Getting Started with Rynex',
        excerpt: 'Learn how to build your first Rynex application from scratch with this comprehensive guide.',
        date: '2024-10-21',
        category: 'Tutorial'
      },
      {
        id: 2,
        slug: 'reactive-state',
        title: 'Understanding Reactive State',
        excerpt: 'Deep dive into Rynex reactive state management and how it compares to other frameworks.',
        date: '2024-10-20',
        category: 'Guide'
      },
      {
        id: 3,
        slug: 'routing-guide',
        title: 'Complete Routing Guide',
        excerpt: 'Master file-based routing, dynamic routes, and navigation in Rynex applications.',
        date: '2024-10-19',
        category: 'Tutorial'
      },
      {
        id: 4,
        slug: 'performance-tips',
        title: 'Performance Optimization Tips',
        excerpt: 'Best practices for building high-performance applications with Rynex framework.',
        date: '2024-10-18',
        category: 'Performance'
      }
    ]
  });

  return UI.vbox({
    style: {
      padding: '3rem 2rem',
      maxWidth: '1000px',
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
      }, 'Blog'),
      
      UI.text({
        style: {
          fontSize: '1.125rem',
          color: '#b0b0b0',
          lineHeight: '1.6'
        }
      }, 'Latest articles, tutorials, and updates from the Rynex team.')
    ]),

    // Blog Posts
    UI.vbox({
      style: {
        gap: '1.5rem'
      }
    }, blogState.posts.map(post => 
      Link({
        to: `/blog/${post.slug}`,
        style: {
          textDecoration: 'none',
          display: 'block'
        }
      }, UI.vbox({
        style: {
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '0.5rem',
          gap: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out'
        },
        onHover: {
          borderColor: '#00ff88',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 255, 136, 0.1)'
        }
      }, [
        // Category badge
        UI.container({
          style: {
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '9999px',
            width: 'fit-content'
          }
        }, [
          UI.text({
            style: {
              fontSize: '0.75rem',
              color: '#00ff88',
              fontWeight: '600',
              letterSpacing: '0.05em'
            }
          }, post.category.toUpperCase())
        ]),

        // Title
        UI.h2({
          style: {
            fontSize: '1.5rem',
            color: '#ffffff',
            margin: 0,
            fontFamily: '"Montserrat", sans-serif'
          }
        }, post.title),
        
        // Excerpt
        UI.text({
          style: {
            color: '#b0b0b0',
            lineHeight: '1.6',
            fontSize: '0.95rem'
          }
        }, post.excerpt),
        
        // Footer
        UI.hbox({
          style: {
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem'
          }
        }, [
          UI.text({
            style: {
              fontSize: '0.875rem',
              color: '#666666'
            }
          }, post.date),
          
          UI.text({
            style: {
              fontSize: '0.875rem',
              color: '#00ff88',
              fontWeight: '600'
            }
          }, 'Read more →')
        ])
      ]))
    ))
  ]);
}
