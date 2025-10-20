import * as UI from '../../../../dist/runtime/index.js';

export default function AboutPage() {
  return UI.vbox({
    style: { padding: '2rem' }
  }, [
    UI.h1({}, 'About Page'),
    UI.text({}, 'This is the about page.')
  ]);
}
