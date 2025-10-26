import { render } from '../../../dist/runtime/index.js';
import App from './App.js';

const root = document.getElementById('app');
if (root) {
  render(App, root);
}
