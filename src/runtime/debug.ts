/**
 * ZenWeb Runtime Debugging
 * Debug utilities for development
 */

let debugEnabled = false;

export function enableDebug(): void {
  debugEnabled = true;
  console.log('[ZenWeb Debug] Debugging enabled');
}

export function disableDebug(): void {
  debugEnabled = false;
}

export function isDebugEnabled(): boolean {
  return debugEnabled;
}

export function debugLog(category: string, message: string, data?: any): void {
  if (debugEnabled) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] [DEBUG:${category}] ${message}`, data || '');
  }
}

export function debugWarn(category: string, message: string, data?: any): void {
  if (debugEnabled) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.warn(`[${timestamp}] [WARN:${category}] ${message}`, data || '');
  }
}

export function debugError(category: string, message: string, error?: Error): void {
  if (debugEnabled) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.error(`[${timestamp}] [ERROR:${category}] ${message}`, error || '');
  }
}

// Enable debug mode if URL has ?debug=true or localStorage has debug flag
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  const hasDebugParam = urlParams.get('debug') === 'true';
  const hasDebugStorage = localStorage.getItem('zenweb-debug') === 'true';
  
  if (hasDebugParam || hasDebugStorage) {
    enableDebug();
  }
}
