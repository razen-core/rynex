/**
 * Rynex Error System - Props Validator
 * Validates component props and configuration objects
 */

import { RynexValidationError, createErrorContext } from '../errors.js';
import { ValidationSchema, ValidationResult } from '../types.js';
import { getType, validateType, validateEnum, validateNumber } from './type-validator.js';

/**
 * Validate props against a schema
 */
export function validateProps(
  props: any,
  schema: ValidationSchema,
  functionName: string
): ValidationResult {
  const errors: any[] = [];
  const warnings: string[] = [];

  // Check if props is an object
  if (typeof props !== 'object' || props === null) {
    const context = createErrorContext(functionName, { props });
    throw new RynexValidationError(
      `Props must be an object in ${functionName}()`,
      'props',
      'object',
      props,
      context
    );
  }

  // Validate each field in schema
  for (const [field, rules] of Object.entries(schema)) {
    const value = props[field];

    // Check required fields
    if (rules.required && (value === undefined || value === null)) {
      errors.push({
        field,
        expected: rules.type,
        received: value,
        message: `Required field "${field}" is missing`
      });
      continue;
    }

    // Skip validation if field is optional and not provided
    if (!rules.required && (value === undefined || value === null)) {
      continue;
    }

    // Validate type
    const expectedTypes = Array.isArray(rules.type) ? rules.type : [rules.type];
    const actualType = getType(value);
    const typeMatches = expectedTypes.some(type => {
      if (type === 'any') return true;
      if (type === actualType) return true;
      if (type === 'number' && typeof value === 'number') return true;
      if (type === 'string' && typeof value === 'string') return true;
      if (type === 'boolean' && typeof value === 'boolean') return true;
      if (type === 'function' && typeof value === 'function') return true;
      if (type === 'array' && Array.isArray(value)) return true;
      if (type === 'object' && typeof value === 'object' && !Array.isArray(value)) return true;
      return false;
    });

    if (!typeMatches) {
      errors.push({
        field,
        expected: expectedTypes.join(' | '),
        received: actualType,
        message: rules.message || `Invalid type for field "${field}"`
      });
      continue;
    }

    // Validate min/max for numbers
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push({
          field,
          expected: `>= ${rules.min}`,
          received: value,
          message: `Field "${field}" must be >= ${rules.min}`
        });
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push({
          field,
          expected: `<= ${rules.max}`,
          received: value,
          message: `Field "${field}" must be <= ${rules.max}`
        });
      }
    }

    // Validate enum values
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push({
        field,
        expected: rules.enum.join(' | '),
        received: value,
        message: `Field "${field}" must be one of: ${rules.enum.join(', ')}`
      });
    }

    // Validate pattern for strings
    if (typeof value === 'string' && rules.pattern && !rules.pattern.test(value)) {
      errors.push({
        field,
        expected: `pattern: ${rules.pattern}`,
        received: value,
        message: `Field "${field}" does not match required pattern`
      });
    }

    // Custom validation
    if (rules.custom && !rules.custom(value)) {
      errors.push({
        field,
        expected: 'custom validation',
        received: value,
        message: rules.message || `Field "${field}" failed custom validation`
      });
    }
  }

  // Check for unknown fields (warnings only)
  for (const field of Object.keys(props)) {
    if (!schema[field]) {
      warnings.push(`Unknown field "${field}" will be ignored`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate and throw if invalid
 */
export function validatePropsOrThrow(
  props: any,
  schema: ValidationSchema,
  functionName: string
): void {
  const result = validateProps(props, schema, functionName);

  if (!result.valid) {
    const context = createErrorContext(functionName, { props });
    const firstError = result.errors[0];
    
    const error = new RynexValidationError(
      firstError.message,
      firstError.field,
      firstError.expected,
      firstError.received,
      context
    );

    // Add suggestions for all errors
    result.errors.forEach((err, index) => {
      if (index > 0) {
        error.addSuggestion(err.message);
      }
    });

    // Add example if available
    const exampleProps: any = {};
    for (const [field, rules] of Object.entries(schema)) {
      if (rules.required) {
        if (rules.enum) {
          exampleProps[field] = rules.enum[0];
        } else if (typeof rules.type === 'string') {
          switch (rules.type) {
            case 'string':
              exampleProps[field] = 'example';
              break;
            case 'number':
              exampleProps[field] = rules.min || 0;
              break;
            case 'boolean':
              exampleProps[field] = true;
              break;
            default:
              exampleProps[field] = '...';
          }
        }
      }
    }

    error.addSuggestion(
      'Example of valid props:',
      `${functionName}(${JSON.stringify(exampleProps, null, 2)})`
    );

    throw error;
  }

  // Log warnings in development
  if (result.warnings.length > 0 && typeof console !== 'undefined') {
    result.warnings.forEach(warning => {
      console.warn(`[Rynex] ${functionName}(): ${warning}`);
    });
  }
}

/**
 * Validate animation config
 */
export function validateAnimationConfig(
  config: any,
  functionName: string
): void {
  if (!config) return;

  const schema: ValidationSchema = {
    duration: {
      type: 'number',
      min: 0,
      max: 60000,
      message: 'Duration must be between 0 and 60000ms'
    },
    easing: {
      type: 'string',
      enum: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
      message: 'Invalid easing function'
    },
    delay: {
      type: 'number',
      min: 0,
      message: 'Delay must be >= 0'
    },
    iterations: {
      type: 'number',
      min: 1,
      message: 'Iterations must be >= 1'
    },
    direction: {
      type: 'string',
      enum: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
      message: 'Invalid animation direction'
    },
    fill: {
      type: 'string',
      enum: ['none', 'forwards', 'backwards', 'both'],
      message: 'Invalid fill mode'
    },
    onStart: {
      type: 'function'
    },
    onEnd: {
      type: 'function'
    },
    onCancel: {
      type: 'function'
    }
  };

  validatePropsOrThrow(config, schema, functionName);
}

/**
 * Validate store config
 */
export function validateStoreConfig(
  name: any,
  state: any,
  actions: any,
  functionName: string
): void {
  // Validate name
  if (typeof name !== 'string' || name.trim().length === 0) {
    const context = createErrorContext(functionName, { name });
    const error = new RynexValidationError(
      'Store name must be a non-empty string',
      'name',
      'non-empty string',
      name,
      context
    );
    error.addSuggestion(
      'Provide a unique name for the store',
      `createStore('myStore', initialState, actions)`
    );
    throw error;
  }

  // Validate state
  if (typeof state !== 'object' || state === null) {
    const context = createErrorContext(functionName, { state });
    const error = new RynexValidationError(
      'Store state must be an object',
      'state',
      'object',
      state,
      context
    );
    error.addSuggestion(
      'Provide an object as initial state',
      `createStore('myStore', { count: 0 }, actions)`
    );
    throw error;
  }

  // Validate actions
  if (typeof actions !== 'function' && typeof actions !== 'object') {
    const context = createErrorContext(functionName, { actions });
    const error = new RynexValidationError(
      'Store actions must be a function or object',
      'actions',
      'function | object',
      actions,
      context
    );
    error.addSuggestion(
      'Provide actions as a function that returns an object',
      `createStore('myStore', state, (state) => ({\n  increment: () => state.count++\n}))`
    );
    throw error;
  }
}
