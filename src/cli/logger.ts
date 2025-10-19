/**
 * ZenWeb Professional Logger
 * Clean, minimal logging without emojis
 */

export enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

class Logger {
  private useColors: boolean;

  constructor(useColors = true) {
    this.useColors = useColors && process.stdout.isTTY;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    if (!this.useColors) {
      return `[${timestamp}] [${level}] ${message}`;
    }

    let color = colors.white;
    switch (level) {
      case LogLevel.SUCCESS:
        color = colors.green;
        break;
      case LogLevel.WARNING:
        color = colors.yellow;
        break;
      case LogLevel.ERROR:
        color = colors.red;
        break;
      case LogLevel.INFO:
        color = colors.cyan;
        break;
      case LogLevel.DEBUG:
        color = colors.gray;
        break;
    }

    return `${colors.dim}[${timestamp}]${colors.reset} ${color}[${level}]${colors.reset} ${message}`;
  }

  info(message: string): void {
    console.log(this.formatMessage(LogLevel.INFO, message));
  }

  success(message: string): void {
    console.log(this.formatMessage(LogLevel.SUCCESS, message));
  }

  warning(message: string): void {
    console.warn(this.formatMessage(LogLevel.WARNING, message));
  }

  error(message: string, error?: Error): void {
    console.error(this.formatMessage(LogLevel.ERROR, message));
    if (error && error.stack) {
      console.error(colors.dim + error.stack + colors.reset);
    }
  }

  debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(this.formatMessage(LogLevel.DEBUG, message));
    }
  }

  section(title: string): void {
    console.log('\n' + colors.bright + title + colors.reset);
  }

  divider(): void {
    console.log(colors.dim + '─'.repeat(60) + colors.reset);
  }
}

export const logger = new Logger();
