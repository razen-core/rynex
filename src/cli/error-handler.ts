/**
 * Enhanced Error Handler
 * Provides better error messages with context and suggestions
 */

import * as path from "path";
import { logger } from "./logger.js";

export interface ErrorContext {
  file?: string;
  line?: number;
  column?: number;
  code?: string;
  suggestion?: string;
}

/**
 * Format error with context
 */
export function formatError(error: Error, context?: ErrorContext): string {
  const lines: string[] = [];

  lines.push(`\nERROR: ${error.name}: ${error.message}`);

  if (context?.file) {
    const relativePath = path.relative(process.cwd(), context.file);
    lines.push(`\nFile: ${relativePath}`);

    if (context.line !== undefined) {
      lines.push(
        `Location: Line ${context.line}${context.column ? `, Column ${context.column}` : ""}`,
      );
    }
  }

  if (context?.code) {
    lines.push(`\nCode:\n${context.code}`);
  }

  if (context?.suggestion) {
    lines.push(`\nSuggestion: ${context.suggestion}`);
  }

  if (error.stack && process.argv.includes("--debug")) {
    lines.push(`\nStack Trace:\n${error.stack}`);
  }

  return lines.join("\n");
}

/**
 * Common error types and their suggestions
 */
const errorSuggestions: Record<string, string> = {
  ENOENT: "File or directory not found. Check if the path is correct.",
  EACCES:
    "Permission denied. Check file permissions or run with appropriate privileges.",
  EEXIST:
    "File or directory already exists. Use a different name or remove the existing one.",
  MODULE_NOT_FOUND:
    "Module not found. Run `npm install` to install dependencies.",
  SyntaxError:
    "Syntax error in your code. Check for typos, missing brackets, or incorrect syntax.",
  TypeError: "Type error. Check if you're using the correct data types.",
  ReferenceError:
    "Variable not defined. Make sure to declare variables before using them.",
};

/**
 * Get suggestion for error
 */
function getSuggestion(error: Error): string | undefined {
  for (const [key, suggestion] of Object.entries(errorSuggestions)) {
    if (error.message.includes(key) || error.name === key) {
      return suggestion;
    }
  }

  // Check for common patterns
  if (error.message.includes("Cannot find module")) {
    const match = error.message.match(/Cannot find module '([^']+)'/);
    if (match) {
      return `Module '${match[1]}' is not installed. Run: npm install ${match[1]}`;
    }
  }

  if (error.message.includes("Unexpected token")) {
    return "Check for syntax errors like missing commas, brackets, or quotes.";
  }

  return undefined;
}

/**
 * Enhanced error handler
 */
export function handleError(error: Error, context?: ErrorContext): void {
  const enhancedContext: ErrorContext = {
    ...context,
    suggestion: context?.suggestion || getSuggestion(error),
  };

  const formattedError = formatError(error, enhancedContext);
  console.error(formattedError);
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorContext?: Partial<ErrorContext>,
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error as Error, errorContext as ErrorContext);
      throw error;
    }
  }) as T;
}

/**
 * Build error from Rolldown/build errors
 */
export function parseBuildError(error: any): ErrorContext {
  const context: ErrorContext = {};

  if (error.loc) {
    context.file = error.loc.file;
    context.line = error.loc.line;
    context.column = error.loc.column;
  }

  if (error.frame) {
    context.code = error.frame;
  }

  if (error.id) {
    context.file = error.id;
  }

  return context;
}

/**
 * Validation error formatter
 */
export function formatValidationError(
  field: string,
  value: any,
  expected: string,
): string {
  return `
Configuration Error

Field: ${field}
Value: ${JSON.stringify(value)}
Expected: ${expected}

Please check your rynex.config.js file.
  `.trim();
}
