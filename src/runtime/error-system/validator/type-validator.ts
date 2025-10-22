/**
 * Rynex Error System - Type Validator
 * Validates types and provides type checking utilities
 */

import { RynexTypeError, createErrorContext } from '../errors.js';
import { ExpectedType, TypeGuard } from '../types.js';

/**
 * Get the type of a value as a string
 */
export function getType(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  
  // Check for DOM types only if they exist (browser environment)
  if (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) return 'HTMLElement';
  if (typeof Node !== 'undefined' && value instanceof Node) return 'Node';
  
  if (value instanceof Promise) return 'Promise';
  if (typeof value === 'function') return 'function';
  if (typeof value === 'object') {
    return value.constructor?.name || 'object';
  }
  return typeof value;
}

/**
 * Type guards
 */
export const isString = (value: any): value is string => typeof value === 'string';
export const isNumber = (value: any): value is number => typeof value === 'number' && !isNaN(value);
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
export const isFunction = (value: any): value is Function => typeof value === 'function';
export const isObject = (value: any): value is object => typeof value === 'object' && value !== null && !Array.isArray(value);
export const isArray = (value: any): value is any[] => Array.isArray(value);
export const isNull = (value: any): value is null => value === null;
export const isUndefined = (value: any): value is undefined => value === undefined;
export const isNullOrUndefined = (value: any): value is null | undefined => value === null || value === undefined;

/**
 * DOM type guards
 */
export const isHTMLElement = (value: any): value is HTMLElement => 
  typeof HTMLElement !== 'undefined' && value instanceof HTMLElement;
export const isElement = (value: any): value is Element => 
  typeof Element !== 'undefined' && value instanceof Element;
export const isNode = (value: any): value is Node => 
  typeof Node !== 'undefined' && value instanceof Node;
export const isTextNode = (value: any): value is Text => 
  typeof Text !== 'undefined' && value instanceof Text;

/**
 * Advanced type guards
 */
export const isPromise = (value: any): value is Promise<any> => value instanceof Promise;
export const isDate = (value: any): value is Date => value instanceof Date;
export const isRegExp = (value: any): value is RegExp => value instanceof RegExp;
export const isError = (value: any): value is Error => value instanceof Error;

/**
 * Validate type
 */
export function validateType(
  value: any,
  expectedType: string | string[],
  functionName: string,
  parameterName: string = 'parameter'
): void {
  const actualType = getType(value);
  const expected = Array.isArray(expectedType) ? expectedType : [expectedType];

  // Check if actual type matches any expected type
  const matches = expected.some(type => {
    if (type === 'any') return true;
    if (type === actualType) return true;
    if (type === 'HTMLElement' && isHTMLElement(value)) return true;
    if (type === 'Element' && isElement(value)) return true;
    if (type === 'Node' && isNode(value)) return true;
    if (type === 'array' && isArray(value)) return true;
    if (type === 'object' && isObject(value)) return true;
    return false;
  });

  if (!matches) {
    const context = createErrorContext(functionName, { [parameterName]: value });
    const error = new RynexTypeError(
      `Invalid type for parameter "${parameterName}" in ${functionName}()`,
      expected.join(' | '),
      actualType,
      value,
      context
    );

    // Add helpful suggestions
    if (actualType === 'undefined') {
      error.addSuggestion(
        `The parameter "${parameterName}" is undefined. Make sure it's defined before calling ${functionName}().`
      );
    } else if (actualType === 'null') {
      error.addSuggestion(
        `The parameter "${parameterName}" is null. Check if the value exists before calling ${functionName}().`
      );
    } else if (actualType === 'function' && expected.includes('string')) {
      error.addSuggestion(
        `You passed a function but expected a string. Did you forget to call the function?`,
        `// Instead of:\n${functionName}(myFunction)\n\n// Use:\n${functionName}(myFunction())`
      );
    } else if (expected.includes('HTMLElement') && actualType === 'string') {
      error.addSuggestion(
        `You passed a string but expected an HTMLElement. Use a DOM element instead.`,
        `// Instead of:\n${functionName}('myElement')\n\n// Use:\n${functionName}(div({}, 'content'))`
      );
    }

    throw error;
  }
}

/**
 * Validate that value is not null or undefined
 */
export function validateNotNullOrUndefined(
  value: any,
  functionName: string,
  parameterName: string = 'parameter'
): void {
  if (isNullOrUndefined(value)) {
    const context = createErrorContext(functionName, { [parameterName]: value });
    const error = new RynexTypeError(
      `Parameter "${parameterName}" cannot be null or undefined in ${functionName}()`,
      'defined value',
      getType(value),
      value,
      context
    );

    error.addSuggestion(
      `Ensure "${parameterName}" is defined before calling ${functionName}().`,
      `if (${parameterName}) {\n  ${functionName}(${parameterName});\n}`
    );

    throw error;
  }
}

/**
 * Validate that value is a valid number
 */
export function validateNumber(
  value: any,
  functionName: string,
  parameterName: string = 'parameter',
  options?: { min?: number; max?: number; integer?: boolean }
): void {
  validateType(value, 'number', functionName, parameterName);

  if (isNaN(value)) {
    const context = createErrorContext(functionName, { [parameterName]: value });
    throw new RynexTypeError(
      `Parameter "${parameterName}" is NaN in ${functionName}()`,
      'valid number',
      'NaN',
      value,
      context
    );
  }

  if (options?.min !== undefined && value < options.min) {
    const context = createErrorContext(functionName, { [parameterName]: value });
    const error = new RynexTypeError(
      `Parameter "${parameterName}" must be >= ${options.min} in ${functionName}()`,
      `number >= ${options.min}`,
      `${value}`,
      value,
      context
    );
    error.addSuggestion(`Use a value of ${options.min} or greater.`);
    throw error;
  }

  if (options?.max !== undefined && value > options.max) {
    const context = createErrorContext(functionName, { [parameterName]: value });
    const error = new RynexTypeError(
      `Parameter "${parameterName}" must be <= ${options.max} in ${functionName}()`,
      `number <= ${options.max}`,
      `${value}`,
      value,
      context
    );
    error.addSuggestion(`Use a value of ${options.max} or less.`);
    throw error;
  }

  if (options?.integer && !Number.isInteger(value)) {
    const context = createErrorContext(functionName, { [parameterName]: value });
    const error = new RynexTypeError(
      `Parameter "${parameterName}" must be an integer in ${functionName}()`,
      'integer',
      'float',
      value,
      context
    );
    error.addSuggestion(`Use Math.floor(${value}) or Math.round(${value}) to convert to integer.`);
    throw error;
  }
}

/**
 * Validate that value is a non-empty string
 */
export function validateNonEmptyString(
  value: any,
  functionName: string,
  parameterName: string = 'parameter'
): void {
  validateType(value, 'string', functionName, parameterName);

  if (value.trim().length === 0) {
    const context = createErrorContext(functionName, { [parameterName]: value });
    const error = new RynexTypeError(
      `Parameter "${parameterName}" cannot be an empty string in ${functionName}()`,
      'non-empty string',
      'empty string',
      value,
      context
    );
    error.addSuggestion(`Provide a non-empty string for "${parameterName}".`);
    throw error;
  }
}

/**
 * Validate enum value
 */
export function validateEnum(
  value: any,
  allowedValues: any[],
  functionName: string,
  parameterName: string = 'parameter'
): void {
  if (!allowedValues.includes(value)) {
    const context = createErrorContext(functionName, { [parameterName]: value });
    const error = new RynexTypeError(
      `Invalid value "${value}" for parameter "${parameterName}" in ${functionName}()`,
      allowedValues.join(' | '),
      String(value),
      value,
      context
    );
    error.addSuggestion(
      `Use one of the allowed values: ${allowedValues.map(v => `"${v}"`).join(', ')}`
    );
    throw error;
  }
}

/**
 * Create expected type definition
 */
export function createExpectedType(
  name: string,
  check: TypeGuard<any>,
  example?: string
): ExpectedType {
  return { name, check, example };
}
