import * as UI from '../../../dist/runtime/index.js';

export default function Sidebar() {
  return UI.vbox({
    style: { padding: '1rem', background: '#f5f5f5' }
  }, [
    UI.text({}, 'Sidebar')
  ]);
}
