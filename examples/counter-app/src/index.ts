import { render } from '../../../dist/runtime/index.js';
import App from './App.js';

const root = document.getElementById('root');
if (root) {
  render(App, root);
}
