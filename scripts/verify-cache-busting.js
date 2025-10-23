#!/usr/bin/env node

/**
 * Verify Cache-Busting Implementation
 * Checks if your built files have proper cache-busting setup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, checks) {
  if (!fs.existsSync(filePath)) {
    log(`✗ File not found: ${filePath}`, 'red');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let allPassed = true;

  checks.forEach(({ name, test, required = true }) => {
    const passed = test(content);
    if (passed) {
      log(`  ✓ ${name}`, 'green');
    } else {
      if (required) {
        log(`  ✗ ${name}`, 'red');
        allPassed = false;
      } else {
        log(`  ⚠ ${name} (optional)`, 'yellow');
      }
    }
  });

  return allPassed;
}

function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('  Rynex Cache-Busting Verification', 'bold');
  log('='.repeat(60) + '\n', 'blue');

  const projectRoot = process.cwd();
  const distDir = path.join(projectRoot, 'dist');
  const publicDir = path.join(projectRoot, 'public');

  // Check if dist exists
  if (!fs.existsSync(distDir)) {
    log('✗ dist/ directory not found. Please run "npm run build" first.', 'red');
    process.exit(1);
  }

  log('Checking built files in dist/...\n', 'blue');

  // Check index.html in dist
  const distIndexPath = path.join(distDir, 'index.html');
  log('1. Checking dist/index.html:', 'bold');
  
  const indexChecks = [
    {
      name: 'Has Cache-Control meta tag',
      test: (content) => content.includes('Cache-Control') && content.includes('no-cache')
    },
    {
      name: 'Has Pragma meta tag',
      test: (content) => content.includes('Pragma') && content.includes('no-cache')
    },
    {
      name: 'Has Expires meta tag',
      test: (content) => content.includes('Expires') && content.includes('0')
    },
    {
      name: 'Has build-version meta tag',
      test: (content) => content.includes('build-version'),
      required: false
    },
    {
      name: 'JS files have version query params (?v=)',
      test: (content) => {
        const jsMatches = content.match(/src="[^"]*\.js[^"]*"/g);
        if (!jsMatches) return true; // No JS files
        return jsMatches.some(match => match.includes('?v='));
      }
    },
    {
      name: 'CSS files have version query params (?v=)',
      test: (content) => {
        const cssMatches = content.match(/href="[^"]*\.css[^"]*"/g);
        if (!cssMatches) return true; // No CSS files
        return cssMatches.some(match => match.includes('?v='));
      }
    }
  ];

  const indexPassed = checkFile(distIndexPath, indexChecks);

  // Check if bundle.js exists
  log('\n2. Checking bundle files:', 'bold');
  const bundleJsPath = path.join(distDir, 'bundle.js');
  const bundleCssPath = path.join(distDir, 'styles.css');

  if (fs.existsSync(bundleJsPath)) {
    log('  ✓ bundle.js exists', 'green');
  } else {
    log('  ⚠ bundle.js not found (may be in subdirectory)', 'yellow');
  }

  if (fs.existsSync(bundleCssPath)) {
    log('  ✓ styles.css exists', 'green');
  } else {
    log('  ⚠ styles.css not found (may be in subdirectory)', 'yellow');
  }

  // Check source HTML if exists
  log('\n3. Checking source HTML (public/index.html):', 'bold');
  const publicIndexPath = path.join(publicDir, 'index.html');
  
  if (fs.existsSync(publicIndexPath)) {
    const sourceChecks = [
      {
        name: 'Has Cache-Control meta tag',
        test: (content) => content.includes('Cache-Control') && content.includes('no-cache')
      },
      {
        name: 'Has Pragma meta tag',
        test: (content) => content.includes('Pragma') && content.includes('no-cache')
      },
      {
        name: 'Has Expires meta tag',
        test: (content) => content.includes('Expires') && content.includes('0')
      }
    ];
    checkFile(publicIndexPath, sourceChecks);
  } else {
    log('  ⚠ public/index.html not found (may use different structure)', 'yellow');
  }

  // Extract and display build version
  log('\n4. Build Information:', 'bold');
  if (fs.existsSync(distIndexPath)) {
    const content = fs.readFileSync(distIndexPath, 'utf8');
    const versionMatch = content.match(/build-version["']?\s*content=["']([^"']+)["']/);
    const queryMatch = content.match(/\?v=([a-f0-9]+)/);
    
    if (versionMatch) {
      log(`  Build Version: ${versionMatch[1]}`, 'green');
    } else if (queryMatch) {
      log(`  Build Version: ${queryMatch[1]} (from query param)`, 'green');
    } else {
      log('  ⚠ No build version found', 'yellow');
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  if (indexPassed) {
    log('  ✓ Cache-busting is properly configured!', 'green');
    log('  Your site will always serve fresh content to users.', 'green');
  } else {
    log('  ✗ Some cache-busting checks failed.', 'red');
    log('  Please rebuild your project: npm run build', 'yellow');
  }
  log('='.repeat(60) + '\n', 'blue');

  // Tips
  log('Tips:', 'bold');
  log('  • Run "npm run build" to regenerate with cache-busting', 'blue');
  log('  • Each build creates a unique version identifier', 'blue');
  log('  • Deploy the dist/ folder to your hosting provider', 'blue');
  log('  • See docs/CACHE-BUSTING.md for more information\n', 'blue');

  process.exit(indexPassed ? 0 : 1);
}

main();
