import { render } from '../../dist/runtime/index.js';
import { TestErrorCases } from './test-errors.js';

// Render app with router
render(TestErrorCases, document.getElementById('root')!);
