/**
 * Rynex Build-Time Validator
 * Validates Rynex-specific function calls at build time
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger.js';

interface ValidationError {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
}

interface ValidationRule {
  argIndex: number;
  type: string;
  notEmpty?: boolean;
  requiredProps?: string[];
  message: string;
}

interface FunctionRule {
  minArgs: number;
  rules: ValidationRule[];
}

// Rynex function validation rules
const RYNEX_VALIDATION_RULES: Record<string, FunctionRule> = {
  createElement: {
    minArgs: 1,
    rules: [
      { argIndex: 0, type: 'string', notEmpty: true, message: 'Tag name cannot be empty' }
    ]
  },
  image: {
    minArgs: 1,
    rules: [
      { argIndex: 0, type: 'object', requiredProps: ['src'], message: 'image() requires src property' }
    ]
  },
  link: {
    minArgs: 1,
    rules: [
      { argIndex: 0, type: 'object', requiredProps: ['href'], message: 'link() requires href property' }
    ]
  },
  list: {
    minArgs: 1,
    rules: [
      { argIndex: 0, type: 'object', requiredProps: ['items', 'renderItem'], message: 'list() requires items and renderItem properties' }
    ]
  },
  abbr: {
    minArgs: 1,
    rules: [
      { argIndex: 0, type: 'object', requiredProps: ['title'], message: 'abbr() requires title property' }
    ]
  }
};

/**
 * Validate Rynex function calls in source code
 */
export function validateRynexCode(projectRoot: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const srcDir = path.join(projectRoot, 'src');

  if (!fs.existsSync(srcDir)) {
    return errors;
  }

  // Get all TypeScript files
  const files = getAllTypeScriptFiles(srcDir);

  for (const file of files) {
    const fileErrors = validateFile(file);
    errors.push(...fileErrors);
  }

  return errors;
}

/**
 * Get all TypeScript files recursively
 */
function getAllTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];

  function scan(currentDir: string) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and dist
        if (item !== 'node_modules' && item !== 'dist') {
          scan(fullPath);
        }
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files;
}

/**
 * Validate a single file
 */
function validateFile(filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const source = fs.readFileSync(filePath, 'utf-8');

  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true
  );

  // Visit all nodes in the AST
  function visit(node: ts.Node) {
    // Check for function calls
    if (ts.isCallExpression(node)) {
      const functionName = getFunctionName(node);
      
      if (functionName && RYNEX_VALIDATION_RULES[functionName as keyof typeof RYNEX_VALIDATION_RULES]) {
        const error = validateRynexFunctionCall(node, functionName, filePath, sourceFile);
        if (error) {
          errors.push(error);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return errors;
}

/**
 * Get function name from call expression
 */
function getFunctionName(node: ts.CallExpression): string | null {
  if (ts.isIdentifier(node.expression)) {
    return node.expression.text;
  }
  return null;
}

/**
 * Validate a Rynex function call
 */
function validateRynexFunctionCall(
  node: ts.CallExpression,
  functionName: string,
  filePath: string,
  sourceFile: ts.SourceFile
): ValidationError | null {
  const rules = RYNEX_VALIDATION_RULES[functionName as keyof typeof RYNEX_VALIDATION_RULES];
  
  if (!rules) return null;

  // Check minimum arguments
  if (node.arguments.length < rules.minArgs) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    return {
      file: filePath,
      line: line + 1,
      column: character + 1,
      message: `${functionName}() requires at least ${rules.minArgs} argument(s)`,
      code: sourceFile.text.substring(node.getStart(), node.getEnd())
    };
  }

  // Check each rule
  for (const rule of rules.rules) {
    const arg = node.arguments[rule.argIndex];
    if (!arg) continue;

    // Check for empty string
    if (rule.notEmpty && ts.isStringLiteral(arg)) {
      if (arg.text === '') {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(arg.getStart());
        return {
          file: filePath,
          line: line + 1,
          column: character + 1,
          message: rule.message,
          code: sourceFile.text.substring(node.getStart(), node.getEnd())
        };
      }
    }

    // Check for required object properties
    if (rule.requiredProps && ts.isObjectLiteralExpression(arg)) {
      const props = arg.properties.map((p: ts.ObjectLiteralElementLike) => {
        if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name)) {
          return p.name.text;
        }
        return null;
      }).filter(Boolean) as string[];

      const missingProps = rule.requiredProps.filter(p => !props.includes(p));
      
      if (missingProps.length > 0) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(arg.getStart());
        return {
          file: filePath,
          line: line + 1,
          column: character + 1,
          message: `${rule.message} (missing: ${missingProps.join(', ')})`,
          code: sourceFile.text.substring(node.getStart(), node.getEnd())
        };
      }
    }
  }

  return null;
}

/**
 * Print validation errors
 */
export function printValidationErrors(errors: ValidationError[]): void {
  if (errors.length === 0) {
    logger.success('✅ No Rynex validation errors found');
    return;
  }

  logger.error(`\n❌ Found ${errors.length} Rynex validation error(s)\n`);

  for (const error of errors) {
    const relativePath = path.relative(process.cwd(), error.file);
    console.log(`\n❌ RYNEX ERROR: ${relativePath}:${error.line}:${error.column}`);
    console.log(`  ${error.message}`);
    console.log(`\n  Code:`);
    
    // Show the problematic code
    const lines = error.code.split('\n');
    lines.forEach((line, idx) => {
      const lineNum = (error.line + idx).toString().padStart(4, ' ');
      console.log(`    ${lineNum} | ${line}`);
    });
    console.log('');
  }
}

/**
 * Run Rynex validation
 */
export function runRynexValidation(projectRoot: string): boolean {
  logger.info('Running Rynex validation...');
  
  const errors = validateRynexCode(projectRoot);
  printValidationErrors(errors);
  
  return errors.length === 0;
}
