import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { logger } from "./logger.js";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

interface ValidationError {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
  severity: "error" | "warning" | "info";
  ruleId: string;
  suggestion?: string;
}

interface ValidationRule {
  argIndex: number;
  type: string;
  notEmpty?: boolean;
  requiredProps?: string[];
  optionalProps?: string[];
  typeValidation?: (value: any) => boolean;
  message: string;
  severity?: "error" | "warning";
}

interface FunctionRule {
  minArgs: number;
  maxArgs?: number;
  rules: ValidationRule[];
  category: string;
  description: string;
}

interface ValidatorConfig {
  strict: boolean;
  checkOptionalProps: boolean;
  checkPerformance: boolean;
  maxComplexity: number;
  enableCache: boolean;
}

const DEFAULT_CONFIG: ValidatorConfig = {
  strict: true,
  checkOptionalProps: true,
  checkPerformance: true,
  maxComplexity: 10,
  enableCache: true,
};

const RYNEX_VALIDATION_RULES: Record<string, FunctionRule> = {
  createElement: {
    minArgs: 1,
    maxArgs: 3,
    category: "DOM",
    description: "Create DOM element with props and children",
    rules: [
      {
        argIndex: 0,
        type: "string",
        notEmpty: true,
        message: "Tag name cannot be empty",
        severity: "error",
      },
      {
        argIndex: 1,
        type: "object",
        optionalProps: [
          "class",
          "id",
          "style",
          "onClick",
          "onChange",
          "onHover",
          "onInput",
          "onFocus",
          "onBlur",
        ],
        message: "Props should be a valid object",
        severity: "warning",
      },
    ],
  },
  image: {
    minArgs: 1,
    maxArgs: 1,
    category: "Elements",
    description: "Create image element with src and optional alt",
    rules: [
      {
        argIndex: 0,
        type: "object",
        requiredProps: ["src"],
        optionalProps: ["alt", "lazy", "loading", "width", "height"],
        message: "image() requires src property",
        severity: "error",
      },
    ],
  },
  link: {
    minArgs: 1,
    maxArgs: 2,
    category: "Elements",
    description: "Create anchor/link element",
    rules: [
      {
        argIndex: 0,
        type: "object",
        requiredProps: ["href"],
        optionalProps: ["target", "rel", "title", "class"],
        message: "link() requires href property",
        severity: "error",
      },
    ],
  },
  list: {
    minArgs: 1,
    maxArgs: 1,
    category: "Elements",
    description: "Render list with items and renderItem function",
    rules: [
      {
        argIndex: 0,
        type: "object",
        requiredProps: ["items", "renderItem"],
        optionalProps: ["keyExtractor"],
        message: "list() requires items and renderItem properties",
        severity: "error",
      },
    ],
  },
  abbr: {
    minArgs: 1,
    maxArgs: 2,
    category: "Typography",
    description: "Create abbreviation element",
    rules: [
      {
        argIndex: 0,
        type: "object",
        requiredProps: ["title"],
        message: "abbr() requires title property",
        severity: "error",
      },
    ],
  },
  vbox: {
    minArgs: 0,
    category: "Layout",
    description: "Vertical flex layout container (Builder API)",
    rules: [],
  },
  hbox: {
    minArgs: 0,
    category: "Layout",
    description: "Horizontal flex layout container (Builder API)",
    rules: [],
  },
  grid: {
    minArgs: 0,
    category: "Layout",
    description: "Grid layout container (Builder API)",
    rules: [],
  },
  div: {
    minArgs: 0,
    category: "Elements",
    description: "Div element (Builder API)",
    rules: [],
  },
  card: {
    minArgs: 0,
    category: "Components",
    description: "Card component container (Builder API)",
    rules: [],
  },
  button: {
    minArgs: 0,
    category: "Elements",
    description: "Button element (Builder API)",
    rules: [],
  },
  tabs: {
    minArgs: 0,
    category: "Components",
    description: "Tabs component (Builder API)",
    rules: [],
  },
  accordion: {
    minArgs: 0,
    category: "Components",
    description: "Accordion component (Builder API)",
    rules: [],
  },
  badge: {
    minArgs: 0,
    category: "Components",
    description: "Badge component (Builder API)",
    rules: [],
  },
  avatar: {
    minArgs: 0,
    category: "Components",
    description: "Avatar component (Builder API)",
    rules: [],
  },
  icon: {
    minArgs: 0,
    category: "Components",
    description: "Icon component (Builder API)",
    rules: [],
  },
  tooltip: {
    minArgs: 0,
    category: "Components",
    description: "Tooltip component (Builder API)",
    rules: [],
  },
  dropdown: {
    minArgs: 0,
    category: "Components",
    description: "Dropdown component (Builder API)",
    rules: [],
  },
  toggle: {
    minArgs: 0,
    category: "Components",
    description: "Toggle component (Builder API)",
    rules: [],
  },
  slider: {
    minArgs: 0,
    category: "Components",
    description: "Slider component (Builder API)",
    rules: [],
  },
  progressBar: {
    minArgs: 0,
    category: "Components",
    description: "Progress bar component (Builder API)",
    rules: [],
  },
  spinner: {
    minArgs: 0,
    category: "Components",
    description: "Spinner component (Builder API)",
    rules: [],
  },
  createStore: {
    minArgs: 2,
    maxArgs: 3,
    category: "State",
    description: "Create global reactive store",
    rules: [
      {
        argIndex: 0,
        type: "string",
        notEmpty: true,
        message: "Store name must be a non-empty string",
        severity: "error",
      },
      {
        argIndex: 1,
        type: "object",
        message: "Initial state must be an object",
        severity: "error",
      },
    ],
  },
  useStore: {
    minArgs: 1,
    maxArgs: 1,
    category: "State",
    description: "Use existing global store",
    rules: [
      {
        argIndex: 0,
        type: "string",
        notEmpty: true,
        message: "Store name must be a non-empty string",
        severity: "error",
      },
    ],
  },
  createContext: {
    minArgs: 0,
    maxArgs: 1,
    category: "State",
    description: "Create context for state sharing",
    rules: [],
  },
  useContext: {
    minArgs: 1,
    maxArgs: 1,
    category: "State",
    description: "Use context value",
    rules: [
      {
        argIndex: 0,
        type: "object",
        requiredProps: ["key"],
        message: "useContext() requires context object with key",
        severity: "error",
      },
    ],
  },
  onMount: {
    minArgs: 2,
    maxArgs: 2,
    category: "Lifecycle",
    description: "Execute callback on element mount",
    rules: [
      {
        argIndex: 0,
        type: "object",
        message: "First argument must be HTMLElement",
        severity: "error",
      },
      {
        argIndex: 1,
        type: "function",
        message: "Second argument must be a function",
        severity: "error",
      },
    ],
  },
  onUnmount: {
    minArgs: 2,
    maxArgs: 2,
    category: "Lifecycle",
    description: "Execute callback on element unmount",
    rules: [
      {
        argIndex: 0,
        type: "object",
        message: "First argument must be HTMLElement",
        severity: "error",
      },
      {
        argIndex: 1,
        type: "function",
        message: "Second argument must be a function",
        severity: "error",
      },
    ],
  },
  watch: {
    minArgs: 2,
    maxArgs: 3,
    category: "Lifecycle",
    description: "Watch reactive value for changes",
    rules: [
      {
        argIndex: 0,
        type: "function",
        message: "First argument must be a getter function",
        severity: "error",
      },
      {
        argIndex: 1,
        type: "function",
        message: "Second argument must be a callback function",
        severity: "error",
      },
    ],
  },
  debounce: {
    minArgs: 2,
    maxArgs: 2,
    category: "Performance",
    description: "Debounce function execution",
    rules: [
      {
        argIndex: 0,
        type: "function",
        message: "First argument must be a function",
        severity: "error",
      },
      {
        argIndex: 1,
        type: "number",
        message: "Second argument must be a number (wait time in ms)",
        severity: "error",
      },
    ],
  },
  throttle: {
    minArgs: 2,
    maxArgs: 2,
    category: "Performance",
    description: "Throttle function execution",
    rules: [
      {
        argIndex: 0,
        type: "function",
        message: "First argument must be a function",
        severity: "error",
      },
      {
        argIndex: 1,
        type: "number",
        message: "Second argument must be a number (limit in ms)",
        severity: "error",
      },
    ],
  },
  animate: {
    minArgs: 2,
    maxArgs: 2,
    category: "Animation",
    description: "Animate element using Web Animations API",
    rules: [
      {
        argIndex: 0,
        type: "object",
        message: "First argument must be HTMLElement",
        severity: "error",
      },
      {
        argIndex: 1,
        type: "object",
        requiredProps: ["keyframes"],
        optionalProps: ["duration", "easing", "delay", "iterations"],
        message: "Second argument must be animation config with keyframes",
        severity: "error",
      },
    ],
  },
  transition: {
    minArgs: 1,
    maxArgs: 2,
    category: "Animation",
    description: "Apply CSS transition to element",
    rules: [
      {
        argIndex: 0,
        type: "object",
        message: "First argument must be HTMLElement",
        severity: "error",
      },
    ],
  },
};

interface ValidationContext {
  config: ValidatorConfig;
  cache: Map<string, ValidationError[]>;
  stats: {
    filesChecked: number;
    functionsValidated: number;
    errorsFound: number;
    warningsFound: number;
  };
}

const validationCache = new Map<string, ValidationError[]>();

export function validateRynexCode(
  projectRoot: string,
  config: Partial<ValidatorConfig> = {},
): ValidationError[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const context: ValidationContext = {
    config: finalConfig,
    cache: validationCache,
    stats: {
      filesChecked: 0,
      functionsValidated: 0,
      errorsFound: 0,
      warningsFound: 0,
    },
  };

  const errors: ValidationError[] = [];
  const srcDir = path.join(projectRoot, "src");

  if (!fs.existsSync(srcDir)) {
    return errors;
  }

  const files = getAllTypeScriptFiles(srcDir);

  for (const file of files) {
    const fileErrors = validateFile(file, context);
    errors.push(...fileErrors);
    context.stats.filesChecked++;
  }

  return errors;
}

function getAllTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];
  const excludeDirs = new Set([
    "node_modules",
    "dist",
    ".git",
    "build",
    "coverage",
  ]);

  function scan(currentDir: string) {
    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        if (item.startsWith(".")) continue;

        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (!excludeDirs.has(item)) {
            scan(fullPath);
          }
        } else if (item.endsWith(".ts") || item.endsWith(".tsx")) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${currentDir}`);
    }
  }

  scan(dir);
  return files;
}

function validateFile(
  filePath: string,
  context: ValidationContext,
): ValidationError[] {
  if (context.config.enableCache && validationCache.has(filePath)) {
    return validationCache.get(filePath) || [];
  }

  const errors: ValidationError[] = [];

  try {
    const source = fs.readFileSync(filePath, "utf-8");
    const sourceFile = ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true,
    );

    function visit(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        const functionName = getFunctionName(node);

        if (
          functionName &&
          RYNEX_VALIDATION_RULES[
            functionName as keyof typeof RYNEX_VALIDATION_RULES
          ]
        ) {
          const error = validateRynexFunctionCall(
            node,
            functionName,
            filePath,
            sourceFile,
            context,
          );
          if (error) {
            errors.push(error);
            context.stats.functionsValidated++;
            if (error.severity === "error") {
              context.stats.errorsFound++;
            } else if (error.severity === "warning") {
              context.stats.warningsFound++;
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  } catch (error) {
    console.warn(`Warning: Could not validate file ${filePath}`);
  }

  if (context.config.enableCache) {
    validationCache.set(filePath, errors);
  }

  return errors;
}

function getFunctionName(node: ts.CallExpression): string | null {
  if (ts.isIdentifier(node.expression)) {
    return node.expression.text;
  }
  if (ts.isPropertyAccessExpression(node.expression)) {
    return node.expression.name.text;
  }
  return null;
}

function getArgumentType(arg: ts.Expression): string {
  if (ts.isStringLiteral(arg)) return "string";
  if (ts.isNumericLiteral(arg)) return "number";
  if (
    arg.kind === ts.SyntaxKind.TrueKeyword ||
    arg.kind === ts.SyntaxKind.FalseKeyword
  )
    return "boolean";
  if (ts.isObjectLiteralExpression(arg)) return "object";
  if (ts.isArrayLiteralExpression(arg)) return "array";
  if (ts.isFunctionExpression(arg) || ts.isArrowFunction(arg))
    return "function";
  if (ts.isIdentifier(arg)) return "identifier";
  return "unknown";
}

function extractObjectProperties(arg: ts.Expression): string[] {
  if (!ts.isObjectLiteralExpression(arg)) return [];

  return arg.properties
    .map((p: ts.ObjectLiteralElementLike) => {
      if (ts.isPropertyAssignment(p)) {
        if (ts.isIdentifier(p.name)) return p.name.text;
        if (ts.isStringLiteral(p.name)) return p.name.text;
      }
      return null;
    })
    .filter((p): p is string => p !== null);
}

function validateRynexFunctionCall(
  node: ts.CallExpression,
  functionName: string,
  filePath: string,
  sourceFile: ts.SourceFile,
  context: ValidationContext,
): ValidationError | null {
  const rules =
    RYNEX_VALIDATION_RULES[functionName as keyof typeof RYNEX_VALIDATION_RULES];

  if (!rules) return null;

  const { line, character } = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(),
  );
  const codeSnippet = sourceFile.text.substring(
    node.getStart(),
    Math.min(node.getEnd(), node.getStart() + 100),
  );

  if (node.arguments.length < rules.minArgs) {
    return {
      file: filePath,
      line: line + 1,
      column: character + 1,
      message: `${functionName}() requires at least ${rules.minArgs} argument(s), got ${node.arguments.length}`,
      code: codeSnippet,
      severity: "error",
      ruleId: `${functionName}/min-args`,
      suggestion: `Add missing arguments to ${functionName}() call`,
    };
  }

  if (rules.maxArgs !== undefined && node.arguments.length > rules.maxArgs) {
    return {
      file: filePath,
      line: line + 1,
      column: character + 1,
      message: `${functionName}() accepts at most ${rules.maxArgs} argument(s), got ${node.arguments.length}`,
      code: codeSnippet,
      severity: "warning",
      ruleId: `${functionName}/max-args`,
      suggestion: `Remove extra arguments from ${functionName}() call`,
    };
  }

  for (const rule of rules.rules) {
    const arg = node.arguments[rule.argIndex];
    if (!arg) continue;

    const argType = getArgumentType(arg);
    const { line: argLine, character: argChar } =
      sourceFile.getLineAndCharacterOfPosition(arg.getStart());

    if (rule.type === "string" && rule.notEmpty && ts.isStringLiteral(arg)) {
      if (arg.text === "") {
        return {
          file: filePath,
          line: argLine + 1,
          column: argChar + 1,
          message: rule.message,
          code: codeSnippet,
          severity: rule.severity || "error",
          ruleId: `${functionName}/empty-string`,
          suggestion: `Provide a non-empty string value`,
        };
      }
    }

    if (rule.type === "object" && ts.isObjectLiteralExpression(arg)) {
      const props = extractObjectProperties(arg);

      if (rule.requiredProps) {
        const missingProps = rule.requiredProps.filter(
          (p) => !props.includes(p),
        );

        if (missingProps.length > 0) {
          return {
            file: filePath,
            line: argLine + 1,
            column: argChar + 1,
            message: `${rule.message} (missing: ${missingProps.join(", ")})`,
            code: codeSnippet,
            severity: rule.severity || "error",
            ruleId: `${functionName}/missing-props`,
            suggestion: `Add required properties: ${missingProps.join(", ")}`,
          };
        }
      }

      if (context.config.checkOptionalProps && rule.optionalProps) {
        const unusedProps = props.filter(
          (p) =>
            !rule.requiredProps?.includes(p) &&
            !rule.optionalProps?.includes(p),
        );

        if (unusedProps.length > 0 && context.config.strict) {
          return {
            file: filePath,
            line: argLine + 1,
            column: argChar + 1,
            message: `${functionName}() has unexpected properties: ${unusedProps.join(", ")}`,
            code: codeSnippet,
            severity: "warning",
            ruleId: `${functionName}/unexpected-props`,
            suggestion: `Remove or verify these properties: ${unusedProps.join(", ")}`,
          };
        }
      }
    }

    if (
      rule.type === "function" &&
      !ts.isFunctionExpression(arg) &&
      !ts.isArrowFunction(arg) &&
      !ts.isIdentifier(arg)
    ) {
      return {
        file: filePath,
        line: argLine + 1,
        column: argChar + 1,
        message: rule.message,
        code: codeSnippet,
        severity: rule.severity || "error",
        ruleId: `${functionName}/invalid-function`,
        suggestion: `Provide a function reference or arrow function`,
      };
    }

    if (
      rule.type === "number" &&
      !ts.isNumericLiteral(arg) &&
      !ts.isIdentifier(arg)
    ) {
      return {
        file: filePath,
        line: argLine + 1,
        column: argChar + 1,
        message: rule.message,
        code: codeSnippet,
        severity: rule.severity || "error",
        ruleId: `${functionName}/invalid-number`,
        suggestion: `Provide a numeric value`,
      };
    }
  }

  return null;
}

interface ValidationReport {
  totalErrors: number;
  totalWarnings: number;
  totalInfos: number;
  errorsByFile: Record<string, ValidationError[]>;
  errorsByCategory: Record<string, ValidationError[]>;
  errorsByRule: Record<string, ValidationError[]>;
  timestamp: string;
  duration: number;
}

function generateValidationReport(
  errors: ValidationError[],
  duration: number,
): ValidationReport {
  const report: ValidationReport = {
    totalErrors: 0,
    totalWarnings: 0,
    totalInfos: 0,
    errorsByFile: {},
    errorsByCategory: {},
    errorsByRule: {},
    timestamp: new Date().toISOString(),
    duration,
  };

  for (const error of errors) {
    if (error.severity === "error") report.totalErrors++;
    else if (error.severity === "warning") report.totalWarnings++;
    else report.totalInfos++;

    if (!report.errorsByFile[error.file]) {
      report.errorsByFile[error.file] = [];
    }
    report.errorsByFile[error.file].push(error);

    if (!report.errorsByRule[error.ruleId]) {
      report.errorsByRule[error.ruleId] = [];
    }
    report.errorsByRule[error.ruleId].push(error);
  }

  return report;
}

export function printValidationErrors(
  errors: ValidationError[],
  verbose: boolean = false,
): void {
  if (errors.length === 0) {
    console.log(`\n ${colors.green}  No Rynex validation errors found\n`);
    return;
  }

  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;
  const infoCount = errors.filter((e) => e.severity === "info").length;

  console.log(
    `\n  ${colors.bold}Found ${errors.length} issue(s): ${colors.red}${errorCount} error(s)${colors.reset}${colors.bold}, ${colors.yellow}${warningCount} warning(s)${colors.reset}${colors.bold}, ${colors.blue}${infoCount} info(s)${colors.reset}${colors.bold}${colors.reset}\n`,
  );

  const errorsByFile: Record<string, ValidationError[]> = {};
  for (const error of errors) {
    if (!errorsByFile[error.file]) {
      errorsByFile[error.file] = [];
    }
    errorsByFile[error.file].push(error);
  }

  for (const [file, fileErrors] of Object.entries(errorsByFile)) {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`  ${colors.cyan}${relativePath}${colors.reset}`);

    for (const error of fileErrors) {
      let severityColor = colors.blue;
      let severityLabel = "INFO";

      if (error.severity === "error") {
        severityColor = colors.red;
        severityLabel = "ERROR";
      } else if (error.severity === "warning") {
        severityColor = colors.yellow;
        severityLabel = "WARN";
      }

      console.log(
        `    ${colors.gray}${error.line}:${error.column}${colors.reset} ${colors.bold}[${severityColor}${severityLabel}${colors.reset}${colors.bold}]${colors.reset} ${error.message}`,
      );

      // Show code location
      if (error.code) {
        const codePreview = error.code.substring(0, 60).replace(/\n/g, " ");
        console.log(
          `      ${colors.gray}→ ${codePreview}${error.code.length > 60 ? "..." : ""}${colors.reset}`,
        );
      }

      if (error.suggestion && verbose) {
        console.log(
          `      ${colors.green}Suggestion: ${error.suggestion}${colors.reset}`,
        );
      }

      if (verbose) {
        console.log(`      ${colors.gray}Rule: ${error.ruleId}${colors.reset}`);
      }
    }
    console.log("");
  }
}

export function printDetailedReport(errors: ValidationError[]): void {
  const startTime = Date.now();
  const report = generateValidationReport(errors, 0);
  report.duration = Date.now() - startTime;

  console.log("\n  Rynex Validation Report");
  console.log("  " + "=".repeat(50));
  console.log(`  Timestamp: ${report.timestamp}`);
  console.log(`  Duration: ${report.duration}ms`);
  console.log(
    `  Total Issues: ${report.totalErrors + report.totalWarnings + report.totalInfos}`,
  );
  console.log(`  Errors: ${report.totalErrors}`);
  console.log(`  Warnings: ${report.totalWarnings}`);
  console.log(`  Infos: ${report.totalInfos}`);
  console.log("  " + "=".repeat(50));

  if (Object.keys(report.errorsByFile).length > 0) {
    console.log("\n  By File:");
    for (const [file, fileErrors] of Object.entries(report.errorsByFile)) {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`    ${relativePath}: ${fileErrors.length} issue(s)`);
    }
  }

  if (Object.keys(report.errorsByRule).length > 0) {
    console.log("\n  By Rule:");
    for (const [rule, ruleErrors] of Object.entries(report.errorsByRule)) {
      console.log(`    ${rule}: ${ruleErrors.length} occurrence(s)`);
    }
  }

  console.log("\n");
}

export function clearValidationCache(): void {
  validationCache.clear();
}

export function getValidationStats(
  projectRoot: string,
  config: Partial<ValidatorConfig> = {},
): any {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const context: ValidationContext = {
    config: finalConfig,
    cache: validationCache,
    stats: {
      filesChecked: 0,
      functionsValidated: 0,
      errorsFound: 0,
      warningsFound: 0,
    },
  };

  const srcDir = path.join(projectRoot, "src");
  if (!fs.existsSync(srcDir)) {
    return context.stats;
  }

  const files = getAllTypeScriptFiles(srcDir);
  for (const file of files) {
    validateFile(file, context);
    context.stats.filesChecked++;
  }

  return context.stats;
}

export function runRynexValidation(
  projectRoot: string,
  options: {
    verbose?: boolean;
    detailed?: boolean;
    config?: Partial<ValidatorConfig>;
  } = {},
): boolean {
  const startTime = Date.now();
  console.log("\n  Running Rynex validation...\n");

  const errors = validateRynexCode(projectRoot, options.config);
  const duration = Date.now() - startTime;

  if (options.detailed) {
    printDetailedReport(errors);
  } else {
    printValidationErrors(errors, options.verbose);
  }

  console.log(`  Validation completed in ${duration}ms\n`);

  return errors.filter((e) => e.severity === "error").length === 0;
}
