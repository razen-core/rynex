/**
 * Rynex Error System - Error Formatter
 * Formats error messages for display
 */

import { RynexError } from '../errors.js';
import { getConfig } from '../config.js';

/**
 * ANSI color codes for terminal
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

/**
 * Format error message
 */
export function formatErrorMessage(error: RynexError): string {
  const config = getConfig();
  const useColors = config.reporting.formatting.colors;
  
  let message = '';

  // Header
  if (useColors) {
    message += `${colors.bright}${colors.red}`;
  }
  message += `\n╔════════════════════════════════════════════════════════════════╗\n`;
  message += `║  RYNEX ERROR                                                   ║\n`;
  message += `╚════════════════════════════════════════════════════════════════╝`;
  if (useColors) {
    message += colors.reset;
  }
  message += '\n\n';

  // Error code and category
  if (useColors) {
    message += `${colors.bright}${colors.red}`;
  }
  message += `[${error.code}]`;
  if (useColors) {
    message += colors.reset;
  }
  message += ` ${error.category}\n`;

  // Error message
  if (useColors) {
    message += `${colors.bright}`;
  }
  message += `\n${error.message}\n`;
  if (useColors) {
    message += colors.reset;
  }

  // Context
  message += `\n${useColors ? colors.cyan : ''}━━━ Context ━━━${useColors ? colors.reset : ''}\n`;
  message += `Function: ${useColors ? colors.yellow : ''}${error.context.functionName}()${useColors ? colors.reset : ''}\n`;
  
  if (error.context.component) {
    message += `Component: ${useColors ? colors.yellow : ''}${error.context.component}${useColors ? colors.reset : ''}\n`;
  }

  if (config.reporting.formatting.timestamp) {
    const date = new Date(error.timestamp);
    message += `Time: ${useColors ? colors.gray : ''}${date.toLocaleTimeString()}${useColors ? colors.reset : ''}\n`;
  }

  // Parameters
  if (error.context.parameters && Object.keys(error.context.parameters).length > 0) {
    message += `\nParameters:\n`;
    for (const [key, value] of Object.entries(error.context.parameters)) {
      const valueStr = formatValue(value);
      message += `  ${useColors ? colors.gray : ''}${key}:${useColors ? colors.reset : ''} ${valueStr}\n`;
    }
  }

  // Suggestions
  if (config.reporting.formatting.suggestions && error.suggestions.length > 0) {
    message += `\n${useColors ? colors.green : ''}━━━ Suggestions ━━━${useColors ? colors.reset : ''}\n`;
    error.suggestions.forEach((suggestion, index) => {
      message += `\n${useColors ? colors.green : ''}${index + 1}.${useColors ? colors.reset : ''} ${suggestion.message}\n`;
      
      if (suggestion.code) {
        message += `\n${useColors ? colors.gray : ''}`;
        message += suggestion.code.split('\n').map(line => `   ${line}`).join('\n');
        message += `${useColors ? colors.reset : ''}\n`;
      }

      if (suggestion.docLink && config.reporting.formatting.docLinks) {
        message += `   ${useColors ? colors.blue : ''}📖 ${suggestion.docLink}${useColors ? colors.reset : ''}\n`;
      }
    });
  }

  // Stack trace
  if (config.reporting.formatting.stackTrace && error.stack) {
    message += `\n${useColors ? colors.gray : ''}━━━ Stack Trace ━━━${useColors ? colors.reset : ''}\n`;
    message += `${useColors ? colors.dim : ''}${error.stack}${useColors ? colors.reset : ''}\n`;
  }

  // Footer
  message += `\n${useColors ? colors.gray : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${useColors ? colors.reset : ''}\n`;

  return message;
}

/**
 * Format value for display
 */
function formatValue(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'function') return '[Function]';
  if (value instanceof HTMLElement) return `<${value.tagName.toLowerCase()}>`;
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Object]';
    }
  }
  return String(value);
}

/**
 * Format error for browser console
 */
export function formatForConsole(error: RynexError): string[] {
  const parts: string[] = [];
  
  // Main message with styling
  parts.push(
    `%c[${error.code}]%c ${error.message}`,
    'color: #ef4444; font-weight: bold; font-size: 14px;',
    'color: inherit; font-weight: normal; font-size: 14px;'
  );

  // Context
  parts.push(
    `%cFunction:%c ${error.context.functionName}()`,
    'color: #06b6d4; font-weight: bold;',
    'color: inherit;'
  );

  // Suggestions
  if (error.suggestions.length > 0) {
    parts.push('%c💡 Suggestions:', 'color: #10b981; font-weight: bold; font-size: 13px;');
    error.suggestions.forEach((suggestion, index) => {
      parts.push(`  ${index + 1}. ${suggestion.message}`);
      if (suggestion.code) {
        parts.push(`     ${suggestion.code}`);
      }
    });
  }

  return parts;
}

/**
 * Format error as plain text (no colors)
 */
export function formatAsPlainText(error: RynexError): string {
  let message = '';
  
  message += `\n[${error.code}] ${error.category}\n`;
  message += `${error.message}\n\n`;
  message += `Function: ${error.context.functionName}()\n`;
  
  if (error.context.component) {
    message += `Component: ${error.context.component}\n`;
  }

  if (error.suggestions.length > 0) {
    message += `\nSuggestions:\n`;
    error.suggestions.forEach((suggestion, index) => {
      message += `  ${index + 1}. ${suggestion.message}\n`;
      if (suggestion.code) {
        message += `     ${suggestion.code}\n`;
      }
    });
  }

  return message;
}

/**
 * Format error as JSON
 */
export function formatAsJSON(error: RynexError): string {
  return JSON.stringify({
    code: error.code,
    category: error.category,
    severity: error.severity,
    message: error.message,
    context: error.context,
    suggestions: error.suggestions,
    timestamp: error.timestamp
  }, null, 2);
}
