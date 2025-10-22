/**
 * Test runner for Rynex Error System
 * Run with: node test-error-system.js
 */

import { runAllTests } from './dist/runtime/error-system/test-error-system.js';

console.log('Starting Rynex Error System Tests...\n');

try {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error('\n\x1b[31mFatal error running tests:\x1b[0m', error);
  process.exit(1);
}
