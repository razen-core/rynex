/**
 * Rynex Developer Tools
 * Debugging, logging, and performance profiling utilities
 */

/**
 * Logger levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
}

/**
 * Logger class for structured logging
 */
class Logger {
  private config: LoggerConfig;
  private logs: Array<{
    level: string;
    message: string;
    timestamp: number;
    data?: any;
  }> = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      prefix: "[Rynex]",
      timestamp: true,
      colors: true,
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const parts: string[] = [];

    if (this.config.prefix) {
      parts.push(this.config.prefix);
    }

    if (this.config.timestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    parts.push(`[${level}]`);
    parts.push(message);

    return parts.join(" ");
  }

  private logToConsole(
    level: string,
    message: string,
    data?: any,
    color?: string,
  ) {
    try {
      const formatted = this.formatMessage(level, message, data);

      if (this.config.colors && color) {
        console.log(`%c${formatted}`, `color: ${color}`, data || "");
      } else {
        console.log(formatted, data || "");
      }
    } catch (error) {
      console.error("Logger error:", error);
    }
  }

  debug(message: string, data?: any) {
    if (!message) return;
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.logToConsole("DEBUG", message, data, "#888");
      this.logs.push({ level: "DEBUG", message, timestamp: Date.now(), data });
    }
  }

  info(message: string, data?: any) {
    if (!message) return;
    if (this.shouldLog(LogLevel.INFO)) {
      this.logToConsole("INFO", message, data, "#2196F3");
      this.logs.push({ level: "INFO", message, timestamp: Date.now(), data });
    }
  }

  warn(message: string, data?: any) {
    if (!message) return;
    if (this.shouldLog(LogLevel.WARN)) {
      this.logToConsole("WARN", message, data, "#FF9800");
      this.logs.push({ level: "WARN", message, timestamp: Date.now(), data });
    }
  }

  error(message: string, data?: any) {
    if (!message) return;
    if (this.shouldLog(LogLevel.ERROR)) {
      this.logToConsole("ERROR", message, data, "#F44336");
      this.logs.push({ level: "ERROR", message, timestamp: Date.now(), data });
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  setLevel(level: LogLevel) {
    this.config.level = level;
  }
}

/**
 * Global logger instance
 */
let globalLogger: Logger | null = null;

/**
 * Create or get logger instance
 */
export function logger(config?: Partial<LoggerConfig>): Logger {
  if (!globalLogger || config) {
    globalLogger = new Logger(config);
  }
  return globalLogger;
}

/**
 * Performance profiler
 */
export interface ProfileEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: any;
}

class Profiler {
  private profiles: Map<string, ProfileEntry> = new Map();
  private completed: ProfileEntry[] = [];

  start(name: string, metadata?: any) {
    if (!name || typeof name !== "string") {
      console.warn("Profile name must be a non-empty string");
      return;
    }

    if (this.profiles.has(name)) {
      console.warn(`Profile "${name}" is already running`);
      return;
    }

    try {
      const entry: ProfileEntry = {
        name,
        startTime: performance.now(),
        metadata,
      };

      this.profiles.set(name, entry);

      if (globalLogger) {
        globalLogger.debug(`Profile started: ${name}`, metadata);
      }
    } catch (error) {
      console.error("Error starting profile:", error);
    }
  }

  end(name: string): number | undefined {
    if (!name || typeof name !== "string") {
      console.warn("Profile name must be a non-empty string");
      return undefined;
    }

    const entry = this.profiles.get(name);

    if (!entry) {
      console.warn(`Profile "${name}" not found`);
      return undefined;
    }

    try {
      entry.endTime = performance.now();
      entry.duration = entry.endTime - entry.startTime;

      this.completed.push(entry);
      this.profiles.delete(name);

      if (globalLogger) {
        globalLogger.debug(`Profile ended: ${name}`, {
          duration: `${entry.duration.toFixed(2)}ms`,
          ...entry.metadata,
        });
      }

      return entry.duration;
    } catch (error) {
      console.error("Error ending profile:", error);
      return undefined;
    }
  }

  measure(name: string, fn: () => any, metadata?: any) {
    if (!name || typeof name !== "string") {
      console.warn("Profile name must be a non-empty string");
      return undefined;
    }

    if (typeof fn !== "function") {
      console.warn("Second argument must be a function");
      return undefined;
    }

    this.start(name, metadata);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      console.error(`Error in measured function "${name}":`, error);
      throw error;
    }
  }

  async measureAsync(name: string, fn: () => Promise<any>, metadata?: any) {
    if (!name || typeof name !== "string") {
      console.warn("Profile name must be a non-empty string");
      return undefined;
    }

    if (typeof fn !== "function") {
      console.warn("Second argument must be a function");
      return undefined;
    }

    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      console.error(`Error in async measured function "${name}":`, error);
      throw error;
    }
  }

  getProfile(name: string): ProfileEntry | undefined {
    return this.completed.find((p) => p.name === name);
  }

  getAllProfiles(): ProfileEntry[] {
    return [...this.completed];
  }

  getAverageDuration(name: string): number {
    const profiles = this.completed.filter((p) => p.name === name);
    if (profiles.length === 0) return 0;

    const total = profiles.reduce((sum, p) => sum + (p.duration || 0), 0);
    return total / profiles.length;
  }

  clear() {
    this.profiles.clear();
    this.completed = [];
  }

  report() {
    const report = {
      active: Array.from(this.profiles.values()),
      completed: this.completed,
      summary: this.getSummary(),
    };

    console.table(report.completed);
    return report;
  }

  private getSummary() {
    const names = new Set(this.completed.map((p) => p.name));
    const summary: Record<string, any> = {};

    names.forEach((name) => {
      const profiles = this.completed.filter((p) => p.name === name);
      const durations = profiles.map((p) => p.duration || 0);

      summary[name] = {
        count: profiles.length,
        total: durations.reduce((a, b) => a + b, 0).toFixed(2) + "ms",
        average:
          (durations.reduce((a, b) => a + b, 0) / profiles.length).toFixed(2) +
          "ms",
        min: Math.min(...durations).toFixed(2) + "ms",
        max: Math.max(...durations).toFixed(2) + "ms",
      };
    });

    return summary;
  }
}

/**
 * Global profiler instance
 */
let globalProfiler: Profiler | null = null;

/**
 * Get profiler instance
 */
export function profiler(): Profiler {
  if (!globalProfiler) {
    globalProfiler = new Profiler();
  }
  return globalProfiler;
}

/**
 * DevTools integration
 */
export interface DevToolsConfig {
  enabled: boolean;
  logger?: Logger;
  profiler?: Profiler;
}

class DevTools {
  private config: DevToolsConfig;
  private logger: Logger;
  private profiler: Profiler;

  constructor(config: Partial<DevToolsConfig> = {}) {
    this.config = {
      enabled: true,
      ...config,
    };

    this.logger = config.logger || logger();
    this.profiler = config.profiler || profiler();

    if (this.config.enabled) {
      this.attachToWindow();
    }
  }

  private attachToWindow() {
    if (typeof window !== "undefined") {
      (window as any).__RYNEX_DEVTOOLS__ = {
        logger: this.logger,
        profiler: this.profiler,
        version: "0.1.55",
        inspect: this.inspect.bind(this),
        getState: this.getState.bind(this),
      };

      this.logger.info("DevTools attached to window.__RYNEX_DEVTOOLS__");
    }
  }

  inspect(element: HTMLElement) {
    if (!element || !(element instanceof HTMLElement)) {
      this.logger.warn("Invalid element provided to inspect");
      return null;
    }

    try {
      const info = {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        attributes: Array.from(element.attributes).map((attr) => ({
          name: attr.name,
          value: attr.value,
        })),
        children: element.children.length,
        dataset: { ...element.dataset },
      };

      console.log("Element Inspector:", info);
      return info;
    } catch (error) {
      this.logger.error("Error inspecting element:", error);
      return null;
    }
  }

  getState() {
    // This would integrate with the state management system
    // For now, return a placeholder
    return {
      message: "State inspection not yet implemented",
    };
  }

  enable() {
    this.config.enabled = true;
    this.attachToWindow();
  }

  disable() {
    this.config.enabled = false;
    if (typeof window !== "undefined") {
      delete (window as any).__RYNEX_DEVTOOLS__;
    }
  }
}

/**
 * Global devtools instance
 */
let globalDevTools: DevTools | null = null;

/**
 * Initialize or get devtools
 */
export function devtools(config?: Partial<DevToolsConfig>): DevTools {
  if (!globalDevTools || config) {
    globalDevTools = new DevTools(config);
  }
  return globalDevTools;
}

/**
 * Quick access functions
 */
export const log = {
  debug: (msg: string, data?: any) => logger().debug(msg, data),
  info: (msg: string, data?: any) => logger().info(msg, data),
  warn: (msg: string, data?: any) => logger().warn(msg, data),
  error: (msg: string, data?: any) => logger().error(msg, data),
};

export const profile = {
  start: (name: string, metadata?: any) => profiler().start(name, metadata),
  end: (name: string) => profiler().end(name),
  measure: (name: string, fn: () => any, metadata?: any) =>
    profiler().measure(name, fn, metadata),
  measureAsync: (name: string, fn: () => Promise<any>, metadata?: any) =>
    profiler().measureAsync(name, fn, metadata),
  report: () => profiler().report(),
};
