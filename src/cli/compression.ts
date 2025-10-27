/**
 * Compression Utilities
 * Provides gzip and brotli compression for production builds
 */

import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import { promisify } from "util";
import { logger } from "./logger.js";

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

export interface CompressionOptions {
  gzip?: boolean;
  brotli?: boolean;
  threshold?: number; // Minimum file size to compress (in bytes)
}

export interface CompressionResult {
  file: string;
  originalSize: number;
  gzipSize?: number;
  brotliSize?: number;
}

/**
 * Compress a single file
 */
async function compressFile(
  filePath: string,
  options: CompressionOptions,
): Promise<CompressionResult> {
  const content = await fs.promises.readFile(filePath);
  const originalSize = content.length;

  const result: CompressionResult = {
    file: path.basename(filePath),
    originalSize,
  };

  // Skip small files
  if (originalSize < (options.threshold || 1024)) {
    return result;
  }

  try {
    // Gzip compression
    if (options.gzip !== false) {
      const gzipped = await gzip(content, {
        level: zlib.constants.Z_BEST_COMPRESSION,
      });
      await fs.promises.writeFile(`${filePath}.gz`, gzipped);
      result.gzipSize = gzipped.length;
    }

    // Brotli compression
    if (options.brotli !== false) {
      const brotlied = await brotliCompress(content, {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]:
            zlib.constants.BROTLI_MAX_QUALITY,
          [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        },
      });
      await fs.promises.writeFile(`${filePath}.br`, brotlied);
      result.brotliSize = brotlied.length;
    }
  } catch (error) {
    logger.warning(`Failed to compress ${path.basename(filePath)}: ${error}`);
  }

  return result;
}

/**
 * Compress all eligible files in a directory
 */
export async function compressDirectory(
  distDir: string,
  options: CompressionOptions = {},
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];

  // File extensions to compress
  const compressibleExtensions = [
    ".js",
    ".css",
    ".html",
    ".json",
    ".svg",
    ".xml",
  ];

  async function processDirectory(dir: string): Promise<void> {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);

        // Skip already compressed files
        if (entry.name.endsWith(".gz") || entry.name.endsWith(".br")) {
          continue;
        }

        // Only compress eligible file types
        if (compressibleExtensions.includes(ext)) {
          const result = await compressFile(fullPath, options);
          if (result.gzipSize || result.brotliSize) {
            results.push(result);
          }
        }
      }
    }
  }

  await processDirectory(distDir);
  return results;
}

/**
 * Format file size in human-readable format
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Calculate compression ratio
 */
function compressionRatio(original: number, compressed: number): string {
  const ratio = ((1 - compressed / original) * 100).toFixed(1);
  return `${ratio}%`;
}

/**
 * Print compression summary
 */
export function printCompressionSummary(results: CompressionResult[]): void {
  if (results.length === 0) {
    return;
  }

  logger.info("\nCompression Summary:");
  logger.info("=".repeat(70));

  let totalOriginal = 0;
  let totalGzip = 0;
  let totalBrotli = 0;

  for (const result of results) {
    totalOriginal += result.originalSize;

    const parts: string[] = [
      `  ${result.file}:`,
      `${formatSize(result.originalSize)}`,
    ];

    if (result.gzipSize) {
      totalGzip += result.gzipSize;
      parts.push(
        `--> gzip: ${formatSize(result.gzipSize)} (${compressionRatio(result.originalSize, result.gzipSize)})`,
      );
    }

    if (result.brotliSize) {
      totalBrotli += result.brotliSize;
      parts.push(
        `--> br: ${formatSize(result.brotliSize)} (${compressionRatio(result.originalSize, result.brotliSize)})`,
      );
    }

    logger.info(parts.join(" "));
  }

  logger.info("=".repeat(70));
  logger.info(`  Total: ${formatSize(totalOriginal)}`);

  if (totalGzip > 0) {
    logger.info(
      `  Gzipped: ${formatSize(totalGzip)} (${compressionRatio(totalOriginal, totalGzip)} reduction)`,
    );
  }

  if (totalBrotli > 0) {
    logger.info(
      `  Brotli: ${formatSize(totalBrotli)} (${compressionRatio(totalOriginal, totalBrotli)} reduction)`,
    );
  }

  logger.success("Compression complete\n");
}
