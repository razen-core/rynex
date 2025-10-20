import * as UI from '../../../../dist/runtime/index.js';

export default function HomePage() {
  return UI.vbox({
    style: { padding: '2rem' }
  }, [
    UI.h1({}, 'Home Page'),
    UI.text({}, 'Welcome to the home page!')
  ]);
}
