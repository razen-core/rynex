import * as UI from '../../../../../dist/runtime/index.js';
import { RouteContext } from '../../../../../dist/runtime/index.js';

export default function BlogPostPage(ctx: RouteContext) {
  const slug = ctx.params.slug;
  
  return UI.vbox({
    style: { 
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }
  }, [
    UI.text({ style: { color: '#666' } }, 'Home > Blog > Post'),
    
    UI.h1({ style: { marginTop: '2rem' } }, `Blog Post: ${slug}`),
    
    UI.text({
      style: { 
        color: '#666',
        marginTop: '0.5rem'
      }
    }, 'Published on October 20, 2025'),
    
    UI.vbox({
      style: { 
        marginTop: '2rem',
        gap: '1rem'
      }
    }, [
      UI.p({}, `This is the blog post content for "${slug}".`),
      UI.p({}, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
      UI.p({}, 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    ]),
    
    UI.hbox({
      style: { 
        gap: '1rem',
        marginTop: '2rem'
      }
    }, [
      UI.button({
        onClick: () => window.history.back(),
        style: { padding: '0.5rem 1rem', cursor: 'pointer' }
      }, '← Back'),
      UI.link({ href: '/blog' }, 'All Posts')
    ])
  ]);
}
