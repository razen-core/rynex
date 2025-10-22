/**
 * Rynex Error System - Error Classes
 * Custom error classes for different error types
 */

import {
  ErrorCategory,
  ErrorSeverity,
  ErrorContext,
  ErrorSuggestion,
  Diagnosis
} from './types.js';

/**
 * Base Rynex Error class
 */
export class RynexError extends Error {
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public suggestions: ErrorSuggestion[];
  public diagnosis?: Diagnosis;
  public readonly timestamp: number;

  constructor(
    message: string,
    code: string,
    category: ErrorCategory,
    context: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.ERROR
  ) {
    super(message);
    this.name = 'RynexError';
    this.code = code;
    this.category = category;
    this.severity = severity;
    this.context = context;
    this.suggestions = [];
    this.timestamp = Date.now();

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Add a suggestion to this error
   */
  addSuggestion(message: string, code?: string, docLink?: string): this {
    this.suggestions.push({ message, code, docLink });
    return this;
  }

  /**
   * Set diagnosis for this error
   */
  setDiagnosis(diagnosis: Diagnosis): this {
    this.diagnosis = diagnosis;
    return this;
  }

  /**
   * Get formatted error message
   */
  getFormattedMessage(): string {
    let formatted = `[${this.code}] ${this.message}\n`;
    formatted += `\nFunction: ${this.context.functionName}`;
    
    if (this.context.component) {
      formatted += `\nComponent: ${this.context.component}`;
    }

    if (this.suggestions.length > 0) {
      formatted += '\n\nSuggestions:';
      this.suggestions.forEach((suggestion, index) => {
        formatted += `\n  ${index + 1}. ${suggestion.message}`;
        if (suggestion.code) {
          formatted += `\n     ${suggestion.code}`;
        }
      });
    }

    return formatted;
  }
}

/**
 * Validation Error
 * Thrown when input validation fails
 */
export class RynexValidationError extends RynexError {
  public readonly expected: any;
  public readonly received: any;
  public readonly parameter: string;

  constructor(
    message: string,
    parameter: string,
    expected: any,
    received: any,
    context: ErrorContext
  ) {
    super(
      message,
      'RYNEX_VALIDATION_ERROR',
      ErrorCategory.VALIDATION,
      context,
      ErrorSeverity.ERROR
    );
    this.name = 'RynexValidationError';
    this.parameter = parameter;
    this.expected = expected;
    this.received = received;
  }

  getFormattedMessage(): string {
    let formatted = super.getFormattedMessage();
    formatted += `\n\nParameter: ${this.parameter}`;
    formatted += `\nExpected: ${this.formatValue(this.expected)}`;
    formatted += `\nReceived: ${this.formatValue(this.received)}`;
    return formatted;
  }

  private formatValue(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      if (value.constructor && value.constructor.name) {
        return value.constructor.name;
      }
      return typeof value;
    }
    return `${typeof value} (${value})`;
  }
}

/**
 * Runtime Error
 * Thrown during runtime execution
 */
export class RynexRuntimeError extends RynexError {
  public readonly operation: string;
  public readonly state?: any;

  constructor(
    message: string,
    operation: string,
    context: ErrorContext,
    state?: any
  ) {
    super(
      message,
      'RYNEX_RUNTIME_ERROR',
      ErrorCategory.RUNTIME,
      context,
      ErrorSeverity.ERROR
    );
    this.name = 'RynexRuntimeError';
    this.operation = operation;
    this.state = state;
  }
}

/**
 * Type Error
 * Thrown when type checking fails
 */
export class RynexTypeError extends RynexError {
  public readonly expectedType: string;
  public readonly receivedType: string;
  public readonly value: any;

  constructor(
    message: string,
    expectedType: string,
    receivedType: string,
    value: any,
    context: ErrorContext
  ) {
    super(
      message,
      'RYNEX_TYPE_ERROR',
      ErrorCategory.TYPE,
      context,
      ErrorSeverity.ERROR
    );
    this.name = 'RynexTypeError';
    this.expectedType = expectedType;
    this.receivedType = receivedType;
    this.value = value;
  }

  getFormattedMessage(): string {
    let formatted = super.getFormattedMessage();
    formatted += `\n\nExpected Type: ${this.expectedType}`;
    formatted += `\nReceived Type: ${this.receivedType}`;
    return formatted;
  }
}

/**
 * State Error
 * Thrown when state operations fail
 */
export class RynexStateError extends RynexError {
  public readonly storeName?: string;
  public readonly stateSnapshot?: any;

  constructor(
    message: string,
    context: ErrorContext,
    storeName?: string,
    stateSnapshot?: any
  ) {
    super(
      message,
      'RYNEX_STATE_ERROR',
      ErrorCategory.STATE,
      context,
      ErrorSeverity.ERROR
    );
    this.name = 'RynexStateError';
    this.storeName = storeName;
    this.stateSnapshot = stateSnapshot;
  }
}

/**
 * Component Error
 * Thrown when component operations fail
 */
export class RynexComponentError extends RynexError {
  public readonly componentName: string;
  public readonly phase: 'render' | 'mount' | 'update' | 'unmount';

  constructor(
    message: string,
    componentName: string,
    phase: 'render' | 'mount' | 'update' | 'unmount',
    context: ErrorContext
  ) {
    super(
      message,
      'RYNEX_COMPONENT_ERROR',
      ErrorCategory.COMPONENT,
      context,
      ErrorSeverity.ERROR
    );
    this.name = 'RynexComponentError';
    this.componentName = componentName;
    this.phase = phase;
  }
}

/**
 * Animation Error
 * Thrown when animation operations fail
 */
export class RynexAnimationError extends RynexError {
  public readonly animationType: string;
  public readonly element?: HTMLElement;

  constructor(
    message: string,
    animationType: string,
    context: ErrorContext,
    element?: HTMLElement
  ) {
    super(
      message,
      'RYNEX_ANIMATION_ERROR',
      ErrorCategory.ANIMATION,
      context,
      ErrorSeverity.WARNING
    );
    this.name = 'RynexAnimationError';
    this.animationType = animationType;
    this.element = element;
  }
}

/**
 * DOM Error
 * Thrown when DOM operations fail
 */
export class RynexDOMError extends RynexError {
  public readonly domOperation: string;
  public readonly element?: HTMLElement;

  constructor(
    message: string,
    domOperation: string,
    context: ErrorContext,
    element?: HTMLElement
  ) {
    super(
      message,
      'RYNEX_DOM_ERROR',
      ErrorCategory.DOM,
      context,
      ErrorSeverity.ERROR
    );
    this.name = 'RynexDOMError';
    this.domOperation = domOperation;
    this.element = element;
  }
}

/**
 * Helper function to create error context
 */
export function createErrorContext(
  functionName: string,
  parameters?: Record<string, any>,
  component?: string
): ErrorContext {
  const context: ErrorContext = {
    functionName,
    parameters,
    component,
    timestamp: Date.now()
  };

  // Add browser info if available
  if (typeof navigator !== 'undefined') {
    context.userAgent = navigator.userAgent;
  }

  return context;
}

/**
 * Helper function to wrap native errors
 */
export function wrapNativeError(
  error: Error,
  functionName: string,
  parameters?: Record<string, any>
): RynexError {
  const context = createErrorContext(functionName, parameters);
  context.stackTrace = error.stack;

  return new RynexRuntimeError(
    error.message,
    'native_error',
    context
  );
}
