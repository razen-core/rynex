import * as UI from '../../../dist/runtime/index.js';

export default function Header() {
  return UI.header({
    style: { padding: '1rem', background: '#667eea', color: 'white' }
  }, [
    UI.h1({}, 'Header')
  ]);
}
