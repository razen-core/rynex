/**
 * Build Progress Indicators
 * Shows progress bars and timing diagnostics during builds
 */

import { logger } from './logger.js';

export class BuildProgress {
  private startTime: number = 0;
  private steps: Map<string, { start: number; end?: number }> = new Map();
  private currentStep: string | null = null;

  /**
   * Start tracking build progress
   */
  start(): void {
    this.startTime = Date.now();
    this.steps.clear();
    this.currentStep = null;
  }

  /**
   * Start a new build step
   */
  step(name: string): void {
    // End previous step if exists
    if (this.currentStep) {
      this.endStep(this.currentStep);
    }

    this.currentStep = name;
    this.steps.set(name, { start: Date.now() });
    logger.info(`[${name}]`);
  }

  /**
   * End the current step
   */
  private endStep(name: string): void {
    const step = this.steps.get(name);
    if (step && !step.end) {
      step.end = Date.now();
      const duration = step.end - step.start;
      logger.success(`[OK] ${name} (${this.formatDuration(duration)})`);
    }
  }

  /**
   * Complete the build and show summary
   */
  complete(): void {
    if (this.currentStep) {
      this.endStep(this.currentStep);
    }

    const totalDuration = Date.now() - this.startTime;
    
    logger.info('\nBuild Summary:');
    logger.info('='.repeat(50));
    
    // Show each step's timing
    for (const [name, timing] of this.steps.entries()) {
      if (timing.end) {
        const duration = timing.end - timing.start;
        const percentage = ((duration / totalDuration) * 100).toFixed(1);
        logger.info(`  ${name}: ${this.formatDuration(duration)} (${percentage}%)`);
      }
    }
    
    logger.info('='.repeat(50));
    logger.success(`Total build time: ${this.formatDuration(totalDuration)}\n`);
  }

  /**
   * Format duration in human-readable format
   */
  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(2);
      return `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Show a simple spinner for long operations
   */
  spinner(message: string): () => void {
    const frames = ['|', '/', '-', '\\'];
    let i = 0;
    let isSpinning = true;

    const interval = setInterval(() => {
      if (!isSpinning) {
        clearInterval(interval);
        return;
      }
      process.stdout.write(`\r${frames[i]} ${message}`);
      i = (i + 1) % frames.length;
    }, 80);

    return () => {
      isSpinning = false;
      clearInterval(interval);
      process.stdout.write('\r');
    };
  }
}

/**
 * Global progress instance
 */
export const buildProgress = new BuildProgress();
