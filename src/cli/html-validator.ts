/**
 * HTML Validator and Auto-Fixer
 * Validates and fixes common HTML issues in generated files
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger.js';

export interface HTMLValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  autoFixable: boolean;
  fix?: () => void;
}

export interface HTMLValidationResult {
  valid: boolean;
  issues: HTMLValidationIssue[];
  fixed: boolean;
}

/**
 * Validate and optionally fix HTML file
 */
export function validateHTML(filePath: string, autoFix: boolean = false): HTMLValidationResult {
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      issues: [{
        type: 'error',
        message: `HTML file not found: ${filePath}`,
        autoFixable: false
      }],
      fixed: false
    };
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const issues: HTMLValidationIssue[] = [];
  let fixed = false;
  let modified = false;

  // Check 1: DOCTYPE declaration
  if (!html.trim().startsWith('<!DOCTYPE html>') && !html.trim().startsWith('<!doctype html>')) {
    issues.push({
      type: 'error',
      message: 'Missing or incorrect DOCTYPE declaration',
      autoFixable: true,
      fix: () => {
        if (!html.includes('<!DOCTYPE') && !html.includes('<!doctype')) {
          html = '<!DOCTYPE html>\n' + html;
          modified = true;
        }
      }
    });
  }

  // Check 2: HTML tag with lang attribute
  if (!html.includes('<html lang=')) {
    issues.push({
      type: 'warning',
      message: 'Missing lang attribute on <html> tag',
      autoFixable: true,
      fix: () => {
        html = html.replace(/<html>/gi, '<html lang="en">');
        modified = true;
      }
    });
  }

  // Check 3: Required meta tags
  const requiredMetas = [
    { name: 'charset', pattern: /<meta\s+charset=/i, fix: '<meta charset="UTF-8">' },
    { name: 'viewport', pattern: /<meta\s+name="viewport"/i, fix: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' }
  ];

  for (const meta of requiredMetas) {
    if (!meta.pattern.test(html)) {
      issues.push({
        type: 'warning',
        message: `Missing ${meta.name} meta tag`,
        autoFixable: true,
        fix: () => {
          // Insert after <head> tag
          html = html.replace(/<head>/i, `<head>\n  ${meta.fix}`);
          modified = true;
        }
      });
    }
  }

  // Check 4: Cache control meta tags
  const cacheMetaPattern = /<meta\s+http-equiv="Cache-Control"/i;
  if (!cacheMetaPattern.test(html)) {
    issues.push({
      type: 'info',
      message: 'Missing cache control meta tags',
      autoFixable: true,
      fix: () => {
        const cacheMetas = `
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">`;
        html = html.replace(/<head>/i, `<head>${cacheMetas}`);
        modified = true;
      }
    });
  }

  // Check 5: Title tag
  if (!/<title>.*<\/title>/i.test(html)) {
    issues.push({
      type: 'warning',
      message: 'Missing <title> tag',
      autoFixable: true,
      fix: () => {
        html = html.replace(/<head>/i, '<head>\n  <title>Rynex App</title>');
        modified = true;
      }
    });
  }

  // Check 6: Body tag
  if (!/<body>/i.test(html)) {
    issues.push({
      type: 'error',
      message: 'Missing <body> tag',
      autoFixable: false
    });
  }

  // Check 7: Root element for mounting
  if (!html.includes('id="root"') && !html.includes('id="app"')) {
    issues.push({
      type: 'warning',
      message: 'Missing root element (id="root" or id="app")',
      autoFixable: true,
      fix: () => {
        html = html.replace(/<body>/i, '<body>\n  <div id="root"></div>');
        modified = true;
      }
    });
  }

  // Check 8: Script tags with proper type
  const scriptPattern = /<script\s+(?:type="module"\s+)?src="([^"]+\.js)"/gi;
  const scripts = [...html.matchAll(scriptPattern)];
  
  for (const match of scripts) {
    if (!match[0].includes('type="module"')) {
      issues.push({
        type: 'warning',
        message: `Script tag missing type="module": ${match[1]}`,
        autoFixable: true,
        fix: () => {
          const oldScript = match[0];
          const newScript = oldScript.replace(/<script\s+src=/, '<script type="module" src=');
          html = html.replace(oldScript, newScript);
          modified = true;
        }
      });
    }
  }

  // Check 9: Broken script/link references
  const distDir = path.dirname(filePath);
  
  // Check script sources
  const scriptSrcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/gi)];
  for (const match of scriptSrcs) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('//')) {
      const scriptPath = path.join(distDir, src);
      
      // Check if file exists OR if it's a valid bundle pattern
      // Match any filename with hash pattern: name.[hash].js
      const isHashedBundle = src.match(/^[a-zA-Z0-9_-]+\.[a-f0-9]{8}\.js$/);
      const isSimpleBundle = src.match(/^[a-zA-Z0-9_-]+\.js$/);
      
      if (isHashedBundle || isSimpleBundle) {
        // For hashed bundles, check if the referenced file exists
        if (isHashedBundle && !fs.existsSync(scriptPath)) {
          // Check if any bundle with the same base name exists
          const baseName = src.replace(/\.[a-f0-9]{8}\.js$/, '');
          const files = fs.readdirSync(distDir);
          const hasAnyBundle = files.some(f => 
            f === `${baseName}.js` || 
            f.match(new RegExp(`^${baseName}\\.[a-f0-9]{8}\\.js$`))
          );
          
          if (!hasAnyBundle) {
            issues.push({
              type: 'error',
              message: `Broken script reference: ${src} (no bundle file found)`,
              autoFixable: false
            });
          }
        } else if (isSimpleBundle && !fs.existsSync(scriptPath)) {
          // For simple bundles, check if file exists
          issues.push({
            type: 'error',
            message: `Broken script reference: ${src} (file not found)`,
            autoFixable: false
          });
        }
      } else if (!fs.existsSync(scriptPath)) {
        issues.push({
          type: 'error',
          message: `Broken script reference: ${src}`,
          autoFixable: false
        });
      }
    }
  }

  // Check link hrefs (CSS)
  const linkHrefs = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"/gi)];
  for (const match of linkHrefs) {
    const href = match[1];
    if (!href.startsWith('http') && !href.startsWith('//')) {
      const cssPath = path.join(distDir, href);
      if (!fs.existsSync(cssPath)) {
        issues.push({
          type: 'error',
          message: `Broken CSS reference: ${href}`,
          autoFixable: false
        });
      }
    }
  }

  // Check 10: Proper closing tags
  const openTags = html.match(/<(html|head|body|div|script|style)[^>]*>/gi) || [];
  const closeTags = html.match(/<\/(html|head|body|div|script|style)>/gi) || [];
  
  if (openTags.length !== closeTags.length) {
    issues.push({
      type: 'warning',
      message: 'Possible unclosed tags detected',
      autoFixable: false
    });
  }

  // Check 11: Duplicate IDs
  const idMatches = [...html.matchAll(/id="([^"]+)"/gi)];
  const ids = idMatches.map(m => m[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  
  if (duplicateIds.length > 0) {
    issues.push({
      type: 'error',
      message: `Duplicate IDs found: ${duplicateIds.join(', ')}`,
      autoFixable: false
    });
  }

  // Check 12: Proper indentation and formatting
  if (html.includes('><') && !html.includes('>\n')) {
    issues.push({
      type: 'info',
      message: 'HTML could benefit from better formatting',
      autoFixable: true,
      fix: () => {
        html = formatHTML(html);
        modified = true;
      }
    });
  }

  // Apply fixes if requested
  if (autoFix) {
    for (const issue of issues) {
      if (issue.autoFixable && issue.fix) {
        issue.fix();
        fixed = true;
      }
    }

    // Write fixed HTML back to file
    if (modified) {
      fs.writeFileSync(filePath, html, 'utf8');
    }
  }

  const valid = issues.filter(i => i.type === 'error').length === 0;

  return {
    valid,
    issues,
    fixed: modified
  };
}

/**
 * Format HTML with proper indentation
 */
function formatHTML(html: string): string {
  // Simple HTML formatter
  let formatted = html;
  let indent = 0;
  const lines: string[] = [];
  
  // Split by tags
  const parts = formatted.split(/(<[^>]+>)/g).filter(p => p.trim());
  
  for (const part of parts) {
    if (part.startsWith('</')) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + part);
    } else if (part.startsWith('<') && !part.endsWith('/>') && !part.startsWith('<!')) {
      // Opening tag
      lines.push('  '.repeat(indent) + part);
      if (!part.match(/<(meta|link|br|hr|img|input)/i)) {
        indent++;
      }
    } else if (part.startsWith('<')) {
      // Self-closing or special tag
      lines.push('  '.repeat(indent) + part);
    } else {
      // Text content
      const trimmed = part.trim();
      if (trimmed) {
        lines.push('  '.repeat(indent) + trimmed);
      }
    }
  }
  
  return lines.join('\n');
}

/**
 * Validate all HTML files in a directory
 */
export function validateHTMLDirectory(dir: string, autoFix: boolean = false): Map<string, HTMLValidationResult> {
  const results = new Map<string, HTMLValidationResult>();
  
  if (!fs.existsSync(dir)) {
    return results;
  }

  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  
  for (const file of files) {
    if (file.endsWith('.html')) {
      const filePath = path.join(dir, file);
      const result = validateHTML(filePath, autoFix);
      results.set(file, result);
    }
  }
  
  return results;
}

/**
 * Print validation results
 */
export function printValidationResults(results: Map<string, HTMLValidationResult>): void {
  let totalIssues = 0;
  let totalFixed = 0;
  
  for (const [file, result] of results) {
    if (result.issues.length > 0) {
      logger.info(`\nValidating: ${file}`);
      
      for (const issue of result.issues) {
        totalIssues++;
        
        const icon = issue.type === 'error' ? '[ERROR]' : issue.type === 'warning' ? '[WARNING]' : '[INFO]';
        const fixable = issue.autoFixable ? '(auto-fixable)' : '';
        
        logger.info(`  ${icon} ${issue.message} ${fixable}`);
      }
      
      if (result.fixed) {
        totalFixed++;
        logger.success(`  [FIXED] Auto-fixed issues in ${file}`);
      }
    }
  }
  
  if (totalIssues === 0) {
    logger.success('All HTML files are valid!');
  } else {
    logger.info(`\nTotal issues found: ${totalIssues}`);
    if (totalFixed > 0) {
      logger.success(`Auto-fixed: ${totalFixed} files`);
    }
  }
}
