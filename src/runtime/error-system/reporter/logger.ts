/**
 * Rynex Error System - Error Logger
 * Logs and tracks errors
 */

import { RynexError } from '../errors.js';
import { ErrorReport } from '../types.js';

/**
 * Error log storage
 */
const errorLog: ErrorReport[] = [];
let errorIdCounter = 0;

/**
 * Log an error
 */
export function logError(error: RynexError): string {
  const id = `error_${++errorIdCounter}_${Date.now()}`;
  
  const report: ErrorReport = {
    id,
    code: error.code,
    category: error.category,
    severity: error.severity,
    message: error.message,
    context: error.context,
    diagnosis: error.diagnosis,
    timestamp: error.timestamp,
    resolved: false
  };

  errorLog.push(report);

  // Keep only last 100 errors to prevent memory issues
  if (errorLog.length > 100) {
    errorLog.shift();
  }

  return id;
}

/**
 * Get all logged errors
 */
export function getErrorLog(): ErrorReport[] {
  return [...errorLog];
}

/**
 * Get error by ID
 */
export function getErrorById(id: string): ErrorReport | undefined {
  return errorLog.find(report => report.id === id);
}

/**
 * Mark error as resolved
 */
export function markErrorResolved(id: string): boolean {
  const report = getErrorById(id);
  if (report) {
    report.resolved = true;
    return true;
  }
  return false;
}

/**
 * Clear error log
 */
export function clearErrorLog(): void {
  errorLog.length = 0;
  errorIdCounter = 0;
}

/**
 * Get errors by category
 */
export function getErrorsByCategory(category: string): ErrorReport[] {
  return errorLog.filter(report => report.category === category);
}

/**
 * Get unresolved errors
 */
export function getUnresolvedErrors(): ErrorReport[] {
  return errorLog.filter(report => !report.resolved);
}

/**
 * Get error statistics
 */
export function getErrorStats(): {
  total: number;
  resolved: number;
  unresolved: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
} {
  const stats = {
    total: errorLog.length,
    resolved: 0,
    unresolved: 0,
    byCategory: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>
  };

  errorLog.forEach(report => {
    if (report.resolved) {
      stats.resolved++;
    } else {
      stats.unresolved++;
    }

    stats.byCategory[report.category] = (stats.byCategory[report.category] || 0) + 1;
    stats.bySeverity[report.severity] = (stats.bySeverity[report.severity] || 0) + 1;
  });

  return stats;
}

/**
 * Export error log as JSON
 */
export function exportErrorLog(): string {
  return JSON.stringify({
    errors: errorLog,
    stats: getErrorStats(),
    exportedAt: new Date().toISOString()
  }, null, 2);
}
