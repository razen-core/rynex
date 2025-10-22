/**
 * Rynex Error System - Main Entry Point
 * Comprehensive error handling, validation, and diagnostic system
 */

// Types
export * from './types.js';

// Error classes
export * from './errors.js';

// Configuration
export * from './config.js';

// Validators
export * from './validator/index.js';

// Reporters
export * from './reporter/index.js';

// Main API
import { RynexError, createErrorContext } from './errors.js';
import { reportToConsole } from './reporter/console-reporter.js';
import { logError } from './reporter/logger.js';
import { isEnabled } from './config.js';

/**
 * Report an error through the error system
 */
export function reportError(error: RynexError): void {
  if (!isEnabled()) {
    return;
  }

  // Log the error
  logError(error);

  // Report to console
  reportToConsole(error);

  // TODO: Report to DevTools when implemented
  // TODO: Report to remote service if configured
}

/**
 * Handle and report an error
 */
export function handleError(
  error: Error | RynexError,
  functionName: string,
  parameters?: Record<string, any>
): void {
  if (!isEnabled()) {
    throw error;
  }

  let rynexError: RynexError;

  if (error instanceof RynexError) {
    rynexError = error;
  } else {
    // Wrap native error
    const context = createErrorContext(functionName, parameters);
    context.stackTrace = error.stack;
    rynexError = new RynexError(
      error.message,
      'RYNEX_RUNTIME_ERROR',
      'RUNTIME' as any,
      context
    );
  }

  reportError(rynexError);
}

/**
 * Safe function wrapper that catches and reports errors
 */
export function safe<T extends (...args: any[]) => any>(
  fn: T,
  functionName: string,
  fallback?: any
): T {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      if (error instanceof RynexError) {
        reportError(error);
      } else if (error instanceof Error) {
        handleError(error, functionName, { args });
      }
      return fallback;
    }
  }) as T;
}

/**
 * Safe async function wrapper
 */
export function safeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  functionName: string,
  fallback?: any
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof RynexError) {
        reportError(error);
      } else if (error instanceof Error) {
        handleError(error, functionName, { args });
      }
      return fallback;
    }
  }) as T;
}

/**
 * Assert condition or throw error
 */
export function assert(
  condition: boolean,
  message: string,
  functionName: string
): asserts condition {
  if (!condition) {
    const context = createErrorContext(functionName);
    const error = new RynexError(
      message,
      'RYNEX_ASSERTION_ERROR',
      'RUNTIME' as any,
      context
    );
    reportError(error);
    throw error;
  }
}

/**
 * Development-only assertion
 */
export function devAssert(
  condition: boolean,
  message: string,
  functionName: string
): asserts condition {
  const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
  if (isDev) {
    assert(condition, message, functionName);
  }
}
