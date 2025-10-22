/**
 * Rynex Error System
 * Comprehensive error handling and validation for the framework
 */

// Error severity levels
export enum ErrorSeverity {
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error categories
export enum ErrorCategory {
  VALIDATION = 'validation',
  RUNTIME = 'runtime',
  DOM = 'dom',
  STATE = 'state',
  COMPONENT = 'component',
  ROUTER = 'router',
  LIFECYCLE = 'lifecycle',
  PROPS = 'props',
  CHILDREN = 'children'
}

// Base error class for Rynex
export class RynexError extends Error {
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly timestamp: number;
  public readonly context?: any;

  constructor(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    context?: any
  ) {
    super(message);
    this.name = 'RynexError';
    this.severity = severity;
    this.category = category;
    this.timestamp = Date.now();
    this.context = context;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RynexError);
    }
  }

  toString(): string {
    return `[${this.severity.toUpperCase()}] [${this.category}] ${this.message}`;
  }
}

// Specific error types
export class ValidationError extends RynexError {
  constructor(message: string, context?: any) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.ERROR, context);
    this.name = 'ValidationError';
  }
}

export class DOMError extends RynexError {
  constructor(message: string, severity: ErrorSeverity = ErrorSeverity.ERROR, context?: any) {
    super(message, ErrorCategory.DOM, severity, context);
    this.name = 'DOMError';
  }
}

export class StateError extends RynexError {
  constructor(message: string, context?: any) {
    super(message, ErrorCategory.STATE, ErrorSeverity.ERROR, context);
    this.name = 'StateError';
  }
}

export class ComponentError extends RynexError {
  constructor(message: string, severity: ErrorSeverity = ErrorSeverity.ERROR, context?: any) {
    super(message, ErrorCategory.COMPONENT, severity, context);
    this.name = 'ComponentError';
  }
}

export class RouterError extends RynexError {
  constructor(message: string, context?: any) {
    super(message, ErrorCategory.ROUTER, ErrorSeverity.ERROR, context);
    this.name = 'RouterError';
  }
}

export class LifecycleError extends RynexError {
  constructor(message: string, context?: any) {
    super(message, ErrorCategory.LIFECYCLE, ErrorSeverity.ERROR, context);
    this.name = 'LifecycleError';
  }
}

// Error handler configuration
interface ErrorHandlerConfig {
  onError?: (error: RynexError) => void;
  throwOnError?: boolean;
  logErrors?: boolean;
  captureStackTrace?: boolean;
}

class ErrorHandler {
  private config: ErrorHandlerConfig = {
    throwOnError: true,
    logErrors: true,
    captureStackTrace: true
  };

  private errorLog: RynexError[] = [];
  private maxLogSize = 100;

  configure(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  handle(error: RynexError): void {
    // Add to log
    this.errorLog.push(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Log to console if enabled
    if (this.config.logErrors) {
      const style = this.getConsoleStyle(error.severity);
      console.error(
        `%c${error.toString()}`,
        style,
        error.context ? `\nContext:` : '',
        error.context || ''
      );
      if (this.config.captureStackTrace && error.stack) {
        console.error(error.stack);
      }
    }

    // Call custom error handler
    if (this.config.onError) {
      this.config.onError(error);
    }

    // Throw if configured
    if (this.config.throwOnError && error.severity === ErrorSeverity.CRITICAL) {
      throw error;
    }
  }

  private getConsoleStyle(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.WARNING:
        return 'color: #ffc107; font-weight: bold;';
      case ErrorSeverity.ERROR:
        return 'color: #dc3545; font-weight: bold;';
      case ErrorSeverity.CRITICAL:
        return 'color: #ff0000; font-weight: bold; font-size: 14px;';
      default:
        return '';
    }
  }

  getErrors(): RynexError[] {
    return [...this.errorLog];
  }

  clearErrors(): void {
    this.errorLog = [];
  }

  getErrorsByCategory(category: ErrorCategory): RynexError[] {
    return this.errorLog.filter(err => err.category === category);
  }

  getErrorsBySeverity(severity: ErrorSeverity): RynexError[] {
    return this.errorLog.filter(err => err.severity === severity);
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();

// Validation utilities
export const validators = {
  /**
   * Validate that a value is not null or undefined
   */
  required(value: any, fieldName: string, context?: any): void {
    if (value === null || value === undefined) {
      throw new ValidationError(
        `${fieldName} is required but received ${value}`,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate type of a value
   */
  type(value: any, expectedType: string, fieldName: string, context?: any): void {
    const actualType = typeof value;
    if (actualType !== expectedType) {
      throw new ValidationError(
        `${fieldName} expected type '${expectedType}' but received '${actualType}'`,
        { fieldName, expectedType, actualType, value, ...context }
      );
    }
  },

  /**
   * Validate that value is a function
   */
  isFunction(value: any, fieldName: string, context?: any): void {
    if (typeof value !== 'function') {
      throw new ValidationError(
        `${fieldName} must be a function but received ${typeof value}`,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate that value is an object
   */
  isObject(value: any, fieldName: string, context?: any): void {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new ValidationError(
        `${fieldName} must be an object but received ${typeof value}`,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate that value is an array
   */
  isArray(value: any, fieldName: string, context?: any): void {
    if (!Array.isArray(value)) {
      throw new ValidationError(
        `${fieldName} must be an array but received ${typeof value}`,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate that value is a string
   */
  isString(value: any, fieldName: string, context?: any): void {
    if (typeof value !== 'string') {
      throw new ValidationError(
        `${fieldName} must be a string but received ${typeof value}`,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate that value is a number
   */
  isNumber(value: any, fieldName: string, context?: any): void {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationError(
        `${fieldName} must be a valid number but received ${typeof value}`,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate that value is a boolean
   */
  isBoolean(value: any, fieldName: string, context?: any): void {
    if (typeof value !== 'boolean') {
      throw new ValidationError(
        `${fieldName} must be a boolean but received ${typeof value}`,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate that value is an HTMLElement
   */
  isHTMLElement(value: any, fieldName: string, context?: any): void {
    if (!(value instanceof HTMLElement)) {
      throw new DOMError(
        `${fieldName} must be an HTMLElement but received ${value?.constructor?.name || typeof value}`,
        ErrorSeverity.ERROR,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate that element exists in DOM
   */
  elementExists(element: HTMLElement | null, fieldName: string, context?: any): void {
    if (!element) {
      throw new DOMError(
        `${fieldName} element not found in DOM`,
        ErrorSeverity.ERROR,
        { fieldName, ...context }
      );
    }
  },

  /**
   * Validate that selector is valid
   */
  validSelector(selector: string, fieldName: string, context?: any): void {
    try {
      document.querySelector(selector);
    } catch (error) {
      throw new DOMError(
        `${fieldName} contains invalid CSS selector: ${selector}`,
        ErrorSeverity.ERROR,
        { fieldName, selector, error, ...context }
      );
    }
  },

  /**
   * Validate that value is one of allowed values
   */
  oneOf(value: any, allowedValues: any[], fieldName: string, context?: any): void {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(
        `${fieldName} must be one of [${allowedValues.join(', ')}] but received '${value}'`,
        { fieldName, value, allowedValues, ...context }
      );
    }
  },

  /**
   * Validate array is not empty
   */
  notEmpty(arr: any[], fieldName: string, context?: any): void {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new ValidationError(
        `${fieldName} must be a non-empty array`,
        { fieldName, value: arr, ...context }
      );
    }
  },

  /**
   * Validate string is not empty
   */
  notEmptyString(value: string, fieldName: string, context?: any): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new ValidationError(
        `${fieldName} must be a non-empty string`,
        { fieldName, value, ...context }
      );
    }
  },

  /**
   * Validate number is in range
   */
  inRange(value: number, min: number, max: number, fieldName: string, context?: any): void {
    if (typeof value !== 'number' || value < min || value > max) {
      throw new ValidationError(
        `${fieldName} must be between ${min} and ${max} but received ${value}`,
        { fieldName, value, min, max, ...context }
      );
    }
  },

  /**
   * Validate props object
   */
  validProps(props: any, fieldName: string = 'props', context?: any): void {
    if (props !== null && props !== undefined) {
      if (typeof props !== 'object' || Array.isArray(props)) {
        throw new ValidationError(
          `${fieldName} must be an object or null/undefined but received ${typeof props}`,
          { fieldName, props, ...context }
        );
      }
    }
  },

  /**
   * Validate children
   */
  validChildren(children: any, fieldName: string = 'children', context?: any): void {
    const validateChild = (child: any): boolean => {
      return (
        child === null ||
        child === undefined ||
        child === false ||
        child === true ||
        typeof child === 'string' ||
        typeof child === 'number' ||
        child instanceof HTMLElement ||
        child instanceof SVGElement ||
        child instanceof Text
      );
    };

    if (Array.isArray(children)) {
      const flatChildren = children.flat(Infinity);
      for (let i = 0; i < flatChildren.length; i++) {
        if (!validateChild(flatChildren[i])) {
          throw new ValidationError(
            `Invalid child at index ${i}: expected HTMLElement, string, number, or null/undefined but received ${typeof flatChildren[i]}`,
            { fieldName, index: i, child: flatChildren[i], ...context }
          );
        }
      }
    } else if (!validateChild(children)) {
      throw new ValidationError(
        `${fieldName} must be a valid DOM child (HTMLElement, string, number, or null/undefined) but received ${typeof children}`,
        { fieldName, children, ...context }
      );
    }
  }
};

// Safe execution wrapper
export function safeExecute<T>(
  fn: () => T,
  errorMessage: string,
  category: ErrorCategory = ErrorCategory.RUNTIME,
  context?: any
): T | null {
  try {
    return fn();
  } catch (error) {
    const rynexError = new RynexError(
      `${errorMessage}: ${error instanceof Error ? error.message : String(error)}`,
      category,
      ErrorSeverity.ERROR,
      { originalError: error, ...context }
    );
    errorHandler.handle(rynexError);
    return null;
  }
}

// Development mode flag
let isDevelopment = true;

export function setDevelopmentMode(enabled: boolean): void {
  isDevelopment = enabled;
}

export function isDevelopmentMode(): boolean {
  return isDevelopment;
}

// Validation wrapper that only runs in development
export function devValidate(validationFn: () => void): void {
  if (isDevelopment) {
    try {
      validationFn();
    } catch (error) {
      if (error instanceof RynexError) {
        errorHandler.handle(error);
      } else {
        throw error;
      }
    }
  }
}

// Assert function for critical validations
export function assert(condition: boolean, message: string, context?: any): void {
  if (!condition) {
    throw new RynexError(
      message,
      ErrorCategory.VALIDATION,
      ErrorSeverity.CRITICAL,
      context
    );
  }
}
