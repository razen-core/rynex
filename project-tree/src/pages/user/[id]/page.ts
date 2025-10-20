import * as UI from '../../../../../dist/runtime/index.js';
import { RouteContext } from '../../../../../dist/runtime/index.js';

export default function UserPage(ctx: RouteContext) {
  const userId = ctx.params.id;
  
  return UI.vbox({
    style: { 
      padding: '2rem',
      gap: '1rem'
    }
  }, [
    UI.h1({}, `User Profile: ${userId}`),
    UI.text({}, `Viewing profile for user ID: ${userId}`),
    
    UI.hbox({
      style: { gap: '1rem', marginTop: '1rem' }
    }, [
      UI.button({
        onClick: () => window.history.back(),
        style: { padding: '0.5rem 1rem', cursor: 'pointer' }
      }, '← Back'),
      UI.link({ href: '/' }, 'Go Home')
    ])
  ]);
}
