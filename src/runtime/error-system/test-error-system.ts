/**
 * Rynex Error System - Test File
 * Quick tests to verify error system functionality
 */

import {
  RynexValidationError,
  RynexTypeError,
  createErrorContext,
  reportError,
  validateElement,
  validateType,
  validateNotNullOrUndefined,
  validateEnum,
  setMode,
  getErrorLog,
  clearErrorLog
} from './index.js';

/**
 * Test 1: Basic error creation
 */
export function testErrorCreation() {
  console.log('\n=== Test 1: Error Creation ===');
  
  try {
    const context = createErrorContext('testFunction', { param1: 'value' });
    const error = new RynexValidationError(
      'Test validation error',
      'testParam',
      'string',
      123,
      context
    );
    
    error.addSuggestion('This is a test suggestion', 'const x = "string";');
    
    console.log('✓ Error created successfully');
    console.log('  Code:', error.code);
    console.log('  Message:', error.message);
    console.log('  Suggestions:', error.suggestions.length);
    
    return true;
  } catch (e) {
    console.error('✗ Error creation failed:', e);
    return false;
  }
}

/**
 * Test 2: Type validation
 */
export function testTypeValidation() {
  console.log('\n=== Test 2: Type Validation ===');
  
  try {
    // This should pass
    validateType('hello', 'string', 'testFunction', 'param1');
    console.log('✓ String validation passed');
    
    validateType(123, 'number', 'testFunction', 'param2');
    console.log('✓ Number validation passed');
    
    validateType(true, 'boolean', 'testFunction', 'param3');
    console.log('✓ Boolean validation passed');
    
    // This should fail
    try {
      validateType(123, 'string', 'testFunction', 'param4');
      console.error('✗ Type validation should have failed');
      return false;
    } catch (e) {
      if (e instanceof RynexTypeError) {
        console.log('✓ Type validation correctly failed for wrong type');
        console.log('  Expected:', e.expectedType);
        console.log('  Received:', e.receivedType);
      }
    }
    
    return true;
  } catch (e) {
    console.error('✗ Type validation test failed:', e);
    return false;
  }
}

/**
 * Test 3: Element validation
 */
export function testElementValidation() {
  console.log('\n=== Test 3: Element Validation ===');
  
  try {
    // Test with null (should fail)
    try {
      validateElement(null, 'testFunction');
      console.error('✗ Element validation should have failed for null');
      return false;
    } catch (e) {
      if (e instanceof RynexTypeError) {
        console.log('✓ Element validation correctly failed for null');
      }
    }
    
    // Test with string (should fail)
    try {
      validateElement('not an element', 'testFunction');
      console.error('✗ Element validation should have failed for string');
      return false;
    } catch (e) {
      if (e instanceof RynexValidationError) {
        console.log('✓ Element validation correctly failed for string');
        console.log('  Suggestions:', e.suggestions.length);
      }
    }
    
    // Test with actual element (should pass)
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      validateElement(div, 'testFunction');
      console.log('✓ Element validation passed for HTMLElement');
    } else {
      console.log('⊘ Skipping HTMLElement test (no DOM available)');
    }
    
    return true;
  } catch (e) {
    console.error('✗ Element validation test failed:', e);
    return false;
  }
}

/**
 * Test 4: Enum validation
 */
export function testEnumValidation() {
  console.log('\n=== Test 4: Enum Validation ===');
  
  try {
    // Valid enum value
    validateEnum('in', ['in', 'out', 'toggle'], 'testFunction', 'direction');
    console.log('✓ Enum validation passed for valid value');
    
    // Invalid enum value
    try {
      validateEnum('invalid', ['in', 'out', 'toggle'], 'testFunction', 'direction');
      console.error('✗ Enum validation should have failed');
      return false;
    } catch (e) {
      if (e instanceof RynexTypeError) {
        console.log('✓ Enum validation correctly failed for invalid value');
        console.log('  Suggestions:', e.suggestions.length);
      }
    }
    
    return true;
  } catch (e) {
    console.error('✗ Enum validation test failed:', e);
    return false;
  }
}

/**
 * Test 5: Error reporting
 */
export function testErrorReporting() {
  console.log('\n=== Test 5: Error Reporting ===');
  
  try {
    // Enable development mode for full reporting
    setMode('development');
    
    // Clear previous errors
    clearErrorLog();
    
    // Create and report an error
    const context = createErrorContext('testFunction', { param: 'value' });
    const error = new RynexValidationError(
      'Test error for reporting',
      'testParam',
      'string',
      123,
      context
    );
    
    error.addSuggestion(
      'Use a string instead of a number',
      'const value = "hello";'
    );
    
    reportError(error);
    
    // Check if error was logged
    const log = getErrorLog();
    if (log.length > 0) {
      console.log('✓ Error was logged successfully');
      console.log('  Log entries:', log.length);
      console.log('  Error ID:', log[0].id);
    } else {
      console.error('✗ Error was not logged');
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('✗ Error reporting test failed:', e);
    return false;
  }
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  RYNEX ERROR SYSTEM - TEST SUITE                               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  const results = {
    errorCreation: testErrorCreation(),
    typeValidation: testTypeValidation(),
    elementValidation: testElementValidation(),
    enumValidation: testEnumValidation(),
    errorReporting: testErrorReporting()
  };
  
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  TEST RESULTS                                                  ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([name, passed]) => {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    const color = passed ? '\x1b[32m' : '\x1b[31m';
    console.log(`${color}${status}\x1b[0m ${name}`);
  });
  
  console.log(`\n${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n\x1b[32m✓ All tests passed!\x1b[0m\n');
  } else {
    console.log('\n\x1b[31m✗ Some tests failed\x1b[0m\n');
  }
  
  return passed === total;
}

// Auto-run tests if executed directly
if (typeof window === 'undefined') {
  runAllTests();
}
