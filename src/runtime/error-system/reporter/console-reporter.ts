/**
 * Rynex Error System - Console Reporter
 * Reports errors to the browser console
 */

import { RynexError } from '../errors.js';
import { formatErrorMessage, formatForConsole } from './formatter.js';
import { getConfig, isConsoleReportingEnabled } from '../config.js';

/**
 * Report error to console
 */
export function reportToConsole(error: RynexError): void {
  if (!isConsoleReportingEnabled()) {
    return;
  }

  const config = getConfig();

  // Use browser console styling if available
  if (typeof console !== 'undefined') {
    if (console.groupCollapsed) {
      // Use console groups for better organization
      console.groupCollapsed(
        `%c[RYNEX ERROR] %c${error.code}`,
        'color: #ef4444; font-weight: bold;',
        'color: #f59e0b; font-weight: bold;'
      );

      console.error(error.message);
      
      console.log('%cContext:', 'color: #06b6d4; font-weight: bold;');
      console.log('Function:', error.context.functionName);
      if (error.context.component) {
        console.log('Component:', error.context.component);
      }
      if (error.context.parameters) {
        console.log('Parameters:', error.context.parameters);
      }

      if (error.suggestions.length > 0) {
        console.log('%c💡 Suggestions:', 'color: #10b981; font-weight: bold;');
        error.suggestions.forEach((suggestion, index) => {
          console.log(`${index + 1}. ${suggestion.message}`);
          if (suggestion.code) {
            console.log(`%c${suggestion.code}`, 'color: #6b7280; font-family: monospace;');
          }
          if (suggestion.docLink) {
            console.log(`📖 ${suggestion.docLink}`);
          }
        });
      }

      if (config.reporting.formatting.stackTrace && error.stack) {
        console.log('%cStack Trace:', 'color: #6b7280; font-weight: bold;');
        console.log(error.stack);
      }

      console.groupEnd();
    } else {
      // Fallback for environments without console.group
      console.error(formatErrorMessage(error));
    }

    // Also log the original error object for debugging
    if (config.mode === 'development') {
      console.log('%cError Object:', 'color: #6b7280; font-style: italic;', error);
    }
  }
}

/**
 * Report warning to console
 */
export function reportWarning(message: string, context?: any): void {
  if (!isConsoleReportingEnabled()) {
    return;
  }

  if (typeof console !== 'undefined') {
    console.warn(`[Rynex Warning] ${message}`, context || '');
  }
}

/**
 * Report info to console
 */
export function reportInfo(message: string, context?: any): void {
  if (!isConsoleReportingEnabled()) {
    return;
  }

  const config = getConfig();
  if (config.mode === 'development' && typeof console !== 'undefined') {
    console.log(`[Rynex] ${message}`, context || '');
  }
}

/**
 * Report debug message to console
 */
export function reportDebug(message: string, context?: any): void {
  if (!isConsoleReportingEnabled()) {
    return;
  }

  const config = getConfig();
  if (config.mode === 'development' && typeof console !== 'undefined') {
    console.debug(`[Rynex Debug] ${message}`, context || '');
  }
}
