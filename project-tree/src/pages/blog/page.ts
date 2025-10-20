import * as UI from '../../../../dist/runtime/index.js';
import { RouteContext } from '../../../../dist/runtime/index.js';

export default function BlogPage(ctx: RouteContext) {
  const posts = [
    { slug: 'getting-started', title: 'Getting Started with ZenWeb' },
    { slug: 'routing-guide', title: 'Complete Routing Guide' },
    { slug: 'state-management', title: 'State Management Best Practices' }
  ];
  
  return UI.vbox({
    style: { 
      padding: '2rem',
      gap: '1.5rem'
    }
  }, [
    UI.h1({}, 'Blog'),
    UI.text({}, 'Read our latest articles'),
    
    UI.vbox({
      style: { 
        gap: '1rem',
        marginTop: '1rem'
      }
    }, posts.map(post => 
      UI.card({
        style: {
          padding: '1.5rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }
      }, [
        UI.h3({}, post.title),
        UI.link(
          { 
            href: `/blog/${post.slug}`,
            style: { 
              color: '#3498db',
              textDecoration: 'none',
              marginTop: '0.5rem',
              display: 'inline-block'
            }
          },
          'Read more →'
        )
      ])
    ))
  ]);
}
