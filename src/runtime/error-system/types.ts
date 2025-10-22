/**
 * Rynex Error System - Type Definitions
 * Defines all types and interfaces for the error system
 */

/**
 * Error categories
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  RUNTIME = 'RUNTIME',
  TYPE = 'TYPE',
  STATE = 'STATE',
  COMPONENT = 'COMPONENT',
  ANIMATION = 'ANIMATION',
  DOM = 'DOM',
  NETWORK = 'NETWORK'
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Error context information
 */
export interface ErrorContext {
  functionName: string;
  parameters?: Record<string, any>;
  component?: string;
  file?: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent?: string;
  stackTrace?: string;
}

/**
 * Error suggestion
 */
export interface ErrorSuggestion {
  message: string;
  code?: string;
  docLink?: string;
}

/**
 * Error pattern for diagnostics
 */
export interface ErrorPattern {
  id: string;
  name: string;
  description: string;
  commonCauses: string[];
  solutions: string[];
  examples: string[];
}

/**
 * Validation schema for props/parameters
 */
export interface ValidationSchema {
  [key: string]: {
    type: string | string[];
    required?: boolean;
    min?: number;
    max?: number;
    enum?: any[];
    pattern?: RegExp;
    custom?: (value: any) => boolean;
    message?: string;
  };
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  expected: any;
  received: any;
  message: string;
}

/**
 * Recovery strategy
 */
export enum RecoveryStrategy {
  THROW = 'throw',
  FALLBACK = 'fallback',
  RETRY = 'retry',
  IGNORE = 'ignore',
  ROLLBACK = 'rollback'
}

/**
 * Recovery result
 */
export interface RecoveryResult {
  success: boolean;
  strategy: RecoveryStrategy;
  result?: any;
  error?: Error;
}

/**
 * Error reporter configuration
 */
export interface ReporterConfig {
  console: boolean;
  devTools: boolean;
  remote?: {
    enabled: boolean;
    endpoint: string;
    apiKey?: string;
  };
  formatting: {
    colors: boolean;
    timestamp: boolean;
    stackTrace: boolean;
    suggestions: boolean;
    examples: boolean;
    docLinks: boolean;
  };
}

/**
 * Error system configuration
 */
export interface ErrorSystemConfig {
  enabled: boolean;
  mode: 'development' | 'production';
  validation: {
    enabled: boolean;
    strict: boolean;
  };
  reporting: ReporterConfig;
  recovery: {
    strategy: RecoveryStrategy;
    maxRetries: number;
  };
  performance: {
    trackOverhead: boolean;
    maxOverheadMs: number;
  };
}

/**
 * Diagnostic result
 */
export interface Diagnosis {
  pattern?: ErrorPattern;
  suggestions: ErrorSuggestion[];
  fixes: string[];
  examples: string[];
  docLink: string;
  relatedErrors: string[];
}

/**
 * Error report
 */
export interface ErrorReport {
  id: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  context: ErrorContext;
  diagnosis?: Diagnosis;
  timestamp: number;
  resolved: boolean;
}

/**
 * Type guard utilities
 */
export type TypeGuard<T> = (value: any) => value is T;

/**
 * Expected type definition
 */
export interface ExpectedType {
  name: string;
  check: TypeGuard<any>;
  example?: string;
}
