/**
 * Rynex Error System - Configuration
 * Manages error system configuration and modes
 */

import { ErrorSystemConfig, RecoveryStrategy } from './types.js';

/**
 * Default development configuration
 */
const developmentConfig: ErrorSystemConfig = {
  enabled: true,
  mode: 'development',
  validation: {
    enabled: true,
    strict: true
  },
  reporting: {
    console: true,
    devTools: true,
    formatting: {
      colors: true,
      timestamp: true,
      stackTrace: true,
      suggestions: true,
      examples: true,
      docLinks: true
    }
  },
  recovery: {
    strategy: RecoveryStrategy.FALLBACK,
    maxRetries: 3
  },
  performance: {
    trackOverhead: true,
    maxOverheadMs: 5
  }
};

/**
 * Default production configuration
 */
const productionConfig: ErrorSystemConfig = {
  enabled: true,
  mode: 'production',
  validation: {
    enabled: true,
    strict: false
  },
  reporting: {
    console: false,
    devTools: false,
    formatting: {
      colors: false,
      timestamp: true,
      stackTrace: false,
      suggestions: false,
      examples: false,
      docLinks: false
    }
  },
  recovery: {
    strategy: RecoveryStrategy.IGNORE,
    maxRetries: 1
  },
  performance: {
    trackOverhead: false,
    maxOverheadMs: 1
  }
};

/**
 * Current configuration
 */
let currentConfig: ErrorSystemConfig = developmentConfig;

/**
 * Get current configuration
 */
export function getConfig(): ErrorSystemConfig {
  return { ...currentConfig };
}

/**
 * Set configuration
 */
export function setConfig(config: Partial<ErrorSystemConfig>): void {
  currentConfig = {
    ...currentConfig,
    ...config,
    validation: {
      ...currentConfig.validation,
      ...(config.validation || {})
    },
    reporting: {
      ...currentConfig.reporting,
      ...(config.reporting || {}),
      formatting: {
        ...currentConfig.reporting.formatting,
        ...(config.reporting?.formatting || {})
      }
    },
    recovery: {
      ...currentConfig.recovery,
      ...(config.recovery || {})
    },
    performance: {
      ...currentConfig.performance,
      ...(config.performance || {})
    }
  };
}

/**
 * Set mode (development or production)
 */
export function setMode(mode: 'development' | 'production'): void {
  currentConfig = mode === 'development' ? developmentConfig : productionConfig;
}

/**
 * Check if error system is enabled
 */
export function isEnabled(): boolean {
  return currentConfig.enabled;
}

/**
 * Check if validation is enabled
 */
export function isValidationEnabled(): boolean {
  return currentConfig.enabled && currentConfig.validation.enabled;
}

/**
 * Check if strict validation is enabled
 */
export function isStrictValidation(): boolean {
  return currentConfig.validation.strict;
}

/**
 * Check if console reporting is enabled
 */
export function isConsoleReportingEnabled(): boolean {
  return currentConfig.reporting.console;
}

/**
 * Check if DevTools reporting is enabled
 */
export function isDevToolsReportingEnabled(): boolean {
  return currentConfig.reporting.devTools;
}

/**
 * Get recovery strategy
 */
export function getRecoveryStrategy(): RecoveryStrategy {
  return currentConfig.recovery.strategy;
}

/**
 * Get max retries
 */
export function getMaxRetries(): number {
  return currentConfig.recovery.maxRetries;
}

/**
 * Check if performance tracking is enabled
 */
export function isPerformanceTrackingEnabled(): boolean {
  return currentConfig.performance.trackOverhead;
}

/**
 * Get max overhead in milliseconds
 */
export function getMaxOverheadMs(): number {
  return currentConfig.performance.maxOverheadMs;
}

/**
 * Auto-detect mode based on environment
 */
export function autoDetectMode(): void {
  // Check for common development indicators
  const isDev = 
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' ||
    typeof location !== 'undefined' && (
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1' ||
      location.hostname.includes('local')
    );

  setMode(isDev ? 'development' : 'production');
}

/**
 * Reset to default configuration
 */
export function resetConfig(): void {
  autoDetectMode();
}

// Auto-detect mode on initialization
autoDetectMode();
