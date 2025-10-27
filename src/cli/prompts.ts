/**
 * Interactive CLI Prompts
 * Minimal, colorful prompts for Rynex CLI
 */

import * as readline from "readline";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",

  // Colors
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  gray: "\x1b[90m",

  // Backgrounds
  bgGreen: "\x1b[42m",
  bgCyan: "\x1b[46m",
};

/**
 * Create readline interface
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question and get input
 */
function ask(question: string): Promise<string> {
  const rl = createInterface();

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Select from a list of options
 */
export async function select(
  message: string,
  choices: Array<{ value: string; label: string; description?: string }>,
  defaultValue?: string,
): Promise<string> {
  console.log(
    `\n${colors.cyan}${colors.bright}?${colors.reset} ${colors.bright}${message}${colors.reset}\n`,
  );

  choices.forEach((choice, index) => {
    const isDefault = choice.value === defaultValue;
    const prefix = isDefault ? `${colors.green}>${colors.reset}` : " ";
    const label = isDefault
      ? `${colors.cyan}${choice.label}${colors.reset}`
      : `${colors.gray}${choice.label}${colors.reset}`;
    const desc = choice.description
      ? `${colors.dim} - ${choice.description}${colors.reset}`
      : "";

    console.log(
      `${prefix} ${colors.gray}${index + 1}.${colors.reset} ${label}${desc}`,
    );
  });

  console.log();
  const answer = await ask(
    `${colors.gray}Enter choice (1-${choices.length})${colors.reset} ${colors.dim}[${choices.findIndex((c) => c.value === defaultValue) + 1}]${colors.reset}: `,
  );

  if (!answer && defaultValue) {
    return defaultValue;
  }

  const index = parseInt(answer) - 1;
  if (index >= 0 && index < choices.length) {
    return choices[index].value;
  }

  return defaultValue || choices[0].value;
}

/**
 * Confirm yes/no question
 */
export async function confirm(
  message: string,
  defaultValue: boolean = true,
): Promise<boolean> {
  const defaultText = defaultValue ? "Y/n" : "y/N";
  const answer = await ask(
    `${colors.cyan}?${colors.reset} ${colors.bright}${message}${colors.reset} ${colors.dim}(${defaultText})${colors.reset}: `,
  );

  if (!answer) {
    return defaultValue;
  }

  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
}

/**
 * Text input
 */
export async function input(
  message: string,
  defaultValue?: string,
): Promise<string> {
  const defaultText = defaultValue
    ? `${colors.dim}(${defaultValue})${colors.reset}`
    : "";
  const answer = await ask(
    `${colors.cyan}?${colors.reset} ${colors.bright}${message}${colors.reset} ${defaultText}: `,
  );

  return answer || defaultValue || "";
}

/**
 * Display success message
 */
export function success(message: string): void {
  console.log(`${colors.green}[OK]${colors.reset} ${message}`);
}

/**
 * Display info message
 */
export function info(message: string): void {
  console.log(`${colors.cyan}ℹ${colors.reset} ${message}`);
}

/**
 * Display warning message
 */
export function warn(message: string): void {
  console.log(`${colors.yellow}[WARN]${colors.reset} ${message}`);
}

/**
 * Display error message
 */
export function error(message: string): void {
  console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

/**
 * Display welcome banner
 */
export function banner(): void {
  console.log();
  console.log(
    `${colors.green}${colors.bright}╔═══════════════════════════════════════╗${colors.reset}`,
  );
  console.log(
    `${colors.green}${colors.bright}║${colors.reset}  ${colors.cyan}${colors.bright}Create Rynex App${colors.reset}                  ${colors.green}${colors.bright}║${colors.reset}`,
  );
  console.log(
    `${colors.green}${colors.bright}╚═══════════════════════════════════════╝${colors.reset}`,
  );
  console.log();
}

/**
 * Display next steps
 */
export function nextSteps(projectName: string, useTypeScript: boolean): void {
  console.log();
  console.log(
    `${colors.green}${colors.bright}Success!${colors.reset} Created ${colors.cyan}${projectName}${colors.reset}`,
  );
  console.log();
  console.log(`${colors.bright}Next steps:${colors.reset}`);
  console.log();
  console.log(
    `  ${colors.gray}1.${colors.reset} ${colors.cyan}cd ${projectName}${colors.reset}`,
  );
  console.log(
    `  ${colors.gray}2.${colors.reset} ${colors.cyan}npm install${colors.reset} ${colors.dim}(or pnpm install)${colors.reset}`,
  );
  console.log(
    `  ${colors.gray}3.${colors.reset} ${colors.cyan}npm run dev${colors.reset}`,
  );
  console.log();
  console.log(`${colors.dim}Happy coding!${colors.reset}`);
  console.log();
}
