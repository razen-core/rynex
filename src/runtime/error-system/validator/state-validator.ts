/**
 * Rynex Error System - State Validator
 * Validates state objects and operations
 */

import { RynexStateError, createErrorContext } from '../errors.js';

/**
 * Validate state object
 */
export function validateState(
  state: any,
  functionName: string
): void {
  if (typeof state !== 'object' || state === null) {
    const context = createErrorContext(functionName, { state });
    const error = new RynexStateError(
      `State must be an object in ${functionName}()`,
      context
    );
    error.addSuggestion(
      'Provide an object as state',
      `const myState = state({ count: 0, name: 'example' });`
    );
    throw error;
  }

  // Check for circular references
  try {
    JSON.stringify(state);
  } catch (e) {
    const context = createErrorContext(functionName, { state });
    const error = new RynexStateError(
      `State contains circular references in ${functionName}()`,
      context
    );
    error.addSuggestion(
      'Remove circular references from the state object'
    );
    throw error;
  }
}

/**
 * Validate store name
 */
export function validateStoreName(
  name: any,
  functionName: string
): void {
  if (typeof name !== 'string' || name.trim().length === 0) {
    const context = createErrorContext(functionName, { name });
    const error = new RynexStateError(
      `Store name must be a non-empty string in ${functionName}()`,
      context
    );
    error.addSuggestion(
      'Provide a unique name for the store',
      `${functionName}('myStore', ...)`
    );
    throw error;
  }

  // Check for invalid characters
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    const context = createErrorContext(functionName, { name });
    const error = new RynexStateError(
      `Store name "${name}" contains invalid characters in ${functionName}()`,
      context,
      name
    );
    error.addSuggestion(
      'Use only letters, numbers, underscores, and dollar signs. Must start with a letter, underscore, or dollar sign.',
      `${functionName}('myStore', ...)  // Valid\n${functionName}('my_store', ...)  // Valid\n${functionName}('123store', ...)  // Invalid`
    );
    throw error;
  }
}

/**
 * Validate context object
 */
export function validateContext(
  context: any,
  functionName: string
): void {
  if (!context || typeof context !== 'object') {
    const ctx = createErrorContext(functionName, { context });
    const error = new RynexStateError(
      `Invalid context object in ${functionName}()`,
      ctx
    );
    error.addSuggestion(
      'Create a context using createContext()',
      `const MyContext = createContext(defaultValue);\nuseContext(MyContext);`
    );
    throw error;
  }

  if (!context.Provider) {
    const ctx = createErrorContext(functionName, { context });
    const error = new RynexStateError(
      `Context object is missing Provider in ${functionName}()`,
      ctx
    );
    error.addSuggestion(
      'Make sure you\'re using a context created with createContext()',
      `const MyContext = createContext(defaultValue);`
    );
    throw error;
  }
}
