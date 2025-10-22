/**
 * TypeScript Type Checker for Build-Time Validation
 * Runs TypeScript compiler to check for errors before building
 */

import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from './logger.js';

export interface TypeCheckResult {
  success: boolean;
  errors: ts.Diagnostic[];
  errorCount: number;
  warningCount: number;
}

/**
 * Run TypeScript type checking on the project
 */
export function runTypeCheck(projectRoot: string): TypeCheckResult {
  const configPath = path.join(projectRoot, 'tsconfig.json');
  
  // Check if tsconfig.json exists
  if (!fs.existsSync(configPath)) {
    logger.warning('No tsconfig.json found, skipping type checking');
    return {
      success: true,
      errors: [],
      errorCount: 0,
      warningCount: 0
    };
  }

  logger.info('Running TypeScript type checking...');

  // Read and parse tsconfig.json
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  
  if (configFile.error) {
    logger.error('Failed to read tsconfig.json', configFile.error as any);
    return {
      success: false,
      errors: [configFile.error],
      errorCount: 1,
      warningCount: 0
    };
  }

  // Parse the config
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    projectRoot
  );

  if (parsedConfig.errors.length > 0) {
    logger.error('Invalid tsconfig.json');
    parsedConfig.errors.forEach(diagnostic => {
      printDiagnostic(diagnostic);
    });
    return {
      success: false,
      errors: parsedConfig.errors,
      errorCount: parsedConfig.errors.length,
      warningCount: 0
    };
  }

  // Create TypeScript program
  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: {
      ...parsedConfig.options,
      noEmit: true, // We only want to check, not emit files
      skipLibCheck: true // Skip checking node_modules
    }
  });

  // Get all diagnostics
  const allDiagnostics = [
    ...program.getSemanticDiagnostics(),
    ...program.getSyntacticDiagnostics(),
    ...program.getDeclarationDiagnostics()
  ];

  // Separate errors and warnings
  const errors = allDiagnostics.filter(d => d.category === ts.DiagnosticCategory.Error);
  const warnings = allDiagnostics.filter(d => d.category === ts.DiagnosticCategory.Warning);

  // Print diagnostics
  if (allDiagnostics.length > 0) {
    logger.error(`\n❌ Found ${errors.length} error(s) and ${warnings.length} warning(s)\n`);
    
    allDiagnostics.forEach(diagnostic => {
      printDiagnostic(diagnostic);
    });
  } else {
    logger.success('✅ No type errors found');
  }

  return {
    success: errors.length === 0,
    errors: allDiagnostics,
    errorCount: errors.length,
    warningCount: warnings.length
  };
}

/**
 * Print a TypeScript diagnostic in a readable format
 */
function printDiagnostic(diagnostic: ts.Diagnostic): void {
  if (diagnostic.file && diagnostic.start !== undefined) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const fileName = path.relative(process.cwd(), diagnostic.file.fileName);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    
    const category = diagnostic.category === ts.DiagnosticCategory.Error ? '❌ ERROR' : '⚠️  WARNING';
    
    console.log(`\n${category}: ${fileName}:${line + 1}:${character + 1}`);
    console.log(`  ${message}`);
    
    // Show code snippet
    if (diagnostic.file && diagnostic.start !== undefined && diagnostic.length !== undefined) {
      const sourceText = diagnostic.file.text;
      const lineStart = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line;
      const lines = sourceText.split('\n');
      
      // Show 2 lines before and after
      const startLine = Math.max(0, lineStart - 1);
      const endLine = Math.min(lines.length - 1, lineStart + 2);
      
      console.log('\n  Code:');
      for (let i = startLine; i <= endLine; i++) {
        const lineNum = (i + 1).toString().padStart(4, ' ');
        const marker = i === lineStart ? '>' : ' ';
        console.log(`  ${marker} ${lineNum} | ${lines[i]}`);
        
        // Show error underline
        if (i === lineStart) {
          const col = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!).character;
          const underline = ' '.repeat(col + 10) + '^'.repeat(Math.min(diagnostic.length!, 50));
          console.log(`  ${underline}`);
        }
      }
    }
  } else {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    const category = diagnostic.category === ts.DiagnosticCategory.Error ? '❌ ERROR' : '⚠️  WARNING';
    console.log(`\n${category}: ${message}`);
  }
}

/**
 * Quick syntax check without full type checking (faster)
 */
export function quickSyntaxCheck(filePath: string): boolean {
  try {
    const source = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true
    );
    
    // Check for syntax errors
    const diagnostics = (sourceFile as any).parseDiagnostics || [];
    
    if (diagnostics.length > 0) {
      diagnostics.forEach((d: ts.Diagnostic) => printDiagnostic(d));
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error(`Syntax check failed for ${filePath}`, error as Error);
    return false;
  }
}
